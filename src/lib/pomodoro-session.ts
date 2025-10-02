/**
 * Global Pomodoro Session Manager
 *
 * Manages a single, global Pomodoro session that persists across:
 * - Task switches
 * - Page reloads
 * - Browser sessions (via localStorage)
 *
 * This is a singleton pattern - only one active Pomodoro session exists at a time.
 */

import type { GlobalPomodoroSession, PomodoroSettings } from "../utils/types";
import { loadPomodoroSettings } from "../utils/pomodoro";

const STORAGE_KEY = "global-pomodoro-session";

/**
 * Get current date string in YYYY-MM-DD format
 */
function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Load global Pomodoro session from localStorage
 */
export function loadGlobalPomodoroSession(): GlobalPomodoroSession | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const session: GlobalPomodoroSession = JSON.parse(saved);

    // Convert date strings back to Date objects
    session.sessionStartTime = new Date(session.sessionStartTime);
    if (session.pauseStartTime) {
      session.pauseStartTime = new Date(session.pauseStartTime);
    }

    // Reset daily counter if it's a new day
    const today = getTodayDateString();
    if (session.lastResetDate !== today) {
      session.todaysPomodorosCount = 0;
      session.lastResetDate = today;
    }

    return session;
  } catch (error) {
    console.error("Failed to load global Pomodoro session:", error);
    return null;
  }
}

/**
 * Save global Pomodoro session to localStorage
 */
export function saveGlobalPomodoroSession(session: GlobalPomodoroSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save global Pomodoro session:", error);
  }
}

/**
 * Clear global Pomodoro session from localStorage
 */
export function clearGlobalPomodoroSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear global Pomodoro session:", error);
  }
}

/**
 * Check if there's an active global Pomodoro session
 */
export function hasActiveGlobalPomodoro(): boolean {
  const session = loadGlobalPomodoroSession();
  return session !== null && session.isActive;
}

/**
 * Start a new global Pomodoro session
 */
export function startGlobalPomodoroSession(taskId: number): GlobalPomodoroSession {
  const today = getTodayDateString();

  const session: GlobalPomodoroSession = {
    isActive: true,
    currentMode: "work",
    completedPomodoros: 0,
    sessionStartTime: new Date(),
    pausedTime: 0,
    isPaused: false,
    pauseStartTime: null,
    currentTaskId: taskId,
    todaysPomodorosCount: 0,
    lastResetDate: today,
  };

  saveGlobalPomodoroSession(session);
  return session;
}

/**
 * Switch the current task in an active Pomodoro session
 */
export function switchPomodoroTask(taskId: number): GlobalPomodoroSession | null {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return null;
  }

  session.currentTaskId = taskId;
  saveGlobalPomodoroSession(session);
  return session;
}

/**
 * Pause the global Pomodoro session
 */
export function pauseGlobalPomodoro(): GlobalPomodoroSession | null {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return null;
  }

  if (!session.isPaused) {
    session.isPaused = true;
    session.pauseStartTime = new Date();
    saveGlobalPomodoroSession(session);
  }

  return session;
}

/**
 * Resume the global Pomodoro session
 */
export function resumeGlobalPomodoro(): GlobalPomodoroSession | null {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return null;
  }

  if (session.isPaused && session.pauseStartTime) {
    const pauseDuration = Math.floor(
      (new Date().getTime() - session.pauseStartTime.getTime()) / 1000
    );
    session.pausedTime += pauseDuration;
    session.isPaused = false;
    session.pauseStartTime = null;
    saveGlobalPomodoroSession(session);
  }

  return session;
}

/**
 * Get elapsed time in seconds for current Pomodoro phase
 */
export function getGlobalPomodoroElapsed(): number {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return 0;
  }

  const now = new Date();
  const wallTime = Math.floor(
    (now.getTime() - session.sessionStartTime.getTime()) / 1000
  );

  // If currently paused, add time since pause started
  let totalPausedTime = session.pausedTime;
  if (session.isPaused && session.pauseStartTime) {
    const currentPauseDuration = Math.floor(
      (now.getTime() - session.pauseStartTime.getTime()) / 1000
    );
    totalPausedTime += currentPauseDuration;
  }

  return Math.max(0, wallTime - totalPausedTime);
}

/**
 * Complete the current Pomodoro phase and transition to next
 */
export function completeGlobalPomodoroPhase(): GlobalPomodoroSession | null {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return null;
  }

  const settings = loadPomodoroSettings();

  // Determine next mode
  if (session.currentMode === "work") {
    const newCompletedCount = session.completedPomodoros + 1;
    session.completedPomodoros = newCompletedCount;
    session.todaysPomodorosCount += 1;

    // Check if it's time for long break
    if (newCompletedCount >= settings.pomodorosUntilLongBreak) {
      session.currentMode = "long-break";
      session.completedPomodoros = 0; // Reset cycle
    } else {
      session.currentMode = "short-break";
    }
  } else {
    // After any break, return to work
    session.currentMode = "work";
  }

  // Reset timer for next phase
  session.sessionStartTime = new Date();
  session.pausedTime = 0;
  session.isPaused = false;
  session.pauseStartTime = null;

  saveGlobalPomodoroSession(session);
  return session;
}

/**
 * End the global Pomodoro session completely
 */
export function endGlobalPomodoroSession(): void {
  clearGlobalPomodoroSession();
}

/**
 * Get remaining time in seconds for current Pomodoro phase
 */
export function getGlobalPomodoroRemaining(): number {
  const session = loadGlobalPomodoroSession();
  if (!session || !session.isActive) {
    return 0;
  }

  const settings = loadPomodoroSettings();
  let targetDuration: number;

  switch (session.currentMode) {
    case "work":
      targetDuration = settings.workDuration * 60;
      break;
    case "short-break":
      targetDuration = settings.shortBreakDuration * 60;
      break;
    case "long-break":
      targetDuration = settings.longBreakDuration * 60;
      break;
  }

  const elapsed = getGlobalPomodoroElapsed();
  return Math.max(0, targetDuration - elapsed);
}

/**
 * Check if current Pomodoro phase is complete
 */
export function isGlobalPomodoroPhaseComplete(): boolean {
  return getGlobalPomodoroRemaining() === 0;
}
