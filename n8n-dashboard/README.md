---
noteId: "f19133601af511f0bddb97fbdd5348ba"
tags: []

---

# n8n Dashboard

This project is a frontend dashboard for managing and visualizing workflows in n8n. It provides a user-friendly interface to interact with workflows, view execution history, and manage settings.

## Project Structure

- **public/**: Contains static files.
  - **index.html**: The main HTML file that serves as the entry point for the application.
  - **favicon.ico**: The favicon for the application.

- **src/**: Contains the source code for the application.
  - **api/**: Functions to interact with the n8n API.
    - **n8nApi.js**: Handles requests and responses for workflows.
    - **authService.js**: Manages authentication-related functions.
  - **components/**: React components for the application.
    - **common/**: Common components used throughout the app.
      - **Header.jsx**: Renders the header of the application.
      - **Sidebar.jsx**: Provides a sidebar for navigation.
      - **Loading.jsx**: Displays a loading spinner or message.
    - **dashboard/**: Components related to the dashboard view.
      - **WorkflowCard.jsx**: Displays a card for each workflow.
      - **WorkflowStats.jsx**: Presents statistics related to workflows.
      - **ExecutionHistory.jsx**: Shows the history of workflow executions.
    - **workflow/**: Components related to individual workflows.
      - **WorkflowDetails.jsx**: Displays detailed information about a workflow.
      - **ExecutionList.jsx**: Lists executions of a specific workflow.
      - **NodeVisualizer.jsx**: Visualizes the nodes of a workflow.
    - **settings/**: Components for managing settings.
      - **ApiSettings.jsx**: Allows users to configure API settings.
      - **UserProfile.jsx**: Enables users to view and edit their profile.
  - **pages/**: Page components for routing.
    - **Dashboard.jsx**: Renders the main dashboard view.
    - **WorkflowPage.jsx**: Displays details of a selected workflow.
    - **LoginPage.jsx**: Handles user login functionality.
    - **SettingsPage.jsx**: Allows users to manage their settings.
  - **context/**: Context providers for managing state.
    - **AuthContext.jsx**: Manages authentication state.
    - **WorkflowContext.jsx**: Manages workflow-related state.
  - **hooks/**: Custom hooks for encapsulating logic.
    - **useN8nApi.js**: Logic for making API calls to n8n.
    - **useWorkflowStatus.js**: Manages the status of workflows.
  - **utils/**: Utility functions and constants.
    - **formatters.js**: Functions for formatting data.
    - **constants.js**: Defines constants used throughout the app.
  - **styles/**: CSS files for styling the application.
    - **global.css**: Global styles for the application.
    - **components.css**: Styles specific to individual components.
  - **App.jsx**: Main application component that sets up routing.
  - **index.js**: Entry point for the React application.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd n8n-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Log in to access the dashboard.
- View and manage workflows, including execution history and statistics.
- Adjust settings in the user profile and API settings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.