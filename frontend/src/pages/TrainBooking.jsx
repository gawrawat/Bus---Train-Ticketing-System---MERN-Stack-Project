import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Train, Users, CreditCard, User, Mail, Phone, AlertTriangle } from 'lucide-react';
import { getRushDateNotification } from '../utils/rushDateUtils';

const TrainBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock schedule data if none is provided
  const schedule = location.state?.schedule || {
    from: 'Colombo Fort',
    to: 'Kandy',
    departureTime: new Date().toISOString(),
    trainType: 'EXPRESS',
    price: 500,
    duration: 180 // 3 hours in minutes
  };

  const [bookingData, setBookingData] = useState({
    passengers: 1,
    class: 'SECOND', // SECOND, FIRST, SLEEPER
    paymentMethod: 'CARD',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [rushDateNotification, setRushDateNotification] = useState(null);

  // Check for rush date when schedule changes
  useEffect(() => {
    if (schedule) {
      const notification = getRushDateNotification(
        new Date(schedule.departureTime).toISOString().split('T')[0],
        schedule.from,
        schedule.to
      );
      setRushDateNotification(notification);
    }
  }, [schedule]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateTotal = () => {
    const basePrice = schedule.price;
    const classMultiplier = {
      'SECOND': 1,
      'FIRST': 1.5,
      'SLEEPER': 2
    };
    return basePrice * bookingData.passengers * classMultiplier[bookingData.class];
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const booking = {
        id: `T${Math.random().toString(36).substr(2, 9)}`,
        schedule,
        bookingData,
        total: calculateTotal(),
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString(),
        user: 'user123' // Mock user ID
      };

      // Store booking in localStorage
      const bookings = JSON.parse(localStorage.getItem('trainBookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('trainBookings', JSON.stringify(bookings));

      navigate('/train/confirmation', { state: { booking } });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Rush Date Notification */}
        {rushDateNotification && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 mb-1">High Demand Alert</h3>
                <p className="text-sm text-yellow-700 whitespace-pre-line">
                  {rushDateNotification.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Journey Summary */}
          <div className="p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Journey Summary</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-300" />
                <span className="text-gray-200">{schedule.from}</span>
              </div>
              <div className="flex-1 h-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-300" />
                <span className="text-gray-200">{schedule.to}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-300" />
                <span className="text-gray-200">
                  {new Date(schedule.departureTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-300" />
                <span className="text-gray-200">
                  {formatTime(schedule.departureTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-gray-300" />
                <span className="text-gray-200">{schedule.trainType}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="p-6 space-y-6">
            {/* Passenger Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Passenger Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Passengers
                  </label>
                  <select
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({ ...bookingData, passengers: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={bookingData.class}
                    onChange={(e) => setBookingData({ ...bookingData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    <option value="SECOND">Second Class</option>
                    <option value="FIRST">First Class</option>
                    <option value="SLEEPER">Sleeper Class</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={bookingData.cardNumber}
                    onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.cardName}
                    onChange={(e) => setBookingData({ ...bookingData, cardName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={bookingData.expiryDate}
                    onChange={(e) => setBookingData({ ...bookingData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={bookingData.cvv}
                    onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value })}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">LKR {calculateTotal()}</p>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainBooking; 