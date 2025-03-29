import api from './api';

export interface Task {
  id: string;
  description: string;
  assigned_to: string;
  deadline: string;
  priority: string;
  status: string;
  analysis?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface TaskRequest {
  description: string;
  assigned_to: string;
  deadline: string;
  priority: string;
}

const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks');
    return response.data.tasks;
  },
  
  createTask: async (task: TaskRequest): Promise<Task> => {
    const response = await api.post('/api/task', task);
    return response.data;
  },
  
  updateTaskStatus: async (taskId: string, status: string): Promise<Task> => {
    const response = await api.put(`/api/task/${taskId}/status`, { status });
    return response.data;
  },
  
  createSmartTask: async (task: TaskRequest): Promise<any> => {
    const response = await api.post('/api/smart/create-task', task);
    return response.data;
  },
};

export default taskService;