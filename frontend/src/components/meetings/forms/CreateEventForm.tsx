import React from 'react';
import { useForm } from 'react-hook-form';
import { CalendarEvent } from '../../../services/meetingService';

interface CreateEventFormProps {
  onSubmit: (data: CalendarEvent) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
  isEditMode?: boolean;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isEditMode = false 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<CalendarEvent>({
    defaultValues: initialData
  });

  const startTime = watch('start_time');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Summary
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Meeting title"
          {...register('summary', { required: 'Summary is required' })}
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Conference Room B or Video call link"
          {...register('location')}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          className="input-field"
          placeholder="Meeting details and agenda"
          {...register('description')}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="input-field"
            {...register('start_time', { required: 'Start time is required' })}
          />
          {errors.start_time && (
            <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            className="input-field"
            {...register('end_time', { 
              required: 'End time is required',
              validate: {
                afterStart: value => !startTime || new Date(value) > new Date(startTime) || 'End time must be after start time'
              } 
            })}
          />
          {errors.end_time && (
            <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Attendees (comma separated emails)
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="john@example.com, jane@example.com"
          {...register('attendees')}
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            {...register('recurring')}
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Make this a recurring event</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : isEditMode ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;