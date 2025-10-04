import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { createDB, type Env } from "../lib/db";
import { apiKeys } from "../../db/schema";
import { generateApiKey } from "../middleware/api-key-auth";
import type { AccessUser } from "../middleware/access";
import { z } from "zod";

const app = new Hono<{
  Bindings: Env;
  Variables: { user: AccessUser };
}>();

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

const updateApiKeySchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
app.get("/", async (c) => {
  const db = createDB(c.env);
  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  const user = c.get("user");

  try {
    const keys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id))
      .orderBy(desc(apiKeys.createdAt));

    return c.json({
      apiKeys: keys.map((key) => ({
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
        requestCount: key.requestCount,
        expiresAt: key.expiresAt ? new Date(key.expiresAt) : null,
        createdAt: new Date(key.createdAt),
      })),
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return c.json({ error: "Failed to fetch API keys" }, 500);
  }
});

/**
 * POST /api/api-keys
 * Create a new API key
 */
app.post("/", async (c) => {
  const db = createDB(c.env);
  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  const user = c.get("user");

  try {
    const body = await c.req.json();
    const validated = createApiKeySchema.parse(body);

    // Generate API key
    const { key, hash, prefix } = await generateApiKey("live");

    // Calculate expiration date
    let expiresAt: Date | null = null;
    if (validated.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validated.expiresInDays);
    }

    // Generate UUID for id
    const id = crypto.randomUUID();

    // Save to database
    const [newApiKey] = await db
      .insert(apiKeys)
      .values({
        id,
        userId: user.id,
        keyHash: hash,
        name: validated.name,
        prefix,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return c.json(
      {
        apiKey: {
          id: newApiKey.id,
          name: newApiKey.name,
          prefix: newApiKey.prefix,
          key, // Only returned once on creation
          expiresAt: newApiKey.expiresAt ? new Date(newApiKey.expiresAt) : null,
          createdAt: new Date(newApiKey.createdAt),
        },
        message: "API key created successfully. Save this key securely - it won't be shown again.",
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation error", details: error.errors }, 400);
    }
    console.error("Error creating API key:", error);
    return c.json({ error: "Failed to create API key" }, 500);
  }
});

/**
 * PATCH /api/api-keys/:id
 * Update an API key's name
 */
app.patch("/:id", async (c) => {
  const db = createDB(c.env);
  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  const user = c.get("user");
  const keyId = c.req.param("id");

  try {
    const body = await c.req.json();
    const validated = updateApiKeySchema.parse(body);

    // Verify ownership
    const existingKey = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, user.id)))
      .get();

    if (!existingKey) {
      return c.json({ error: "API key not found" }, 404);
    }

    // Update
    const [updatedKey] = await db
      .update(apiKeys)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(apiKeys.id, keyId))
      .returning();

    return c.json({
      apiKey: {
        id: updatedKey.id,
        name: updatedKey.name,
        prefix: updatedKey.prefix,
        lastUsedAt: updatedKey.lastUsedAt ? new Date(updatedKey.lastUsedAt) : null,
        requestCount: updatedKey.requestCount,
        expiresAt: updatedKey.expiresAt ? new Date(updatedKey.expiresAt) : null,
        createdAt: new Date(updatedKey.createdAt),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation error", details: error.errors }, 400);
    }
    console.error("Error updating API key:", error);
    return c.json({ error: "Failed to update API key" }, 500);
  }
});

/**
 * DELETE /api/api-keys/:id
 * Delete an API key
 */
app.delete("/:id", async (c) => {
  const db = createDB(c.env);
  if (!db) {
    return c.json({ error: "Database not available" }, 500);
  }

  const user = c.get("user");
  const keyId = c.req.param("id");

  try {
    // Verify ownership
    const existingKey = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, user.id)))
      .get();

    if (!existingKey) {
      return c.json({ error: "API key not found" }, 404);
    }

    // Delete
    await db.delete(apiKeys).where(eq(apiKeys.id, keyId));

    return c.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return c.json({ error: "Failed to delete API key" }, 500);
  }
});

export default app;
