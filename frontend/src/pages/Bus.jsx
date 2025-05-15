import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import herobg from '../assets/herobg.png';
import { Calendar, Search, ArrowRight, Info, MapPin, Clock, AlertTriangle } from 'lucide-react';
import BusSearchResults from '../components/bus/BusSearchResults';
import { busTypes, highwayRoutes, intercityRoutes, generateBusSchedules } from '../data/busData';
import { useNavigate } from 'react-router-dom';
import { getRushDateNotification } from '../utils/rushDateUtils';

const Bus = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  // Search state
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    busType: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [rushDateNotification, setRushDateNotification] = useState(null);

  // Get available cities based on bus type
  const getAvailableCities = () => {
    if (!searchData.busType) return [];
    
    let routes = [];
    if (searchData.busType === 'HIGHWAY') {
      routes = highwayRoutes;
    } else if (searchData.busType === 'INTERCITY') {
      routes = intercityRoutes;
    } else {
      routes = [...highwayRoutes, ...intercityRoutes];
    }
    
    const cities = new Set();
    routes.forEach(route => {
      cities.add(route.from);
      cities.add(route.to);
    });
    return Array.from(cities);
  };

  // Function to generate random points for route visualization
  const generateRoutePoints = (from, to) => {
    const points = [];
    const numPoints = 5;
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * 80 + 10, // Random x position (10-90%)
        y: Math.random() * 60 + 20, // Random y position (20-80%)
        delay: i * 0.2 // Staggered animation delay
      });
    }
    return points;
  };

  // Update route points when cities are selected
  useEffect(() => {
    if (searchData.from && searchData.to) {
      setRoutePoints(generateRoutePoints(searchData.from, searchData.to));
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }
  }, [searchData.from, searchData.to]);

  // Check for rush date when date or cities change
  useEffect(() => {
    if (searchData.date && (searchData.from || searchData.to)) {
      const notification = getRushDateNotification(
        searchData.date,
        searchData.from,
        searchData.to
      );
      setRushDateNotification(notification);
    } else {
      setRushDateNotification(null);
    }
  }, [searchData]);

  const handleSearch = () => {
    if (!searchData.from || !searchData.to || !searchData.date || !searchData.busType) {
      return;
    }

    setIsSearching(true);
    setShowResults(false);

    // Simulate API call
    setTimeout(() => {
      try {
        const results = generateBusSchedules(
          searchData.from,
          searchData.to,
          searchData.date,
          searchData.busType
        );
        
        if (results && results.length > 0) {
          setSearchResults(results);
          setShowResults(true);
        } else {
          alert('No buses found for the selected route and date.');
        }
      } catch (error) {
        console.error('Error generating bus schedules:', error);
        alert('An error occurred while searching for buses. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 1500);
  };

  const handleBusSelect = (schedule) => {
    navigate('/bus/booking', { state: { schedule } });
  };

  return (
    <motion.div 
      className='w-full flex-1 min-h-screen bg-cover bg-center relative'
      style={{ backgroundImage: `url(${herobg})` }}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full py-36 bg-gradient-to-b from-slate-50/80 via-slate-50/30 to-slate-50/20 flex flex-col items-center justify-start text-center gap-8">
        
        {/* Route Visualization */}
        <AnimatePresence>
          {showRoute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              {/* Route Line */}
              <svg className="w-full h-full absolute top-0 left-0">
                <motion.path
                  d={`M 10% 50% ${routePoints.map((point, index) => 
                    `L ${point.x}% ${point.y}%`
                  ).join(' ')} L 90% 50%`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  stroke="rgba(100, 116, 139, 0.3)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>

              {/* Route Points */}
              {routePoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: point.delay }}
                  className="absolute w-3 h-3 bg-slate-400 rounded-full"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}

              {/* City Markers */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute left-[10%] top-[50%] transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-slate-700" />
                  <span className="text-sm font-medium text-slate-700 mt-1">{searchData.from}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-[10%] top-[50%] transform translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-slate-700" />
                  <span className="text-sm font-medium text-slate-700 mt-1">{searchData.to}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Title Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p 
            className="text-lg text-slate-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Get your bus tickets:
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent capitalize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Find the best bus for you!
          </motion.h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="w-full max-w-2xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-100/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Bus Type */}
              <div className="relative">
                <label htmlFor="busType" className="block text-sm font-semibold text-slate-700 mb-1 text-left">
                  Bus Type
                </label>
                <div className="relative">
                  <select
                    id="busType"
                    value={searchData.busType}
                    onChange={(e) => setSearchData({...searchData, busType: e.target.value, from: '', to: ''})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-800 font-medium transition-all appearance-none shadow-sm hover:border-slate-300"
                  >
                    <option value="" className="text-slate-400">Select type</option>
                    {Object.entries(busTypes).map(([key, type]) => (
                      <option key={key} value={key} className="text-slate-800">{type.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-slate-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* From City */}
              <div className="relative">
                <label htmlFor="from" className="block text-sm font-semibold text-slate-700 mb-1 text-left">
                  Departure City
                </label>
                <div className="relative">
                  <select
                    id="from"
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-800 font-medium transition-all appearance-none shadow-sm hover:border-slate-300"
                    disabled={!searchData.busType}
                  >
                    <option value="" className="text-slate-400">Select city</option>
                    {getAvailableCities().map(city => (
                      <option key={`from-${city}`} value={city} className="text-slate-800">{city}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-slate-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* To City */}
              <div className="relative">
                <label htmlFor="to" className="block text-sm font-semibold text-slate-700 mb-1 text-left">
                  Destination City
                </label>
                <div className="relative">
                  <select
                    id="to"
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-800 font-medium transition-all appearance-none shadow-sm hover:border-slate-300"
                    disabled={!searchData.busType || !searchData.from}
                  >
                    <option value="" className="text-slate-400">Select city</option>
                    {getAvailableCities()
                      .filter(city => city !== searchData.from)
                      .map(city => (
                        <option key={`to-${city}`} value={city} className="text-slate-800">{city}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-slate-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-1 text-left">
                  Travel Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-800 font-medium transition-all shadow-sm hover:border-slate-300"
                  />
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Info Button */}
            <div className="flex justify-end mb-4">
              <motion.button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                <Info className="h-4 w-4" />
                Bus Types Information
              </motion.button>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-slate-50 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(busTypes).map(([key, type]) => (
                      <div key={key} className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                        <h4 className="font-semibold text-slate-800">{type.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {type.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <motion.button
              onClick={handleSearch}
              disabled={isSearching || !searchData.from || !searchData.to || !searchData.date || !searchData.busType}
              whileHover={!isSearching && searchData.from && searchData.to && searchData.date && searchData.busType ? { scale: 1.02 } : {}}
              whileTap={!isSearching && searchData.from && searchData.to && searchData.date && searchData.busType ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
                ${isSearching || !searchData.from || !searchData.to || !searchData.date || !searchData.busType
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 shadow-md hover:shadow-lg'
                }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching Buses...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Find Buses Now
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-4xl px-4 mt-8"
            >
              <BusSearchResults
                schedules={searchResults}
                onSelect={handleBusSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Bus;