'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface PlanUpgradeProps {
  currentPlan: string;
  currentCategory: string;
  onUpgrade: (newPlan: string, newCategory: string) => void;
}

const plans = [
  {
    name: 'Novice',
    price: 'Free',
    features: [
      'Basic greetings and phrases',
      'Simple vocabulary',
      'Basic pronunciation guide',
      'Community access'
    ],
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300'
  },
  {
    name: 'Beginner',
    price: '₦12,000/month',
    features: [
      'Interactive exercises',
      'Basic grammar lessons',
      'Audio pronunciation',
      'Progress tracking',
      'Email support'
    ],
    color: 'bg-blue-50 text-blue-800',
    borderColor: 'border-blue-300'
  },
  {
    name: 'Intermediate',
    price: '₦18,000/month',
    features: [
      'Advanced grammar',
      'Conversation practice',
      'Cultural lessons',
      'Live group sessions',
      'Priority support'
    ],
    color: 'bg-green-50 text-green-800',
    borderColor: 'border-green-300'
  },
  {
    name: 'Advanced',
    price: '₦25,000/month',
    features: [
      'Fluency practice',
      'One-on-one sessions',
      'Cultural immersion',
      'Certificate program',
      'Premium support'
    ],
    color: 'bg-purple-50 text-purple-800',
    borderColor: 'border-purple-300'
  }
];

const categories = [
  {
    name: 'Group',
    description: 'Learn with others in group sessions',
    icon: '👥',
    benefits: ['Collaborative learning', 'Peer interaction', 'Cost-effective']
  },
  {
    name: 'Individual',
    description: 'Personalized one-on-one learning',
    icon: '👤',
    benefits: ['Personalized attention', 'Flexible scheduling', 'Faster progress']
  }
];

export default function PlanUpgrade({ currentPlan, currentCategory, onUpgrade }: PlanUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [isLoading, setIsLoading] = useState(false);


  const handleUpgrade = async () => {
    if (selectedPlan === currentPlan && selectedCategory === currentCategory) {
      return;
    }

    setIsLoading(true);
    try {
      await onUpgrade(selectedPlan, selectedCategory);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isUpgrade = () => {
    const planOrder = ['Novice', 'Beginner', 'Intermediate', 'Advanced'];
    const currentIndex = planOrder.indexOf(currentPlan);
    const selectedIndex = planOrder.indexOf(selectedPlan);
    return selectedIndex > currentIndex || selectedCategory !== currentCategory;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-yoruba-gold/20"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-exo font-bold text-yoruba-navy mb-2">
          Upgrade Your Learning Plan
        </h2>
        <p className="text-gray-600 font-noto">
          Current Plan: <span className="font-semibold text-yoruba-green">{currentPlan}</span> | 
          Current Type: <span className="font-semibold text-yoruba-green">{currentCategory}</span>
        </p>
      </div>

      {/* Plan Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-yoruba-navy mb-4">Choose Your Learning Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.name
                  ? 'border-yoruba-gold bg-yoruba-gold/10'
                  : plan.borderColor + ' hover:border-yoruba-gold/50'
              } ${plan.color}`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold mb-3 text-yoruba-green">{plan.price}</p>
                <ul className="text-sm space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {currentPlan === plan.name && (
                  <div className="mt-3 px-2 py-1 bg-yoruba-green text-white text-xs rounded-full">
                    Current Plan
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-yoruba-navy mb-4">Choose Your Class Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedCategory === category.name
                  ? 'border-yoruba-gold bg-yoruba-gold/10'
                  : 'border-gray-300 hover:border-yoruba-gold/50'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h4 className="font-bold text-lg mb-2">{category.name}</h4>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <ul className="text-sm space-y-1">
                  {category.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center justify-center">
                      <span className="text-green-500 mr-1">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                {currentCategory === category.name && (
                  <div className="mt-3 px-2 py-1 bg-yoruba-green text-white text-xs rounded-full">
                    Current Type
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upgrade Button */}
      {(selectedPlan !== currentPlan || selectedCategory !== currentCategory) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="bg-gradient-to-r from-yoruba-orange to-yoruba-gold text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `${isUpgrade() ? 'Upgrade' : 'Change'} to ${selectedPlan} (${selectedCategory})`
            )}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Changes will take effect immediately
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}