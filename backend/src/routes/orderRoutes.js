const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isSeller, isAdminOrSeller } = require('../middlewares/roleMiddleware');
const { isVerified } = require('../middlewares/verifiedMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', protect, isVerified, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/my/:id', protect, orderController.getOrderById);
router.put('/my/:id/cancel', protect, orderController.cancelOrder);
router.get('/', protect, isAdminOrSeller, orderController.getAllOrders);
router.put('/:id/status', protect, isSeller, orderController.updateOrderStatus);

module.exports = router;