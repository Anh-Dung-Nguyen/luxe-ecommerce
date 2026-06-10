const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdminOrSeller } = require('../middlewares/roleMiddleware');
const couponController = require('../controllers/couponController');

router.get('/validate/:code', protect, couponController.validateCoupon);
router.get('/', protect, isAdminOrSeller, couponController.getCoupons);
router.post('/', protect, isAdminOrSeller, couponController.createCoupon);
router.patch('/:id/toggle', protect, isAdminOrSeller, couponController.toggleCoupon);

module.exports = router;