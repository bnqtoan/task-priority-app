import { useMemo } from "react";
import type {
  DailyHeatmapData,
  WeeklyHeatmapData,
  MonthlyHeatmapData,
} from "../../utils/types";
import { formatDuration } from "../../utils/analytics";

type HeatmapMode = "daily" | "weekly" | "monthly";

interface TimeHeatmapProps {
  mode: HeatmapMode;
  data: DailyHeatmapData | WeeklyHeatmapData | MonthlyHeatmapData;
}

const INTENSITY_COLORS = [
  "#f1f5f9", // intensity 0 - slate-100
  "#cbd5e1", // intensity 1 - slate-300
  "#94a3b8", // intensity 2 - slate-400
  "#64748b", // intensity 3 - slate-500
  "#475569", // intensity 4 - slate-600
];

export function TimeHeatmap({ mode, data }: TimeHeatmapProps) {
  const heatmapView = useMemo(() => {
    if (mode === "daily") {
      return <DailyHeatmapView data={data as DailyHeatmapData} />;
    } else if (mode === "weekly") {
      return <WeeklyHeatmapView data={data as WeeklyHeatmapData} />;
    } else {
      return <MonthlyHeatmapView data={data as MonthlyHeatmapData} />;
    }
  }, [mode, data]);

  return (
    <div className="space-y-4">
      {heatmapView}
      <IntensityLegend />
    </div>
  );
}

function DailyHeatmapView({ data }: { data: DailyHeatmapData }) {
  const { hourlyByDay, peakHours, leastActiveHours } = data;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-3">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-1">
            <div className="w-12"></div> {/* Space for day labels */}
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
                    {/* Tooltip on hover */}
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
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-sm font-semibold text-orange-900 mb-1">
            Least Active Hours
          </div>
          <div className="text-xs text-orange-700">
            {leastActiveHours.length > 0
              ? leastActiveHours.map((h) => `${h}:00`).join(", ")
              : "No quiet periods"}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyHeatmapView({ data }: { data: WeeklyHeatmapData }) {
  const { dailyByWeek, peakDays } = data;

  return (
    <div className="space-y-3">
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dailyByWeek.map((cell, index) => {
          const minutes = cell.minutes;
          const intensity = cell.intensity;

          return (
            <div
              key={index}
              className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-400 transition-all cursor-pointer"
              style={{
                backgroundColor: INTENSITY_COLORS[intensity],
              }}
            >
              <div className="text-xs font-medium text-gray-700 mb-1">
                {cell.day}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatDuration(minutes)}
              </div>

              {/* Tooltip */}
              {minutes > 0 && (
                <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-10 left-1/2 transform -translate-x-1/2">
                  {cell.day}
                  <br />
                  {formatDuration(minutes)}
                  <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="text-sm font-semibold text-green-900 mb-1">
          Most Productive Days
        </div>
        <div className="text-xs text-green-700">
          {peakDays.length > 0 ? peakDays.join(", ") : "No data"}
        </div>
      </div>
    </div>
  );
}

function MonthlyHeatmapView({ data }: { data: MonthlyHeatmapData }) {
  const { dailyByMonth, peakDates } = data;

  return (
    <div className="space-y-3">
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
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
              <div className="text-xs text-gray-600">{cell.day}</div>

              {/* Tooltip */}
              {minutes > 0 && (
                <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-14 left-1/2 transform -translate-x-1/2">
                  {dateObj.toLocaleDateString()}
                  <br />
                  {formatDuration(minutes)}
                  <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <div className="text-sm font-semibold text-purple-900 mb-1">
          Top 5 Most Productive Days
        </div>
        <div className="text-xs text-purple-700 space-y-1">
          {peakDates.length > 0
            ? peakDates.map((dateStr, idx) => (
                <div key={dateStr}>
                  {idx + 1}. {new Date(dateStr).toLocaleDateString()}
                </div>
              ))
            : "No data"}
        </div>
      </div>
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
