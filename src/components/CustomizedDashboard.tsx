'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GroupClass, DashboardConfig } from '../types';

interface CustomizedDashboardProps {
  user: User;
  onScheduleClass?: (classData: Partial<GroupClass>) => void;
}

const getDashboardConfig = (plan: string, role: string): DashboardConfig => {
  const configs: Record<string, DashboardConfig> = {
    Novice: {
      plan: 'Novice',
      features: [
        'Basic greetings and phrases',
        'Community access',
        'Weekly group sessions',
        'Basic pronunciation guide'
      ],
      accessLevel: 1,
      canScheduleClasses: role === 'teacher'
    },
    Beginner: {
      plan: 'Beginner',
      features: [
        'All Novice features',
        'Interactive exercises',
        'Bi-weekly group sessions',
        'Audio pronunciation feedback',
        'Basic conversation practice'
      ],
      accessLevel: 2,
      canScheduleClasses: role === 'teacher'
    },
    Intermediate: {
      plan: 'Intermediate',
      features: [
        'All Beginner features',
        'Advanced grammar lessons',
        'Weekly one-on-one sessions',
        'Cultural context lessons',
        'Writing practice',
        'Progress tracking'
      ],
      accessLevel: 3,
      canScheduleClasses: role === 'teacher'
    },
    Advanced: {
      plan: 'Advanced',
      features: [
        'All Intermediate features',
        'Fluency practice sessions',
        'Literature and poetry',
        'Advanced cultural nuances',
        'Teaching methodology (for teachers)',
        'Unlimited practice sessions',
        'Priority support'
      ],
      accessLevel: 4,
      canScheduleClasses: role === 'teacher'
    }
  };

  return configs[plan] || configs.Novice;
};

export default function CustomizedDashboard({ user, onScheduleClass }: CustomizedDashboardProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [classForm, setClassForm] = useState({
    title: '',
    description: '',
    level: user.selectedPlan || 'Novice',
    scheduledDate: '',
    duration: 60,
    maxStudents: 10
  });

  const config = getDashboardConfig(user.selectedPlan || 'Novice', user.role);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScheduleClass) {
      onScheduleClass({
        ...classForm,
        teacherId: user.id,
        level: classForm.level as any,
        enrolledStudents: [],
        createdAt: new Date().toISOString()
      });
    }
    setShowScheduleModal(false);
    setClassForm({
      title: '',
      description: '',
      level: user.selectedPlan || 'Novice',
      scheduledDate: '',
      duration: 60,
      maxStudents: 10
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-cream to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yoruba-green">
                Káàbọ̀, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {user.role === 'teacher' ? 'Teacher' : 'Student'} • {user.selectedPlan} Plan • {user.selectedCategory} Classes
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">
                {config.plan === 'Novice' && '🌱'}
                {config.plan === 'Beginner' && '📚'}
                {config.plan === 'Intermediate' && '🎯'}
                {config.plan === 'Advanced' && '👑'}
              </div>
              <span className="text-sm font-medium text-yoruba-green">
                Level {config.accessLevel}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-yoruba-green mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-yoruba-green/10 rounded-lg hover:bg-yoruba-green/20 transition-colors">
                  <div className="text-2xl mb-2">📚</div>
                  <span className="text-sm font-medium">Start Learning</span>
                </button>
                <button className="p-4 bg-yoruba-green/10 rounded-lg hover:bg-yoruba-green/20 transition-colors">
                  <div className="text-2xl mb-2">🎯</div>
                  <span className="text-sm font-medium">Practice</span>
                </button>
                {user.role === 'teacher' && config.canScheduleClasses && (
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="p-4 bg-yoruba-red/10 rounded-lg hover:bg-yoruba-red/20 transition-colors"
                  >
                    <div className="text-2xl mb-2">📅</div>
                    <span className="text-sm font-medium">Schedule Class</span>
                  </button>
                )}
                <button className="p-4 bg-yoruba-green/10 rounded-lg hover:bg-yoruba-green/20 transition-colors">
                  <div className="text-2xl mb-2">👥</div>
                  <span className="text-sm font-medium">Community</span>
                </button>
              </div>
            </motion.div>

            {/* Learning Progress */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-yoruba-green mb-4">
                {user.role === 'teacher' ? 'Teaching Progress' : 'Learning Progress'}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Level Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yoruba-green h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yoruba-green">12</div>
                    <div className="text-sm text-gray-600">
                      {user.role === 'teacher' ? 'Classes Taught' : 'Lessons Completed'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yoruba-green">8</div>
                    <div className="text-sm text-gray-600">
                      {user.role === 'teacher' ? 'Students Helped' : 'Hours Studied'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yoruba-green">95%</div>
                    <div className="text-sm text-gray-600">
                      {user.role === 'teacher' ? 'Satisfaction Rate' : 'Accuracy Rate'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-yoruba-green mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">✅</div>
                  <div>
                    <p className="font-medium">Completed: Basic Greetings</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">🎯</div>
                  <div>
                    <p className="font-medium">Practice Session: Pronunciation</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
                {user.role === 'teacher' && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl">📅</div>
                    <div>
                      <p className="font-medium">Scheduled: Group Session</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Features */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-yoruba-green mb-4">
                Your {config.plan} Features
              </h3>
              <ul className="space-y-2">
                {config.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-yoruba-green">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-yoruba-green mb-4">
                {user.role === 'teacher' ? 'Upcoming Classes' : 'Upcoming Sessions'}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yoruba-cream/30 rounded-lg">
                  <p className="font-medium text-sm">Group Session: Intermediate</p>
                  <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
                </div>
                <div className="p-3 bg-yoruba-cream/30 rounded-lg">
                  <p className="font-medium text-sm">Practice Session</p>
                  <p className="text-xs text-gray-600">Friday, 4:00 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Yoruba Word of the Day */}
            <motion.div
              className="bg-gradient-to-r from-yoruba-green to-yoruba-red text-white rounded-lg shadow-lg p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-2">Ọ̀rọ̀ Ọjọ́</h3>
              <p className="text-sm opacity-90 mb-2">Word of the Day</p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold text-lg">Ìfẹ́</p>
                <p className="text-sm">Love</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Schedule Class Modal */}
      {showScheduleModal && user.role === 'teacher' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yoruba-green">Schedule Group Class</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Title
                  </label>
                  <input
                    type="text"
                    value={classForm.title}
                    onChange={(e) => setClassForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={classForm.description}
                    onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={classForm.level}
                    onChange={(e) => setClassForm(prev => ({ ...prev, level: e.target.value as 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  >
                    <option value="Novice">Novice</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={classForm.scheduledDate}
                    onChange={(e) => setClassForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={classForm.duration}
                      onChange={(e) => setClassForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="30"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Students
                    </label>
                    <input
                      type="number"
                      value={classForm.maxStudents}
                      onChange={(e) => setClassForm(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yoruba-green text-white rounded-md hover:bg-yoruba-green/90"
                  >
                    Schedule Class
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
