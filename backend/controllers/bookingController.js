const Booking = require('../models/Booking');
const Product = require('../models/Product');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { productId, type, startDate, endDate } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let totalPrice = 0;
    if (type === 'rent') {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      totalPrice = days * product.rentPrice;
    } else {
      totalPrice = product.sellPrice;
    }

    const booking = await Booking.create({
      user: req.user.id,
      product: productId,
      type,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('product', 'name image rentPrice sellPrice category');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('product', 'name image')
      .populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};