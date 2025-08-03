'use client';

import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import dynamic from 'next/dynamic';
import { BookClubSession } from '@/types';

// Dynamically import the BookClub component with no SSR
const BookClub = dynamic(() => import('@/components/BookClub'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
    </div>
  ),
});

export default function BookClubPage() {
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);


  const handleScheduleSession = (sessionData: Partial<BookClubSession>) => {
    console.log('Scheduling book club session:', sessionData);
    // TODO: Implement API call to schedule session
  };

  const visitorContent = (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-12">
      <h2 className="text-3xl font-bold text-yoruba-green mb-6 text-center">Join Our Yoruba Book Club</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">What We Offer</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Engaging discussions of Yoruba literature and culture</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Live discussions with authors and cultural experts</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Reading guides and discussion questions</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Monthly Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Featured book of the month with group discussions</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Author Q&A sessions</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Cultural insights and language learning</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 bg-yoruba-green text-white rounded-lg hover:bg-yoruba-green-dark transition-colors text-lg font-medium"
        >
          Join the Book Club
        </button>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-yoruba-cream py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Language Book Club</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore the rich world of Yoruba literature and improve your language skills through engaging discussions and cultural insights.
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

  return (
    <div className="min-h-screen bg-yoruba-cream py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Language Book Club</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {currentUser.role === 'teacher' 
              ? 'Schedule and manage book club sessions for your students.'
              : 'Join our community of readers and explore Yoruba literature together.'
            }
          </p>
        </div>
        <BookClub 
          user={currentUser}
          onScheduleSession={handleScheduleSession}
        />
      </div>
    </div>
  );
}