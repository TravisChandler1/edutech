'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  VideoCameraIcon, 
  ClockIcon, 
  UserGroupIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockOutlineIcon
} from '@heroicons/react/24/outline';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import Link from 'next/link';

type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

interface Session {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  durationMinutes: number;
  meetingUrl: string;
  status: SessionStatus;
  maxParticipants: number | null;
  participantCount: number;
  groupId: string | null;
  groupName: string | null;
  planId: string | null;
  planName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchSessions = async (page = 1, status = statusFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/teacher/sessions?status=${status}&page=${page}&limit=${pagination.limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      
      const { data, pagination: paginationData } = await response.json();
      setSessions(data);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [statusFilter]);

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(sessionId);
      
      const response = await fetch(`/api/teacher/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      
      // Refresh the sessions list
      fetchSessions(pagination.currentPage);
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const getStatusBadge = (status: SessionStatus, startTime: string) => {
    const isSessionPast = isPast(new Date(startTime));
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'scheduled':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <ClockIcon className="-ml-0.5 mr-1 h-3 w-3" />
            {isSessionPast ? 'Missed' : 'Scheduled'}
          </span>
        );
      case 'in_progress':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <VideoCameraIcon className="-ml-0.5 mr-1 h-3 w-3" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircleIcon className="-ml-0.5 mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircleIcon className="-ml-0.5 mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && sessions.length === 0) {
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
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading sessions</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fetchSessions()}
                className="rounded-md bg-red-50 text-sm font-medium text-red-800 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Sessions</h2>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === 'upcoming' ? 'Upcoming' : 'Past'} live teaching sessions
          </p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setStatusFilter('upcoming')}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium ${
                statusFilter === 'upcoming'
                  ? 'bg-yoruba-green text-white border-yoruba-green-dark'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ClockOutlineIcon className="-ml-1 mr-2 h-4 w-4" />
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('past')}
              className={`relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium ${
                statusFilter === 'past'
                  ? 'bg-yoruba-green text-white border-yoruba-green-dark'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="-ml-1 mr-2 h-4 w-4" />
              Past
            </button>
          </div>
          <Link
            href="/dashboard/teacher/sessions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
            New Session
          </Link>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {statusFilter} sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === 'upcoming' 
              ? 'Get started by scheduling a new live session.'
              : 'No past sessions found.'}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/teacher/sessions/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
            >
              <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
              New Session
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <li key={session.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yoruba-cream flex items-center justify-center">
                        <VideoCameraIcon className="h-5 w-5 text-yoruba-green" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                          <div className="ml-2">
                            {getStatusBadge(session.status, session.startTime)}
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDate(session.startTime)}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {session.durationMinutes} minutes
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {session.participantCount} {session.participantCount === 1 ? 'participant' : 'participants'}
                            {session.maxParticipants && ` (max ${session.maxParticipants})`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <Link
                        href={`/dashboard/teacher/sessions/${session.id}`}
                        className="mr-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yoruba-green bg-yoruba-green/10 hover:bg-yoruba-green/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
                      >
                        <PencilIcon className="-ml-0.5 mr-1 h-3 w-3" />
                        View
                      </Link>
                      {session.status === 'scheduled' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(session.id)}
                          disabled={isDeleting === session.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === session.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <TrashIcon className="-ml-0.5 mr-1 h-3 w-3" />
                              Delete
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchSessions(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.hasPreviousPage
                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchSessions(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.hasNextPage
                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => fetchSessions(pagination.currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.hasPreviousPage
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      // Calculate page numbers to show (current page in the middle when possible)
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchSessions(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'z-10 bg-yoruba-green border-yoruba-green-dark text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => fetchSessions(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.hasNextPage
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
