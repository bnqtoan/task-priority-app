import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Users Table - Simplified for Cloudflare Access
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(), // From CF-Access-Authenticated-User-Email
  name: text("name"),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Tasks Table
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Task details
  name: text("name").notNull(),
  notes: text("notes"),

  // ICE Scoring
  impact: integer("impact").notNull(), // 1-10
  confidence: integer("confidence").notNull(), // 1-10
  ease: integer("ease").notNull(), // 1-10

  // Categorization
  type: text("type").notNull(), // 'revenue' | 'growth' | 'operations' | 'strategic' | 'personal'
  timeBlock: text("time_block").notNull(), // 'deep' | 'collaborative' | 'quick' | 'systematic'

  // Time & Decision
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  decision: text("decision").notNull(), // 'do' | 'delegate' | 'delay' | 'delete'

  // Status
  status: text("status").notNull().default("active"), // 'active' | 'completed' | 'archived'

  // Time tracking
  actualTime: integer("actual_time").default(0), // total time spent in minutes
  isInFocus: integer("is_in_focus", { mode: "boolean" }).default(false), // currently in focus mode
  focusStartedAt: integer("focus_started_at", { mode: "timestamp" }), // when current focus session started
  targetDuration: integer("target_duration"), // countdown timer target in minutes
  isPaused: integer("is_paused", { mode: "boolean" }).default(false), // whether timer is currently paused
  pausedTime: integer("paused_time").default(0), // accumulated pause time in seconds
  pauseStartTime: integer("pause_start_time", { mode: "timestamp" }), // when current pause started

  // Scheduling fields
  scheduledFor: text("scheduled_for"), // 'today' | 'this-week' | 'this-month' | 'someday'
  recurringPattern: text("recurring_pattern"), // 'daily' | 'weekly' | 'monthly' | null
  lastCompletedDate: integer("last_completed_date", { mode: "timestamp" }), // for recurring tasks
  streakCount: integer("streak_count").default(0), // consecutive completions

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// Time Entries Table
export const timeEntries = sqliteTable("time_entries", {
  id: text("id").primaryKey(), // UUID
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Time tracking
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }),
  duration: integer("duration"), // in minutes, calculated when session ends
  type: text("type").notNull().default("regular"), // 'focus' | 'regular'

  // Focus session details
  quote: text("quote"), // motivational quote for focus sessions

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// User Preferences Table
export const userPreferences = sqliteTable("user_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),

  // AI Method preference
  preferredMethod: text("preferred_method").notNull().default("hybrid"),

  // UI preferences
  defaultTimeBlock: text("default_time_block").default("all"),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Notes Table - For rich markdown notes
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => tasks.id, {
    onDelete: "cascade",
  }), // nullable - can be standalone

  // Content
  title: text("title").notNull(),
  content: text("content").notNull(), // markdown format

  // Categorization
  category: text("category").notNull().default("task-note"), // 'daily-log' | 'task-note' | 'reflection' | 'idea' | 'meeting'
  tags: text("tags"), // JSON array of strings

  // AI-ready metadata
  metadata: text("metadata"), // JSON: { mood?, energy?, location?, context? }

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
