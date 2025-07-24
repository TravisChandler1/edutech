'use client';

import React from 'react';
import { motion } from 'framer-motion';
import YorubaProverb from '../../components/YorubaProverb';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  // Sample timeline data
  const milestones = [
    { year: '2025', event: 'Launched Ẹwà Èdè Yorùbá Academy' },
    { year: '2026', event: 'First 100 students enrolled' },
    { year: '2027', event: 'Book Club launched' },
    { year: '2028', event: 'Newsletter reaches 1,000 subscribers' },
  ];
  // Sample team data
  const team = [
    { 
      name: 'Dr. Adebayo O.', 
      role: 'Lead Instructor', 
      bio: 'Expert in Yoruba linguistics with 10+ years of teaching experience.', 
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80' 
    },
    { 
      name: 'Funke A.', 
      role: 'Cultural Ambassador', 
      bio: 'Passionate about preserving Yoruba traditions through storytelling.', 
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format&q=80' 
    },
  ];

  return (
    <div className="min-h-screen non-home-bg">
      <Header />
      {/* Mission & Vision */}
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="glass-card p-8 rounded-lg text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red mb-4">
            About Ẹwà Èdè Yorùbá Academy
          </h1>
          <p className="text-lg md:text-xl font-noto text-yoruba-navy mb-4">
            Ẹwà Èdè Yorùbá Academy is dedicated to preserving and promoting Yoruba language, culture, and heritage through immersive education, cultural exchange, and community engagement.
          </p>
          <p className="text-lg md:text-xl font-lora text-yoruba-green">
            Our vision is to become a vibrant hub for Yoruba cultural expression, language learning, and heritage preservation.
          </p>
        </motion.div>
      </motion.section>

      {/* Our Story (Timeline) */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="glass-card p-8 rounded-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-green mb-4">Our Story</h2>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="flex-1">
              <ul className="border-l-4 border-yoruba-gold pl-6">
                {milestones.map((m, i) => (
                  <li key={i} className="mb-6 relative">
                    <span className="absolute -left-7 top-0 w-5 h-5 bg-yoruba-gold rounded-full border-2 border-yoruba-cream"></span>
                    <span className="font-bold text-yoruba-red">{m.year}</span>
                    <span className="block text-yoruba-navy font-noto">{m.event}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 mt-8 md:mt-0 flex items-center justify-center">
              <img src="/images/adire-pattern.png" alt="Adire pattern" className="w-48 h-48 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-poppins font-bold text-yoruba-red text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="glass-card-light p-6 rounded-lg hover:shadow-lg transition-transform"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.avatar}
                alt={`Avatar of ${member.name}`}
                className="w-20 h-20 rounded-full border-2 border-yoruba-gold mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-poppins font-bold text-yoruba-red text-center">{member.name}</h3>
              <p className="text-yoruba-green font-noto text-center">{member.role}</p>
              <p className="text-yoruba-navy font-noto mt-2 text-center">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cultural Impact Section */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="glass-card p-8 rounded-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-yoruba-red mb-4 text-center">Cultural Impact</h2>
          <p className="text-yoruba-navy font-noto text-center mb-4">
            Preserving Yoruba language and culture is vital for future generations. Through education, storytelling, and community, we keep our heritage alive.
          </p>
          <YorubaProverb />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <a
          href="/classes"
          className="bg-yoruba-orange text-white px-6 py-3 rounded-lg hover:bg-yoruba-orange/80 transition-transform transform hover:scale-105 font-poppins font-bold"
          aria-label="Join our community"
        >
          Join Our Community
        </a>
      </section>
      <Footer />
    </div>
  );
} 