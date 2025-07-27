'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterForm({ onSubscribe }: { onSubscribe?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setName('');
        setEmail('');
        setSubmitted(true);
        if (onSubscribe) onSubscribe();
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-yoruba-gold/30 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-exo font-bold text-white mb-4">📧 Join Yoruba Ronu</h3>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-yoruba-gold font-noto font-semibold">✨ Thank you for subscribing!</p>
          <p className="text-white/80 text-sm mt-2">You'll receive our monthly newsletter soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="newsletter-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold text-white placeholder-white/70 transition-all duration-300"
            required
            aria-label="Full name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="newsletter-input w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold text-white placeholder-white/70 transition-all duration-300"
            required
            aria-label="Email address"
          />
          {error && (
            <motion.p 
              className="text-red-400 text-sm font-noto bg-red-500/10 p-2 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠ {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="btn-green w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            🚀 Subscribe Now
          </motion.button>
          <p className="text-white/60 text-xs text-center">
            Get monthly updates on Yoruba culture and learning tips
          </p>
        </form>
      )}
    </motion.div>
  );
}