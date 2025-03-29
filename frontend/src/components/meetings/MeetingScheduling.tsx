import React from 'react'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  SparklesIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CalendarDaysIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import meetingService, { MeetingRequest, CalendarEvent, SmartMeetingRequest } from '../../services/meetingService';
import WeekCalendar from './CalendarView/WeekCalendar';
import EventsList from './EventsList/EventsList';
import EventModal from './modals/EventModal';
import DeleteEventModal from './modals/DeleteEventModal';
import SuccessModal from './modals/SuccessModal';

function MeetingScheduling() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'regular' | 'smart' | 'edit' | 'view'>('regular');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [schedulingResult, setSchedulingResult] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await meetingService.getUpcomingEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (data: CalendarEvent) => {
    try {
      setIsSubmitting(true);
      const result = await meetingService.createEvent(data);
      if (result.success) {
        toast.success('Event created successfully');
        setIsEventModalOpen(false);
        fetchEvents();
      } else {
        throw new Error(result.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (data: CalendarEvent) => {
    try {
      setIsSubmitting(true);
      const result = await meetingService.updateEvent(selectedEvent.id, data);
      if (result.success) {
        toast.success('Event updated successfully');
        setIsEventModalOpen(false);
        fetchEvents();
      } else {
        throw new Error(result.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsDeleting(true);
      const result = await meetingService.deleteEvent(selectedEvent.id);
      if (result.success) {
        toast.success('Event deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedEvent(null);
        fetchEvents();
      } else {
        throw new Error(result.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSmartScheduleMeeting = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Convert the string of attendees to an array
      const attendeesArray = data.attendees.split(',').map((email: string) => email.trim());
      
      // Convert the string of dates to an array
      const datesArray = data.proposed_dates.split(',').map((date: string) => date.trim());
      
      const smartRequest: SmartMeetingRequest = {
        request: {
          organizer: data.organizer,
          attendees: attendeesArray,
          proposed_dates: datesArray,
          duration: data.duration
        },
        summary: data.summary,
        location: data.location || 'To be determined',
        description: data.description || ''
      };
      
      const result = await meetingService.smartScheduleMeeting(smartRequest);
      
      if (result.event_created) {
        setSchedulingResult(result);
        setIsEventModalOpen(false);
        setIsSuccessModalOpen(true);
        fetchEvents();
      } else {
        throw new Error('Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Error smart scheduling meeting:', error);
      toast.error('Failed to schedule meeting with AI');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (type: 'regular' | 'smart' | 'edit' | 'view', event?: any) => {
    setModalType(type);
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    setIsEventModalOpen(true);
  };

  const openDeleteModal = (event: any) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    openModal('view', event);
  };

  const handleEventSubmit = async (data: CalendarEvent) => {
    if (modalType === 'edit') {
      return handleEditEvent(data);
    } else {
      return handleCreateEvent(data);
    }
  };

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Meeting Scheduling</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Plan your meetings and events efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex">
            <button
              className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              onClick={() => setViewMode('calendar')}
              title="Calendar View"
            >
              <CalendarDaysIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListBulletIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          <button
            className="btn-secondary flex items-center gap-1"
            onClick={() => openModal('regular')}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Event</span>
          </button>
          
          <button
            className="btn-primary flex items-center gap-1"
            onClick={() => openModal('smart')}
          >
            <SparklesIcon className="h-5 w-5" />
            <span>AI Scheduling</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateWeek('prev')}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Previous Week"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-lg font-medium">
                {new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                {new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
              
              <button 
                onClick={() => navigateWeek('next')}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Next Week"
              >
                <ArrowRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <button 
              onClick={jumpToToday}
              className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
            >
              Today
            </button>
          </div>
          
          <WeekCalendar 
            events={events} 
            currentDate={currentDate}
            loading={loading} 
            onEventClick={handleEventClick}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <EventsList 
          events={events} 
          loading={loading} 
          onEventClick={handleEventClick} 
          onEditClick={(event) => openModal('edit', event)}
          onDeleteClick={openDeleteModal}
        />
      )}

      {/* Event Modal */}
      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          modalType={modalType}
          event={selectedEvent}
          onSubmit={modalType === 'smart' ? handleSmartScheduleMeeting : handleEventSubmit}
          isSubmitting={isSubmitting}
          onEditClick={selectedEvent ? () => {
            setIsEventModalOpen(false);
            setTimeout(() => openModal('edit', selectedEvent), 100);
          } : undefined}
          onDeleteClick={selectedEvent ? () => {
            setIsEventModalOpen(false);
            setTimeout(() => openDeleteModal(selectedEvent), 100);
          } : undefined}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteEventModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteEvent}
          isDeleting={isDeleting}
          event={selectedEvent}
        />
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          result={schedulingResult}
        />
      )}
    </div>
  );
}

export default MeetingScheduling;