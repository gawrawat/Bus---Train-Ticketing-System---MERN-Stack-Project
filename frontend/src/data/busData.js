// Simplified Bus types with three main categories
export const busTypes = {
  HIGHWAY: {
    name: 'Highway Bus',
    description: 'Premium long-distance buses with reclining seats, air conditioning, and onboard entertainment',
    amenities: ['Reclining Seats', 'Air Conditioning', 'Onboard Entertainment', 'WiFi', 'USB Charging', 'Toilet'],
    priceMultiplier: 1.8,
    class: 'Premium'
  },
  INTERCITY: {
    name: 'Intercity Bus',
    description: 'Comfortable buses for medium-distance travel with basic amenities',
    amenities: ['Air Conditioning', 'Comfortable Seats', 'Luggage Space', 'Water Bottle'],
    priceMultiplier: 1.3,
    class: 'Standard'
  },
  NORMAL: {
    name: 'Normal Bus',
    description: 'Standard public transport buses',
    amenities: ['Basic Seats', 'Luggage Space'],
    priceMultiplier: 1.0,
    class: 'Basic'
  }
};

// Highway routes (major cities)
export const highwayRoutes = [
  { from: 'Colombo', to: 'Jaffna', distance: 400, duration: '9-10 hours' },
  { from: 'Colombo', to: 'Galle', distance: 120, duration: '2-3 hours' },
  { from: 'Colombo', to: 'Badulla', distance: 280, duration: '7-8 hours' },
  { from: 'Colombo', to: 'Trincomalee', distance: 270, duration: '6-7 hours' },
  { from: 'Colombo', to: 'Nuwara Eliya', distance: 180, duration: '5-6 hours' },
  { from: 'Jaffna', to: 'Colombo', distance: 400, duration: '9-10 hours' },
  { from: 'Galle', to: 'Colombo', distance: 120, duration: '2-3 hours' },
  { from: 'Badulla', to: 'Colombo', distance: 280, duration: '7-8 hours' },
  { from: 'Trincomalee', to: 'Colombo', distance: 270, duration: '6-7 hours' },
  { from: 'Nuwara Eliya', to: 'Colombo', distance: 180, duration: '5-6 hours' }
];

// Intercity routes (medium distance)
export const intercityRoutes = [
  { from: 'Colombo', to: 'Kandy', distance: 125, duration: '3-4 hours' },
  { from: 'Colombo', to: 'Negombo', distance: 35, duration: '1 hour' },
  { from: 'Colombo', to: 'Matara', distance: 160, duration: '3-4 hours' },
  { from: 'Colombo', to: 'Kalutara', distance: 45, duration: '1 hour' },
  { from: 'Colombo', to: 'Kurunegala', distance: 95, duration: '2-3 hours' },
  { from: 'Kandy', to: 'Colombo', distance: 125, duration: '3-4 hours' },
  { from: 'Negombo', to: 'Colombo', distance: 35, duration: '1 hour' },
  { from: 'Matara', to: 'Colombo', distance: 160, duration: '3-4 hours' },
  { from: 'Kalutara', to: 'Colombo', distance: 45, duration: '1 hour' },
  { from: 'Kurunegala', to: 'Colombo', distance: 95, duration: '2-3 hours' }
];

// Local routes for normal buses
export const localRoutes = [
  { from: 'Colombo', to: 'Moratuwa' },
  { from: 'Colombo', to: 'Wattala' },
  { from: 'Colombo', to: 'Panadura' },
  { from: 'Kandy', to: 'Peradeniya' },
  { from: 'Galle', to: 'Ambalangoda' },
  { from: 'Negombo', to: 'Katunayake' }
];

// Simplified list of bus operators
export const busOperators = [
  {
    id: 1,
    name: 'Sri Lanka Transport Board (SLTB)',
    logo: 'https://cdn.newsfirst.lk/english-uploads/2024/08/sltb-765076.jpg',
    rating: 4.2,
    fleet: ['HIGHWAY', 'INTERCITY', 'NORMAL'],
    contact: '0112 582 582',
    website: 'https://www.sltb.lk'
  },
  {
    id: 2,
    name: 'Lanka Ashok Leyland',
    logo: 'https://www.logo.wine/a/logo/Ashok_Leyland/Ashok_Leyland-Logo.wine.svg',
    rating: 4.5,
    fleet: ['HIGHWAY', 'INTERCITY'],
    contact: '0112 345 678',
    website: 'https://www.lankaashokleyland.lk'
  },
  {
    id: 3,
    name: 'Express Bus Service',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSws5TFntuOTzqGCc1O_F-VV7b84ewHbwavuw&s',
    rating: 4.3,
    fleet: ['HIGHWAY', 'INTERCITY', 'NORMAL'],
    contact: '0117 895 623',
    website: 'https://www.expressbusservice.lk'
  }
];

// Enhanced bus schedule generator with dynamic pricing
export const generateBusSchedules = (from, to, date, busType) => {
  // Find the route to calculate distance-based pricing
  const route = [...highwayRoutes, ...intercityRoutes].find(r => 
    r.from === from && r.to === to
  );
  
  const distance = route?.distance || 100; // Default to 100km if route not found
  const basePrice = Math.round(distance * 3.5); // Base price calculation (LKR per km)
  
  const schedules = [];
  const startTime = new Date(date);
  startTime.setHours(5, 30, 0); // First bus at 5:30 AM

  // Generate schedules based on bus type
  const scheduleCount = busType === 'HIGHWAY' ? 6 : 
                      busType === 'INTERCITY' ? 8 : 10;

  for (let i = 0; i < scheduleCount; i++) {
    const departureTime = new Date(startTime);
    const hourIncrement = busType === 'HIGHWAY' ? 
                         (i < 3 ? i * 4 : 12 + ((i-3) * 4)) : // More spread out for long distance
                         (i * 2); // Every 2 hours for others
    
    departureTime.setHours(startTime.getHours() + hourIncrement);

    // Random operator that supports this bus type
    const eligibleOperators = busOperators.filter(op => op.fleet.includes(busType));
    const operator = eligibleOperators[Math.floor(Math.random() * eligibleOperators.length)] || busOperators[0];
    
    const busTypeInfo = busTypes[busType];
    
    // Price variation (10-20% higher for peak times)
    const isPeak = [7, 8, 16, 17].includes(departureTime.getHours());
    const peakMultiplier = isPeak ? 1 + (Math.random() * 0.2) : 1;
    const price = Math.round(basePrice * busTypeInfo.priceMultiplier * peakMultiplier);
    
    // Journey duration calculation
    const baseDuration = route?.duration || '4 hours';
    const durationHours = parseInt(baseDuration) || 4;
    const durationMinutes = baseDuration.includes('30') ? 30 : 0;
    const totalDurationMinutes = (durationHours * 60) + durationMinutes;
    
    // Add some random variation to duration
    const durationVariation = Math.round((Math.random() * 30) - 15); // -15 to +15 mins
    const actualDurationMinutes = Math.max(30, totalDurationMinutes + durationVariation);
    
    const arrivalTime = new Date(departureTime.getTime() + (actualDurationMinutes * 60 * 1000));
    
    schedules.push({
      id: `bus-${from}-${to}-${busType}-${i}`,
      operator: operator,
      busType: busType,
      busClass: busTypeInfo.class,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      duration: `${Math.floor(actualDurationMinutes/60)}h ${actualDurationMinutes%60}m`,
      price: price,
      discountedPrice: Math.round(price * 0.9), // 10% discount for online booking
      availableSeats: Math.floor(Math.random() * 15) + 5, // 5-20 seats
      amenities: busTypeInfo.amenities,
      description: busTypeInfo.description,
      isPeak: isPeak,
      isWifiAvailable: busTypeInfo.amenities.includes('WiFi'),
      isAcAvailable: busTypeInfo.amenities.includes('Air Conditioning'),
      cancellationPolicy: busType === 'HIGHWAY' ? 'Free cancellation up to 24 hours before' : 'No cancellation'
    });
  }

  // Sort schedules by departure time
  return schedules.sort((a, b) => 
    new Date(a.departureTime) - new Date(b.departureTime)
  );
};

// Additional functions for bus booking system
export const getPopularRoutes = () => {
  return [
    ...highwayRoutes.filter(r => r.from === 'Colombo').slice(0, 5),
    ...intercityRoutes.filter(r => r.from === 'Colombo').slice(0, 3)
  ];
};

export const getBusTypesForRoute = (from, to) => {
  const isHighway = highwayRoutes.some(r => r.from === from && r.to === to);
  const isIntercity = intercityRoutes.some(r => r.from === from && r.to === to);
  
  if (isHighway) {
    return ['HIGHWAY'];
  }
  if (isIntercity) {
    return ['INTERCITY'];
  }
  return ['NORMAL'];
};