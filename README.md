# Task Automator

An intelligent workflow automation system that streamlines email processing, meeting scheduling, and task management using AI-powered workflows.

## Overview

Task Automator reduces manual effort by automatically:
- Analyzing incoming emails and determining required actions
- Creating calendar events with appropriate attendees and timing
- Converting email content into structured tasks
- Tracking all automation activities through a dashboard

## Architecture

- **n8n Workflows**: Core automation engine handling email processing, meeting creation, and task management  
- **Fine-tuned GPT-4**: AI model specifically trained for email intent recognition and classification  
- **SQLite Database**: Stores workflow processing data and provides analytics  
- **Coda Dashboard**: Collaborative interface for monitoring workflow performance  

## Components

### n8n Workflows

- `automation_refined.json`: Main workflow that orchestrates the entire automation process

### AI Integration

- Uses fine-tuned GPT-4 model for superior email understanding  
- Processes natural language to extract actionable items from emails  
- Employs vector similarity search for finding related past communications  

### Google Workspace Integration

- **Gmail**: Monitors inbox and processes incoming messages  
- **Google Calendar**: Creates and manages events based on email content  
- **Google Tasks**: Generates tasks from email content when appropriate  

## Setup Instructions

### n8n Setup

1. Install n8n:
    ```bash
    npm install n8n -g
    ```

2. Start n8n:
    ```bash
    n8n start
    ```

3. Import the workflow from `workflows/n8n/automation_refined.json`

4. Configure credentials for:
    - Gmail  
    - Google Calendar  
    - Google Tasks  
    - OpenAI  

5. Customize the workflow settings:
    - Update email filters if needed  
    - Configure the OpenAI model parameters  

### Database Setup

1. The SQLite database will be created automatically when the backend server starts  
2. No additional configuration is needed as it's a file-based database  

### Dashboard Setup

1. Access the Coda dashboard at:  
   [https://coda.io/d/Copy-of-The-n8n-Dashboard_dMRW1W5M0mo/The-n8n-Dashboard_suSHMfCn](https://coda.io/d/Copy-of-The-n8n-Dashboard_dMRW1W5M0mo/The-n8n-Dashboard_suSHMfCn)

2. Customize the dashboard by connecting it to your n8n instance:
    - Go to settings and update the n8n API URL  
    - Add your n8n API key  

### Testing

1. Use the n8n "Manual Trigger" node for testing the workflow before enabling automation  
2. Send test emails to verify each path (calendar creation, task creation, etc.)  
3. Monitor results in the Coda dashboard  

### Activate Automation

1. After successful testing, activate the Gmail Trigger node to begin automated processing  
2. Monitor the system performance through the Coda dashboard  
