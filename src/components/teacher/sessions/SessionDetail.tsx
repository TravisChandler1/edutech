'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  VideoCameraIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { format, isPast } from 'date-fns';
import { toast } from 'react-hot-toast';

interface SessionDetailProps {
  sessionId: string;
}

export default function SessionDetail({ sessionId }: SessionDetailProps) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/teacher/sessions/${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch session');
        const { data } = await res.json();
        setSession(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (sessionId) fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Session not found</p>
      </div>
    );
  }

  const startTime = new Date(session.startTime);
  const endTime = new Date(startTime.getTime() + session.durationMinutes * 60000);
  const isSessionInProgress = session.status === 'in_progress';
  const isSessionScheduled = session.status === 'scheduled' && !isPast(startTime);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{session.title}</h2>
          <p className="text-gray-500">
            {format(startTime, 'MMMM d, yyyy h:mm a')} • {session.durationMinutes} minutes
          </p>
        </div>
        {isSessionInProgress && (
          <a
            href={session.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-yoruba-green text-white rounded-md hover:bg-yoruba-green-dark"
          >
            <VideoCameraIcon className="w-5 h-5 mr-2" />
            Join Session
          </a>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-yoruba-green text-yoruba-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'participants'
                  ? 'border-b-2 border-yoruba-green text-yoruba-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Participants ({session.participantCount})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Session Information</h3>
                <p className="text-gray-600 mt-1">{session.description || 'No description provided.'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                  <p>{format(startTime, 'MMMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p>{session.durationMinutes} minutes</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">
                    {isSessionScheduled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Scheduled
                      </span>
                    ) : isSessionInProgress ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <VideoCameraIcon className="w-3 h-3 mr-1" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Meeting Link</h4>
                  {session.meetingUrl ? (
                    <div className="flex items-center">
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yoruba-green hover:underline flex items-center"
                      >
                        Join Meeting
                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(session.meetingUrl);
                          toast.success('Link copied to clipboard');
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        title="Copy link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No meeting link available</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Participants</h3>
              {session.participants?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {session.participants.map((participant: any) => (
                    <li key={participant.id} className="py-3 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yoruba-cream flex items-center justify-center text-yoruba-green font-medium">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No participants yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
