import { Task } from '../../../services/taskService';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString();
  }
};

export const isOverdue = (dateString: string, status: string) => {
  if (status === 'Done') return false;
  const date = new Date(dateString);
  const today = new Date();
  return date < today && date.toDateString() !== today.toDateString();
};