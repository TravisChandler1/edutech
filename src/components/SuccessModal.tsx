'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "Close" 
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div
        className="relative bg-white/90 backdrop-blur-lg border-2 border-yoruba-gold/50 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, type: "spring", damping: 20 }}
      >
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yoruba-green/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-yoruba-green" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-exo font-bold text-yoruba-green text-center mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="text-yoruba-navy font-noto text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Close button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-yoruba-orange text-white px-6 py-3 rounded-lg hover:bg-yoruba-orange/80 transition-all duration-300 transform hover:scale-105 font-poppins font-semibold shadow-lg"
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}