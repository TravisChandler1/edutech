'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-yoruba-cream/30 to-yoruba-gold/10" />
          
          {/* Main spinner container */}
          <div className="relative flex flex-col items-center">
            {/* Outer rotating ring */}
            <motion.div
              className="w-20 h-20 border-4 border-yoruba-gold/20 border-t-yoruba-gold rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner pulsing circle */}
            <motion.div
              className="absolute w-12 h-12 bg-yoruba-orange rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Center logo/icon */}
            <motion.div
              className="absolute w-6 h-6 bg-white rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-3 h-3 bg-yoruba-navy rounded-full" />
            </motion.div>
            
            {/* Loading text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-exo font-bold text-yoruba-navy mb-2">
                Ẹwà Èdè Yorùbá
              </h3>
              <motion.p
                className="text-yoruba-navy/70 font-noto"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading...
              </motion.p>
            </motion.div>
            
            {/* Decorative dots */}
            <div className="absolute -bottom-16 flex space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-yoruba-gold rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Yoruba pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-repeat opacity-20" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23020735' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                   backgroundSize: '60px 60px'
                 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}