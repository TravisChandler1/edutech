'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  BookOpen as BookOpenIcon, 
  Users as UserGroupIcon, 
  Video as VideoCameraIcon, 
  MessageSquare as ChatBubbleLeftRightIcon,
  Plus as PlusIcon,
  Clock as ClockIcon,
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  X as XMarkIcon
} from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}

interface PlanGroup {
  planId: string;
  planName: string;
  planLevel: number;
  students: Student[];
}

interface LiveSession {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  participantCount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export default function TeacherDashboard() {
  const [studentsByPlan, setStudentsByPlan] = useState<PlanGroup[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser?.role !== 'teacher') {
      router.push('/dashboard');
      return;
    }

    fetchStudents();
    fetchUpcomingSessions();
  }, [currentUser, loading, router]);

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
      setError('Failed to load student data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await fetch('/api/teacher/sessions?status=upcoming&limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming sessions');
      }
      const { data } = await response.json();
      setUpcomingSessions(data);
    } catch (err) {
      console.error('Error fetching upcoming sessions:', err);
      // Don't show error to user for this, just log it
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="-ml-0.5 mr-1 h-3 w-3" />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <VideoCameraIcon className="-ml-0.5 mr-1 h-3 w-3" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="-ml-0.5 mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your students and teaching materials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            icon={<UserGroupIcon className="h-8 w-8 text-yoruba-green" />}
            title="Total Students"
            value={studentsByPlan.reduce((acc, group) => acc + group.students.length, 0)}
            description="across all plans"
          />
          <DashboardCard 
            icon={<BookOpenIcon className="h-8 w-8 text-yoruba-blue" />}
            title="Teaching Plans"
            value={studentsByPlan.length}
            description="different plans"
          />
          <DashboardCard 
            icon={<ChatBubbleLeftRightIcon className="h-8 w-8 text-yoruba-purple" />}
            title="Group Chats"
            value="0"
            description="active discussions"
          />
          <DashboardCard 
            icon={<VideoCameraIcon className="h-8 w-8 text-yoruba-red" />}
            title="Upcoming Sessions"
            value={upcomingSessions.length.toString()}
            description="scheduled"
            link="/dashboard/teacher/sessions"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Students</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/dashboard/teacher/sessions/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Schedule Session
            </button>
            <button
              onClick={() => router.push('/dashboard/teacher/groups/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-blue hover:bg-yoruba-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-blue"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Group
            </button>
          </div>
        </div>

        {/* Upcoming Sessions Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-yoruba-green to-yoruba-blue">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">
                Upcoming Live Sessions
              </h3>
              <Link 
                href="/dashboard/teacher/sessions" 
                className="text-sm font-medium text-yoruba-cream hover:text-white flex items-center"
              >
                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoadingSessions ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yoruba-green mx-auto"></div>
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No upcoming sessions scheduled
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {upcomingSessions.map((session) => (
                  <li key={session.id} className="hover:bg-gray-50">
                    <Link href={`/dashboard/teacher/sessions/${session.id}`} className="block">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-yoruba-green truncate">
                              {session.title}
                            </p>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {formatDate(session.startTime)}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {formatTime(session.startTime)}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {session.participantCount} {session.participantCount === 1 ? 'participant' : 'participants'}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {getStatusBadge(session.status)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
            <Button asChild>
              <Link href="/dashboard/teacher/sessions/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Schedule New Session
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Students Section */}
        <div className="space-y-8">
          {studentsByPlan.map((planGroup) => (
            <motion.div 
              key={planGroup.planId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-yoruba-green to-yoruba-blue">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {planGroup.planName} Plan
                </h3>
                <p className="mt-1 text-sm text-yoruba-cream">
                  {planGroup.students.length} {planGroup.students.length === 1 ? 'student' : 'students'}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member Since
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {planGroup.students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yoruba-cream flex items-center justify-center">
                              <span className="text-yoruba-green font-medium">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.lastLogin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => router.push(`/dashboard/teacher/students/${student.id}`)}
                            className="text-yoruba-blue hover:text-yoruba-green mr-4"
                          >
                            View
                          </button>
                          <button className="text-yoruba-blue hover:text-yoruba-green">
                            Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {planGroup.students.length} {planGroup.students.length === 1 ? 'student' : 'students'} in this plan
                </p>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      router.push(`/dashboard/teacher/sessions/new?plan=${planGroup.planId}`);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yoruba-blue bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-blue"
                  >
                    <VideoCameraIcon className="-ml-1 mr-1.5 h-4 w-4" />
                    Schedule Class
                  </button>
                  <button
                    onClick={() => {
                      router.push(`/dashboard/teacher/groups/new?plan=${planGroup.planId}`);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yoruba-green bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
                  >
                    <UserGroupIcon className="-ml-1 mr-1.5 h-4 w-4" />
                    Create Group
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

