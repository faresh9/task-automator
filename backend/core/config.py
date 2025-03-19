import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# API settings
API_TITLE = "Task Automator API"
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = ["http://localhost:5173"]

# OpenAI settings
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
MODEL_ID = "ft:gpt-3.5-turbo-0125:personal:task-automator-combined:BCsiqoAn"

# Initialize global OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)