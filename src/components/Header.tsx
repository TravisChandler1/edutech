'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { href: '/about', label: 'About' },
    { 
      href: '/classes', 
      label: 'Classes',
      subLinks: [
        { href: '/classes', label: 'All Classes' },
        { href: '/live-classes', label: 'Live Classes' }
      ]
    },
    { 
      href: '/book-club', 
      label: 'Book Club',
      subLinks: [
        { href: '/book-club', label: 'Book Club Home' },
        { href: '/ebooks', label: 'Ebooks' }
      ]
    },
    { href: '/communities', label: 'Communities' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  // Add admin link if user is admin
  if (currentUser?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <motion.header
      className="bg-yoruba-navy text-white py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg"
      style={{ backgroundColor: '#0f172a' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-2xl font-tektur font-bold hover:text-yoruba-gold transition-colors duration-300">
          Ẹwà Èdè Yorùbá
        </Link>
        {/* Admin icon - positioned absolutely on mobile */}
        <div className="md:hidden absolute right-14 top-1/2 transform -translate-y-1/2">
          <Link 
            href="/admin/login"
            className="text-gray-200 hover:text-yoruba-blue transition-colors duration-200 p-2 rounded-full hover:bg-gray-100/20"
            title="Admin Login"
            aria-label="Admin Login"
          >
            <FaUserShield className="w-5 h-5" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <div 
              key={link.href}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.href)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <LoadingLink
                href={link.href}
                className={`flex items-center text-white hover:text-yoruba-gold font-medium transition-colors duration-200 ${link.subLinks ? 'pr-4' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === link.href ? null : link.href)}
              >
                {link.label}
                {link.subLinks && (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </LoadingLink>
              {link.subLinks && (
                <div 
                  className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${activeDropdown === link.href ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                >
                  {link.subLinks.map((subLink) => (
                    <LoadingLink
                      key={subLink.href}
                      href={subLink.href}
                      className="block px-4 py-2 text-sm text-yoruba-navy hover:bg-yoruba-gold/10 transition-colors duration-200"
                    >
                      {subLink.label}
                    </LoadingLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="hidden md:block">
            <Link 
              href="/admin/login"
              className="text-gray-200 hover:text-yoruba-blue transition-colors duration-200 p-2 rounded-full hover:bg-gray-100/20"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <FaUserShield className="w-5 h-5" />
            </Link>
          </div>
        </nav>
        {/* Auth buttons */}
        <div className="ml-4 hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/admin/login"
                className="text-yoruba-blue hover:text-yoruba-green transition-colors p-2"
                title="Admin Login"
              >
                <FaUserShield className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-4">
                <Link 
                  href={currentUser.role === 'teacher' ? '/dashboard/teacher' : currentUser.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="text-yoruba-blue hover:text-yoruba-green transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-yoruba-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full sm:w-auto text-center bg-yoruba-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Get Started
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
            <div className="absolute top-6 left-6 right-16 flex justify-between items-center">
              <Link 
                href="/" 
                className="text-xl font-tektur font-bold text-white hover:text-yoruba-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Ẹwà Èdè Yorùbá
              </Link>
            </div>

            {/* Navigation links */}
            <ul className="flex flex-col items-center space-y-4 w-full px-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className="w-full"
                >
                  <div className="flex flex-col">
                    <LoadingLink
                      href={link.href}
                      className="text-2xl font-exo font-semibold text-white hover:text-yoruba-gold transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </LoadingLink>
                    {link.subLinks && (
                      <div className="mt-1 ml-6 space-y-2">
                        {link.subLinks.map((subLink) => (
                          <LoadingLink
                            key={subLink.href}
                            href={subLink.href}
                            className="block text-xl font-exo text-yoruba-cream/80 hover:text-yoruba-gold transition-all duration-300 py-1 px-4 rounded-lg hover:bg-white/5"
                            onClick={() => setIsOpen(false)}
                          >
                            {subLink.label}
                          </LoadingLink>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Mobile auth buttons */}
            <div className="absolute bottom-20 flex flex-col space-y-4 w-64">
              {currentUser ? (
                <div className="text-center">
                  <p className="text-white mb-4">Welcome, {currentUser.name?.split(' ')[0] || 'User'}</p>
                  <Link
                    href={currentUser.role === 'teacher' ? '/dashboard/teacher' : currentUser.role === 'admin' ? '/admin' : '/dashboard'}
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