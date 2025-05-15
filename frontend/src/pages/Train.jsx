import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import trainbg from '../assets/trainbg.png';
import { Calendar, Search, ArrowRight, Info, MapPin } from 'lucide-react';
import TrainSearchResults from '../components/train/TrainSearchResults';
import { trainTypes, trainRoutes, generateTrainSchedules } from '../data/trainData';
import { useNavigate } from 'react-router-dom';

const Train = () => {
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
    trainType: ''
  });
  const [isSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);

  // Get available stations based on train type
  const getAvailableStations = () => {
    if (!searchData.trainType) return [];
    
    const stations = new Set();
    trainRoutes.forEach(route => {
      stations.add(route.from);
      stations.add(route.to);
    });
    return Array.from(stations);
  };

  // Function to generate random points for route visualization
  const generateRoutePoints = () => {
    const points = [];
    const numPoints = 5;
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        delay: i * 0.2
      });
    }
    return points;
  };

  // Update route points when stations are selected
  useEffect(() => {
    if (searchData.from && searchData.to) {
      setRoutePoints(generateRoutePoints());
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }
  }, [searchData.from, searchData.to]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Generate mock search results
    const mockResults = [
      {
        id: '1',
        from: searchData.from,
        to: searchData.to,
        departureTime: searchData.date + 'T08:00:00',
        trainType: searchData.trainType,
        price: 500,
        availableSeats: 45,
        amenities: ['AC', 'Food Service', 'WiFi']
      },
      {
        id: '2',
        from: searchData.from,
        to: searchData.to,
        departureTime: searchData.date + 'T10:30:00',
        trainType: searchData.trainType,
        price: 450,
        availableSeats: 32,
        amenities: ['AC', 'Food Service']
      },
      {
        id: '3',
        from: searchData.from,
        to: searchData.to,
        departureTime: searchData.date + 'T13:15:00',
        trainType: searchData.trainType,
        price: 550,
        availableSeats: 28,
        amenities: ['AC', 'Food Service', 'WiFi', 'Business Class']
      }
    ];
    setSearchResults(mockResults);
    setShowResults(true);
  };

  const handleTrainSelect = (schedule) => {
    navigate('/train/booking', { 
      state: { 
        schedule,
        searchData: {
          from: searchData.from,
          to: searchData.to,
          date: searchData.date,
          trainType: searchData.trainType
        }
      } 
    });
  };

  return (
    <motion.div 
      className='w-full flex-1 min-h-screen bg-cover bg-center relative'
      style={{ backgroundImage: `url(${trainbg})` }}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full py-36 bg-gradient-to-b from-gray-50/90 via-gray-100/50 to-gray-200/30 flex flex-col items-center justify-start text-center gap-8">
        
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
                  d={`M 10% 50% ${routePoints.map((point) => 
                    `L ${point.x}% ${point.y}%`
                  ).join(' ')} L 90% 50%`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  stroke="rgba(180, 83, 9, 0.3)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>

              {/* Route Points */}
              {routePoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: point.delay }}
                  className="absolute w-3 h-3 bg-emerald-500 rounded-full"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}

              {/* Station Markers */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute left-[10%] top-[50%] transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                  <span className="text-sm font-medium text-emerald-700 mt-1">{searchData.from}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-[10%] top-[50%] transform translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex flex-col items-center">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                  <span className="text-sm font-medium text-emerald-700 mt-1">{searchData.to}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p 
            className="text-lg text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Book your train tickets:
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent capitalize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Experience Sri Lanka by Rail
          </motion.h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="w-full max-w-2xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-100/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Train Type */}
              <div className="relative">
                <label htmlFor="trainType" className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Train Type
                </label>
                <div className="relative">
                  <select
                    id="trainType"
                    value={searchData.trainType}
                    onChange={(e) => setSearchData({...searchData, trainType: e.target.value, from: '', to: ''})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-800 font-medium transition-all appearance-none shadow-sm hover:border-gray-300"
                  >
                    <option value="" className="text-gray-400">Select type</option>
                    {Object.entries(trainTypes).map(([key, type]) => (
                      <option key={key} value={key} className="text-gray-800">{type.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-gray-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* From Station */}
              <div className="relative">
                <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Departure Station
                </label>
                <div className="relative">
                  <select
                    id="from"
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-800 font-medium transition-all appearance-none shadow-sm hover:border-gray-300"
                    disabled={!searchData.trainType}
                  >
                    <option value="" className="text-gray-400">Select station</option>
                    {getAvailableStations().map(station => (
                      <option key={`from-${station}`} value={station} className="text-gray-800">{station}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-gray-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* To Station */}
              <div className="relative">
                <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Destination Station
                </label>
                <div className="relative">
                  <select
                    id="to"
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                    className="w-full px-4 py-3 pr-8 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-800 font-medium transition-all appearance-none shadow-sm hover:border-gray-300"
                    disabled={!searchData.trainType || !searchData.from}
                  >
                    <option value="" className="text-gray-400">Select station</option>
                    {getAvailableStations()
                      .filter(station => station !== searchData.from)
                      .map(station => (
                        <option key={`to-${station}`} value={station} className="text-gray-800">{station}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-gray-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1 text-left">
                  Travel Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white/80 border border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-800 font-medium transition-all shadow-sm hover:border-gray-300"
                  />
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                <Info className="h-4 w-4" />
                Train Types Information
              </motion.button>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-white/90 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(trainTypes).map(([key, type]) => (
                      <div key={key} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-800">{type.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {type.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-full font-medium">
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
              disabled={isSearching || !searchData.from || !searchData.to || !searchData.date || !searchData.trainType}
              whileHover={!isSearching && searchData.from && searchData.to && searchData.date && searchData.trainType ? { scale: 1.02 } : {}}
              whileTap={!isSearching && searchData.from && searchData.to && searchData.date && searchData.trainType ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
                ${isSearching || !searchData.from || !searchData.to || !searchData.date || !searchData.trainType
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 shadow-md hover:shadow-lg'
                }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching Trains...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Find Trains Now
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
              <TrainSearchResults
                results={searchResults}
                onSelect={handleTrainSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Train; 