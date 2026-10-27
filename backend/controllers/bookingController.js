const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const { BookingError, validateRequest, priceFor, sameRequest, conflictFilter } = require('../utils/bookingRules');

function sendError(res, error) {
  if (error instanceof BookingError) return res.status(error.status).json({ message: error.message });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Invalid booking data.' });
  // Do not expose connection strings, internal errors, or credentials.
  console.error('Booking operation failed:', error.name || 'Error', error.code || '');
  return res.status(503).json({ message: 'Booking service is temporarily unavailable. Check your bookings before retrying.' });
}

function replayResult(existing, request) {
  if (!sameRequest(existing, request)) throw new BookingError(409, 'This request ID was already used for different booking details.');
  return { booking: existing, replayed: true };
}

exports.createBooking = async (req, res) => {
  let request;
  try {
    request = validateRequest(req.body);
    // Ensure the partial unique request index exists before accepting requests.
    await Booking.init();
    const requestFilter = request.requestId ? { user: req.user.id, requestId: request.requestId } : null;
    if (requestFilter) {
      const existing = await Booking.findOne(requestFilter);
      if (existing) return res.status(200).json(replayResult(existing, request).booking);
    }

    const result = await mongoose.connection.transaction(async (session) => {
      // A real write, rather than a no-op, forces concurrent requests for this
      // product to conflict and retry with a fresh snapshot before checking dates.
      const product = await Product.findOneAndUpdate(
        { _id: request.productId },
        { $inc: { bookingRevision: 1 } },
        { returnDocument: 'after', session, timestamps: false }
      );
      if (!product) throw new BookingError(404, 'Product not found.');

      if (requestFilter) {
        const existing = await Booking.findOne(requestFilter).session(session);
        if (existing) return replayResult(existing, request);
      }

      const totalPrice = priceFor(product, request);
      const conflict = await Booking.exists(conflictFilter(request)).session(session);
      if (conflict) throw new BookingError(409, request.type === 'rent'
        ? 'This equipment is already reserved for the selected dates or for purchase. Choose other dates or equipment.'
        : 'This equipment already has an active reservation or has been sold.');

      const [booking] = await Booking.create([{
        user: req.user.id,
        product: request.productId,
        type: request.type,
        ...(request.type === 'rent' ? { startDate: request.startDate, endDate: request.endDate } : {}),
        totalPrice,
        status: 'pending',
        ...(request.requestId ? { requestId: request.requestId } : {}),
      }], { session });
      return { booking, replayed: false };
    }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }, readPreference: 'primary' });

    res.status(result.replayed ? 200 : 201).json(result.booking);
  } catch (error) {
    // Same idempotency key may race on different products; return only an exact replay.
    if (error.code === 11000 && request?.requestId) {
      try {
        const existing = await Booking.findOne({ user: req.user.id, requestId: request.requestId });
        if (existing) return res.status(200).json(replayResult(existing, request).booking);
      } catch (replayError) { return sendError(res, replayError); }
    }
    return sendError(res, error);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('product', 'name image rentPrice sellPrice category').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) { sendError(res, error); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('product', 'name image')
      .populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) { sendError(res, error); }
};

exports.cancelBooking = async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id || '')) throw new BookingError(400, 'Invalid booking ID.');
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new BookingError(404, 'Booking not found.');
    if (String(booking.user) !== String(req.user.id)) throw new BookingError(403, 'Not authorized to cancel this booking.');
    if (booking.status === 'cancelled') return res.json({ message: 'Booking already cancelled.', booking });
    if (!['pending', 'confirmed'].includes(booking.status)) throw new BookingError(409, 'This booking can no longer be cancelled.');

    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id, user: req.user.id, status: { $in: ['pending', 'confirmed'] } },
      { $set: { status: 'cancelled' } },
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) throw new BookingError(409, 'Booking status changed. Refresh your dashboard.');
    res.json({ message: 'Booking cancelled.', booking: updated });
  } catch (error) { sendError(res, error); }
};
