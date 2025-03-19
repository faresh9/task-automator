import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmailAutomation from './pages/EmailAutomation';
import MeetingScheduling from './pages/MeetingScheduling';
import TaskManagement from './pages/TaskManagement';
import { useState } from 'react';
import './App.css';
import EmailTab from './components/EmailTab';
import MeetingTab from './components/MeetingTab';
import TaskTab from './components/TaskTab';

function App() {
  const [activeTab, setActiveTab] = useState('email');

  return (
    <div className="app-container">
      <header>
        <h1>Task Automator</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'email' ? 'active' : ''} 
            onClick={() => setActiveTab('email')}
          >
            Email Assistant
          </button>
          <button 
            className={activeTab === 'meeting' ? 'active' : ''} 
            onClick={() => setActiveTab('meeting')}
          >
            Meeting Scheduler
          </button>
          <button 
            className={activeTab === 'task' ? 'active' : ''} 
            onClick={() => setActiveTab('task')}
          >
            Task Manager
          </button>
        </div>
      </header>
      
      <main>
        {activeTab === 'email' && <EmailTab />}
        {activeTab === 'meeting' && <MeetingTab />}
        {activeTab === 'task' && <TaskTab />}
      </main>
    </div>
  );
}

export default App;