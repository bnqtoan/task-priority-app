import { createMiddleware } from 'hono/factory';
import { eq } from 'drizzle-orm';
import { createDB, type Env } from '../lib/db';
import { users } from '../../db/schema';

export interface AccessUser {
  id: number;
  email: string;
  name: string | null;
}

type Variables = {
  user: AccessUser;
};

export const accessMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const env = c.env;
  const db = createDB(env);

  // Get headers from Cloudflare Access
  let email = c.req.header('CF-Access-Authenticated-User-Email');
  let name = c.req.header('CF-Access-Authenticated-User-Name');

  // For local development, use mock headers
  if (env.NODE_ENV === 'development' && !email) {
    email = 'dev@example.com';
    name = 'Dev User';
  }

  if (!email) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Find or create user
    let user = await db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
      // Auto-create user on first access
      const [newUser] = await db.insert(users).values({
        email,
        name: name || email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      user = newUser;
    }

    // Attach user to context
    c.set('user', user);

    await next();
  } catch (error) {
    console.error('Access middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

export const corsMiddleware = createMiddleware(async (c, next) => {
  await next();

  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, CF-Access-Authenticated-User-Email, CF-Access-Authenticated-User-Name');

  if (c.req.method === 'OPTIONS') {
    return c.text('', 200);
  }
});