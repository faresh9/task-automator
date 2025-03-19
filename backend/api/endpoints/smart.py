from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import re
from datetime import datetime, timedelta
from dateutil import parser
from backend.core.models import EmailRequest, MeetingRequest, TaskRequest
from backend.core.ai import categorize_email, schedule_meeting, prioritize_task
from backend.integrations.gmail_service import GmailService
from backend.integrations.calendar_service import CalendarService
from backend.integrations.trello_service import TrelloService

router = APIRouter(prefix="/api/smart", tags=["smart"])

def get_gmail_service():
    return GmailService()

def get_calendar_service():
    return CalendarService()

def get_trello_service():
    return TrelloService()

@router.post("/email-process")
def process_email_with_ai(
    request: EmailRequest,
    gmail_service: GmailService = Depends(get_gmail_service),
    calendar_service: CalendarService = Depends(get_calendar_service),
    trello_service: TrelloService = Depends(get_trello_service)
):
    """Process an email with AI, categorize it, and take appropriate actions."""
    try:
        # 1. Get AI categorization
        ai_analysis = categorize_email(request.email_text)
        
        # 2. Extract email metadata
        email_lines = request.email_text.split("\n")
        sender = next((line.replace("From:", "").strip() for line in email_lines if line.startswith("From:")), "unknown@example.com")
        subject = next((line.replace("Subject:", "").strip() for line in email_lines if line.startswith("Subject:")), "No Subject")
        
        # 3. Take action based on the category
        actions_taken = []
        
        # Check for meeting requests
        if "meeting" in ai_analysis.lower() or "schedule" in ai_analysis.lower():
            # Extract potential dates using regex
            date_matches = re.findall(r'\b\d{4}-\d{2}-\d{2}\b', request.email_text)
            time_matches = re.findall(r'\b\d{1,2}:\d{2}\s*(?:AM|PM)\b', request.email_text, re.IGNORECASE)
            
            if date_matches and time_matches:
                # Create a calendar event
                start_datetime = parser.parse(f"{date_matches[0]} {time_matches[0]}")
                end_datetime = start_datetime + timedelta(hours=1)  # Default 1 hour
                
                event = calendar_service.create_event(
                    summary=f"Meeting: {subject}",
                    location="To be determined",
                    description=f"Auto-created from email: {request.email_text[:500]}...",
                    start_time=start_datetime.isoformat(),
                    end_time=end_datetime.isoformat(),
                    attendees=[sender]
                )
                actions_taken.append({"type": "calendar_event_created", "details": event})
                
        # Check for task-related emails
        if "task" in ai_analysis.lower() or "todo" in ai_analysis.lower() or "action" in ai_analysis.lower():
            # Get the first Trello board and list for demo purposes
            boards = trello_service.get_boards()
            if boards:
                lists = trello_service.get_lists(boards[0]['id'])
                if lists:
                    # Create a task in Trello
                    card = trello_service.create_card(
                        list_id=lists[0]['id'],
                        name=f"Task from email: {subject}",
                        description=f"Generated from email:\n\n{request.email_text[:1000]}...",
                        due=None  # Could extract deadline from email text with more complex regex
                    )
                    actions_taken.append({"type": "task_created", "details": card})
        
        # Reply to the email with a confirmation of actions taken
        if actions_taken:
            reply_body = "I've processed your email and taken the following actions:\n\n"
            for action in actions_taken:
                reply_body += f"- {action['type'].replace('_', ' ').title()}\n"
            
            gmail_service.send_email(
                to=sender,
                subject=f"Re: {subject}",
                body=reply_body
            )
            actions_taken.append({"type": "confirmation_email_sent", "recipient": sender})
        
        return {
            "analysis": ai_analysis,
            "actions_taken": actions_taken
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-meeting")
def smart_schedule_meeting(
    request: MeetingRequest,
    summary: str,
    location: Optional[str] = "To be determined",
    description: Optional[str] = "",
    calendar_service: CalendarService = Depends(get_calendar_service)
):
    """Get AI recommendation for meeting time and create the calendar event."""
    try:
        # 1. Get AI recommendation
        recommendation = schedule_meeting(request)
        
        # 2. Parse the recommendation to extract date and time
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', recommendation)
        time_match = re.search(r'(\d{1,2}:\d{2}\s*(?:AM|PM))', recommendation, re.IGNORECASE)
        
        if not date_match or not time_match:
            # If we can't extract the exact time, use the first proposed date at 10 AM
            if request.proposed_dates:
                start_datetime = parser.parse(f"{request.proposed_dates[0]} 10:00 AM")
            else:
                # Fallback to tomorrow at 10 AM
                tomorrow = datetime.now() + timedelta(days=1)
                start_datetime = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 10, 0, 0)
        else:
            # Use the AI's recommended time
            start_datetime = parser.parse(f"{date_match.group(1)} {time_match.group(1)}")
        
        # 3. Calculate end time based on duration
        duration_hours = float(request.duration.split()[0]) if request.duration.split()[0].isdigit() else 1.0
        end_datetime = start_datetime + timedelta(hours=duration_hours)
        
        # 4. Create the calendar event
        event_result = calendar_service.create_event(
            summary=summary,
            location=location,
            description=description,
            start_time=start_datetime.isoformat(),
            end_time=end_datetime.isoformat(),
            attendees=request.attendees
        )
        
        return {
            "recommendation": recommendation,
            "event_created": True,
            "event_details": event_result,
            "scheduled_time": {
                "start": start_datetime.isoformat(),
                "end": end_datetime.isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-task")
def smart_create_task(
    request: TaskRequest,
    board_name: Optional[str] = "Tasks",
    trello_service: TrelloService = Depends(get_trello_service)
):
    """Analyze a task with AI and create it in Trello with appropriate labels and priority."""
    try:
        # 1. Get AI analysis
        ai_analysis = prioritize_task(request)
        
        # 2. Extract tags/labels from the AI analysis
        tags = []
        if "urgent" in ai_analysis.lower():
            tags.append("Urgent")
        if "high priority" in ai_analysis.lower():
            tags.append("High Priority")
        if "complex" in ai_analysis.lower():
            tags.append("Complex")
            
        # Add tags based on deadline proximity
        deadline_date = parser.parse(request.deadline)
        days_until_deadline = (deadline_date - datetime.now()).days
        
        if days_until_deadline <= 1:
            tags.append("Due Today/Tomorrow")
        elif days_until_deadline <= 7:
            tags.append("Due This Week")
            
        # 3. Determine which list to place the task in
        list_name = "To Do"
        if "started" in ai_analysis.lower() or "in progress" in ai_analysis.lower():
            list_name = "In Progress"
        
        # 4. Find or create the board and list
        boards = trello_service.get_boards()
        board_id = None
        
        # Look for an existing board with the specified name
        for board in boards:
            if board['name'].lower() == board_name.lower():
                board_id = board['id']
                break
                
        # Create a new board if needed
        if not board_id:
            new_board = trello_service.create_board(board_name)
            board_id = new_board['id']
            
        # Get lists for this board
        lists = trello_service.get_lists(board_id)
        list_id = None
        
        # Find the appropriate list
        for lst in lists:
            if lst['name'].lower() == list_name.lower():
                list_id = lst['id']
                break
                
        # Create the list if it doesn't exist
        if not list_id and lists:
            new_list = trello_service.create_list(board_id, list_name)
            list_id = new_list['id']
        elif not list_id and not lists:
            # Create default lists if board is empty
            to_do_list = trello_service.create_list(board_id, "To Do")
            in_progress_list = trello_service.create_list(board_id, "In Progress")
            done_list = trello_service.create_list(board_id, "Done")
            list_id = to_do_list['id']
            
        # 5. Create the card with all the collected information
        card = trello_service.create_card(
            list_id=list_id,
            name=request.description,
            description=f"Assigned to: {request.assigned_to}\nAI Analysis: {ai_analysis}",
            due=deadline_date.isoformat(),
            labels=tags
        )
        
        return {
            "analysis": ai_analysis,
            "task_created": True,
            "task_details": card,
            "tags": tags,
            "list": list_name
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))