import React from 'react';
import { formatEventTime } from '../utils/dateFormatters';

interface EventItemProps {
  event: any;
  onClick: (event: any) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  // Determine event color based on event type
  const getEventColor = () => {
    if (event.start.date) {
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
    }
    
    // Could be expanded to handle different event types
    return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
  };

  return (
    <div 
      className={`text-xs p-1.5 my-1 rounded-md ${getEventColor()} hover:opacity-90 cursor-pointer truncate transition-all border border-transparent hover:border-blue-300 dark:hover:border-blue-700`}
      title={event.summary}
      onClick={() => onClick(event)}
    >
      {formatEventTime(event)} {event.summary}
    </div>
  );
};

export default EventItem;