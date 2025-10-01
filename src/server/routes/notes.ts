import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createDB, type Env } from '../lib/db';
import { accessMiddleware, type AccessUser } from '../middleware/access';
import { notes } from '../../db/schema';

type Variables = {
  user: AccessUser;
};

const notesRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all note routes
notesRouter.use('*', accessMiddleware);

// Validation schemas
const createNoteSchema = z.object({
  taskId: z.number().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['daily-log', 'task-note', 'reflection', 'idea', 'meeting']).default('task-note'),
  tags: z.array(z.string()).optional(),
  metadata: z.object({
    mood: z.enum(['great', 'good', 'neutral', 'tired', 'stressed']).optional(),
    energy: z.enum(['high', 'medium', 'low']).optional(),
    location: z.string().optional(),
    context: z.array(z.string()).optional(),
  }).optional(),
});

const updateNoteSchema = createNoteSchema.partial();

const noteQuerySchema = z.object({
  category: z.enum(['daily-log', 'task-note', 'reflection', 'idea', 'meeting']).optional(),
  taskId: z.string().transform(val => parseInt(val)).optional(),
  search: z.string().optional(),
});

// GET /api/notes - List notes for user
notesRouter.get('/', zValidator('query', noteQuerySchema), async (c) => {
  const { category, taskId, search } = c.req.valid('query');
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const conditions = [eq(notes.userId, user.id)];

    // Apply filters
    if (category) {
      conditions.push(eq(notes.category, category));
    }

    if (taskId !== undefined) {
      conditions.push(eq(notes.taskId, taskId));
    }

    let query = db.select().from(notes).where(and(...conditions));

    const userNotes = await query.all();

    // Apply search filter in memory (SQLite text search is limited)
    let filteredNotes = userNotes;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNotes = userNotes.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        (note.tags && JSON.parse(note.tags as string).some((tag: string) =>
          tag.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Parse JSON fields (timestamps are already Date objects from Drizzle)
    const parsedNotes = filteredNotes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags as string) : [],
      metadata: note.metadata ? JSON.parse(note.metadata as string) : undefined,
    }));

    // Sort by most recent first
    parsedNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return c.json({ notes: parsedNotes });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return c.json({ error: 'Failed to fetch notes' }, 500);
  }
});

// GET /api/notes/:id - Get a single note
notesRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const [note] = await db.select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .limit(1)
      .all();

    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }

    // Parse JSON fields (timestamps are already Date objects from Drizzle)
    const parsedNote = {
      ...note,
      tags: note.tags ? JSON.parse(note.tags as string) : [],
      metadata: note.metadata ? JSON.parse(note.metadata as string) : undefined,
    };

    return c.json({ note: parsedNote });
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return c.json({ error: 'Failed to fetch note' }, 500);
  }
});

// POST /api/notes - Create a new note
notesRouter.post('/', zValidator('json', createNoteSchema), async (c) => {
  const noteData = c.req.valid('json');
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    const now = new Date();

    const newNote = {
      userId: user.id,
      taskId: noteData.taskId || null,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category || 'task-note',
      tags: noteData.tags ? JSON.stringify(noteData.tags) : null,
      metadata: noteData.metadata ? JSON.stringify(noteData.metadata) : null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(notes).values(newNote).returning().get();

    // Parse JSON fields (timestamps are already Date objects from Drizzle)
    const parsedNote = {
      ...result,
      tags: result.tags ? JSON.parse(result.tags as string) : [],
      metadata: result.metadata ? JSON.parse(result.metadata as string) : undefined,
    };

    return c.json({ note: parsedNote }, 201);
  } catch (error) {
    console.error('Failed to create note:', error);
    return c.json({ error: 'Failed to create note' }, 500);
  }
});

// PUT /api/notes/:id - Update a note
notesRouter.put('/:id', zValidator('json', updateNoteSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const noteData = c.req.valid('json');
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    // Verify note exists and belongs to user
    const [existingNote] = await db.select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .limit(1)
      .all();

    if (!existingNote) {
      return c.json({ error: 'Note not found' }, 404);
    }

    const now = new Date();

    const updateData: any = {
      updatedAt: now,
    };

    if (noteData.title !== undefined) updateData.title = noteData.title;
    if (noteData.content !== undefined) updateData.content = noteData.content;
    if (noteData.category !== undefined) updateData.category = noteData.category;
    if (noteData.taskId !== undefined) updateData.taskId = noteData.taskId;
    if (noteData.tags !== undefined) updateData.tags = JSON.stringify(noteData.tags);
    if (noteData.metadata !== undefined) updateData.metadata = JSON.stringify(noteData.metadata);

    const result = await db.update(notes)
      .set(updateData)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning()
      .get();

    // Parse JSON fields (timestamps are already Date objects from Drizzle)
    const parsedNote = {
      ...result,
      tags: result.tags ? JSON.parse(result.tags as string) : [],
      metadata: result.metadata ? JSON.parse(result.metadata as string) : undefined,
    };

    return c.json({ note: parsedNote });
  } catch (error) {
    console.error('Failed to update note:', error);
    return c.json({ error: 'Failed to update note' }, 500);
  }
});

// DELETE /api/notes/:id - Delete a note
notesRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const user = c.get('user');
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: 'Database not available' }, 500);
  }

  try {
    // Verify note exists and belongs to user
    const [existingNote] = await db.select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .limit(1)
      .all();

    if (!existingNote) {
      return c.json({ error: 'Note not found' }, 404);
    }

    await db.delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to delete note:', error);
    return c.json({ error: 'Failed to delete note' }, 500);
  }
});

export default notesRouter;
