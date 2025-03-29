import React from 'react';
import { 
  PlusIcon,
  TableCellsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

interface TaskHeaderProps {
  viewType: 'table' | 'grid';
  setViewType: (type: 'table' | 'grid') => void;
  openCreateModal: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ viewType, setViewType, openCreateModal }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Task Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create, organize, and track your tasks</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button 
            className={`p-1.5 rounded ${viewType === 'table' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
            onClick={() => setViewType('table')}
            title="Table View"
          >
            <TableCellsIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
            onClick={() => setViewType('grid')}
            title="Grid View"
          >
            <Squares2X2Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={openCreateModal}
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;