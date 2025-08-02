'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { FaBook, FaVideo, FaUsers, FaClock, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

interface DashboardOverviewProps {
  user: AuthUser;
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  const stats = [
    {
      label: 'Books Read',
      value: '3',
      icon: FaBook,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      label: 'Classes Attended',
      value: '12',
      icon: FaVideo,
      color: 'bg-green-500',
      change: '+4 this week'
    },
    {
      label: 'Study Groups',
      value: '2',
      icon: FaUsers,
      color: 'bg-purple-500',
      change: 'Active groups'
    },
    {
      label: 'Study Hours',
      value: '24',
      icon: FaClock,
      color: 'bg-orange-500',
      change: '+6 this week'
    }
  ];

  const recentActivities = [
    {
      type: 'book-club',
      title: 'Joined "Àkójọpọ̀ Àwọn Àlọ́ Yorùbá" discussion',
      time: '2 hours ago',
      icon: FaBook
    },
    {
      type: 'live-class',
      title: 'Attended Intermediate Grammar Session',
      time: '1 day ago',
      icon: FaVideo
    },
    {
      type: 'group',
      title: 'Created study group "Lagos Learners"',
      time: '3 days ago',
      icon: FaUsers
    },
    {
      type: 'achievement',
      title: 'Completed Beginner Level!',
      time: '1 week ago',
      icon: FaTrophy
    }
  ];

  const upcomingEvents = [
    {
      title: 'Book Club Discussion: "Ogboju Ode"',
      date: 'Tomorrow, 7:00 PM',
      type: 'book-club',
      participants: 15
    },
    {
      title: 'Live Class: Advanced Conversation',
      date: 'Friday, 6:00 PM',
      type: 'live-class',
      participants: 8
    },
    {
      title: 'Study Group: Grammar Practice',
      date: 'Saturday, 2:00 PM',
      type: 'group',
      participants: 5
    }
  ];

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
            {recentActivities.map((activity, index) => {
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
            })}
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
            {upcomingEvents.map((event, index) => (
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
            ))}
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