const express = require('express');
const router = express.Router();
const { getDashboard, requestBusiness } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

// כל הנתיבים כאן מוגנים ודורשים התחברות
router.get('/dashboard', requireAuth, getDashboard);
router.post('/request-business', requireAuth, requestBusiness);

module.exports = router;