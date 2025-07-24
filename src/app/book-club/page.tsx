'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import YorubaProverb from '../../components/YorubaProverb';

const books = [
  {
    id: '1',
    title: 'Yoruba Folktales',
    synopsis: 'A collection of traditional Yoruba stories passed down through generations.',
    coverImage: '/images/book1.jpg',
  },
  {
    id: '2',
    title: 'The Palm-Wine Drinkard',
    synopsis: 'A classic novel exploring Yoruba mythology and adventure.',
    coverImage: '/images/book2.jpg',
  },
  {
    id: '3',
    title: 'Ogboju Ode Ninu Igbo Irunmale',
    synopsis: 'A Yoruba epic about a hunter’s journey through a mystical forest.',
    coverImage: '/images/book3.jpg',
  },
];

const benefits = [
  'Engage with Yoruba speakers',
  'Explore Yoruba culture through literature',
  'Participate in live discussion sessions',
];

export default function BookClub() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterSuccess(true);
  };

  return (
    <div className="min-h-screen bg-adire-pattern bg-opacity-10">
      <Header />
      {/* About Section */}
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red mb-4">
            Yoruba Book Club
          </h1>
          <p className="text-lg md:text-xl font-noto text-yoruba-navy">
            Join our monthly Book Club to discuss Yoruba literature, folklore, and translated stories. Open to all levels!
          </p>
        </motion.div>
      </motion.section>

      {/* Current Book Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">Current Book</h2>
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-yoruba-cream/50 backdrop-blur-md border-2 border-yoruba-green p-6 rounded-lg shadow-lg flex flex-col items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={books[0].coverImage}
              alt={books[0].title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-poppins font-bold text-yoruba-red">{books[0].title}</h3>
            <p className="text-yoruba-navy my-4 font-noto">{books[0].synopsis}</p>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
              aria-label="Join the Book Club"
            >
              Join the Book Club
            </button>
          </motion.div>
        </div>
      </section>

      {/* Past Books Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">Past Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.slice(1).map((book) => (
            <motion.div
              key={book.id}
              className="bg-yoruba-cream/50 backdrop-blur-md border-2 border-yoruba-green p-6 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-transform"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-poppins font-bold text-yoruba-red">{book.title}</h3>
              <p className="text-yoruba-navy my-4 font-noto">{book.synopsis}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Benefits Section */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Community Benefits</h2>
          <ul className="list-disc pl-6 text-yoruba-navy font-noto">
            {benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Yoruba Proverb */}
      <YorubaProverb />

      {/* Registration Modal */}
      {isRegisterOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-yoruba-cream/80 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold max-w-sm w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {registerSuccess ? (
              <>
                <h3 className="text-xl font-poppins font-bold text-yoruba-green mb-4">Thank you for registering for the Book Club!</h3>
                <button
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setRegisterSuccess(false);
                  }}
                  className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-poppins font-bold text-yoruba-green mb-4">Join the Book Club</h3>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-green p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold"
                    required
                    aria-label="Name"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-green p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold"
                    required
                    aria-label="Email"
                  />
                  <select
                    className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-green p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-gold"
                    required
                    aria-label="Yoruba proficiency level"
                  >
                    <option value="" disabled>Select Yoruba Level</option>
                    <option value="Novice">Novice</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
                      aria-label="Register for Book Club"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Register & Pay ₦5,000'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRegisterOpen(false)}
                      className="bg-yoruba-navy text-white px-4 py-2 rounded-lg hover:bg-yoruba-navy/80 transition-transform"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
} 