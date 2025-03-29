import React from 'react';
import EventItem from './EventItem';

interface DayColumnProps {
  date: Date;
  events: any[];
  isToday: boolean;
  isLoading: boolean;
  onEventClick: (event: any) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, events, isToday, isLoading, onEventClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-[180px] flex flex-col">
      <div className={`p-2 text-center ${
        isToday 
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}>
        <div className="text-xs font-medium">{date.toLocaleString('en-US', { weekday: 'short' })}</div>
        <div className={`text-lg font-bold ${isToday ? 'text-primary-700 dark:text-primary-300' : ''}`}>
          {date.getDate()}
        </div>
      </div>
      <div className="p-1 flex-1">
        {isLoading ? (
          <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md my-1"></div>
        ) : (
          events
            .filter(event => {
              const eventDate = new Date(event.start.dateTime || event.start.date);
              return eventDate.toDateString() === date.toDateString();
            })
            .map((event, i) => (
              <EventItem key={i} event={event} onClick={() => onEventClick(event)} />
            ))
        )}
      </div>
    </div>
  );
};

export default DayColumn;