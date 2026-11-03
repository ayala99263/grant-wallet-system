const nodemailer = require('nodemailer');
// ייבוא הפונקציה לטיפול במסד הנתונים שניצור ב-Repository
const { generateCouponAndCharge } = require('../repositories/couponRepository');
const { getUserEmail } = require('../repositories/userRepository');

const claimGrantCoupon = async (req, res, next) => {
    const { businessId, amount, businessName } = req.body;
    const userId = req.user.userId;

    try {
        // 1. שליפת המייל לפני תחילת הטרנזקציה
        const userEmail = await getUserEmail(userId);

        // 2. הגדרת חיבור המייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. אריזת שליחת המייל לתוך פונקציה שנעביר למסד הנתונים
        const sendEmailCallback = async (couponCode) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: `הקופון שלך ל-${businessName} מוכן!`,
                html: `
                    <div style="direction: rtl; font-family: Arial; text-align: center;">
                        <h2>איזה כיף! המענק שלך מוכן.</h2>
                        <p>ניתן להציג קוד זה בקופה אצל <strong>${businessName}</strong> ולממש את המענק על סך ₪${amount}:</p>
                        <div style="background: #f4f4f4; padding: 20px; font-size: 28px; font-weight: bold; border-radius: 8px; letter-spacing: 3px; display: inline-block;">
                            ${couponCode}
                        </div>
                    </div>
                `
            };
            // הפקודה הזו תזרוק שגיאה אם השליחה נכשלת (כמו שקרה לך)
            await transporter.sendMail(mailOptions);
        };

        // 4. קריאה לפונקציית יצירת הקופון עם פונקציית המייל כפרמטר!
        await generateCouponAndCharge(userId, businessId, businessName, amount, sendEmailCallback);
        res.status(200).json({ success: true, message: 'הקופון הופק ונשלח למייל שלך בהצלחה!' });
    } catch (err) {
        if (err.message === 'אין מספיק יתרה בארנק') {
            return res.status(400).json({ success: false, message: err.message });
        }
        // במידה והשליחה למייל נכשלה, נשלח הודעה למשתמש
        res.status(500).json({ success: false, message: 'תקלה בשליחת הקופון למייל. היתרה לא חויבה.' });
    }
};


module.exports = { claimGrantCoupon };