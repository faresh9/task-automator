from gmail_service import GmailService
from calendar_service import CalendarService

def test_gmail():
    gmail = GmailService()
    emails = gmail.get_unread_emails(max_results=5)
    print(f"Found {len(emails)} unread emails")
    for email in emails:
        print(f"From: {email['sender']}")
        print(f"Subject: {email['subject']}")
        print("-" * 40)

def test_calendar():
    calendar = CalendarService()
    events = calendar.get_upcoming_events(max_results=5)
    print(f"Found {len(events)} upcoming events")
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        print(f"{start} - {event['summary']}")
        print("-" * 40)

if __name__ == "__main__":
    print("Testing Gmail integration...")
    test_gmail()
    
    print("\nTesting Calendar integration...")
    test_calendar()