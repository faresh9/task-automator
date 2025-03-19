import json
from datetime import datetime

# Define mapping rules for meeting categorization
meeting_types = {
    "Team A": ["Project Status", "Sprint Planning", "Daily Standup"],
    "Team B": ["Product Demo", "Code Review", "Sprint Retrospective"],
    "Management": ["Strategy Discussion", "Budget Review", "Performance Review"]
}

locations = ["Conference Room A", "Virtual - Zoom", "Conference Room B", "Virtual - Teams"]
durations = ["30 minutes", "1 hour", "2 hours"]

# Define priority based on organizer patterns
priority_mapping = {
    "Michael Brown": "High",
    "Alice Smith": "Medium",
    "John Doe": "Standard"
}

# Map topics based on team and status
def determine_topic(attendees, status):
    if attendees == "Management":
        return "Strategic Planning" if status == "Pending" else "Operational Review"
    elif attendees == "Team A":
        return "Frontend Development" if status == "Scheduled" else "Feature Planning"
    elif attendees == "Team B":
        return "Backend Integration" if status == "Completed" else "API Development"
    return "General Discussion"

# Map keywords based on topic
def generate_keywords(topic, attendees):
    keywords = []
    if "Development" in topic:
        keywords.extend(["code", "development", "implementation"])
    if "Planning" in topic:
        keywords.extend(["roadmap", "timeline", "milestones"])
    if "Review" in topic:
        keywords.extend(["evaluation", "assessment", "feedback"])
    if attendees == "Management":
        keywords.append("strategy")
    return keywords

# Read the original JSONL file
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\meeting_data_yourgpt.jsonl"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_meeting_data.json"

refined_data = []
import random

with open(input_file, 'r') as f:
    for line in f:
        if line.startswith("//"):  # Skip comment lines
            continue
            
        try:
            meeting = json.loads(line)
            
            # Get existing data
            attendees = meeting["Attendees"]
            status = meeting["Status"]
            organizer = meeting["Organizer"]
            
            # Determine meeting type based on attendees
            meeting_type = random.choice(meeting_types.get(attendees, ["Discussion"]))
            
            # Generate topic
            topic = determine_topic(attendees, status)
            
            # Generate keywords
            keywords = generate_keywords(topic, attendees)
            
            # Determine priority
            priority = priority_mapping.get(organizer, "Standard")
            
            # Add location and duration
            location = random.choice(locations)
            duration = random.choice(durations)
            
            # Determine intent
            if "Review" in meeting_type:
                intent = "Evaluation Session"
            elif "Planning" in meeting_type:
                intent = "Planning Session"
            elif "Demo" in meeting_type:
                intent = "Demonstration"
            elif "Standup" in meeting_type:
                intent = "Status Update"
            else:
                intent = "Team Discussion"
            
            # Add new fields to meeting data
            meeting.update({
                "Meeting_Type": meeting_type,
                "Topic": topic,
                "Keywords": keywords,
                "Priority": priority,
                "Location": location,
                "Duration": duration,
                "Intent": intent
            })
            
            refined_data.append(meeting)
        except json.JSONDecodeError:
            print(f"Error parsing line: {line}")

# Write the refined data
with open(output_file, 'w') as f:
    json.dump(refined_data, f, indent=2)

print(f"Refined {len(refined_data)} meeting records and saved to {output_file}")