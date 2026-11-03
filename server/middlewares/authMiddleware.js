const jwt = require('jsonwebtoken');

// 1. שומר בסיסי - מוודא שהמשתמש/העסק מחובר
const requireAuth = (req, res, next) => {
    const token = req.cookies.token; // הטוקן הרגיל שהנפקנו בהתחברות

    if (!token) {
        return res.status(401).json({ success: false, message: 'גישה נדחתה: עליך להתחבר תחילה' });
    }

    try {
        // פענוח הטוקן וחילוץ פרטי המשתמש
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // שתילת הנתונים המפוענחים בתוך הבקשה כדי שהקונטרולר יוכל להשתמש בהם
        req.user = decoded; 
        next(); // מעבר לפונקציה הבאה (הקונטרולר)
    } catch (err) {
        return res.status(401).json({ success: false, message: 'הטוקן פג תוקף או שגוי, אנא התחבר מחדש' });
    }
};

// 2. שומר הנהלה - מאפשר גישה רק למנהל
const requireAdmin = (req, res, next) => {
    const adminToken = req.cookies.admin_token;

    if (!adminToken) {
        return res.status(401).json({ success: false, message: 'גישה נדחתה: חסרה הרשאת מנהל' });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'גישה נדחתה: אינך מנהל' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'פג תוקף התחברות המנהל' });
    }
};

module.exports = { requireAuth, requireAdmin };