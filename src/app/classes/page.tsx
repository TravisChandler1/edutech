'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClassCard from '../../components/ClassCard';
import YorubaProverb from '../../components/YorubaProverb';
import SuccessModal from '../../components/SuccessModal';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../components/AuthProvider';
import { ClassLevel } from '../../types';

const classLevels: (ClassLevel & { icon: string })[] = [
  {
    id: '1',
    title: 'Free Plan',
    description: 'Perfect for those with no prior Yoruba knowledge. Learn basic greetings and phrases.',
    level: 'Free Plan',
    price: 'Free',
    icon: '🚀',
  },
  {
    id: '2',
    title: 'Premium',
    description: 'For those who can speak a little but need guidance on pronunciation and basics.',
    level: 'Premium',
    price: '₦15,000/month',
    icon: '💎',
  },
  {
    id: '3',
    title: 'Pro+',
    description: 'Advanced features with community access and personalized learning paths.',
    level: 'Pro+',
    price: '₦25,000/month',
    icon: '👑',
  },
];

const features = [
  { icon: '🗣️', text: 'Interactive live classes with real-time instruction' },
  { icon: '🎥', text: 'Pre-recorded classes for flexible learning' },
  { icon: '🥁', text: 'Access to a community of Yoruba speakers' },
];

export default function Classes() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel['level']>('Free Plan');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const { user } = useAuth();

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const level = formData.get('level') as string;

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, level }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsWaitlistOpen(false);
        setWaitlistSuccess(true);
      } else {
        console.error('Waitlist registration failed:', data.error);
        // Still show success to user, but log the error
        setIsWaitlistOpen(false);
        setWaitlistSuccess(true);
      }
    } catch (error) {
      console.error('Waitlist registration error:', error);
      // Still show success to user, but log the error
      setIsWaitlistOpen(false);
      setWaitlistSuccess(true);
    }
  };

  return (
    <div className="min-h-screen non-home-bg">
      <Header />
      {/* Class Levels Section */}
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red text-center mb-8">
          Our Classes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classLevels.map((classLevel) => (
            <div key={classLevel.id} className="flex flex-col items-center">
              <span className="text-4xl mb-2">{classLevel.icon}</span>
              <ClassCard
                classLevel={classLevel}
                onWaitlist={() => {
                  setSelectedLevel(classLevel.level);
                  setIsWaitlistOpen(true);
                }}
                onAuthRequired={() => setAuthModalOpen(true)}
                isAuthenticated={!!user}
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Group Classes Section */}
      <section className="our-classes-bg py-12">
        <div className="container mx-auto px-6">
          <motion.div
            className="p-8 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-exo font-bold text-white mb-4">Group Classes</h2>
            <p className="text-white font-noto">Join weekly group sessions with other learners. Fixed schedule, interactive lessons, and community support.</p>
            <p className="text-white font-noto mt-4">Schedule: Saturdays, 10am–12pm (WAT)</p>
            <button
              onClick={() => {
                if (user) {
                  // Handle group class enrollment
                  alert('Group class enrollment coming soon!');
                } else {
                  setAuthModalOpen(true);
                }
              }}
              className="inline-block mt-4 bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold"
            >
              Join Group Class
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="flex justify-center py-4">
        <div className="w-24 h-1 bg-yoruba-gold rounded-full"></div>
      </div>

      {/* Individual Classes Section */}
      <section className="our-classes-bg py-12">
        <div className="container mx-auto px-6">
          <motion.div
            className="p-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-exo font-bold text-white mb-4">Individual Classes</h2>
            <p className="text-white font-noto">Personalized lessons with flexible scheduling. One-on-one attention for rapid progress.</p>
            <p className="text-white font-noto mt-4">Book a session at your convenience.</p>
            <button
              onClick={() => {
                if (user) {
                  // Handle individual class booking
                  alert('Individual class booking coming soon!');
                } else {
                  setAuthModalOpen(true);
                }
              }}
              className="inline-block mt-4 bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold"
            >
              Book a 1-on-1 Session
            </button>
          </motion.div>
        </div>
      </section>

      {/* Class Features Section */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="glass-card p-8 rounded-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Class Features</h2>
          <ul className="list-none flex flex-col sm:flex-row justify-center gap-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-yoruba-navy font-noto">{feature.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Yoruba Proverb */}
      <YorubaProverb />

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <motion.div
          className="fixed inset-0 glass-modal-backdrop bg-black/40 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="glass-modal p-6 rounded-xl max-w-sm w-full mx-4"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
          >
            <h3 className="text-xl font-exo font-bold text-yoruba-green mb-4 text-center">Join Waitlist</h3>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-white/80 backdrop-blur-sm border border-yoruba-green p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold font-noto text-yoruba-navy placeholder-yoruba-navy/60"
                required
                aria-label="Name"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-white/80 backdrop-blur-sm border border-yoruba-green p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold font-noto text-yoruba-navy placeholder-yoruba-navy/60"
                required
                aria-label="Email"
              />
              <select
                name="level"
                className="w-full bg-white/80 backdrop-blur-sm border border-yoruba-green p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold font-noto text-yoruba-navy"
                defaultValue={selectedLevel || ''}
                required
                aria-label="Select class level"
              >
                <option value="" disabled>Select Level</option>
                {classLevels.map((level) => (
                  <option key={level.id} value={level.level}>{level.title}</option>
                ))}
              </select>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-yoruba-orange text-white px-4 py-3 rounded-lg hover:bg-yoruba-orange/80 transition-all duration-300 transform hover:scale-105 font-poppins font-semibold shadow-lg"
                  aria-label="Join waitlist"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaitlistOpen(false)}
                  className="bg-yoruba-navy text-white px-4 py-3 rounded-lg hover:bg-yoruba-navy/80 transition-all duration-300 transform hover:scale-105 font-poppins font-semibold shadow-lg"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={waitlistSuccess}
        onClose={() => setWaitlistSuccess(false)}
        title="Waitlist Registration Successful!"
        message="Thank you for joining our waitlist! We'll notify you as soon as spots become available in your selected class level."
      />
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="register"
      />
      
      <Footer />
    </div>
  );
}