import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createDB, type Env } from "../lib/db";
import { accessMiddleware, type AccessUser } from "../middleware/access";
import { tasks } from "../../db/schema";
import { recommendationQuerySchema } from "../../utils/validation";
import { getDecisionRecommendation } from "../../utils/algorithms";
import type {
  OverviewStats,
  TaskRecommendations,
  Task,
} from "../../utils/types";

type Variables = {
  user: AccessUser;
};

const statsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all stats routes
statsRouter.use("*", accessMiddleware);

// GET /api/stats/overview - Get overview stats
statsRouter.get("/overview", async (c) => {
  // For demo mode, return empty stats since data is in localStorage
  if (c.env.NODE_ENV === "demo") {
    const emptyStats: OverviewStats = {
      decisions: {
        do: { count: 0, time: 0 },
        delegate: { count: 0, time: 0 },
        delay: { count: 0, time: 0 },
        delete: { count: 0, time: 0 },
      },
      timeBlocks: {
        deep: { count: 0, time: 0 },
        collaborative: { count: 0, time: 0 },
        quick: { count: 0, time: 0 },
        systematic: { count: 0, time: 0 },
      },
      types: {
        revenue: { count: 0, time: 0 },
        growth: { count: 0, time: 0 },
        operations: { count: 0, time: 0 },
        strategic: { count: 0, time: 0 },
        personal: { count: 0, time: 0 },
      },
      totalTasks: 0,
      totalTime: 0,
    };
    return c.json(emptyStats);
  }

  const user = c.get("user");
  const db = createDB(c.env);

  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  try {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, user.id))
      .all();

    // Calculate decision stats
    const decisions = {
      do: { count: 0, time: 0 },
      delegate: { count: 0, time: 0 },
      delay: { count: 0, time: 0 },
      delete: { count: 0, time: 0 },
    };

    // Calculate time block stats
    const timeBlocks = {
      deep: { count: 0, time: 0 },
      collaborative: { count: 0, time: 0 },
      quick: { count: 0, time: 0 },
      systematic: { count: 0, time: 0 },
    };

    // Calculate type stats
    const types = {
      revenue: { count: 0, time: 0 },
      growth: { count: 0, time: 0 },
      operations: { count: 0, time: 0 },
      strategic: { count: 0, time: 0 },
      personal: { count: 0, time: 0 },
    };

    let totalTime = 0;

    userTasks.forEach((task) => {
      const time = task.estimatedTime || 0;
      totalTime += time;

      // Decision stats
      if (decisions[task.decision as keyof typeof decisions]) {
        decisions[task.decision as keyof typeof decisions].count++;
        decisions[task.decision as keyof typeof decisions].time += time;
      }

      // Time block stats
      if (timeBlocks[task.timeBlock as keyof typeof timeBlocks]) {
        timeBlocks[task.timeBlock as keyof typeof timeBlocks].count++;
        timeBlocks[task.timeBlock as keyof typeof timeBlocks].time += time;
      }

      // Type stats
      if (types[task.type as keyof typeof types]) {
        types[task.type as keyof typeof types].count++;
        types[task.type as keyof typeof types].time += time;
      }
    });

    const stats: OverviewStats = {
      decisions,
      timeBlocks,
      types,
      totalTasks: userTasks.length,
      totalTime,
    };

    return c.json(stats);
  } catch (error) {
    console.error("Get overview stats error:", error);
    return c.json({ error: "Failed to fetch overview stats" }, 500);
  }
});

// GET /api/stats/recommendations - Get AI recommendations for all tasks
statsRouter.get(
  "/recommendations",
  zValidator("query", recommendationQuerySchema),
  async (c) => {
    // For demo mode, return empty recommendations since data is in localStorage
    if (c.env.NODE_ENV === "demo") {
      const emptyRecommendations: TaskRecommendations = {};
      return c.json(emptyRecommendations);
    }

    const { method } = c.req.valid("query");
    const user = c.get("user");
    const db = createDB(c.env);

    if (!db) {
      return c.json({ error: "Database not available" }, 500);
    }

    try {
      const userTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, user.id))
        .all();

      const recommendations: TaskRecommendations = {};

      userTasks.forEach((task) => {
        // Parse subtasks JSON if present
        const taskWithSubtasks = {
          ...task,
          subtasks: task.subtasks ? JSON.parse(task.subtasks as string) : []
        };

        // Type assertion for database task to match algorithm interface
        const taskForAlgorithm = taskWithSubtasks as Task;
        const recommendation = getDecisionRecommendation(
          taskForAlgorithm,
          method,
        );
        recommendations[task.id] = recommendation;
      });

      return c.json(recommendations);
    } catch (error) {
      console.error("Get recommendations error:", error);
      return c.json({ error: "Failed to generate recommendations" }, 500);
    }
  },
);

export default statsRouter;
