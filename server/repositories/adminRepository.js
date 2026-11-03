const pool = require('../db/db');

// שליפת כל המשתמשים בסטטוס ממתין
const getPendingUsers = async () => {
    const [rows] = await pool.query(`
        SELECT user_id, first_name, last_name, id_number, birth_date,
               city, street, house_number, email, phone,
               occupation, additional_occupation,
               spouse_name, spouse_id_number, spouse_occupation, created_at
        FROM Users
        WHERE status = 'pending'
    `);
    return rows;
};

// טרנזקציית אישור והפקדה
const approveUserAndFund = async (userId, initialAmount) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. עדכון סטטוס המשתמש לפעיל
        await connection.query(
            `UPDATE Users SET status = 'active' WHERE user_id = ?`,
            [userId]
        );

        // 2. רישום הזיכוי בספר התנועות
        await connection.query(
            `INSERT INTO Transactions (user_id, amount, type, source, description) 
             VALUES (?, ?, 'load', 'admin', 'מענק הצטרפות ראשוני')`,
            [userId, initialAmount]
        );

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// יצירת הודעת מערכת חדשה
const createMessage = async (title, content) => {
    const [result] = await pool.query(
        `INSERT INTO AdminMessages (title, content) VALUES (?, ?)`,
        [title, content]
    );
    return result.insertId;
};

// שליפת כל ההמלצות על עסקים (כולל פרטי המשתמש הממליץ)
const getBusinessRecommendations = async () => {
    const [rows] = await pool.query(`
        SELECT br.*, CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.email 
        FROM BusinessRequests br
        JOIN Users u ON br.user_id = u.user_id
        ORDER BY br.created_at DESC
    `);
    return rows;
};

const getPendingBusinesses = async () => {
    const [rows] = await pool.query(`
        SELECT b.*, bg.grant_amount, bg.total_units 
        FROM Businesses b
        LEFT JOIN BusinessGrants bg ON b.business_id = bg.business_id
        WHERE b.status = 'pending'
    `);
    return rows;
};

// אישור עסק (שינוי סטטוס לפעיל)
const approveBusiness = async (businessId) => {
    const [result] = await pool.query(
        `UPDATE Businesses SET status = 'active' WHERE business_id = ?`,
        [businessId]
    );
    return result.affectedRows > 0;
};

// 1. שליפת כל התנועות במערכת עבור לוח הבקרה של המנהל
const getSystemTransactions = async () => {
    // השתמשנו ב-JOIN כדי להביא גם את שם המשתמש שעשה את הפעולה
    const [rows] = await pool.query(`
        SELECT t.*, CONCAT(u.first_name, ' ', u.last_name) AS full_name 
        FROM Transactions t 
        JOIN Users u ON t.user_id = u.user_id 
        ORDER BY t.created_at DESC 
        LIMIT 100
    `);
    return rows;
};

// 2. טעינת יתרה מאובטחת למשתמש (טרנזקציה)
const loadBalanceToUser = async (userId, amount, description) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            `INSERT INTO Transactions (user_id, amount, type, source, description) 
             VALUES (?, ?, 'load', 'admin', ?)`,
            [userId, amount, description]
        );

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getAllActiveUsers = async () => {
    const [rows] = await pool.query(`
        SELECT user_id, first_name, last_name, id_number, birth_date,
               city, street, house_number, email, phone,
               occupation, additional_occupation,
               spouse_name, spouse_id_number, spouse_occupation, created_at
        FROM Users 
        WHERE status = 'active'
    `);
    return rows;
};

const loadBalanceToAllActiveUsers = async (amount, description) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. שליפת כל מזהי המשתמשים הפעילים
        const [activeUsers] = await connection.query(`SELECT user_id FROM Users WHERE status = 'active'`);
        
        if (activeUsers.length === 0) {
            throw new Error('אין משתמשים פעילים במערכת');
        }

        // 2. הכנת מערך נתונים להכנסה גורפת (Bulk Insert) לטבלת התנועות
        const transactionValues = activeUsers.map(user => [
            user.user_id, 
            amount, 
            'load', 
            'admin', 
            description
        ]);

        // הכנסת כל התנועות במכה אחת
        await connection.query(
            `INSERT INTO Transactions (user_id, amount, type, source, description) VALUES ?`,
            [transactionValues]
        );

        await connection.commit();
        return activeUsers.length; // מחזירים כמה משתמשים עודכנו

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { getPendingUsers, approveUserAndFund, createMessage, getBusinessRecommendations, getPendingBusinesses, approveBusiness, getSystemTransactions, loadBalanceToUser, getAllActiveUsers, loadBalanceToAllActiveUsers };