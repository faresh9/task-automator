import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon
} from '@heroicons/react/24/outline';
import { Task } from '../../../services/taskService';
import { getPriorityColor, getStatusColor } from '../utils/taskStyles';
import { formatDate, isOverdue } from '../utils/taskFormatters';

interface TaskCardProps {
  task: Task;
  openViewModal: (task: Task) => void;
  openEditModal: (task: Task) => void;
  confirmDelete: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, openViewModal, openEditModal, confirmDelete, updateTaskStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className={`h-2 ${getPriorityColor(task.priority)}`}></div>
      <div className="p-5">
        <div className="flex justify-between">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <div className="flex items-center space-x-1">
            <button 
              className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => openViewModal(task)}
              title="View Task"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button 
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => openEditModal(task)}
              title="Edit Task"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button 
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => confirmDelete(task.id)}
              title="Delete Task"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-gray-100">{task.description}</h3>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-24">Assigned to:</span>
            <span className="text-gray-900 dark:text-gray-100">{task.assigned_to}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-24">Deadline:</span>
            <span className={`${isOverdue(task.deadline, task.status) ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatDate(task.deadline)}
              {isOverdue(task.deadline, task.status) && (
                <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-0.5 px-1.5 rounded">Overdue</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-24">Priority:</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Update Status:
          </label>
          <select 
            className="block w-full px-2 py-1.5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;