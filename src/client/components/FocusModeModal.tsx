import React, { useState, useEffect } from "react";
import { CompactFocusMode } from "./CompactFocusMode";
import {
  Task,
  FocusQuote,
  PomodoroSettings,
  PomodoroState,
  TimerMode,
} from "../../utils/types";
import { getRandomFocusQuote } from "../../utils/focus-quotes";
import {
  loadPomodoroSettings,
  getPomodoroModeInfo,
  getNextPomodoroMode,
  getPomodoroModeDuration,
  getPomodoroCompletionMessage,
  playPomodoroSound,
  showPomodoroNotification,
} from "../../utils/pomodoro";
import {
  formatCountdown,
  formatElapsed,
  calculateRemaining,
  isCountdownComplete,
  getCountdownCompletionMessage,
} from "../../utils/timer-modes";

interface FocusModeModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (duration: number) => void;
  usePomodoroMode?: boolean;
  targetDuration?: number | null; // countdown target in minutes
}

export function FocusModeModal({
  task,
  isOpen,
  onClose,
  onComplete,
  usePomodoroMode = false,
  targetDuration = null,
}: FocusModeModalProps) {
  // Use existing focusStartedAt if available, otherwise create new start time
  const [startTime] = useState(() => {
    return task.focusStartedAt ? new Date(task.focusStartedAt) : new Date();
  });
  const [elapsedTime, setElapsedTime] = useState(() => {
    // Calculate initial elapsed time if timer was already running
    const start = task.focusStartedAt ? new Date(task.focusStartedAt) : new Date();
    const now = new Date();
    const paused = task.pausedTime || 0;
    return Math.floor((now.getTime() - start.getTime()) / 1000) - paused;
  });
  const [quote] = useState<FocusQuote>(getRandomFocusQuote());
  const [isPaused, setIsPaused] = useState(task.isPaused || false);
  const [pausedTime, setPausedTime] = useState(task.pausedTime || 0);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(
    task.pauseStartTime ? new Date(task.pauseStartTime) : null,
  );

  // Countdown timer state
  const [timerMode] = useState<TimerMode>(
    targetDuration !== null ? "countdown" : "countup",
  );
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [showCompletionNotification, setShowCompletionNotification] =
    useState(false);

  // View mode state
  const [isCompactMode, setIsCompactMode] = useState(() => {
    return localStorage.getItem("focusModeView") === "compact";
  });
  const [isMinimized, setIsMinimized] = useState(false);

  // Pomodoro state
  const [pomodoroSettings] = useState<PomodoroSettings>(loadPomodoroSettings());
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(() => {
    if (usePomodoroMode) {
      return {
        isEnabled: true,
        currentMode: "work",
        completedPomodoros: 0,
        totalPomodorosToday: 0,
      };
    }
    return {
      isEnabled: false,
      currentMode: "work",
      completedPomodoros: 0,
      totalPomodorosToday: 0,
    };
  });

  // Handlers - must be defined before useEffect that uses them
  const handleCountdownComplete = React.useCallback(() => {
    setCountdownCompleted(true);
    setShowCompletionNotification(true);

    // Play sound and show notification
    playPomodoroSound(); // Reuse Pomodoro sound
    const message = getCountdownCompletionMessage(targetDuration || 0);
    showPomodoroNotification("Timer Complete!", message);
  }, [targetDuration]);

  const handlePomodoroComplete = React.useCallback(() => {
    // Play sound and show notification
    if (pomodoroSettings.playSound) {
      playPomodoroSound();
    }

    const message = getPomodoroCompletionMessage(
      pomodoroState.currentMode,
      pomodoroState.completedPomodoros,
      pomodoroSettings.pomodorosUntilLongBreak,
    );

    if (pomodoroSettings.showNotifications) {
      showPomodoroNotification("Pomodoro Timer", message);
    }

    // Update state for next phase
    const nextMode = getNextPomodoroMode(
      pomodoroState.currentMode,
      pomodoroState.completedPomodoros +
        (pomodoroState.currentMode === "work" ? 1 : 0),
      pomodoroSettings.pomodorosUntilLongBreak,
    );

    const newCompletedPomodoros =
      pomodoroState.currentMode === "work"
        ? pomodoroState.completedPomodoros + 1
        : nextMode === "work" &&
            pomodoroState.completedPomodoros >=
              pomodoroSettings.pomodorosUntilLongBreak
          ? 0
          : pomodoroState.completedPomodoros;

    setPomodoroState({
      ...pomodoroState,
      currentMode: nextMode,
      completedPomodoros: newCompletedPomodoros,
    });

    // Reset timer
    setElapsedTime(0);
    setPausedTime(0);

    // Auto-start next phase if enabled
    if (
      (nextMode !== "work" && pomodoroSettings.autoStartBreaks) ||
      (nextMode === "work" && pomodoroSettings.autoStartPomodoros)
    ) {
      // Timer continues automatically
      setIsPaused(false);
    } else {
      // Pause and show option to start
      setIsPaused(true);
      // Could show a modal here, but for now just pause
    }
  }, [pomodoroState, pomodoroSettings]);

  // Timer logic
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed =
        Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime;
      setElapsedTime(elapsed);

      // Check if countdown is complete
      if (timerMode === "countdown" && targetDuration && !countdownCompleted) {
        const remaining = calculateRemaining(
          startTime,
          targetDuration,
          pausedTime,
        );
        if (isCountdownComplete(remaining)) {
          handleCountdownComplete();
        }
      }

      // Check if Pomodoro session is complete
      if (pomodoroState.isEnabled) {
        const targetDuration =
          getPomodoroModeDuration(pomodoroState.currentMode, pomodoroSettings) *
          60;
        if (elapsed >= targetDuration) {
          handlePomodoroComplete();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isOpen,
    startTime,
    isPaused,
    pausedTime,
    pomodoroState,
    pomodoroSettings,
    timerMode,
    targetDuration,
    countdownCompleted,
    handleCountdownComplete,
    handlePomodoroComplete,
  ]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePause = async () => {
    let newPausedTime = pausedTime;
    let newPauseStartTime: Date | null = null;
    let newIsPaused = !isPaused;

    if (isPaused) {
      // Resuming
      if (pauseStartTime) {
        const pauseDuration = Math.floor(
          (new Date().getTime() - pauseStartTime.getTime()) / 1000,
        );
        newPausedTime = pausedTime + pauseDuration;
        setPausedTime(newPausedTime);
        setPauseStartTime(null);
      }
    } else {
      // Pausing
      newPauseStartTime = new Date();
      setPauseStartTime(newPauseStartTime);
    }

    setIsPaused(newIsPaused);

    // Persist pause state to database
    try {
      const { taskStorage } = await import("../../lib/storage");
      await taskStorage.updatePauseState(
        task.id,
        newIsPaused,
        newPausedTime,
        newPauseStartTime,
      );
    } catch (error) {
      console.error("Failed to persist pause state:", error);
    }
  };

  const handleComplete = () => {
    const totalMinutes = Math.ceil(elapsedTime / 60);
    onComplete(totalMinutes);
    onClose();
  };

  const handleContinueWorking = () => {
    setShowCompletionNotification(false);
    // Timer continues tracking in background
  };

  const toggleViewMode = () => {
    const newMode = !isCompactMode;
    setIsCompactMode(newMode);
    localStorage.setItem("focusModeView", newMode ? "compact" : "full");
    setIsMinimized(false);
  };

  if (!isOpen) return null;

  // Render compact mode - full page layout, not modal
  if (isCompactMode) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
        <CompactFocusMode
          task={task}
          elapsedTime={elapsedTime}
          isPaused={isPaused}
          pomodoroState={pomodoroState.isEnabled ? pomodoroState : undefined}
          pomodoroSettings={
            pomodoroState.isEnabled ? pomodoroSettings : undefined
          }
          timerMode={timerMode}
          targetDuration={targetDuration}
          countdownCompleted={countdownCompleted}
          startTime={startTime}
          pausedTime={pausedTime}
          onPause={handlePause}
          onComplete={handleComplete}
          onClose={onClose}
          onToggleFullMode={toggleViewMode}
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
        />
        {/* Empty space below for background */}
        <div className="flex-1"></div>
      </div>
    );
  }

  // Render full immersive mode
  const modeInfo = pomodoroState.isEnabled
    ? getPomodoroModeInfo(pomodoroState.currentMode)
    : null;
  const bgGradient =
    modeInfo?.color || "from-blue-900 via-purple-900 to-indigo-900";

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br ${bgGradient} flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close focus mode"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Compact mode toggle */}
      <button
        onClick={toggleViewMode}
        className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors z-10 flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        <span className="text-sm">Compact Mode</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 text-center text-white max-w-4xl px-8">
        {/* Pomodoro indicator */}
        {pomodoroState.isEnabled && (
          <div className="mb-4 text-lg font-medium opacity-90">
            {modeInfo?.icon} {modeInfo?.label} •{" "}
            {pomodoroState.completedPomodoros}/
            {pomodoroSettings.pomodorosUntilLongBreak}
          </div>
        )}

        {/* Task name */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">
          {task.name}
        </h1>

        {/* Timer */}
        <div className="mb-12">
          {timerMode === "countdown" && targetDuration ? (
            <>
              {/* Countdown display */}
              <div className="mb-2">
                <div className="text-6xl md:text-8xl font-mono font-bold mb-2 text-white">
                  {formatCountdown(
                    calculateRemaining(startTime, targetDuration, pausedTime),
                  )}
                </div>
                <div className="text-2xl text-blue-200">
                  {countdownCompleted ? "Overtime" : "Remaining"}
                </div>
              </div>
              {/* Elapsed time (smaller) */}
              <div className="text-lg text-blue-300 opacity-75">
                ⏱️ Elapsed: {formatElapsed(elapsedTime)}
              </div>
            </>
          ) : (
            <>
              {/* Count-up display */}
              <div className="text-6xl md:text-8xl font-mono font-bold mb-4 text-white">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-lg text-blue-200">
                {isPaused
                  ? "Paused"
                  : pomodoroState.isEnabled
                    ? modeInfo?.description
                    : "Focus Time"}
              </div>
            </>
          )}
        </div>

        {/* Quote */}
        {!pomodoroState.isEnabled || pomodoroState.currentMode === "work" ? (
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 mb-12 max-w-2xl mx-auto">
            <blockquote className="text-xl md:text-2xl italic text-blue-50 mb-4">
              "{quote.text}"
            </blockquote>
            <cite className="text-blue-200 font-medium">— {quote.author}</cite>
          </div>
        ) : (
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 mb-12 max-w-2xl mx-auto">
            <p className="text-2xl text-blue-50">{modeInfo?.description}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePause}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              isPaused
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            {isPaused ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Resume</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>Pause</span>
              </span>
            )}
          </button>

          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Complete Session</span>
          </button>
        </div>

        {/* Estimated vs actual time */}
        {task.estimatedTime && (
          <div className="mt-8 text-blue-200 text-sm">
            Estimated: {task.estimatedTime} min | Actual:{" "}
            {Math.ceil(elapsedTime / 60)} min
            {task.actualTime &&
              ` | Total time: ${task.actualTime + Math.ceil(elapsedTime / 60)} min`}
          </div>
        )}
      </div>

      {/* Countdown completion notification */}
      {showCompletionNotification && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Timer Complete!
            </h3>
            <p className="text-gray-700 mb-2">
              {getCountdownCompletionMessage(targetDuration || 0)}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Total time worked: {formatElapsed(elapsedTime)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleContinueWorking}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Keep Working
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ambient particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-indigo-400 rounded-full opacity-30 animate-bounce"></div>
      </div>
    </div>
  );
}
