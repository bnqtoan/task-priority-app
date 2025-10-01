import type { PomodoroSettings, PomodoroState } from './types';

/**
 * Get the duration in minutes for the current Pomodoro mode
 */
export function getPomodoroModeDuration(
  mode: PomodoroState['currentMode'],
  settings: PomodoroSettings
): number {
  switch (mode) {
    case 'work':
      return settings.workDuration;
    case 'short-break':
      return settings.shortBreakDuration;
    case 'long-break':
      return settings.longBreakDuration;
    default:
      return settings.workDuration;
  }
}

/**
 * Determine the next Pomodoro mode based on current state
 */
export function getNextPomodoroMode(
  currentMode: PomodoroState['currentMode'],
  completedPomodoros: number,
  pomodorosUntilLongBreak: number
): PomodoroState['currentMode'] {
  if (currentMode === 'work') {
    // After work, check if it's time for long break
    if (completedPomodoros >= pomodorosUntilLongBreak) {
      return 'long-break';
    }
    return 'short-break';
  }

  // After any break, return to work
  return 'work';
}

/**
 * Get display info for current Pomodoro mode
 */
export function getPomodoroModeInfo(mode: PomodoroState['currentMode']) {
  const modes = {
    work: {
      label: 'Focus Time',
      icon: '🍅',
      color: 'from-blue-900 via-purple-900 to-indigo-900',
      compactColor: 'bg-blue-600',
      description: 'Time to focus on your task'
    },
    'short-break': {
      label: 'Short Break',
      icon: '☕',
      color: 'from-green-700 via-emerald-800 to-teal-900',
      compactColor: 'bg-green-600',
      description: 'Take a short break, stretch, hydrate'
    },
    'long-break': {
      label: 'Long Break',
      icon: '🌴',
      color: 'from-teal-700 via-cyan-800 to-blue-900',
      compactColor: 'bg-teal-600',
      description: 'Well done! Take a longer rest'
    }
  };

  return modes[mode];
}

/**
 * Format Pomodoro counter display (e.g., "2/4")
 */
export function formatPomodoroCounter(
  completedPomodoros: number,
  totalPomodoros: number
): string {
  return `${completedPomodoros}/${totalPomodoros}`;
}

/**
 * Calculate if it's time for a long break
 */
export function isLongBreakTime(
  completedPomodoros: number,
  pomodorosUntilLongBreak: number
): boolean {
  return completedPomodoros >= pomodorosUntilLongBreak;
}

/**
 * Get completion message based on Pomodoro state
 */
export function getPomodoroCompletionMessage(
  mode: PomodoroState['currentMode'],
  completedPomodoros: number,
  pomodorosUntilLongBreak: number
): string {
  if (mode === 'work') {
    const remaining = pomodorosUntilLongBreak - completedPomodoros;
    if (remaining === 0) {
      return '🎉 Great work! Time for a long break!';
    } else if (remaining === 1) {
      return '🍅 Pomodoro complete! One more until long break!';
    }
    return `🍅 Pomodoro complete! ${remaining} more until long break`;
  }

  if (mode === 'short-break') {
    return '☕ Break over! Ready for the next Pomodoro?';
  }

  return '🌴 Long break complete! Starting fresh cycle';
}

/**
 * Load Pomodoro settings from localStorage
 */
export function loadPomodoroSettings(): PomodoroSettings {
  try {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load Pomodoro settings:', error);
  }

  // Return defaults from types
  return {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    playSound: true,
    showNotifications: true
  };
}

/**
 * Save Pomodoro settings to localStorage
 */
export function savePomodoroSettings(settings: PomodoroSettings): void {
  try {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save Pomodoro settings:', error);
  }
}

/**
 * Play completion sound (if browser supports it)
 */
export function playPomodoroSound(): void {
  try {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}

/**
 * Show browser notification (if permitted)
 */
export function showPomodoroNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}
