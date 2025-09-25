const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get all reviews for a product
router.get('/:productId', reviewController.getReviews);
// Add a review
router.post('/:productId', protect, reviewController.addReview);
// Delete a review
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
