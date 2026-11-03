const pool = require('../db/db');

const registerNewBusiness = async (businessData, grantData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. שמירת העסק (סטטוס ממתין כברירת מחדל)
        // בתוך הפונקציה registerNewBusiness, עדכני את שאילתת ה-INSERT של העסק:
        const [bizResult] = await connection.query(
            `INSERT INTO Businesses (business_name, company_id, email, password_hash, phone, website_url, logo_url, category, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                businessData.businessName,
                businessData.companyId,
                businessData.email,
                businessData.passwordHash,
                businessData.phone,
                businessData.websiteUrl,
                businessData.logoUrl, // הוספת הלוגו למערך הנתונים
                businessData.category,
                businessData.description
            ]
        );

        const newBusinessId = bizResult.insertId;

        // 2. שמירת המענק שהעסק מקצה
        await connection.query(
            `INSERT INTO BusinessGrants (business_id, grant_amount, total_units) VALUES (?, ?, ?)`,
            [newBusinessId, grantData.amount, grantData.units]
        );

        await connection.commit();
        return newBusinessId;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const getActiveBusinesses = async () => {
    // השתמשנו ב-LEFT JOIN כדי לחבר את נתוני העסק עם נתוני המענק שלו מאותה שורה
    const [rows] = await pool.query(`
        SELECT 
            b.business_id, 
            b.business_name, 
            b.description, 
            b.website_url, 
            b.logo_url, 
            b.category,
            bg.grant_amount,
            bg.total_units,
            bg.used_units
        FROM Businesses b
        LEFT JOIN BusinessGrants bg ON b.business_id = bg.business_id
        WHERE b.status = 'active'
    `);
    return rows;
};

module.exports = { registerNewBusiness, getActiveBusinesses };