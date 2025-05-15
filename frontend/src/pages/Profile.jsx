import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  History, 
  Clock, 
  MapPin, 
  Bus, 
  Train, 
  Download, 
  AlertCircle,
  ChevronRight,
  Calendar,
  Shield,
  Phone,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [bookings, setBookings] = useState([]);
  const [trainBookings, setTrainBookings] = useState([]);

  useEffect(() => {
    // Load user details from localStorage
    const savedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (savedUserDetails) {
      setUserDetails(savedUserDetails);
    }

    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    setBookings(savedBookings);

    // Load train bookings from localStorage
    const savedTrainBookings = JSON.parse(localStorage.getItem('trainBookings') || '[]');
    setTrainBookings(savedTrainBookings);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Save user details to localStorage
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTrainBookings = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Train Bookings</h2>
      {trainBookings.length === 0 ? (
        <p className="text-gray-600">No train bookings found.</p>
      ) : (
        <div className="space-y-4">
          {trainBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{booking.schedule.from}</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{booking.schedule.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.schedule.departureTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(booking.schedule.departureTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Train className="h-4 w-4" />
                    <span>{booking.schedule.trainType}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Booking ID: {booking.id}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Class: {booking.bookingData.class}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Passengers: {booking.bookingData.passengers}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  LKR {booking.total.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button
                  onClick={() => navigate('/train/confirmation', { state: { booking } })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  View Ticket
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={userDetails.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={userDetails.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <input
                      type="text"
                      name="nic"
                      value={userDetails.nic}
                      onChange={handleInputChange}
                      placeholder="NIC"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {userDetails.firstName} {userDetails.lastName}
                      </h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-white/90">{userDetails.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {userDetails.phone}
                      </div>
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        {userDetails.nic}
                      </div>
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Member since {new Date(userDetails.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg shadow-inner">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-purple-50'
              }`}
            >
              <History className="w-5 h-5" />
              Booking History
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`flex-1 py-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'refunds'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-blue-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Refunds
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {activeTab === 'bookings' ? (
              <div>
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-bold text-neutral-800">Booking History</h2>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Bus className="w-12 h-12 text-purple-600" />
                    </div>
                    <p className="text-neutral-600 mb-4">You haven't made any bookings yet</p>
                    <button
                      onClick={() => navigate('/bus')}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Book a Bus Now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => navigate(`/bus/booking/${booking.id}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${getStatusColor(booking.status)}`}>
                                <Bus className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-neutral-800">
                                  {booking.from} → {booking.to}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                  {booking.date} • {booking.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-blue-600">
                                  LKR {booking.price.toLocaleString()}
                                </p>
                                <span className={`text-xs ${getStatusColor(booking.status)} px-2 py-1 rounded-full`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-bold text-neutral-800">Refund History</h2>
                </div>
                {bookings.filter(booking => booking.refundStatus).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-12 h-12 text-blue-600" />
                    </div>
                    <p className="text-neutral-600">No refund requests found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {bookings
                      .filter(booking => booking.refundStatus)
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-neutral-800">
                                Booking #{booking.id}
                              </h3>
                              <p className="text-sm text-neutral-500">
                                {booking.from} → {booking.to} • {booking.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium text-blue-600">
                                  LKR {booking.price.toLocaleString()}
                                </p>
                                <span className={`text-xs ${getRefundStatusColor(booking.refundStatus)} px-2 py-1 rounded-full`}>
                                  Refund {booking.refundStatus}
                                </span>
                              </div>
                              <button
                                onClick={() => navigate(`/bus/booking/${booking.id}`)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                Details
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {renderTrainBookings()}
        </div>
      </div>
    </div>
  );
};

export default Profile; 