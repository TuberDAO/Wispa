'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20; // Fast loading
      });
    }, 50);

    // Hide loading screen after animation completes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 400); // Shows for ~0.4 seconds

    return () => {
      clearInterval(progressInterval);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="text-center space-y-6">
        {/* LOADING... text */}
        <h1 className="terminal-text text-2xl md:text-3xl font-mono tracking-widest animate-pulse">
          LOADING...
        </h1>
        
        {/* Loading bar */}
        <div className="w-64 md:w-80 h-8 border-2 border-cyber-green bg-black mx-auto">
          <div 
            className="h-full bg-cyber-green transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <p className="terminal-text text-sm font-mono tracking-wider">
          {progress}%
        </p>
      </div>
    </div>
  );
}

