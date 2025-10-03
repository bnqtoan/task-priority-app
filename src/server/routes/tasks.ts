import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createDB, type Env } from "../lib/db";
import { accessMiddleware, type AccessUser } from "../middleware/access";
import { tasks, timeEntries } from "../../db/schema";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../../utils/validation";

type Variables = {
  user: AccessUser;
};

const tasksRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all task routes
tasksRouter.use("*", accessMiddleware);

// Helper function to convert date strings to Date objects
function convertTaskDates(task: any) {
  return {
    ...task,
    deadline: task.deadline ? new Date(task.deadline) : null,
    completedAt: task.completedAt ? new Date(task.completedAt) : null,
    focusStartedAt: task.focusStartedAt ? new Date(task.focusStartedAt) : null,
    pauseStartTime: task.pauseStartTime ? new Date(task.pauseStartTime) : null,
    lastCompletedDate: task.lastCompletedDate ? new Date(task.lastCompletedDate) : null,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
  };
}

// GET /api/tasks - List all tasks for user
tasksRouter.get("/", zValidator("query", taskQuerySchema), async (c) => {
  // For demo mode, return empty array since tasks are stored in localStorage
  if (c.env.NODE_ENV === "demo") {
    return c.json({ tasks: [] });
  }

  const { status = "active", timeBlock, limit = 50 } = c.req.valid("query");
  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    const conditions = [eq(tasks.userId, user.id)];

    // Apply filters
    if (status !== undefined) {
      conditions.push(eq(tasks.status, status));
    }

    if (timeBlock && timeBlock !== "all") {
      conditions.push(eq(tasks.timeBlock, timeBlock));
    }

    const userTasks = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .limit(limit)
      .all();

    // Fetch time entries for all tasks
    const taskIds = userTasks.map((t) => t.id);
    const entries =
      taskIds.length > 0
        ? await db
            .select()
            .from(timeEntries)
            .where(eq(timeEntries.userId, user.id))
            .all()
        : [];

    // Group time entries by task
    const entriesByTask = entries.reduce(
      (acc, entry) => {
        if (!acc[entry.taskId]) acc[entry.taskId] = [];
        acc[entry.taskId].push(entry);
        return acc;
      },
      {} as Record<number, typeof entries>,
    );

    // Attach time entries to tasks and parse subtasks JSON
    const tasksWithEntries = userTasks.map((task) => ({
      ...task,
      timeEntries: entriesByTask[task.id] || [],
      subtasks: task.subtasks ? JSON.parse(task.subtasks as string) : [],
      // Convert date strings to Date objects for frontend compatibility
      deadline: task.deadline ? new Date(task.deadline) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null,
      focusStartedAt: task.focusStartedAt ? new Date(task.focusStartedAt) : null,
      pauseStartTime: task.pauseStartTime ? new Date(task.pauseStartTime) : null,
      lastCompletedDate: task.lastCompletedDate ? new Date(task.lastCompletedDate) : null,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));

    return c.json({ tasks: tasksWithEntries });
  } catch (error) {
    console.error("Get tasks error:", error);
    return c.json({ error: "Failed to fetch tasks" }, 500);
  }
});

// POST /api/tasks - Create new task
tasksRouter.post("/", zValidator("json", createTaskSchema), async (c) => {
  // For demo mode, return a mock task since tasks are stored in localStorage
  if (c.env.NODE_ENV === "demo") {
    const taskData = c.req.valid("json");
    const mockTask = {
      id: Date.now(),
      ...taskData,
      userId: 1,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return c.json({ task: mockTask }, 201);
  }

  const taskData = c.req.valid("json");
  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    // Serialize subtasks if present
    const dataToInsert: any = { ...taskData };
    if (dataToInsert.subtasks) {
      dataToInsert.subtasks = JSON.stringify(dataToInsert.subtasks);
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        ...dataToInsert,
        userId: user.id,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    // Parse subtasks back and convert dates
    const taskWithParsedData = {
      ...newTask,
      subtasks: newTask.subtasks ? JSON.parse(newTask.subtasks as string) : [],
    };

    return c.json({ task: convertTaskDates(taskWithParsedData) }, 201);
  } catch (error) {
    console.error("Create task error:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// GET /api/tasks/:id - Get single task
tasksRouter.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid task ID" }, 400);
  }

  // For demo mode, return a mock task
  if (c.env.NODE_ENV === "demo") {
    return c.json({ error: "Task not found" }, 404);
  }

  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .get();

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    // Parse subtasks JSON and convert date strings to Date objects
    const taskWithSubtasks = {
      ...task,
      subtasks: task.subtasks ? JSON.parse(task.subtasks as string) : [],
      deadline: task.deadline ? new Date(task.deadline) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null,
      focusStartedAt: task.focusStartedAt ? new Date(task.focusStartedAt) : null,
      pauseStartTime: task.pauseStartTime ? new Date(task.pauseStartTime) : null,
      lastCompletedDate: task.lastCompletedDate ? new Date(task.lastCompletedDate) : null,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    };

    return c.json(taskWithSubtasks);
  } catch (error) {
    console.error("Get task error:", error);
    return c.json({ error: "Failed to fetch task" }, 500);
  }
});

// PUT /api/tasks/:id - Update task
tasksRouter.put("/:id", zValidator("json", updateTaskSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const updateData = c.req.valid("json");

  if (isNaN(id)) {
    return c.json({ error: "Invalid task ID" }, 400);
  }

  // For demo mode, return success without database operations
  if (c.env.NODE_ENV === "demo") {
    const mockTask = {
      id,
      ...updateData,
      userId: 1,
      updatedAt: new Date(),
    };
    return c.json({ task: mockTask });
  }

  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    // Convert string dates to Date objects if present
    const sanitizedData: any = { ...updateData };
    if (
      sanitizedData.lastCompletedDate &&
      typeof sanitizedData.lastCompletedDate === "string"
    ) {
      sanitizedData.lastCompletedDate = new Date(
        sanitizedData.lastCompletedDate,
      );
    }
    if (
      sanitizedData.focusStartedAt &&
      typeof sanitizedData.focusStartedAt === "string"
    ) {
      sanitizedData.focusStartedAt = new Date(sanitizedData.focusStartedAt);
    }
    if (
      sanitizedData.pauseStartTime &&
      typeof sanitizedData.pauseStartTime === "string"
    ) {
      sanitizedData.pauseStartTime = new Date(sanitizedData.pauseStartTime);
    }
    if (sanitizedData.deadline && typeof sanitizedData.deadline === "string") {
      sanitizedData.deadline = new Date(sanitizedData.deadline);
    }
    // Serialize subtasks array to JSON string for database storage
    if (sanitizedData.subtasks) {
      sanitizedData.subtasks = JSON.stringify(sanitizedData.subtasks);
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...sanitizedData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!updatedTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    // Parse subtasks back from JSON string and convert dates
    const taskWithParsedData = {
      ...updatedTask,
      subtasks: updatedTask.subtasks ? JSON.parse(updatedTask.subtasks as string) : [],
    };

    return c.json({ task: convertTaskDates(taskWithParsedData) });
  } catch (error) {
    console.error("Update task error:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// DELETE /api/tasks/:id - Delete task
tasksRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid task ID" }, 400);
  }

  // For demo mode, return success response
  if (c.env.NODE_ENV === "demo") {
    return c.json({ success: true });
  }

  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    const [deletedTask] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!deletedTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

// PATCH /api/tasks/:id/complete - Mark task as completed
tasksRouter.patch("/:id/complete", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid task ID" }, 400);
  }

  // For demo mode, return mock completed task
  if (c.env.NODE_ENV === "demo") {
    const mockTask = {
      id,
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    };
    return c.json({ task: mockTask });
  }

  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    const [completedTask] = await db
      .update(tasks)
      .set({
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!completedTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ task: convertTaskDates(completedTask) });
  } catch (error) {
    console.error("Complete task error:", error);
    return c.json({ error: "Failed to complete task" }, 500);
  }
});

// PATCH /api/tasks/:id/focus/start - Start focus session
tasksRouter.patch("/:id/focus/start", async (c) => {
  // For demo mode, return a mock response since data is in localStorage
  if (c.env.NODE_ENV === "demo") {
    return c.json({
      task: {
        id: parseInt(c.req.param("id")),
        isInFocus: true,
        focusStartedAt: new Date(),
      },
    });
  }

  const id = parseInt(c.req.param("id"));
  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    // First, find and stop any other active focus sessions
    const activeFocusTasks = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, user.id), eq(tasks.isInFocus, true)))
      .all();

    // End each active session (except the one we're starting)
    for (const task of activeFocusTasks) {
      if (task.id !== id && task.focusStartedAt) {
        // Calculate elapsed time, accounting for paused time
        const wallTime = Math.floor(
          (new Date().getTime() - new Date(task.focusStartedAt).getTime()) /
            1000,
        );
        const pausedSeconds = task.pausedTime || 0;
        const elapsed = Math.max(0, wallTime - pausedSeconds);
        const durationMinutes = Math.ceil(elapsed / 60);

        const now = new Date();
        const startTime = new Date(now.getTime() - durationMinutes * 60000);

        // Create time entry for the stopped session
        await db.insert(timeEntries).values({
          id: `${task.id}-${Date.now()}`,
          userId: user.id,
          taskId: task.id,
          startTime: startTime,
          endTime: now,
          duration: durationMinutes,
          type: "focus",
          createdAt: now,
          updatedAt: now,
        });

        // Update the task
        await db
          .update(tasks)
          .set({
            isInFocus: false,
            focusStartedAt: null,
            actualTime: (task.actualTime || 0) + durationMinutes,
            // Clear pause state and target duration
            isPaused: false,
            pausedTime: 0,
            pauseStartTime: null,
            targetDuration: null,
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, task.id))
          .execute();
      }
    }

    // Now start the new focus session
    const [updatedTask] = await db
      .update(tasks)
      .set({
        isInFocus: true,
        focusStartedAt: new Date(),
        // Clear any previous pause state and target duration when starting new session
        isPaused: false,
        pausedTime: 0,
        pauseStartTime: null,
        targetDuration: null,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!updatedTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ task: convertTaskDates(updatedTask) });
  } catch (error) {
    console.error("Start focus session error:", error);
    return c.json({ error: "Failed to start focus session" }, 500);
  }
});

// PATCH /api/tasks/:id/focus/end - End focus session
tasksRouter.patch("/:id/focus/end", async (c) => {
  // For demo mode, return a mock response since data is in localStorage
  if (c.env.NODE_ENV === "demo") {
    const { duration } = await c.req.json();
    return c.json({
      task: {
        id: parseInt(c.req.param("id")),
        isInFocus: false,
        focusStartedAt: null,
        actualTime: duration,
      },
    });
  }

  const id = parseInt(c.req.param("id"));
  const user = c.get("user");
  const db = createDB(c.env);
  const { duration } = await c.req.json();

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    // Get current task to add to existing actualTime
    const [currentTask] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .limit(1);

    if (!currentTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const now = new Date();
    const startTime = new Date(now.getTime() - duration * 60000);

    // Create time entry in timeEntries table
    await db.insert(timeEntries).values({
      id: `${id}-${Date.now()}`,
      userId: user.id,
      taskId: id,
      startTime: startTime,
      endTime: now,
      duration: duration,
      type: "focus",
      createdAt: now,
      updatedAt: now,
    });

    // Update task
    const [updatedTask] = await db
      .update(tasks)
      .set({
        isInFocus: false,
        focusStartedAt: null,
        actualTime: (currentTask.actualTime || 0) + duration,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    return c.json({ task: convertTaskDates(updatedTask) });
  } catch (error) {
    console.error("End focus session error:", error);
    return c.json({ error: "Failed to end focus session" }, 500);
  }
});

// POST /api/tasks/:id/time - Add time entry
tasksRouter.post("/:id/time", async (c) => {
  // For demo mode, return a mock response since data is in localStorage
  if (c.env.NODE_ENV === "demo") {
    const { duration } = await c.req.json();
    return c.json({
      task: {
        id: parseInt(c.req.param("id")),
        actualTime: duration,
      },
    });
  }

  const id = parseInt(c.req.param("id"));
  const user = c.get("user");
  const db = createDB(c.env);
  const { duration, type = "regular" } = await c.req.json();

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    // Get current task to add to existing actualTime
    const [currentTask] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .limit(1);

    if (!currentTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const now = new Date();
    const startTime = new Date(now.getTime() - duration * 60000);

    // Create time entry in timeEntries table
    await db.insert(timeEntries).values({
      id: `${id}-${Date.now()}`,
      userId: user.id,
      taskId: id,
      startTime: startTime,
      endTime: now,
      duration: duration,
      type: type,
      createdAt: now,
      updatedAt: now,
    });

    // Update task
    const [updatedTask] = await db
      .update(tasks)
      .set({
        actualTime: (currentTask.actualTime || 0) + duration,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    return c.json({ task: convertTaskDates(updatedTask) });
  } catch (error) {
    console.error("Add time entry error:", error);
    return c.json({ error: "Failed to add time entry" }, 500);
  }
});

export default tasksRouter;
