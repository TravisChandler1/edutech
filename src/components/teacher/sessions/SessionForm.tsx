'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PlusIcon, 
  XMarkIcon, 
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format, addMinutes, isBefore } from 'date-fns';
import { toast } from 'react-hot-toast';

// Define form validation schema
const sessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  durationMinutes: z.number().min(5, 'Minimum duration is 5 minutes').max(240, 'Maximum duration is 4 hours'),
  maxParticipants: z.number().min(1, 'At least 1 participant is required').optional(),
  groupId: z.string().optional(),
  planId: z.string().optional(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface SessionFormProps {
  initialData?: {
    id?: string;
    title: string;
    description?: string | null;
    startTime: string;
    durationMinutes: number;
    maxParticipants?: number | null;
    groupId?: string | null;
    planId?: string | null;
  };
  onSuccess?: () => void;
}

export default function SessionForm({ initialData, onSuccess }: SessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!initialData?.id;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startTime: initialData?.startTime 
        ? format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      durationMinutes: initialData?.durationMinutes || 60,
      maxParticipants: initialData?.maxParticipants || undefined,
      groupId: initialData?.groupId || undefined,
      planId: initialData?.planId || undefined,
    },
  });

  // Watch values for dependent fields
  const watchGroupId = watch('groupId');
  const watchStartTime = watch('startTime');
  const watchDuration = watch('durationMinutes');

  // Calculate end time for display
  const endTime = watchStartTime && watchDuration
    ? addMinutes(new Date(watchStartTime), watchDuration)
    : null;

  // Fetch groups and plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch groups
        const groupsResponse = await fetch('/api/teacher/groups');
        if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
        const groupsData = await groupsResponse.json();
        setGroups(groupsData.data || []);
        
        // Fetch plans
        const plansResponse = await fetch('/api/plans');
        if (!plansResponse.ok) throw new Error('Failed to fetch plans');
        const plansData = await plansResponse.json();
        setPlans(plansData.data || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load required data. Please refresh the page to try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update max participants when group changes
  useEffect(() => {
    if (watchGroupId) {
      const selectedGroup = groups.find(g => g.id === watchGroupId);
      if (selectedGroup) {
        setValue('maxParticipants', selectedGroup.memberCount);
      }
    }
  }, [watchGroupId, groups, setValue]);

  const onSubmit = async (data: SessionFormData) => {
    if (isSubmitting) return;
    
    // Validate start time is in the future
    const startTime = new Date(data.startTime);
    if (isBefore(startTime, new Date())) {
      toast.error('Start time must be in the future');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const url = isEditMode 
        ? `/api/teacher/sessions/${initialData.id}`
        : '/api/teacher/sessions';
      
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Convert empty strings to null for optional fields
          description: data.description || null,
          maxParticipants: data.maxParticipants || null,
          groupId: data.groupId || null,
          planId: data.planId || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save session');
      }
      
      await response.json();
      
      toast.success(
        isEditMode 
          ? 'Session updated successfully!'
          : 'Session created successfully!'
      );
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect
        router.push('/dashboard/teacher/sessions');
      }
      
    } catch (err) {
      console.error('Error saving session:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save session');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading form</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {isEditMode ? 'Edit Session' : 'Schedule New Live Session'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode 
              ? 'Update the details of your live session.'
              : 'Fill in the details below to schedule a new live teaching session.'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-yoruba-green focus:border-yoruba-green'}`}
                    placeholder="e.g., Yoruba for Beginners - Lesson 1"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    {...register('description')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yoruba-green focus:ring-yoruba-green sm:text-sm"
                    placeholder="What will this session cover?"
                    defaultValue={''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Start Time */}
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      id="startTime"
                      {...register('startTime')}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.startTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-yoruba-green focus:border-yoruba-green'}`}
                      min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="durationMinutes"
                      min={5}
                      max={240}
                      step={5}
                      {...register('durationMinutes', { valueAsNumber: true })}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.durationMinutes ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-yoruba-green focus:border-yoruba-green'}`}
                    />
                    {errors.durationMinutes ? (
                      <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        {endTime && (
                          <>
                            Ends at {format(endTime, 'MMM d, yyyy h:mm a')}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Group Selection */}
                <div>
                  <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
                    Group (optional)
                  </label>
                  <div className="mt-1">
                    <select
                      id="groupId"
                      {...register('groupId')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yoruba-green focus:ring-yoruba-green sm:text-sm"
                    >
                      <option value="">Select a group (optional)</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name} ({group.memberCount} members)
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Selecting a group will automatically invite all group members.
                    </p>
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <label htmlFor="planId" className="block text-sm font-medium text-gray-700">
                    Plan (optional)
                  </label>
                  <div className="mt-1">
                    <select
                      id="planId"
                      {...register('planId')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yoruba-green focus:ring-yoruba-green sm:text-sm"
                    >
                      <option value="">Select a plan (optional)</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.duration}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Restrict this session to students on a specific plan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Max Participants */}
              <div className="sm:w-1/2">
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                  Maximum Participants (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="maxParticipants"
                    min="1"
                    {...register('maxParticipants', { 
                      valueAsNumber: true,
                      validate: (value) => {
                        if (value === undefined || value === null) return true;
                        return value > 0 || 'Must be at least 1';
                      }
                    })}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.maxParticipants ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-yoruba-green focus:border-yoruba-green'}`}
                  />
                  {errors.maxParticipants ? (
                    <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty for unlimited participants.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Scheduling...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <CheckCircleIcon className="-ml-1 mr-2 h-4 w-4" />
                        Update Session
                      </>
                    ) : (
                      <>
                        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                        Schedule Session
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
