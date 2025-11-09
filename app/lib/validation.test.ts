/**
 * Unit tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import { validateEmail, validateOrigin, getClientIP } from './validation';
import { NextRequest } from 'next/server';

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@example.com');
  });

  it('should normalize email to lowercase', () => {
    const result = validateEmail('USER@EXAMPLE.COM');
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@example.com');
  });

  it('should trim whitespace', () => {
    const result = validateEmail('  user@example.com  ');
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@example.com');
  });

  it('should reject invalid email formats', () => {
    const invalid = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@example',
      '',
    ];

    invalid.forEach((email) => {
      const result = validateEmail(email);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  it('should reject emails over 254 characters', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const result = validateEmail(longEmail);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too long');
  });
});

describe('validateOrigin', () => {
  it('should allow requests with matching origin and host', () => {
    const request = new NextRequest('https://example.com/api/subscribe', {
      headers: {
        origin: 'https://example.com',
        host: 'example.com',
      },
    });

    expect(validateOrigin(request)).toBe(true);
  });

  it('should reject requests with mismatched origin and host', () => {
    const request = new NextRequest('https://example.com/api/subscribe', {
      headers: {
        origin: 'https://evil.com',
        host: 'example.com',
      },
    });

    expect(validateOrigin(request)).toBe(false);
  });

  it('should allow same-origin requests without origin header', () => {
    const request = new NextRequest('https://example.com/api/subscribe', {
      headers: {
        host: 'example.com',
      },
    });

    expect(validateOrigin(request)).toBe(true);
  });

  it('should handle port numbers in origin', () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      headers: {
        origin: 'http://localhost:3000',
        host: 'localhost:3000',
      },
    });

    expect(validateOrigin(request)).toBe(true);
  });

  it('should reject requests with different ports', () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      headers: {
        origin: 'http://localhost:4000',
        host: 'localhost:3000',
      },
    });

    expect(validateOrigin(request)).toBe(false);
  });
});

describe('getClientIP', () => {
  it('should extract IP from x-forwarded-for', () => {
    const request = new NextRequest('https://example.com', {
      headers: {
        'x-forwarded-for': '203.0.113.1, 198.51.100.1',
      },
    });

    expect(getClientIP(request)).toBe('203.0.113.1');
  });

  it('should extract IP from x-real-ip', () => {
    const request = new NextRequest('https://example.com', {
      headers: {
        'x-real-ip': '203.0.113.2',
      },
    });

    expect(getClientIP(request)).toBe('203.0.113.2');
  });

  it('should extract IP from cf-connecting-ip', () => {
    const request = new NextRequest('https://example.com', {
      headers: {
        'cf-connecting-ip': '203.0.113.3',
      },
    });

    expect(getClientIP(request)).toBe('203.0.113.3');
  });

  it('should return default IP when no headers present', () => {
    const request = new NextRequest('https://example.com');
    expect(getClientIP(request)).toBe('127.0.0.1');
  });

  it('should prefer x-forwarded-for over others', () => {
    const request = new NextRequest('https://example.com', {
      headers: {
        'x-forwarded-for': '203.0.113.1',
        'x-real-ip': '203.0.113.2',
        'cf-connecting-ip': '203.0.113.3',
      },
    });

    expect(getClientIP(request)).toBe('203.0.113.1');
  });
});

