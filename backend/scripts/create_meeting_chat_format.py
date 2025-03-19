import json

# Input and output file paths
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_meeting_data.json"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\meeting_chat_format.jsonl"

# System message that defines the assistant's behavior
system_message = "You are a meeting analysis assistant that identifies meeting types and intents."

# Read the refined data
with open(input_file, 'r') as f:
    meetings = json.load(f)

# Transform to chat completion format
chat_format_data = []
for meeting in meetings:
    # Create messages array
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": f"Analyze this meeting: The {meeting['Meeting_Type']} for {meeting['Attendees']} scheduled on {meeting['Date']} at {meeting['Time']} with status {meeting['Status']}."},
        {"role": "assistant", "content": f"This is a {meeting['Intent'].lower()} meeting with {meeting['Priority'].lower()} priority, focused on {meeting['Topic'].lower()}."}
    ]
    
    # Add the formatted item
    chat_format_data.append({"messages": messages})

# Write to JSONL format (one JSON object per line)
with open(output_file, 'w') as f:
    for item in chat_format_data:
        f.write(json.dumps(item) + '\n')

print(f"Created {len(chat_format_data)} chat format examples in {output_file}")