const express = require('express');
const router = express.Router();
const {
  getBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus,
  updateBusSeats
} = require('../controllers/bus');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getBuses)
  .post(protect, authorize('admin'), createBus);

router.route('/:id')
  .get(getBus)
  .put(protect, authorize('admin'), updateBus)
  .delete(protect, authorize('admin'), deleteBus);

router.route('/:id/seats')
  .put(protect, updateBusSeats);

module.exports = router; 