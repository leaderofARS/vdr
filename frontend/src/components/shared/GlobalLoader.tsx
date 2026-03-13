import React from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const GlobalLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-sipheron-base flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)' }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-6">
          <RefreshCw className="w-12 h-12 text-sipheron-purple animate-spin" />
          <div className="absolute inset-0 blur-xl bg-sipheron-purple/30 animate-pulse" />
        </div>
        
        <p className="text-sipheron-purple font-mono tracking-[0.2em] uppercase text-[10px] font-bold">
          Initializing SipHeron VDR...
        </p>
      </motion.div>
    </div>
  );
};

export default GlobalLoader;
