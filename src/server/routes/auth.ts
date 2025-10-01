import { Hono } from "hono";
import { accessMiddleware, type AccessUser } from "../middleware/access";
import type { Env } from "../lib/db";

type Variables = {
  user: AccessUser;
};

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply middleware to all auth routes
auth.use("*", accessMiddleware);

// GET /api/auth/me - Get current user
auth.get("/me", async (c) => {
  const user = c.get("user");

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

export default auth;
