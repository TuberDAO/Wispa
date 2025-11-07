/**
 * Minimal Upstash Redis REST client
 * Works with Vercel Edge Runtime
 */

function getEnv(name: string): string | undefined {
  return process.env[name]?.trim();
}

function getCredentials(): { baseUrl: string; token: string } {
  const baseUrl =
    getEnv('UPSTASH_REDIS_REST_URL') ||
    getEnv('KV_REST_API_URL');

  const token =
    getEnv('UPSTASH_REDIS_REST_TOKEN') ||
    getEnv('KV_REST_API_TOKEN');

  if (!baseUrl || !token) {
    throw new Error(
      'Redis REST credentials missing. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL + KV_REST_API_TOKEN'
    );
  }

  return { baseUrl, token };
}

async function redisRequest(command: string, args: unknown[]): Promise<any> {
  const { baseUrl, token } = getCredentials();
  
  const response = await fetch(`${baseUrl}/${command}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error(`Redis ${command} failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

export async function rpush(key: string, value: string): Promise<number> {
  return redisRequest('rpush', [key, value]);
}

export async function lrange(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  return redisRequest('lrange', [key, start, stop]);
}

export async function llen(key: string): Promise<number> {
  return redisRequest('llen', [key]);
}

