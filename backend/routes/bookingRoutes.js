const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/all', protect, adminOnly, getAllBookings);
router.put('/cancel/:id', protect, cancelBooking);

module.exports = router;