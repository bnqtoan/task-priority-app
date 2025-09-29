-- Migration: Add time tracking and focus mode support
-- Created: 2025-09-29

-- Add time tracking columns to tasks table
ALTER TABLE tasks ADD COLUMN actual_time INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN is_in_focus INTEGER DEFAULT 0; -- SQLite doesn't have boolean, use integer
ALTER TABLE tasks ADD COLUMN focus_started_at INTEGER; -- timestamp

-- Create time_entries table
CREATE TABLE time_entries (
  id TEXT PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time INTEGER NOT NULL, -- timestamp
  end_time INTEGER, -- timestamp
  duration INTEGER, -- in minutes
  type TEXT NOT NULL DEFAULT 'regular', -- 'focus' | 'regular'
  quote TEXT, -- motivational quote for focus sessions
  created_at INTEGER NOT NULL, -- timestamp
  updated_at INTEGER NOT NULL -- timestamp
);

-- Create indexes for better performance
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_start_time ON time_entries(start_time);
CREATE INDEX idx_tasks_is_in_focus ON tasks(is_in_focus);
