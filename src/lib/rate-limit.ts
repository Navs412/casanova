// Simple in-memory rate limiter for edge functions
// Resets on cold start — sufficient for early beta

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetIn: record.resetAt - now };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetIn: record.resetAt - now };
}
