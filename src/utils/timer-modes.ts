/**
 * Timer mode utilities for countdown and count-up timers
 */

/**
 * Format time for countdown display (shows hours if >= 1 hour)
 */
export function formatCountdown(secondsRemaining: number): string {
  const absSeconds = Math.abs(secondsRemaining);
  const hrs = Math.floor(absSeconds / 3600);
  const mins = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format elapsed time (count-up display)
 */
export function formatElapsed(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate remaining time for countdown
 * @param startTime When the timer started
 * @param targetMinutes Target duration in minutes
 * @param pausedSeconds Total seconds the timer was paused
 * @returns Seconds remaining (can be negative if overtime)
 */
export function calculateRemaining(
  startTime: Date,
  targetMinutes: number,
  pausedSeconds: number,
): number {
  const now = new Date();
  const elapsedSeconds =
    Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedSeconds;
  const targetSeconds = targetMinutes * 60;
  return targetSeconds - elapsedSeconds;
}

/**
 * Calculate elapsed time
 * @param startTime When the timer started
 * @param pausedSeconds Total seconds the timer was paused
 * @returns Elapsed seconds
 */
export function calculateElapsed(
  startTime: Date,
  pausedSeconds: number,
): number {
  const now = new Date();
  return (
    Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedSeconds
  );
}

/**
 * Check if countdown is complete (reached zero)
 */
export function isCountdownComplete(remaining: number): boolean {
  return remaining <= 0;
}

/**
 * Get a friendly message for countdown completion
 */
export function getCountdownCompletionMessage(targetMinutes: number): string {
  if (targetMinutes <= 15) {
    return `Great! You focused for ${targetMinutes} minutes. 🎯`;
  } else if (targetMinutes <= 30) {
    return `Excellent work! ${targetMinutes} minutes of deep focus. 🌟`;
  } else if (targetMinutes <= 60) {
    return `Amazing! You completed ${targetMinutes} minutes of focused work! 🚀`;
  } else {
    return `Incredible! ${targetMinutes} minutes of uninterrupted focus! 🏆`;
  }
}

/**
 * Parse duration string (e.g., "25" or "1:30") to minutes
 */
export function parseDurationToMinutes(input: string): number | null {
  const trimmed = input.trim();

  // Check for HH:MM or MM:SS format
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length === 2) {
      const first = parseInt(parts[0], 10);
      const second = parseInt(parts[1], 10);
      if (!isNaN(first) && !isNaN(second)) {
        // Assume it's minutes:seconds
        return first + Math.floor(second / 60);
      }
    }
    return null;
  }

  // Just a number - treat as minutes
  const minutes = parseInt(trimmed, 10);
  return isNaN(minutes) ? null : minutes;
}

/**
 * Format minutes to friendly duration string
 */
export function formatMinutesToDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours}h ${mins}m`;
}
