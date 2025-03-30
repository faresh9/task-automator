# Task Automator

This project automates email processing, meeting scheduling, and task management using n8n workflows.

## Architecture

- **n8n Workflows**: Handle email processing, meeting creation, and task management
- **Backend API**: Provides minimal endpoints for AI analysis
- **Frontend**: User interface for monitoring and configuration

## Components

### n8n Workflows

- `email-processing.json`: Analyzes incoming emails and routes them appropriately
- `calendar-events.json`: Creates and manages calendar events
- `task-management.json`: Creates and updates tasks in Trello

### Backend API (Minimal)

- Email categorization endpoint
- AI analysis utilities

### Legacy Code

The original API-based implementation is preserved in the `api-legacy` branch.

## Setup Instructions

### n8n Setup

1. Install n8n:
npm install n8n -g

2. Start n8n:
n8n start


3. Import workflows from the `workflows/n8n/` directory

4. Configure credentials for:
- Gmail
- Google Calendar
- Trello
- OpenAI

5. Activate the workflows

### API Setup (For AI Services)

1. Install dependencies:
pip install -r requirements.txt

2. Configure environment variables:
cp .env.example .env

Edit .env with your API keys

3. Start the API:

uvicorn backend.main:app --reload