'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not logged in
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Show loading state while checking auth
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yoruba-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yoruba-navy">
      {children}
    </div>
  );
}

export default DashboardLayout;
