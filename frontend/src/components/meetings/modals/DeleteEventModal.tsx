import React from 'react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  event: any;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  event
}) => {
  if (!event) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-500">Delete Event</h3>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              disabled={isDeleting}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Delete "{event.summary}"
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;