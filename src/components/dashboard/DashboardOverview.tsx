'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { FaBook, FaVideo, FaUsers, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface DashboardOverviewProps {
  user: AuthUser;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    selectedPlan: string;
    paymentStatus: string;
    planFeatures: any;
  };
  groups: any[];
  classes: any[];
  bookClubSessions: any[];
  savedBooks: any[];
  stats: {
    totalGroups: number;
    totalClasses: number;
    totalBookSessions: number;
    totalSavedBooks: number;
  };
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <p className="text-white/80 mb-4">Unable to load dashboard data</p>
        <button 
          onClick={fetchDashboardData}
          className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Saved Books',
      value: dashboardData.stats.totalSavedBooks.toString(),
      icon: FaBook,
      color: 'bg-blue-500',
      change: dashboardData.stats.totalSavedBooks > 0 ? 'Books in library' : 'No books saved yet'
    },
    {
      label: 'Live Classes',
      value: dashboardData.stats.totalClasses.toString(),
      icon: FaVideo,
      color: 'bg-green-500',
      change: dashboardData.stats.totalClasses > 0 ? 'Enrolled classes' : 'No classes enrolled'
    },
    {
      label: 'Study Groups',
      value: dashboardData.stats.totalGroups.toString(),
      icon: FaUsers,
      color: 'bg-purple-500',
      change: dashboardData.stats.totalGroups > 0 ? 'Active groups' : 'Not in any group'
    },
    {
      label: 'Book Club',
      value: dashboardData.stats.totalBookSessions.toString(),
      icon: FaClock,
      color: 'bg-orange-500',
      change: dashboardData.stats.totalBookSessions > 0 ? 'Upcoming sessions' : 'No sessions scheduled'
    }
  ];

  // Generate recent activities from real data
  const recentActivities = [
    ...dashboardData.groups.slice(0, 2).map(group => ({
      type: 'group',
      title: `Joined group "${group.name}"`,
      time: new Date(group.joined_at).toLocaleDateString(),
      icon: FaUsers
    })),
    ...dashboardData.classes.slice(0, 2).map(cls => ({
      type: 'live-class',
      title: `Enrolled in "${cls.title}"`,
      time: new Date(cls.enrolled_at).toLocaleDateString(),
      icon: FaVideo
    })),
    ...dashboardData.bookClubSessions.slice(0, 1).map(session => ({
      type: 'book-club',
      title: `Joined "${session.book_title}" discussion`,
      time: new Date(session.joined_at).toLocaleDateString(),
      icon: FaBook
    }))
  ].slice(0, 4);

  // Generate upcoming events from real data
  const upcomingEvents = [
    ...dashboardData.bookClubSessions
      .filter(session => new Date(session.scheduled_time) > new Date())
      .slice(0, 2)
      .map(session => ({
        title: `Book Club: "${session.book_title}"`,
        date: new Date(session.scheduled_time).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        type: 'book-club',
        participants: 0
      })),
    ...dashboardData.classes
      .filter(cls => new Date(cls.scheduled_time) > new Date())
      .slice(0, 2)
      .map(cls => ({
        title: `Live Class: "${cls.title}"`,
        date: new Date(cls.scheduled_time).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        type: 'live-class',
        participants: cls.current_participants
      }))
  ].slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-yoruba-gold/20"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-yoruba-navy mb-2">
              Kú àárọ̀, {user.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to continue your Yoruba learning journey today?
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="px-3 py-1 bg-yoruba-green/10 text-yoruba-green rounded-full text-sm font-medium">
                {user.selectedPlan || 'Novice'} Plan
              </span>
              <span className="px-3 py-1 bg-yoruba-blue/10 text-yoruba-blue rounded-full text-sm font-medium">
                {user.selectedCategory || 'Group'} Classes
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-semibold text-yoruba-navy">
              {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-yoruba-navy">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <h3 className="text-xl font-bold text-yoruba-navy mb-4 flex items-center">
            <FaClock className="w-5 h-5 mr-2 text-yoruba-gold" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-lg bg-yoruba-gold/10">
                      <Icon className="w-4 h-4 text-yoruba-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <FaClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No recent activities yet</p>
                <div className="space-y-2">
                  <button className="block w-full bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors">
                    Join a Book Club
                  </button>
                  <button className="block w-full bg-yoruba-green text-white px-4 py-2 rounded-lg hover:bg-yoruba-green/90 transition-colors">
                    Enroll in Live Class
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
        >
          <h3 className="text-xl font-bold text-yoruba-navy mb-4 flex items-center">
            <FaCalendarAlt className="w-5 h-5 mr-2 text-yoruba-green" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-yoruba-gold/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.type === 'book-club' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'live-class' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                  <p className="text-xs text-gray-500">{event.participants} participants</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No upcoming events scheduled</p>
                <div className="space-y-2">
                  <button className="block w-full bg-yoruba-blue text-white px-4 py-2 rounded-lg hover:bg-yoruba-blue/90 transition-colors">
                    Browse Available Classes
                  </button>
                  <button className="block w-full bg-yoruba-green text-white px-4 py-2 rounded-lg hover:bg-yoruba-green/90 transition-colors">
                    Join Study Group
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
      >
        <h3 className="text-xl font-bold text-yoruba-navy mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg border-2 border-dashed border-yoruba-gold/30 hover:border-yoruba-gold hover:bg-yoruba-gold/5 transition-all duration-200 text-center">
            <FaBook className="w-8 h-8 text-yoruba-gold mx-auto mb-2" />
            <p className="font-medium text-yoruba-navy">Join Book Discussion</p>
            <p className="text-sm text-gray-600">Participate in ongoing discussions</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-yoruba-green/30 hover:border-yoruba-green hover:bg-yoruba-green/5 transition-all duration-200 text-center">
            <FaVideo className="w-8 h-8 text-yoruba-green mx-auto mb-2" />
            <p className="font-medium text-yoruba-navy">Book Live Class</p>
            <p className="text-sm text-gray-600">Schedule your next session</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-yoruba-blue/30 hover:border-yoruba-blue hover:bg-yoruba-blue/5 transition-all duration-200 text-center">
            <FaUsers className="w-8 h-8 text-yoruba-blue mx-auto mb-2" />
            <p className="font-medium text-yoruba-navy">Create Study Group</p>
            <p className="text-sm text-gray-600">Start learning with peers</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}