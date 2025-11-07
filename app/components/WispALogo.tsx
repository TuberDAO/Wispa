'use client';

export default function WispALogo() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      onClick={scrollToTop}
      className="fixed top-6 left-6 z-50 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <div className="relative">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-all duration-300 group-hover:scale-110"
          >
            {/* Outer glow ring */}
            <circle 
              cx="20" 
              cy="20" 
              r="18" 
              stroke="url(#logoGradient)" 
              strokeWidth="1" 
              opacity="0.3"
              className="animate-pulse"
            />
            
            {/* Main hexagon shape */}
            <path 
              d="M20 4 L32 11 L32 27 L20 34 L8 27 L8 11 Z" 
              stroke="url(#logoGradient)" 
              strokeWidth="1.5" 
              fill="none"
              className="group-hover:stroke-[2]"
            />
            
            {/* Inner wispy "W" shape */}
            <path 
              d="M12 14 L14 24 L17 18 L20 24 L23 18 L26 24 L28 14" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className="text-glow-cyan"
            />
            
            {/* Privacy lock accent */}
            <circle 
              cx="20" 
              cy="28" 
              r="2" 
              fill="url(#logoGradient)"
              className="opacity-80"
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D9FF" />
                <stop offset="50%" stopColor="#00FFA3" />
                <stop offset="100%" stopColor="#FF00E5" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-cyber-cyan/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Logo Text */}
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold gradient-text-cyan tracking-tight">
            WispA
          </span>
          <span className="text-[8px] text-cyber-green font-mono tracking-widest uppercase opacity-80">
            GPT
          </span>
        </div>
      </div>
    </div>
  );
}

