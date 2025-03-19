from .config import openai_client, MODEL_ID
from .models import EmailRequest, MeetingRequest, TaskRequest

def categorize_email(email_text: str):
    """Categorize an email using the fine-tuned model."""
    response = openai_client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are an email categorization assistant."},
            {"role": "user", "content": f"Categorize this email: {email_text}"}
        ]
    )
    return response.choices[0].message.content.strip()

def schedule_meeting(meeting_data: MeetingRequest):
    """Generate meeting scheduling recommendations using the fine-tuned model."""
    meeting_info = (
        f"Organizer: {meeting_data.organizer}\n"
        f"Attendees: {', '.join(meeting_data.attendees)}\n"
        f"Proposed Dates: {', '.join(meeting_data.proposed_dates)}\n"
        f"Duration: {meeting_data.duration}"
    )
    
    response = openai_client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are a meeting scheduling assistant."},
            {"role": "user", "content": f"Analyze this meeting request and suggest the best time: {meeting_info}"}
        ]
    )
    return response.choices[0].message.content.strip()

def prioritize_task(task_data: TaskRequest):
    """Analyze and prioritize a task using the fine-tuned model."""
    task_info = (
        f"Description: {task_data.description}\n"
        f"Assigned To: {task_data.assigned_to}\n"
        f"Deadline: {task_data.deadline}\n"
        f"Priority: {task_data.priority}"
    )
    
    response = openai_client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are a task prioritization assistant."},
            {"role": "user", "content": f"Analyze this task and suggest optimal handling: {task_info}"}
        ]
    )
    return response.choices[0].message.content.strip()