import { drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleBetterSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../db/schema";

export interface Env {
  DB?: D1Database;
  ASSETS?: Fetcher;
  ACCESS_AUD?: string;
  NODE_ENV?: string;
  RATE_LIMITER?: any; // Cloudflare Rate Limiting API binding
}

export function createDB(env: Env) {
  // For demo mode, return null since we use localStorage
  if (env.NODE_ENV === "demo") {
    return null;
  }

  // Use local SQLite for development
  if (env.NODE_ENV === "development" || !env.DB) {
    const sqlite = new Database("./dev.db");
    return drizzleBetterSqlite(sqlite, { schema });
  }

  // Use D1 for production
  return drizzle(env.DB, { schema });
}
