import React from 'react';
import { getEventDateDisplay, formatEventTime } from '../utils/dateFormatters';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ArrowPathIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  event: any;
  onView: (event: any) => void;
  onEdit: (event: any) => void;
  onDelete: (event: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onView, onEdit, onDelete }) => {
  const dateInfo = getEventDateDisplay(event);
  
  return (
    <div className="py-3 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 rounded-lg group transition-colors">
      <div className="flex-shrink-0 w-14 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-1 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400">{dateInfo.month}</div>
          <div className="text-lg font-bold">{dateInfo.day}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{dateInfo.weekday}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0" onClick={() => onView(event)}>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{event.summary}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatEventTime(event)}
        </p>
        {event.location && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            📍 {event.location}
          </p>
        )}
        {event.attendees && event.attendees.length > 0 && (
          <div className="mt-2 flex -space-x-1 overflow-hidden">
            {event.attendees.slice(0, 3).map((attendee: any, index: number) => (
              <div 
                key={index} 
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center"
                title={attendee.email}
              >
                {attendee.email ? attendee.email.charAt(0).toUpperCase() : '?'}
              </div>
            ))}
            {event.attendees.length > 3 && (
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center">
                +{event.attendees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${event.start.dateTime 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
          {event.start.dateTime ? 'Meeting' : 'All day'}
        </span>
        
        <Menu as="div" className="relative ml-2 inline-block text-left">
          <div>
            <Menu.Button className="flex items-center rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity">
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onView(event)}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                      } flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <CalendarIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                      View Details
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(event)}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                      } flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <PencilIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(event)}
                      className={`${
                        active ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'
                      } flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <TrashIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default EventCard;