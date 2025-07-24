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
      className="bg-white p-6 rounded-lg border-2 border-yoruba-gold shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-poppins font-bold text-yoruba-navy mb-4">Join Yoruba Ronu</h3>
      {submitted ? (
        <p className="text-yoruba-navy font-noto">Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-navy p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold text-yoruba-navy placeholder-yoruba-navy/60"
            required
            aria-label="Full name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-navy p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold text-yoruba-navy placeholder-yoruba-navy/60"
            required
            aria-label="Email address"
          />
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
  );
} 