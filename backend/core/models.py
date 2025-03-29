from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date
from enum import Enum
import re

# Enums for consistent value handling
class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    URGENT = "Urgent"

class TaskStatus(str, Enum):
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    DONE = "Done"

# Base models
class EmailRequest(BaseModel):
    """Model for email content to be analyzed by AI."""
    email_text: str = Field(..., 
        description="Full email text including headers and body.",
        examples=["From: john@example.com\nSubject: Meeting Request\n\nCan we schedule a meeting for next week?"])

class MeetingRequest(BaseModel):
    """Model for meeting scheduling requests."""
    organizer: str = Field(..., 
        description="Name or email of the meeting organizer", 
        examples=["John Smith", "john@example.com"])
    attendees: List[str] = Field(..., 
        description="List of attendee names or emails", 
        examples=[["jane@example.com", "Mark Wilson", "sarah@example.com"]])
    proposed_dates: List[str] = Field(..., 
        description="List of potential meeting dates in YYYY-MM-DD format", 
        examples=[["2025-04-01", "2025-04-02", "2025-04-03"]])
    duration: str = Field(..., 
        description="Meeting duration in hours or minutes", 
        examples=["1 hour", "30 minutes", "2 hours"])
    
    @field_validator('proposed_dates')
    def validate_dates(cls, dates):
        """Ensure dates are in the correct format."""
        date_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
        for d in dates:
            if not date_pattern.match(d):
                raise ValueError(f"Date {d} must be in YYYY-MM-DD format")
        return dates

class TaskRequest(BaseModel):
    """Model for task creation requests."""
    description: str = Field(..., 
        description="Task description/title", 
        examples=["Complete project proposal"])
    assigned_to: str = Field(..., 
        description="Person assigned to this task", 
        examples=["John Smith"])
    deadline: str = Field(..., 
        description="Task deadline in YYYY-MM-DD format", 
        examples=["2025-04-15"])
    priority: Priority = Field(Priority.MEDIUM, 
        description="Task priority level")
    
    @field_validator('deadline')
    def validate_deadline(cls, deadline):
        """Ensure deadline is in the correct format."""
        try:
            datetime.strptime(deadline, "%Y-%m-%d")
            return deadline
        except ValueError:
            raise ValueError("Deadline must be in YYYY-MM-DD format")

# Response models for consistent API responses
class AnalysisResponse(BaseModel):
    """Standard response for AI analysis requests."""
    analysis: str
    timestamp: datetime = Field(default_factory=datetime.now)

class TaskResponse(BaseModel):
    """Standard response model for task operations."""
    id: str
    description: str
    assigned_to: str
    deadline: str
    priority: str
    status: str
    analysis: Optional[str] = None
    tags: Optional[List[str]] = None
    created_at: str
    updated_at: Optional[str] = None

class EmailProcessResponse(BaseModel):
    """Response model for email processing."""
    analysis: str
    actions_taken: List[Dict[str, Any]]

class MeetingScheduleResponse(BaseModel):
    """Response model for meeting scheduling."""
    recommendation: str
    event_created: bool
    event_details: Dict[str, Any]
    scheduled_time: Dict[str, str]

class EmailAnalysisResponse(BaseModel):
    """Response model for email analysis and processing."""
    analysis: Dict[str, Any]  
    actions_taken: List[Dict[str, Any]]
    timestamp: datetime

# Models moved from smart.py
class SmartMeetingRequest(BaseModel):
    """Model for enhanced meeting scheduling requests with additional metadata."""
    request: MeetingRequest
    summary: str
    location: Optional[str] = "To be determined"
    description: Optional[str] = ""

# Models moved from task.py
class StatusUpdate(BaseModel):
    """Model for task status updates."""
    status: str

# Models moved from email.py
class EmailSendRequest(BaseModel):
    """Model for email sending requests."""
    to: str
    subject: str
    body: str

# Models moved from meeting.py
class CalendarEventRequest(BaseModel):
    """Model for calendar event creation requests."""
    summary: str
    location: str
    description: str
    start_time: str
    end_time: str
    attendees: Optional[List[str]] = None