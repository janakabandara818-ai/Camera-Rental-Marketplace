const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { InputError, isId, bodyObject, text, sendError } = require('../utils/inputValidation');

exports.addReview = async (req, res) => {
  try {
    if (!isId(req.params.productId)) throw new InputError(400, 'Invalid product ID.');
    const body = bodyObject(req.body);
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) throw new InputError(400, 'Rating must be a whole number from 1 to 5.');
    const comment = text(body.comment, 'Comment', 1, 2000);
    // Serialize review creation for this product so parallel requests cannot bypass
    // the one-review-per-user check. No new unique index on legacy data is needed.
    const reviewId = await mongoose.connection.transaction(async (session) => {
      const product = await Product.findOneAndUpdate({ _id: req.params.productId }, { $inc: { bookingRevision: 1 } }, { session, timestamps: false });
      if (!product) throw new InputError(404, 'Product not found.');
      const existing = await Review.exists({ user: req.user.id, product: req.params.productId }).session(session);
      if (existing) throw new InputError(409, 'You have already reviewed this product.');
      const [review] = await Review.create([{ user: req.user.id, product: req.params.productId, rating: body.rating, comment }], { session });
      return review._id;
    });
    const review = await Review.findById(reviewId).populate('user', 'name');
    res.status(201).json(review);
  } catch (error) { sendError(res, error); }
};

exports.getProductReviews = async (req, res) => {
  try {
    if (!isId(req.params.productId)) throw new InputError(400, 'Invalid product ID.');
    if (!(await Product.exists({ _id: req.params.productId }))) throw new InputError(404, 'Product not found.');
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
    const avgRating = reviews.length ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0;
    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
  } catch (error) { sendError(res, error); }
};

exports.deleteReview = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new InputError(400, 'Invalid review ID.');
    const review = await Review.findById(req.params.id);
    if (!review) throw new InputError(404, 'Review not found.');
    if (req.user.role !== 'admin' && String(review.user) !== req.user.id) throw new InputError(403, 'You can only delete your own reviews.');
    const filter = req.user.role === 'admin' ? { _id: review._id } : { _id: review._id, user: req.user.id };
    const deleted = await Review.findOneAndDelete(filter);
    if (!deleted) throw new InputError(404, 'Review no longer exists.');
    res.json({ message: 'Review deleted.' });
  } catch (error) { sendError(res, error); }
};
