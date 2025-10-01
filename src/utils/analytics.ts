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
  ReportData
} from './types';

/**
 * Calculate simple ICE score
 */
function calculateICEScore(impact: number, confidence: number, ease: number): number {
  return parseFloat(((impact + confidence + ease) / 3).toFixed(1));
}

/**
 * Get date range for a preset time period
 */
export function getDateRangeForPreset(preset: TimeRangePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today': {
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start: today, end, preset };
    }

    case 'week': {
      const start = new Date(today);
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek); // Start from Sunday
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'last7': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'last30': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'last90': {
      const start = new Date(today);
      start.setDate(start.getDate() - 89);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'all': {
      const start = new Date(2000, 0, 1); // Arbitrary early date
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end, preset };
    }

    case 'custom':
    default:
      return { start: today, end: new Date(), preset: 'custom' };
  }
}

/**
 * Filter tasks by date range
 */
export function filterTasksByDateRange(tasks: Task[], dateRange: DateRange): Task[] {
  return tasks.filter(task => {
    if (!task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    return completedDate >= dateRange.start && completedDate <= dateRange.end;
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
export function getTimeEntriesForDateRange(tasks: Task[], dateRange: DateRange): TimeEntry[] {
  const allEntries: TimeEntry[] = [];

  tasks.forEach(task => {
    if (!task.timeEntries) return;

    const filteredEntries = task.timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    allEntries.push(...filteredEntries);
  });

  return allEntries;
}

/**
 * Calculate time statistics
 */
export function calculateTimeStats(tasks: Task[], dateRange: DateRange): TimeStats {
  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);

  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;

  const focusSessions = timeEntries.filter(e => e.type === 'focus').length;
  const totalMinutes = calculateTotalTime(timeEntries);

  const estimatedTime = filteredTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
  const actualTime = totalMinutes;
  const variance = estimatedTime > 0 ? ((actualTime - estimatedTime) / estimatedTime) * 100 : 0;

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
    variance
  };
}

/**
 * Group time by category
 */
export function groupTimeByCategory<K extends keyof Task>(
  tasks: Task[],
  dateRange: DateRange,
  categoryKey: K
): TimeByCategory[] {
  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  const categoryMap = new Map<string, { minutes: number; taskCount: number }>();

  filteredTasks.forEach(task => {
    const category = String(task[categoryKey]);
    const minutes = task.actualTime || 0;

    const existing = categoryMap.get(category) || { minutes: 0, taskCount: 0 };
    categoryMap.set(category, {
      minutes: existing.minutes + minutes,
      taskCount: existing.taskCount + 1
    });
  });

  const totalMinutes = Array.from(categoryMap.values()).reduce((sum, data) => sum + data.minutes, 0);

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      minutes: data.minutes,
      percentage: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
      taskCount: data.taskCount
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Generate daily time data
 */
export function generateDailyTimeData(tasks: Task[], dateRange: DateRange): DailyTimeData[] {
  const dailyMap = new Map<string, { minutes: number; completedTasks: number; focusSessions: number }>();

  // Initialize all dates in range
  const currentDate = new Date(dateRange.start);
  while (currentDate <= dateRange.end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dailyMap.set(dateStr, { minutes: 0, completedTasks: 0, focusSessions: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual data
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  timeEntries.forEach(entry => {
    const dateStr = new Date(entry.startTime).toISOString().split('T')[0];
    const existing = dailyMap.get(dateStr);
    if (existing) {
      existing.minutes += entry.duration || 0;
      if (entry.type === 'focus') {
        existing.focusSessions += 1;
      }
    }
  });

  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  filteredTasks.forEach(task => {
    if (task.completedAt) {
      const dateStr = new Date(task.completedAt).toISOString().split('T')[0];
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
      focusSessions: data.focusSessions
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generate hourly time data (for time-of-day insights)
 */
export function generateHourlyTimeData(tasks: Task[], dateRange: DateRange): HourlyTimeData[] {
  const hourlyMap = new Map<number, number>();

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, 0);
  }

  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  timeEntries.forEach(entry => {
    const hour = new Date(entry.startTime).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + (entry.duration || 0));
  });

  return Array.from(hourlyMap.entries())
    .map(([hour, minutes]) => ({
      hour,
      minutes,
      label: `${hour.toString().padStart(2, '0')}:00`
    }))
    .sort((a, b) => a.hour - b.hour);
}

/**
 * Get top tasks by time spent
 */
export function getTopTasks(tasks: Task[], dateRange: DateRange, limit: number = 10): TopTask[] {
  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  const totalMinutes = filteredTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);

  return filteredTasks
    .map(task => ({
      id: task.id,
      name: task.name,
      minutes: task.actualTime || 0,
      percentage: totalMinutes > 0 ? ((task.actualTime || 0) / totalMinutes) * 100 : 0,
      type: task.type,
      iceScore: calculateICEScore(task.impact, task.confidence, task.ease)
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit);
}

/**
 * Calculate productivity metrics and insights
 */
export function calculateProductivityMetrics(
  tasks: Task[],
  dateRange: DateRange,
  timeStats: TimeStats
): ProductivityMetrics {
  const suggestions: string[] = [];

  // Focus time ratio
  const timeEntries = getTimeEntriesForDateRange(tasks, dateRange);
  const focusMinutes = timeEntries.filter(e => e.type === 'focus').reduce((sum, e) => sum + (e.duration || 0), 0);
  const focusTimeRatio = timeStats.totalMinutes > 0 ? focusMinutes / timeStats.totalMinutes : 0;

  if (focusTimeRatio < 0.5) {
    suggestions.push('Try to increase focus time sessions for better concentration');
  }

  // Completion rate
  const completionRate = timeStats.totalTasks > 0 ? timeStats.completedTasks / timeStats.totalTasks : 0;

  if (completionRate < 0.7) {
    suggestions.push('Consider breaking down tasks into smaller, more manageable pieces');
  }

  // Estimate accuracy
  const estimateAccuracy = Math.abs(timeStats.variance) < 20 ? 1 - (Math.abs(timeStats.variance) / 100) : 0.8;

  if (Math.abs(timeStats.variance) > 30) {
    if (timeStats.variance > 0) {
      suggestions.push('Tasks are taking longer than estimated - consider adding buffer time');
    } else {
      suggestions.push('Tasks are finishing faster than estimated - you can be more ambitious');
    }
  }

  // Pomodoro completion rate (approximate)
  const expectedPomodoros = Math.floor(timeStats.totalMinutes / 25);
  const pomodoroCompletionRate = expectedPomodoros > 0 ? timeStats.pomodoros / expectedPomodoros : 1;

  // Deep work ratio
  const filteredTasks = filterTasksByDateRange(tasks, dateRange);
  const deepWorkMinutes = filteredTasks
    .filter(t => t.timeBlock === 'deep')
    .reduce((sum, t) => sum + (t.actualTime || 0), 0);
  const deepWorkRatio = timeStats.totalMinutes > 0 ? deepWorkMinutes / timeStats.totalMinutes : 0;

  if (deepWorkRatio < 0.3) {
    suggestions.push('Schedule more deep work blocks for complex tasks');
  }

  // Calculate overall productivity score (0-100)
  const score = Math.round(
    (focusTimeRatio * 25) +
    (completionRate * 25) +
    (estimateAccuracy * 25) +
    (deepWorkRatio * 25)
  );

  if (suggestions.length === 0) {
    suggestions.push('Great work! Keep maintaining your productive habits');
  }

  return {
    score,
    focusTimeRatio,
    completionRate,
    estimateAccuracy,
    pomodoroCompletionRate,
    deepWorkRatio,
    suggestions
  };
}

/**
 * Generate complete report data
 */
export function generateReportData(tasks: Task[], dateRange: DateRange): ReportData {
  const timeStats = calculateTimeStats(tasks, dateRange);

  return {
    dateRange,
    timeStats,
    byType: groupTimeByCategory(tasks, dateRange, 'type'),
    byTimeBlock: groupTimeByCategory(tasks, dateRange, 'timeBlock'),
    byDecision: groupTimeByCategory(tasks, dateRange, 'decision'),
    dailyData: generateDailyTimeData(tasks, dateRange),
    hourlyData: generateHourlyTimeData(tasks, dateRange),
    topTasks: getTopTasks(tasks, dateRange),
    productivityMetrics: calculateProductivityMetrics(tasks, dateRange, timeStats)
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
