'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import YorubaProverb from '../../components/YorubaProverb';

const groupPricing = [
  { level: 'Novice', price: '₦10,000/month', features: ['Weekly group sessions', 'Community access'] },
  { level: 'Beginner', price: '₦15,000/month', features: ['Weekly group sessions', 'Community access'] },
  { level: 'Intermediate', price: '₦20,000/month', features: ['Weekly group sessions', 'Community access'] },
  { level: 'Advanced', price: '₦25,000/month', features: ['Weekly group sessions', 'Community access'] },
];

const individualPricing = [
  { level: 'All Levels', price: '₦8,000/hour', features: ['1-on-1 personalized lessons', 'Flexible scheduling'] },
];

const bookClubPricing = [
  { plan: 'Monthly', price: '₦5,000/month', features: ['Book of the month', 'Live discussion', 'Community access'] },
];

const paymentOptions = [
  { icon: '💳', label: 'Credit/Debit Card' },
  { icon: '📱', label: 'Mobile Money' },
  { icon: '🔒', label: 'Secure Paystack Payment' },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-adire-pattern bg-opacity-10">
      <Header />
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red text-center mb-8">Pricing</h1>
        {/* Group Classes Pricing */}
        <motion.div
          className="mb-12 bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-green shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Group Classes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-yoruba-red font-bold">Level</th>
                  <th className="px-4 py-2 text-left text-yoruba-green font-bold">Price</th>
                  <th className="px-4 py-2 text-left text-yoruba-navy font-bold">Features</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {groupPricing.map((row, i) => (
                  <tr key={row.level} className={i % 2 === 0 ? 'bg-yoruba-cream/80' : 'bg-white/80'}>
                    <td className="px-4 py-2 font-poppins font-bold">{row.level}</td>
                    <td className="px-4 py-2">{row.price}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-4">
                        {row.features.map((f, j) => <li key={j}>{f}</li>)}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <a href="/classes" className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold">Sign Up</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Individual Classes Pricing */}
        <motion.div
          className="mb-12 bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-green shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Individual Classes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-yoruba-red font-bold">Level</th>
                  <th className="px-4 py-2 text-left text-yoruba-green font-bold">Price</th>
                  <th className="px-4 py-2 text-left text-yoruba-navy font-bold">Features</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {individualPricing.map((row, i) => (
                  <tr key={row.level} className={i % 2 === 0 ? 'bg-yoruba-cream/80' : 'bg-white/80'}>
                    <td className="px-4 py-2 font-poppins font-bold">{row.level}</td>
                    <td className="px-4 py-2">{row.price}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-4">
                        {row.features.map((f, j) => <li key={j}>{f}</li>)}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <a href="/classes" className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold">Book Now</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Book Club Pricing */}
        <motion.div
          className="mb-12 bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-green shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Book Club</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-yoruba-red font-bold">Plan</th>
                  <th className="px-4 py-2 text-left text-yoruba-green font-bold">Price</th>
                  <th className="px-4 py-2 text-left text-yoruba-navy font-bold">Features</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {bookClubPricing.map((row, i) => (
                  <tr key={row.plan} className={i % 2 === 0 ? 'bg-yoruba-cream/80' : 'bg-white/80'}>
                    <td className="px-4 py-2 font-poppins font-bold">{row.plan}</td>
                    <td className="px-4 py-2">{row.price}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-4">
                        {row.features.map((f, j) => <li key={j}>{f}</li>)}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <a href="/book-club" className="bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform font-poppins font-bold">Join Now</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Payment Options */}
        <motion.div
          className="mb-12 bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-red mb-4">Payment Options</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {paymentOptions.map((opt, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl mb-2">{opt.icon}</span>
                <span className="font-poppins font-bold text-yoruba-navy">{opt.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-yoruba-green font-noto">All payments are processed securely via Paystack.</div>
        </motion.div>
      </motion.section>
      <YorubaProverb />
      <Footer />
    </div>
  );
} 