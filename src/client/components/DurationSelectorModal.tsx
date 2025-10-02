import { useState } from "react";
import { X, Clock, Zap } from "lucide-react";
import type { Task, PomodoroSettings } from "../../utils/types";
import {
  parseDurationToMinutes,
  formatMinutesToDuration,
} from "../../utils/timer-modes";
import { loadPomodoroSettings } from "../../utils/pomodoro";

interface DurationSelectorModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: number | null | "pomodoro") => void;
}

const QUICK_DURATIONS = [15, 25, 30, 45, 60];

export function DurationSelectorModal({
  task,
  isOpen,
  onClose,
  onSelect,
}: DurationSelectorModalProps) {
  const [customDuration, setCustomDuration] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const pomodoroSettings: PomodoroSettings = loadPomodoroSettings();

  if (!isOpen) return null;

  const handleQuickSelect = (minutes: number) => {
    setSelectedDuration(minutes);
  };

  const handleCustomChange = (value: string) => {
    setCustomDuration(value);
    const parsed = parseDurationToMinutes(value);
    if (parsed !== null && parsed > 0) {
      setSelectedDuration(parsed);
    } else {
      setSelectedDuration(null);
    }
  };

  const handleStart = () => {
    onSelect(selectedDuration);
  };

  const handleSkipTimer = () => {
    onSelect(null);
  };

  const handlePomodoro = () => {
    onSelect("pomodoro");
  };

  const suggestedDuration = task.estimatedTime || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-blue-600" size={24} />
              Set Timer Duration
            </h2>
            <p className="text-sm text-gray-600 mt-1">For: {task.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Suggested Duration */}
        {suggestedDuration && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="text-blue-600" size={16} />
              <span className="text-gray-700">
                Estimated:{" "}
                <strong>{formatMinutesToDuration(suggestedDuration)}</strong>
              </span>
              <button
                onClick={() => handleQuickSelect(suggestedDuration)}
                className="ml-auto text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Use This
              </button>
            </div>
          </div>
        )}

        {/* Quick Select Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-5 gap-2">
            {QUICK_DURATIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleQuickSelect(minutes)}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  selectedDuration === minutes
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>

        {/* Custom Duration */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Enter Custom Duration
          </label>
          <div className="relative">
            <input
              type="text"
              value={customDuration}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g., 25 or 1:30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {customDuration && selectedDuration !== null && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {formatMinutesToDuration(selectedDuration)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter minutes (e.g., "25") or minutes:seconds (e.g., "1:30")
          </p>
        </div>

        {/* Pomodoro Option */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePomodoro}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 font-medium transition flex items-center justify-center gap-2 shadow-md"
        >
          <span className="text-xl">🍅</span>
          <div className="text-left">
            <div className="font-semibold">Use Pomodoro Timer</div>
            <div className="text-xs opacity-90">
              {pomodoroSettings.workDuration} min work ·{" "}
              {pomodoroSettings.shortBreakDuration} min break
            </div>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkipTimer}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            Skip Timer
          </button>
          <button
            onClick={handleStart}
            disabled={selectedDuration === null}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              selectedDuration !== null
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedDuration !== null
              ? `Start (${formatMinutesToDuration(selectedDuration)})`
              : "Start Focus"}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          💡 Countdown/Pomodoro are visual guides. Actual time tracking
          continues regardless.
        </p>
      </div>
    </div>
  );
}
