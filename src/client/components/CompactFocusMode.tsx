import {
  Play,
  Pause,
  CheckCircle,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type {
  Task,
  PomodoroSettings,
  PomodoroState,
  TimerMode,
} from "../../utils/types";
import {
  getPomodoroModeInfo,
  formatPomodoroCounter,
} from "../../utils/pomodoro";
import {
  formatCountdown,
  formatElapsed,
  calculateRemaining,
} from "../../utils/timer-modes";

interface CompactFocusModeProps {
  task: Task;
  elapsedTime: number;
  isPaused: boolean;
  pomodoroState?: PomodoroState;
  pomodoroSettings?: PomodoroSettings;
  timerMode?: TimerMode;
  targetDuration?: number | null;
  countdownCompleted?: boolean;
  startTime?: Date;
  pausedTime?: number;
  onPause: () => void;
  onComplete: () => void;
  onClose: () => void;
  onToggleFullMode: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function CompactFocusMode({
  task,
  elapsedTime,
  isPaused,
  pomodoroState,
  pomodoroSettings,
  timerMode = "countup",
  targetDuration = null,
  countdownCompleted = false,
  startTime,
  pausedTime = 0,
  onPause,
  onComplete,
  onClose,
  onToggleFullMode,
  isMinimized = false,
  onToggleMinimize,
}: CompactFocusModeProps) {
  // Calculate remaining time for countdown mode
  const remainingSeconds =
    timerMode === "countdown" && targetDuration && startTime
      ? calculateRemaining(startTime, targetDuration, pausedTime)
      : 0;
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const modeInfo =
    pomodoroState?.isEnabled && pomodoroState.currentMode
      ? getPomodoroModeInfo(pomodoroState.currentMode)
      : null;

  const bgColor =
    modeInfo?.compactColor || "bg-gradient-to-r from-purple-600 to-blue-600";

  // Ultra-minimized mode - just timer and expand button
  if (isMinimized) {
    return (
      <div
        className={`w-full ${bgColor} text-white shadow-lg sticky top-0 z-50`}
      >
        <div
          className="flex items-center justify-between px-3 py-2 gap-2"
          style={{ minHeight: "36px" }}
        >
          <div className="flex items-center gap-2 flex-1">
            {pomodoroState?.isEnabled && (
              <span className="text-sm font-bold">
                {modeInfo?.icon} {pomodoroState.completedPomodoros}/
                {pomodoroSettings?.pomodorosUntilLongBreak}
              </span>
            )}
            {timerMode === "countdown" && targetDuration ? (
              <span className="font-mono font-bold text-lg">
                {formatCountdown(remainingSeconds)} {countdownCompleted && "⏱️"}
              </span>
            ) : (
              <span className="font-mono font-bold text-lg">
                {formatTime(elapsedTime)}
              </span>
            )}
          </div>
          <button
            onClick={onToggleMinimize}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
            title="Expand"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Compact mode - single line with all controls, full width
  return (
    <div className={`w-full ${bgColor} text-white shadow-lg sticky top-0 z-50`}>
      <div
        className="flex items-center justify-between px-3 py-2 gap-2"
        style={{ minHeight: "40px" }}
      >
        {/* Left: Pomodoro counter + Timer */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {pomodoroState?.isEnabled && (
            <span className="text-sm font-bold whitespace-nowrap">
              {modeInfo?.icon}{" "}
              {formatPomodoroCounter(
                pomodoroState.completedPomodoros,
                pomodoroSettings?.pomodorosUntilLongBreak || 4,
              )}
            </span>
          )}
          {timerMode === "countdown" && targetDuration ? (
            <div className="flex flex-col">
              <span className="font-mono font-bold text-xl">
                {formatCountdown(remainingSeconds)} {countdownCompleted && "🎉"}
              </span>
              <span className="text-xs opacity-75">
                Elapsed: {formatElapsed(elapsedTime)}
              </span>
            </div>
          ) : (
            <span className="font-mono font-bold text-xl">
              {formatTime(elapsedTime)}
            </span>
          )}
        </div>

        {/* Middle: Task name */}
        <div className="flex-1 min-w-0 px-2">
          <span
            className="text-sm font-medium truncate block"
            title={task.name}
          >
            {task.name}
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Pause/Resume */}
          <button
            onClick={onPause}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>

          {/* Complete */}
          <button
            onClick={onComplete}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition"
            title="Complete session"
          >
            <CheckCircle size={18} />
          </button>

          {/* Minimize */}
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition"
              title="Minimize"
            >
              <Minimize2 size={18} />
            </button>
          )}

          {/* Full Mode Toggle */}
          <button
            onClick={onToggleFullMode}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition"
            title="Switch to full mode"
          >
            <Maximize2 size={18} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Optional: Subtle progress indicator for Pomodoro */}
      {pomodoroState?.isEnabled && pomodoroSettings && (
        <div className="h-0.5 bg-white bg-opacity-20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{
              width: `${(elapsedTime / (getPomodoroModeDuration(pomodoroState.currentMode, pomodoroSettings) * 60)) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Helper function - could be in pomodoro.ts but keeping it local for now
function getPomodoroModeDuration(
  mode: PomodoroState["currentMode"],
  settings: PomodoroSettings,
): number {
  switch (mode) {
    case "work":
      return settings.workDuration;
    case "short-break":
      return settings.shortBreakDuration;
    case "long-break":
      return settings.longBreakDuration;
    default:
      return settings.workDuration;
  }
}
