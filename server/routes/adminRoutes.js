const express = require('express');
const router = express.Router();
const { loginAdmin,
    fetchPendingUsers,
    approveUser,
    sendMessage,
    fetchRecommendations,
    fetchPendingBusinesses,
    approveBusinessHandler,
    getAllTransactions,
    loadUserBalance,
    getActiveUsersList,
    loadBalanceAll
} = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.post('/login', loginAdmin); // נתיב פתוח כדי לאפשר למנהל להכניס סיסמה

// נתיבים מוגנים - רק מי שעבר את requireAdmin יגיע אליהם
router.get('/pending-users', requireAdmin, fetchPendingUsers);
router.post('/approve-user', requireAdmin, approveUser);
router.post('/messages', requireAdmin, sendMessage);
router.get('/business-requests', requireAdmin, fetchRecommendations);
router.get('/pending-businesses', requireAdmin, fetchPendingBusinesses);
router.post('/approve-business', requireAdmin, approveBusinessHandler);
router.get('/transactions', requireAdmin, getAllTransactions);
router.post('/load-balance', requireAdmin, loadUserBalance);
router.get('/active-users', requireAdmin, getActiveUsersList);
router.get('/all-users', requireAdmin, getActiveUsersList);
router.post('/load-balance-all', requireAdmin, loadBalanceAll);

module.exports = router;