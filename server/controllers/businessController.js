const bcrypt = require('bcrypt');
const { registerNewBusiness } = require('../repositories/businessRepository');

const registerBusiness = async (req, res, next) => {
    // 1. שליפת כל השדות שהגיעו מה-Frontend
    const {
        businessName, companyId, email, password,
        phone, websiteUrl, logoUrl, category, description,
        grantAmount, grantUnits
    } = req.body;

    // 2. בדיקת שדות חובה - כאן נזרקת השגיאה 400 אם משהו חסר
    if (!businessName || !companyId || !email || !password || !phone || !grantAmount || !grantUnits) {
        return res.status(400).json({ success: false, message: "חסרים שדות חובה להרשמת עסק" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. אריזת הנתונים לאובייקטים לפי מבנה ה-Repository
        const businessData = {
            businessName,
            companyId,
            email,
            passwordHash: hashedPassword, 
            phone,
            websiteUrl: websiteUrl || null,
            logoUrl: logoUrl || null,
            category,
            description: description || null
        };

        const grantData = {
            amount: parseFloat(grantAmount),
            units: parseInt(grantUnits, 10)
        };

        // 4. הפעלת הפונקציה שיוצרת את העסק והמענק בטרנזקציה אחת
        await registerNewBusiness(businessData, grantData);
        
        res.status(201).json({ success: true, message: 'בקשת ההצטרפות נשלחה בהצלחה' });
    } catch (err) {
        // טיפול בשגיאות כפילות (למשל אם האימייל או הח.פ כבר קיימים במערכת)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'אימייל או ח.פ כבר רשומים במערכת' });
        }
        next(err);
    }
};

const { getActiveBusinesses } = require('../repositories/businessRepository');

const fetchActiveBusinesses = async (req, res, next) => {
    try {
        const businesses = await getActiveBusinesses();
        res.status(200).json({ success: true, data: businesses });
    } catch (err) {
        next(err);
    }
};


module.exports = { registerBusiness, fetchActiveBusinesses };