import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Train, Download, ArrowLeft } from 'lucide-react';




const TrainConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    navigate('/train');
    return null;
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadTicket = () => {
    // In a real application, this would generate a PDF ticket
    alert('Ticket download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Success Message */}
          <div className="p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-200">Your train ticket has been successfully booked.</p>
          </div>

          {/* Ticket Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Journey Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Journey Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{booking.schedule.from}</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{booking.schedule.to}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">
                          {formatDate(booking.schedule.departureTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">
                          {formatTime(booking.schedule.departureTime)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Train className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{booking.schedule.trainType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="text-gray-800 font-medium">{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class</span>
                      <span className="text-gray-800 font-medium">{booking.bookingData.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers</span>
                      <span className="text-gray-800 font-medium">{booking.bookingData.passengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-gray-800 font-bold">LKR {booking.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Ticket</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <QRCode
                      value={JSON.stringify({
                        bookingId: booking.id,
                        from: booking.schedule.from,
                        to: booking.schedule.to,
                        date: booking.schedule.departureTime,
                        trainType: booking.schedule.trainType,
                        class: booking.bookingData.class,
                        passengers: booking.bookingData.passengers
                      })}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Show this QR code at the station for scanning
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleDownloadTicket}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Ticket
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/train')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Search
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainConfirmation; 