'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Community, User } from '../types';

interface CommunityProps {
  user: User;
  onCreateCommunity?: (communityData: Partial<Community>) => void;
  onJoinCommunity?: (communityId: string) => void;
}

const sampleCommunities: Community[] = [
  {
    id: '1',
    name: 'Yoruba Beginners Circle',
    description: 'A supportive community for those just starting their Yoruba learning journey',
    creatorId: 'user1',
    members: ['user1', 'user2', 'user3', 'user4'],
    isApproved: true,
    approvedBy: 'admin1',
    approvedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-15T14:30:00Z',
    category: 'Study Group'
  },
  {
    id: '2',
    name: 'Cultural Heritage Discussions',
    description: 'Explore the rich cultural heritage and traditions of the Yoruba people',
    creatorId: 'user5',
    members: ['user5', 'user6', 'user7'],
    isApproved: true,
    approvedBy: 'admin1',
    approvedAt: '2024-01-22T09:15:00Z',
    createdAt: '2024-01-18T16:45:00Z',
    category: 'Cultural Discussion'
  },
  {
    id: '3',
    name: 'Advanced Yoruba Speakers',
    description: 'For fluent speakers to practice advanced conversations and literature',
    creatorId: 'user8',
    members: ['user8', 'user9'],
    isApproved: false,
    createdAt: '2024-01-25T11:20:00Z',
    category: 'Practice Partners'
  }
];

export default function Community({ user, onCreateCommunity, onJoinCommunity }: CommunityProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    category: 'General' as 'General' | 'Study Group' | 'Cultural Discussion' | 'Practice Partners'
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateCommunity) {
      onCreateCommunity({
        ...communityForm,
        creatorId: user.id,
        members: [user.id],
        isApproved: false,
        createdAt: new Date().toISOString()
      });
    }
    setShowCreateModal(false);
    setCommunityForm({
      name: '',
      description: '',
      category: 'General'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'General': return '💬';
      case 'Study Group': return '📚';
      case 'Cultural Discussion': return '🏛️';
      case 'Practice Partners': return '🤝';
      default: return '💬';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General': return 'bg-blue-100 text-blue-800';
      case 'Study Group': return 'bg-green-100 text-green-800';
      case 'Cultural Discussion': return 'bg-purple-100 text-purple-800';
      case 'Practice Partners': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const approvedCommunities = sampleCommunities.filter(c => c.isApproved);
  const pendingCommunities = sampleCommunities.filter(c => !c.isApproved && c.creatorId === user.id);

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
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">🌍 Yoruba Communities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow learners, share experiences, and build lasting relationships in our vibrant Yoruba learning communities.
          </p>
        </motion.div>

        {/* Create Community Button */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yoruba-green text-white px-6 py-3 rounded-lg hover:bg-yoruba-green/90 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Create Community</span>
          </button>
        </motion.div>

        {/* Pending Communities (for creators) */}
        {pendingCommunities.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-yoruba-green mb-6">⏳ Pending Approval</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(community.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-yoruba-green">{community.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(community.category)}`}>
                          {community.category}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{community.description}</p>
                  <div className="text-sm text-gray-500">
                    Created on {new Date(community.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Communities */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-yoruba-green mb-6">✅ Active Communities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {approvedCommunities.map((community) => (
              <motion.div
                key={community.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{getCategoryIcon(community.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-yoruba-green">{community.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(community.category)}`}>
                        {community.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{community.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">👥</span>
                      <span>{community.members.length} members</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(community.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onJoinCommunity?.(community.id)}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      community.members.includes(user.id)
                        ? 'bg-gray-100 text-gray-600 cursor-default'
                        : 'bg-yoruba-green text-white hover:bg-yoruba-green/90'
                    }`}
                    disabled={community.members.includes(user.id)}
                  >
                    {community.members.includes(user.id) ? 'Already Joined' : 'Join Community'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          className="bg-gradient-to-r from-yoruba-green to-yoruba-red text-white rounded-lg shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">📋 Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">✅ Creating Communities</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• All communities require admin approval</li>
                <li>• Choose appropriate category and description</li>
                <li>• Maintain respectful and inclusive environment</li>
                <li>• Focus on Yoruba learning and culture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🤝 Community Categories</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• <strong>General:</strong> Open discussions and networking</li>
                <li>• <strong>Study Group:</strong> Focused learning sessions</li>
                <li>• <strong>Cultural Discussion:</strong> Heritage and traditions</li>
                <li>• <strong>Practice Partners:</strong> Language practice pairs</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yoruba-green">Create New Community</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your community will be reviewed by our admin team before being approved and made visible to other users.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={communityForm.name}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g., Yoruba Poetry Lovers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={communityForm.description}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Describe what your community is about and what members can expect..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['General', 'Study Group', 'Cultural Discussion', 'Practice Partners'] as const).map((category) => (
                      <div
                        key={category}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          communityForm.category === category
                            ? 'border-yoruba-green bg-yoruba-green/10'
                            : 'border-gray-200 hover:border-yoruba-green/50'
                        }`}
                        onClick={() => setCommunityForm(prev => ({ ...prev, category }))}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">{getCategoryIcon(category)}</div>
                          <span className="text-xs font-medium">{category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yoruba-green text-white rounded-md hover:bg-yoruba-green/90"
                  >
                    Create Community
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
