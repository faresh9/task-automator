import React from 'react';
import { Task } from '../../../services/taskService';
import TaskCard from './TaskCard';

interface TaskGridProps {
  tasks: Task[];
  openViewModal: (task: Task) => void;
  openEditModal: (task: Task) => void;
  confirmDelete: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, openViewModal, openEditModal, confirmDelete, updateTaskStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          openViewModal={openViewModal}
          openEditModal={openEditModal}
          confirmDelete={confirmDelete}
          updateTaskStatus={updateTaskStatus}
        />
      ))}
    </div>
  );
};

export default TaskGrid;