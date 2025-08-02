'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FaShieldAlt } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  isAdminLogin?: boolean;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  isAdminLogin = false 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(
    isAdminLogin ? 'login' : defaultMode
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher',
    selectedPlan: 'Novice' as 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced',
    selectedCategory: 'Group' as 'Group' | 'Individual',
    bio: '',
    qualifications: '',
    experience: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register } = useAuth();

  // Prevent body scroll when modal is open
  useEffect(() => {
    setMode(isAdminLogin ? 'login' : defaultMode);
  }, [defaultMode, isAdminLogin]);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll position
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
    
    // Return empty cleanup function for when modal is not open
    return () => {};
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isAdminLogin) {
        // For admin login, we'll use the login function with admin flag
        const success = await login(formData.email, formData.password, true);
        if (success) {
          onClose();
        } else {
          setErrors(['Invalid admin credentials or access denied']);
        }
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setErrors(['Passwords do not match']);
          return;
        }
        if (formData.password.length < 6) {
          setErrors(['Password must be at least 6 characters']);
          return;
        }
        
        const { name, email, password, confirmPassword, ...additionalData } = formData;
        
        try {
          const success = await register(name, email, password, additionalData);
          if (success) {
            if (additionalData.role === 'teacher') {
              setSuccessMessage('Teacher registration submitted successfully! You will receive an email notification once your application is reviewed.');
              // Don't close modal immediately for teacher registrations
              setTimeout(() => {
                onClose();
              }, 3000);
            } else {
              setSuccessMessage('Account created successfully! Welcome to Ẹwà Èdè Yorùbá Academy!');
              setTimeout(() => {
                onClose();
              }, 2000);
            }
          } else {
            setErrors(['Registration failed. Please try again.']);
          }
        } catch (registerError) {
          console.error('Registration error in modal:', registerError);
          if (registerError instanceof Error) {
            setErrors([registerError.message]);
          } else {
            setErrors(['Registration failed. Please try again later.']);
          }
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
      console.error('Submit error:', error);
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
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

  const toggleMode = () => {
    if (!isAdminLogin) {
      setMode(mode === 'login' ? 'register' : 'login');
      setErrors([]);
      setSuccessMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4 overflow-y-auto"
        onClick={onClose}
        transition={{ duration: 0.3 }}
        style={{
          WebkitBackdropFilter: 'blur(8px)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl border ${isAdminLogin ? 'border-red-400/50' : 'border-yoruba-gold/30'} my-8 max-h-[90vh] overflow-y-auto text-white`}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isAdminLogin 
              ? '0 25px 50px -12px rgba(220, 38, 38, 0.25), 0 0 0 1px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 160, 23, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-yoruba-navy/5 to-yoruba-orange/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-center mb-8 text-white">
                  {isAdminLogin && (
                    <div className="bg-red-500/10 text-white text-sm font-medium px-3 py-1.5 rounded-full inline-flex items-center mb-3">
                      <FaShieldAlt className="mr-2" />
                      Admin Portal
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isAdminLogin 
                      ? 'Admin Login' 
                      : mode === 'login' 
                        ? 'Welcome Back' 
                        : 'Create an Account'}
                  </h2>
                  <p className="text-gray-200">
                    {isAdminLogin 
                      ? 'Sign in to access the admin dashboard' 
                      : mode === 'login' 
                        ? 'Sign in to continue to your account' 
                        : 'Join our community today'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-white hover:text-yoruba-red text-2xl transition-all duration-200 hover:rotate-90 transform hover:scale-110 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 bg-green-500/10 backdrop-blur-sm border-l-4 border-green-500 text-green-300 rounded-r-xl"
              >
                <div className="flex items-center font-medium">
                  <span className="text-green-400 mr-2">✓</span>
                  {successMessage}
                </div>
              </motion.div>
            )}

            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border-l-4 border-red-500 text-red-300 rounded-r-xl"
              >
                {errors.map((error, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-red-400 mr-2">⚠</span>
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
                    <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full input-glass"
                      placeholder="Enter your full name"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'register' ? 0.2 : 0.1 }}
                >
                  <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full input-glass"
                    placeholder="Enter your email address"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'register' ? 0.3 : 0.2 }}
                >
                  <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full input-glass"
                    placeholder="Enter your password"
                  />
                </motion.div>

                {mode === 'register' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full input-glass"
                        placeholder="Confirm your password"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-bold text-white mb-3">
                        I want to join as:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.role === 'student'
                              ? 'border-yoruba-gold bg-yoruba-gold/20 text-white'
                              : 'border-white/30 bg-white/10 text-white/70 hover:border-yoruba-gold/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">🎓</div>
                          <div className="font-semibold">Student</div>
                          <div className="text-xs opacity-80">Learn Yoruba</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.role === 'teacher'
                              ? 'border-yoruba-gold bg-yoruba-gold/20 text-white'
                              : 'border-white/30 bg-white/10 text-white/70 hover:border-yoruba-gold/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">👨‍🏫</div>
                          <div className="font-semibold">Teacher</div>
                          <div className="text-xs opacity-80">Teach Yoruba</div>
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-bold text-white mb-2">
                        Learning Plan
                      </label>
                      <select
                        name="selectedPlan"
                        value={formData.selectedPlan}
                        onChange={(e) => setFormData(prev => ({ ...prev, selectedPlan: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-white font-medium transition-all duration-200 hover:border-yoruba-gold/50"
                      >
                        <option value="Novice" className="bg-yoruba-navy text-white">Novice - Basic greetings</option>
                        <option value="Beginner" className="bg-yoruba-navy text-white">Beginner - Interactive exercises</option>
                        <option value="Intermediate" className="bg-yoruba-navy text-white">Intermediate - Advanced grammar</option>
                        <option value="Advanced" className="bg-yoruba-navy text-white">Advanced - Fluency practice</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-bold text-white mb-2">
                        Class Type Preference
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, selectedCategory: 'Group' }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.selectedCategory === 'Group'
                              ? 'border-yoruba-gold bg-yoruba-gold/20 text-white'
                              : 'border-white/30 bg-white/10 text-white/70 hover:border-yoruba-gold/50'
                          }`}
                        >
                          <div className="text-xl mb-1">👥</div>
                          <div className="font-semibold text-sm">Group</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, selectedCategory: 'Individual' }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.selectedCategory === 'Individual'
                              ? 'border-yoruba-gold bg-yoruba-gold/20 text-white'
                              : 'border-white/30 bg-white/10 text-white/70 hover:border-yoruba-gold/50'
                          }`}
                        >
                          <div className="text-xl mb-1">👤</div>
                          <div className="font-semibold text-sm">Individual</div>
                        </button>
                      </div>
                    </motion.div>

                    {formData.role === 'teacher' && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <label htmlFor="bio" className="block text-sm font-bold text-white mb-2">
                            Bio (Optional)
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-white font-medium placeholder-white/60 transition-all duration-200 hover:border-yoruba-gold/50 resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <label htmlFor="qualifications" className="block text-sm font-bold text-white mb-2">
                            Qualifications (Optional)
                          </label>
                          <textarea
                            id="qualifications"
                            name="qualifications"
                            value={formData.qualifications}
                            onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-white font-medium placeholder-white/60 transition-all duration-200 hover:border-yoruba-gold/50 resize-none"
                            placeholder="Your educational background..."
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <label htmlFor="experience" className="block text-sm font-bold text-white mb-2">
                            Teaching Experience (Optional)
                          </label>
                          <textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-yoruba-gold/30 rounded-xl focus:outline-none focus:border-yoruba-orange focus:ring-2 focus:ring-yoruba-orange/30 text-white font-medium placeholder-white/60 transition-all duration-200 hover:border-yoruba-gold/50 resize-none"
                            placeholder="Your teaching experience..."
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-yellow-400 text-xl">⚠️</div>
                            <div>
                              <h4 className="text-yellow-300 font-semibold text-sm mb-1">Teacher Application</h4>
                              <p className="text-yellow-200/80 text-xs">
                                Teacher accounts require admin approval. You'll receive an email notification once your application is reviewed.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </>
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

            {!isAdminLogin && (
              <div className="mt-8 text-center">
                <p className="text-white text-sm mb-3 font-medium">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <motion.button
                  onClick={toggleMode}
                  className="text-yoruba-gold hover:text-yoruba-orange font-bold transition-all duration-200 hover:underline bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mode === 'login' ? '🎯 Sign up for free' : '🔑 Sign in instead'}
                </motion.button>
              </div>
            )}

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