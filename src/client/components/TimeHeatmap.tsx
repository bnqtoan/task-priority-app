import { useMemo } from "react";
import type {
  DayHeatmapData,
  WeekHeatmapData,
  MonthHeatmapData,
  YearHeatmapData,
  HeatmapViewType,
} from "../../utils/types";
import { formatDuration } from "../../utils/analytics";

interface TimeHeatmapProps {
  viewType: HeatmapViewType;
  data: DayHeatmapData | WeekHeatmapData | MonthHeatmapData | YearHeatmapData;
}

const INTENSITY_COLORS = [
  "#f1f5f9", // intensity 0 - slate-100
  "#cbd5e1", // intensity 1 - slate-300
  "#94a3b8", // intensity 2 - slate-400
  "#64748b", // intensity 3 - slate-500
  "#475569", // intensity 4 - slate-600
];

// Type guards
function isDayHeatmapData(data: any): data is DayHeatmapData {
  return data && "hourlyByDay" in data;
}

function isWeekHeatmapData(data: any): data is WeekHeatmapData {
  return data && "dailyByWeek" in data && "weekLabels" in data;
}

function isMonthHeatmapData(data: any): data is MonthHeatmapData {
  return data && "dailyByMonth" in data && "monthLabel" in data;
}

function isYearHeatmapData(data: any): data is YearHeatmapData {
  return data && "monthlyByYear" in data && "yearLabels" in data;
}

export function TimeHeatmap({ viewType, data }: TimeHeatmapProps) {
  const heatmapView = useMemo(() => {
    if (viewType === "day" && isDayHeatmapData(data)) {
      return <DayHeatmapView data={data} />;
    } else if (viewType === "week" && isWeekHeatmapData(data)) {
      return <WeekHeatmapView data={data} />;
    } else if (viewType === "month" && isMonthHeatmapData(data)) {
      return <MonthHeatmapView data={data} />;
    } else if (viewType === "year" && isYearHeatmapData(data)) {
      return <YearHeatmapView data={data} />;
    } else {
      return (
        <div className="text-center py-8 text-gray-500">
          Loading heatmap data...
        </div>
      );
    }
  }, [viewType, data]);

  return (
    <div className="space-y-4">
      {heatmapView}
      <IntensityLegend />
    </div>
  );
}

function DayHeatmapView({ data }: { data: DayHeatmapData }) {
  const { hourlyByDay, peakHours, peakDays, totalMinutes } = data;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (!hourlyByDay || hourlyByDay.length === 0 || totalMinutes === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No time tracking data available for this period.
        <br />
        <span className="text-sm">
          Start using Focus Mode to track your work patterns!
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="text-sm text-gray-600 mb-2">
        Total time tracked: <span className="font-semibold">{formatDuration(totalMinutes)}</span>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-1">
            <div className="w-12"></div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-xs text-gray-500 min-w-[24px]"
              >
                {hour % 3 === 0 ? hour : ""}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {dayNames.map((dayName, dayIndex) => (
            <div key={dayName} className="flex items-center mb-1">
              <div className="w-12 text-xs font-medium text-gray-600">
                {dayName}
              </div>
              {hours.map((hour) => {
                const cell = hourlyByDay.find(
                  (c) => c.dayOfWeek === dayIndex && c.hour === hour,
                );
                const minutes = cell?.minutes || 0;
                const intensity = cell?.intensity || 0;

                return (
                  <div
                    key={`${dayName}-${hour}`}
                    className="flex-1 group relative min-w-[24px]"
                  >
                    <div
                      className="aspect-square rounded-sm border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: INTENSITY_COLORS[intensity],
                      }}
                      title={`${dayName} ${hour}:00 - ${formatDuration(minutes)}`}
                    />
                    {minutes > 0 && (
                      <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
                        {dayName} {hour}:00
                        <br />
                        {formatDuration(minutes)}
                        <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="text-sm font-semibold text-blue-900 mb-1">
            Peak Hours
          </div>
          <div className="text-xs text-blue-700">
            {peakHours.length > 0
              ? peakHours.map((h) => `${h}:00`).join(", ")
              : "No data"}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-sm font-semibold text-green-900 mb-1">
            Most Productive Days
          </div>
          <div className="text-xs text-green-700">
            {peakDays.length > 0 ? peakDays.join(", ") : "No data"}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekHeatmapView({ data }: { data: WeekHeatmapData }) {
  const { dailyByWeek, weekLabels, totalMinutes } = data;

  if (!dailyByWeek || dailyByWeek.length === 0 || totalMinutes === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No time tracking data available for weekly view
      </div>
    );
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-2">
        Total time tracked: <span className="font-semibold">{formatDuration(totalMinutes)}</span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50 text-xs font-medium text-gray-600"></th>
              {weekLabels.map((label) => (
                <th key={label} className="border p-2 bg-gray-50 text-xs font-medium text-gray-600">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayNames.map((dayName, dayIndex) => (
              <tr key={dayName}>
                <td className="border p-2 text-xs font-medium text-gray-600 bg-gray-50">
                  {dayName}
                </td>
                {weekLabels.map((_, weekIndex) => {
                  const cell = dailyByWeek.find(
                    (c) => c.dayOfWeek === dayIndex && c.weekNumber === weekIndex,
                  );
                  const minutes = cell?.minutes || 0;
                  const intensity = cell?.intensity || 0;

                  return (
                    <td
                      key={`${weekIndex}-${dayIndex}`}
                      className="border p-2 group relative cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: INTENSITY_COLORS[intensity],
                      }}
                      title={formatDuration(minutes)}
                    >
                      <div className="text-xs text-center text-gray-700 font-medium">
                        {minutes > 0 ? formatDuration(minutes) : ""}
                      </div>
                      {minutes > 0 && (
                        <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-10 left-1/2 transform -translate-x-1/2">
                          Week {weekIndex + 1} - {dayName}
                          <br />
                          {formatDuration(minutes)}
                          <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthHeatmapView({ data }: { data: MonthHeatmapData }) {
  const { dailyByMonth, monthLabel, totalMinutes } = data;

  if (!dailyByMonth || dailyByMonth.length === 0 || totalMinutes === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No time tracking data available for monthly view
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          Total time tracked: <span className="font-semibold">{formatDuration(totalMinutes)}</span>
        </div>
        <div className="text-sm font-semibold text-gray-700">{monthLabel}</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 p-1">
            {day}
          </div>
        ))}
        {dailyByMonth.map((cell) => {
          const minutes = cell.minutes;
          const intensity = cell.intensity;
          const dateObj = new Date(cell.date || "");
          const dayOfMonth = dateObj.getDate();

          return (
            <div
              key={cell.date}
              className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-400 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
              style={{
                backgroundColor: INTENSITY_COLORS[intensity],
              }}
            >
              <div className="text-lg font-bold text-gray-700">
                {dayOfMonth}
              </div>
              {minutes > 0 && (
                <>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatDuration(minutes)}
                  </div>
                  <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-14 left-1/2 transform -translate-x-1/2">
                    {dateObj.toLocaleDateString()}
                    <br />
                    {formatDuration(minutes)}
                    <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearHeatmapView({ data }: { data: YearHeatmapData }) {
  const { monthlyByYear, yearLabels, totalMinutes } = data;

  if (!monthlyByYear || monthlyByYear.length === 0 || totalMinutes === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No time tracking data available for year view
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-2">
        Total time tracked: <span className="font-semibold">{formatDuration(totalMinutes)}</span>
      </div>

      {/* Grid for each year */}
      {yearLabels.map((year) => (
        <div key={year} className="mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-2">{year}</div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {monthlyByYear
              .filter((cell) => cell.year === parseInt(year))
              .map((cell) => {
                const minutes = cell.minutes;
                const intensity = cell.intensity;

                return (
                  <div
                    key={`${year}-${cell.monthNumber}`}
                    className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-400 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: INTENSITY_COLORS[intensity],
                    }}
                  >
                    <div className="text-xs font-medium text-gray-700">
                      {cell.day}
                    </div>
                    {minutes > 0 && (
                      <>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatDuration(minutes)}
                        </div>
                        <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-14 left-1/2 transform -translate-x-1/2">
                          {cell.day} {year}
                          <br />
                          {formatDuration(minutes)}
                          <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

function IntensityLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span>Less</span>
      {INTENSITY_COLORS.map((color, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-sm border border-gray-300"
          style={{ backgroundColor: color }}
          title={`Intensity ${index}`}
        />
      ))}
      <span>More</span>
    </div>
  );
}
