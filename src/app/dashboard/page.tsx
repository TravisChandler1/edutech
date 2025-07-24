'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-exo font-bold text-yoruba-navy">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 font-noto">
                Manage your learning journey and track your progress
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-exo font-bold text-yoruba-navy mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-lg text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-exo font-bold text-yoruba-navy mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/classes')}
              className="bg-yoruba-orange text-white p-4 rounded-lg hover:bg-yoruba-orange/80 transition-colors font-poppins font-semibold"
            >
              Browse Classes
            </button>
            <button
              onClick={() => router.push('/book-club')}
              className="bg-yoruba-green text-white p-4 rounded-lg hover:bg-yoruba-green/80 transition-colors font-poppins font-semibold"
            >
              Join Book Club
            </button>
            <button
              onClick={() => router.push('/newsletter')}
              className="bg-yoruba-navy text-white p-4 rounded-lg hover:bg-yoruba-navy/80 transition-colors font-poppins font-semibold"
            >
              Newsletter
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}