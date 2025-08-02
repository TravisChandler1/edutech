'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ClassCard from '../components/ClassCard';
import TestimonialCard from '../components/TestimonialCard';
import NewsletterForm from '../components/NewsletterForm';
import YorubaProverb from '../components/YorubaProverb';
import SuccessModal from '../components/SuccessModal';
import LoadingLink from '../components/LoadingLink';
import AuthModal from '@/components/AuthModal';
import { ClassLevel, Testimonial } from '../types';

export default function Home() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitorTimer, setVisitorTimer] = useState<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
    if (!loading && currentUser) {
      router.push('/dashboard');
    }
  }, [loading, currentUser, router]);

  // Removed auto-popup auth modal timer

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoruba-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  // Sample data
  const classLevels: ClassLevel[] = [
    {
      id: '1',
      title: 'Novice',
      description: 'Perfect for complete beginners with no prior Yoruba knowledge. Learn basic greetings and phrases.',
      level: 'Novice',
      price: 'Free',
      category: 'Group',
    },
    {
      id: '2',
      title: 'Beginner',
      description: 'For those who know basic greetings and want to build foundation.',
      level: 'Beginner',
      price: '₦12,000/month',
      category: 'Group',
    },
    {
      id: '3',
      title: 'Intermediate',
      description: 'For learners who can form simple sentences and want to improve.',
      level: 'Intermediate',
      price: '₦18,000/month',
      category: 'Group',
    },
    {
      id: '4',
      title: 'Advanced',
      description: 'For fluent speakers who want to master cultural nuances.',
      level: 'Advanced',
      price: '₦25,000/month',
      category: 'Group',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Adewale O.',
      quote: 'Learning Yoruba with Ẹwà Èdè has connected me to my heritage!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    },
    {
      id: '2',
      name: 'Funmi A.',
      quote: 'The classes are engaging, and the community is welcoming!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    },
    {
      id: '3',
      name: 'Tunde K.',
      quote: "I've improved my fluency and love the book club discussions!",
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    },
  ];

  // Hero section content based on authentication status
  const heroContent = currentUser ? {
    title: `Welcome back, ${currentUser.name?.split(' ')[0] || 'Learner'}!`,
    subtitle: 'Continue your Yoruba learning journey',
    primaryButton: {
      text: 'Continue Learning',
      href: '/dashboard'
    },
    secondaryButton: {
      text: 'Explore Classes',
      href: '/classes'
    }
  } : {
    title: 'Discover the Beauty of Yoruba Language and Culture',
    subtitle: 'Learn Yoruba, Connect with Your Roots',
    primaryButton: {
      text: 'Start Learning',
      href: '/signup'
    },
    secondaryButton: {
      text: 'Explore Features',
      href: '#features'
    }
  };

  // Visitor features section
  const visitorFeatures = [
    {
      icon: '📚',
      title: 'Interactive Classes',
      description: 'Live and pre-recorded classes for all levels'
    },
    {
      icon: '👥',
      title: 'Community Learning',
      description: 'Join discussions and practice with peers'
    },
    {
      icon: '📖',
      title: 'Ebook Library',
      description: 'Access to our growing collection of Yoruba literature'
    },
    {
      icon: '🎭',
      title: 'Cultural Immersion',
      description: 'Learn about Yoruba traditions and customs'
    }
  ];

  return (
    <div className="w-full">
      {/* Registration Modal - Single AuthModal only */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authModalMode}
      />

        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden w-full"
          style={{ 
            height: '100vh',
            marginTop: '-80px',
            paddingTop: '80px',
            zIndex: 1
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center kenburns-bg"
            style={{ backgroundImage: "url('/images/yoruba-festival.jpg')" }}
          ></div>
          <div className="absolute inset-0 hero-dark-overlay"></div>
          <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white relative z-10">
            <motion.h1
              className="text-4xl md:text-5xl font-orbitron font-bold mb-4 drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {heroContent.title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl font-poppins mb-6 drop-shadow"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {heroContent.subtitle}
            </motion.p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="bg-yoruba-orange text-white px-6 py-3 rounded-lg hover:bg-yoruba-orange/80 transition-transform transform hover:scale-105 shadow-lg"
                aria-label={heroContent.primaryButton.text}
              >
                {heroContent.primaryButton.text}
              </button>
              <LoadingLink
                href={heroContent.secondaryButton.href}
                className="bg-yoruba-navy/90 text-white px-6 py-3 rounded-lg hover:bg-yoruba-navy/80 transition-transform transform hover:scale-105 shadow-lg"
                aria-label={heroContent.secondaryButton.text}
              >
                {heroContent.secondaryButton.text}
              </LoadingLink>
            </div>
          </div>
        </motion.section>

        {/* About Us Summary */}
        <section className="container mx-auto px-6 py-12">
          <motion.div
            className="section-border p-8 rounded-lg text-center bg-white"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-exo font-bold text-yoruba-green mb-4">About Us</h2>
            <p className="text-lg font-noto text-yoruba-navy mb-4">
              Ẹwà Èdè Yorùbá Academy is dedicated to preserving and promoting Yoruba language, culture, and heritage through immersive education, cultural exchange, and community engagement.
            </p>
            {/* Video/Slideshow Placeholder */}
            <div className="w-full flex justify-center mt-4">
              <div className="w-full max-w-xl aspect-video bg-yoruba-navy/10 rounded-lg flex items-center justify-center border-2 border-yoruba-gold">
                <span className="text-yoruba-gold font-lora text-lg">[Video or Slideshow Coming Soon]</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured Classes Section */}
        <section className="our-classes-bg py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-exo font-bold text-white text-center mb-8">
              Our Classes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classLevels.map((classLevel) => (
                <ClassCard key={classLevel.id} classLevel={classLevel} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <LoadingLink href="/classes" className="bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold shadow-lg">
                Explore Classes
              </LoadingLink>
            </div>
          </div>
        </section>

        {/* Book Club Teaser */}
        <section className="container mx-auto px-6 py-12">
          <motion.div
            className="glass-card p-8 rounded-lg text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-exo font-bold text-yoruba-green mb-4">Yoruba Book Club</h2>
            <p className="text-lg font-noto text-yoruba-navy mb-4">
              Join our monthly Book Club to discuss Yoruba literature, folklore, and translated stories. Open to all levels!
            </p>
            <LoadingLink href="/book-club" className="bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold shadow-lg">
              Join the Book Club
            </LoadingLink>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-exo font-bold text-yoruba-red text-center mb-8">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-bg py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-exo font-bold text-white text-center mb-8">
              Stay Updated with Yoruba Ronu
            </h2>
            <div className="max-w-md mx-auto">
              <NewsletterForm onSubscribe={() => setIsModalOpen(true)} />
            </div>
          </div>
        </section>

        {/* Yoruba Proverb */}
        <YorubaProverb />

        {/* Newsletter Success Modal */}
        <SuccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Subscription Successful!"
          message="Thank you for joining Yoruba Ronu. You'll receive monthly updates on Yoruba culture and learning tips."
        />
    </div>
  );
}