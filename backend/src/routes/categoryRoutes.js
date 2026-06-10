const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdminOrSeller, isSeller } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', protect, isSeller, upload.single('image'), createCategory);
router.delete('/:id', protect, isAdminOrSeller, deleteCategory);

module.exports = router;