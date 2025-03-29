import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface SmartSchedulingFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SmartSchedulingForm: React.FC<SmartSchedulingFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      summary: '',
      organizer: '',
      attendees: '',
      proposed_dates: '',
      duration: '1 hour',
      location: '',
      description: ''
    }
  });

  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

  // Update the form field when dates change
  React.useEffect(() => {
    if (selectedDates.length > 0) {
      const datesString = selectedDates.map(date => 
        date.toISOString().split('T')[0]
      ).join(', ');
      setValue('proposed_dates', datesString);
    }
  }, [selectedDates, setValue]);

  const handleDateChange = (date: Date) => {
    // Check if date already exists
    const dateExists = selectedDates.some(d => d.toDateString() === date.toDateString());
    
    if (dateExists) {
      // Remove date if it already exists
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      // Add date if it doesn't exist
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
        <div className="flex items-start">
          <LightBulbIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Smart Scheduling</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              Our AI will analyze the proposed dates and attendee schedules to recommend the best meeting time.
            </p>
          </div>
        </div>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meeting Title
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Strategy Discussion"
            {...register('summary', { required: 'Meeting title is required' })}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organizer
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Your Name"
            {...register('organizer', { required: 'Organizer is required' })}
          />
          {errors.organizer && (
            <p className="mt-1 text-sm text-red-600">{errors.organizer.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attendees (comma separated emails)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="john@example.com, jane@example.com"
            {...register('attendees', { required: 'Attendees are required' })}
          />
          {errors.attendees && (
            <p className="mt-1 text-sm text-red-600">{errors.attendees.message}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Proposed Dates
          </label>
          <div className="mb-2">
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              highlightDates={selectedDates}
              inline
              minDate={new Date()}
              className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 !rounded-md !shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedDates.map((date, index) => (
              <div 
                key={index} 
                className="bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span>{date.toLocaleDateString()}</span>
                <button 
                  type="button" 
                  className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200" 
                  onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            {...register('proposed_dates', { required: 'At least one date is required' })}
          />
          {errors.proposed_dates && (
            <p className="mt-1 text-sm text-red-600">{errors.proposed_dates.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration
          </label>
          <select
            className="input-field"
            {...register('duration', { required: 'Duration is required' })}
          >
            <option value="30 minutes">30 minutes</option>
            <option value="45 minutes">45 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1.5 hours">1.5 hours</option>
            <option value="2 hours">2 hours</option>
          </select>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location (optional)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Conference Room or Zoom link"
            {...register('location')}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            rows={3}
            className="input-field"
            placeholder="Meeting details and agenda"
            {...register('description')}
          ></textarea>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
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
          {isSubmitting ? 'Processing...' : 'Schedule with AI'}
        </button>
      </div>
    </form>
  );
};

export default SmartSchedulingForm;