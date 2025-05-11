const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('bus')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('bus');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { busId, seats, paymentMethod } = req.body;

    // Get bus
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check if seats are available
    if (!bus.hasAvailableSeats(seats.length)) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      bus: busId,
      seats,
      totalAmount: bus.price * seats.length,
      paymentMethod
    });

    // Update bus seats
    await bus.updateAvailableSeats(seats.length, true);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('bus');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Process refund
    const refundAmount = await booking.processRefund();

    // Update bus seats
    await booking.bus.updateAvailableSeats(booking.seats.length, false);

    res.status(200).json({
      success: true,
      data: {
        booking,
        refundAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('bus')
      .populate('user', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 