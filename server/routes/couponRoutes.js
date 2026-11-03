const express = require('express');
const router = express.Router();
const { claimGrantCoupon } = require('../controllers/couponController');
const { requireAuth } = require('../middlewares/authMiddleware');

// הנתיב שמקבל בקשה לייצור קופון - חובה להיות מחובר
router.post('/claim', requireAuth, claimGrantCoupon);

module.exports = router;