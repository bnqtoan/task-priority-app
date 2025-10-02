import { Hono } from "hono";
import { corsMiddleware } from "./middleware/access";
import type { Env } from "./lib/db";

import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import preferencesRoutes from "./routes/preferences";
import statsRoutes from "./routes/stats";
import notesRoutes from "./routes/notes";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for all routes
app.use("*", corsMiddleware);

// API Routes
app.route("/api/auth", authRoutes);
app.route("/api/tasks", tasksRoutes);
app.route("/api/preferences", preferencesRoutes);
app.route("/api/stats", statsRoutes);
app.route("/api/notes", notesRoutes);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// SPA fallback - For any non-API, non-asset route, this will be handled by Workers Assets
// which serves index.html, enabling client-side routing

// Export for development (Hono app only)
export { app };

// Export for production (Cloudflare Workers)
export default app;
