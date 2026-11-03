const bcrypt = require('bcrypt');
const { findUserByIdOrEmail, registerNewUser ,getUserForLogin} = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  // 1. שליפת כל השדות המעודכנים מהבקשה
  const { 
    firstName, lastName, idNumber, birthDate, 
    city, street, houseNumber, email, phone, 
    occupation, additionalOccupation, 
    spouseName, spouseIdNumber, spouseOccupation, 
    password 
  } = req.body;

  // ==========================================
  // 2. ולידציה בצד השרת (Server-side Validation)
  // ==========================================
  
  // א. בדיקת נוכחות שדות חובה
  if (!firstName || !lastName || !idNumber || !birthDate || !city || !street || !houseNumber || !email || !phone || !occupation || !password) {
    return res.status(400).json({ success: false, message: 'חסרים שדות חובה להרשמה' });
  }

  // ב. ולידציה לתעודת זהות (וגם של בן/בת הזוג אם הוזן)
  const idRegex = /^\d{9}$/;
  if (!idRegex.test(idNumber)) {
    return res.status(400).json({ success: false, message: 'תעודת זהות חייבת להכיל 9 ספרות בדיוק' });
  }
  if (spouseIdNumber && !idRegex.test(spouseIdNumber)) {
    return res.status(400).json({ success: false, message: 'תעודת הזהות של בן/בת הזוג אינה תקינה' });
  }

  // ג. ולידציה לכתובת אימייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'כתובת האימייל אינה תקינה' });
  }

  // ==========================================
  // סיום שלב הולידציה - ממשיכים ללוגיקה העסקית
  // ==========================================

  try {
    // מניחים שהפונקציה הזו בודקת כעת לפי השדות המעודכנים
    const existingUser = await findUserByIdOrEmail(idNumber, email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'משתמש עם תעודת זהות או אימייל אלו כבר קיים במערכת' });
    }

    // הצפנת הסיסמה 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // קריאה לשכבת הנתונים לביצוע הטרנזקציה, כולל כל הנתונים החדשים
    await registerNewUser({ 
      firstName, lastName, idNumber, birthDate, 
      city, street, houseNumber, email, phone, 
      occupation, additionalOccupation, 
      spouseName, spouseIdNumber, spouseOccupation, 
      hashedPassword 
    });

    return res.status(201).json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה. חשבונך ממתין לאישור ההנהלה.'
    });
  } catch (err) {
    next(err);
  }
};



const login = async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'נא להזין תעודת זהות/אימייל וסיסמה' });
  }

  try {
    const user = await getUserForLogin(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'פרטי ההתחברות שגויים' });
    }

    // חסימת כניסה למשתמשים שטרם אושרו
    if (user.status === 'pending') {
      return res.status(403).json({ success: false, message: 'חשבונך עדיין ממתין לאישור ההנהלה' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'פרטי ההתחברות שגויים' });
    }

    // יצירת טוקן (יש לוודא שמוגדר JWT_SECRET בקובץ ה-.env)
    const token = jwt.sign(
      { userId: user.user_id, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'התחברת בהצלחה',
      user: { name: `${user.first_name} ${user.last_name}` }
    });

  } catch (err) {
    next(err);
  }
};



module.exports = { register, login };