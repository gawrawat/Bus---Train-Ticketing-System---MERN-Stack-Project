const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required']
  },
  seats: [{
    type: Number,
    required: [true, 'Seat numbers are required']
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash'],
    required: [true, 'Payment method is required']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected'],
    default: 'none'
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for booking reference
bookingSchema.virtual('bookingReference').get(function() {
  return `BUS${this._id.toString().slice(-6).toUpperCase()}`;
});

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const departureTime = this.bus.departureTime;
  const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);

  if (hoursUntilDeparture > 24) {
    return this.totalAmount; // Full refund if more than 24 hours before departure
  } else if (hoursUntilDeparture > 12) {
    return this.totalAmount * 0.5; // 50% refund if between 12-24 hours before departure
  } else {
    return 0; // No refund if less than 12 hours before departure
  }
};

// Method to process refund
bookingSchema.methods.processRefund = async function() {
  if (this.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  const refundAmount = this.calculateRefund();
  if (refundAmount > 0) {
    this.refundAmount = refundAmount;
    this.refundStatus = 'approved';
    this.paymentStatus = 'refunded';
    this.status = 'cancelled';
    await this.save();
    return refundAmount;
  } else {
    this.refundStatus = 'rejected';
    await this.save();
    throw new Error('Refund not possible - too close to departure time');
  }
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 