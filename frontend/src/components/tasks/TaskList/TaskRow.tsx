import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon
} from '@heroicons/react/24/outline';
import { Task } from '../../../services/taskService';
import { getPriorityColor, getStatusColor } from '../utils/taskStyles';
import { formatDate, isOverdue } from '../utils/taskFormatters';

interface TaskRowProps {
  task: Task;
  openViewModal: (task: Task) => void;
  openEditModal: (task: Task) => void;
  confirmDelete: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, openViewModal, openEditModal, confirmDelete, updateTaskStatus }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.description}</div>
        {task.tags && (
          <div className="flex mt-1 flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100">{task.assigned_to}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${isOverdue(task.deadline, task.status) ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-100'}`}>
          {formatDate(task.deadline)}
          {isOverdue(task.deadline, task.status) && (
            <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-0.5 px-1.5 rounded">Overdue</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select 
          className="block w-full px-2 py-1 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
          value={task.status}
          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => openViewModal(task)}
            title="View Task"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => openEditModal(task)}
            title="Edit Task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => confirmDelete(task.id)}
            title="Delete Task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskRow;