import api from './api';

export interface MeetingRequest {
  organizer: string;
  attendees: string[];
  proposed_dates: string[];
  duration: string;
}

export interface CalendarEvent {
  summary: string;
  location: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
}

export interface SmartMeetingRequest {
  request: MeetingRequest;
  summary: string;
  location?: string;
  description?: string;
}

const meetingService = {
  getUpcomingEvents: async (): Promise<any[]> => {
    const response = await api.get('/api/calendar/events');
    return response.data.events;
  },
  
  createEvent: async (event: CalendarEvent): Promise<any> => {
    const response = await api.post('/api/calendar/event', event);
    return response.data;
  },
  
  scheduleMeeting: async (request: MeetingRequest): Promise<any> => {
    const response = await api.post('/api/schedule-meeting', request);
    return response.data;
  },
  
  smartScheduleMeeting: async (request: SmartMeetingRequest): Promise<any> => {
    const response = await api.post('/api/smart/schedule-meeting', request);
    return response.data;
  },
};

export default meetingService;