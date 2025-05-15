import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Shield, ChevronLeft, ChevronDown, AlertTriangle } from 'lucide-react';
import BusTicket from '../components/bus/BusTicket';
import { getRushDateNotification } from '../utils/rushDateUtils';

const BusBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const schedule = location.state?.schedule;

  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: '',
    seatCount: 1,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    termsAccepted: false
  });

  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Generate seat layout with improved visual representation
  useEffect(() => {
    const generateSeatLayout = () => {
      const rows = 8;
      const seatsPerRow = 4;
      const newSeats = [];
      
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= seatsPerRow; col++) {
          const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
          newSeats.push({
            id: seatNumber,
            number: seatNumber,
            isAvailable: Math.random() > 0.3,
            isSelected: false,
            type: col <= 2 ? 'window' : 'aisle'
          });
        }
      }
      return newSeats;
    };

    setSeats(generateSeatLayout());
  }, []);

  const handleSeatSelection = (seatId) => {
    const updatedSeats = seats.map(seat => {
      if (seat.id === seatId) {
        if (!seat.isAvailable) return seat;
        
        // If seat is already selected, deselect it
        if (seat.isSelected) {
          setSelectedSeats(prev => prev.filter(id => id !== seatId));
          return { ...seat, isSelected: false };
        }
        
        // If trying to select more seats than allowed
        if (selectedSeats.length >= bookingData.seatCount) {
          alert(`You can only select ${bookingData.seatCount} seat(s)`);
          return seat;
        }
        
        // Select the seat
        setSelectedSeats(prev => [...prev, seatId]);
        return { ...seat, isSelected: true };
      }
      return seat;
    });

    setSeats(updatedSeats);
  };

  const handleSeatCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setBookingData(prev => ({ ...prev, seatCount: newCount }));
    
    // If new count is less than current selections, remove excess selections
    if (newCount < selectedSeats.length) {
      const updatedSeats = seats.map(seat => ({
        ...seat,
        isSelected: selectedSeats.slice(0, newCount).includes(seat.id)
      }));
      setSeats(updatedSeats);
      setSelectedSeats(selectedSeats.slice(0, newCount));
    }
  };

  // Validation functions
  const validateNIC = (nic) => {
    return /^[0-9]{12}$/.test(nic);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/[\s-]/g, '');
    return /^\d{16}$/.test(cleanNumber);
  };

  const validateExpiry = (expiry) => {
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry);
  };

  const validateCVC = (cvc) => {
    return /^\d{3}$/.test(cvc);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'phone':
        formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'nic':
        formattedValue = value.replace(/[^0-9]/g, '').slice(0, 12);
        break;
      case 'cardNumber':
        formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
        break;
      case 'cardExpiry':
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 2) {
          formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
        }
        break;
      case 'cardCVC':
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      default:
        formattedValue = value;
    }

    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!bookingData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(bookingData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!bookingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(bookingData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!bookingData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!validateNIC(bookingData.nic)) {
      newErrors.nic = 'NIC must be 12 digits';
    }

    if (bookingData.paymentMethod === 'card') {
      if (!validateCardNumber(bookingData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number (16 digits)';
      }
      if (!validateExpiry(bookingData.cardExpiry)) {
        newErrors.cardExpiry = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!validateCVC(bookingData.cardCVC)) {
        newErrors.cardCVC = 'Please enter a valid CVC (3 digits)';
      }
    }

    if (!bookingData.termsAccepted) {
      newErrors.termsAccepted = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (selectedSeats.length !== bookingData.seatCount) {
        alert(`Please select ${bookingData.seatCount} seat(s)`);
        return;
      }
      setStep(2);
    } else {
      if (!validateForm()) {
        return;
      }

      // Create new booking object
      const newBooking = {
        id: `BUS${Date.now()}`,
        type: 'bus',
        from: schedule.from,
        to: schedule.to,
        date: new Date(schedule.departureTime).toLocaleDateString(),
        time: new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed',
        seats: selectedSeats,
        price: schedule.price * selectedSeats.length,
        operator: schedule.operator.name,
        busType: schedule.busType,
        refundStatus: null,
        passengerDetails: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          nic: bookingData.nic
        }
      };

      // Get existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
      // Add new booking
      const updatedBookings = [newBooking, ...existingBookings];
      
      // Save to localStorage
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

      // Show confirmation
      setIsBookingConfirmed(true);
    }
  };

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800">Invalid Booking</h1>
            <p className="mt-2 text-neutral-600">Please select a bus schedule first.</p>
            <button
              onClick={() => navigate('/bus')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Bus Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isBookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800">Booking Confirmed!</h1>
            <p className="text-neutral-600 mt-2">
              Your bus ticket has been confirmed. You can download or print your ticket below.
            </p>
          </div>

          <BusTicket
            bookingData={bookingData}
            schedule={schedule}
            selectedSeats={selectedSeats}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
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

          {/* Booking Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div 
                    className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-neutral-400'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step >= stepNumber 
                        ? 'border-blue-600 bg-gradient-to-br from-blue-500 to-purple-500 text-white' 
                        : 'border-neutral-300'
                    }`}>
                      {stepNumber}
                    </div>
                    <span className="ml-3 font-medium hidden sm:inline">
                      {stepNumber === 1 ? 'Select Seats' : 'Passenger Details'}
                    </span>
                  </div>
                  {stepNumber < 2 && (
                    <div className="flex-1 h-0.5 mx-4 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Journey Summary Card */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
                  <img
                    src={schedule.operator.logo}
                    alt={schedule.operator.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-800">{schedule.operator.name}</h3>
                  <p className="text-sm text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full inline-block">
                    {schedule.busType}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LKR {schedule.price * bookingData.seatCount}
                </div>
                <div className="text-sm text-neutral-500">{bookingData.seatCount} seat(s)</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Departure - Arrival</p>
                  <p className="font-medium text-neutral-700">
                    {new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Duration</p>
                  <p className="font-medium text-neutral-700">{schedule.duration}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              // Step 1: Seat Selection
              <div 
                className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() => navigate('/bus')}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-blue-600 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back to Search
                  </button>
                  <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                    <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">1</span>
                    Select Your Seats
                  </h2>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Number of Seats
                  </label>
                  <div className="relative">
                    <select
                      name="seatCount"
                      value={bookingData.seatCount}
                      onChange={handleSeatCountChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'seat' : 'seats'}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-neutral-700">Seat Map</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-100 to-purple-100"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="w-4 h-4 rounded bg-neutral-300"></div>
                        <span>Booked</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bus visualization */}
                  <div className="mb-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg relative">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                    <div className="text-center text-xs text-neutral-500 mb-4">Front</div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {seats.map(seat => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => handleSeatSelection(seat.id)}
                          disabled={!seat.isAvailable}
                          className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                            !seat.isAvailable
                              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-white border-2 hover:border-blue-400 shadow-sm'
                          }`}
                          title={!seat.isAvailable ? 'Already booked' : seat.type === 'window' ? 'Window seat' : 'Aisle seat'}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-sm text-neutral-600">
                    Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={selectedSeats.length !== bookingData.seatCount}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      selectedSeats.length === bookingData.seatCount
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    Continue to Passenger Details
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Passenger Details
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center">2</span>
                  Passenger Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={bookingData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-neutral-200'
                      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={bookingData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-neutral-200'
                      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-neutral-200'
                      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="XXXXXXXXXX"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-neutral-200'
                      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      NIC Number
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={bookingData.nic}
                      onChange={handleInputChange}
                      required
                      placeholder="XXXXXXXXXX"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.nic ? 'border-red-500' : 'border-neutral-200'
                      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                    />
                    {errors.nic && (
                      <p className="mt-1 text-sm text-red-500">{errors.nic}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-6">Payment Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={bookingData.cardNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength="19"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.cardNumber ? 'border-red-500' : 'border-neutral-200'
                        } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={bookingData.cardExpiry}
                          onChange={handleInputChange}
                          required
                          placeholder="MM/YY"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.cardExpiry ? 'border-red-500' : 'border-neutral-200'
                          } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                        />
                        {errors.cardExpiry && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cardCVC"
                          value={bookingData.cardCVC}
                          onChange={handleInputChange}
                          required
                          placeholder="XXX"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.cardCVC ? 'border-red-500' : 'border-neutral-200'
                          } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                        />
                        {errors.cardCVC && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardCVC}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={bookingData.termsAccepted}
                      onChange={handleInputChange}
                      required
                      className="rounded text-blue-600 focus:ring-blue-400"
                    />
                    <span className="text-sm text-neutral-600">
                      I agree to the terms and conditions and confirm that all details provided are correct
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-500">{errors.termsAccepted}</p>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Back to Seat Selection
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;