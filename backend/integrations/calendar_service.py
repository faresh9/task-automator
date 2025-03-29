import os
import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle

# If modifying these SCOPES, delete the token.pickle file
SCOPES = ['https://www.googleapis.com/auth/calendar']

class CalendarService:
    def __init__(self):
        self.service = self._get_calendar_service()
        
    def _get_calendar_service(self):
        """Get authenticated Calendar service."""
        creds = None
        # Token file stores the user's access and refresh tokens
        token_path = os.path.join(os.path.dirname(__file__), 'google_token.pickle')
        credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
        
        # Check if token file exists
        if os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid credentials available, let the user log in
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save the credentials for the next run
            with open(token_path, 'wb') as token:
                pickle.dump(creds, token)
        
        # Build the Calendar service
        return build('calendar', 'v3', credentials=creds)
    
    def get_upcoming_events(self, max_results=10):
        """Get upcoming calendar events."""
        try:
            # Call the Calendar API
            now = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=now,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            return events
        
        except Exception as e:
            print(f"Error fetching events: {str(e)}")
            return []
    
    def create_event(self, summary, location, description, start_time, end_time, attendees=None):
        """Create a calendar event."""
        try:
            event = {
                'summary': summary,
                'location': location,
                'description': description,
                'start': {
                    'dateTime': start_time,
                    'timeZone': 'America/New_York',
                },
                'end': {
                    'dateTime': end_time,
                    'timeZone': 'America/New_York',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10},
                    ],
                },
            }
            
            if attendees:
                event['attendees'] = [{'email': email} for email in attendees]
                event['sendUpdates'] = 'all'
            
            event = self.service.events().insert(calendarId='primary', body=event).execute()
            return {
                'success': True,
                'event_id': event['id'],
                'event_link': event.get('htmlLink', '')
            }
        
        except Exception as e:
            print(f"Error creating event: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # def find_free_slots(self, start_date, end_date, duration_minutes=60):
    #     """Find free time slots in the calendar."""
    #     try:
    #         # Get busy times
    #         body = {
    #             "timeMin": start_date,
    #             "timeMax": end_date,
    #             "items": [{"id": "primary"}]
    #         }
            
    #         busy_result = self.service.freebusy().query(body=body).execute()
    #         busy_times = busy_result['calendars']['primary']['busy']
            
    #         # Convert to datetime objects
    #         busy_times = [(datetime.datetime.fromisoformat(time['start'].replace('Z', '+00:00')), 
    #                       datetime.datetime.fromisoformat(time['end'].replace('Z', '+00:00'))) 
    #                       for time in busy_times]
            
    #         # Find free slots (simplified - for demonstration)
    #         free_slots = []
    #         start_time = datetime.datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    #         end_time = datetime.datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            
    #         current = start_time
            
    #         # Only consider working hours (9 AM - 5 PM)
    #         work_start_hour = 9
    #         work_end_hour = 17
            
    #         while current < end_time:
    #             # Skip to next day's work start if outside working hours
    #             if current.hour < work_start_hour:
    #                 current = datetime.datetime(current.year, current.month, current.day, 
    #                                          work_start_hour, 0)
    #             elif current.hour >= work_end_hour:
    #                 current = datetime.datetime(current.year, current.month, current.day, 
    #                                          work_start_hour, 0) + datetime.timedelta(days=1)
    #                 continue
                
    #             # Skip weekends
    #             if current.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
    #                 current = datetime.datetime(current.year, current.month, current.day, 
    #                                          work_start_hour, 0) + datetime.timedelta(days=1)
    #                 continue
                
    #             proposed_end = current + datetime.timedelta(minutes=duration_minutes)
                
    #             # Check if this slot extends beyond working hours
    #             if proposed_end.hour >= work_end_hour or proposed_end.day > current.day:
    #                 current = datetime.datetime(current.year, current.month, current.day + 1, 
    #                                          work_start_hour, 0)
    #                 continue
                
    #             # Check if this time slot overlaps with any busy periods
    #             is_free = True
    #             for busy_start, busy_end in busy_times:
    #                 if (current < busy_end and proposed_end > busy_start):
    #                     is_free = False
    #                     current = busy_end
    #                     break
                
    #             if is_free:
    #                 free_slots.append({
    #                     'start': current.isoformat(),
    #                     'end': proposed_end.isoformat()
    #                 })
    #                 current = proposed_end
                
    #             # Ensure we don't get stuck in a loop
    #             if current == proposed_end:
    #                 current += datetime.timedelta(minutes=15)
            
    #         return free_slots
        
    #     except Exception as e:
    #         print(f"Error finding free slots: {str(e)}")
    #         return []