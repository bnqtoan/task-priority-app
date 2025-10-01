-- Migration: Add scheduling and recurring task support
-- Created: 2025-10-01

-- Add scheduling columns to tasks table
ALTER TABLE tasks ADD COLUMN scheduled_for TEXT; -- 'today' | 'this-week' | 'this-month' | 'someday'
ALTER TABLE tasks ADD COLUMN recurring_pattern TEXT; -- 'daily' | 'weekly' | 'monthly' | null
ALTER TABLE tasks ADD COLUMN last_completed_date INTEGER; -- timestamp for recurring tasks
ALTER TABLE tasks ADD COLUMN streak_count INTEGER DEFAULT 0; -- consecutive completions

-- Create indexes for better query performance
CREATE INDEX idx_tasks_scheduled_for ON tasks(scheduled_for);
CREATE INDEX idx_tasks_recurring_pattern ON tasks(recurring_pattern);
CREATE INDEX idx_tasks_last_completed_date ON tasks(last_completed_date);
