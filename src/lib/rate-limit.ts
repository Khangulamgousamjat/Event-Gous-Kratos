import { headers } from 'next/headers';

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

const globalStore = globalThis as typeof globalThis & {
  __kratosRateLimitStore?: Map<string, RateLimitRecord>;
};

const rateLimitStore =
  globalStore.__kratosRateLimitStore ?? (globalStore.__kratosRateLimitStore = new Map<string, RateLimitRecord>());

function cleanupExpiredEntries(now: number) {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function getStoreKey({ namespace, identifier }: Pick<RateLimitOptions, 'namespace' | 'identifier'>) {
  return `${namespace}:${identifier}`;
}

export function applyRateLimit({ namespace, identifier, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const storeKey = getStoreKey({ namespace, identifier });
  const existing = rateLimitStore.get(storeKey);

  if (!existing || existing.resetAt <= now) {
    const nextRecord = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(storeKey, nextRecord);
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
    };
  }

  existing.count += 1;
  rateLimitStore.set(storeKey, existing);

  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
  };
}

export function assertRateLimit(options: RateLimitOptions) {
  const result = applyRateLimit(options);

  if (!result.allowed) {
    throw new Error(`Too many requests. Please wait ${result.retryAfterSeconds} seconds and try again.`);
  }

  return result;
}

function normalizeForwardedFor(value: string | null): string | null {
  if (!value) return null;

  const first = value.split(',')[0]?.trim();
  return first || null;
}

export function getRequestIp(request: Request): string {
  return (
    normalizeForwardedFor(request.headers.get('x-forwarded-for')) ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export async function getActionIp(): Promise<string> {
  const headerStore = await headers();

  return (
    normalizeForwardedFor(headerStore.get('x-forwarded-for')) ||
    headerStore.get('x-real-ip') ||
    headerStore.get('cf-connecting-ip') ||
    'unknown'
  );
}
