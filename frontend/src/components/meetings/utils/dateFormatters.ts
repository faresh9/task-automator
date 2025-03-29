export const formatEventTime = (event: any) => {
  // Handle all-day events
  if (event.start.date) {
    return 'All day';
  }
  
  // Handle events with specific times
  const startDate = new Date(event.start.dateTime);
  const endDate = new Date(event.end.dateTime);
  
  const startTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  return `${startTime} - ${endTime}`;
};

export const getEventDateDisplay = (event: any) => {
  const date = new Date(event.start.dateTime || event.start.date);
  return {
    day: date.getDate(),
    month: date.toLocaleString('en-US', { month: 'short' }),
    weekday: date.toLocaleString('en-US', { weekday: 'short' })
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTimeRange = (startDate: Date, endDate: Date): string => {
  const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return `${startTime} - ${endTime}`;
  } else {
    return `${formatDate(startDate)} ${startTime} - ${formatDate(endDate)} ${endTime}`;
  }
};