import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

function Sidebar() {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, path: '/tasks' },
    { name: 'Email', icon: EnvelopeIcon, path: '/emails' },
    { name: 'Meetings', icon: CalendarIcon, path: '/meetings' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
    { name: 'Help', icon: QuestionMarkCircleIcon, path: '/help' },
  ];

  return (
    <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-8">
        <div className="mt-2 mb-6">
          <div className="px-4 py-3 rounded-lg bg-primary-50 dark:bg-gray-700/50 border border-primary-100 dark:border-gray-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white flex items-center justify-center">
                  <span className="text-sm font-medium">UA</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">User Account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pro Account</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Main Menu</h3>
          <ul className="mt-3 space-y-1">
            {navigationItems.slice(0, 4).map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${
                    location.pathname === item.path
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span>{item.name}</span>
                  
                  {/* Show active indicator */}
                  {location.pathname === item.path && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Other</h3>
          <ul className="mt-3 space-y-1">
            {navigationItems.slice(4).map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${
                    location.pathname === item.path
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span>{item.name}</span>
                  
                  {location.pathname === item.path && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">Application Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;