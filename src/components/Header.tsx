'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/classes', label: 'Classes' },
    { href: '/book-club', label: 'Book Club' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      className="bg-yoruba-navy text-white py-4 px-6 sticky top-0 z-50 shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-poppins font-bold">
          Ẹwà Èdè Yorùbá
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-yoruba-gold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Language toggle placeholder */}
        <div className="ml-4 hidden md:block">
          {/* <LanguageToggle /> */}
        </div>
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isOpen && (
        <motion.nav
          className="md:hidden bg-yoruba-navy py-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yoruba-gold transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </motion.header>
  );
} 