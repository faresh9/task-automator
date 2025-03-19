import json

# Input and output file paths
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_email_data.json"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\email_chat_format.jsonl"

# System message that defines the assistant's behavior
system_message = "You are an email categorization assistant that identifies the intent or category of emails."

# Read the refined data
with open(input_file, 'r') as f:
    emails = json.load(f)

# Transform to chat completion format
chat_format_data = []
for email in emails:
    # Skip incomplete entries
    if not all(key in email for key in ["Email_Body", "Category"]):
        continue
        
    # Create messages array
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": f"Categorize this email: {email['Email_Body']}"},
        {"role": "assistant", "content": f"This email falls under the {email.get('Intent', '').lower()} category."}
    ]
    
    # Add the formatted item
    chat_format_data.append({"messages": messages})

# Write to JSONL format (one JSON object per line)
with open(output_file, 'w') as f:
    for item in chat_format_data:
        f.write(json.dumps(item) + '\n')

print(f"Created {len(chat_format_data)} chat format examples in {output_file}")