'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { FaBook, FaCalendarAlt, FaUsers, FaStar } from 'react-icons/fa';

interface BookClubSectionProps {
  user: AuthUser;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  discussionDate: string;
  discussionTime: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  chapters: number;
  currentChapter?: number;
  rating: number;
  reviews: number;
}

export default function BookClubSection({ user }: BookClubSectionProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'completed'>('current');

  const books: Book[] = [
    {
      id: '1',
      title: 'Ogboju Ode Ninu Igbo Irunmale',
      author: 'D.O. Fagunwa',
      description: 'A classic Yoruba novel about a brave hunter\'s adventures in the forest of spirits.',
      coverImage: '/images/books/ogboju-ode.jpg',
      discussionDate: '2024-01-15',
      discussionTime: '19:00',
      participants: 15,
      maxParticipants: 20,
      status: 'ongoing',
      difficulty: 'Intermediate',
      chapters: 12,
      currentChapter: 5,
      rating: 4.8,
      reviews: 24
    },
    {
      id: '2',
      title: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá',
      author: 'Various Authors',
      description: 'A collection of traditional Yoruba folktales and stories.',
      coverImage: '/images/books/yoruba-tales.jpg',
      discussionDate: '2024-01-22',
      discussionTime: '18:30',
      participants: 8,
      maxParticipants: 15,
      status: 'upcoming',
      difficulty: 'Beginner',
      chapters: 20,
      rating: 4.5,
      reviews: 18
    },
    {
      id: '3',
      title: 'Ìrètí Ayé',
      author: 'Akinwumi Isola',
      description: 'A modern Yoruba novel exploring themes of hope and resilience.',
      coverImage: '/images/books/ireti-aye.jpg',
      discussionDate: '2024-01-08',
      discussionTime: '19:30',
      participants: 12,
      maxParticipants: 12,
      status: 'completed',
      difficulty: 'Advanced',
      chapters: 15,
      rating: 4.9,
      reviews: 31
    }
  ];

  const filteredBooks = books.filter(book => book.status === activeTab);

  const upcomingDiscussions = [
    {
      book: 'Ogboju Ode Ninu Igbo Irunmale',
      chapter: 'Chapter 6: The Spirit of the Forest',
      date: 'Tomorrow',
      time: '7:00 PM',
      participants: 15
    },
    {
      book: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá',
      chapter: 'Opening Discussion',
      date: 'Next Monday',
      time: '6:30 PM',
      participants: 8
    }
  ];

  const joinDiscussion = (bookId: string) => {
    // TODO: Implement join discussion logic
    console.log('Joining discussion for book:', bookId);
    alert('Joined discussion! You will receive a notification before the session starts.');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <FaBook className="w-8 h-8 mr-3 text-yoruba-gold" />
              Yoruba Book Club
            </h1>
            <p className="text-gray-600 text-lg">
              Join discussions, explore Yoruba literature, and connect with fellow readers
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yoruba-gold/10 rounded-lg p-4">
              <p className="text-sm text-yoruba-navy font-medium">Your Reading Level</p>
              <p className="text-2xl font-bold text-yoruba-gold">{user.selectedPlan}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Discussions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-yoruba-gold/10"
      >
        <h3 className="text-xl font-bold text-yoruba-navy mb-4 flex items-center">
          <FaCalendarAlt className="w-5 h-5 mr-2 text-yoruba-green" />
          Upcoming Discussions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingDiscussions.map((discussion, index) => (
            <div key={index} className="p-4 rounded-lg border border-yoruba-gold/20 bg-gradient-to-r from-yoruba-gold/5 to-yoruba-green/5">
              <h4 className="font-semibold text-yoruba-navy mb-2">{discussion.book}</h4>
              <p className="text-sm text-gray-600 mb-2">{discussion.chapter}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-yoruba-green font-medium">{discussion.date} at {discussion.time}</span>
                <span className="text-gray-500">{discussion.participants} joined</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 border border-yoruba-gold/10">
        {[
          { id: 'current', label: 'Current Books', count: books.filter(b => b.status === 'ongoing').length },
          { id: 'upcoming', label: 'Upcoming', count: books.filter(b => b.status === 'upcoming').length },
          { id: 'completed', label: 'Completed', count: books.filter(b => b.status === 'completed').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-yoruba-gold text-yoruba-navy shadow-md'
                : 'text-gray-600 hover:text-yoruba-navy hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yoruba-gold/10 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-yoruba-gold/20 to-yoruba-green/20 flex items-center justify-center">
              <FaBook className="w-16 h-16 text-yoruba-gold" />
            </div>

            <div className="p-6">
              {/* Book Info */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-yoruba-navy text-lg leading-tight">{book.title}</h3>
                  <div className="flex items-center text-sm text-yellow-600">
                    <FaStar className="w-4 h-4 mr-1" />
                    {book.rating}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                <p className="text-gray-700 text-sm line-clamp-2">{book.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                  {book.difficulty}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
              </div>

              {/* Progress (for ongoing books) */}
              {book.status === 'ongoing' && book.currentChapter && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{book.currentChapter}/{book.chapters} chapters</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yoruba-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(book.currentChapter / book.chapters) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Discussion Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  {new Date(book.discussionDate).toLocaleDateString()} at {book.discussionTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaUsers className="w-4 h-4 mr-2" />
                  {book.participants}/{book.maxParticipants} participants
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => joinDiscussion(book.id)}
                disabled={book.participants >= book.maxParticipants}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  book.participants >= book.maxParticipants
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : book.status === 'ongoing'
                    ? 'bg-yoruba-blue text-white hover:bg-yoruba-blue/90'
                    : book.status === 'upcoming'
                    ? 'bg-yoruba-green text-white hover:bg-yoruba-green/90'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {book.participants >= book.maxParticipants
                  ? 'Discussion Full'
                  : book.status === 'ongoing'
                  ? 'Join Discussion'
                  : book.status === 'upcoming'
                  ? 'Register Interest'
                  : 'View Summary'
                }
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No {activeTab} books found
          </h3>
          <p className="text-gray-400">
            {activeTab === 'current' && 'No books are currently being discussed.'}
            {activeTab === 'upcoming' && 'No upcoming book discussions scheduled.'}
            {activeTab === 'completed' && 'No completed book discussions yet.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}