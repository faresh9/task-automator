import React from 'react';
import DayColumn from './DayColumn';
import { getWeekDates, getNextWeek, getPreviousWeek } from '../utils/calendarUtils';

interface WeekCalendarProps {
  events: any[];
  loading: boolean;
  onEventClick: (event: any) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ 
  events, 
  loading, 
  onEventClick,
  currentDate,
  onDateChange
}) => {
  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const handlePrevWeek = () => {
    onDateChange(getPreviousWeek(currentDate));
  };

  const handleNextWeek = () => {
    onDateChange(getNextWeek(currentDate));
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={handlePrevWeek}
            aria-label="Previous week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={() => onDateChange(new Date())}
          >
            Today
          </button>
          <span className="text-sm font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm">
        {weekDates.map((date, index) => (
          <DayColumn 
            key={index} 
            date={date} 
            events={events} 
            isToday={date.toDateString() === today.toDateString()} 
            isLoading={loading}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;