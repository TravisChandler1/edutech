'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import YorubaProverb from '../../components/YorubaProverb';

const faqs = [
  {
    question: 'How do I enroll in a class?',
    answer: 'Visit the Classes page, select your level, and click “Enroll Now” or join the waitlist if classes are full.'
  },
  {
    question: 'How do I join the Book Club?',
    answer: 'Go to the Book Club page and register using the form. You will receive details by email.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards, mobile money, and secure Paystack payments.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Please contact us for refund policies and support.'
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    // TODO: Send to backend or email service
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-adire-pattern bg-opacity-10">
      <Header />
      <motion.section
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-yoruba-red mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl font-noto text-yoruba-navy mb-4">
            Have questions or need support? Reach out to us using the form below or check our FAQ.
          </p>
        </motion.div>

        {/* Contact Form & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="bg-yoruba-cream/50 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-poppins font-bold text-yoruba-green mb-4">Contact Form</h2>
            {submitted ? (
              <p className="text-yoruba-green font-noto">Thank you for reaching out! We’ll get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-gold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  required
                  aria-label="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-gold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  required
                  aria-label="Email"
                />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-gold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  required
                  aria-label="Subject"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={4}
                  className="w-full bg-yoruba-cream/80 backdrop-blur-sm border border-yoruba-gold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoruba-green"
                  required
                  aria-label="Message"
                />
                {error && <p className="text-yoruba-red text-sm font-noto">{error}</p>}
                <motion.button
                  type="submit"
                  className="w-full bg-yoruba-orange text-white px-4 py-2 rounded-lg hover:bg-yoruba-orange/80 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
              </form>
            )}
          </motion.div>
          <motion.div
            className="bg-yoruba-cream/50 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold shadow-lg flex flex-col justify-between"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-poppins font-bold text-yoruba-green mb-4">Contact Details</h2>
            <div className="mb-4">
              <p className="font-poppins font-bold text-yoruba-navy">Email:</p>
              <a href="mailto:info@ewa-ede-yoruba.com" className="text-yoruba-green underline">info@ewa-ede-yoruba.com</a>
            </div>
            <div className="mb-4">
              <p className="font-poppins font-bold text-yoruba-navy">Phone:</p>
              <a href="tel:+2348000000000" className="text-yoruba-green underline">+234 800 000 0000</a>
            </div>
            <div className="mb-4">
              <p className="font-poppins font-bold text-yoruba-navy">Social:</p>
              <a href="https://twitter.com" className="text-yoruba-orange mr-2">Twitter</a>
              <a href="https://facebook.com" className="text-yoruba-orange mr-2">Facebook</a>
              <a href="https://instagram.com" className="text-yoruba-orange">Instagram</a>
            </div>
            {/* Optional Map */}
            {/* <div className="mt-4">
              <iframe src="https://www.google.com/maps/embed?..." width="100%" height="150" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map"></iframe>
            </div> */}
          </motion.div>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          className="bg-yoruba-cream/50 backdrop-blur-md p-8 rounded-lg border-2 border-yoruba-gold shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-poppins font-bold text-yoruba-green mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full text-left font-poppins font-bold text-yoruba-red py-2 px-4 rounded-lg bg-white/80 hover:bg-yoruba-gold/20 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  {faq.question}
                </button>
                <motion.div
                  id={`faq-panel-${i}`}
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4"
                >
                  {openFaq === i && <div className="py-2 text-yoruba-navy font-noto">{faq.answer}</div>}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>
      <YorubaProverb />
      <Footer />
    </div>
  );
} 