from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import re
from datetime import datetime, timedelta
from dateutil import parser
from backend.core.models import EmailRequest, MeetingRequest, TaskRequest
from backend.core.ai import categorize_email, schedule_meeting, prioritize_task
from backend.integrations.gmail_service import GmailService
from backend.integrations.calendar_service import CalendarService
from backend.api.endpoints.task import get_tasks, save_tasks

router = APIRouter(prefix="/api/smart", tags=["smart"])

def get_gmail_service():
    return GmailService()

def get_calendar_service():
    return CalendarService()

@router.post("/email-process")
def process_email_with_ai(
    request: EmailRequest,
    gmail_service: GmailService = Depends(get_gmail_service),
    calendar_service: CalendarService = Depends(get_calendar_service)
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
            # Create a task from the email
            task = {
                "id": f"task_{int(datetime.now().timestamp())}",
                "description": f"Task from email: {subject}",
                "assigned_to": "Auto-assigned",
                "deadline": (datetime.now() + timedelta(days=7)).isoformat(),
                "priority": "Medium",
                "status": "To Do",
                "analysis": ai_analysis,
                "created_at": datetime.now().isoformat(),
                "source": "email",
                "email_content": request.email_text[:1000]
            }
            
            # Save to local storage
            tasks = get_tasks()
            tasks.append(task)
            save_tasks(tasks)
            
            actions_taken.append({"type": "task_created", "details": task})
        
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
    request: TaskRequest
):
    """Analyze a task with AI and create it with appropriate tags based on priority."""
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
            
        # 3. Determine status based on analysis
        status = "To Do"
        if "started" in ai_analysis.lower() or "in progress" in ai_analysis.lower():
            status = "In Progress"
        
        # 4. Create task
        task = {
            "id": f"task_{int(datetime.now().timestamp())}",
            "description": request.description,
            "assigned_to": request.assigned_to,
            "deadline": request.deadline,
            "priority": request.priority,
            "status": status,
            "tags": tags,
            "analysis": ai_analysis,
            "created_at": datetime.now().isoformat()
        }
        
        # 5. Save to local storage
        tasks = get_tasks()
        tasks.append(task)
        save_tasks(tasks)
        
        return {
            "analysis": ai_analysis,
            "task_created": True,
            "task_details": task,
            "tags": tags,
            "status": status
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))