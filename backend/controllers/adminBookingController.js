const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const { BookingError, todayInColombo, conflictFilter } = require('../utils/bookingRules');

const transitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

function validRental(booking) {
  return booking.startDate instanceof Date && booking.endDate instanceof Date &&
    Number.isFinite(booking.startDate.getTime()) && Number.isFinite(booking.endDate.getTime()) &&
    booking.endDate > booking.startDate;
}

exports.updateBookingStatus = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') throw new BookingError(403, 'Admin only.');
    if (!/^[a-f\d]{24}$/i.test(req.params.id || '')) throw new BookingError(400, 'Invalid booking ID.');
    const { status, expectedStatus } = req.body || {};
    if (!['confirmed', 'completed', 'cancelled'].includes(status)) throw new BookingError(400, 'Invalid target status.');
    if (typeof expectedStatus !== 'string' || !Object.hasOwn(transitions, expectedStatus)) throw new BookingError(400, 'The current booking status is required. Refresh and try again.');

    const initial = await Booking.findById(req.params.id).select('product');
    if (!initial) throw new BookingError(404, 'Booking not found.');

    await mongoose.connection.transaction(async (session) => {
      // Same product write lock as booking creation: changes remain safe across processes.
      const product = await Product.findOneAndUpdate(
        { _id: initial.product }, { $inc: { bookingRevision: 1 } },
        { returnDocument: 'after', session, timestamps: false }
      );
      const booking = await Booking.findById(req.params.id).session(session);
      if (!booking) throw new BookingError(404, 'Booking not found.');
      if (String(booking.product) !== String(initial.product)) throw new BookingError(409, 'Booking details changed. Refresh and try again.');
      if (booking.status !== expectedStatus) throw new BookingError(409, 'Another action changed this booking. Refresh the list.');
      if (!transitions[booking.status]?.includes(status)) throw new BookingError(409, 'This status change is not allowed.');

      if (status !== 'cancelled') {
        if (!product) throw new BookingError(409, 'This equipment was deleted. Cancel this booking instead.');
        if (!['rent', 'buy'].includes(booking.type) || !Number.isFinite(booking.totalPrice) || booking.totalPrice <= 0) {
          throw new BookingError(409, 'This older booking has invalid details. Cancel it and create a valid booking.');
        }
        if (booking.type === 'rent' && !validRental(booking)) {
          throw new BookingError(409, 'This booking has invalid rental dates. Cancel it and create a valid booking.');
        }
      }

      if (status === 'confirmed') {
        const allowedTypes = booking.type === 'rent' ? ['rent', 'both'] : ['sell', 'both'];
        if (!product.available || !allowedTypes.includes(product.type)) throw new BookingError(409, 'This equipment is no longer available for this booking type.');
        const filter = conflictFilter({
          productId: String(booking.product), type: booking.type,
          startDate: booking.startDate, endDate: booking.endDate,
        });
        const conflict = await Booking.exists({ ...filter, _id: { $ne: booking._id } }).session(session);
        if (conflict) throw new BookingError(409, 'Another reservation conflicts with this booking. Review the bookings before confirming.');
      }

      if (status === 'completed' && booking.type === 'rent' &&
          booking.endDate.toISOString().slice(0, 10) > todayInColombo()) {
        throw new BookingError(409, 'A rental can be completed on or after its return date.');
      }

      const updated = await Booking.findOneAndUpdate(
        { _id: booking._id, status: expectedStatus }, { $set: { status } },
        { returnDocument: 'after', runValidators: true, session }
      );
      if (!updated) throw new BookingError(409, 'Booking status changed. Refresh and try again.');

      if (status === 'completed' && booking.type === 'buy') {
        await Product.updateOne({ _id: product._id }, { $set: { available: false } }, { session });
      }
    }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }, readPreference: 'primary' });

    const booking = await Booking.findById(req.params.id)
      .populate('product', 'name image').populate('user', 'name email');
    res.json({ message: 'Booking status updated.', booking });
  } catch (error) {
    if (error instanceof BookingError) return res.status(error.status).json({ message: error.message });
    if (error.name === 'CastError' || error.name === 'ValidationError') return res.status(400).json({ message: 'Invalid booking data.' });
    console.error('Admin booking update failed:', error.name || 'Error', error.code || '');
    res.status(503).json({ message: 'Unable to update this booking. Refresh the list and try again.' });
  }
};
