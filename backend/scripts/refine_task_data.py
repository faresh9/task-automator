import json
from datetime import datetime
import random

# Define mapping rules for task categorization
task_categories = {
    "Update client report": "Reporting",
    "Review financial documents": "Finance",
    "Fix bug in automation script": "Development",
    "Prepare project proposal": "Project Planning"
}

# Define departments based on task description
departments = {
    "Update client report": "Client Relations",
    "Review financial documents": "Finance",
    "Fix bug in automation script": "IT",
    "Prepare project proposal": "Business Development"
}

# Define keywords based on task description
keywords_mapping = {
    "Update client report": ["report", "client", "update", "documentation"],
    "Review financial documents": ["finance", "review", "accounting", "documents"],
    "Fix bug in automation script": ["bug", "code", "debug", "automation", "script"],
    "Prepare project proposal": ["project", "proposal", "planning", "client", "presentation"]
}

# Define intent based on task description and status
def determine_intent(task_description, status, priority):
    base_intent = ""
    if "Update" in task_description:
        base_intent = "Information Update"
    elif "Review" in task_description:
        base_intent = "Evaluation"
    elif "Fix" in task_description:
        base_intent = "Problem Resolution"
    elif "Prepare" in task_description:
        base_intent = "Creation"
    
    # Add urgency modifier based on priority and status
    if priority == "High" and status == "Not Started":
        return f"Urgent {base_intent}"
    elif status == "In Progress":
        return f"Ongoing {base_intent}"
    elif status == "Completed":
        return f"Completed {base_intent}"
    else:
        return base_intent

# Estimate hours based on task complexity and priority
def estimate_hours(task_description, priority):
    base_hours = 0
    if "Update" in task_description:
        base_hours = 2
    elif "Review" in task_description:
        base_hours = 3
    elif "Fix" in task_description:
        base_hours = 4
    elif "Prepare" in task_description:
        base_hours = 6
        
    # Adjust for priority
    if priority == "High":
        return base_hours * 1.5
    elif priority == "Medium":
        return base_hours
    else:  # Low
        return base_hours * 0.8

# Read the original JSONL file
input_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\task_data_yourgpt.jsonl"
output_file = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\refined_task_data.json"

refined_data = []

with open(input_file, 'r') as f:
    for line in f:
        if line.startswith("//"):  # Skip comment lines
            continue
            
        try:
            task = json.loads(line)
            
            # Get existing data
            task_description = task["Task_Description"]
            priority = task["Priority"]
            status = task["Status"]
            
            # Determine category
            category = task_categories.get(task_description, "General")
            
            # Determine department
            department = departments.get(task_description, "General")
            
            # Get keywords
            keywords = keywords_mapping.get(task_description, ["task"])
            
            # Determine intent
            intent = determine_intent(task_description, status, priority)
            
            # Estimate hours
            hours = estimate_hours(task_description, priority)
            
            # Add complexity
            if priority == "High":
                complexity = "Complex"
            elif priority == "Medium":
                complexity = "Moderate"
            else:
                complexity = "Simple"
            
            # Add tags based on all the information
            tags = [category.lower(), priority.lower()]
            if status == "Not Started" and priority == "High":
                tags.append("urgent")
            if "bug" in keywords:
                tags.append("technical")
                
            # Add new fields to task data
            task.update({
                "Category": category,
                "Department": department,
                "Keywords": keywords,
                "Intent": intent,
                "Estimated_Hours": round(hours, 1),
                "Complexity": complexity,
                "Tags": tags
            })
            
            refined_data.append(task)
        except json.JSONDecodeError:
            print(f"Error parsing line: {line}")

# Write the refined data
with open(output_file, 'w') as f:
    json.dump(refined_data, f, indent=2)

print(f"Refined {len(refined_data)} task records and saved to {output_file}")