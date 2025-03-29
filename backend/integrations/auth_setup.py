import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Define the scopes we need for both Gmail and Calendar
SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar'
]

def setup_google_auth():
    """Set up authentication for Google APIs."""
    creds = None
    
    # Check for token.pickle file
    token_path = os.path.join(os.path.dirname(__file__), 'google_token.pickle')
    credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    
    # Check if token file exists
    if os.path.exists(token_path):
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
    
    # If no valid credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    credentials_path, SCOPES,
                    redirect_uri='http://localhost:8000/oauth2callback'  # Explicit redirect URI
                )
                creds = flow.run_local_server(port=8000)  # Use the same port as the redirect URI
            except Exception as e:
                print(f"Error during authentication: {e}")
                print("Make sure your redirect URIs are correctly configured in the Google Cloud Console.")
                return None
        
        # Save the credentials for the next run
        with open(token_path, 'wb') as token:
            pickle.dump(creds, token)
    
    print("Authentication successful! Token saved for future use.")
    return creds

if __name__ == "__main__":
    creds = setup_google_auth()
    if creds:
        print("Setup complete. You can now use Gmail and Calendar services.")
    else:
        print("Setup failed. Please check the error message above.")