from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from backend.core.models import MeetingRequest, CalendarEventRequest  # Import CalendarEventRequest from models.py
from backend.core.ai import schedule_meeting
from backend.integrations.calendar_service import CalendarService


router = APIRouter(prefix="/api", tags=["meeting"])

def get_calendar_service():
    return CalendarService()

@router.post("/schedule-meeting")
def api_schedule_meeting(request: MeetingRequest):
    try:
        recommendation = schedule_meeting(request)
        return {"recommendation": recommendation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/calendar/events")
def get_calendar_events(calendar_service: CalendarService = Depends(get_calendar_service)):
    try:
        events = calendar_service.get_upcoming_events()
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calendar/event")
def create_calendar_event(
    request: CalendarEventRequest,
    calendar_service: CalendarService = Depends(get_calendar_service)
):
    try:
        result = calendar_service.create_event(
            summary=request.summary,
            location=request.location,
            description=request.description,
            start_time=request.start_time,
            end_time=request.end_time,
            attendees=request.attendees
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))