import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TaskManagement from './pages/TaskManagement';
import EmailAutomation from './pages/EmailAutomation';
import MeetingScheduling from './pages/MeetingScheduling';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 lg:p-8 overflow-auto h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<TaskManagement />} />
                <Route path="/emails" element={<EmailAutomation />} />
                <Route path="/meetings" element={<MeetingScheduling />} />
              </Routes>
            </div>
          </div>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;