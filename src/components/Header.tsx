'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import LoadingLink from './LoadingLink';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  defaultAuthMode?: 'login' | 'register';
}

export default function Header({ defaultAuthMode = 'login' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>(defaultAuthMode);
  const { currentUser, logout } = useAuth();

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.classList.remove('mobile-nav-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-nav-open');
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/classes', label: 'Classes' },
    { href: '/book-club', label: 'Book Club' },
    { href: '/live-classes', label: 'Live Classes' },
    { href: '/communities', label: 'Communities' },
    { href: '/ebooks', label: 'Ebooks' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  // Add admin link if user is admin
  if (currentUser?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <motion.header
      className="bg-yoruba-navy navbar-navy text-white py-4 px-6 sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: '#1e3a8a' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-poppins font-bold hover:text-yoruba-gold transition-colors duration-300">
          Ẹwà Èdè Yorùbá
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <LoadingLink
              key={link.href}
              href={link.href}
              className="hover:text-yoruba-gold transition-colors duration-300 font-medium"
            >
              {link.label}
            </LoadingLink>
          ))}
        </nav>
        {/* Auth buttons */}
        <div className="ml-4 hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Welcome, {currentUser.name?.split(' ')[0] || 'User'}</span>
              <Link
                href="/dashboard"
                className="text-yoruba-gold hover:text-white transition-colors duration-300 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-medium hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => openAuthModal('login')}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-yoruba-navy transition-all duration-300 font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="bg-gradient-to-r from-yoruba-orange to-yoruba-gold text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
              >
                Join Free
              </button>
            </div>
          )}
        </div>
        <button
          className="md:hidden text-2xl hover:text-yoruba-gold transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Full-screen mobile navigation overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred background overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Navigation content */}
          <motion.nav
            className="relative h-full bg-yoruba-navy/95 backdrop-blur-lg flex flex-col justify-center items-center"
            style={{ backgroundColor: 'rgba(30, 58, 138, 0.95)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-white text-3xl hover:text-yoruba-gold transition-colors duration-300"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>

            {/* Logo */}
            <div className="absolute top-6 left-6">
              <Link 
                href="/" 
                className="text-xl font-poppins font-bold text-white hover:text-yoruba-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Ẹwà Èdè Yorùbá
              </Link>
            </div>

            {/* Navigation links */}
            <ul className="flex flex-col items-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                >
                  <LoadingLink
                    href={link.href}
                    className="text-2xl font-exo font-semibold text-white hover:text-yoruba-gold transition-all duration-300 transform hover:scale-110"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </LoadingLink>
                </motion.li>
              ))}
            </ul>

            {/* Mobile auth buttons */}
            <div className="absolute bottom-20 flex flex-col space-y-4 w-64">
              {currentUser ? (
                <div className="text-center">
                  <p className="text-white mb-4">Welcome, {currentUser.name?.split(' ')[0] || 'User'}</p>
                  <Link
                    href="/dashboard"
                    className="block bg-yoruba-gold text-yoruba-navy py-3 px-6 rounded-lg font-semibold mb-3 hover:bg-yoruba-gold/90 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsOpen(false);
                    }}
                    className="bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg hover:bg-white hover:text-yoruba-navy transition-all duration-300 font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setIsOpen(false);
                    }}
                    className="bg-gradient-to-r from-yoruba-orange to-yoruba-gold text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    Join Free
                  </button>
                </>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-8 text-center">
              <p className="text-yoruba-gold font-noto text-sm opacity-80">
                Ẹ kú àbọ̀ sí ilé ẹkọ́ wa
              </p>
              <p className="text-white font-noto text-xs opacity-60 mt-1">
                Welcome to our academy
              </p>
            </div>
          </motion.nav>
        </motion.div>
      )}
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </motion.header>
  );
}