import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { XMarkIcon, PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CalendarEvent } from '../../../services/meetingService';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'regular' | 'smart' | 'edit' | 'view';
  event?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  modalType,
  event,
  onSubmit,
  isSubmitting,
  onEditClick,
  onDeleteClick
}) => {
  const isViewMode = modalType === 'view';
  const isSmartMode = modalType === 'smart';
  
  // Regular event form
  const { 
    register: registerEvent, 
    handleSubmit: handleSubmitEvent, 
    formState: { errors: errorsEvent }
  } = useForm<CalendarEvent>({
    defaultValues: event ? {
      summary: event.summary,
      location: event.location || '',
      description: event.description || '',
      start_time: event.start.dateTime ? format(new Date(event.start.dateTime), "yyyy-MM-dd'T'HH:mm") : '',
      end_time: event.end.dateTime ? format(new Date(event.end.dateTime), "yyyy-MM-dd'T'HH:mm") : '',
      attendees: event.attendees?.map((a: any) => a.email).join(', ') || ''
    } : undefined
  });

  // Smart scheduling form
  const { 
    register: registerSmart, 
    handleSubmit: handleSubmitSmart,
    formState: { errors: errorsSmart }
  } = useForm<{
    organizer: string;
    attendees: string;
    proposed_dates: string;
    duration: string;
    summary: string;
    location: string;
    description: string;
  }>();

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getTodayDate = () => {
    return format(new Date(), "yyyy-MM-dd");
  };

  const getSuggestedDates = () => {
    const today = new Date();
    const dates = [];
    
    // Suggest dates for the next 3 weekdays
    let count = 0;
    let current = new Date(today);
    while (count < 3) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) { // Skip weekends
        dates.push(format(current, 'yyyy-MM-dd'));
        count++;
      }
    }
    
    return dates.join(', ');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transition-transform transform">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              {isSmartMode && <SparklesIcon className="h-5 w-5 mr-2 text-primary-500" />}
              {modalType === 'regular' && 'Create Calendar Event'}
              {modalType === 'edit' && 'Edit Event'}
              {modalType === 'view' && 'Event Details'}
              {modalType === 'smart' && 'AI-Assisted Scheduling'}
            </h3>
            <button 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {isViewMode && event ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">{event.summary}</h2>
                
                <div className="mt-4 space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 dark:text-gray-400 w-20">When:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {event.start.date ? (
                        format(new Date(event.start.date), 'PPPP')
                      ) : (
                        `${format(new Date(event.start.dateTime), 'PPPP')} • ${format(new Date(event.start.dateTime), 'h:mm a')} - ${format(new Date(event.end.dateTime), 'h:mm a')}`
                      )}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex">
                      <span className="text-gray-500 dark:text-gray-400 w-20">Where:</span>
                      <span className="text-gray-900 dark:text-gray-100">{event.location}</span>
                    </div>
                  )}
                  
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 dark:text-gray-400 w-20">Who:</span>
                      <div className="flex-1">
                        {event.attendees.map((attendee: any, index: number) => (
                          <div key={index} className="text-gray-900 dark:text-gray-100">{attendee.email}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {event.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400 block mb-1">Description:</span>
                      <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{event.description}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                {onDeleteClick && (
                  <button
                    type="button"
                    onClick={onDeleteClick}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                )}
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  
                  {onEditClick && (
                    <button
                      type="button"
                      onClick={onEditClick}
                      className="btn-primary flex items-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : isSmartMode ? (
            <form onSubmit={handleSubmitSmart(onSubmit)} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Strategy Discussion"
                  {...registerSmart('summary', { required: 'Meeting title is required' })}
                />
                {errorsSmart.summary && (
                  <p className="mt-1 text-sm text-red-600">{errorsSmart.summary.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organizer
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Your Name"
                  {...registerSmart('organizer', { required: 'Organizer is required' })}
                />
                {errorsSmart.organizer && (
                  <p className="mt-1 text-sm text-red-600">{errorsSmart.organizer.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attendees (comma separated emails)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="john@example.com, jane@example.com"
                  {...registerSmart('attendees', { required: 'Attendees are required' })}
                />
                {errorsSmart.attendees && (
                  <p className="mt-1 text-sm text-red-600">{errorsSmart.attendees.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proposed Dates (comma separated YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={getSuggestedDates()}
                  {...registerSmart('proposed_dates', { required: 'Proposed dates are required' })}
                />
                {errorsSmart.proposed_dates && (
                  <p className="mt-1 text-sm text-red-600">{errorsSmart.proposed_dates.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <select
                  className="input-field"
                  defaultValue="1 hour"
                  {...registerSmart('duration', { required: 'Duration is required' })}
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
                {errorsSmart.duration && (
                  <p className="mt-1 text-sm text-red-600">{errorsSmart.duration.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Conference Room or Zoom link"
                  {...registerSmart('location')}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  placeholder="Meeting details and agenda"
                  {...registerSmart('description')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      <span>Schedule with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitEvent(onSubmit)} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summary
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Meeting title"
                  {...registerEvent('summary', { required: 'Summary is required' })}
                />
                {errorsEvent.summary && (
                  <p className="mt-1 text-sm text-red-600">{errorsEvent.summary.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    min={getTodayDate()}
                    {...registerEvent('start_time', { required: 'Start time is required' })}
                  />
                  {errorsEvent.start_time && (
                    <p className="mt-1 text-sm text-red-600">{errorsEvent.start_time.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    min={getTodayDate()}
                    {...registerEvent('end_time', { required: 'End time is required' })}
                  />
                  {errorsEvent.end_time && (
                    <p className="mt-1 text-sm text-red-600">{errorsEvent.end_time.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Conference Room B or Zoom Link"
                  {...registerEvent('location')}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attendees (comma separated emails)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="john@example.com, jane@example.com"
                  {...registerEvent('attendees')}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  placeholder="Meeting details and agenda"
                  {...registerEvent('description')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-1 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    modalType === 'edit' ? 'Update Event' : 'Create Event'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;