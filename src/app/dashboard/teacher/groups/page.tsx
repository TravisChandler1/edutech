'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface Group {
  id: string;
  name: string;
  description: string;
  planId: string | null;
  planName: string | null;
  memberCount: number;
  createdAt: string;
}

export default function TeacherGroupsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch groups data
  useEffect(() => {
    if (!currentUser) return;

    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('/api/teacher/groups');
        
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        
        const { data } = await response.json();
        setGroups(data);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(groupId);
      
      const response = await fetch(`/api/teacher/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      // Remove the group from the list
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your student groups and communications
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/dashboard/teacher/groups/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create New Group
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {groups.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-12 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No groups yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new group of students.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/teacher/groups/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Create Group
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white overflow-hidden shadow rounded-lg flex flex-col"
              >
                <div className="px-4 py-5 sm:p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                      {group.planName && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yoruba-cream text-yoruba-green mt-1">
                          {group.planName} Plan
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/teacher/groups/${group.id}/edit`)}
                        className="text-gray-400 hover:text-yoruba-blue"
                        title="Edit group"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-gray-400 hover:text-yoruba-red"
                        disabled={isDeleting === group.id}
                        title="Delete group"
                      >
                        {isDeleting === group.id ? (
                          <div className="h-5 w-5 border-2 border-gray-300 border-t-yoruba-red rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {group.description && (
                    <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                      {group.description}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Created {formatDate(group.createdAt)}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
                  <button
                    onClick={() => router.push(`/dashboard/teacher/groups/${group.id}`)}
                    className="text-sm font-medium text-yoruba-green hover:text-yoruba-green-dark"
                  >
                    View details
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push(`/dashboard/chat/group/${group.id}`)}
                      className="inline-flex items-center text-sm text-yoruba-blue hover:text-yoruba-blue-dark"
                      title="Group chat"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                      Chat
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
