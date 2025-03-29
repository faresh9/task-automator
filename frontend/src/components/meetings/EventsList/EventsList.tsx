import React, { useState } from 'react';
import EventCard from './EventCard';
import { CalendarIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EventsListProps {
  events: any[];
  loading: boolean;
  onViewEvent: (event: any) => void;
  onEditEvent: (event: any) => void;
  onDeleteEvent: (event: any) => void;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  loading, 
  onViewEvent, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter events by search query
  const filteredEvents = events.filter(event => 
    event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.start.dateTime || a.start.date);
    const dateB = new Date(b.start.dateTime || b.start.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
          Upcoming Events
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-9 py-1.5 text-sm"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event, index) => (
              <EventCard 
                key={index} 
                event={event} 
                onView={onViewEvent}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <ClockIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No events found</p>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "No events match your search criteria" : "You don't have any upcoming events"}
              </p>
              {searchQuery && (
                <button 
                  className="mt-4 text-primary-600 hover:text-primary-500 font-medium"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsList;