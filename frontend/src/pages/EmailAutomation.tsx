import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import emailService, { Email, EmailSendRequest, EmailProcessRequest } from '../services/emailService';

function EmailAutomation() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isProcessingEmail, setIsProcessingEmail] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { register: registerSend, handleSubmit: handleSubmitSend, reset: resetSend, formState: { errors: errorsSend } } = useForm<EmailSendRequest>();
  const { register: registerProcess, handleSubmit: handleSubmitProcess, reset: resetProcess, formState: { errors: errorsProcess } } = useForm<EmailProcessRequest>();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const data = await emailService.getUnreadEmails();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const onSendEmail = async (data: EmailSendRequest) => {
    try {
      const result = await emailService.sendEmail(data);
      if (result.success) {
        toast.success('Email sent successfully');
        setIsComposeOpen(false);
        resetSend();
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const onProcessEmail = async (data: EmailProcessRequest) => {
    try {
      setIsProcessingEmail(true);
      const result = await emailService.processEmail(data);
      setAnalysisResult(result);
      toast.success('Email processed successfully');
    } catch (error) {
      console.error('Error processing email:', error);
      toast.error('Failed to process email');
    } finally {
      setIsProcessingEmail(false);
    }
  };

  const formatEmailDate = (dateString: string) => {
    const date = new Date(parseInt(dateString));
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsComposeOpen(true)}
        >
          Compose Email
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-1 card max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Unread Emails</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {emails.length > 0 ? (
                emails.map(email => (
                  <div 
                    key={email.id} 
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-primary-50 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{email.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatEmailDate(email.date)}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{email.sender}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{email.body.substring(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 py-4 text-center">No unread emails</p>
              )}
              
              <button 
                className="w-full py-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                onClick={fetchEmails}
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Email Detail / AI Processing */}
        <div className="lg:col-span-2">
          {selectedEmail ? (
            <div className="space-y-6">
              <div className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">From: {selectedEmail.sender}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(parseInt(selectedEmail.date)).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Process with AI</h3>
                <form onSubmit={handleSubmitProcess(onProcessEmail)}>
                  <input 
                    type="hidden" 
                    {...registerProcess('email_text', { value: `From: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}` })} 
                  />
                  <button 
                    type="submit" 
                    className="btn-primary w-full"
                    disabled={isProcessingEmail}
                  >
                    {isProcessingEmail ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Process Email with AI'}
                  </button>
                </form>
              </div>

              {analysisResult && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-gray-800 dark:text-gray-200">{analysisResult.analysis}</p>
                  </div>
                  
                  {analysisResult.actions_taken.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Actions Taken:</h4>
                      <ul className="space-y-2">
                        {analysisResult.actions_taken.map((action: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full px-2 py-1 mr-2">
                              {action.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {action.type === 'task_created' 
                                ? `Created task: ${action.details.description}` 
                                : action.type === 'calendar_event_created'
                                  ? `Created event: ${action.details.summary}`
                                  : JSON.stringify(action)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center p-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Select an email from the list</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Or click "Compose Email" to write a new message</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Compose Email</h3>
                <button onClick={() => setIsComposeOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitSend(onSendEmail)} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="recipient@example.com"
                    {...registerSend('to', { 
                      required: 'Recipient email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errorsSend.to && (
                    <p className="mt-1 text-sm text-red-600">{errorsSend.to.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Email subject"
                    {...registerSend('subject', { required: 'Subject is required' })}
                  />
                  {errorsSend.subject && (
                    <p className="mt-1 text-sm text-red-600">{errorsSend.subject.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="input-field"
                    placeholder="Your message"
                    {...registerSend('body', { required: 'Message body is required' })}
                  ></textarea>
                  {errorsSend.body && (
                    <p className="mt-1 text-sm text-red-600">{errorsSend.body.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailAutomation;