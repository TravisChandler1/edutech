'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiX, FiEye, FiEyeOff, FiUpload, FiEdit2 } from 'react-icons/fi';

// Toast notification system
const showToast = (message: string, type: 'success' | 'error' = 'error') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white shadow-lg z-50 animate-fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// API Client Utility
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include' as const,
  };

  try {
    const response = await fetch(`/api${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

// Types
interface FormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar?: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  selectedPlan?: string;
  selectedCategory?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  updateUser: (user: User) => void;
}

interface FormErrors {
  [key: string]: string;
}

const ProfilePage: React.FC = () => {
  // State
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  // Hooks
  const { currentUser, updateUser } = useAuth() as unknown as AuthContextType;
  const router = useRouter();

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient('/auth/me');
      const userData = response.data;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: userData.avatar || ''
      });
      
      if (userData.avatar) {
        setAvatarPreview(userData.avatar);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Load user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (isEditing) {
      if (formData.newPassword && formData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Reset form to initial state
  const resetForm = useCallback(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: currentUser.avatar || ''
      });
      
      setAvatarPreview(currentUser.avatar || '');
      setFormErrors({});
    }
  }, [currentUser]);

  // Handle profile image upload
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      showToast('Please select a valid image file (JPEG, PNG, GIF)', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    try {
      // In a real app, upload the file to your server here
      // For now, we'll just create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      // Simulate upload
      setIsLoading(true);
      // In a real app, you would upload the file to your server here
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await apiClient('/profile/avatar', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Update user context with new avatar
      // updateUser({ ...currentUser, avatar: response.avatarUrl });
      
      showToast('Profile picture updated successfully!', 'success');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showToast('Failed to update profile picture', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, you would send this data to your API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      if (!currentUser?.id) {
        throw new Error('User ID is required');
      }
      
      const updatedUser = {
        ...currentUser,
        id: currentUser.id, // Ensure id is always defined
        name: formData.name,
        email: formData.email,
        avatar: avatarPreview || currentUser.avatar
      };
      
      updateUser(updatedUser as User);
      
      // Reset form state
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yoruba-navy to-yoruba-green">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-gold"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yoruba-navy to-yoruba-green py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-6 sm:mb-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-yoruba-cream/80 mt-1">
                  Manage your account information and settings
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yoruba-green hover:bg-yoruba-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-gold transition-colors"
                  >
                    <FiEdit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-gold transition-colors"
                    >
                      <FiX className="mr-2 h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="profile-form"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yoruba-green hover:bg-yoruba-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-gold transition-colors"
                      disabled={isLoading}
                    >
                      <FiSave className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-yoruba-cream/10 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser className="h-16 w-16 text-yoruba-cream/50" />
                      )}
                    </div>
                    
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-yoruba-gold p-2 rounded-full cursor-pointer hover:bg-yoruba-gold/90 transition-colors">
                        <FiUpload className="h-5 w-5 text-yoruba-navy" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  
                  {isEditing && (
                    <p className="mt-2 text-sm text-yoruba-cream/70">
                      Click on the icon to change your profile picture
                    </p>
                  )}
                </div>
                
                {/* Name Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="name" className="block text-sm font-medium text-yoruba-cream">
                      Full Name
                    </label>
                    {formErrors.name && (
                      <span className="text-sm text-red-400">{formErrors.name}</span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-yoruba-cream/50" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.name ? 'border-red-500' : 'border-yoruba-cream/20'
                      } rounded-md shadow-sm bg-white/5 text-white focus:ring-yoruba-gold focus:border-yoruba-gold sm:text-sm transition-colors`}
                    />
                  </div>
                </div>
                
                {/* Email Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="email" className="block text-sm font-medium text-yoruba-cream">
                      Email Address
                    </label>
                    {formErrors.email && (
                      <span className="text-sm text-red-400">{formErrors.email}</span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-yoruba-cream/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.email ? 'border-red-500' : 'border-yoruba-cream/20'
                      } rounded-md shadow-sm bg-white/5 text-white focus:ring-yoruba-gold focus:border-yoruba-gold sm:text-sm transition-colors`}
                    />
                  </div>
                </div>
                
                {/* Current Password (only when editing) */}
                {isEditing && (
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-yoruba-cream mb-2">
                      Current Password (required for changes)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-yoruba-cream/50" />
                      </div>
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2 border border-yoruba-cream/20 rounded-md shadow-sm bg-white/5 text-white focus:ring-yoruba-gold focus:border-yoruba-gold sm:text-sm transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-yoruba-cream/50 hover:text-yoruba-cream/80 transition-colors"
                      >
                        {showPassword.current ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* New Password (only when editing) */}
                {isEditing && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-yoruba-cream">
                        New Password (leave blank to keep current)
                      </label>
                      {formErrors.newPassword && (
                        <span className="text-sm text-red-400">{formErrors.newPassword}</span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-yoruba-cream/50" />
                      </div>
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-10 py-2 border ${
                          formErrors.newPassword ? 'border-red-500' : 'border-yoruba-cream/20'
                        } rounded-md shadow-sm bg-white/5 text-white focus:ring-yoruba-gold focus:border-yoruba-gold sm:text-sm transition-colors`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-yoruba-cream/50 hover:text-yoruba-cream/80 transition-colors"
                      >
                        {showPassword.new ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Confirm Password (only when editing and new password is provided) */}
                {isEditing && formData.newPassword && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-yoruba-cream">
                        Confirm New Password
                      </label>
                      {formErrors.confirmPassword && (
                        <span className="text-sm text-red-400">{formErrors.confirmPassword}</span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-yoruba-cream/50" />
                      </div>
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-10 py-2 border ${
                          formErrors.confirmPassword ? 'border-red-500' : 'border-yoruba-cream/20'
                        } rounded-md shadow-sm bg-white/5 text-white focus:ring-yoruba-gold focus:border-yoruba-gold sm:text-sm transition-colors`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-yoruba-cream/50 hover:text-yoruba-cream/80 transition-colors"
                      >
                        {showPassword.confirm ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Form Actions (shown only in edit mode) */}
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-gold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yoruba-green hover:bg-yoruba-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yoruba-gold transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
