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
    // If task has time entries, use them
    if (task.timeEntries && task.timeEntries.length > 0) {
      const filteredEntries = task.timeEntries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= dateRange.start && entryDate <= dateRange.end;
      });
      allEntries.push(...filteredEntries);
    }
    // Fallback: If task has actualTime but no timeEntries, create a synthetic entry
    else if (task.actualTime && task.actualTime > 0) {
      // Use task's updatedAt or createdAt as the entry date
      const entryDate = task.updatedAt || task.createdAt || new Date();
      const entryDateObj = new Date(entryDate);

      // Only include if within date range
      if (entryDateObj >= dateRange.start && entryDateObj <= dateRange.end) {
        allEntries.push({
          id: `synthetic-${task.id}`,
          taskId: task.id,
          startTime: entryDateObj,
          endTime: new Date(entryDateObj.getTime() + task.actualTime * 60000),
          duration: task.actualTime,
          type: 'regular'
        });
      }
    }
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

/**
 * Generate end-of-day insights for daily reflection
 */
export function generateEndOfDayInsights(
  tasks: Task[],
  date: Date = new Date()
): import('./types').EndOfDayInsights {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateRange: import('./types').DateRange = { start: today, end: tomorrow, preset: 'today' };

  // Get time entries for today
  const todayEntries = getTimeEntriesForDateRange(tasks, dateRange);

  // Calculate neglected high-priority tasks (ICE > 7, worked < 15 mins today)
  const neglectedPriorities: import('./types').NeglectedTask[] = tasks
    .filter(t => t.status === 'active')
    .map(task => {
      const iceScore = calculateICEScore(task.impact, task.confidence, task.ease);
      const taskEntries = todayEntries.filter(e => e.taskId === task.id);
      const minutesToday = taskEntries.reduce((sum, e) => sum + (e.duration || 0), 0);

      return { task, iceScore, minutesToday };
    })
    .filter(({ iceScore, minutesToday }) => iceScore > 7 && minutesToday < 15)
    .sort((a, b) => b.iceScore - a.iceScore)
    .slice(0, 5)
    .map(({ task, iceScore, minutesToday }) => ({
      task,
      iceScore,
      minutesToday,
      reason: minutesToday === 0
        ? 'Not started today despite high priority'
        : `Only ${minutesToday} minutes invested today`
    }));

  // Completion momentum
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= today && completedDate < tomorrow;
  });

  const startedToday = tasks.filter(t => {
    const createdDate = new Date(t.createdAt);
    return createdDate >= today && createdDate < tomorrow;
  });

  const topCompletions = completedToday
    .map(task => ({
      id: task.id,
      name: task.name,
      minutes: task.actualTime || 0,
      percentage: 0, // Will be calculated if needed
      type: task.type,
      iceScore: calculateICEScore(task.impact, task.confidence, task.ease)
    }))
    .sort((a, b) => b.iceScore - a.iceScore)
    .slice(0, 3);

  // Time distribution analysis
  const plannedByType: { [key: string]: number } = {};
  const actualByType: { [key: string]: number } = {};

  tasks.filter(t => t.status !== 'archived').forEach(task => {
    plannedByType[task.type] = (plannedByType[task.type] || 0) + (task.estimatedTime || 0);
  });

  todayEntries.forEach(entry => {
    const task = tasks.find(t => t.id === entry.taskId);
    if (task) {
      actualByType[task.type] = (actualByType[task.type] || 0) + (entry.duration || 0);
    }
  });

  const variance: { [key: string]: number } = {};
  Object.keys({ ...plannedByType, ...actualByType }).forEach(type => {
    const planned = plannedByType[type] || 0;
    const actual = actualByType[type] || 0;
    variance[type] = planned > 0 ? ((actual - planned) / planned) * 100 : 0;
  });

  // Energy alignment (peak hours 9-12, 14-16)
  const peakHours = [9, 10, 11, 14, 15, 16];
  const deepWorkEntries = todayEntries.filter(e => {
    const task = tasks.find(t => t.id === e.taskId);
    return task?.timeBlock === 'deep';
  });

  const deepWorkDuringPeak = deepWorkEntries
    .filter(e => {
      const hour = new Date(e.startTime).getHours();
      return peakHours.includes(hour);
    })
    .reduce((sum, e) => sum + (e.duration || 0), 0);

  const deepWorkOffPeak = deepWorkEntries
    .reduce((sum, e) => sum + (e.duration || 0), 0) - deepWorkDuringPeak;

  const totalDeepWork = deepWorkDuringPeak + deepWorkOffPeak;
  const alignmentScore = totalDeepWork > 0
    ? Math.round((deepWorkDuringPeak / totalDeepWork) * 100)
    : 50;

  const recommendation = alignmentScore < 50
    ? 'Try scheduling deep work during peak energy hours (9-12am, 2-4pm)'
    : alignmentScore < 70
    ? 'Good alignment! Consider blocking more peak hours for deep work'
    : 'Excellent! Your deep work is well-aligned with peak energy hours';

  // Focus quality
  const focusEntries = todayEntries.filter(e => e.type === 'focus');
  const totalSessions = focusEntries.length;
  const averageSessionMinutes = totalSessions > 0
    ? focusEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / totalSessions
    : 0;
  const longestSession = totalSessions > 0
    ? Math.max(...focusEntries.map(e => e.duration || 0))
    : 0;

  // Estimate interruptions (sessions < 10 mins)
  const interruptionCount = focusEntries.filter(e => (e.duration || 0) < 10).length;

  // Tomorrow's recommendations (top 3 active tasks by ICE score with <50% time completion)
  const tomorrowRecommendations: import('./types').TaskScheduleSuggestion[] = tasks
    .filter(t => t.status === 'active')
    .map(task => ({
      task,
      iceScore: calculateICEScore(task.impact, task.confidence, task.ease),
      timeProgress: task.estimatedTime > 0 ? (task.actualTime || 0) / task.estimatedTime : 0
    }))
    .filter(({ timeProgress }) => timeProgress < 0.5)
    .sort((a, b) => b.iceScore - a.iceScore)
    .slice(0, 3)
    .map(({ task }) => ({
      task,
      reason: `High ICE score (${calculateICEScore(task.impact, task.confidence, task.ease).toFixed(1)}) with progress to make`,
      suggestedTimeBlock: task.timeBlock,
      priority: 'high' as const
    }));

  // Wins (completed tasks descriptions)
  const wins = completedToday.map(t => `✅ ${t.name}`);
  if (wins.length === 0) {
    wins.push('Focus on progress, not perfection. Every small step counts!');
  }

  return {
    date: today,
    neglectedPriorities,
    completionMomentum: {
      completed: completedToday.length,
      started: startedToday.length,
      completionRate: startedToday.length > 0 ? completedToday.length / startedToday.length : 0,
      topCompletions
    },
    timeDistribution: {
      planned: plannedByType,
      actual: actualByType,
      variance
    },
    energyAlignment: {
      peakHours,
      deepWorkDuringPeak,
      deepWorkOffPeak,
      alignmentScore,
      recommendation
    },
    focusQuality: {
      averageSessionMinutes,
      totalSessions,
      longestSession,
      interruptionCount
    },
    tomorrowRecommendations,
    wins
  };
}
