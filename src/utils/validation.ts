import { z } from 'zod';

// Task validation schemas
export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(255, 'Task name too long'),
  notes: z.string().optional(),
  impact: z.number().int().min(1).max(10),
  confidence: z.number().int().min(1).max(10),
  ease: z.number().int().min(1).max(10),
  type: z.enum(['revenue', 'growth', 'operations', 'strategic', 'personal']),
  timeBlock: z.enum(['deep', 'collaborative', 'quick', 'systematic']),
  estimatedTime: z.number().int().min(5).max(1440), // 5 minutes to 24 hours
  decision: z.enum(['do', 'delegate', 'delay', 'delete']),
  scheduledFor: z.enum(['today', 'this-week', 'this-month', 'someday']).or(z.literal('')).optional().transform(val => val === '' ? undefined : val),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly']).or(z.literal('')).nullable().optional().transform(val => val === '' ? null : val),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['active', 'completed', 'archived']).optional(),
  lastCompletedDate: z.string().or(z.date()).optional(),
  streakCount: z.number().int().min(0).optional(),
  isInFocus: z.boolean().optional(),
  focusStartedAt: z.string().or(z.date()).nullable().optional(),
  actualTime: z.number().int().min(0).optional(),
  targetDuration: z.number().int().min(0).nullable().optional(),
  isPaused: z.boolean().optional(),
  pausedTime: z.number().int().min(0).optional(),
  pauseStartTime: z.string().or(z.date()).nullable().optional(),
});

// User preferences validation
export const updatePreferencesSchema = z.object({
  preferredMethod: z.string().optional(),
  defaultTimeBlock: z.string().optional(),
});

// Query parameter validation
export const taskQuerySchema = z.object({
  status: z.enum(['active', 'completed', 'archived']).optional(),
  timeBlock: z.enum(['deep', 'collaborative', 'quick', 'systematic', 'all']).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
});

export const recommendationQuerySchema = z.object({
  method: z.enum(['simple', 'weighted', 'roi', 'eisenhower', 'skill', 'energy', 'strategic', 'hybrid']).default('hybrid'),
});