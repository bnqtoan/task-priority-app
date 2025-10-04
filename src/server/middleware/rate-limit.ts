import { createMiddleware } from "hono/factory";
import type { Env } from "../lib/db";
import type { AccessUser } from "./access";

type Variables = {
  user: AccessUser;
  authMethod?: "api-key" | "cloudflare-access";
};

/**
 * Rate Limiting Middleware using Cloudflare Workers Rate Limiting API
 *
 * Limits:
 * - API Key auth: 1000 requests per hour per user
 * - Cloudflare Access auth: 10000 requests per hour per user (more permissive for web UI)
 */
export const rateLimitMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  // Skip rate limiting in development mode
  if (c.env.NODE_ENV === "development" || c.env.NODE_ENV === "demo") {
    return next();
  }

  const user = c.get("user");
  const authMethod = c.get("authMethod");

  // Determine rate limit based on auth method
  const limit = authMethod === "api-key" ? 1000 : 10000;
  const windowSeconds = 3600; // 1 hour

  try {
    // Use Cloudflare Workers Rate Limiting API (if available)
    if (c.env.RATE_LIMITER) {
      const identifier = `user:${user.id}:${authMethod || "access"}`;

      const rateLimitResult = await c.env.RATE_LIMITER.limit({
        key: identifier,
      });

      if (!rateLimitResult.success) {
        return c.json(
          {
            error: "Rate limit exceeded",
            limit,
            windowSeconds,
            retryAfter: Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ),
          },
          429,
          {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          }
        );
      }

      // Add rate limit headers
      c.header("X-RateLimit-Limit", limit.toString());
      c.header("X-RateLimit-Remaining", rateLimitResult.remaining?.toString() || "");
      c.header("X-RateLimit-Reset", new Date(rateLimitResult.resetTime).toISOString());
    }

    return next();
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Continue on rate limit errors to avoid blocking requests
    return next();
  }
});

/**
 * Simple in-memory rate limiter for local development/testing
 * Not suitable for production (no persistence, no distribution)
 */
class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map();

  async check(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || record.resetAt < now) {
      // New window
      this.requests.set(key, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  }

  async reset(key: string): Promise<void> {
    this.requests.delete(key);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (record.resetAt < now) {
        this.requests.delete(key);
      }
    }
  }
}

// Export for testing
export const simpleRateLimiter = new SimpleRateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => simpleRateLimiter.cleanup(), 5 * 60 * 1000);
}
