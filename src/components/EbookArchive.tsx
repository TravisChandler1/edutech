'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ebook, SavedBook, User } from '../types';

interface EbookArchiveProps {
  user: User;
  onSaveBook?: (ebookId: string) => void;
  onRemoveSavedBook?: (savedBookId: string) => void;
}

const sampleEbooks: Ebook[] = [
  {
    id: '1',
    title: 'Yoruba Grammar Fundamentals',
    author: 'Dr. Adebayo Lawal',
    description: 'A comprehensive guide to understanding Yoruba grammar structures, verb conjugations, and sentence formation.',
    coverImageUrl: '/images/grammar-fundamentals.jpg',
    fileUrl: '/ebooks/yoruba-grammar-fundamentals.pdf',
    category: 'Grammar',
    language: 'Bilingual',
    pages: 245,
    fileSize: '12.3 MB',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Àkójọpọ̀ Àwọn Àlọ́ Yorùbá',
    author: 'Prof. Wande Abimbola',
    description: 'Traditional Yoruba folktales with moral lessons, perfect for beginners to intermediate learners.',
    coverImageUrl: '/images/yoruba-folktales.jpg',
    fileUrl: '/ebooks/yoruba-folktales.pdf',
    category: 'Stories',
    language: 'Yoruba',
    pages: 180,
    fileSize: '8.7 MB',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: '3',
    title: 'Yoruba Cultural Heritage',
    author: 'Dr. Funmi Osoba',
    description: 'Explore the rich cultural traditions, festivals, and customs of the Yoruba people.',
    coverImageUrl: '/images/cultural-heritage.jpg',
    fileUrl: '/ebooks/yoruba-cultural-heritage.pdf',
    category: 'Cultural',
    language: 'English',
    pages: 320,
    fileSize: '18.5 MB',
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    title: 'Ewì Yorùbá: Classical Poetry',
    author: 'Akinwumi Isola',
    description: 'A collection of classical Yoruba poetry exploring themes of love, nature, and spirituality.',
    coverImageUrl: '/images/yoruba-poetry.jpg',
    fileUrl: '/ebooks/yoruba-classical-poetry.pdf',
    category: 'Advanced',
    language: 'Yoruba',
    pages: 156,
    fileSize: '6.2 MB',
    createdAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '5',
    title: 'Learn Yoruba in 30 Days',
    author: 'Tunde Kelani',
    description: 'A beginner-friendly approach to learning Yoruba with daily lessons and exercises.',
    coverImageUrl: '/images/learn-yoruba-30-days.jpg',
    fileUrl: '/ebooks/learn-yoruba-30-days.pdf',
    category: 'Beginner',
    language: 'Bilingual',
    pages: 210,
    fileSize: '15.1 MB',
    createdAt: '2024-01-25T11:20:00Z'
  },
  {
    id: '6',
    title: 'Advanced Yoruba Conversations',
    author: 'Dr. Kemi Rotimi',
    description: 'Master complex conversations and idiomatic expressions in Yoruba.',
    coverImageUrl: '/images/advanced-conversations.jpg',
    fileUrl: '/ebooks/advanced-yoruba-conversations.pdf',
    category: 'Advanced',
    language: 'Bilingual',
    pages: 275,
    fileSize: '14.8 MB',
    createdAt: '2024-01-28T13:10:00Z'
  }
];

const sampleSavedBooks: SavedBook[] = [
  {
    id: '1',
    userId: 'user1',
    ebookId: '1',
    savedAt: '2024-01-26T10:30:00Z',
    readingProgress: 35,
    lastReadAt: '2024-01-27T14:20:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    ebookId: '2',
    savedAt: '2024-01-25T16:45:00Z',
    readingProgress: 78,
    lastReadAt: '2024-01-27T09:15:00Z'
  }
];

export default function EbookArchive({ user, onSaveBook, onRemoveSavedBook }: EbookArchiveProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Cultural', 'Grammar', 'Stories'];
  const languages = ['All', 'Yoruba', 'English', 'Bilingual'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Beginner': return '🌱';
      case 'Intermediate': return '📚';
      case 'Advanced': return '🎓';
      case 'Cultural': return '🏛️';
      case 'Grammar': return '📝';
      case 'Stories': return '📖';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'Cultural': return 'bg-purple-100 text-purple-800';
      case 'Grammar': return 'bg-yellow-100 text-yellow-800';
      case 'Stories': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'Yoruba': return '🇳🇬';
      case 'English': return '🇺🇸';
      case 'Bilingual': return '🌍';
      default: return '📖';
    }
  };

  const filteredEbooks = sampleEbooks.filter(ebook => {
    const matchesCategory = selectedCategory === 'All' || ebook.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || ebook.language === selectedLanguage;
    const matchesSearch = searchQuery === '' || 
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const savedEbookIds = sampleSavedBooks.filter(sb => sb.userId === user.id).map(sb => sb.ebookId);
  const savedEbooks = sampleEbooks.filter(ebook => savedEbookIds.includes(ebook.id));

  const getSavedBookProgress = (ebookId: string) => {
    const savedBook = sampleSavedBooks.find(sb => sb.userId === user.id && sb.ebookId === ebookId);
    return savedBook?.readingProgress || 0;
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
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">📚 Ebook Archive</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of Yoruba ebooks, from beginner guides to advanced literature. Save your favorites and track your reading progress.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-2 flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-yoruba-green text-white'
                  : 'text-yoruba-green hover:bg-yoruba-green/10'
              }`}
            >
              📚 All Books ({filteredEbooks.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeTab === 'saved'
                  ? 'bg-yoruba-green text-white'
                  : 'text-yoruba-green hover:bg-yoruba-green/10'
              }`}
            >
              💾 Saved Books ({savedEbooks.length})
            </button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        {activeTab === 'all' && (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Books Tab */}
        {activeTab === 'all' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEbooks.map((ebook) => (
                <motion.div
                  key={ebook.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-yoruba-green/20 to-yoruba-red/20 flex items-center justify-center">
                      <div className="text-6xl">{getCategoryIcon(ebook.category)}</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ebook.category)}`}>
                        {ebook.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-lg" title={ebook.language}>
                        {getLanguageIcon(ebook.language)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-yoruba-green mb-2 line-clamp-2">{ebook.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {ebook.author}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ebook.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{ebook.pages} pages</span>
                      <span>{ebook.fileSize}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-yoruba-green text-white py-2 px-3 rounded-md hover:bg-yoruba-green/90 transition-colors text-sm">
                        📖 Read Now
                      </button>
                      <button
                        onClick={() => onSaveBook?.(ebook.id)}
                        className={`px-3 py-2 rounded-md transition-colors text-sm ${
                          savedEbookIds.includes(ebook.id)
                            ? 'bg-gray-100 text-gray-600 cursor-default'
                            : 'border border-yoruba-green text-yoruba-green hover:bg-yoruba-green/10'
                        }`}
                        disabled={savedEbookIds.includes(ebook.id)}
                      >
                        {savedEbookIds.includes(ebook.id) ? '✅' : '💾'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredEbooks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Saved Books Tab */}
        {activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEbooks.map((ebook) => {
                const progress = getSavedBookProgress(ebook.id);
                return (
                  <motion.div
                    key={ebook.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-yoruba-green/20 to-yoruba-red/20 flex items-center justify-center">
                        <div className="text-6xl">{getCategoryIcon(ebook.category)}</div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ebook.category)}`}>
                          {ebook.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {progress}% complete
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-yoruba-green mb-2 line-clamp-2">{ebook.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">by {ebook.author}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Reading Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yoruba-green h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-yoruba-green text-white py-2 px-3 rounded-md hover:bg-yoruba-green/90 transition-colors text-sm">
                          📖 Continue Reading
                        </button>
                        <button
                          onClick={() => {
                            const savedBook = sampleSavedBooks.find(sb => sb.userId === user.id && sb.ebookId === ebook.id);
                            if (savedBook) {
                              onRemoveSavedBook?.(savedBook.id);
                            }
                          }}
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {savedEbooks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💾</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved books yet</h3>
                <p className="text-gray-500 mb-4">Start building your personal library by saving books you want to read.</p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="bg-yoruba-green text-white px-6 py-2 rounded-md hover:bg-yoruba-green/90 transition-colors"
                >
                  Browse All Books
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Reading Statistics */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-yoruba-green to-yoruba-red text-white rounded-lg shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">📊 Your Reading Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{savedEbooks.length}</div>
              <div className="text-sm opacity-90">Books Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {Math.round(savedEbooks.reduce((acc, ebook) => acc + getSavedBookProgress(ebook.id), 0) / (savedEbooks.length || 1))}%
              </div>
              <div className="text-sm opacity-90">Average Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {savedEbooks.filter(ebook => getSavedBookProgress(ebook.id) === 100).length}
              </div>
              <div className="text-sm opacity-90">Books Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {savedEbooks.reduce((acc, ebook) => acc + ebook.pages, 0)}
              </div>
              <div className="text-sm opacity-90">Total Pages</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
