'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ClassLevel } from '../types';

interface EnhancedSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (userData: Partial<User>) => void;
}

const planOptions: (ClassLevel & { icon: string })[] = [
  {
    id: '1',
    title: 'Novice',
    description: 'Perfect for complete beginners with no prior Yoruba knowledge',
    level: 'Novice',
    price: 'Free',
    category: 'Group',
    icon: '🌱',
  },
  {
    id: '2',
    title: 'Beginner',
    description: 'For those who know basic greetings and want to build foundation',
    level: 'Beginner',
    price: '₦12,000/month',
    category: 'Group',
    icon: '📚',
  },
  {
    id: '3',
    title: 'Intermediate',
    description: 'For learners who can form simple sentences and want to improve',
    level: 'Intermediate',
    price: '₦18,000/month',
    category: 'Group',
    icon: '🎯',
  },
  {
    id: '4',
    title: 'Advanced',
    description: 'For fluent speakers who want to master cultural nuances',
    level: 'Advanced',
    price: '₦25,000/month',
    category: 'Group',
    icon: '👑',
  },
];

export default function EnhancedSignup({ isOpen, onClose, onSignup }: EnhancedSignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: undefined as 'teacher' | 'student' | undefined,
    selectedCategory: undefined as 'Group' | 'Individual' | undefined,
    selectedPlan: undefined as 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | undefined,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    onSignup({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      selectedCategory: formData.selectedCategory,
      selectedPlan: formData.selectedPlan,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yoruba-green">
              Join Our Yoruba Learning Community
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? 'bg-yoruba-green text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4">Choose Your Role</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.role === 'student'
                        ? 'border-yoruba-green bg-yoruba-green/10'
                        : 'border-gray-200 hover:border-yoruba-green/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎓</div>
                      <h4 className="font-semibold text-lg">Student</h4>
                      <p className="text-sm text-gray-600 mt-2">
                        I want to learn Yoruba language and culture
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.role === 'teacher'
                        ? 'border-yoruba-green bg-yoruba-green/10'
                        : 'border-gray-200 hover:border-yoruba-green/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">👨‍🏫</div>
                      <h4 className="font-semibold text-lg">Teacher</h4>
                      <p className="text-sm text-gray-600 mt-2">
                        I want to teach Yoruba and schedule group classes
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Class Category and Plan Selection */}
            {currentStep === 3 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold mb-4">Choose Your Learning Path</h3>
                
                {/* Category Selection */}
                <div>
                  <h4 className="font-medium mb-3">Class Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.selectedCategory === 'Group'
                          ? 'border-yoruba-green bg-yoruba-green/10'
                          : 'border-gray-200 hover:border-yoruba-green/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedCategory: 'Group' }))}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <h5 className="font-semibold">Group Classes</h5>
                        <p className="text-sm text-gray-600 mt-1">Learn with others</p>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.selectedCategory === 'Individual'
                          ? 'border-yoruba-green bg-yoruba-green/10'
                          : 'border-gray-200 hover:border-yoruba-green/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedCategory: 'Individual' }))}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">👤</div>
                        <h5 className="font-semibold">Individual Classes</h5>
                        <p className="text-sm text-gray-600 mt-1">One-on-one learning</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                {formData.selectedCategory === 'Group' && (
                  <div>
                    <h4 className="font-medium mb-3">Select Your Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {planOptions.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.selectedPlan === plan.level
                              ? 'border-yoruba-green bg-yoruba-green/10'
                              : 'border-gray-200 hover:border-yoruba-green/50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan.level }))}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{plan.icon}</div>
                            <h5 className="font-semibold">{plan.title}</h5>
                            <p className="text-yoruba-green font-bold">{plan.price}</p>
                            <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.selectedCategory === 'Individual' && (
                  <div className="text-center p-4 bg-yoruba-cream/30 rounded-lg">
                    <h4 className="font-medium mb-2">Individual Classes</h4>
                    <p className="text-yoruba-green font-bold text-lg">₦8,000/hour</p>
                    <p className="text-sm text-gray-600">Personalized one-on-one lessons with flexible scheduling</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-yoruba-green text-yoruba-green rounded-md hover:bg-yoruba-green/10 transition-colors"
                >
                  Previous
                </button>
              )}
              
              <button
                type="submit"
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.email || !formData.password)) ||
                  (currentStep === 2 && !formData.role) ||
                  (currentStep === 3 && (!formData.selectedCategory || 
                    (formData.selectedCategory === 'Group' && !formData.selectedPlan)))
                }
                className="px-6 py-2 bg-yoruba-green text-white rounded-md hover:bg-yoruba-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {currentStep === 3 ? 'Complete Signup' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
