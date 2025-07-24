import Image from 'next/image';
import { motion } from 'framer-motion';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-yoruba-cream/50 backdrop-blur-md p-6 rounded-lg border-2 border-yoruba-gold shadow-md"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-yoruba-navy italic font-lora mb-4">"{testimonial.quote}"</p>
      <div className="flex items-center">
        <Image
          src={testimonial.avatar || '/images/default-avatar.jpg'}
          alt={`Avatar of ${testimonial.name}`}
          width={48}
          height={48}
          className="rounded-full border-2 border-yoruba-gold object-cover"
        />
        <p className="ml-4 font-poppins font-bold text-yoruba-green">{testimonial.name}</p>
      </div>
    </motion.div>
  );
} 