export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Done':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};