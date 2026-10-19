const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user.id, product: req.params.productId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating,
      comment
    });

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};