const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getPendingUsers,
    approveUserAndFund,
    createMessage,
    getBusinessRecommendations,
    getPendingBusinesses,
    approveBusiness,
    getSystemTransactions,
    loadBalanceToUser,
    getAllActiveUsers,
    loadBalanceToAllActiveUsers
} = require('../repositories/adminRepository');

const loginAdmin = async (req, res, next) => {
    const { password } = req.body;

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'סיסמה שגויה' });
    }

    // הנפקת טוקן שמזהה את המשתמש הזה כמנהל
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie('admin_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000 // 12 שעות
    });

    res.status(200).json({ success: true, message: 'התחברת בהצלחה כמנהל' });
};

const fetchPendingUsers = async (req, res, next) => {
    try {
        const users = await getPendingUsers();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

const approveUser = async (req, res, next) => {
    const { userId, initialAmount } = req.body;

    if (!userId || initialAmount === undefined) {
        return res.status(400).json({ success: false, message: 'חסרים נתונים לאישור המשתמש' });
    }

    try {
        await approveUserAndFund(userId, initialAmount);
        res.status(200).json({ success: true, message: 'המשתמש אושר ותוקצב בהצלחה' });
    } catch (err) {
        next(err);
    }
};

const sendMessage = async (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'חובה להזין כותרת ותוכן להודעה' });
    }
    try {
        await createMessage(title, content);
        res.status(201).json({ success: true, message: 'ההודעה נשלחה בהצלחה לכל המשתמשים' });
    } catch (err) {
        next(err);
    }
};

const fetchRecommendations = async (req, res, next) => {
    try {
        const requests = await getBusinessRecommendations();
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        next(err);
    }
};


const fetchPendingBusinesses = async (req, res, next) => {
    try {
        const businesses = await getPendingBusinesses();
        res.status(200).json({ success: true, data: businesses });
    } catch (err) {
        next(err);
    }
};

const approveBusinessHandler = async (req, res, next) => {
    const { businessId } = req.body;

    if (!businessId) {
        return res.status(400).json({ success: false, message: 'חסר מזהה עסק' });
    }

    try {
        await approveBusiness(businessId);
        res.status(200).json({ success: true, message: 'העסק אושר בהצלחה ומופיע כעת באתר' });
    } catch (err) {
        next(err);
    }
};

const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await getSystemTransactions();
        res.status(200).json({ success: true, data: transactions });
    } catch (err) { next(err); }
};

const loadUserBalance = async (req, res, next) => {
    const { userId, amount, description } = req.body;
    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'נתונים חסרים או סכום לא תקין' });
    }
    try {
        await loadBalanceToUser(userId, amount, description || 'הטענת יתרה על ידי הנהלה');
        res.status(200).json({ success: true, message: 'היתרה נטענה בהצלחה' });
    } catch (err) { next(err); }
};

const getActiveUsersList = async (req, res, next) => {
    try {
        const users = await getAllActiveUsers();
        res.status(200).json({ success: true, data: users });
    } catch (err) { 
        next(err); 
    }
};

const loadBalanceAll = async (req, res, next) => {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'סכום לא תקין' });
    }
    
    try {
        const count = await loadBalanceToAllActiveUsers(amount, description || 'מענק הנהלה קולקטיבי');
        res.status(200).json({ success: true, message: `היתרה נטענה בהצלחה ל-${count} משתמשים פעילים!` });
    } catch (err) { 
        next(err); 
    }
};

module.exports = {
    fetchPendingUsers,
    approveUser,
    loginAdmin,
    sendMessage,
    fetchRecommendations,
    fetchPendingBusinesses,
    approveBusinessHandler,
    getAllTransactions,
    loadUserBalance,
    getActiveUsersList,
    loadBalanceAll
};