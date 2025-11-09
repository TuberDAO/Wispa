/**
 * Request validation utilities using Zod
 * Includes email validation and CSRF/origin checks
 */

import { z } from 'zod';
import type { NextRequest } from 'next/server';

/**
 * Email validation schema
 * - Must be valid email format
 * - Normalized to lowercase
 * - Max 254 characters (RFC 5321)
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(254, 'Email address too long')
  .toLowerCase()
  .transform((email) => email.trim());

/**
 * Subscribe request schema
 */
export const subscribeRequestSchema = z.object({
  email: emailSchema,
  tag: z.enum(['notify', 'whitepaper']).optional(),
  company: z.string().optional(), // Honeypot field
});

export type SubscribeRequest = z.infer<typeof subscribeRequestSchema>;

/**
 * Validate email address
 */
export function validateEmail(email: string): { valid: boolean; email?: string; error?: string } {
  try {
    const validated = emailSchema.parse(email);
    return { valid: true, email: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message || 'Invalid email' };
    }
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * CSRF Protection: Validate request origin matches expected host
 * 
 * Checks:
 * 1. If NEXT_PUBLIC_SITE_ORIGIN is set, require exact match
 * 2. Otherwise, require Origin header to match Host header
 * 3. For same-origin requests, Origin might be null (allowed)
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  // Get expected origin from env if configured
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  
  if (expectedOrigin) {
    // Strict: require exact match with configured origin
    if (!origin) return false;
    
    try {
      const originUrl = new URL(origin);
      const expectedUrl = new URL(expectedOrigin);
      return originUrl.origin === expectedUrl.origin;
    } catch {
      return false;
    }
  }
  
  // Fallback: validate Origin matches Host
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host;
      return originHost === host;
    } catch {
      return false;
    }
  }
  
  // Allow same-origin requests where Origin is null/missing
  // This happens for same-site navigation
  return true;
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  // Check forwarded headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Cloudflare
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  return '127.0.0.1';
}

