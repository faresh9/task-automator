import React from 'react';
import { Task } from '../../../services/taskService';
import { getPriorityColor, getStatusColor } from '../utils/taskStyles';
import { isOverdue } from '../utils/taskFormatters';

interface ViewTaskModalProps {
  task: Task;
  closeModal: () => void;
  openEditModal: (task: Task) => void;
  confirmDelete: (taskId: string) => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ task, closeModal, openEditModal, confirmDelete }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">{task.description}</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
            <p className="text-gray-900 dark:text-gray-100">{task.assigned_to}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
            <p className={`${isOverdue(task.deadline, task.status) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {new Date(task.deadline).toLocaleDateString()}
              {isOverdue(task.deadline, task.status) && (
                <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-0.5 px-1.5 rounded">Overdue</span>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.analysis && (
            <div className="col-span-2 mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">AI Analysis</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{task.analysis}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="btn-secondary"
          onClick={closeModal}
        >
          Close
        </button>
        
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => {
              closeModal();
              openEditModal(task);
            }}
          >
            Edit Task
          </button>
          
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            onClick={() => {
              closeModal();
              confirmDelete(task.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;