import React from 'react';
import { 
  ArrowUpCircleIcon,
  ArrowDownCircleIcon
} from '@heroicons/react/24/outline';

interface TaskControlsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortField: 'deadline' | 'priority';
  setSortField: (field: 'deadline' | 'priority') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const TaskControls: React.FC<TaskControlsProps> = ({
  activeFilter,
  setActiveFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'To Do', 'In Progress', 'Done'].map(filter => (
          <button 
            key={filter}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Sorting Controls */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
        <div className="flex items-center">
          <button 
            className={`px-3 py-1 text-sm rounded-l-md border border-r-0 ${
              sortField === 'deadline' 
                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300' 
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setSortField('deadline')}
          >
            Deadline
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-r-md border ${
              sortField === 'priority' 
                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300' 
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setSortField('priority')}
          >
            Priority
          </button>
        </div>
        <button 
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDirection === 'asc' 
            ? <ArrowUpCircleIcon className="h-5 w-5" /> 
            : <ArrowDownCircleIcon className="h-5 w-5" />
          }
        </button>
      </div>
    </div>
  );
};

export default TaskControls;