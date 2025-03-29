import React from 'react';
import { UseFormRegister, FormState, UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { TaskRequest } from '../../../services/taskService';

interface CreateEditTaskModalProps {
  modalType: 'create' | 'edit';
  useAI: boolean;
  setUseAI: (use: boolean) => void;
  analysis: string;
  register: UseFormRegister<TaskRequest>;
  errors: FormState<TaskRequest>['errors'];
  handleSubmit: UseFormHandleSubmit<TaskRequest>;
  closeModal: () => void;
  onSubmit: (data: TaskRequest) => Promise<void>;
}

const CreateEditTaskModal: React.FC<CreateEditTaskModalProps> = ({
  modalType, useAI, setUseAI, analysis, register, errors, handleSubmit, closeModal, onSubmit
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <input
          type="text"
          className="input-field"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Assigned To
        </label>
        <input
          type="text"
          className="input-field"
          {...register('assigned_to', { required: 'Assignee is required' })}
        />
        {errors.assigned_to && (
          <p className="mt-1 text-sm text-red-600">{errors.assigned_to.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Deadline
        </label>
        <input
          type="date"
          className="input-field"
          {...register('deadline', { required: 'Deadline is required' })}
        />
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <select
          className="input-field"
          {...register('priority', { required: 'Priority is required' })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>
      
      {modalType === 'create' && (
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="useAI"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
          <label htmlFor="useAI" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Use AI to analyze and prioritize this task
          </label>
        </div>
      )}
      
      {analysis && (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-md">
          <h4 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-1 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            AI Analysis
          </h4>
          <p className="text-sm text-primary-700 dark:text-primary-300">{analysis}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={closeModal}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {modalType === 'create' ? 'Create Task' : 'Update Task'}
        </button>
      </div>
    </form>
  );
};

export default CreateEditTaskModal;