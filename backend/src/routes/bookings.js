const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
  getAllBookings
} = require('../controllers/booking');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/admin')
  .get(protect, authorize('admin'), getAllBookings);

router.route('/:id')
  .get(protect, getBooking);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

module.exports = router; 