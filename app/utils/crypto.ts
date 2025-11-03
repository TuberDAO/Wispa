/**
 * Cryptographic utilities for secure hashing
 * Uses Web Crypto API (Edge Runtime compatible)
 */

/**
 * SHA-256 hash a string and return hex representation
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash PII (email, IP) with salt for privacy
 */
export async function hashPII(value: string, salt: string): Promise<string> {
  return sha256Hex(value + salt);
}

