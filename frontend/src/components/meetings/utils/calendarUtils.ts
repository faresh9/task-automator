export const getWeekDates = (baseDate: Date = new Date()) => {
  const currentWeekStart = new Date(baseDate);
  currentWeekStart.setDate(baseDate.getDate() - baseDate.getDay());
  
  // Generate dates for the current week
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });
};

export const getNextWeek = (baseDate: Date): Date => {
  const nextWeek = new Date(baseDate);
  nextWeek.setDate(baseDate.getDate() + 7);
  return nextWeek;
};

export const getPreviousWeek = (baseDate: Date): Date => {
  const prevWeek = new Date(baseDate);
  prevWeek.setDate(baseDate.getDate() - 7);
  return prevWeek;
};

export const getMonthWeeks = (baseDate: Date = new Date()) => {
  const firstDayOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const lastDayOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const endDate = new Date(lastDayOfMonth);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  }
  
  const weeks = [];
  let currentDay = new Date(startDate);
  
  while (currentDay <= endDate) {
    const week = Array.from({ length: 7 }, () => {
      const day = new Date(currentDay);
      currentDay.setDate(currentDay.getDate() + 1);
      return day;
    });
    
    weeks.push(week);
  }
  
  return weeks;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const getTimeSlots = (startHour = 8, endHour = 18, intervalMinutes = 30) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const getDuration = (startDate: Date, endDate: Date): string => {
  const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // in minutes
  
  if (diff < 60) {
    return `${diff} minutes`;
  } else if (diff === 60) {
    return '1 hour';
  } else if (diff % 60 === 0) {
    return `${diff / 60} hours`;
  } else {
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};

export const getEventColor = (eventType: string) => {
  switch (eventType?.toLowerCase()) {
    case 'meeting':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'call':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'appointment':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'conference':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'personal':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};