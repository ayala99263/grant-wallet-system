const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// שכבות אבטחה גנריות
app.use(helmet()); // מגדיר HTTP Headers מאובטחים
app.use(cors({
    origin: 'http://localhost:5173', // כתובת ה-React (בסביבת פיתוח)
    credentials: true // מאפשר העברת עוגיות (Cookies) וטוקנים
}));
app.use(express.json());
app.use(cookieParser());


// הגבלת קצב בקשות למניעת התקפות Brute Force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// בדיקת תקינות בסיסית
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running securely' });
});

// חיבור ה-Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const businessRoutes = require('./routes/businessRoutes');
app.use('/api/businesses', businessRoutes);

app.use('/api/admin', require('./routes/adminRoutes'));
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const couponRoutes = require('./routes/couponRoutes');
app.use('/api/coupons', couponRoutes);

// שכבת ניהול שגיאות גנרית (חייבת להיות אחרונה)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
});