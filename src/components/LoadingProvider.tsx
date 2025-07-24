'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      <LoadingSpinner isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}

interface LoadingSpinnerProps {
  isLoading: boolean;
}

function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-white/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Spinner content */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
          >
            {/* Main spinner */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                className="w-16 h-16 border-3 border-yoruba-navy/20 border-t-yoruba-orange border-r-yoruba-gold rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-2 w-12 h-12 border-2 border-yoruba-gold/30 border-b-yoruba-navy rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Center dot */}
              <motion.div
                className="absolute inset-6 w-4 h-4 bg-yoruba-orange rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Academy name */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-exo font-bold text-yoruba-navy">
                Ẹwà Èdè Yorùbá
              </h3>
              <motion.div
                className="flex items-center justify-center mt-2 space-x-1"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-sm text-yoruba-navy/70 font-noto">Loading</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                >
                  .
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Progress bar */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-yoruba-navy/10 rounded-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yoruba-orange to-yoruba-gold rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}