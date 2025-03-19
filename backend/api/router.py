from fastapi import APIRouter
from .endpoints import email, meeting, task, smart

api_router = APIRouter()

# Include all the endpoint routers
api_router.include_router(email.router)
api_router.include_router(meeting.router)
api_router.include_router(task.router)
api_router.include_router(smart.router)