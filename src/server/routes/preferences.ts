import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createDB, type Env } from '../lib/db';
import { accessMiddleware, type AccessUser } from '../middleware/access';
import { userPreferences } from '../../db/schema';
import { updatePreferencesSchema } from '../../utils/validation';

type Variables = {
  user: AccessUser;
};

const preferencesRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all preferences routes
preferencesRouter.use('*', accessMiddleware);

// GET /api/preferences - Get user preferences
preferencesRouter.get('/', async (c) => {
  // For demo mode, return default preferences
  if (c.env.NODE_ENV === 'demo') {
    return c.json({
      id: 1,
      userId: 1,
      preferredMethod: 'hybrid',
      defaultTimeBlock: 'all',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    let preferences = await db.select().from(userPreferences)
      .where(eq(userPreferences.userId, user.id))
      .get();

    // Create default preferences if not found
    if (!preferences) {
      const [newPreferences] = await db.insert(userPreferences).values({
        userId: user.id,
        preferredMethod: 'hybrid',
        defaultTimeBlock: 'all',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      preferences = newPreferences;
    }

    return c.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
});

// PUT /api/preferences - Update user preferences
preferencesRouter.put('/', zValidator('json', updatePreferencesSchema), async (c) => {
  const updateData = c.req.valid('json');
  
  // For demo mode, return updated preferences without saving to database
  if (c.env.NODE_ENV === 'demo') {
    return c.json({
      id: 1,
      userId: 1,
      preferredMethod: updateData.preferredMethod || 'hybrid',
      defaultTimeBlock: updateData.defaultTimeBlock || 'all',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    // Check if preferences exist
    const existingPreferences = await db.select().from(userPreferences)
      .where(eq(userPreferences.userId, user.id))
      .get();

    let updatedPreferences;

    if (existingPreferences) {
      // Update existing preferences
      [updatedPreferences] = await db.update(userPreferences)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, user.id))
        .returning();
    } else {
      // Create new preferences
      [updatedPreferences] = await db.insert(userPreferences).values({
        userId: user.id,
        preferredMethod: updateData.preferredMethod || 'hybrid',
        defaultTimeBlock: updateData.defaultTimeBlock || 'all',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
    }

    return c.json(updatedPreferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    return c.json({ error: 'Failed to update preferences' }, 500);
  }
});

export default preferencesRouter;