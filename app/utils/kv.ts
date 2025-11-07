// app/utils/kv.ts
import { Redis } from '@upstash/redis';

function env(name: string) {
  return process.env[name]?.trim();
}

const url =
  env('UPSTASH_REDIS_REST_URL') || env('KV_REST_API_URL');
const token =
  env('UPSTASH_REDIS_REST_TOKEN') || env('KV_REST_API_TOKEN');

if (!url || !token) {
  throw new Error(
    'Redis env not set: expected UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN'
  );
}

export const redis = new Redis({ url, token });

