'use client';

import { useAuth } from '@/context/AuthContext';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';
import dynamic from 'next/dynamic';

// Dynamically import the EbookArchive component with no SSR
const EbookArchive = dynamic(() => import('@/components/EbookArchive'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
    </div>
  ),
});

export default function EbooksPage() {
  const { currentUser, loading } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode] = useState<'login' | 'register'>('register');




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
      <h2 className="text-3xl font-bold text-yoruba-green mb-6 text-center">Discover Yoruba Literature</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Extensive Ebook Collection</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Access hundreds of Yoruba language ebooks</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Books for all levels - from beginner to advanced</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Diverse genres including fiction, non-fiction, and learning materials</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Reading Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Save books to your personal library</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Track your reading progress</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Take notes and highlight text</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 bg-yoruba-green text-white rounded-lg hover:bg-yoruba-green-dark transition-colors text-lg font-medium"
        >
          Start Reading Now
        </button>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-yoruba-cream py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Ebook Archive</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our extensive collection of Yoruba language ebooks and enhance your learning journey.
            </p>
          </div>
          {visitorContent}
          {/* Single Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode={authModalMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yoruba-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">Yoruba Ebook Archive</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {currentUser.role === 'teacher' 
              ? 'Share educational resources and track your students\' reading progress.'
              : 'Explore our collection of Yoruba language ebooks. Save books to your library, track your reading progress, and enhance your learning experience.'
            }
          </p>
        </div>
        <EbookArchive user={currentUser} />
      </div>
    </div>
  );
}