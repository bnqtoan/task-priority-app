import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { PomodoroSettings } from '../../utils/types';
import { DEFAULT_POMODORO_SETTINGS } from '../../utils/types';

interface PomodoroSettingsProps {
  isOpen: boolean;
  currentSettings: PomodoroSettings;
  onClose: () => void;
  onSave: (settings: PomodoroSettings) => void;
}

export function PomodoroSettingsComponent({
  isOpen,
  currentSettings,
  onClose,
  onSave
}: PomodoroSettingsProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    setSettings(DEFAULT_POMODORO_SETTINGS);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🍅 Pomodoro Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Work Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Work Duration
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={settings.workDuration}
                onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <input
                  type="number"
                  min="15"
                  max="60"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                />
                <span className="text-gray-600">min</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Focused work session length (15-60 minutes)</p>
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Short Break Duration
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={settings.shortBreakDuration}
                onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={settings.shortBreakDuration}
                  onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                />
                <span className="text-gray-600">min</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Short rest between work sessions (3-15 minutes)</p>
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Long Break Duration
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                />
                <span className="text-gray-600">min</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Longer rest after completing a cycle (10-30 minutes)</p>
          </div>

          {/* Pomodoros Until Long Break */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pomodoros Until Long Break
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.pomodorosUntilLongBreak}
                onChange={(e) => setSettings({ ...settings, pomodorosUntilLongBreak: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={settings.pomodorosUntilLongBreak}
                  onChange={(e) => setSettings({ ...settings, pomodorosUntilLongBreak: parseInt(e.target.value) || 4 })}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                />
                <span className="text-gray-600">🍅</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Number of work sessions before taking a long break (2-8)</p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-4 border-t">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Auto-start breaks</span>
                <p className="text-xs text-gray-500">Automatically start break timer after work session ends</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => setSettings({ ...settings, autoStartPomodoros: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Auto-start next pomodoro</span>
                <p className="text-xs text-gray-500">Automatically start work session after break ends</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={settings.playSound}
                onChange={(e) => setSettings({ ...settings, playSound: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Play completion sound</span>
                <p className="text-xs text-gray-500">Beep when a session completes</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={settings.showNotifications}
                onChange={(e) => setSettings({ ...settings, showNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Show desktop notifications</span>
                <p className="text-xs text-gray-500">Display system notification when session completes</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-lg border-t">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition"
          >
            <RotateCcw size={18} />
            <span>Reset to Defaults</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
