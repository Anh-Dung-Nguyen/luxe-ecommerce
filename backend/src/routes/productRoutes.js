const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { isSeller } = require('../middlewares/roleMiddleware');
const { isVerified } = require('../middlewares/verifiedMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProductsVulnerableEasy, searchProductsVulnerableMedium } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', protect, isVerified, isSeller, createProduct);
router.get('/search-vulnerable-easy', searchProductsVulnerableEasy);
router.get('/search-vulnerable-medium', searchProductsVulnerableMedium);
router.get('/:id', getProductById);
router.put('/:id', protect, isVerified, isSeller, updateProduct);
router.delete('/:id', protect, isVerified, isSeller, deleteProduct);

module.exports = router;