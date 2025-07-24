'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';

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
        className="fixed inset-0 glass-modal-backdrop bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-exo font-bold text-yoruba-navy">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-orange text-gray-900 bg-white"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-orange text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-orange text-gray-900 bg-white"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-orange text-gray-900 bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yoruba-orange text-white py-2 px-4 rounded-md hover:bg-yoruba-orange/80 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-yoruba-orange hover:underline"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"
              }
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}