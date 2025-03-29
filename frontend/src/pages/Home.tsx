import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import taskService, { Task } from '../services/taskService';
import emailService, { Email } from '../services/emailService';
import meetingService from '../services/meetingService';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    tasks: true,
    emails: true,
    events: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
        setLoading(prev => ({ ...prev, tasks: false }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(prev => ({ ...prev, tasks: false }));
      }

      try {
        // Fetch emails
        const emailsData = await emailService.getUnreadEmails();
        setEmails(emailsData);
        setLoading(prev => ({ ...prev, emails: false }));
      } catch (error) {
        console.error('Error fetching emails:', error);
        setLoading(prev => ({ ...prev, emails: false }));
      }

      try {
        // Fetch calendar events
        const eventsData = await meetingService.getUpcomingEvents();
        setEvents(eventsData);
        setLoading(prev => ({ ...prev, events: false }));
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Welcome to Task Automator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your personal productivity assistant</p>
        </div>
        <div className="flex gap-3">
          <Link to="/tasks" className="btn-primary flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            <span>New Task</span>
          </Link>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200">Tasks</h3>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasks.length}</p>
            </div>
          </div>
          <Link to="/tasks" className="text-blue-600 dark:text-blue-400 flex items-center gap-1 text-sm hover:underline">
            View all tasks <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200">Emails</h3>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{emails.length}</p>
            </div>
          </div>
          <Link to="/emails" className="text-purple-600 dark:text-purple-400 flex items-center gap-1 text-sm hover:underline">
            View all emails <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-emerald-900 dark:text-emerald-200">Meetings</h3>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{events.length}</p>
            </div>
          </div>
          <Link to="/meetings" className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-sm hover:underline">
            View all meetings <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <div className="card border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {loading.tasks ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-0.5 bg-gray-100 dark:bg-gray-800 my-3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 p-4 rounded-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className={`w-1 h-10 rounded-full mr-3 ${
                      task.priority === 'High' ? 'bg-red-500' : 
                      task.priority === 'Medium' ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{task.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{task.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No tasks available</p>
                  <Link to="/tasks" className="mt-3 inline-block btn-primary">Create your first task</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Similar enhanced cards for Emails and Meetings */}
        <div className="card border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Unread Emails</h2>
            <Link to="/emails" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {loading.emails ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-0.5 bg-gray-100 dark:bg-gray-800 my-3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {emails.slice(0, 3).map(email => (
                <div key={email.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 p-4 rounded-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{email.subject}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">From: {email.sender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {emails.length === 0 && (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No unread emails</p>
                  <Link to="/emails" className="mt-3 inline-block btn-primary">Compose your first email</Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
            <Link to="/meetings" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {loading.events ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-0.5 bg-gray-100 dark:bg-gray-800 my-3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 p-4 rounded-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{event.summary}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'All day'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No upcoming meetings</p>
                  <Link to="/meetings" className="mt-3 inline-block btn-primary">Schedule your first meeting</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;