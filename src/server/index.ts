import { Hono } from "hono";
import { corsMiddleware } from "./middleware/access";
import type { Env } from "./lib/db";

import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import preferencesRoutes from "./routes/preferences";
import statsRoutes from "./routes/stats";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for all routes
app.use("*", corsMiddleware);

// API Routes
app.route("/api/auth", authRoutes);
app.route("/api/tasks", tasksRoutes);
app.route("/api/preferences", preferencesRoutes);
app.route("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Serve static files (React app) - commented out for development
// In production, uncomment and configure properly with asset manifest
// app.use('/*', serveStatic());
// app.get('*', serveStatic({ path: './index.html' }));

export default app;
