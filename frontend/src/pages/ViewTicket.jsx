import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusTicket from '../components/bus/BusTicket';

const ViewTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Load user details from localStorage
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    
    // Load booking from localStorage
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const foundBooking = bookings.find(b => b.id === id);
    
    if (foundBooking) {
      // Convert booking data to match BusTicket component props
      const bookingData = {
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        nic: userDetails.nic || ''
      };

      const schedule = {
        from: foundBooking.from,
        to: foundBooking.to,
        departureTime: new Date(`${foundBooking.date} ${foundBooking.time}`).toISOString(),
        arrivalTime: new Date(`${foundBooking.date} ${foundBooking.time}`).toISOString(), // This should be calculated
        operator: {
          name: foundBooking.operator,
          logo: '/path/to/operator/logo.png' // This should come from operator data
        },
        busType: foundBooking.busType,
        price: foundBooking.price / foundBooking.seats.length
      };

      setBooking({
        bookingData,
        schedule,
        selectedSeats: foundBooking.seats
      });
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800">Ticket Not Found</h1>
            <p className="mt-2 text-neutral-600">The requested ticket could not be found.</p>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
        </div>
        <BusTicket
          bookingData={booking.bookingData}
          schedule={booking.schedule}
          selectedSeats={booking.selectedSeats}
        />
      </div>
    </div>
  );
};

export default ViewTicket; 