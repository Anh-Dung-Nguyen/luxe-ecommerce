const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isVerified } = require('../middlewares/verifiedMiddleware');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');

router.use(protect, isVerified);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;