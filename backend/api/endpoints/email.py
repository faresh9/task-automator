from fastapi import APIRouter, HTTPException, Depends
from backend.core.models import EmailRequest
from backend.core.ai import categorize_email
from backend.integrations.gmail_service import GmailService

router = APIRouter(prefix="/api", tags=["email"])

def get_gmail_service():
    return GmailService()

@router.post("/categorize-email")
def api_categorize_email(request: EmailRequest):
    try:
        category = categorize_email(request.email_text)
        return {"category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/emails/unread")
def get_unread_emails(gmail_service: GmailService = Depends(get_gmail_service)):
    try:
        emails = gmail_service.get_unread_emails()
        return {"emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emails/send")
def send_email(to: str, subject: str, body: str, gmail_service: GmailService = Depends(get_gmail_service)):
    try:
        result = gmail_service.send_email(to, subject, body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))