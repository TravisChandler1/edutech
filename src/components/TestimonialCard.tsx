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
        <div className="w-12 h-12 rounded-full border-2 border-yoruba-gold bg-yoruba-cream flex items-center justify-center overflow-hidden">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={`Avatar of ${testimonial.name}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex items-center justify-center bg-yoruba-green text-white font-bold';
                  fallback.textContent = initials.substring(0, 2);
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-yoruba-green text-white font-bold">
              {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
          )}
        </div>
        <p className="ml-4 font-poppins font-bold text-yoruba-green">{testimonial.name}</p>
      </div>
    </motion.div>
  );
}