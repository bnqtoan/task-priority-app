import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { createDB, type Env } from "../lib/db";
import { apiKeys, users } from "../../db/schema";
import type { AccessUser } from "./access";

type Variables = {
  user: AccessUser;
  authMethod: "api-key" | "cloudflare-access";
};

/**
 * API Key Authentication Middleware
 * Supports dual authentication: API keys (Bearer tokens) and Cloudflare Access
 */
export const apiKeyAuthMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const env = c.env;
  const authHeader = c.req.header("Authorization");

  // Try API Key authentication first
  if (authHeader?.startsWith("Bearer task_")) {
    const apiKey = authHeader.substring(7); // Remove "Bearer "

    // Validate API key format: task_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars after prefix)
    if (!apiKey.match(/^task_(live|test)_[a-zA-Z0-9]{40}$/)) {
      return c.json({ error: "Invalid API key format" }, 401);
    }

    try {
      const db = createDB(env);
      if (!db) {
        throw new Error("Database not available");
      }

      // Hash the API key using Web Crypto API (compatible with Cloudflare Workers)
      const keyHash = await hashApiKey(apiKey);

      // Look up API key in database
      const apiKeyRecord = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.keyHash, keyHash))
        .get();

      if (!apiKeyRecord) {
        return c.json({ error: "Invalid API key" }, 401);
      }

      // Check expiration
      if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
        return c.json({ error: "API key expired" }, 401);
      }

      // Get associated user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, apiKeyRecord.userId))
        .get();

      if (!user) {
        return c.json({ error: "User not found" }, 401);
      }

      // Update last used timestamp and request count
      await db
        .update(apiKeys)
        .set({
          lastUsedAt: new Date(),
          requestCount: (apiKeyRecord.requestCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(apiKeys.id, apiKeyRecord.id));

      // Attach user to context
      c.set("user", {
        id: user.id,
        email: user.email,
        name: user.name,
      });
      c.set("authMethod", "api-key");

      return next();
    } catch (error) {
      console.error("API key authentication error:", error);
      return c.json({ error: "Authentication failed" }, 500);
    }
  }

  // Fall back to Cloudflare Access authentication
  let email = c.req.header("CF-Access-Authenticated-User-Email");
  let name = c.req.header("CF-Access-Authenticated-User-Name");

  // For local development, use mock headers
  if (env.NODE_ENV === "development" && !email) {
    email = "dev@example.com";
    name = "Dev User";
  }

  // For demo mode, use demo user
  if (env.NODE_ENV === "demo" && !email) {
    email = "demo@taskpriority.app";
    name = "Demo User";
  }

  if (!email) {
    return c.json({ error: "Unauthorized - No valid authentication method" }, 401);
  }

  try {
    let user: AccessUser;

    if (env.NODE_ENV === "demo") {
      // For demo mode, use a static demo user
      user = {
        id: 1,
        email: "demo@taskpriority.app",
        name: "Demo User",
      };
    } else {
      // For production/development, use database
      const db = createDB(env);
      if (!db) {
        throw new Error("Database not available");
      }

      // Find or create user
      let dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();

      if (!dbUser) {
        // Auto-create user on first access
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            name: name || email.split("@")[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        dbUser = newUser;
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      };
    }

    // Attach user to context
    c.set("user", user);
    c.set("authMethod", "cloudflare-access");

    await next();
  } catch (error) {
    console.error("Cloudflare Access authentication error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

/**
 * Hash API key using SHA-256 (Web Crypto API - Cloudflare Workers compatible)
 */
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Generate a new API key
 */
export async function generateApiKey(
  prefix: "live" | "test" = "live"
): Promise<{ key: string; hash: string; prefix: string }> {
  // Generate 40 random characters
  const randomBytes = new Uint8Array(30); // 30 bytes = 40 chars in base62
  crypto.getRandomValues(randomBytes);

  // Convert to base62 (alphanumeric)
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let key = "";
  for (let i = 0; i < 40; i++) {
    key += chars[randomBytes[i % 30] % chars.length];
  }

  const fullKey = `task_${prefix}_${key}`;
  const hash = await hashApiKey(fullKey);
  const keyPrefix = `task_${key.substring(0, 8)}`;

  return {
    key: fullKey,
    hash,
    prefix: keyPrefix,
  };
}
