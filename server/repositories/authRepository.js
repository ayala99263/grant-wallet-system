const pool = require('../db/db');

const findUserByIdOrEmail = async (idNumber, email) => {
  const [rows] = await pool.query(
    'SELECT user_id FROM Users WHERE id_number = ? OR email = ?',
    [idNumber, email]
  );
  return rows[0] || null;
};

const registerNewUser = async (userData) => {
  // חילוץ הנתונים מהאובייקט שהועבר
  const { 
    firstName, lastName, idNumber, birthDate, 
    city, street, houseNumber, email, phone, 
    occupation, additionalOccupation, 
    spouseName, spouseIdNumber, spouseOccupation, 
    hashedPassword 
  } = userData;
  
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. יצירת המשתמש בסטטוס ממתין (עם כל השדות החדשים)
    const insertUserQuery = `
      INSERT INTO Users (
        first_name, last_name, id_number, birth_date, 
        city, street, house_number, email, phone, 
        occupation, additional_occupation, 
        spouse_name, spouse_id_number, spouse_occupation, 
        password, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    // סידור הערכים במערך בדיוק לפי הסדר של השאילתה למעלה
    const [userResult] = await connection.query(insertUserQuery, [
      firstName, lastName, idNumber, birthDate, 
      city, street, houseNumber, email, phone, 
      occupation, additionalOccupation || null, // אם אין ערך נכניס NULL 
      spouseName || null, spouseIdNumber || null, spouseOccupation || null, 
      hashedPassword
    ]);

    await connection.commit();
    return userResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getUserForLogin = async (identifier) => {
  const [rows] = await pool.query(
    'SELECT * FROM Users WHERE id_number = ? OR email = ?',
    [identifier, identifier]
  );
  return rows[0] || null;
};



module.exports = { findUserByIdOrEmail, registerNewUser, getUserForLogin };