import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TrelloService:
    def __init__(self):
        self.api_key = os.environ.get("TRELLO_API_KEY")
        self.token = os.environ.get("TRELLO_TOKEN")
        self.base_url = "https://api.trello.com/1"
        
        if not self.api_key or not self.token:
            raise ValueError("Trello API key and token must be set in environment variables.")
    
    def _get_auth_params(self):
        """Get authentication parameters for Trello API."""
        return {
            'key': self.api_key,
            'token': self.token
        }
    
    def get_boards(self):
        """Get all boards for the authenticated user."""
        try:
            url = f"{self.base_url}/members/me/boards"
            response = requests.get(url, params=self._get_auth_params())
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error fetching boards: {str(e)}")
            return []
    
    def create_board(self, name, description=None):
        """Create a new board."""
        try:
            url = f"{self.base_url}/boards"
            params = self._get_auth_params()
            params['name'] = name
            
            if description:
                params['desc'] = description
                
            response = requests.post(url, params=params)
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error creating board: {str(e)}")
            return None
    
    def get_lists(self, board_id):
        """Get all lists on a board."""
        try:
            url = f"{self.base_url}/boards/{board_id}/lists"
            response = requests.get(url, params=self._get_auth_params())
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error fetching lists: {str(e)}")
            return []
    
    def create_list(self, board_id, name):
        """Create a new list on a board."""
        try:
            url = f"{self.base_url}/lists"
            params = self._get_auth_params()
            params['name'] = name
            params['idBoard'] = board_id
            
            response = requests.post(url, params=params)
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error creating list: {str(e)}")
            return None
    
    def create_card(self, list_id, name, description=None, due=None, labels=None, members=None):
        """Create a new card in a list."""
        try:
            url = f"{self.base_url}/cards"
            params = self._get_auth_params()
            params['idList'] = list_id
            params['name'] = name
            
            if description:
                params['desc'] = description
            if due:
                params['due'] = due
                
            response = requests.post(url, params=params)
            response.raise_for_status()
            card = response.json()
            
            # Add labels if provided
            if labels and card.get('id'):
                for label in labels:
                    self.add_label_to_card(card['id'], label)
            
            # Add members if provided
            if members and card.get('id'):
                for member in members:
                    self.add_member_to_card(card['id'], member)
            
            return card
        
        except Exception as e:
            print(f"Error creating card: {str(e)}")
            return None
    
    def add_label_to_card(self, card_id, label_id):
        """Add a label to a card."""
        try:
            url = f"{self.base_url}/cards/{card_id}/idLabels"
            params = self._get_auth_params()
            params['value'] = label_id
            
            response = requests.post(url, params=params)
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error adding label: {str(e)}")
            return None
    
    def add_member_to_card(self, card_id, member_id):
        """Add a member to a card."""
        try:
            url = f"{self.base_url}/cards/{card_id}/idMembers"
            params = self._get_auth_params()
            params['value'] = member_id
            
            response = requests.post(url, params=params)
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error adding member: {str(e)}")
            return None
    
    def get_cards(self, list_id):
        """Get all cards in a list."""
        try:
            url = f"{self.base_url}/lists/{list_id}/cards"
            response = requests.get(url, params=self._get_auth_params())
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error fetching cards: {str(e)}")
            return []
    
    def move_card(self, card_id, list_id):
        """Move a card to a different list."""
        try:
            url = f"{self.base_url}/cards/{card_id}"
            params = self._get_auth_params()
            params['idList'] = list_id
            
            response = requests.put(url, params=params)
            response.raise_for_status()
            return response.json()
        
        except Exception as e:
            print(f"Error moving card: {str(e)}")
            return None