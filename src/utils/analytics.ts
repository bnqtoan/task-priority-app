import type {
  Task,
  TimeEntry,
  DateRange,
  TimeRangePreset,
  TimeStats,
  TimeByCategory,
  DailyTimeData,
  HourlyTimeData,
  TopTask,
  ProductivityMetrics,
  ReportData,
  HeatmapCell,
  DailyHeatmapData,
  WeeklyHeatmapData,
  MonthlyHeatmapData,
} from "./types";

/**
 * Normalize date values to ensure consistent Date objects
 * Handles API responses where dates may be strings or numbers
 */
function ensureDate(value: Date | string | number | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  return new Date(value);
}

/**
 * Calculate simple ICE score
 */
function calculateICEScore(
  impact: number,
  confidence: number,
  ease: number,
): number {
  return parseFloat(((impact + confidence + ease) / 3).toFixed(1));
}

/**
 * Get date range for a preset time period
 */
export function getDateRangeForPreset(preset: TimeRangePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today": {
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start: today, end, preset };
    }

    case "week": {
      const start = new Date(today);
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek); // Start from Sunday
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "last7": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "last30": {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "last90": {
      const start = new Date(today);
      start.setDate(start.getDate() - 89);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "all": {
      const start = new Date(2000, 0, 1); // Arbitrary early date
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case "custom":
    default:
      return { start: today, end: new Date(), preset: "custom" };
  }
}

/**
 * Filter tasks by date range
 * Includes tasks that were completed OR have time entries within the range
 */
export function filterTasksByDateRange(
  tasks: Task[],
  dateRange: DateRange,
): Task[] {
  return tasks.filter((task) => {
    // Include if task was completed in the range
    if (task.completedAt) {
      const completedDate = ensureDate(task.completedAt);
      if (completedDate >= dateRange.start && completedDate <= dateRange.end) {
        return true;
      }
    }

    // Include if task has time entries in the range
    if (task.timeEntries && task.timeEntries.length > 0) {
      const hasEntriesInRange = task.timeEntries.some((entry) => {
        const entryDate = ensureDate(entry.startTime);
        return entryDate >= dateRange.start && entryDate <= dateRange.end;
      });
      if (hasEntriesInRange) {
        return true;
      }
    }

    // Include if task has actualTime and was created/updated in range (fallback)
    if (task.actualTime && task.actualTime > 0) {
      const taskDate = ensureDate(task.updatedAt || task.createdAt);
      if (taskDate >= dateRange.start && taskDate <= dateRange.end) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Calculate total time from time entries
 */
export function calculateTotalTime(timeEntries: TimeEntry[]): number {
  return timeEntries.reduce((sum, entry) => {
    return sum + (entry.duration || 0);
  }, 0);
}

/**
 * Get all time entries for tasks in date range
 */
export function getTimeEntriesForDateRange(
  tasks: Task[],
  dateRange: DateRange,
): TimeEntry[] {
  const allEntries: TimeEntry[] = [];

  tasks.forEach((task) => {
    // If task has time entries, use them
    if (task.timeEntries && task.timeEntries.length > 0) {
      const filteredEntries = task.timeEntries.filter((entry) => {
        const entryDate = ensureDate(entry.startTime);
        return entryDate >= dateRange.start && entryDate <= dateRange.end;
      });
      allEntries.push(...filteredEntries);
    }
  });

  return allEntries;
}

/**
 * Calculate time statistics
 */
export function calculateTimeStats(
  tasks: Task[],
  dateRange: DateRange,
): TimeStats {
  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);

  const completedTasks = filteredTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const activeTasks = tasks.filter((t) => t.status === "active").length;

  const focusSessions = timeEntries.filter((e) => e.type === "focus").length;
  const totalMinutes = calculateTotalTime(timeEntries);

  const estimatedTime = filteredTasks.reduce(
    (sum, task) => sum + (task.estimatedTime || 0),
    0,
  );
  const actualTime = totalMinutes;
  const variance =
    estimatedTime > 0
      ? ((actualTime - estimatedTime) / estimatedTime) * 100
      : 0;

  return {
    totalMinutes,
    totalTasks: filteredTasks.length,
    completedTasks,
    activeTasks,
    focusSessions,
    pomodoros: Math.floor(totalMinutes / 25), // Approximate pomodoros
    avgTimePerTask: completedTasks > 0 ? totalMinutes / completedTasks : 0,
    estimatedTime,
    actualTime,
    variance,
  };
}

/**
 * Group time by category using actual time entries
 */
export function groupTimeByCategory<K extends keyof Task>(
  tasks: Task[],
  dateRange: DateRange,
  categoryKey: K,
): TimeByCategory[] {
  const categoryMap = new Map<string, { minutes: number; taskCount: Set<number> }>();
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);

  // Map time entries to categories
  timeEntries.forEach((entry) => {
    const task = tasks.find((t) => t.id === entry.taskId);
    if (task) {
      const category = String(task[categoryKey]);
      const existing = categoryMap.get(category) || { minutes: 0, taskCount: new Set<number>() };
      categoryMap.set(category, {
        minutes: existing.minutes + (entry.duration || 0),
        taskCount: existing.taskCount.add(task.id),
      });
    }
  });

  const totalMinutes = Array.from(categoryMap.values()).reduce(
    (sum, data) => sum + data.minutes,
    0,
  );

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      minutes: data.minutes,
      percentage: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
      taskCount: data.taskCount.size,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Generate daily time data
 */
export function generateDailyTimeData(
  tasks: Task[],
  dateRange: DateRange,
): DailyTimeData[] {
  const dailyMap = new Map<
    string,
    { minutes: number; completedTasks: number; focusSessions: number }
  >();

  // Initialize all dates in range
  const currentDate = new Date(dateRange.start);
  while (currentDate <= dateRange.end) {
    const dateStr = currentDate.toISOString().split("T")[0];
    dailyMap.set(dateStr, { minutes: 0, completedTasks: 0, focusSessions: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual data
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  timeEntries.forEach((entry) => {
    const dateStr = ensureDate(entry.startTime).toISOString().split("T")[0];
    const existing = dailyMap.get(dateStr);
    if (existing) {
      existing.minutes += entry.duration || 0;
      if (entry.type === "focus") {
        existing.focusSessions += 1;
      }
    }
  });

  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  filteredTasks.forEach((task) => {
    if (task.completedAt) {
      const dateStr = ensureDate(task.completedAt).toISOString().split("T")[0];
      const existing = dailyMap.get(dateStr);
      if (existing) {
        existing.completedTasks += 1;
      }
    }
  });

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      totalMinutes: data.minutes,
      completedTasks: data.completedTasks,
      focusSessions: data.focusSessions,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generate hourly time data (for time-of-day insights)
 */
export function generateHourlyTimeData(
  tasks: Task[],
  dateRange: DateRange,
): HourlyTimeData[] {
  const hourlyMap = new Map<number, number>();

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, 0);
  }

  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  timeEntries.forEach((entry) => {
    const hour = ensureDate(entry.startTime).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + (entry.duration || 0));
  });

  return Array.from(hourlyMap.entries())
    .map(([hour, minutes]) => ({
      hour,
      minutes,
      label: `${hour.toString().padStart(2, "0")}:00`,
    }))
    .sort((a, b) => a.hour - b.hour);
}

/**
 * Get top tasks by time spent using actual time entries in date range
 */
export function getTopTasks(
  tasks: Task[],
  dateRange: DateRange,
  limit: number = 10,
): TopTask[] {
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  const taskTimeMap = new Map<number, number>();

  // Calculate time per task from entries
  timeEntries.forEach((entry) => {
    const existing = taskTimeMap.get(entry.taskId) || 0;
    taskTimeMap.set(entry.taskId, existing + (entry.duration || 0));
  });

  const totalMinutes = Array.from(taskTimeMap.values()).reduce((sum, m) => sum + m, 0);

  // Map to task details
  const topTasksData = Array.from(taskTimeMap.entries())
    .map(([taskId, minutes]) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;
      return {
        id: task.id,
        name: task.name,
        minutes,
        percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
        type: task.type,
        iceScore: calculateICEScore(task.impact, task.confidence, task.ease),
      };
    })
    .filter((t): t is TopTask => t !== null)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit);

  return topTasksData;
}

/**
 * Calculate productivity metrics and insights
 */
export function calculateProductivityMetrics(
  tasks: Task[],
  dateRange: DateRange,
  timeStats: TimeStats,
): ProductivityMetrics {
  const suggestions: string[] = [];

  // Focus time ratio
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  const focusMinutes = timeEntries
    .filter((e) => e.type === "focus")
    .reduce((sum, e) => sum + (e.duration || 0), 0);
  const focusTimeRatio =
    timeStats.totalMinutes > 0 ? focusMinutes / timeStats.totalMinutes : 0;

  if (focusTimeRatio < 0.5) {
    suggestions.push(
      "Try to increase focus time sessions for better concentration",
    );
  }

  // Completion rate
  const completionRate =
    timeStats.totalTasks > 0
      ? timeStats.completedTasks / timeStats.totalTasks
      : 0;

  if (completionRate < 0.7) {
    suggestions.push(
      "Consider breaking down tasks into smaller, more manageable pieces",
    );
  }

  // Estimate accuracy
  const estimateAccuracy =
    Math.abs(timeStats.variance) < 20
      ? 1 - Math.abs(timeStats.variance) / 100
      : 0.8;

  if (Math.abs(timeStats.variance) > 30) {
    if (timeStats.variance > 0) {
      suggestions.push(
        "Tasks are taking longer than estimated - consider adding buffer time",
      );
    } else {
      suggestions.push(
        "Tasks are finishing faster than estimated - you can be more ambitious",
      );
    }
  }

  // Pomodoro completion rate (approximate)
  const expectedPomodoros = Math.floor(timeStats.totalMinutes / 25);
  const pomodoroCompletionRate =
    expectedPomodoros > 0 ? timeStats.pomodoros / expectedPomodoros : 1;

  // Deep work ratio using time entries
  const deepWorkMinutes = timeEntries
    .filter((entry) => {
      const task = tasks.find((t) => t.id === entry.taskId);
      return task?.timeBlock === "deep";
    })
    .reduce((sum, e) => sum + (e.duration || 0), 0);
  const deepWorkRatio =
    timeStats.totalMinutes > 0 ? deepWorkMinutes / timeStats.totalMinutes : 0;

  if (deepWorkRatio < 0.3) {
    suggestions.push("Schedule more deep work blocks for complex tasks");
  }

  // Calculate overall productivity score (0-100)
  const score = Math.round(
    focusTimeRatio * 25 +
      completionRate * 25 +
      estimateAccuracy * 25 +
      deepWorkRatio * 25,
  );

  if (suggestions.length === 0) {
    suggestions.push("Great work! Keep maintaining your productive habits");
  }

  return {
    score,
    focusTimeRatio,
    completionRate,
    estimateAccuracy,
    pomodoroCompletionRate,
    deepWorkRatio,
    suggestions,
  };
}

/**
 * Generate complete report data
 */
export function generateReportData(
  tasks: Task[],
  dateRange: DateRange,
): ReportData {
  const timeStats = calculateTimeStats(tasks, dateRange);

  return {
    dateRange,
    timeStats,
    byType: groupTimeByCategory(tasks, dateRange, "type"),
    byTimeBlock: groupTimeByCategory(tasks, dateRange, "timeBlock"),
    byDecision: groupTimeByCategory(tasks, dateRange, "decision"),
    dailyData: generateDailyTimeData(tasks, dateRange),
    hourlyData: generateHourlyTimeData(tasks, dateRange),
    topTasks: getTopTasks(tasks, dateRange),
    productivityMetrics: calculateProductivityMetrics(
      tasks,
      dateRange,
      timeStats,
    ),
  };
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Generate end-of-day insights for daily reflection
 */
export function generateEndOfDayInsights(
  tasks: Task[],
  date: Date = new Date(),
): import("./types").EndOfDayInsights {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateRange: import("./types").DateRange = {
    start: today,
    end: tomorrow,
    preset: "today",
  };

  // Get time entries for today
  const todayEntries = getTimeEntriesForDateRange(tasks, dateRange);

  // Calculate neglected high-priority tasks (ICE > 7, worked < 15 mins today)
  const neglectedPriorities: import("./types").NeglectedTask[] = tasks
    .filter((t) => t.status === "active")
    .map((task) => {
      const iceScore = calculateICEScore(
        task.impact,
        task.confidence,
        task.ease,
      );
      const taskEntries = todayEntries.filter((e) => e.taskId === task.id);
      const minutesToday = taskEntries.reduce(
        (sum, e) => sum + (e.duration || 0),
        0,
      );

      return { task, iceScore, minutesToday };
    })
    .filter(({ iceScore, minutesToday }) => iceScore > 7 && minutesToday < 15)
    .sort((a, b) => b.iceScore - a.iceScore)
    .slice(0, 5)
    .map(({ task, iceScore, minutesToday }) => ({
      task,
      iceScore,
      minutesToday,
      reason:
        minutesToday === 0
          ? "Not started today despite high priority"
          : `Only ${minutesToday} minutes invested today`,
    }));

  // Completion momentum
  const completedToday = tasks.filter((t) => {
    if (!t.completedAt) return false;
    const completedDate = ensureDate(t.completedAt);
    return completedDate >= today && completedDate < tomorrow;
  });

  const startedToday = tasks.filter((t) => {
    const createdDate = ensureDate(t.createdAt);
    return createdDate >= today && createdDate < tomorrow;
  });

  const topCompletions = completedToday
    .map((task) => ({
      id: task.id,
      name: task.name,
      minutes: task.actualTime || 0,
      percentage: 0, // Will be calculated if needed
      type: task.type,
      iceScore: calculateICEScore(task.impact, task.confidence, task.ease),
    }))
    .sort((a, b) => b.iceScore - a.iceScore)
    .slice(0, 3);

  // Time distribution analysis
  const plannedByType: { [key: string]: number } = {};
  const actualByType: { [key: string]: number } = {};

  tasks
    .filter((t) => t.status !== "archived")
    .forEach((task) => {
      plannedByType[task.type] =
        (plannedByType[task.type] || 0) + (task.estimatedTime || 0);
    });

  todayEntries.forEach((entry) => {
    const task = tasks.find((t) => t.id === entry.taskId);
    if (task) {
      actualByType[task.type] =
        (actualByType[task.type] || 0) + (entry.duration || 0);
    }
  });

  const variance: { [key: string]: number } = {};
  Object.keys({ ...plannedByType, ...actualByType }).forEach((type) => {
    const planned = plannedByType[type] || 0;
    const actual = actualByType[type] || 0;
    variance[type] = planned > 0 ? ((actual - planned) / planned) * 100 : 0;
  });

  // Energy alignment (peak hours 9-12, 14-16)
  const peakHours = [9, 10, 11, 14, 15, 16];
  const deepWorkEntries = todayEntries.filter((e) => {
    const task = tasks.find((t) => t.id === e.taskId);
    return task?.timeBlock === "deep";
  });

  const deepWorkDuringPeak = deepWorkEntries
    .filter((e) => {
      const hour = ensureDate(e.startTime).getHours();
      return peakHours.includes(hour);
    })
    .reduce((sum, e) => sum + (e.duration || 0), 0);

  const deepWorkOffPeak =
    deepWorkEntries.reduce((sum, e) => sum + (e.duration || 0), 0) -
    deepWorkDuringPeak;

  const totalDeepWork = deepWorkDuringPeak + deepWorkOffPeak;
  const alignmentScore =
    totalDeepWork > 0
      ? Math.round((deepWorkDuringPeak / totalDeepWork) * 100)
      : 50;

  const recommendation =
    alignmentScore < 50
      ? "Try scheduling deep work during peak energy hours (9-12am, 2-4pm)"
      : alignmentScore < 70
        ? "Good alignment! Consider blocking more peak hours for deep work"
        : "Excellent! Your deep work is well-aligned with peak energy hours";

  // Focus quality
  const focusEntries = todayEntries.filter((e) => e.type === "focus");
  const totalSessions = focusEntries.length;
  const averageSessionMinutes =
    totalSessions > 0
      ? focusEntries.reduce((sum, e) => sum + (e.duration || 0), 0) /
        totalSessions
      : 0;
  const longestSession =
    totalSessions > 0
      ? Math.max(...focusEntries.map((e) => e.duration || 0))
      : 0;

  // Estimate interruptions (sessions < 10 mins)
  const interruptionCount = focusEntries.filter(
    (e) => (e.duration || 0) < 10,
  ).length;

  // Tomorrow's recommendations (top 3 active tasks by ICE score with <50% time completion)
  const tomorrowRecommendations: import("./types").TaskScheduleSuggestion[] =
    tasks
      .filter((t) => t.status === "active")
      .map((task) => ({
        task,
        iceScore: calculateICEScore(task.impact, task.confidence, task.ease),
        timeProgress:
          task.estimatedTime > 0
            ? (task.actualTime || 0) / task.estimatedTime
            : 0,
      }))
      .filter(({ timeProgress }) => timeProgress < 0.5)
      .sort((a, b) => b.iceScore - a.iceScore)
      .slice(0, 3)
      .map(({ task }) => ({
        task,
        reason: `High ICE score (${calculateICEScore(task.impact, task.confidence, task.ease).toFixed(1)}) with progress to make`,
        suggestedTimeBlock: task.timeBlock,
        priority: "high" as const,
      }));

  // Wins (completed tasks descriptions)
  const wins = completedToday.map((t) => `✅ ${t.name}`);
  if (wins.length === 0) {
    wins.push("Focus on progress, not perfection. Every small step counts!");
  }

  return {
    date: today,
    neglectedPriorities,
    completionMomentum: {
      completed: completedToday.length,
      started: startedToday.length,
      completionRate:
        startedToday.length > 0
          ? completedToday.length / startedToday.length
          : 0,
      topCompletions,
    },
    timeDistribution: {
      planned: plannedByType,
      actual: actualByType,
      variance,
    },
    energyAlignment: {
      peakHours,
      deepWorkDuringPeak,
      deepWorkOffPeak,
      alignmentScore,
      recommendation,
    },
    focusQuality: {
      averageSessionMinutes,
      totalSessions,
      longestSession,
      interruptionCount,
    },
    tomorrowRecommendations,
    wins,
  };
}

/**
 * Calculate intensity level (0-4) based on minutes
 */
function calculateIntensity(minutes: number, maxMinutes: number): number {
  if (maxMinutes === 0) return 0;
  const ratio = minutes / maxMinutes;
  if (ratio === 0) return 0;
  if (ratio <= 0.2) return 1;
  if (ratio <= 0.4) return 2;
  if (ratio <= 0.7) return 3;
  return 4;
}

/**
 * Generate daily heatmap (24 hours × 7 days of week)
 */
export function generateDailyHeatmap(
  tasks: Task[],
  dateRange: DateRange,
): DailyHeatmapData {
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize grid: 7 days × 24 hours
  const grid = new Map<string, number>(); // key: "day-hour"
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      grid.set(`${day}-${hour}`, 0);
    }
  }

  // Fill grid with actual data
  timeEntries.forEach((entry) => {
    const entryDate = ensureDate(entry.startTime);
    const dayOfWeek = entryDate.getDay();
    const hour = entryDate.getHours();
    const key = `${dayOfWeek}-${hour}`;
    grid.set(key, (grid.get(key) || 0) + (entry.duration || 0));
  });

  // Find max for intensity calculation
  const maxMinutes = Math.max(...Array.from(grid.values()));

  // Convert to heatmap cells
  const hourlyByDay: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`;
      const minutes = grid.get(key) || 0;
      hourlyByDay.push({
        hour,
        day: dayNames[day],
        dayOfWeek: day,
        minutes,
        intensity: calculateIntensity(minutes, maxMinutes),
      });
    }
  }

  // Calculate peak hours (highest total across all days)
  const hourlyTotals = new Map<number, number>();
  for (let hour = 0; hour < 24; hour++) {
    let total = 0;
    for (let day = 0; day < 7; day++) {
      total += grid.get(`${day}-${hour}`) || 0;
    }
    hourlyTotals.set(hour, total);
  }

  const peakHours = Array.from(hourlyTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => hour);

  const leastActiveHours = Array.from(hourlyTotals.entries())
    .filter(([, minutes]) => minutes > 0)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([hour]) => hour);

  return {
    hourlyByDay,
    maxMinutes,
    peakHours,
    leastActiveHours,
  };
}

/**
 * Generate weekly heatmap (7 days × multiple weeks)
 */
export function generateWeeklyHeatmap(
  tasks: Task[],
  dateRange: DateRange,
): WeeklyHeatmapData {
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group by week and day
  const grid = new Map<string, number>(); // key: "week-day"

  timeEntries.forEach((entry) => {
    const entryDate = ensureDate(entry.startTime);
    const dayOfWeek = entryDate.getDay();

    // Calculate week number from start date
    const weekStart = new Date(dateRange.start);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start from Sunday
    const diffTime = entryDate.getTime() - weekStart.getTime();
    const weekNumber = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

    const key = `${weekNumber}-${dayOfWeek}`;
    grid.set(key, (grid.get(key) || 0) + (entry.duration || 0));
  });

  const maxMinutes = Math.max(...Array.from(grid.values()), 0);

  // Convert to heatmap cells
  const dailyByWeek: HeatmapCell[] = Array.from(grid.entries()).map(
    ([key, minutes]) => {
      const [weekNum, dayNum] = key.split("-").map(Number);
      return {
        day: `W${weekNum + 1} ${dayNames[dayNum]}`,
        dayOfWeek: dayNum,
        minutes,
        intensity: calculateIntensity(minutes, maxMinutes),
      };
    },
  );

  // Calculate peak days
  const dayTotals = new Map<number, number>();
  for (let day = 0; day < 7; day++) {
    const total = Array.from(grid.entries())
      .filter(([key]) => key.endsWith(`-${day}`))
      .reduce((sum, [, minutes]) => sum + minutes, 0);
    dayTotals.set(day, total);
  }

  const peakDays = Array.from(dayTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => dayNames[day]);

  return {
    dailyByWeek,
    maxMinutes,
    peakDays,
  };
}

/**
 * Generate monthly heatmap (calendar view)
 */
export function generateMonthlyHeatmap(
  tasks: Task[],
  dateRange: DateRange,
): MonthlyHeatmapData {
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);

  // Group by date
  const grid = new Map<string, number>(); // key: "YYYY-MM-DD"

  timeEntries.forEach((entry) => {
    const entryDate = ensureDate(entry.startTime);
    const dateStr = entryDate.toISOString().split("T")[0];
    grid.set(dateStr, (grid.get(dateStr) || 0) + (entry.duration || 0));
  });

  const maxMinutes = Math.max(...Array.from(grid.values()), 0);

  // Convert to heatmap cells
  const dailyByMonth: HeatmapCell[] = Array.from(grid.entries())
    .map(([dateStr, minutes]) => {
      const date = new Date(dateStr);
      return {
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayOfWeek: date.getDay(),
        minutes,
        intensity: calculateIntensity(minutes, maxMinutes),
      };
    })
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  // Find peak dates
  const peakDates = Array.from(grid.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([date]) => date);

  return {
    dailyByMonth,
    maxMinutes,
    peakDates,
  };
}
