const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a review
// @route   POST /api/reviews/:productId
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment,
    });
    await review.save();
    // Optionally update product rating/numReviews
    const product = await Product.findById(req.params.productId);
    if (product) {
      const reviews = await Review.find({ product: product._id });
      product.numReviews = reviews.length;
      product.ratings = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      await product.save();
    }
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};
