const express = require('express');
const router = express.Router();
const { register ,login} = require('../controllers/authController');

// אם ניצור בעתיד קובץ ולידציה, ניתן לייבא אותו כך:
// const { validateRegister } = require('../middlewares/authValidator');

// POST /api/auth/register
router.post('/register', register); 
router.post('/login', login);
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'התנתקת בהצלחה' });
});

module.exports = router;