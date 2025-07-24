'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Proverbs } from '../types';

export default function YorubaProverb() {
  const proverbs: Proverbs[] = [
    {
      id: '1',
      yoruba: 'Ọmọ tí a kọ́ ni yóò gbé ilé tí a kọ́ tà',
      english: 'The child we train will sell the house we build.',
    },
    {
      id: '2',
      yoruba: 'Ìwà l’ẹwà',
      english: 'Character is beauty.',
    },
    {
      id: '3',
      yoruba: 'Bí a bá rọ̀ mọ́ àgbà, a ò ní rọ̀ mọ́ ikú',
      english: 'If we respect elders, we will not die young.',
    },
  ];

  const [currentProverb, setCurrentProverb] = useState(proverbs[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      setCurrentProverb(proverbs[randomIndex]);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.blockquote
      className="text-center text-yoruba-navy font-lora italic py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      key={currentProverb.id}
    >
      <p className="text-lg font-noto">"{currentProverb.yoruba}"</p>
      <p className="text-sm mt-2">{currentProverb.english}</p>
    </motion.blockquote>
  );
} 