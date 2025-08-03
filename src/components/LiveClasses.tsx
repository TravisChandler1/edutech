'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiveClass, PreRecordedClass, User } from '../types';

interface LiveClassesProps {
  user: User;
  onScheduleClass?: (classData: Partial<LiveClass>) => void;
  onJoinClass?: (classId: string) => void;
}

// Live classes will be fetched from API
const initialLiveClasses: LiveClass[] = [
  {
    id: '1',
    teacherId: 'teacher1',
    title: 'Yoruba Greetings & Basic Conversations',
    description: 'Learn essential greetings and how to introduce yourself in Yoruba',
    level: 'Novice',
    scheduledDate: '2024-01-28T14:00:00Z',
    duration: 60,
    maxStudents: 15,
    enrolledStudents: ['student1', 'student2'],
    isLive: false,
    meetingLink: 'https://meet.google.com/abc-1234-xyz',
    meetingPassword: 'yoruba123',
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '2',
    teacherId: 'teacher2',
    title: 'Advanced Grammar Structures',
    description: 'Deep dive into complex Yoruba grammar patterns and sentence construction',
    level: 'Advanced',
    scheduledDate: '2024-01-29T16:00:00Z',
    duration: 90,
    maxStudents: 10,
    enrolledStudents: ['student3', 'student4', 'student5'],
    isLive: true,
    meetingLink: 'https://meet.google.com/def-5678-uvw',
    meetingPassword: 'yoruba456',
    createdAt: '2024-01-26T09:00:00Z'
  }
];

// Pre-recorded classes will be fetched from API
const initialPreRecordedClasses: PreRecordedClass[] = [
  {
    id: '1',
    teacherId: 'teacher1',
    title: 'Yoruba Alphabet and Pronunciation',
    description: 'Master the Yoruba alphabet and learn proper pronunciation techniques',
    level: 'Novice',
    videoUrl: '/videos/yoruba-alphabet.mp4',
    duration: 45,
    thumbnailUrl: '/images/alphabet-thumb.jpg',
    views: 234,
    createdAt: '2024-01-20T12:00:00Z'
  },
  {
    id: '2',
    teacherId: 'teacher2',
    title: 'Cultural Context in Yoruba Language',
    description: 'Understanding the cultural significance behind Yoruba expressions',
    level: 'Intermediate',
    videoUrl: '/videos/cultural-context.mp4',
    duration: 75,
    thumbnailUrl: '/images/culture-thumb.jpg',
    views: 189,
    createdAt: '2024-01-22T14:30:00Z'
  }
];

export default function LiveClasses({ user, onScheduleClass, onJoinClass }: LiveClassesProps) {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [preRecordedClasses, setPreRecordedClasses] = useState<PreRecordedClass[]>([]);

  // Fetch live classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const [liveResponse, recordedResponse] = await Promise.all([
          fetch('/api/classes/live'),
          fetch('/api/classes/recorded')
        ]);
        
        if (liveResponse.ok) {
          const liveData = await liveResponse.json();
          setLiveClasses(liveData.classes || []);
        }
        
        if (recordedResponse.ok) {
          const recordedData = await recordedResponse.json();
          setPreRecordedClasses(recordedData.classes || []);
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        // Fallback to sample data if API fails
        setLiveClasses(initialLiveClasses);
        setPreRecordedClasses(initialPreRecordedClasses);
      }
    };

    fetchClasses();
  }, []);

  const [activeTab, setActiveTab] = useState<'live' | 'recorded'>('live');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [classForm, setClassForm] = useState({
    title: '',
    description: '',
    level: user.selectedPlan || 'Novice',
    scheduledDate: '',
    duration: 60,
    maxStudents: 15
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScheduleClass) {
      onScheduleClass({
        ...classForm,
        teacherId: user.id,
        enrolledStudents: [],
        isLive: false,
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
      maxStudents: 15
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-cream to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">🎓 Interactive Classes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join live interactive sessions with real-time instruction or catch up with pre-recorded classes at your own pace.
          </p>
        </motion.div>

        {/* Action Buttons */}
        {user.role === 'teacher' && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-yoruba-green text-white px-6 py-3 rounded-lg hover:bg-yoruba-green/90 transition-colors flex items-center space-x-2"
            >
              <span>📅</span>
              <span>Schedule Live Class</span>
            </button>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-2 flex">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'live'
                  ? 'bg-yoruba-green text-white'
                  : 'text-yoruba-green hover:bg-yoruba-green/10'
              }`}
            >
              🔴 Live Classes
            </button>
            <button
              onClick={() => setActiveTab('recorded')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'recorded'
                  ? 'bg-yoruba-green text-white'
                  : 'text-yoruba-green hover:bg-yoruba-green/10'
              }`}
            >
              📹 Pre-recorded Classes
            </button>
          </div>
        </motion.div>

        {/* Live Classes Tab */}
        {activeTab === 'live' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveClasses.map((liveClass) => (
                <div key={liveClass.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          liveClass.level === 'Novice' ? 'bg-green-100 text-green-800' :
                          liveClass.level === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                          liveClass.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {liveClass.level}
                        </span>
                        {liveClass.isLive && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                            LIVE
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{liveClass.duration} min</span>
                    </div>

                    <h3 className="text-xl font-semibold text-yoruba-green mb-2">{liveClass.title}</h3>
                    <p className="text-gray-600 mb-4">{liveClass.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>{formatDate(liveClass.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">👥</span>
                        <span>{liveClass.enrolledStudents.length}/{liveClass.maxStudents} enrolled</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {liveClass.isLive ? (
                        <button
                          onClick={() => onJoinClass?.(liveClass.id)}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>🔴</span>
                          <span>Join Live</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onJoinClass?.(liveClass.id)}
                          className="flex-1 bg-yoruba-green text-white py-2 px-4 rounded-md hover:bg-yoruba-green/90 transition-colors"
                        >
                          {liveClass.enrolledStudents.includes(user.id) ? 'Enter Class' : 'Enroll'}
                        </button>
                      )}
                      {liveClass.recordingUrl && (
                        <button className="px-4 py-2 border border-yoruba-green text-yoruba-green rounded-md hover:bg-yoruba-green/10 transition-colors">
                          📹 Recording
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pre-recorded Classes Tab */}
        {activeTab === 'recorded' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {preRecordedClasses.map((recordedClass) => (
                <div key={recordedClass.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-yoruba-green/20 to-yoruba-red/20 flex items-center justify-center">
                      <div className="text-6xl">🎥</div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {recordedClass.duration} min
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recordedClass.level === 'Novice' ? 'bg-green-100 text-green-800' :
                        recordedClass.level === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                        recordedClass.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {recordedClass.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-yoruba-green mb-2">{recordedClass.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recordedClass.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {recordedClass.views} views
                      </span>
                      <span>{new Date(recordedClass.createdAt).toLocaleDateString()}</span>
                    </div>

                    <button className="w-full bg-yoruba-green text-white py-2 px-4 rounded-md hover:bg-yoruba-green/90 transition-colors flex items-center justify-center space-x-2">
                      <span>▶️</span>
                      <span>Watch Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Info */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-yoruba-green to-yoruba-red text-white rounded-lg shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">✨ Interactive Learning Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">🔴 Live Classes</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Real-time interaction with teachers</li>
                <li>• Ask questions instantly</li>
                <li>• Practice pronunciation live</li>
                <li>• Interactive exercises</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📹 Pre-recorded Classes</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Learn at your own pace</li>
                <li>• Replay difficult sections</li>
                <li>• Available 24/7</li>
                <li>• High-quality video content</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">👨‍🏫 For Teachers</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Schedule interactive sessions</li>
                <li>• Manage class enrollment</li>
                <li>• Record sessions automatically</li>
                <li>• Track student progress</li>
              </ul>
            </div>
          </div>
        </motion.div>
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
                <h3 className="text-xl font-semibold text-yoruba-green">Schedule Live Class</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
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
                      max="30"
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
