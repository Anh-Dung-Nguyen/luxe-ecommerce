const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin, isSeller } = require('../middlewares/roleMiddleware');
const { createReview, getProductReviews, approveReview, getAllReviews, deleteReview, reportReview, createReviewVulnerableEasy, createReviewVulnerableMedium } = require('../controllers/reviewController');

router.get('/', protect, isAdmin, getAllReviews);
router.post('/vulnerable-easy', protect, createReviewVulnerableEasy);
router.post('/vulnerable-medium', protect, createReviewVulnerableMedium);
router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id/approve', protect, isAdmin, approveReview);
router.delete('/:id', protect, isAdmin, deleteReview);
router.put('/:id/report', protect, isSeller, reportReview);

module.exports = router;