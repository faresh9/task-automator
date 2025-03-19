import json

# Define mapping rules
content_mappings = {
    "Please find the attached invoice for this month.": {
        "Category": "Finance",
        "Keywords": ["invoice", "attached"],
        "Intent": "Invoice Update"
    },
    "Can we schedule a meeting next week?": {
        "Category": "Meeting",
        "Keywords": ["schedule", "meeting"],
        "Intent": "Meeting Request"
    },
    "I would like to discuss a new project opportunity.": {
        "Category": "Business",
        "Keywords": ["project", "opportunity"],
        "Intent": "Project Discussion"
    },
    "I need assistance with the software configuration.": {
        "Category": "Support",
        "Keywords": ["assistance", "software", "configuration"],
        "Intent": "Technical Support"
    }
}

# Read the original JSONL file
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\email_data_yourgpt.jsonl"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_email_data.json"

refined_data = []

with open(input_file, 'r') as f:
    for line in f:
        if line.startswith("//"):  # Skip comment lines
            continue
            
        try:
            email = json.loads(line)
            body = email["Email_Body"]
            
            # Apply mapping rules
            if body in content_mappings:
                email.update(content_mappings[body])
            
            refined_data.append(email)
        except json.JSONDecodeError:
            print(f"Error parsing line: {line}")

# Write the refined data
with open(output_file, 'w') as f:
    json.dump(refined_data, f, indent=2)

print(f"Refined {len(refined_data)} email records and saved to {output_file}")