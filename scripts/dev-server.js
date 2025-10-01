// Simple development server using Node.js
import { serve } from "@hono/node-server";
import app from "../src/server/index.ts";

// Mock Cloudflare environment for development
const env = {
  NODE_ENV: "development",
  ACCESS_AUD: "dev-environment",
};

// Bind environment to the app
const boundApp = app.fetch.bind(app);

console.log("🚀 Starting development server on http://localhost:8787");
console.log("📊 Using local SQLite database: ./dev.db");
console.log("🔐 Mock authentication enabled (dev@example.com)");

serve({
  fetch: (request, info) => {
    // Add mock environment to all requests
    return boundApp(request, env, info);
  },
  port: 8787,
});
