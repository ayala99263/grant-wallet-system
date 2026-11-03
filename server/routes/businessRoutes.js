const express = require('express');
const router = express.Router();
const { registerBusiness ,fetchActiveBusinesses} = require('../controllers/businessController');

router.post('/register', registerBusiness);
router.get('/public', fetchActiveBusinesses);

module.exports = router;