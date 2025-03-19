import json

# Input and output file paths
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_email_data.json"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\email_prompt_completion.jsonl"

# Read the refined data
with open(input_file, 'r') as f:
    emails = json.load(f)

# Transform to prompt-completion format
prompt_completion_data = []
for email in emails:
    # Skip incomplete entries
    if not all(key in email for key in ["Email_Body", "Category"]):
        continue
        
    # Create the prompt-completion pair
    prompt = f"Categorize this email: {email['Email_Body']} ->"
    
    # You can choose either Category or Intent for the completion
    # completion = email.get("Category", "")  # Using Category
    completion = email.get("Intent", "")      # Using Intent
    
    prompt_completion_data.append({
        "prompt": prompt,
        "completion": f" {completion.lower()}"  # Space before completion as in your examples
    })

# Write to JSONL format (one JSON object per line)
with open(output_file, 'w') as f:
    for item in prompt_completion_data:
        f.write(json.dumps(item) + '\n')

print(f"Created {len(prompt_completion_data)} prompt-completion pairs in {output_file}")