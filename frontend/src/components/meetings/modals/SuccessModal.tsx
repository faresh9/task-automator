import React from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const formatDateTime = (dateTimeStr: string) => {
    return format(new Date(dateTimeStr), 'PPP p');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-500">Meeting Scheduled</h3>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Success!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result.recommendation || "Your meeting has been scheduled successfully."}
            </p>
          </div>
          
          {result.scheduled_time && (
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 mb-4 border border-green-100 dark:border-green-800">
              <div className="flex items-start">
                <CalendarDaysIcon className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Scheduled Time</h4>
                  <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                    <strong>Start:</strong> {formatDateTime(result.scheduled_time.start)}
                  </p>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    <strong>End:</strong> {formatDateTime(result.scheduled_time.end)}
                  </p>
                  
                  {result.event_details && (
                    <p className="text-green-700 dark:text-green-400 text-sm mt-2">
                      <strong>Title:</strong> {result.event_details.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;