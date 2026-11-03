const { getUserDashboardData, submitBusinessRequest } = require('../repositories/userRepository');

const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const data = await getUserDashboardData(userId);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const requestBusiness = async (req, res, next) => {
    const { businessName, businessIdentifier, recommendation } = req.body;
    const userId = req.user.userId; // נלקח ישירות מהטוקן המאובטח

    if (!businessName || !recommendation) {
        return res.status(400).json({ success: false, message: 'יש להזין שם עסק והמלצה' });
    }

    try {
        await submitBusinessRequest(userId, businessName, businessIdentifier, recommendation);
        res.status(201).json({ success: true, message: 'הבקשה נשלחה להנהלה בהצלחה. תודה על ההמלצה!' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboard, requestBusiness };