'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CustomizedDashboard from '@/components/CustomizedDashboard';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function Dashboard() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green flex items-center justify-center">
        <div className="text-white text-xl font-exo">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green">
      {/* Header with Profile Dropdown */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-yoruba-green flex items-center justify-center text-white font-bold text-xl">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <h1 className="text-xl font-bold text-white">EduTech</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileDropdown user={currentUser} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-yoruba-gold/20"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-exo font-bold text-yoruba-navy mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-gray-600 font-noto text-lg">
                Manage your learning journey and track your progress
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-yoruba-gold/20"
        >
          <h2 className="text-3xl font-exo font-bold text-yoruba-navy mb-6">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-yoruba-navy mb-2">
                Full Name
              </label>
              <p className="text-xl text-gray-900 font-medium">{currentUser.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-yoruba-navy mb-2">
                Email Address
              </label>
              <p className="text-xl text-gray-900 font-medium">{currentUser.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-yoruba-navy mb-2">
                Member Since
              </label>
              <p className="text-xl text-gray-900 font-medium">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-yoruba-navy mb-2">
                Account Status
              </label>
              <p className="text-xl text-green-600 font-medium">Active</p>
            </div>
          </div>
        </motion.div>

        <CustomizedDashboard 
          user={currentUser}
          onScheduleClass={(classData) => {
            // TODO: Implement class scheduling
            console.log('Scheduling class:', classData);
          }}
        />
      </div>
    </div>
  );
}