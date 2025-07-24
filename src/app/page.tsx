'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassCard from '../components/ClassCard';
import TestimonialCard from '../components/TestimonialCard';
import NewsletterForm from '../components/NewsletterForm';
import YorubaProverb from '../components/YorubaProverb';
import { ClassLevel, Testimonial } from '../types';

export default function Home() {
  // Sample data
  const classLevels: ClassLevel[] = [
    {
      id: '1',
      title: 'Novice',
      description: 'Perfect for those with no prior Yoruba knowledge. Learn basic greetings and phrases.',
      level: 'Novice',
      price: '₦10,000/month',
    },
    {
      id: '2',
      title: 'Beginner',
      description: 'For those who can speak a little but need guidance on pronunciation and basics.',
      level: 'Beginner',
      price: '₦15,000/month',
    },
    {
      id: '3',
      title: 'Intermediate',
      description: 'Improve sentence construction and join the Yoruba speaker community.',
      level: 'Intermediate',
      price: '₦20,000/month',
    },
    {
      id: '4',
      title: 'Advanced',
      description: 'Practice regularly to maintain fluency and engage with the community.',
      level: 'Advanced',
      price: '₦25,000/month',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Adewale O.',
      quote: 'Learning Yoruba with Ẹwà Èdè has connected me to my heritage!',
      avatar: '/images/ade.jpg',
    },
    {
      id: '2',
      name: 'Funmi A.',
      quote: 'The classes are engaging, and the community is welcoming!',
      avatar: '/images/funmi.jpg',
    },
    {
      id: '3',
      name: 'Tunde K.',
      quote: 'I’ve improved my fluency and love the book club discussions!',
      avatar: '/images/tunde.jpg',
    },
  ];

  // Modal state for newsletter subscription
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <motion.section
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/images/yoruba-festival.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-yoruba-red/70 to-transparent"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-poppins font-bold mb-4 drop-shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover the Beauty of Yoruba Language and Culture
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-poppins mb-6 drop-shadow"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Learn Yoruba, Connect with Your Roots
          </motion.p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/classes"
              className="bg-yoruba-orange text-white px-6 py-3 rounded-lg hover:bg-yoruba-orange/80 transition-transform transform hover:scale-105 shadow-lg"
              aria-label="Join a class"
            >
              Join a Class
            </Link>
            <Link
              href="/newsletter"
              className="bg-yoruba-green text-white px-6 py-3 rounded-lg hover:bg-yoruba-green/80 transition-transform transform hover:scale-105 shadow-lg"
              aria-label="Subscribe to newsletter"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </motion.section>

      {/* About Us Summary */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">About Us</h2>
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
      <section className="container mx-auto px-6 py-12 bg-adire-pattern bg-opacity-10">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">
          Our Classes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classLevels.map((classLevel) => (
            <ClassCard key={classLevel.id} classLevel={classLevel} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/classes" className="bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold shadow-lg">
            Explore Classes
          </Link>
        </div>
      </section>

      {/* Book Club Teaser */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Yoruba Book Club</h2>
          <p className="text-lg font-noto text-yoruba-navy mb-4">
            Join our monthly Book Club to discuss Yoruba literature, folklore, and translated stories. Open to all levels!
          </p>
          <Link href="/book-club" className="bg-yoruba-orange text-white px-6 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold shadow-lg">
            Join the Book Club
          </Link>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-12 bg-adire-pattern bg-opacity-10">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">
          Stay Updated with Yoruba Ronu
        </h2>
        <div className="max-w-md mx-auto">
          <NewsletterForm onSubscribe={() => setIsModalOpen(true)} />
        </div>
      </section>

      {/* Yoruba Proverb */}
      <YorubaProverb />

      {/* Newsletter Success Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-yoruba-cream/80 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold max-w-sm w-full">
            <h3 className="text-xl font-poppins font-bold text-yoruba-green mb-4">
              Subscription Successful!
            </h3>
            <p className="text-yoruba-navy mb-4 font-noto">
              Thank you for joining Yoruba Ronu. You’ll receive monthly updates on Yoruba culture and learning tips.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
} 