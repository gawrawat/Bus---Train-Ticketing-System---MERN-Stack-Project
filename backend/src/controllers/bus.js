const Bus = require('../models/Bus');

// @desc    Get all buses
// @route   GET /api/bus
// @access  Public
exports.getBuses = async (req, res) => {
  try {
    const { from, to, date, type } = req.query;
    const query = {};

    if (from) query.from = from;
    if (to) query.to = to;
    if (type) query.busType = type;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: startDate, $lte: endDate };
    }

    const buses = await Bus.find(query).sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single bus
// @route   GET /api/bus/:id
// @access  Public
exports.getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new bus
// @route   POST /api/bus
// @access  Private/Admin
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update bus
// @route   PUT /api/bus/:id
// @access  Private/Admin
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete bus
// @route   DELETE /api/bus/:id
// @access  Private/Admin
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update bus seats
// @route   PUT /api/bus/:id/seats
// @access  Private
exports.updateBusSeats = async (req, res) => {
  try {
    const { seats, isBooking } = req.body;
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    await bus.updateAvailableSeats(seats, isBooking);

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 