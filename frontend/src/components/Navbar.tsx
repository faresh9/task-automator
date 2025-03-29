import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New task assigned to you", time: "5m ago" },
    { id: 2, message: "Meeting scheduled for tomorrow", time: "1h ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Check and initialize dark mode
  useEffect(() => {
    // First, check if the HTML element already has the dark class
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Then check localStorage and system preference
    const shouldBeDarkMode = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Set state based on what should be the actual state
    setDarkMode(shouldBeDarkMode);
    
    // Make sure the DOM matches the state
    if (shouldBeDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    
    // Debug output
    console.log('Dark mode toggled to:', newDarkMode);
    console.log('HTML class list:', document.documentElement.classList.contains('dark') ? 'has dark' : 'no dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">TA</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Task Automator</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationsRef}>
              <button 
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none bg-gray-100 dark:bg-gray-700"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none bg-gray-100 dark:bg-gray-700"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            
            <div className="relative">
              <button className="flex text-sm rounded-full focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;