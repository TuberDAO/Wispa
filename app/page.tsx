'use client';

import { useState } from 'react';
import EmailModal from './components/EmailModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Join Early Access');

  const openModal = (title: string = 'Join Early Access') => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  return (
    <>
      <EmailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
      />

      <main className="relative min-h-screen z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in">
            
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full cyber-border-cyan bg-cyber-navy/40 backdrop-blur-sm text-sm animate-float">
              <svg className="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-cyber-cyan font-mono">Now in Private Beta</span>
            </div>

            {/* Main Title with Gradient */}
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-bold gradient-text-cyan tracking-tight leading-none">
                WispAGPT
              </h1>
              <p className="text-2xl md:text-4xl text-white font-light tracking-wide">
                Your private AI - <span className="text-cyber-cyan font-normal inline-flex items-baseline gap-1">
                  <span className="whitespace-nowrap mr-1">
                    with <span className="text-pop-accent">P</span>roof
                  </span>
                  <span className="whitespace-nowrap mr-1">
                    <span className="text-pop-accent">O</span>f
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="text-pop-accent">P</span>rivacy
                  </span>
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="max-w-4xl mx-auto space-y-4 pt-4">
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
                Everything you ask stays private. Privacy you can prove.
              </p>
              <p className="text-base md:text-lg text-text-muted">
                Powered by MegaETH
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => openModal('Join Early Access')}
                className="group px-10 py-4 bg-cyber-cyan text-cyber-dark text-lg font-semibold rounded-lg hover:bg-cyber-cyanGlow transition-all duration-200 transform hover:scale-105 active:scale-95 animate-pulse-glow"
              >
                Join Early Access
              </button>
              <button
                onClick={() => openModal('Request Whitepaper')}
                className="px-10 py-4 bg-transparent cyber-border-magenta text-text-primary text-lg font-semibold rounded-lg hover:bg-cyber-magenta/10 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Request Whitepaper
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
              <span className="terminal-text text-xs uppercase tracking-widest">Scroll to decrypt</span>
              <svg className="w-6 h-6 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </section>

        {/* About / Mission Section */}
        <section id="about" className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Terminal-style header */}
            <div className="mb-12">
              <p className="terminal-text text-sm mb-4">
                <span className="terminal-bracket">&gt;&gt;</span> PROTOCOL_OVERVIEW.exe
              </p>
              <h2 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-cyber-cyan text-glow-cyan">ABOUT</span>{' '}
                <span className="gradient-text-magenta">WispAGPT</span>
              </h2>
            </div>
            
            <div className="cyber-border-cyan rounded-2xl p-8 md:p-16 bg-cyber-navy/30 backdrop-blur-sm space-y-8">
              <div className="space-y-8 text-text-secondary text-lg md:text-xl leading-relaxed">
                <p className="text-2xl md:text-3xl font-light text-white">
                  WispAGPT runs AI models that <span className="text-cyber-yellow font-semibold">NEVER EXPOSE YOUR DATA.</span>
                </p>
                
                <p>
                  In a world where AI makes increasingly critical decisions, trust is everything. 
                  But how do you trust an AI system running in a black box?
                </p>
                
                <p>
                  <span className="text-white font-semibold">WispAGPT</span> solves this by combining secure enclaves with blockchain verification. 
                  Your data stays private inside hardware-level trusted execution environments, 
                  while every inference is cryptographically proven and recorded on-chain.
                </p>
                
                <div className="py-6">
                  <p className="terminal-text text-base leading-relaxed">
                    <span className="terminal-bracket">&gt;</span> Every session is sealed with a{' '}
                    <span className="text-cyber-magenta font-bold text-glow-magenta">VERIFIABLE PROOF</span>{' '}
                    on the blockchain showing when it ran and what model was used.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 text-xl pt-4">
                  <span className="text-text-secondary">Powered by</span>
                  <span className="text-cyber-green font-bold text-glow-green">MegaETH</span>
                </div>
                
                <p className="text-text-muted text-base">
                  High-performance blockchain for instant verification and low-cost proof storage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="terminal-text text-sm mb-4">
                <span className="terminal-bracket">[ </span>use cases<span className="terminal-bracket"> ]</span>
              </p>
              <h2 className="text-5xl md:text-6xl font-bold gradient-text-cyan">
                Secure AI for the<br />Decentralized Era
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* For Businesses */}
              <div className="group cyber-border-cyan rounded-xl p-8 bg-cyber-navy/20 backdrop-blur-sm hover:bg-cyber-navy/40 hover:box-glow-cyan transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                <div className="w-16 h-16 rounded-lg bg-cyber-cyan/10 flex items-center justify-center group-hover:bg-cyber-cyan/20 transition-colors mb-6">
                  <svg className="w-9 h-9 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">For Businesses</h3>
                <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                  Upload documents, contracts, or health data - or just write prompts - all verifiably private.
                  Your data is never seen, stored, or used to train anyone's model.
                  Everything runs inside a sealed enclave, proven by blockchain.
                  AI assistance you can prove is private.
                </p>
                <div className="pt-2">
                  <span className="inline-block text-cyber-cyan text-sm font-mono">→ Learn more (coming soon)</span>
                </div>
              </div>

              {/* For Developers */}
              <div className="group cyber-border-magenta rounded-xl p-8 bg-cyber-navy/20 backdrop-blur-sm hover:bg-cyber-navy/40 hover:box-glow-magenta transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                <div className="w-16 h-16 rounded-lg bg-cyber-magenta/10 flex items-center justify-center group-hover:bg-cyber-magenta/20 transition-colors mb-6">
                  <svg className="w-9 h-9 text-cyber-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">For Developers</h3>
                <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                  Build privacy-first apps using WispaGPT's secure APIs.
                  Verified inference, signed results and MegaETH-backed attestation - cryptographic proof your AI ran privately.
                  The world's first programmable private AI.
                </p>
                <div className="pt-2">
                  <span className="inline-block text-cyber-magenta text-sm font-mono">→ View docs (coming soon)</span>
                </div>
              </div>

              {/* For Users */}
              <div className="group cyber-border-cyan rounded-xl p-8 bg-cyber-navy/20 backdrop-blur-sm hover:bg-cyber-navy/40 hover:box-glow-cyan transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                <div className="w-16 h-16 rounded-lg bg-cyber-green/10 flex items-center justify-center group-hover:bg-cyber-green/20 transition-colors mb-6">
                  <svg className="w-9 h-9 text-cyber-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">For Everyone</h3>
                <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                  Ask anything - legal, medical, or personal - with total privacy.
                  No data sharing, no model training on your chats, no leaks - ever.
                  Think ChatGPT, but sealed inside a vault.
                </p>
                <div className="pt-2">
                  <span className="inline-block text-cyber-green text-sm font-mono">→ Try now (coming soon)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investor / Roadmap Section */}
        <section id="roadmap" className="relative py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="cyber-border-magenta rounded-2xl p-10 md:p-16 bg-gradient-to-br from-cyber-navy/40 to-cyber-dark/60 backdrop-blur-sm space-y-12">
              <div className="text-center space-y-6">
                <p className="terminal-text text-sm">
                  <span className="terminal-bracket">[ </span>whitepaper<span className="terminal-bracket"> ]</span>
                </p>
                <h2 className="text-4xl md:text-6xl font-bold gradient-text-magenta">
                  Join Us
                </h2>
                <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
                  We're building a new kind of AI - Private. Verifiable.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 pt-8">
                {/* Investors */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cyber-cyan/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">For Early Testers</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    Be the first to explore WispAGPT. Try real private inference, test attestation and help refine the platform.
                  </p>
                </div>

                {/* Whitepaper */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cyber-magenta/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-cyber-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Whitepaper</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    Get notified when it's released.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-8 border-t border-cyber-border">
                <button
                  onClick={() => openModal('Get Whitepaper Updates')}
                  className="px-12 py-4 bg-cyber-magenta text-white text-lg font-semibold rounded-lg hover:bg-cyber-purple transition-all duration-200 transform hover:scale-105 active:scale-95 box-glow-magenta"
                >
                  Notify Me
                </button>
                <p className="text-sm terminal-text mt-6">
                  <span className="terminal-bracket">[ </span>coming Q4 2025<span className="terminal-bracket"> ]</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="relative py-20 px-6 border-t border-cyber-cyan/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 mb-16">
              {/* Left: Branding */}
              <div className="space-y-6">
                <h3 className="text-4xl font-bold gradient-text-cyan">WispAGPT</h3>
                <p className="text-text-secondary text-lg max-w-md leading-relaxed">
                  The first AI you can prove is private.
                </p>
              </div>

              {/* Right: Social Links */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  {/* Twitter */}
                  <a 
                    href="https://twitter.com/wispagpt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-14 h-14 rounded-lg cyber-border-cyan bg-cyber-navy/20 flex items-center justify-center hover:bg-cyber-cyan/10 hover:box-glow-cyan transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5 text-text-muted group-hover:text-cyber-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a 
                    href="https://t.me/wispagpt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-14 h-14 rounded-lg cyber-border-cyan bg-cyber-navy/20 flex items-center justify-center hover:bg-cyber-cyan/10 hover:box-glow-cyan transition-all duration-300"
                    aria-label="Telegram"
                  >
                    <svg className="w-5 h-5 text-text-muted group-hover:text-cyber-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.78-1.36 5.019-.168.525-.5.7-.818.716-.696.063-1.225-.46-1.9-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z"/>
                    </svg>
                  </a>

                  {/* Discord */}
                  <a 
                    href="https://discord.gg/wispagpt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-14 h-14 rounded-lg cyber-border-cyan bg-cyber-navy/20 flex items-center justify-center hover:bg-cyber-cyan/10 hover:box-glow-cyan transition-all duration-300"
                    aria-label="Discord"
                  >
                    <svg className="w-5 h-5 text-text-muted group-hover:text-cyber-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-cyber-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-text-muted">© 2025 WispAGPT. All rights reserved.</p>
              <p className="flex items-center gap-3 text-base">
                <span className="text-cyber-magenta font-semibold">Powered by</span>
                <span className="text-cyber-green font-bold text-glow-green tracking-wide">MegaETH</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

