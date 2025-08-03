'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  selectedPlan: string;
  selectedCategory: string;
  createdAt: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorName: string;
  memberCount: number;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'communities'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [pendingCommunities, setPendingCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser.email !== 'admin@edutech.com') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
    fetchPendingCommunities();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingCommunities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/communities');
      if (response.ok) {
        const data = await response.json();
        setPendingCommunities(data.communities || []);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to fetch communities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCommunity = async (communityId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId, action: 'approve' })
      });
      
      if (response.ok) {
        toast.success('Community approved successfully');
        fetchPendingCommunities();
      } else {
        toast.error('Failed to approve community');
      }
    } catch (error) {
      console.error('Error approving community:', error);
      toast.error('Failed to approve community');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCommunity = async (communityId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId, action: 'reject' })
      });
      
      if (response.ok) {
        toast.success('Community rejected successfully');
        fetchPendingCommunities();
      } else {
        toast.error('Failed to reject community');
      }
    } catch (error) {
      console.error('Error rejecting community:', error);
      toast.error('Failed to reject community');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || currentUser.email !== 'admin@edutech.com') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users and communities</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-yoruba-green text-yoruba-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'communities'
                  ? 'border-yoruba-green text-yoruba-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Communities ({pendingCommunities.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registered Users</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoruba-green mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yoruba-green bg-opacity-10 text-yoruba-green">
                              {user.selectedPlan || 'No Plan'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.selectedCategory || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'communities' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Community Approvals</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoruba-green mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading communities...</p>
                </div>
              ) : pendingCommunities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending communities</p>
              ) : (
                <div className="space-y-4">
                  {pendingCommunities.map((community) => (
                    <div key={community.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{community.name}</h4>
                          <p className="text-gray-600 mt-1">{community.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Category: {community.category}</span>
                            <span>Creator: {community.creatorName}</span>
                            <span>Members: {community.memberCount}</span>
                            <span>Created: {new Date(community.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleApproveCommunity(community.id)}
                            disabled={isLoading}
                            className="bg-yoruba-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCommunity(community.id)}
                            disabled={isLoading}
                            className="bg-yoruba-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
