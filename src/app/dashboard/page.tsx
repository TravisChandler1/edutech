'use client';

import React, { useEffect, useState } from 'react';
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
  const { currentUser, loading, logout } = useAuth();
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
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handlePlanUpgrade = async (newPlan: string, newCategory: string) => {
    try {
      // In a real app, this would call your API to update the user's plan
      console.log(`Upgrading to ${newPlan} plan with ${newCategory} category`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Plan upgraded successfully!');
      
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to upgrade plan. Please try again.');
      console.error('Plan upgrade error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update plan');
    }
  };

  // Navigation items for the dashboard
  const navigationItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: FaHome,
      description: 'Dashboard overview and progress'
    },
    {
      id: 'book-club' as const,
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

  // Render content based on active tab
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
    <div className="min-h-screen bg-yoruba-navy flex flex-col">
      {/* Top Navigation */}
      <header className="bg-yoruba-navy/20 backdrop-blur-md border-b border-white/10 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button - only show on small screens */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-yoruba-gold hover:text-white hover:bg-yoruba-blue/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="flex-1 flex items-center justify-between">
              <div className="flex-1 flex items-center sm:items-stretch">
                <div className="hidden sm:block">
                  <div className="flex space-x-1 md:space-x-2 lg:space-x-4">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200 ${
                          activeTab === item.id
                            ? 'bg-yoruba-gold text-yoruba-navy font-semibold'
                            : 'text-yoruba-gold/90 hover:bg-yoruba-blue/20 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Controls */}
              <div className="ml-4 flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setActiveTab('upgrade')}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-yoruba-blue hover:bg-yoruba-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-blue transition-colors duration-200"
                >
                  <FaCrown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden xs:inline">Upgrade</span>
                </button>
                <ProfileDropdown 
                  user={currentUser} 
                  onLogout={handleLogout}
                  onUpgrade={() => setActiveTab('upgrade')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-yoruba-navy/30 backdrop-blur-lg border-t border-white/10">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  activeTab === item.id
                    ? 'bg-yoruba-gold text-yoruba-navy font-semibold'
                    : 'text-white hover:bg-yoruba-blue/20'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl border border-white/20">
            {renderTabContent()}
            {activeTab === 'upgrade' && (
              <PlanUpgrade 
                currentPlan={currentUser?.selectedPlan || 'Free'} 
                currentCategory={currentUser?.selectedCategory || 'Group'}
                onUpgrade={handlePlanUpgrade}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
