import React from 'react';
import { motion } from 'framer-motion';

export const FullPageLoader = ({ fullScreen = true }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : 'min-h-[50vh] flex-1'} w-full flex flex-col items-center justify-center bg-background`}>
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        {/* Animated Image */}
        <motion.img 
          src="/final.png" 
          alt="Loading..." 
          className="w-32 h-32 object-contain mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Horizontal Loading Bar (Neo-Brutalist) */}
        <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden shadow-hard">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%", x: "0%" }}
            animate={{ 
              width: ["0%", "50%", "100%", "0%"],
              x: ["0%", "0%", "0%", "100%"] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <p className="mt-4 font-bold font-heading text-lg tracking-wider animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  );
};
