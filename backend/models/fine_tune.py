from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
openai_key = os.environ.get("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.")

# Initialize the client
client = OpenAI(api_key=openai_key)

try:
    # First, combine all datasets
    print("Combining all datasets...")
    
    dataset_paths = [
        "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\email_chat_format.jsonl",
        "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\meeting_chat_format.jsonl",
        "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\task_chat_format.jsonl"
    ]
    
    combined_output = "c:\\Users\\fares\\Documents\\GitHub\\task-automator\\backend\\data\\combined_datasets.jsonl"
    
    with open(combined_output, 'w') as outfile:
        for path in dataset_paths:
            try:
                with open(path, 'r') as infile:
                    for line in infile:
                        if line.strip():
                            outfile.write(line)
            except FileNotFoundError:
                print(f"Warning: Dataset {path} not found. Skipping.")
    
    print(f"Combined dataset created at {combined_output}")
    
    # Upload the combined training file
    print("Uploading combined dataset for fine-tuning...")
    with open(combined_output, "rb") as file:
        training_file = client.files.create(
            file=file,
            purpose="fine-tune"
        )
    
    # Start fine-tuning using the new API
    print(f"Starting fine-tuning job with file ID: {training_file.id}")
    fine_tune_job = client.fine_tuning.jobs.create(
        training_file=training_file.id,
        model="gpt-3.5-turbo",
        suffix="task-automator-combined"  # Custom name suffix for easy identification
    )
    
    print(f"Fine-tuning job started. Job ID: {fine_tune_job.id}")
    
    # To check the status of your fine-tuning job later:
    job_status = client.fine_tuning.jobs.retrieve(fine_tune_job.id)
    print(f"Current job status: {job_status.status}")
    
    print("\nOnce fine-tuning completes, you can use your model with:")
    print(f"ft:gpt-3.5-turbo:openai:task-automator-combined:{fine_tune_job.id[:8]}")

except Exception as e:
    print(f"Error occurred: {str(e)}")