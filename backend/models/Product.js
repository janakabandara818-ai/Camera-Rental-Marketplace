const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['camera', 'lens', 'lighting', 'accessory'], required: true },
  type: { type: String, enum: ['rent', 'sell', 'both'], required: true },
  rentPrice: { type: Number },
  sellPrice: { type: Number },
  image: { type: String },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);