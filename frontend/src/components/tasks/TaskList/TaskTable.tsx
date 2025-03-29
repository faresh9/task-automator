import React from 'react';
import { Task } from '../../../services/taskService';
import TaskRow from './TaskRow';

interface TaskTableProps {
  tasks: Task[];
  openViewModal: (task: Task) => void;
  openEditModal: (task: Task) => void;
  confirmDelete: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, openViewModal, openEditModal, confirmDelete, updateTaskStatus }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task) => (
            <TaskRow 
              key={task.id}
              task={task}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              confirmDelete={confirmDelete}
              updateTaskStatus={updateTaskStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;