// List of public holidays in Sri Lanka (2024)
const publicHolidays = [
  '2024-01-01', // New Year's Day
  '2024-01-15', // Tamil Thai Pongal Day
  '2024-02-04', // National Day
  '2024-03-08', // Maha Sivarathri Day
  '2024-04-09', // Good Friday
  '2024-04-10', // Holy Saturday
  '2024-04-11', // Easter Sunday
  '2024-04-12', // Easter Monday
  '2024-04-13', // Sinhala and Tamil New Year
  '2024-04-14', // Sinhala and Tamil New Year
  '2024-05-01', // May Day
  '2024-05-22', // Id-Ul-Fitr
  '2024-06-17', // Poson Full Moon Poya Day
  '2024-07-16', // Esala Full Moon Poya Day
  '2024-08-15', // Nikini Full Moon Poya Day
  '2024-09-15', // Binara Full Moon Poya Day
  '2024-10-15', // Vap Full Moon Poya Day
  '2024-11-14', // Il Full Moon Poya Day
  '2024-12-25', // Christmas Day
];

// Popular tourist destinations
const popularDestinations = [
  'Kandy',
  'Galle',
  'Nuwara Eliya',
  'Sigiriya',
  'Anuradhapura',
  'Polonnaruwa',
  'Trincomalee',
  'Bentota',
  'Hikkaduwa',
  'Ella'
];

// Check if a date is a rush date
export const isRushDate = (date, from, to) => {
  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check if it's a public holiday
  const isHoliday = publicHolidays.includes(date);
  
  // Check if it's a weekend
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Check if it's a Monday (beginning of week)
  const isMonday = dayOfWeek === 1;
  
  // Check if destination is popular
  const isPopularDestination = popularDestinations.includes(to);
  
  // Check if it's a Colombo route on Monday
  const isColomboRouteOnMonday = (to === 'Colombo' || from === 'Colombo') && isMonday;
  
  return {
    isRush: isHoliday || isWeekend || isPopularDestination || isColomboRouteOnMonday,
    reasons: [
      isHoliday && 'Public Holiday',
      isWeekend && 'Weekend',
      isPopularDestination && 'Popular Tourist Destination',
      isColomboRouteOnMonday && 'Monday Colombo Route'
    ].filter(Boolean)
  };
};

// Get rush date notification message
export const getRushDateNotification = (date, from, to) => {
  const { isRush, reasons } = isRushDate(date, from, to);
  
  if (!isRush) return null;
  
  const message = `⚠️ High Demand Alert: This date may have increased passenger traffic due to:`;
  const reasonList = reasons.map(reason => `• ${reason}`).join('\n');
  const advice = '\nWe recommend booking early to secure your seats.';
  
  return {
    message: `${message}\n${reasonList}${advice}`,
    severity: 'warning'
  };
}; 