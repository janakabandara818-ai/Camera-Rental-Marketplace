const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['rent', 'buy'], required: true },
  startDate: { type: Date, required: function () { return this.type === 'rent'; } },
  endDate: { type: Date, required: function () { return this.type === 'rent'; } },
  totalPrice: { type: Number, required: true, validate: {
    validator: value => Number.isFinite(value) && value > 0,
    message: 'Booking total must be positive.',
  } },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  requestId: { type: String, maxlength: 128 },
}, { timestamps: true });

bookingSchema.pre('validate', function () {
  if (this.type === 'rent' && this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after the start date.');
  }
});

bookingSchema.index({ product: 1, type: 1, status: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ user: 1, requestId: 1 }, {
  unique: true,
  partialFilterExpression: { requestId: { $type: 'string' } },
});

module.exports = mongoose.model('Booking', bookingSchema);
