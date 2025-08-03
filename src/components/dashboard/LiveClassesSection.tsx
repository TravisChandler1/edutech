'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { FaVideo, FaCalendarAlt, FaUsers, FaClock, FaPlay, FaBookmark, FaGraduationCap } from 'react-icons/fa';

interface LiveClassesSectionProps {
  user: AuthUser;
}

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Group' | 'Individual';
  date: string;
  time: string;
  duration: number; // in minutes
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'live' | 'completed';
  price: number;
  topics: string[];
  meetingLink?: string;
  recordingLink?: string;
}

export default function LiveClassesSection({ user }: LiveClassesSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'booked' | 'completed'>('upcoming');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const classes: LiveClass[] = [
    {
      id: '1',
      title: 'Yoruba Grammar Fundamentals',
      instructor: 'Prof. Adebayo Ogundimu',
      description: 'Learn the basic grammar structures of Yoruba language including sentence formation and verb conjugation.',
      level: 'Beginner',
      category: 'Group',
      date: '2024-01-16',
      time: '18:00',
      duration: 90,
      participants: 8,
      maxParticipants: 15,
      status: 'upcoming',
      price: 5000,
      topics: ['Sentence Structure', 'Verb Conjugation', 'Noun Classes', 'Basic Tenses']
    },
    {
      id: '2',
      title: 'Advanced Conversation Practice',
      instructor: 'Dr. Folake Adeyemi',
      description: 'Practice advanced Yoruba conversation skills with native speakers and fellow learners.',
      level: 'Advanced',
      category: 'Group',
      date: '2024-01-15',
      time: '19:30',
      duration: 60,
      participants: 5,
      maxParticipants: 8,
      status: 'live',
      price: 8000,
      topics: ['Idiomatic Expressions', 'Cultural Context', 'Formal Speech', 'Storytelling'],
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '3',
      title: 'Yoruba Pronunciation Masterclass',
      instructor: 'Baba Wande Abimbola',
      description: 'Master the tonal aspects and pronunciation of Yoruba language.',
      level: 'Intermediate',
      category: 'Individual',
      date: '2024-01-18',
      time: '16:00',
      duration: 45,
      participants: 1,
      maxParticipants: 1,
      status: 'upcoming',
      price: 12000,
      topics: ['Tonal Patterns', 'Vowel Harmony', 'Consonant Clusters', 'Accent Training']
    },
    {
      id: '4',
      title: 'Introduction to Yoruba Writing',
      instructor: 'Mrs. Kemi Olatunji',
      description: 'Learn to read and write in Yoruba using modern orthography.',
      level: 'Novice',
      category: 'Group',
      date: '2024-01-10',
      time: '17:00',
      duration: 75,
      participants: 12,
      maxParticipants: 12,
      status: 'completed',
      price: 3000,
      topics: ['Yoruba Alphabet', 'Diacritical Marks', 'Basic Writing', 'Reading Practice'],
      recordingLink: 'https://recordings.example.com/yoruba-writing-intro'
    }
  ];

  const filteredClasses = classes.filter(cls => {
    const statusMatch = activeTab === 'booked' ? ['upcoming', 'live'].includes(cls.status) : cls.status === activeTab;
    const levelMatch = filterLevel === 'all' || cls.level === filterLevel;
    const categoryMatch = filterCategory === 'all' || cls.category === filterCategory;
    return statusMatch && levelMatch && categoryMatch;
  });

  const bookClass = (classId: string) => {
    // TODO: Implement class booking logic
    console.log('Booking class:', classId);
    alert('Class booked successfully! You will receive a confirmation email.');
  };

  const joinClass = (_classId: string, meetingLink?: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      alert('Meeting link will be available 15 minutes before the class starts.');
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800 animate-pulse';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingClasses = classes.filter(cls => cls.status === 'upcoming').slice(0, 3);

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
              <FaVideo className="w-8 h-8 mr-3 text-yoruba-green" />
              Live Yoruba Classes
            </h1>
            <p className="text-gray-600 text-lg">
              Join live interactive classes with expert Yoruba instructors
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yoruba-green/10 rounded-lg p-4">
              <p className="text-sm text-yoruba-navy font-medium">Your Level</p>
              <p className="text-2xl font-bold text-yoruba-green">{user.selectedPlan}</p>
              <p className="text-sm text-gray-600">{user.selectedCategory} Classes</p>
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
              <FaCalendarAlt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
              <p className="text-2xl font-bold text-yoruba-navy">{upcomingClasses.length}</p>
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
              <FaGraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Completed</p>
              <p className="text-2xl font-bold text-yoruba-navy">12</p>
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
              <FaClock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-yoruba-navy">24</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="Novice">Novice</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoruba-blue focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Group">Group Classes</option>
              <option value="Individual">Individual Classes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 border border-yoruba-gold/10">
        {[
          { id: 'upcoming', label: 'Available Classes', count: classes.filter(c => c.status === 'upcoming').length },
          { id: 'live', label: 'Live Now', count: classes.filter(c => c.status === 'live').length },
          { id: 'booked', label: 'My Bookings', count: 3 },
          { id: 'completed', label: 'Completed', count: classes.filter(c => c.status === 'completed').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-yoruba-green text-white shadow-md'
                : 'text-gray-600 hover:text-yoruba-navy hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yoruba-gold/10 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Class Header */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-yoruba-navy text-lg leading-tight">{cls.title}</h3>
                {cls.status === 'live' && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">with {cls.instructor}</p>
              <p className="text-gray-700 text-sm line-clamp-2 mb-4">{cls.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(cls.level)}`}>
                  {cls.level}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {cls.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(cls.status)}`}>
                  {cls.status}
                </span>
              </div>

              {/* Class Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  {new Date(cls.date).toLocaleDateString()} at {cls.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="w-4 h-4 mr-2" />
                  {cls.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaUsers className="w-4 h-4 mr-2" />
                  {cls.participants}/{cls.maxParticipants} participants
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</p>
                <div className="flex flex-wrap gap-1">
                  {cls.topics.slice(0, 3).map((topic, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                  {cls.topics.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{cls.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-yoruba-green">₦{cls.price.toLocaleString()}</span>
                {cls.category === 'Individual' && (
                  <span className="text-xs text-gray-500">per session</span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (cls.status === 'live' && cls.meetingLink) {
                    joinClass(cls.id, cls.meetingLink);
                  } else if (cls.status === 'upcoming') {
                    bookClass(cls.id);
                  } else if (cls.status === 'completed' && cls.recordingLink) {
                    window.open(cls.recordingLink, '_blank');
                  }
                }}
                disabled={cls.status === 'upcoming' && cls.participants >= cls.maxParticipants}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  cls.status === 'live'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : cls.status === 'upcoming'
                    ? cls.participants >= cls.maxParticipants
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-yoruba-blue text-white hover:bg-yoruba-blue/90'
                    : cls.status === 'completed'
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {cls.status === 'live' && (
                  <>
                    <FaPlay className="w-4 h-4 mr-2" />
                    Join Live Class
                  </>
                )}
                {cls.status === 'upcoming' && (
                  <>
                    {cls.participants >= cls.maxParticipants ? (
                      'Class Full'
                    ) : (
                      <>
                        <FaBookmark className="w-4 h-4 mr-2" />
                        Book Class
                      </>
                    )}
                  </>
                )}
                {cls.status === 'completed' && (
                  <>
                    <FaPlay className="w-4 h-4 mr-2" />
                    Watch Recording
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaVideo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No classes found
          </h3>
          <p className="text-gray-400">
            Try adjusting your filters or check back later for new classes.
          </p>
        </motion.div>
      )}
    </div>
  );
}