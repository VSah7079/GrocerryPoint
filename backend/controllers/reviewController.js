const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment
  });
  res.status(201).json(review);
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
}; 