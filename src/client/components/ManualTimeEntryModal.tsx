import { useState } from "react";
import { X, Clock, Save } from "lucide-react";
import { NumberInput } from "./NumberInput";

interface ManualTimeEntryModalProps {
  taskName: string;
  onClose: () => void;
  onSubmit: (duration: number, type: "focus" | "regular") => Promise<void>;
}

export const ManualTimeEntryModal = ({
  taskName,
  onClose,
  onSubmit,
}: ManualTimeEntryModalProps) => {
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState<"focus" | "regular">("regular");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (duration <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(duration, type);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add time entry");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add Time Entry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
              {taskName}
            </div>
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <NumberInput
              value={duration}
              onChange={setDuration}
              min={1}
              max={1440}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Quick increments: +5, +15, +30, +60 minutes
            </p>
          </div>

          {/* Quick Duration Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    duration === mins
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={isSubmitting}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "focus" | "regular")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="regular">📝 Regular Work</option>
              <option value="focus">🔥 Focus Session</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {type === "focus"
                ? "Deep, concentrated work"
                : "General task work"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || duration <= 0}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Add Time</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
