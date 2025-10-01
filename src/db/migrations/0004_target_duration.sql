-- Migration: Add timer persistence fields
-- Created: 2025-10-01

-- Add timer state columns to tasks table for full timer persistence across reloads
ALTER TABLE tasks ADD COLUMN target_duration INTEGER; -- countdown timer target in minutes
ALTER TABLE tasks ADD COLUMN is_paused INTEGER DEFAULT 0; -- whether timer is currently paused
ALTER TABLE tasks ADD COLUMN paused_time INTEGER DEFAULT 0; -- accumulated pause time in seconds
ALTER TABLE tasks ADD COLUMN pause_start_time INTEGER; -- when current pause started (timestamp)
