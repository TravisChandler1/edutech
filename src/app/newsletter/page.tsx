'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import YorubaProverb from '../../components/YorubaProverb';

const newsletterArchive = [
  { id: '1', title: 'Yoruba Ronu - January 2025', url: '/newsletters/jan-2025.pdf' },
  { id: '2', title: 'Yoruba Ronu - December 2024', url: '/newsletters/dec-2024.pdf' },
  { id: '3', title: 'Yoruba Ronu - November 2024', url: '/newsletters/nov-2024.pdf' },
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must consent to receive updates.');
      return;
    }
    // TODO: Call /api/newsletter
    setSubmitted(true);
    setEmail('');
    setConsent(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-adire-pattern bg-opacity-10">
      <Header />
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg text-center mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red mb-4">Yoruba Ronu Newsletter</h1>
          <p className="text-lg md:text-xl font-noto text-yoruba-navy mb-4">
            Monthly updates on Yoruba language, culture, proverbs, student highlights, and events. Stay connected with the Yoruba Ronu community!
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="max-w-md mx-auto mb-12 bg-yoruba-cream/50 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-poppins font-bold text-yoruba-green mb-4">Subscribe to Yoruba Ronu</h2>
          {submitted ? (
            <p className="text-yoruba-green font-noto">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-green p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold"
                required
                aria-label="Email address"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  id="consent"
                  className="mr-2"
                  required
                  aria-label="Consent to receive updates"
                />
                <label htmlFor="consent" className="text-yoruba-navy font-noto text-sm">
                  I consent to receive updates and newsletters from Ẹwà Èdè Yorùbá Academy.
                </label>
              </div>
              {error && <p className="text-yoruba-red text-sm font-noto">{error}</p>}
              <motion.button
                type="submit"
                className="w-full bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Archive Section */}
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-poppins font-bold text-yoruba-green mb-4">Newsletter Archive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletterArchive.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/80 border border-yoruba-gold rounded-lg p-4 shadow hover:shadow-lg transition-transform hover:scale-105"
              >
                <h3 className="font-poppins font-bold text-yoruba-red mb-2">{item.title}</h3>
                <span className="text-yoruba-green font-noto">Download PDF</span>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.section>
      <YorubaProverb />
      <Footer />
    </div>
  );
} 