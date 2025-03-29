import React from 'react'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import taskService, { Task, TaskRequest } from '../../services/taskService';
import TaskHeader from './TaskHeader';
import TaskControls from './TaskControls';
import TaskTable from './TaskList/TaskTable';
import TaskGrid from './TaskList/TaskGrid';
import CreateEditTaskModal from './modals/CreateEditTaskModal';
import ViewTaskModal from './modals/ViewTaskModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [useAI, setUseAI] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'deadline' | 'priority'>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<TaskRequest>();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, activeFilter, sortField, sortDirection]);

  const applyFiltersAndSort = () => {
    let result = [...tasks];
    
    // Apply filter
    if (activeFilter !== 'All') {
      result = result.filter(task => task.status === activeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'deadline') {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'priority') {
        const priorityMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Urgent': 4 };
        const priorityA = priorityMap[a.priority as keyof typeof priorityMap] || 0;
        const priorityB = priorityMap[b.priority as keyof typeof priorityMap] || 0;
        return sortDirection === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      }
      return 0;
    });
    
    setFilteredTasks(result);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaskRequest) => {
    try {
      if (modalType === 'create') {
        if (useAI) {
          const result = await taskService.createSmartTask(data);
          setTasks(prev => [...prev, result.task_details]);
          setAnalysis(result.analysis);
          toast.success('Task created with AI analysis');
        } else {
          const task = await taskService.createTask(data);
          setTasks(prev => [...prev, task]);
          toast.success('Task created successfully');
        }
      } else if (modalType === 'edit' && selectedTask) {
        const updatedTask = await taskService.updateTask(selectedTask.id, data);
        setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
        toast.success('Task updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error with task operation:', error);
      toast.error(modalType === 'create' ? 'Failed to create task' : 'Failed to update task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success(`Task status updated to ${status}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      setIsDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedTask(null);
    setAnalysis('');
    setUseAI(false);
    reset({
      description: '',
      assigned_to: '',
      deadline: '',
      priority: 'Medium'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setModalType('edit');
    setSelectedTask(task);
    setUseAI(false);
    setAnalysis('');
    
    // Format the date to YYYY-MM-DD for the input field
    const formattedDate = new Date(task.deadline).toISOString().split('T')[0];
    
    // Populate the form
    setValue('description', task.description);
    setValue('assigned_to', task.assigned_to);
    setValue('deadline', formattedDate);
    setValue('priority', task.priority);
    
    setIsModalOpen(true);
  };

  const openViewModal = (task: Task) => {
    setModalType('view');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    reset();
  };

  const confirmDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TaskHeader 
        viewType={viewType} 
        setViewType={setViewType} 
        openCreateModal={openCreateModal} 
      />

      <TaskControls 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      {/* Task List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md py-12 text-center">
              <ClipboardDocumentListIcon className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {activeFilter === 'All'
                  ? "You don't have any tasks yet. Create a new task to get started."
                  : `No ${activeFilter.toLowerCase()} tasks found. Try a different filter.`
                }
              </p>
              <div className="mt-6">
                <button
                  className="btn-primary"
                  onClick={openCreateModal}
                >
                  Create New Task
                </button>
              </div>
            </div>
          ) : (
            <>
              {viewType === 'table' ? (
                <TaskTable 
                  tasks={filteredTasks}
                  openViewModal={openViewModal}
                  openEditModal={openEditModal}
                  confirmDelete={confirmDelete}
                  updateTaskStatus={updateTaskStatus}
                />
              ) : (
                <TaskGrid 
                  tasks={filteredTasks}
                  openViewModal={openViewModal}
                  openEditModal={openEditModal}
                  confirmDelete={confirmDelete}
                  updateTaskStatus={updateTaskStatus}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {modalType === 'create' ? 'Create New Task' : 
                   modalType === 'edit' ? 'Edit Task' : 'Task Details'}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {modalType === 'view' && selectedTask ? (
                <ViewTaskModal 
                  task={selectedTask} 
                  closeModal={closeModal}
                  openEditModal={openEditModal}
                  confirmDelete={confirmDelete}
                />
              ) : (
                <CreateEditTaskModal 
                  modalType={modalType}
                  useAI={useAI}
                  setUseAI={setUseAI}
                  analysis={analysis}
                  register={register}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  closeModal={closeModal}
                  onSubmit={onSubmit}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <DeleteConfirmationModal 
              taskId={taskToDelete!}
              cancelDelete={cancelDelete}
              deleteTask={deleteTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManagement;