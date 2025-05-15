// Train types in Sri Lanka
export const trainTypes = {
  EXPRESS: {
    name: 'Express Train',
    description: 'Fastest service with limited stops, ideal for long-distance travel',
    amenities: ['Air Conditioning', 'Reserved Seating', 'Food Service', 'Luggage Space']
  },
  INTERCITY: {
    name: 'Intercity Train',
    description: 'Regular service connecting major cities with moderate stops',
    amenities: ['Reserved Seating', 'Luggage Space', 'Refreshment Service']
  },
  LOCAL: {
    name: 'Local Train',
    description: 'Stops at all stations, perfect for short-distance travel',
    amenities: ['Basic Seating', 'Luggage Space']
  },
  OBSERVATION: {
    name: 'Observation Train',
    description: 'Special service with panoramic views, perfect for scenic routes',
    amenities: ['Panoramic Windows', 'Air Conditioning', 'Reserved Seating', 'Food Service', 'Tour Guide']
  }
};

// Major train routes in Sri Lanka
export const trainRoutes = [
  // Main Line
  { from: 'Colombo Fort', to: 'Kandy', distance: 120, duration: 180 },
  { from: 'Kandy', to: 'Badulla', distance: 150, duration: 240 },
  { from: 'Colombo Fort', to: 'Galle', distance: 116, duration: 150 },
  { from: 'Galle', to: 'Matara', distance: 40, duration: 60 },
  
  // Northern Line
  { from: 'Colombo Fort', to: 'Anuradhapura', distance: 205, duration: 300 },
  { from: 'Anuradhapura', to: 'Jaffna', distance: 165, duration: 240 },
  
  // Eastern Line
  { from: 'Colombo Fort', to: 'Batticaloa', distance: 315, duration: 420 },
  { from: 'Batticaloa', to: 'Trincomalee', distance: 110, duration: 180 },
  
  // Upcountry Line
  { from: 'Kandy', to: 'Nanu Oya', distance: 80, duration: 180 },
  { from: 'Nanu Oya', to: 'Badulla', distance: 70, duration: 120 }
];

// Generate train schedules based on route and date
export const generateTrainSchedules = (from, to, date, trainType) => {
  const route = trainRoutes.find(r => 
    (r.from === from && r.to === to) || (r.from === to && r.to === from)
  );

  if (!route) return [];

  const schedules = [];
  const basePrice = {
    EXPRESS: 1200,
    INTERCITY: 800,
    LOCAL: 500,
    OBSERVATION: 2000
  };

  // Generate 4-6 schedules per day
  const numSchedules = Math.floor(Math.random() * 3) + 4;
  const startHour = trainType === 'EXPRESS' ? 6 : 5;
  const endHour = trainType === 'EXPRESS' ? 20 : 19;

  for (let i = 0; i < numSchedules; i++) {
    const departureHour = startHour + Math.floor((endHour - startHour) * (i / (numSchedules - 1)));
    const departureMinute = Math.floor(Math.random() * 4) * 15; // Random minute in 15-minute intervals
    
    const departureTime = new Date(date);
    departureTime.setHours(departureHour, departureMinute, 0);

    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + route.duration);

    const price = basePrice[trainType] * (route.distance / 100);
    const availableSeats = Math.floor(Math.random() * 50) + 10;

    schedules.push({
      id: `T${i + 1}${Math.random().toString(36).substr(2, 9)}`,
      trainType,
      from,
      to,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      duration: route.duration,
      price: Math.round(price),
      availableSeats,
      amenities: trainTypes[trainType].amenities
    });
  }

  return schedules.sort((a, b) => 
    new Date(a.departureTime) - new Date(b.departureTime)
  );
}; 