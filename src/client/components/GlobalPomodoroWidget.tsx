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
  completeGlobalPomodoroPhase,
  isGlobalPomodoroPhaseComplete,
} from "../../lib/pomodoro-session";
import { loadPomodoroSettings } from "../../utils/pomodoro";
import { getPomodoroModeInfo } from "../../utils/pomodoro";
import type { GlobalPomodoroSession } from "../../utils/types";

export function GlobalPomodoroWidget() {
  const [session, setSession] = useState<GlobalPomodoroSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [showPhaseComplete, setShowPhaseComplete] = useState(false);

  // Load session on mount and set up interval
  useEffect(() => {
    const updateSession = () => {
      const currentSession = loadGlobalPomodoroSession();
      setSession(currentSession);

      if (currentSession && currentSession.isActive) {
        const newElapsed = getGlobalPomodoroElapsed();
        const newRemaining = getGlobalPomodoroRemaining();
        setElapsed(newElapsed);
        setRemaining(newRemaining);

        // Check if phase is complete (timer reached 0:00)
        if (isGlobalPomodoroPhaseComplete() && newRemaining === 0) {
          // Show completion animation
          setShowPhaseComplete(true);

          // Auto-transition after 2 seconds
          setTimeout(() => {
            completeGlobalPomodoroPhase();
            setShowPhaseComplete(false);
            setSession(loadGlobalPomodoroSession());
          }, 2000);
        }
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
    <>
      {/* Phase Complete Notification */}
      {showPhaseComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform animate-bounce">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {session.currentMode === "work" ? "🎉" : "☕"}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {session.currentMode === "work"
                  ? "Work Session Complete!"
                  : "Break Time Over!"}
              </div>
              <div className="text-gray-600">
                {session.currentMode === "work"
                  ? "Time for a break..."
                  : "Back to work!"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`sticky top-0 left-0 right-0 ${modeInfo.compactColor} text-white shadow-lg z-30 animate-slide-down`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Mode & Timer */}
            <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">{modeInfo.icon}</span>
              <div>
                <div className="font-bold text-sm">{modeInfo.label}</div>
                <div className="text-xs opacity-80">
                  Cycle {session.completedPomodoros + 1}/{settings.pomodorosUntilLongBreak}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-mono font-bold">
                  {formatTime(remaining)}
                </div>
                <div className="text-xs opacity-90">
                  {session.isPaused ? "⏸" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stats & Controls */}
          <div className="flex items-center gap-3">
            {/* Daily Stats */}
            <div className="text-xs opacity-90 hidden sm:block">
              🎯 {session.todaysPomodorosCount} today
            </div>

            {/* Controls */}
            <button
              onClick={handlePauseToggle}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2"
              title={session.isPaused ? "Resume" : "Pause"}
            >
              {session.isPaused ? (
                <>
                  <Play size={16} />
                  <span className="hidden sm:inline">Resume</span>
                </>
              ) : (
                <>
                  <Pause size={16} />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            <button
              onClick={handleEnd}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              title="End Pomodoro session"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
