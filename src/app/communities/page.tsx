'use client';

import { useAuth } from '@/context/AuthContext';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';
import dynamic from 'next/dynamic';

// Dynamically import the Community component with no SSR
const Community = dynamic(() => import('@/components/Community'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
    </div>
  ),
});

import { User } from '@/types';

interface CommunityProps {
  user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>;
}

export default function CommunitiesPage() {
  const { currentUser, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Removed auto-popup auth modal timer

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoruba-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  const visitorContent = (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-12">
      <h2 className="text-3xl font-bold text-yoruba-green mb-6 text-center">Join Our Yoruba Learning Community</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Connect & Learn</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Join topic-based communities for focused learning</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Practice with native speakers and fellow learners</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Share resources and learning tips</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Community Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Create or join existing communities</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Participate in discussions and events</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Connect with language partners</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 bg-yoruba-green text-white rounded-lg hover:bg-yoruba-green-dark transition-colors text-lg font-medium"
        >
          Join Our Community
        </button>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-yoruba-cream py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Learning Communities</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Connect with fellow Yoruba language learners, practice speaking, and share cultural experiences in our vibrant communities.
            </p>
          </div>
          {visitorContent}
          {/* Single Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode="register"
          />
        </div>
      </div>
    );
  }

  const communityProps: CommunityProps = {
    user: {
      id: currentUser.id,
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: (currentUser.role as 'student' | 'teacher' | 'admin') || 'student',
      createdAt: currentUser.createdAt || new Date().toISOString(),
    },
  };

  return (
    <div className="min-h-screen bg-yoruba-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Learning Communities</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {currentUser.role === 'teacher' 
              ? 'Create and moderate communities to support your students\' learning journey.'
              : 'Connect with fellow learners, practice speaking, and immerse yourself in Yoruba language and culture.'
            }
          </p>
        </div>
        <Community {...communityProps} />
      </div>
    </div>
  );
}