import type { NextFunction, Request, Response } from "express";

/**
 * Fixed-window rate limiter for the public API.
 *
 * The key is `req.ip`, which Express derives from the socket address once
 * `trust proxy` is configured. Never trust a raw `X-Forwarded-For` header here:
 * a client can prepend its own value and choose its own bucket.
 *
 * In-memory by design for a single-instance deployment. Swap the Map for Redis
 * if the portal is ever scaled horizontally.
 */
interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export function rateLimit(options: { scope: string; max: number; windowMs: number }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${options.scope}:${req.ip ?? "unknown"}`;
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    if (existing.count >= options.max) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({ success: false, error: "Too many requests. Please try again shortly." });
      return;
    }

    existing.count += 1;
    next();
  };
}

/** Drop expired windows so the Map cannot grow without bound. */
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref?.();
