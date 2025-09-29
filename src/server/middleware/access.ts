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

  // Get headers from Cloudflare Access
  let email = c.req.header('CF-Access-Authenticated-User-Email');
  let name = c.req.header('CF-Access-Authenticated-User-Name');

  // For local development, use mock headers
  if (env.NODE_ENV === 'development' && !email) {
    email = 'dev@example.com';
    name = 'Dev User';
  }

  // For demo mode, use demo user
  if (env.NODE_ENV === 'demo' && !email) {
    email = 'demo@taskpriority.app';
    name = 'Demo User';
  }

  if (!email) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    let user: AccessUser;

    if (env.NODE_ENV === 'demo') {
      // For demo mode, use a static demo user
      user = {
        id: 1,
        email: 'demo@taskpriority.app',
        name: 'Demo User'
      };
    } else {
      // For production/development, use database
      const db = createDB(env);
      if (!db) {
        throw new Error('Database not available');
      }

      // Find or create user
      let dbUser = await db.select().from(users).where(eq(users.email, email)).get();

      if (!dbUser) {
        // Auto-create user on first access
        const [newUser] = await db.insert(users).values({
          email,
          name: name || email.split('@')[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        dbUser = newUser;
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name
      };
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