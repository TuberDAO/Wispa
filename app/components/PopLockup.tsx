export default function PopLockup() {
  return (
    <div className="space-y-3">
      {/* P.O.P Lockup - Proof Of Privacy */}
      <h2 className="flex flex-wrap items-baseline justify-center gap-x-1 leading-none">
        {/* Proof */}
        <span className="whitespace-nowrap">
          <span className="text-5xl md:text-7xl font-extrabold text-cyber-green tracking-tight drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">
            P
          </span>
          <span className="text-base md:text-lg text-text-secondary opacity-80 font-light">
            roof
          </span>
        </span>
        
        {/* Of */}
        <span className="whitespace-nowrap">
          <span className="text-5xl md:text-7xl font-extrabold text-cyber-green tracking-tight drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">
            O
          </span>
          <span className="text-base md:text-lg text-text-secondary opacity-80 font-light">
            f
          </span>
        </span>
        
        {/* Privacy */}
        <span className="whitespace-nowrap">
          <span className="text-5xl md:text-7xl font-extrabold text-cyber-green tracking-tight drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">
            P
          </span>
          <span className="text-base md:text-lg text-text-secondary opacity-80 font-light">
            rivacy
          </span>
        </span>
      </h2>
      
      {/* Subtitle */}
      <p className="text-sm md:text-base text-text-muted opacity-80 tracking-wide">
        Verified on MegaETH
      </p>
    </div>
  );
}

