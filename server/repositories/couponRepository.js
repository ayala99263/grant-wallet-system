const pool = require('../db/db');
const crypto = require('crypto');

// הוספנו את businessName כפרמטר השלישי
const generateCouponAndCharge = async (userId, businessId, businessName, amount, sendEmailCallback) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const [balanceRows] = await connection.query(
            `SELECT COALESCE(SUM(amount), 0) AS balance FROM Transactions WHERE user_id = ? FOR UPDATE`,
            [userId]
        );
        
        const currentBalance = parseFloat(balanceRows[0].balance);
        const requestedAmount = parseFloat(amount);

        if (currentBalance < requestedAmount) {
            throw new Error('אין מספיק יתרה בארנק');
        }

        const [grantRows] = await connection.query(
            `SELECT total_units, used_units FROM BusinessGrants WHERE business_id = ? FOR UPDATE`,
            [businessId]
        );

        if (!grantRows.length || grantRows[0].used_units >= grantRows[0].total_units) {
            throw new Error('לא נותרו מענקים זמינים לעסק זה');
        }

const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
        const couponCode = `GW-${randomString}`;

        await connection.query(
            `INSERT INTO Coupons (coupon_code, user_id, business_id, amount, status) 
             VALUES (?, ?, ?, ?, 'active')`,
            [couponCode, userId, businessId, requestedAmount]
        );

        await connection.query(
            `UPDATE BusinessGrants SET used_units = used_units + 1 WHERE business_id = ?`,
            [businessId]
        );

        await connection.query(
            `INSERT INTO Transactions (user_id, amount, type, source, description, reference_id) 
             VALUES (?, ?, 'redeem', 'website', ?, ?)`,
            [
                userId, 
                -requestedAmount,
                `מימוש מענק בעסק "${businessName}"`, // הטקסט שיופיע ביומן התנועות
                couponCode 
            ]
        );

        await sendEmailCallback(couponCode);

        await connection.commit();
        return couponCode;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { generateCouponAndCharge };