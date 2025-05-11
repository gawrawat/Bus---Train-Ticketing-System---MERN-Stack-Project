const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  operator: {
    name: {
      type: String,
      required: [true, 'Operator name is required']
    },
    contact: {
      type: String,
      required: [true, 'Operator contact is required']
    }
  },
  busType: {
    type: String,
    required: [true, 'Bus type is required'],
    enum: ['Highway Bus', 'Intercity', 'Semi Luxury', 'Normal Coaches']
  },
  from: {
    type: String,
    required: [true, 'Departure location is required']
  },
  to: {
    type: String,
    required: [true, 'Arrival location is required']
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Bus must have at least 1 seat']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats cannot be negative']
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  amenities: [{
    type: String,
    enum: ['AC', 'WiFi', 'USB Charging', 'Reclining Seats', 'Toilet', 'Snacks']
  }]
}, {
  timestamps: true
});

// Virtual for duration
busSchema.virtual('duration').get(function() {
  return this.arrivalTime - this.departureTime;
});

// Method to check if seats are available
busSchema.methods.hasAvailableSeats = function(seats) {
  return this.availableSeats >= seats;
};

// Method to update available seats
busSchema.methods.updateAvailableSeats = function(seats, isBooking = true) {
  if (isBooking) {
    if (!this.hasAvailableSeats(seats)) {
      throw new Error('Not enough seats available');
    }
    this.availableSeats -= seats;
  } else {
    this.availableSeats += seats;
  }
  return this.save();
};

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus; 