'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { FaUsers, FaPlus, FaSearch, FaMapMarkerAlt, FaClock, FaUserFriends, FaComments, FaCalendarAlt } from 'react-icons/fa';

interface GroupsSectionProps {
  user: AuthUser;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Grammar' | 'Conversation' | 'Reading' | 'Writing' | 'Culture' | 'General';
  location: 'Online' | 'Lagos' | 'Abuja' | 'Ibadan' | 'Kano' | 'Port Harcourt';
  members: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting: string;
  isPrivate: boolean;
  isMember: boolean;
  isCreator: boolean;
  tags: string[];
  createdAt: string;
  lastActivity: string;
}

export default function GroupsSection({ user }: GroupsSectionProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups' | 'create'>('my-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    level: 'Beginner' as 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced',
    category: 'General' as 'Grammar' | 'Conversation' | 'Reading' | 'Writing' | 'Culture' | 'General',
    location: 'Online' as 'Online' | 'Lagos' | 'Abuja' | 'Ibadan' | 'Kano' | 'Port Harcourt',
    maxMembers: 10,
    meetingSchedule: '',
    isPrivate: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/user?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-gold"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-white/80 mb-4">Unable to load groups data</p>
        <button 
          onClick={fetchDashboardData}
          className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use real groups data from API
  const studyGroups: StudyGroup[] = dashboardData.groups.map((group: any) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    creator: group.creator_name || 'Unknown',
    level: group.level || 'Beginner',
    category: group.category || 'General',
    location: group.location || 'Online',
    members: group.member_count || 0,
    maxMembers: group.max_members || 10,
    meetingSchedule: group.meeting_schedule || 'To be determined',
    nextMeeting: group.next_meeting || new Date().toISOString(),
    isPrivate: group.is_private || false,
    isMember: true, // Since they're in dashboardData.groups, they're a member
    isCreator: group.member_role === 'creator',
    tags: group.tags || [],
    createdAt: group.created_at,
    lastActivity: group.last_activity || group.created_at
  }));

  const filteredGroups = studyGroups.filter(group => {
    const searchMatch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const levelMatch = filterLevel === 'all' || group.level === filterLevel;
    const categoryMatch = filterCategory === 'all' || group.category === filterCategory;
    const locationMatch = filterLocation === 'all' || group.location === filterLocation;
    
    if (activeTab === 'my-groups') {
      return group.isMember && searchMatch && levelMatch && categoryMatch && locationMatch;
    } else if (activeTab === 'discover') {
      return !group.isMember && searchMatch && levelMatch && categoryMatch && locationMatch;
    }
    
    return searchMatch && levelMatch && categoryMatch && locationMatch;
  });

  const joinGroup = (groupId: string) => {
    // TODO: Implement join group logic
    console.log('Joining group:', groupId);
    alert('Successfully joined the group! You will receive meeting details via email.');
  };

  const leaveGroup = (groupId: string) => {
    // TODO: Implement leave group logic
    console.log('Leaving group:', groupId);
    if (confirm('Are you sure you want to leave this group?')) {
      alert('You have left the group.');
    }
  };

  const createGroup = () => {
    // TODO: Implement create group logic
    console.log('Creating group:', newGroup);
    alert('Group created successfully! Members can now discover and join your group.');

    setNewGroup({
      name: '',
      description: '',
      level: 'Beginner',
      category: 'General',
      location: 'Online',
      maxMembers: 10,
      meetingSchedule: '',
      isPrivate: false
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Novice': return 'bg-gray-100 text-gray-800';
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Grammar': 'bg-blue-100 text-blue-800',
      'Conversation': 'bg-green-100 text-green-800',
      'Reading': 'bg-purple-100 text-purple-800',
      'Writing': 'bg-orange-100 text-orange-800',
      'Culture': 'bg-pink-100 text-pink-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const myGroups = studyGroups.filter(g => g.isMember);
  const createdGroups = studyGroups.filter(g => g.isCreator);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-yoruba-gold/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yoruba-navy mb-2 flex items-center">
              <FaUsers className="w-8 h-8 mr-3 text-yoruba-blue" />
              Study Groups
            </h1>
            <p className="text-gray-600 text-lg">
              Connect with fellow learners and practice Yoruba together
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yoruba-blue/10 rounded-lg p-4">
              <p className="text-sm text-yoruba-navy font-medium">Your Groups</p>
              <p className="text-2xl font-bold text-yoruba-blue">{myGroups.length}</p>
              <p className="text-sm text-gray-600">Active memberships</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <FaUserFriends className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Groups Joined</p>
              <p className="text-2xl font-bold text-yoruba-navy">{myGroups.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <FaPlus className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Groups Created</p>
              <p className="text-2xl font-bold text-yoruba-navy">{createdGroups.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <FaCalendarAlt className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Meeting</p>
              <p className="text-lg font-bold text-yoruba-navy">Tomorrow</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 border border-yoruba-gold/10">
        {[
          { id: 'my-groups', label: 'My Groups', count: myGroups.length },
          { id: 'discover', label: 'Discover Groups', count: studyGroups.filter(g => !g.isMember).length },
          { id: 'create', label: 'Create Group', count: 0 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-yoruba-blue text-white shadow-md'
                : 'text-gray-600 hover:text-yoruba-navy hover:bg-gray-50'
            }`}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      {(activeTab === 'discover' || activeTab === 'my-groups') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Groups</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, description, or tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="Novice">Novice</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Grammar">Grammar</option>
                <option value="Conversation">Conversation</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Culture">Culture</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="Online">Online</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Ibadan">Ibadan</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Group Form */}
      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-yoruba-gold/10"
        >
          <h3 className="text-2xl font-bold text-yoruba-navy mb-6">Create a New Study Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                placeholder="Enter group name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={newGroup.level}
                onChange={(e) => setNewGroup({...newGroup, level: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="Novice">Novice</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newGroup.category}
                onChange={(e) => setNewGroup({...newGroup, category: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="Grammar">Grammar</option>
                <option value="Conversation">Conversation</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Culture">Culture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={newGroup.location}
                onChange={(e) => setNewGroup({...newGroup, location: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              >
                <option value="Online">Online</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Ibadan">Ibadan</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Members</label>
              <input
                type="number"
                value={newGroup.maxMembers}
                onChange={(e) => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})}
                min="2"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Schedule</label>
              <input
                type="text"
                value={newGroup.meetingSchedule}
                onChange={(e) => setNewGroup({...newGroup, meetingSchedule: e.target.value})}
                placeholder="e.g., Every Sunday, 3:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                placeholder="Describe your group's purpose and activities"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newGroup.isPrivate}
                  onChange={(e) => setNewGroup({...newGroup, isPrivate: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Make this group private (invite-only)</span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={createGroup}
              className="px-6 py-3 bg-yoruba-blue text-white rounded-lg hover:bg-yoruba-blue/90 transition-colors font-medium"
            >
              Create Group
            </button>
            <button
              onClick={() => setNewGroup({
                name: '',
                description: '',
                level: 'Beginner',
                category: 'General',
                location: 'Online',
                maxMembers: 10,
                meetingSchedule: '',
                isPrivate: false
              })}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Reset Form
            </button>
          </div>
        </motion.div>
      )}

      {/* Groups Grid */}
      {(activeTab === 'discover' || activeTab === 'my-groups') && (
        <div>
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yoruba-gold/10 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Group Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-yoruba-navy text-lg leading-tight">{group.name}</h3>
                  {group.isPrivate && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">Created by {group.creator}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{group.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(group.level)}`}>
                    {group.level}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(group.category)}`}>
                    {group.category}
                  </span>
                </div>

                {/* Group Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    {group.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="w-4 h-4 mr-2" />
                    {group.members}/{group.maxMembers} members
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="w-4 h-4 mr-2" />
                    {group.meetingSchedule}
                  </div>
                  {group.nextMeeting && (
                    <div className="flex items-center text-sm text-yoruba-green font-medium">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      Next: {new Date(group.nextMeeting).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {group.isMember ? (
                    <>
                      <button className="flex-1 py-2 px-4 bg-yoruba-green text-white rounded-lg hover:bg-yoruba-green/90 transition-colors font-medium">
                        <FaComments className="w-4 h-4 inline mr-2" />
                        Chat
                      </button>
                      {!group.isCreator && (
                        <button
                          onClick={() => leaveGroup(group.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                          Leave
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      disabled={group.members >= group.maxMembers}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        group.members >= group.maxMembers
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-yoruba-blue text-white hover:bg-yoruba-blue/90'
                      }`}
                    >
                      {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
              </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              {activeTab === 'my-groups' ? (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">You are not in any group currently</h3>
                  <p className="text-white/70 mb-6">Join existing groups or create your own to start learning with others!</p>
                  <div className="space-y-3 max-w-sm mx-auto">
                    <button 
                      onClick={() => setActiveTab('discover')}
                      className="w-full bg-yoruba-gold text-yoruba-navy px-6 py-3 rounded-lg hover:bg-yoruba-gold/90 transition-colors font-medium"
                    >
                      Browse Available Groups
                    </button>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="w-full bg-yoruba-blue text-white px-6 py-3 rounded-lg hover:bg-yoruba-blue/90 transition-colors font-medium"
                    >
                      Create Your Own Group
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">No groups found</h3>
                  <p className="text-white/70 mb-6">Try adjusting your search filters or create a new group!</p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="bg-yoruba-gold text-yoruba-navy px-6 py-3 rounded-lg hover:bg-yoruba-gold/90 transition-colors font-medium"
                  >
                    Create New Group
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {filteredGroups.length === 0 && (activeTab === 'discover' || activeTab === 'my-groups') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No groups found
          </h3>
          <p className="text-gray-400">
            {activeTab === 'my-groups' 
              ? 'You haven\'t joined any groups yet. Discover groups to get started!'
              : 'No groups match your search criteria. Try adjusting your filters.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}