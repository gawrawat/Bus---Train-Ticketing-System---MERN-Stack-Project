import React, { useState } from 'react';
import { Clock, Wifi, Snowflake, Coffee, Luggage, Star, ChevronDown, ChevronUp, Filter, ArrowUpDown } from 'lucide-react';
import { busTypes } from '../../data/busData';

const BusSearchResults = ({ schedules, onSelect }) => {
  const [sortBy, setSortBy] = useState('departure');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    amenities: [],
    timeRange: 'all'
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (departure, arrival) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'WiFi':
        return <Wifi className="h-4 w-4" />;
      case 'Air Conditioning':
        return <Snowflake className="h-4 w-4" />;
      case 'Onboard Entertainment':
        return <Coffee className="h-4 w-4" />;
      case 'Luggage Space':
        return <Luggage className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return new Date(a.arrivalTime) - new Date(a.departureTime) - 
               (new Date(b.arrivalTime) - new Date(b.departureTime));
      case 'departure':
      default:
        return new Date(a.departureTime) - new Date(b.departureTime);
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters and Sort Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <span className="text-sm text-neutral-500">
              {schedules.length} buses found
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="departure">Departure Time</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Price Range (LKR)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                    placeholder="Min"
                  />
                  <span className="text-neutral-400">-</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Time Range
                </label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                >
                  <option value="all">All Day</option>
                  <option value="morning">Morning (5AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 10PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {['WiFi', 'Air Conditioning', 'Onboard Entertainment', 'Luggage Space'].map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-sm cursor-pointer hover:bg-blue-50 hover:border-blue-200">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter(a => a !== amenity);
                          setFilters({...filters, amenities: newAmenities});
                        }}
                        className="rounded text-blue-600 focus:ring-blue-400"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bus Cards */}
      <div className="grid grid-cols-1 gap-4">
        {sortedSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left Section - Operator & Bus Type */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={schedule.operator.logo}
                      alt={schedule.operator.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {schedule.operator.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{schedule.operator.rating}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {busTypes[schedule.busType].name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                        {schedule.busClass}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Time & Duration */}
                <div className="flex-1 flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-neutral-800">
                      {formatTime(schedule.departureTime)}
                    </div>
                    <div className="text-sm text-neutral-500">Departure</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-neutral-500">
                      {formatDuration(schedule.departureTime, schedule.arrivalTime)}
                    </div>
                    <div className="w-24 h-0.5 bg-neutral-200 my-2"></div>
                    <div className="text-xs text-neutral-400">Direct</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-semibold text-neutral-800">
                      {formatTime(schedule.arrivalTime)}
                    </div>
                    <div className="text-sm text-neutral-500">Arrival</div>
                  </div>
                </div>

                {/* Right Section - Price & Booking */}
                <div className="flex flex-col items-end justify-between min-w-[200px]">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-800">
                      LKR {schedule.price}
                    </div>
                    <div className="text-sm text-green-600">
                      Save LKR {schedule.price - schedule.discountedPrice}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="text-sm text-neutral-500 whitespace-nowrap">
                      {schedule.availableSeats} seats left
                    </div>
                    <button
                      onClick={() => onSelect(schedule)}
                      className="w-[120px] px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Amenities */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <div className="flex flex-wrap items-center gap-4">
                  {schedule.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1.5 text-sm text-neutral-600"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusSearchResults; 