const pool = require('../db/db');

const getUserDashboardData = async (userId) => {
    // שליפת היתרה מהארנק
    const [walletRows] = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) AS balance FROM Transactions WHERE user_id = ?',
        [userId]
    );
    
    // שליפת הודעות מערכת אחרונות
    const [messages] = await pool.query('SELECT title, content, created_at FROM AdminMessages ORDER BY created_at DESC LIMIT 5');
    
    // ---- חדש: שליפת 5 התנועות האחרונות של הלקוח ----
    const [transactions] = await pool.query(
        `SELECT amount, type, source, description, created_at 
         FROM Transactions 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 5`, 
        [userId]
    );

    return {
        balance: walletRows[0]?.balance || 0,
        messages: messages,
        transactions: transactions // עכשיו זה מחזיר נתוני אמת!
    };
};

const submitBusinessRequest = async (userId, businessName, businessIdentifier, recommendation) => {
    const [result] = await pool.query(
        `INSERT INTO BusinessRequests (user_id, business_name, business_identifier, recommendation) 
         VALUES (?, ?, ?, ?)`,
        [userId, businessName, businessIdentifier, recommendation]
    );
    return result.insertId;
};

const getUserEmail = async (userId) => {
    const [rows] = await pool.query('SELECT email FROM Users WHERE user_id = ?', [userId]);
    
    if (!rows.length) {
        throw new Error('משתמש לא נמצא');
    }
    
    return rows[0].email;
};

module.exports = { getUserDashboardData, submitBusinessRequest , getUserEmail };