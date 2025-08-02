'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/lib/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string, additionalData?: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, isAdmin: boolean = false): Promise<boolean> => {
    try {
      const endpoint = isAdmin ? '/api/auth/login?admin=true' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (isAdmin && (!data.user || data.user.role !== 'admin')) {
          throw new Error('Access denied. Admin privileges required.');
        }
        setCurrentUser(data.user);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, additionalData?: any): Promise<boolean> => {
    try {
      console.log('Starting registration process...');
      
      const requestBody = { 
        name, 
        email, 
        password,
        ...additionalData
      };
      
      console.log('Request body:', { ...requestBody, password: '[REDACTED]' });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Registration response:', data);
        
        if (data.user) {
          setCurrentUser(data.user);
          console.log('User set in context:', data.user);
        } else if (data.requiresApproval) {
          console.log('Teacher registration requires approval');
          // For teacher registrations that require approval, we don't set the user
          // but we still return true to indicate successful submission
        }
        return true;
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}