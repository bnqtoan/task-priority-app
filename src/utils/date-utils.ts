/**
 * Centralized date conversion utilities
 *
 * This file provides consistent date handling across the entire app.
 * All dates from API/localStorage come as strings and must be converted to Date objects.
 */

import type { Task, TimeEntry, Note, User, UserPreferences, FocusSession, GlobalPomodoroSession, DailyCapacity } from "./types";

/**
 * Safely convert a value to a Date object
 * Handles: Date objects, ISO strings, timestamps, null, undefined
 */
export function toDate(value: any): Date | null | undefined {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

/**
 * Convert Task date strings to Date objects
 */
export function convertTaskDates(task: any): Task {
  return {
    ...task,
    createdAt: toDate(task.createdAt) || new Date(),
    updatedAt: toDate(task.updatedAt) || new Date(),
    deadline: toDate(task.deadline),
    completedAt: toDate(task.completedAt),
    focusStartedAt: toDate(task.focusStartedAt),
    lastCompletedDate: toDate(task.lastCompletedDate),
    pauseStartTime: toDate(task.pauseStartTime),
  };
}

/**
 * Convert multiple tasks at once
 */
export function convertTasksDates(tasks: any[]): Task[] {
  return tasks.map(convertTaskDates);
}

/**
 * Convert TimeEntry date strings to Date objects
 */
export function convertTimeEntryDates(entry: any): TimeEntry {
  return {
    ...entry,
    startTime: toDate(entry.startTime) || new Date(),
    endTime: toDate(entry.endTime),
  };
}

/**
 * Convert multiple time entries at once
 */
export function convertTimeEntriesDates(entries: any[]): TimeEntry[] {
  return entries.map(convertTimeEntryDates);
}

/**
 * Convert User date strings to Date objects
 */
export function convertUserDates(user: any): User {
  return {
    ...user,
    createdAt: toDate(user.createdAt) || new Date(),
    updatedAt: toDate(user.updatedAt) || new Date(),
  };
}

/**
 * Convert UserPreferences date strings to Date objects
 */
export function convertUserPreferencesDates(prefs: any): UserPreferences {
  return {
    ...prefs,
    createdAt: toDate(prefs.createdAt) || new Date(),
    updatedAt: toDate(prefs.updatedAt) || new Date(),
  };
}

/**
 * Convert Note date strings to Date objects
 */
export function convertNoteDates(note: any): Note {
  return {
    ...note,
    createdAt: toDate(note.createdAt) || new Date(),
    updatedAt: toDate(note.updatedAt) || new Date(),
  };
}

/**
 * Convert multiple notes at once
 */
export function convertNotesDates(notes: any[]): Note[] {
  return notes.map(convertNoteDates);
}

/**
 * Convert FocusSession date strings to Date objects
 */
export function convertFocusSessionDates(session: any): FocusSession {
  return {
    ...session,
    startTime: toDate(session.startTime) || new Date(),
    endTime: toDate(session.endTime),
    countdownCompletedAt: toDate(session.countdownCompletedAt),
  };
}

/**
 * Convert GlobalPomodoroSession date strings to Date objects
 */
export function convertGlobalPomodoroDates(session: any): GlobalPomodoroSession {
  return {
    ...session,
    sessionStartTime: toDate(session.sessionStartTime) || new Date(),
    pauseStartTime: toDate(session.pauseStartTime),
  };
}

/**
 * Convert DailyCapacity date strings to Date objects
 */
export function convertDailyCapacityDates(capacity: any): DailyCapacity {
  return {
    ...capacity,
    date: toDate(capacity.date) || new Date(),
  };
}

/**
 * Prepare date for API request (convert Date to ISO string)
 */
export function prepareDateForAPI(date: Date | null | undefined): string | null | undefined {
  if (date === undefined) return undefined;
  if (date === null) return null;
  if (date instanceof Date) return date.toISOString();
  return date; // Already a string
}

/**
 * Prepare object with dates for API request
 */
export function prepareObjectForAPI<T extends Record<string, any>>(obj: T): T {
  const result: any = { ...obj };

  // List of known date fields
  const dateFields = [
    'createdAt', 'updatedAt', 'deadline', 'completedAt',
    'focusStartedAt', 'lastCompletedDate', 'pauseStartTime',
    'startTime', 'endTime', 'countdownCompletedAt',
    'sessionStartTime', 'date'
  ];

  for (const field of dateFields) {
    if (field in result && result[field] instanceof Date) {
      result[field] = result[field].toISOString();
    }
  }

  return result;
}
