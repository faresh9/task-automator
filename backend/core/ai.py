from .config import openai_client, MODEL_ID
from .models import EmailRequest, MeetingRequest, TaskRequest, EmailAnalysisResponse  # Import EmailAnalysisResponse from models.py
import json
from typing import Dict, Any, List
from datetime import datetime

def analyze_email(email_text: str) -> Dict[str, Any]:
    """Analyze an email using the fine-tuned model to extract comprehensive information.
    
    Returns a structured dictionary with detailed information about the email:
    - category: The main category of the email
    - intent: The primary intent or purpose
    - sentiment: Overall sentiment (urgent, neutral, friendly, etc.)
    - importance: How important this seems (high, medium, low)
    - meeting_details: If applicable, extracted meeting information
    - tasks: If applicable, list of extracted actionable tasks
    - people_mentioned: Names/emails of people referenced in email
    - follow_up_actions: Suggested follow-up actions
    - reply_suggestions: Suggested reply content
    - keywords: Important keywords or topics
    """
    
    prompt = f"""
    Analyze this email comprehensively and return a JSON structure with the following:
    - category: The main category (Meeting Request, Task Assignment, Information, etc.)
    - intent: The primary intent (Schedule Meeting, Assign Task, Share Info, etc.)
    - sentiment: Overall sentiment (urgent, neutral, friendly, etc.)
    - importance: How important this seems (high, medium, low)
    - meeting_details: If a meeting is mentioned, extract:
      - title: Suggested meeting title
      - proposed_datetime: Any mentioned date/time in ISO format
      - duration_hours: Suggested duration in hours
      - location: Any mentioned location
      - attendees: List of people who should attend
      - description: Brief description of meeting purpose
      - confidence: How confident you are this is a meeting request (0-1)
    - tasks: List of actionable tasks, each with:
      - description: The task description
      - assigned_to: Who should do it
      - deadline: When it's due (in YYYY-MM-DD format)
      - priority: Suggested priority (High, Medium, Low)
      - tags: Suggested tags/labels
      - confidence: How confident you are this is a task (0-1)
    - people_mentioned: Names and roles of people mentioned
    - follow_up_actions: Suggested follow-up actions
    - reply_suggestions: Potential reply content
    - keywords: Important keywords or topics

    Email:
    {email_text}
    """
    
    response = openai_client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {"role": "system", "content": "You are an advanced email analysis assistant that extracts structured data from emails."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.2
    )
    
    try:
        analysis = json.loads(response.choices[0].message.content.strip())
        return analysis
    except json.JSONDecodeError:
        # Fallback if we can't parse the JSON
        text_analysis = response.choices[0].message.content.strip()
        return {
            "category": "Unknown",
            "raw_analysis": text_analysis,
            "error": "Failed to parse structured data"
        }

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