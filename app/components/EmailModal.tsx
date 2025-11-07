'use client';

import { useState, useEffect } from 'react';
import { sanitizeEmail, isValidEmail } from '../utils/sanitize';

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  tag?: 'notify' | 'whitepaper' | 'other';
}

export default function EmailModal({ open, onClose, tag = 'notify' }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // Honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Sanitize and validate
    const sanitizedEmail = sanitizeEmail(email);
    
    if (!isValidEmail(sanitizedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // POST to same-origin API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          tag,
          company, // Honeypot field
        }),
      });

      if (response.status === 429) {
        setStatus('error');
        setMessage('Too many requests. Please try again in a minute.');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }
      
      setStatus('success');
      setMessage('Thanks — you\'re on the list.');
      setEmail('');
      setCompany('');
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 1500);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md cyber-border-cyan rounded-xl p-8 md:p-10 bg-gradient-to-br from-cyber-navy/95 to-cyber-dark/95 backdrop-blur-xl shadow-2xl box-glow-cyan animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-cyber-cyan transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <p className="terminal-text text-xs mb-3">
            <span className="terminal-bracket">[ </span>early access<span className="terminal-bracket"> ]</span>
          </p>
          <h2 className="text-3xl font-bold gradient-text-cyan mb-3">
            {tag === 'whitepaper' ? 'Request Whitepaper' : 'Join Early Access'}
          </h2>
          <p className="text-text-secondary text-base">
            Experience AI with P.O.P (Proof Of Privacy).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field - visually hidden but in DOM */}
          <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
            <label htmlFor="company">Company (leave blank)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
              className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/50 transition-all duration-200"
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              maxLength={254}
            />
            <p className="text-xs text-text-muted mt-2">
              We'll only email you about WispAGPT updates. You can opt out anytime.
            </p>
          </div>

          {message && (
            <div className={`text-sm p-4 rounded-lg ${
              status === 'success' 
                ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30' 
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-6 py-4 bg-cyber-cyan text-cyber-dark text-base font-semibold rounded-lg hover:bg-cyber-cyanGlow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 animate-pulse-glow"
          >
            {status === 'loading' ? 'Submitting...' : 'Join Waitlist'}
          </button>
        </form>

        <p className="text-xs text-text-muted mt-6 text-center font-mono">
          <span className="terminal-bracket">[ </span>no spam. privacy first.<span className="terminal-bracket"> ]</span>
        </p>
      </div>
    </div>
  );
}

