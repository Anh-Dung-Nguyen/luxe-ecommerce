const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin, isSeller } = require('../middlewares/roleMiddleware');
const { getDashboardStats, getSellerStats } = require('../controllers/dashboardController');

router.get('/', protect, isAdmin, getDashboardStats);
router.get('/seller', protect, isSeller, getSellerStats);

module.exports = router;