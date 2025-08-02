'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Community, User, TeacherApprovalRequest } from '@/types';
import UserManagement from '@/components/admin/UserManagement';
import TeacherApprovalList from '@/components/admin/TeacherApprovalList';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [pendingCommunities, setPendingCommunities] = useState<Community[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teacherRequests, setTeacherRequests] = useState<TeacherApprovalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'communities' | 'teacherApprovals' | 'settings' | 'dashboard'>('dashboard');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // TODO: Replace with actual admin check from your auth system
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }

    const isAdmin = currentUser.role === 'admin';
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      try {
        if (activeTab === 'communities') {
          await fetchPendingCommunities();
        } else if (activeTab === 'users') {
          await fetchUsers();
        } else if (activeTab === 'teacherApprovals') {
          await fetchTeacherApprovalRequests();
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(`Failed to load ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentUser, router]);

  const fetchTeacherApprovalRequests = async () => {
    try {
      const response = await fetch('/api/admin/teacher-approvals');
      if (!response.ok) throw new Error('Failed to fetch teacher requests');
      const data = await response.json();
      setTeacherRequests(data.requests || []);
    } catch (err) {
      setError('Failed to fetch teacher approval requests');
      console.error('Error fetching teacher requests:', err);
      throw err;
    }
  };

  const handleApproveTeacher = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/teacher-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'approve' })
      });
      
      if (!response.ok) throw new Error('Failed to approve teacher');
      
      setSuccess('Teacher approved successfully');
      await fetchTeacherApprovalRequests();
    } catch (err) {
      setError('Failed to approve teacher');
      console.error('Error approving teacher:', err);
    }
  };

  const handleRejectTeacher = async (requestId: string, reason: string) => {
    if (!reason) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/teacher-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject', rejectionReason: reason })
      });
      
      if (!response.ok) throw new Error('Failed to reject teacher');
      
      setSuccess('Teacher request rejected');
      await fetchTeacherApprovalRequests();
    } catch (err) {
      setError('Failed to reject teacher');
      console.error('Error rejecting teacher:', err);
    }
  };

  const fetchPendingCommunities = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/communities/pending');
      // const data = await response.json();
      // setPendingCommunities(data);
      
      // Mock data for now
      setPendingCommunities([
        {
          id: '1',
          name: 'Yoruba Learners',
          description: 'A community for Yoruba language learners',
          creatorId: '2',
          members: ['2', '3'],
          isApproved: false,
          category: 'Study Group',
          createdAt: new Date().toISOString(),
        },
      ]);
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

  const handleApproveCommunity = async (communityId: string) => {
    try {
      // TODO: Implement approve community logic
      setSuccess('Community approved successfully');
    } catch (err) {
      setError('Failed to approve community');
      console.error('Error approving community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCommunity = async (communityId: string) => {
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'teacherApprovals':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Teacher Approval Requests</h2>
              <span className="px-3 py-1 bg-yoruba-green text-white text-sm font-medium rounded-full">
                {teacherRequests.length} Pending
              </span>
            </div>
            <TeacherApprovalList 
              requests={teacherRequests} 
              onApprove={handleApproveTeacher}
              onReject={handleRejectTeacher}
              isLoading={isLoading}
            />
          </div>
        );
      case 'communities':
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Community Approvals</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCommunities.map((community) => (
                  <div key={community.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{community.name}</h3>
                    <p className="text-gray-600 text-sm">{community.description}</p>
                    <div className="mt-2 flex space-x-2">
                      <button 
                        onClick={() => handleApproveCommunity(community.id)}
                        className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectCommunity(community.id)}
                        className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingCommunities.length === 0 && (
                  <p className="text-gray-500">No pending communities</p>
                )}
              </div>
            )}
          </div>
        );
      case 'users':
        return (
          <UserManagement 
            users={users} 
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Admin Settings</h2>
            
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-yoruba-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-blue disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-yoruba-navy py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-gray-300">
                Manage your platform's content and users
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {currentUser?.name || 'Admin'}
              </span>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    router.push('/');
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yoruba-red hover:bg-yoruba-red/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-red transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' 
                ? 'border-yoruba-green text-yoruba-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('teacherApprovals')}
              className={`${activeTab === 'teacherApprovals' 
                ? 'border-yoruba-green text-yoruba-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              Teacher Approvals
              {teacherRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yoruba-red text-white text-xs rounded-full">
                  {teacherRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`${activeTab === 'communities' 
                ? 'border-yoruba-green text-yoruba-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Communities
              {pendingCommunities.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yoruba-red text-white text-xs rounded-full">
                  {pendingCommunities.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' 
                ? 'border-yoruba-green text-yoruba-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${activeTab === 'settings' 
                ? 'border-yoruba-green text-yoruba-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          {renderTabContent()}
          
          {activeTab === 'dashboard' && (
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
          )}
        </div>
      </div>
    </div>
  );
}
