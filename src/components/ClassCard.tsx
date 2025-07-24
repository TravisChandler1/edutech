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
      className="bg-white border-2 border-yoruba-gold p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-poppins font-bold text-yoruba-red">{classLevel.title}</h3>
      <p className="text-yoruba-navy my-4 font-noto">{classLevel.description}</p>
      <p className="text-yoruba-navy font-bold mb-4">{classLevel.price}</p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={handlePayment}
          className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform disabled:opacity-50"
          disabled={isLoading}
          aria-label={`Enroll in ${classLevel.title} class`}
        >
          {isLoading ? 'Processing...' : 'Enroll Now'}
        </button>
        {onWaitlist && (
          <button
            onClick={handleWaitlist}
            className="bg-yoruba-navy text-white px-4 py-2 rounded-lg hover:bg-yoruba-navy/80 transition-transform"
            aria-label={`Join waitlist for ${classLevel.title}`}
          >
            Join Waitlist
          </button>
        )}
      </div>
    </motion.div>
  );
} 