'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  selectedPlan: string;
  planName: string;
}

interface PlanGroup {
  planId: string;
  planName: string;
  students: Student[];
}

export default function CreateGroupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentsByPlan, setStudentsByPlan] = useState<PlanGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get plan ID from URL params if present
  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId) {
      setSelectedPlan(planId);
    }
  }, [searchParams]);

  // Fetch students data
  useEffect(() => {
    if (!currentUser) return;

    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/teacher/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const { data } = await response.json();
        setStudentsByPlan(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [currentUser]);

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/teacher/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          description,
          studentIds: selectedStudents,
          planId: selectedPlan,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      // Redirect to groups list on success
      router.push('/dashboard/teacher/groups');
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter students by selected plan if a plan is selected
  const filteredPlans = selectedPlan
    ? studentsByPlan.filter(plan => plan.planId === selectedPlan)
    : studentsByPlan;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Group</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your students into groups for better communication and collaboration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Details Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Group Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yoruba-green focus:border-yoruba-green sm:text-sm"
                    placeholder="e.g., Advanced Conversation Group"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yoruba-green focus:border-yoruba-green sm:text-sm"
                    placeholder="What's this group about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Students
                  </label>
                  <div className="bg-gray-50 rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {selectedStudents.length === 0 ? (
                      <p className="text-sm text-gray-500">No students selected</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudents.map(studentId => {
                          // Find student details
                          const student = studentsByPlan
                            .flatMap(plan => plan.students)
                            .find(s => s.id === studentId);
                          
                          if (!student) return null;
                          
                          return (
                            <div key={studentId} className="flex items-center justify-between bg-white p-2 rounded border">
                              <div>
                                <p className="text-sm font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.planName}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleStudentSelection(studentId)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'} selected
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedStudents.length === 0}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isSubmitting || selectedStudents.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Student Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Select Students
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose students to add to this group
                </p>
              </div>

              {/* Plan Filter Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex overflow-x-auto">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      !selectedPlan
                        ? 'border-yoruba-green text-yoruba-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    All Plans
                  </button>
                  {studentsByPlan.map((plan) => (
                    <button
                      key={plan.planId}
                      onClick={() => setSelectedPlan(plan.planId)}
                      className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center ${
                        selectedPlan === plan.planId
                          ? 'border-yoruba-green text-yoruba-green'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {plan.planName}
                      <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {plan.students.length}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Students List */}
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yoruba-green"></div>
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No students found in the selected plan.
                  </div>
                ) : (
                  filteredPlans.map((plan) => (
                    <div key={plan.planId} className="p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        {plan.planName} Plan
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          ({plan.students.length} {plan.students.length === 1 ? 'student' : 'students'})
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {plan.students.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => toggleStudentSelection(student.id)}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedStudents.includes(student.id)
                                ? 'border-yoruba-green bg-green-50'
                                : 'border-gray-200 hover:border-yoruba-green hover:bg-green-50/50'
                            }`}
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yoruba-cream flex items-center justify-center mr-3">
                              <span className="text-yoruba-green font-medium">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {student.email}
                              </p>
                            </div>
                            <div className="ml-2">
                              {selectedStudents.includes(student.id) ? (
                                <div className="h-5 w-5 rounded-full bg-yoruba-green text-white flex items-center justify-center">
                                  <CheckIcon className="h-3.5 w-3.5" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
