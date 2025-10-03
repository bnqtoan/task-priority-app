-- Add deadline and subtasks fields to tasks table
-- Migration: 0006_add_deadline_subtasks.sql

-- Add deadline timestamp field (nullable)
ALTER TABLE tasks ADD COLUMN deadline INTEGER;

-- Add subtasks as JSON field (nullable)
-- Structure: [{id: string, text: string, completed: boolean, order: number}]
ALTER TABLE tasks ADD COLUMN subtasks TEXT;

-- Create index on deadline for efficient filtering/sorting
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);

-- Create index on deadline + status for overdue queries
CREATE INDEX IF NOT EXISTS idx_tasks_deadline_status ON tasks(deadline, status);
