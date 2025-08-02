'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileDropdown from '@/components/ProfileDropdown';
import PlanUpgrade from '@/components/PlanUpgrade';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import BookClubSection from '@/components/dashboard/BookClubSection';
import LiveClassesSection from '@/components/dashboard/LiveClassesSection';
import GroupsSection from '@/components/dashboard/GroupsSection';
import { 
  FaHome, 
  FaBook, 
  FaVideo, 
  FaUsers,
  FaCrown 
} from 'react-icons/fa';

type DashboardTab = 'overview' | 'book-club' | 'live-classes' | 'groups' | 'upgrade';

export default function Dashboard() {
  const { currentUser, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    } else if (currentUser) {
      // Redirect teachers to their specific dashboard
      if (currentUser.role === 'teacher') {
        router.push('/dashboard/teacher');
        return;
      }
      // Redirect admins to admin dashboard
      if (currentUser.role === 'admin') {
        router.push('/admin');
        return;
      }
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handlePlanUpgrade = async (newPlan: string, newCategory: string) => {
    try {
      const response = await fetch('/api/auth/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedPlan: newPlan,
          selectedCategory: newCategory,
        }),
      });

      if (response.ok) {
        await response.json();
        // Refresh user data to get updated plan
        await refreshUser();
        alert(`Successfully updated to ${newPlan} (${newCategory}) plan!`);
        setActiveTab('overview');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Plan upgrade error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update plan');
    }
  };

  const navigationItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: FaHome,
      description: 'Dashboard overview and progress'
    },
    {
      id: 'book-club' as DashboardTab,
      label: 'Book Club',
      icon: FaBook,
      description: 'Join book discussions and reading sessions'
    },
    {
      id: 'live-classes' as DashboardTab,
      label: 'Live Classes',
      icon: FaVideo,
      description: 'Attend live Yoruba classes and sessions'
    },
    {
      id: 'groups' as DashboardTab,
      label: 'Study Groups',
      icon: FaUsers,
      description: 'Create and join study groups'
    },
    {
      id: 'upgrade' as DashboardTab,
      label: 'Upgrade Plan',
      icon: FaCrown,
      description: 'Upgrade your learning plan'
    }
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={currentUser} />;
      case 'book-club':
        return <BookClubSection user={currentUser} />;
      case 'live-classes':
        return <LiveClassesSection user={currentUser} />;
      case 'groups':
        return <GroupsSection user={currentUser} />;
      case 'upgrade':
        return (
          <PlanUpgrade
            currentPlan={currentUser.selectedPlan || 'Novice'}
            currentCategory={currentUser.selectedCategory || 'Group'}
            onUpgrade={handlePlanUpgrade}
          />
        );
      default:
        return <DashboardOverview user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-yoruba-gold flex items-center justify-center text-yoruba-navy font-bold text-xl">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ẹwà Èdè Yorùbá</h1>
              <p className="text-yoruba-cream/80 text-sm">
                {currentUser.selectedPlan || 'Novice'} Plan • {currentUser.selectedCategory || 'Group'} Classes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileDropdown user={currentUser} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-white text-lg font-semibold mb-2">
                Welcome back, {currentUser.name?.split(' ')[0]}!
              </h2>
              <p className="text-yoruba-cream/70 text-sm">
                Continue your Yoruba learning journey
              </p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-yoruba-gold text-yoruba-navy shadow-lg'
                        : 'text-white hover:bg-white/10 hover:text-yoruba-gold'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-yoruba-navy' : 'text-yoruba-gold'}`} />
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-yoruba-navy/70' : 'text-white/60'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}