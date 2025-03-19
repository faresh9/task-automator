from pydantic import BaseModel
from typing import List, Optional

class EmailRequest(BaseModel):
    email_text: str
    
class MeetingRequest(BaseModel):
    organizer: str
    attendees: List[str]
    proposed_dates: List[str]
    duration: str
    
class TaskRequest(BaseModel):
    description: str
    assigned_to: str
    deadline: str
    priority: Optional[str] = "Medium"