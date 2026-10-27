const mongoose = require('mongoose');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { InputError, isId, bodyObject, text, sendError } = require('../utils/inputValidation');

const fields = ['name', 'description', 'category', 'type', 'rentPrice', 'sellPrice', 'image', 'available'];
function validateFields(body) {
  bodyObject(body);
  if (Object.keys(body).some(key => !fields.includes(key))) throw new InputError(400, 'Unexpected product fields.');
}
function price(value, label) {
  if (typeof value !== 'number' && typeof value !== 'string') throw new InputError(400, `${label} is required.`);
  if (typeof value === 'string' && !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) throw new InputError(400, `${label} must be a positive amount with at most 2 decimal places.`);
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(Math.round(amount * 100)) || Number(amount.toFixed(2)) !== amount) throw new InputError(400, `${label} must be positive with at most 2 decimal places.`);
  return Math.round(amount * 100) / 100;
}
function productData(body) {
  const result = { name: text(body.name, 'Name', 1, 150), description: text(body.description, 'Description', 1, 5000) };
  if (!['camera', 'lens', 'lighting', 'accessory'].includes(body.category)) throw new InputError(400, 'Invalid product category.');
  if (!['rent', 'sell', 'both'].includes(body.type)) throw new InputError(400, 'Invalid product type.');
  result.category = body.category;
  result.type = body.type;
  if (body.type !== 'sell') result.rentPrice = price(body.rentPrice, 'Daily rental price');
  if (body.type !== 'rent') result.sellPrice = price(body.sellPrice, 'Purchase price');
  result.available = body.available === undefined ? true : body.available;
  if (typeof result.available !== 'boolean') throw new InputError(400, 'Availability must be true or false.');
  result.image = body.image === undefined ? '' : body.image;
  if (typeof result.image !== 'string' || result.image.length > 2048) throw new InputError(400, 'Invalid image URL.');
  result.image = result.image.trim();
  if (result.image && !/^\/products\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(result.image)) {
    try { if (new URL(result.image).protocol !== 'https:') throw new Error(); }
    catch { throw new InputError(400, 'Use an HTTPS image URL or a local /products/ image path.'); }
  }
  return result;
}

exports.getProducts = async (req, res) => {
  try { res.json(await Product.find()); } catch (error) { sendError(res, error); }
};
exports.getProduct = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new InputError(400, 'Invalid product ID.');
    const product = await Product.findById(req.params.id);
    if (!product) throw new InputError(404, 'Product not found.');
    res.json(product);
  } catch (error) { sendError(res, error); }
};
exports.createProduct = async (req, res) => {
  try { validateFields(req.body); res.status(201).json(await Product.create(productData(req.body))); }
  catch (error) { sendError(res, error); }
};
exports.updateProduct = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new InputError(400, 'Invalid product ID.');
    validateFields(req.body);
    const product = await mongoose.connection.transaction(async (session) => {
      const existing = await Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { bookingRevision: 1 } }, { session, returnDocument: 'after', timestamps: false });
      if (!existing) throw new InputError(404, 'Product not found.');
      const data = productData({ ...existing.toObject(), ...req.body });
      if (data.available && await Booking.exists({ product: existing._id, type: 'buy', status: 'completed' }).session(session)) throw new InputError(409, 'Sold equipment cannot be marked available again.');
      const update = { $set: data };
      if (data.type === 'rent') update.$unset = { sellPrice: 1 };
      if (data.type === 'sell') update.$unset = { rentPrice: 1 };
      return Product.findByIdAndUpdate(existing._id, update, { session, returnDocument: 'after', runValidators: true });
    });
    res.json(product);
  } catch (error) { sendError(res, error); }
};
exports.deleteProduct = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new InputError(400, 'Invalid product ID.');
    await mongoose.connection.transaction(async (session) => {
      const product = await Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { bookingRevision: 1 } }, { session, timestamps: false });
      if (!product) throw new InputError(404, 'Product not found.');
      const booked = await Booking.exists({ product: product._id }).session(session);
      const reviewed = await Review.exists({ product: product._id }).session(session);
      if (booked || reviewed) throw new InputError(409, 'This equipment has booking or review history. Mark it unavailable instead of deleting it.');
      await Product.deleteOne({ _id: product._id }, { session });
    });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) { sendError(res, error); }
};
