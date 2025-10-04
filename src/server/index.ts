import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { corsMiddleware } from "./middleware/access";
import { apiKeyAuthMiddleware } from "./middleware/api-key-auth";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import type { Env } from "./lib/db";

import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import preferencesRoutes from "./routes/preferences";
import statsRoutes from "./routes/stats";
import notesRoutes from "./routes/notes";
import apiKeysRoutes from "./routes/api-keys";
import openApiSpec from "./openapi.json";
import openApiAISpec from "./openapi-ai.json";

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for all routes
app.use("*", corsMiddleware);

// OpenAPI specification endpoints (public, before auth middleware)
app.get("/api/openapi.json", (c) => {
  return c.json(openApiSpec);
});

app.get("/api/openapi-ai.json", (c) => {
  return c.json(openApiAISpec);
});

// Swagger UI documentation (public, before auth middleware)
app.get(
  "/api/docs",
  swaggerUI({
    url: "/api/openapi.json",
  })
);

// AI-optimized Swagger UI (public, before auth middleware)
app.get(
  "/api/docs/ai",
  swaggerUI({
    url: "/api/openapi-ai.json",
  })
);

// Health check (public, before auth middleware)
app.get("/api/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API Key authentication middleware for all other API routes
app.use("/api/*", apiKeyAuthMiddleware);

// Rate limiting middleware for all API routes (after auth)
app.use("/api/*", rateLimitMiddleware);

// API Routes (protected by auth middleware)
app.route("/api/auth", authRoutes);
app.route("/api/tasks", tasksRoutes);
app.route("/api/preferences", preferencesRoutes);
app.route("/api/stats", statsRoutes);
app.route("/api/notes", notesRoutes);
app.route("/api/api-keys", apiKeysRoutes);

// SPA fallback - For any non-API, non-asset route, this will be handled by Workers Assets
// which serves index.html, enabling client-side routing

// Export for development (Hono app only)
export { app };

// Export for production (Cloudflare Workers)
export default app;
