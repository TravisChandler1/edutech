'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  // Scroll effects for the modal
  const { scrollY } = useScroll();
  const modalY = useTransform(scrollY, [0, 300], [0, -50]);
  const modalScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const modalOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setErrors(['Passwords do not match']);
          return;
        }
        if (formData.password.length < 6) {
          setErrors(['Password must be at least 6 characters']);
          return;
        }
        
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setErrors(['Registration failed. Please try again.']);
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setErrors(['Invalid email or password']);
        }
      }
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-yoruba-gold/30 my-8 max-h-[90vh] overflow-y-auto"
          style={{
            y: modalY,
            scale: modalScale,
            opacity: modalOpacity,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 160, 23, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-yoruba-navy/5 to-yoruba-orange/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <motion.h2 
                  className="text-3xl font-exo font-bold text-yoruba-navy mb-2 drop-shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {mode === 'login' ? 'Welcome Back' : 'Join Our Community'}
                </motion.h2>
                <motion.p 
                  className="text-yoruba-navy/80 font-noto text-sm font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {mode === 'login' 
                    ? 'Sign in to continue your learning journey' 
                    : 'Start your Yoruba language adventure today'
                  }
                </motion.p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-yoruba-navy/60 hover:text-yoruba-red text-2xl transition-all duration-200 hover:rotate-90 transform hover:scale-110 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border-l-4 border-red-500 text-red-700 rounded-r-xl"
              >
                {errors.map((error, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-red-500 mr-2">⚠</span>
                    {error}
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="name" className="block text-sm font-bold text-yoruba-navy mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-yoruba-navy font-medium placeholder-yoruba-navy/60 transition-all duration-200 hover:border-yoruba-gold/50"
                      placeholder="Enter your full name"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'register' ? 0.2 : 0.1 }}
                >
                  <label htmlFor="email" className="block text-sm font-bold text-yoruba-navy mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-yoruba-navy font-medium placeholder-yoruba-navy/60 transition-all duration-200 hover:border-yoruba-gold/50"
                    placeholder="Enter your email address"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'register' ? 0.3 : 0.2 }}
                >
                  <label htmlFor="password" className="block text-sm font-bold text-yoruba-navy mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-yoruba-navy font-medium placeholder-yoruba-navy/60 transition-all duration-200 hover:border-yoruba-gold/50"
                    placeholder="Enter your password"
                  />
                </motion.div>

                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-yoruba-navy mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-yoruba-navy font-medium placeholder-yoruba-navy/60 transition-all duration-200 hover:border-yoruba-gold/50"
                      placeholder="Confirm your password"
                    />
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yoruba-orange via-yoruba-gold to-yoruba-red text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                  style={{
                    boxShadow: '0 10px 25px rgba(242, 140, 56, 0.4), 0 4px 12px rgba(212, 160, 23, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="drop-shadow-sm">
                      {mode === 'login' ? '🚀 Sign In' : '✨ Create Account'}
                    </span>
                  )}
                </motion.button>
              </form>
            </div>

            <div className="mt-8 text-center">
              <p className="text-yoruba-navy/70 text-sm mb-3 font-medium">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </p>
              <motion.button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-yoruba-orange hover:text-yoruba-gold font-bold transition-all duration-200 hover:underline bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === 'login' ? '🎯 Sign up for free' : '🔑 Sign in instead'}
              </motion.button>
            </div>

            {/* Enhanced decorative element */}
            <motion.div 
              className="mt-8 pt-6 border-t border-yoruba-gold/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center bg-gradient-to-r from-yoruba-gold/10 to-yoruba-orange/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-yoruba-gold font-noto text-sm font-bold drop-shadow-sm">
                  ✨ Ẹ kú àbọ̀ sí ilé ẹkọ́ wa ✨
                </p>
                <p className="text-yoruba-navy/70 font-noto text-xs mt-1 font-medium">
                  Welcome to our academy
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}