import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users Table - Simplified for Cloudflare Access
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(), // From CF-Access-Authenticated-User-Email
  name: text('name'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Tasks Table
export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Task details
  name: text('name').notNull(),
  notes: text('notes'),

  // ICE Scoring
  impact: integer('impact').notNull(), // 1-10
  confidence: integer('confidence').notNull(), // 1-10
  ease: integer('ease').notNull(), // 1-10

  // Categorization
  type: text('type').notNull(), // 'revenue' | 'growth' | 'operations' | 'strategic' | 'personal'
  timeBlock: text('time_block').notNull(), // 'deep' | 'collaborative' | 'quick' | 'systematic'

  // Time & Decision
  estimatedTime: integer('estimated_time').notNull(), // in minutes
  decision: text('decision').notNull(), // 'do' | 'delegate' | 'delay' | 'delete'

  // Status
  status: text('status').notNull().default('active'), // 'active' | 'completed' | 'archived'

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// User Preferences Table
export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),

  // AI Method preference
  preferredMethod: text('preferred_method').notNull().default('hybrid'),

  // UI preferences
  defaultTimeBlock: text('default_time_block').default('all'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;