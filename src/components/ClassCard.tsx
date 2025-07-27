'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClassLevel } from '../types';
import { initializePaystackPayment } from '../lib/paystack';

interface ClassCardProps {
  classLevel: ClassLevel;
  onWaitlist?: () => void;
  onAuthRequired?: () => void;
  isAuthenticated?: boolean;
}

export default function ClassCard({ classLevel, onWaitlist, onAuthRequired, isAuthenticated }: ClassCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    
    // Handle free plan enrollment
    if (classLevel.price === 'Free') {
      setIsLoading(true);
      // Simulate enrollment process for free plan
      setTimeout(() => {
        setIsLoading(false);
        alert('Successfully enrolled in the Free Plan!');
      }, 1000);
      return;
    }
    
    setIsLoading(true);
    const amount = parseInt(classLevel.price.replace('₦', '').replace('/month', '').replace(',', ''));
    initializePaystackPayment(
      'user@example.com', // Replace with authenticated user email
      amount * 100, // Paystack expects kobo
      '/classes',
      () => {
        setIsLoading(false);
        alert('Payment successful! You are now enrolled.');
      },
      () => {
        setIsLoading(false);
        alert('Payment cancelled.');
      }
    );
  };

  const handleWaitlist = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    
    onWaitlist?.();
  };

  return (
    <motion.div
      className="class-card bg-white border-2 border-yoruba-gold/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yoruba-gold/60"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <h3 className="text-xl font-exo font-bold text-yoruba-navy mb-3">{classLevel.title}</h3>
      <p className="text-yoruba-navy/80 my-4 font-noto leading-relaxed">{classLevel.description}</p>
      <p className="price text-2xl font-bold text-yoruba-orange mb-6">{classLevel.price}</p>
      <div className="flex flex-col space-y-3">
        <motion.button
          onClick={handlePayment}
          className="bg-yoruba-navy text-white px-6 py-3 rounded-lg hover:bg-yoruba-navy/90 hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-semibold"
          disabled={isLoading}
          aria-label={`Enroll in ${classLevel.title} class`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Processing...' : '✨ Enroll Now'}
        </motion.button>
        {onWaitlist && (
          <motion.button
            onClick={handleWaitlist}
            className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            style={{ 
              backgroundColor: '#0f172a',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e293b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0f172a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            aria-label={`Join waitlist for ${classLevel.title}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📋 Join Waitlist
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}