'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookClubSession, Book, User } from '../types';

interface BookClubProps {
  user: User;
  currentBooks: Book[];
  onScheduleSession?: (sessionData: Partial<BookClubSession>) => void;
}

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá',
    synopsis: 'A collection of traditional Yoruba folktales that teach moral lessons and cultural values.',
    coverImage: '/images/yoruba-tales.jpg'
  },
  {
    id: '2',
    title: 'Ìtàn Òdùduwà',
    synopsis: 'The legendary story of Oduduwa, the progenitor of the Yoruba people.',
    coverImage: '/images/oduduwa-story.jpg'
  },
  {
    id: '3',
    title: 'Ewì Yorùbá Àtijọ́',
    synopsis: 'Classical Yoruba poetry exploring themes of love, nature, and spirituality.',
    coverImage: '/images/yoruba-poetry.jpg'
  }
];

export default function BookClub({ user, currentBooks = sampleBooks, onScheduleSession }: BookClubProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    sessionType: 'group_chat' as 'group_chat' | 'live_discussion',
    scheduledDate: '',
    duration: 60,
    maxParticipants: 20
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScheduleSession && selectedBook) {
      onScheduleSession({
        ...sessionForm,
        bookId: selectedBook.id,
        hostId: user.id,
        participants: [],
        createdAt: new Date().toISOString()
      });
    }
    setShowScheduleModal(false);
    setSessionForm({
      title: '',
      description: '',
      sessionType: 'group_chat',
      scheduledDate: '',
      duration: 60,
      maxParticipants: 20
    });
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
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">📚 Yoruba Book Club</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join fellow learners in exploring Yoruba literature, culture, and language through engaging book discussions and live sessions.
          </p>
        </motion.div>

        {/* Current Books */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-yoruba-green mb-6">Current Book Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
              <motion.div
                key={book.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => setSelectedBook(book)}
              >
                <div className="h-48 bg-gradient-to-br from-yoruba-green/20 to-yoruba-red/20 flex items-center justify-center">
                  <div className="text-6xl">📖</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-yoruba-green mb-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.synopsis}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                      setShowScheduleModal(true);
                    }}
                    className="w-full bg-yoruba-green text-white py-2 px-4 rounded-md hover:bg-yoruba-green/90 transition-colors"
                  >
                    Schedule Discussion
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-yoruba-green mb-6">Upcoming Sessions</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yoruba-cream/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h4 className="font-semibold">Group Chat: Àkójọpọ̀ Àwọn Àlọ́ Yorùbá</h4>
                    <p className="text-sm text-gray-600">Tomorrow, 7:00 PM • 12 participants</p>
                  </div>
                </div>
                <button className="bg-yoruba-green text-white px-4 py-2 rounded-md hover:bg-yoruba-green/90">
                  Join
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-yoruba-cream/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🎥</div>
                  <div>
                    <h4 className="font-semibold">Live Discussion: Ìtàn Òdùduwà</h4>
                    <p className="text-sm text-gray-600">Friday, 6:00 PM • 8 participants</p>
                  </div>
                </div>
                <button className="bg-yoruba-red text-white px-4 py-2 rounded-md hover:bg-yoruba-red/90">
                  Join Live
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Discussion Guidelines */}
        <motion.div
          className="bg-gradient-to-r from-yoruba-green to-yoruba-red text-white rounded-lg shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">📋 Discussion Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">📚 Group Chat Sessions</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Text-based discussions</li>
                <li>• Share thoughts and insights</li>
                <li>• Ask questions about the book</li>
                <li>• Practice Yoruba vocabulary</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎥 Live Discussion Sessions</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Video/audio discussions</li>
                <li>• Real-time interaction</li>
                <li>• Practice pronunciation</li>
                <li>• Cultural context exploration</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yoruba-green">Schedule Book Discussion</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-3 bg-yoruba-cream/30 rounded-lg">
                <h4 className="font-medium text-yoruba-green">Selected Book:</h4>
                <p className="text-sm">{selectedBook.title}</p>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={sessionForm.title}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="e.g., Chapter 1-3 Discussion"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={sessionForm.description}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="What will you discuss in this session?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        sessionForm.sessionType === 'group_chat'
                          ? 'border-yoruba-green bg-yoruba-green/10'
                          : 'border-gray-200 hover:border-yoruba-green/50'
                      }`}
                      onClick={() => setSessionForm(prev => ({ ...prev, sessionType: 'group_chat' }))}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💬</div>
                        <span className="text-sm font-medium">Group Chat</span>
                      </div>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        sessionForm.sessionType === 'live_discussion'
                          ? 'border-yoruba-green bg-yoruba-green/10'
                          : 'border-gray-200 hover:border-yoruba-green/50'
                      }`}
                      onClick={() => setSessionForm(prev => ({ ...prev, sessionType: 'live_discussion' }))}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">🎥</div>
                        <span className="text-sm font-medium">Live Discussion</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionForm.scheduledDate}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
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
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="30"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={sessionForm.maxParticipants}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      min="5"
                      max="50"
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
                    className="px-4 py-2 bg-yoruba-navy text-white rounded-md hover:bg-yoruba-navy/90"
                  >
                    Schedule Session
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
