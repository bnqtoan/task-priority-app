import { useState } from "react";
import { Clock, Flame, FileText, ChevronDown, ChevronUp } from "lucide-react";
import type { TimeEntry } from "../../utils/types";

interface TimeEntryListProps {
  timeEntries?: TimeEntry[];
  maxVisible?: number;
  maxHeight?: string;
  totalActualTime?: number; // Total time from task.actualTime
}

export const TimeEntryList = ({
  timeEntries,
  maxHeight = "384px",
  totalActualTime = 0,
}: TimeEntryListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate time from entries
  const entriesTotal = timeEntries?.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0;
  const hasEntries = timeEntries && timeEntries.length > 0;
  const hasLegacyTime = totalActualTime > entriesTotal;

  if (!hasEntries && !hasLegacyTime) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No time entries yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Start a focus session or add time manually to track your work
        </p>
      </div>
    );
  }

  // Show legacy time notice if there's untracked time
  if (!hasEntries && hasLegacyTime) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h5 className="text-sm font-semibold text-blue-900">
            Total Time Tracked
          </h5>
        </div>
        <p className="text-2xl font-bold text-blue-700 mb-2">
          {totalActualTime} minutes
        </p>
        <p className="text-xs text-blue-600">
          This time was tracked before detailed time entries were enabled. New sessions will appear in the history below.
        </p>
      </div>
    );
  }

  // Sort entries by most recent first
  const sortedEntries = [...(timeEntries || [])].sort((a, b) => {
    const dateA = a.endTime ? new Date(a.endTime).getTime() : new Date(a.startTime).getTime();
    const dateB = b.endTime ? new Date(b.endTime).getTime() : new Date(b.startTime).getTime();
    return dateB - dateA;
  });

  // Calculate total time (includes legacy time if exists)
  const totalMinutes = hasLegacyTime ? totalActualTime : entriesTotal;
  const legacyMinutes = hasLegacyTime ? totalActualTime - entriesTotal : 0;

  // Format date to readable string
  const formatDate = (date: Date): string => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffMs = now.getTime() - entryDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const timeStr = entryDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (diffDays === 0) {
      return `Today, ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${timeStr}`;
    } else if (diffDays < 7) {
      const dayName = entryDate.toLocaleDateString("en-US", { weekday: "long" });
      return `${dayName}, ${timeStr}`;
    } else {
      const dateStr = entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${dateStr}, ${timeStr}`;
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-semibold text-gray-700">
            📋 Time Entry History
          </h5>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {timeEntries?.length || 0} {timeEntries?.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">
            {totalMinutes} min total
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className="mt-3 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ maxHeight: maxHeight }}
        >
          {/* Show legacy time notice if applicable */}
          {hasLegacyTime && legacyMinutes > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">
                  Legacy Time Tracked
                </span>
              </div>
              <p className="text-sm font-bold text-blue-700">
                {legacyMinutes} minutes
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Tracked before detailed time entries were enabled
              </p>
            </div>
          )}

          {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Type Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  entry.type === "focus"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {entry.type === "focus" ? (
                  <Flame className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>

              {/* Entry Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      entry.type === "focus"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {entry.type === "focus" ? "🔥 Focus" : "📝 Regular"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {formatDate(entry.endTime || entry.startTime)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {entry.startTime && entry.endTime && (
                    <span>
                      {new Date(entry.startTime).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(entry.endTime).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex-shrink-0 ml-3">
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {entry.duration} min
                </div>
                {entry.duration && entry.duration >= 60 && (
                  <div className="text-xs text-gray-500">
                    {Math.floor(entry.duration / 60)}h{" "}
                    {entry.duration % 60 > 0 && `${entry.duration % 60}m`}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
