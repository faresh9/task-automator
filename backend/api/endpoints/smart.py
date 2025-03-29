from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict, List, Any
import re
from datetime import datetime, timedelta
from dateutil import parser
from backend.core.models import (
    EmailRequest, MeetingRequest, TaskRequest, EmailAnalysisResponse,
    SmartMeetingRequest  # Import the model from models.py
)
from backend.core.ai import analyze_email, schedule_meeting, prioritize_task
from backend.integrations.gmail_service import GmailService
from backend.integrations.calendar_service import CalendarService
from backend.api.endpoints.task import get_tasks, save_tasks
import json

router = APIRouter(prefix="/api/smart", tags=["smart"])

def get_gmail_service():
    return GmailService()

def get_calendar_service():
    return CalendarService()

# Create a shared helper function for calendar event creation
def create_calendar_event(
    calendar_service, 
    summary, 
    start_datetime, 
    end_datetime, 
    location="To be determined", 
    description="", 
    attendees=None
):
    """Helper function to create calendar events consistently."""
    if not attendees:
        attendees = []
    
    # Validate attendees
    valid_attendees = []
    for attendee in attendees:
        if "@" in attendee and "." in attendee.split("@")[1]:
            valid_attendees.append(attendee)
        elif attendee.lower() == "team":
            valid_attendees.append("team@company.com")
        else:
            valid_attendees.append(f"{attendee.lower().replace(' ', '.')}@company.com")
    
    try:
        event = calendar_service.create_event(
            summary=summary,
            location=location,
            description=description,
            start_time=start_datetime.isoformat(),
            end_time=end_datetime.isoformat(),
            attendees=valid_attendees
        )
        return {
            "success": True,
            "event": event
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/email-process", response_model=EmailAnalysisResponse)
def process_email_with_ai(
    request: EmailRequest,
    gmail_service: GmailService = Depends(get_gmail_service),
    calendar_service: CalendarService = Depends(get_calendar_service)
):
    """Process an email with AI, categorize it, and take appropriate actions."""
    try:
        # 1. Get comprehensive AI analysis with structured data
        ai_analysis = analyze_email(request.email_text)
        
        # Enhanced analysis with additional contextual information
        ai_analysis["context"] = {
            "processing_time": datetime.now().isoformat(),
            "email_length": len(request.email_text),
            "has_attachments": "attachment" in request.email_text.lower()
        }
        
        # Normalize the people_mentioned field
        if not ai_analysis.get("people_mentioned"):
            # Extract potential names using regex patterns
            potential_names = re.findall(r'[A-Z][a-z]+ [A-Z][a-z]+', request.email_text)
            ai_analysis["people_mentioned"] = list(set(potential_names))
        elif isinstance(ai_analysis.get("people_mentioned"), dict):
            # It's already in the correct format, no need to change
            pass
        else:
            # Convert to dictionary format for consistency
            people = ai_analysis.get("people_mentioned", [])
            ai_analysis["people_mentioned"] = {person: "Unknown role" for person in people}
        
        # 2. Extract email metadata
        email_lines = request.email_text.split("\n")
        sender = next((line.replace("From:", "").strip() for line in email_lines if line.startswith("From:")), "unknown@example.com")
        subject = next((line.replace("Subject:", "").strip() for line in email_lines if line.startswith("Subject:")), "No Subject")
        
        # 3. Take actions based on the structured analysis
        actions_taken = []
        
        # Process meeting requests if detected but don't create the event (n8n will do this)
        if ai_analysis.get("category") == "Meeting Request" or ai_analysis.get("intent") == "Schedule Meeting":
            meeting_data = ai_analysis.get("meeting_details", {})
            
            # Use extracted dates and times if available in the analysis
            start_time = meeting_data.get("proposed_datetime")
            
            # If AI couldn't extract a specific time, fall back to regex
            if not start_time:
                date_matches = re.findall(r'\b\d{4}-\d{2}-\d{2}\b', request.email_text)
                time_matches = re.findall(r'\b\d{1,2}:\d{2}\s*(?:AM|PM)\b', request.email_text, re.IGNORECASE)
                
                if date_matches and time_matches:
                    start_time = f"{date_matches[0]} {time_matches[0]}"
                    
                    # Update the meeting_details with the extracted time
                    meeting_data["proposed_datetime"] = start_time
                    ai_analysis["meeting_details"] = meeting_data
            
            # Just mark that a meeting was detected, but let n8n create it
            actions_taken.append({
                "type": "meeting_detected", 
                "details": {
                    "title": meeting_data.get("title", f"Meeting: {subject}"),
                    "proposed_datetime": meeting_data.get("proposed_datetime"),
                    "duration_hours": meeting_data.get("duration_hours", 1),
                    "location": meeting_data.get("location", "To be determined"),
                    "attendees": meeting_data.get("attendees", [sender]),
                    "description": meeting_data.get("description", f"Meeting from email: {subject}")
                },
                "confidence": meeting_data.get("confidence", 0.8)
            })
                
        # Extract and create tasks if present
        if ai_analysis.get("category") in ["Task Request", "Action Item"] or ai_analysis.get("tasks"):
            # Process each identified task
            task_list = ai_analysis.get("tasks", [])
            
            # Ensure task_list is a list
            if not isinstance(task_list, list):
                if isinstance(task_list, dict):
                    task_list = [task_list]
                else:
                    task_list = [{"description": f"Task from email: {subject}"}]
            
            # If list is empty, add default task
            if not task_list:
                task_list = [{"description": f"Task from email: {subject}"}]
            
            for task_data in task_list:
                # Ensure task_data is a dictionary
                if not isinstance(task_data, dict):
                    task_data = {"description": str(task_data)}
                
                # Enhance task with AI analysis
                task_description = task_data.get("description", f"Task from email: {subject}")
                assigned_to = task_data.get("assigned_to", "Auto-assigned")
                deadline = task_data.get("deadline", (datetime.now() + timedelta(days=7)).isoformat())
                priority = task_data.get("priority", "Medium")
                
                ai_task_analysis = prioritize_task({
                    "description": task_description,
                    "assigned_to": assigned_to,
                    "deadline": deadline,
                    "priority": priority
                })
                
                # Extract additional tags from AI analysis
                extra_tags = []
                if isinstance(ai_task_analysis, str):
                    if "urgent" in ai_task_analysis.lower():
                        extra_tags.append("Urgent")
                    if "complex" in ai_task_analysis.lower():
                        extra_tags.append("Complex")
                
                # Safely handle existing tags (may be None, list, or contain unhashable types)
                existing_tags = task_data.get("tags", [])
                if existing_tags is None:
                    existing_tags = []
                elif not isinstance(existing_tags, list):
                    existing_tags = [str(existing_tags)]
                
                # Convert any non-string tags to strings
                safe_existing_tags = []
                for tag in existing_tags:
                    if isinstance(tag, (dict, list)):
                        # Convert complex objects to string representation
                        safe_existing_tags.append(str(tag))
                    else:
                        safe_existing_tags.append(tag)
                
                # Create a rich task with all available metadata
                task = {
                    "id": f"task_{int(datetime.now().timestamp())}",
                    "description": task_description,
                    "assigned_to": assigned_to,
                    "deadline": deadline,
                    "priority": priority,
                    "status": "To Do",
                    "tags": safe_existing_tags + extra_tags,  # Avoid set() operation
                    "analysis": json.dumps({
                        "email_analysis": ai_analysis,
                        "task_analysis": ai_task_analysis
                    }),
                    "created_at": datetime.now().isoformat(),
                    "source": "email",
                    "email_content": request.email_text[:1000],
                    "confidence": task_data.get("confidence", 0.7)
                }
                
                # Add tags based on analysis (avoid set operations)
                if ai_analysis.get("sentiment") == "urgent" and "Urgent" not in task["tags"]:
                    task["tags"].append("Urgent")
                
                if ai_analysis.get("importance") == "high" and "Important" not in task["tags"]:
                    task["tags"].append("Important")
                
                try:
                    # Save to local storage
                    tasks = get_tasks()
                    tasks.append(task)
                    save_tasks(tasks)
                    
                    actions_taken.append({"type": "task_created", "details": task})
                except Exception as task_error:
                    # Log the error but continue processing
                    print(f"Error saving task: {str(task_error)}")
                    actions_taken.append({
                        "type": "task_creation_failed", 
                        "details": {
                            "description": task.get("description"),
                            "error": str(task_error)
                        }
                    })
        
        # Add follow-up actions based on analysis recommendations
        if ai_analysis.get("follow_up_actions"):
            # Check if follow_up_actions is a string or list
            follow_up = ai_analysis.get("follow_up_actions")
            if isinstance(follow_up, str):
                # Single action as a string
                actions_taken.append({
                    "type": "follow_up_suggested", 
                    "details": follow_up
                })
            elif isinstance(follow_up, list):
                # Multiple actions as a list
                for action in follow_up:
                    actions_taken.append({
                        "type": "follow_up_suggested", 
                        "details": action
                    })
            else:
                # Could be a dict or other format
                actions_taken.append({
                    "type": "follow_up_suggested", 
                    "details": str(follow_up)
                })
        
        # Fix for the "undefined" recipient issue
        if sender == "undefined" or not "@" in sender:
            # Try to extract email from the From line more carefully
            from_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', request.email_text)
            if from_match:
                sender = from_match.group(0)
        
        # Reply to the email with a confirmation of actions taken
        if actions_taken and "@" in sender:
            # Create a more detailed reply based on the analysis
            reply_body = "I've processed your email and taken the following actions:\n\n"
            
            for action in actions_taken:
                if action["type"] == "meeting_detected":
                    meeting = action["details"]
                    reply_body += f"- Scheduled meeting: {meeting.get('title')}\n"
                    reply_body += f"  When: {meeting.get('proposed_datetime')}\n"
                    reply_body += f"  Duration: {meeting.get('duration_hours')} hours\n\n"
                elif action["type"] == "task_created":
                    task = action["details"]
                    reply_body += f"- Created task: {task.get('description')}\n"
                    reply_body += f"  Priority: {task.get('priority')}\n"
                    reply_body += f"  Due: {task.get('deadline')}\n\n"
                elif action["type"] == "follow_up_suggested":
                    reply_body += f"- Suggested follow-up: {action.get('details')}\n\n"
            
            # Add any AI-generated reply suggestions
            if ai_analysis.get("reply_suggestions"):
                reply_body += "\n" + ai_analysis.get("reply_suggestions")
            
            gmail_service.send_email(
                to=sender,
                subject=f"Re: {subject}",
                body=reply_body
            )
            actions_taken.append({"type": "confirmation_email_sent", "recipient": sender})
        
        return {
            "analysis": ai_analysis,
            "actions_taken": actions_taken,
            "timestamp": datetime.now().isoformat()  # Use isoformat() for better serialization
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-meeting")
def smart_schedule_meeting(
    smart_request: SmartMeetingRequest,
    calendar_service: CalendarService = Depends(get_calendar_service)
):
    """Get AI recommendation for meeting time and create the calendar event."""
    try:
        # Extract the MeetingRequest portion
        request = smart_request.request
        
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
        event_result = create_calendar_event(
            calendar_service=calendar_service,
            summary=smart_request.summary,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            location=smart_request.location,
            description=smart_request.description,
            attendees=request.attendees
        )
        
        if event_result["success"]:
            return {
                "recommendation": recommendation,
                "event_created": True,
                "event_details": event_result["event"],
                "scheduled_time": {
                    "start": start_datetime.isoformat(),
                    "end": end_datetime.isoformat()
                }
            }
        else:
            raise HTTPException(status_code=500, detail=event_result["error"])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))