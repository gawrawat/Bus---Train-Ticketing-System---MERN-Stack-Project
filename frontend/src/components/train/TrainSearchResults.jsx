import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Train, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainSearchResults = ({ results }) => {
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBookNow = (schedule) => {
    navigate('/train/booking', { state: { schedule } });
  };

  return (
    <div className="space-y-4">
      {results.map((schedule) => (
        <motion.div
          key={schedule.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{schedule.from}</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{schedule.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(schedule.departureTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(schedule.departureTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Train className="h-4 w-4" />
                    <span>{schedule.trainType}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Available Seats: {schedule.availableSeats}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  LKR {schedule.price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <motion.button
                onClick={() => handleBookNow(schedule)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                Book Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrainSearchResults; 