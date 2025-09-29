import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createDB, type Env } from '../lib/db';
import { accessMiddleware, type AccessUser } from '../middleware/access';
import { tasks } from '../../db/schema';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../../utils/validation';

type Variables = {
  user: AccessUser;
};

const tasksRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all task routes
tasksRouter.use('*', accessMiddleware);

// GET /api/tasks - List all tasks for user
tasksRouter.get('/', zValidator('query', taskQuerySchema), async (c) => {
  // For demo mode, return empty array since tasks are stored in localStorage
  if (c.env.NODE_ENV === 'demo') {
    return c.json({ tasks: [] });
  }

  const { status = 'active', timeBlock, limit = 50 } = c.req.valid('query');
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const conditions = [eq(tasks.userId, user.id)];

    // Apply filters
    if (status !== undefined) {
      conditions.push(eq(tasks.status, status));
    }

    if (timeBlock && timeBlock !== 'all') {
      conditions.push(eq(tasks.timeBlock, timeBlock));
    }

    const userTasks = await db.select().from(tasks)
      .where(and(...conditions))
      .limit(limit)
      .all();

    return c.json({ tasks: userTasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

// POST /api/tasks - Create new task
tasksRouter.post('/', zValidator('json', createTaskSchema), async (c) => {
  // For demo mode, return a mock task since tasks are stored in localStorage
  if (c.env.NODE_ENV === 'demo') {
    const taskData = c.req.valid('json');
    const mockTask = {
      id: Date.now(),
      ...taskData,
      userId: 1,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return c.json({ task: mockTask }, 201);
  }

  const taskData = c.req.valid('json');
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const [newTask] = await db.insert(tasks).values({
      ...taskData,
      userId: user.id,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return c.json({ task: newTask }, 201);
  } catch (error) {
    console.error('Create task error:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// GET /api/tasks/:id - Get single task
tasksRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'Invalid task ID' }, 400);
  }

  // For demo mode, return a mock task
  if (c.env.NODE_ENV === 'demo') {
    return c.json({ error: 'Task not found' }, 404);
  }

  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const task = await db.select().from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .get();

    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return c.json({ error: 'Failed to fetch task' }, 500);
  }
});

// PUT /api/tasks/:id - Update task
tasksRouter.put('/:id', zValidator('json', updateTaskSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const updateData = c.req.valid('json');

  if (isNaN(id)) {
    return c.json({ error: 'Invalid task ID' }, 400);
  }

  // For demo mode, return success without database operations
  if (c.env.NODE_ENV === 'demo') {
    const mockTask = {
      id,
      ...updateData,
      userId: 1,
      updatedAt: new Date(),
    };
    return c.json({ task: mockTask });
  }

  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const [updatedTask] = await db.update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!updatedTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// DELETE /api/tasks/:id - Delete task
tasksRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const user = c.get('user');
  const db = createDB(c.env);

  if (isNaN(id)) {
    return c.json({ error: 'Invalid task ID' }, 400);
  }

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const [deletedTask] = await db.delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!deletedTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

// PATCH /api/tasks/:id/complete - Mark task as completed
tasksRouter.patch('/:id/complete', async (c) => {
  const id = parseInt(c.req.param('id'));
  const user = c.get('user');
  const db = createDB(c.env);

  if (isNaN(id)) {
    return c.json({ error: 'Invalid task ID' }, 400);
  }

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const [completedTask] = await db.update(tasks)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!completedTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ task: completedTask });
  } catch (error) {
    console.error('Complete task error:', error);
    return c.json({ error: 'Failed to complete task' }, 500);
  }
});

export default tasksRouter;