'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import dynamic from 'next/dynamic';
import { LiveClass } from '@/types';

// Dynamically import the LiveClasses component with no SSR
const LiveClasses = dynamic(() => import('@/components/LiveClasses'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
    </div>
  ),
});

import { User } from '@/types';

interface LiveClassesPageProps {
  user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>;
  onScheduleLiveClass?: (classData: Partial<LiveClass>) => void;
  onJoinClass?: (classId: string) => void;
}

export default function LiveClassesPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [isClient, setIsClient] = useState(false);
  const [visitorTimer, setVisitorTimer] = useState<NodeJS.Timeout | null>(null);

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleScheduleLiveClass = (classData: Partial<LiveClass>) => {
    console.log('Scheduling live class:', classData);
    // TODO: Implement API call to schedule live class
  };

  const handleJoinClass = (classId: string) => {
    console.log('Joining class:', classId);
    // TODO: Implement class joining functionality
  };

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
      <h2 className="text-3xl font-bold text-yoruba-green mb-6 text-center">Experience Interactive Yoruba Learning</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Live Classes</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Real-time interaction with expert Yoruba teachers</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Small group sessions for personalized attention</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Practice speaking and listening with native speakers</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yoruba-red">Pre-recorded Classes</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Learn at your own pace, anytime, anywhere</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Access to comprehensive lesson materials</span>
            </li>
            <li className="flex items-start">
              <span className="text-yoruba-green mr-2">✓</span>
              <span>Review difficult concepts as many times as needed</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 bg-yoruba-green text-white rounded-lg hover:bg-yoruba-green-dark transition-colors text-lg font-medium"
        >
          Join Now to Start Learning
        </button>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-yoruba-cream py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yoruba-green mb-4">Live & Pre-recorded Yoruba Classes</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Immerse yourself in interactive Yoruba language learning with our expert teachers and comprehensive course materials.
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

  const liveClassesProps: LiveClassesPageProps = {
    user: {
      id: currentUser.id,
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: (currentUser.role as 'student' | 'teacher' | 'admin') || 'student',
      createdAt: currentUser.createdAt || new Date().toISOString(),
    },
    onScheduleLiveClass: handleScheduleLiveClass,
    onJoinClass: handleJoinClass,
  };

  return (
    <div className="min-h-screen bg-yoruba-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yoruba-green mb-4">Live & Pre-recorded Classes</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {currentUser.role === 'teacher' 
              ? 'Schedule and manage your live classes. Your students are waiting to learn from you!'
              : 'Join live interactive sessions with our expert teachers or watch pre-recorded classes at your own pace. Practice speaking, listening, and improve your Yoruba language skills.'
            }
          </p>
        </div>
        <LiveClasses {...liveClassesProps} />
      </div>
    </div>
  );
}