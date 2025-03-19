import os
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle

# If modifying these SCOPES, delete the token.pickle file
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

class GmailService:
    def __init__(self):
        self.service = self._get_gmail_service()
        
    def _get_gmail_service(self):
        """Get authenticated Gmail service."""
        creds = None
        # Token file stores the user's access and refresh tokens
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
                flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save the credentials for the next run
            with open(token_path, 'wb') as token:
                pickle.dump(creds, token)
        
        # Build the Gmail service
        return build('gmail', 'v1', credentials=creds)
    
    def get_unread_emails(self, max_results=10):
        """Fetch unread emails from the inbox."""
        try:
            # Get unread messages from inbox
            results = self.service.users().messages().list(
                userId='me',
                labelIds=['INBOX', 'UNREAD'],
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            emails = []
            
            if not messages:
                return []
            
            for message in messages:
                msg = self.service.users().messages().get(userId='me', id=message['id']).execute()
                
                # Extract headers
                headers = msg['payload']['headers']
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                
                # Extract body
                body = ""
                if 'parts' in msg['payload']:
                    for part in msg['payload']['parts']:
                        if part['mimeType'] == 'text/plain':
                            body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                            break
                elif 'body' in msg['payload'] and 'data' in msg['payload']['body']:
                    body = base64.urlsafe_b64decode(msg['payload']['body']['data']).decode('utf-8')
                
                emails.append({
                    'id': message['id'],
                    'subject': subject,
                    'sender': sender,
                    'body': body,
                    'date': msg['internalDate']
                })
            
            return emails
        
        except Exception as e:
            print(f"Error fetching emails: {str(e)}")
            return []
    
    def send_email(self, to, subject, body):
        """Send an email."""
        try:
            message = MIMEText(body)
            message['to'] = to
            message['subject'] = subject
            
            # Encode message
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            # Send message
            sent_message = self.service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()
            
            return {
                'success': True,
                'message_id': sent_message['id']
            }
        
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def apply_label(self, message_id, label_name):
        """Apply a label to a message. Creates the label if it doesn't exist."""
        try:
            # Check if label exists
            results = self.service.users().labels().list(userId='me').execute()
            labels = results.get('labels', [])
            
            # Find the label ID if it exists
            label_id = None
            for label in labels:
                if label['name'] == label_name:
                    label_id = label['id']
                    break
            
            # Create the label if it doesn't exist
            if not label_id:
                label = self.service.users().labels().create(
                    userId='me',
                    body={
                        'name': label_name,
                        'labelListVisibility': 'labelShow',
                        'messageListVisibility': 'show'
                    }
                ).execute()
                label_id = label['id']
            
            # Apply the label to the message
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={
                    'addLabelIds': [label_id]
                }
            ).execute()
            
            return {
                'success': True,
                'label_id': label_id
            }
        
        except Exception as e:
            print(f"Error applying label: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }