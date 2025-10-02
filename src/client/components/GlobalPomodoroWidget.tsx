/**
 * Global Pomodoro Widget
 *
 * A floating widget that displays the current global Pomodoro session status.
 * Visible across all pages when a Pomodoro session is active.
 */

import { useState, useEffect } from "react";
import { X, Pause, Play } from "lucide-react";
import {
  loadGlobalPomodoroSession,
  getGlobalPomodoroElapsed,
  getGlobalPomodoroRemaining,
  pauseGlobalPomodoro,
  resumeGlobalPomodoro,
  endGlobalPomodoroSession,
} from "../../lib/pomodoro-session";
import { loadPomodoroSettings } from "../../utils/pomodoro";
import { getPomodoroModeInfo } from "../../utils/pomodoro";
import type { GlobalPomodoroSession } from "../../utils/types";

export function GlobalPomodoroWidget() {
  const [session, setSession] = useState<GlobalPomodoroSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);

  // Load session on mount and set up interval
  useEffect(() => {
    const updateSession = () => {
      const currentSession = loadGlobalPomodoroSession();
      setSession(currentSession);

      if (currentSession && currentSession.isActive) {
        setElapsed(getGlobalPomodoroElapsed());
        setRemaining(getGlobalPomodoroRemaining());
      }
    };

    updateSession();
    const interval = setInterval(updateSession, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render if no active session
  if (!session || !session.isActive) {
    return null;
  }

  const settings = loadPomodoroSettings();
  const modeInfo = getPomodoroModeInfo(session.currentMode);

  const handlePauseToggle = () => {
    if (session.isPaused) {
      resumeGlobalPomodoro();
    } else {
      pauseGlobalPomodoro();
    }
    // Trigger re-render
    setSession(loadGlobalPomodoroSession());
  };

  const handleEnd = () => {
    if (
      confirm(
        "Are you sure you want to end the Pomodoro session? Your progress will be saved."
      )
    ) {
      endGlobalPomodoroSession();
      setSession(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed bottom-6 left-6 ${modeInfo.compactColor} text-white rounded-xl shadow-2xl z-40 min-w-[280px]`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{modeInfo.icon}</span>
            <div>
              <div className="font-semibold text-sm">{modeInfo.label}</div>
              <div className="text-xs opacity-90">
                {session.completedPomodoros}/{settings.pomodorosUntilLongBreak}{" "}
                cycles
              </div>
            </div>
          </div>
          <button
            onClick={handleEnd}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
            title="End Pomodoro session"
          >
            <X size={18} />
          </button>
        </div>

        {/* Timer Display */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold mb-1">
              {formatTime(remaining)}
            </div>
            <div className="text-xs opacity-90">
              {session.isPaused ? "⏸ Paused" : "Remaining"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePauseToggle}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-3 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
          >
            {session.isPaused ? (
              <>
                <Play size={16} />
                Resume
              </>
            ) : (
              <>
                <Pause size={16} />
                Pause
              </>
            )}
          </button>
        </div>

        {/* Daily Stats */}
        <div className="mt-3 text-xs text-center opacity-75">
          🎯 {session.todaysPomodorosCount} pomodoros completed today
        </div>
      </div>
    </div>
  );
}
