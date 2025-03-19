import json

# Input and output file paths
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_task_data.json"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\task_chat_format.jsonl"

# System message that defines the assistant's behavior
system_message = "You are a task analysis assistant that helps categorize and prioritize tasks."

# Read the refined data
with open(input_file, 'r') as f:
    tasks = json.load(f)

# Transform to chat completion format
chat_format_data = []
for task in tasks:
    # Create messages array
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": f"Analyze this task: {task['Task_Description']} with {task['Priority']} priority, assigned to {task['Assigned_To']} with deadline {task['Deadline']} and current status {task['Status']}."},
        {"role": "assistant", "content": f"This is a {task['Category'].lower()} task with {task['Intent'].lower()}. It belongs to the {task['Department']} department with {task['Complexity'].lower()} complexity requiring approximately {task['Estimated_Hours']} hours to complete."}
    ]
    
    # Add the formatted item
    chat_format_data.append({"messages": messages})

# Write to JSONL format (one JSON object per line)
with open(output_file, 'w') as f:
    for item in chat_format_data:
        f.write(json.dumps(item) + '\n')

print(f"Created {len(chat_format_data)} chat format examples in {output_file}")