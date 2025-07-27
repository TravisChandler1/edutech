'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Community, User } from '@/types';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [pendingCommunities, setPendingCommunities] = useState<Community[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'communities' | 'users'>('communities');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // TODO: Replace with actual admin check from your auth system
    const isAdmin = currentUser.role === 'admin';
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPendingCommunities(),
          fetchUsers()
        ]);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, router]);

  const fetchPendingCommunities = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/communities/pending');
      // const data = await response.json();
      // setPendingCommunities(data);
      
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Yoruba Beginners',
          description: 'A community for beginners to learn Yoruba together',
          creatorId: 'user123',
          members: ['user123'],
          isApproved: false,
          category: 'Study Group',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Yoruba Culture Exchange',
          description: 'Discussing Yoruba traditions, culture, and history',
          creatorId: 'user456',
          members: ['user456'],
          isApproved: false,
          category: 'Cultural Discussion',
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (err) {
      setError('Failed to fetch pending communities');
      console.error('Error fetching pending communities:', err);
      throw err;
    }
  };

  const fetchUsers = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data);
      
      // Mock data for now
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          plan: 'Advanced',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Teacher One',
          email: 'teacher@example.com',
          role: 'teacher',
          status: 'active',
          plan: 'Advanced',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Student One',
          email: 'student@example.com',
          role: 'student',
          status: 'active',
          plan: 'Beginner',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Suspended User',
          email: 'suspended@example.com',
          role: 'student',
          status: 'suspended',
          plan: 'Novice',
          createdAt: new Date().toISOString(),
        },
      ];
      setUsers(mockUsers);
      return mockUsers;
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
      throw err;
    }
  };

  const handleApprove = async (communityId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/communities/${communityId}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      // Update local state
      setPendingCommunities(prev => 
        prev.filter(community => community.id !== communityId)
      );
      setSuccess('Community approved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve community');
      console.error('Error approving community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (communityId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/communities/${communityId}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      // Update local state
      setPendingCommunities(prev => 
        prev.filter(community => community.id !== communityId)
      );
      setSuccess('Community rejected successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject community');
      console.error('Error rejecting community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        )
      );
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !pendingCommunities.length && !users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoruba-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green mx-auto mb-4"></div>
          <p className="text-yoruba-green">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserManagement 
            users={users} 
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'communities':
      default:
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Community Approvals
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review and approve or reject new community requests
              </p>
            </div>
            
            {pendingCommunities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending communities to review
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingCommunities.map((community) => (
                  <li key={community.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-yoruba-green">{community.name}</h4>
                        <p className="mt-1 text-sm text-gray-600">{community.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yoruba-cream text-yoruba-green">
                            {community.category}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Created: {new Date(community.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                          onClick={() => handleApprove(community.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-green hover:bg-yoruba-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-green"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(community.id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-red"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-yoruba-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yoruba-green">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-700">Manage platform users and community approvals</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' ? 'border-yoruba-green text-yoruba-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`${activeTab === 'communities' ? 'border-yoruba-green text-yoruba-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Community Approvals
            </button>
          </nav>
        </div>

        {renderTabContent()}

        {/* Stats and Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yoruba-green/10 p-3 rounded-md">
                  <svg className="h-6 w-6 text-yoruba-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{users.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-md">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{pendingCommunities.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-md">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Teachers</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {users.filter(u => u.role === 'teacher' && u.status !== 'banned').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
