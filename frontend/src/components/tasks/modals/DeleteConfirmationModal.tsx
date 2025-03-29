import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationModalProps {
  taskId: string;
  cancelDelete: () => void;
  deleteTask: (taskId: string) => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ taskId, cancelDelete, deleteTask }) => {
  return (
    <div className="text-center">
      <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Task</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
      
      <div className="mt-6 flex justify-center space-x-3">
        <button
          className="btn-secondary"
          onClick={cancelDelete}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          onClick={() => deleteTask(taskId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;