// Shared types for frontend and backend
export type SchedulingWindow = "today" | "this-week" | "this-month" | "someday";
export type RecurringPattern = "daily" | "weekly" | "monthly" | null;
export type SortMode = "smart" | "value" | "deadline" | "overdue";

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface Task {
  id: number;
  userId: number;
  name: string;
  notes: string | null;
  impact: number; // 1-10
  confidence: number; // 1-10
  ease: number; // 1-10
  type: "revenue" | "growth" | "operations" | "strategic" | "personal";
  timeBlock: "deep" | "collaborative" | "quick" | "systematic";
  estimatedTime: number; // in minutes
  decision: "do" | "delegate" | "delay" | "delete";
  status: "active" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  // Time tracking fields
  actualTime?: number; // total time spent in minutes
  timeEntries?: TimeEntry[];
  isInFocus?: boolean; // currently in focus mode
  focusStartedAt?: Date; // when current focus session started
  targetDuration?: number | null; // countdown timer target in minutes
  isPaused?: boolean; // whether timer is currently paused
  pausedTime?: number; // accumulated pause time in seconds
  pauseStartTime?: Date | null; // when current pause started
  // Scheduling fields
  scheduledFor?: SchedulingWindow; // when you plan to work on this
  recurringPattern?: RecurringPattern; // for recurring tasks
  lastCompletedDate?: Date; // tracks when recurring task was last completed
  streakCount?: number; // consecutive completions for recurring tasks
  deadline?: Date | null; // hard deadline for task completion
  // Subtasks
  subtasks?: Subtask[]; // checklist of subtasks
}

export interface TimeEntry {
  id: string;
  taskId: number;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes, calculated when session ends
  type: "focus" | "regular"; // focus mode or regular tracking
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICEWeights {
  impact: number; // 0-100, percentage weight
  confidence: number; // 0-100, percentage weight
  ease: number; // 0-100, percentage weight
  // Total should always equal 100
}

export interface UserPreferences {
  id: number;
  userId: number;
  preferredMethod: string;
  defaultTimeBlock?: string;
  iceWeights?: ICEWeights; // Custom ICE weights
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  name: string;
  notes?: string | null;
  impact: number;
  confidence: number;
  ease: number;
  type: Task["type"];
  timeBlock: Task["timeBlock"];
  estimatedTime: number;
  decision: Task["decision"];
  scheduledFor?: SchedulingWindow;
  recurringPattern?: RecurringPattern;
  deadline?: Date | null;
  subtasks?: Subtask[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: Task["status"];
  lastCompletedDate?: Date;
  streakCount?: number;
  isPaused?: boolean;
  pausedTime?: number;
  pauseStartTime?: Date | null;
  deadline?: Date | null;
  subtasks?: Subtask[];
}

export interface UpdatePreferencesInput {
  preferredMethod?: string;
  defaultTimeBlock?: string;
  iceWeights?: ICEWeights;
}

export interface OverviewStats {
  decisions: {
    do: { count: number; time: number };
    delegate: { count: number; time: number };
    delay: { count: number; time: number };
    delete: { count: number; time: number };
  };
  timeBlocks: {
    deep: { count: number; time: number };
    collaborative: { count: number; time: number };
    quick: { count: number; time: number };
    systematic: { count: number; time: number };
  };
  types: {
    revenue: { count: number; time: number };
    growth: { count: number; time: number };
    operations: { count: number; time: number };
    strategic: { count: number; time: number };
    personal: { count: number; time: number };
  };
  totalTasks: number;
  totalTime: number;
}

export interface AIRecommendation {
  decision: Task["decision"];
  reason: string;
}

export interface TaskRecommendations {
  [taskId: number]: AIRecommendation;
}

export type TimerMode = "countup" | "countdown";

export interface FocusSession {
  id: string;
  taskId: number;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  isActive: boolean;
  quote?: string; // motivational quote for this session
  targetDuration?: number; // countdown target in minutes, null = count-up mode
  timerMode: TimerMode;
  countdownCompletedAt?: Date; // when countdown hit zero
}

export interface FocusQuote {
  text: string;
  author: string;
}

// Pomodoro Settings
export interface PomodoroSettings {
  workDuration: number; // minutes, 15-60
  shortBreakDuration: number; // minutes, 3-15
  longBreakDuration: number; // minutes, 10-30
  pomodorosUntilLongBreak: number; // 2-8
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  playSound: boolean;
  showNotifications: boolean;
}

export interface PomodoroState {
  isEnabled: boolean;
  currentMode: "work" | "short-break" | "long-break";
  completedPomodoros: number; // in current cycle
  totalPomodorosToday: number; // daily stats
}

// Global Pomodoro Session (persists across tasks and page reloads)
export interface GlobalPomodoroSession {
  isActive: boolean; // Is there an active Pomodoro session?
  currentMode: "work" | "short-break" | "long-break";
  completedPomodoros: number; // Completed work cycles in current session
  sessionStartTime: Date; // When current phase started
  pausedTime: number; // Accumulated pause time in seconds
  isPaused: boolean; // Is the session currently paused?
  pauseStartTime: Date | null; // When current pause started
  currentTaskId: number | null; // Which task is currently focused (can change)
  todaysPomodorosCount: number; // Total completed today (all sessions)
  lastResetDate: string; // Date string for midnight reset (YYYY-MM-DD)
}

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  playSound: true,
  showNotifications: true,
};

// Scheduling-related types
export interface DailyCapacity {
  date: Date;
  totalTasks: number;
  completedTasks: number;
  estimatedMinutes: number;
  actualMinutes: number;
  remainingMinutes: number;
  utilizationPercent: number;
}

export interface TaskScheduleSuggestion {
  task: Task;
  reason: string;
  suggestedTimeBlock: Task["timeBlock"];
  priority: "high" | "medium" | "low";
}

// Reports & Analytics types
export type TimeRangePreset =
  | "today"
  | "week"
  | "month"
  | "last7"
  | "last30"
  | "last90"
  | "custom"
  | "all";

export interface DateRange {
  start: Date;
  end: Date;
  preset: TimeRangePreset;
}

export interface TimeStats {
  totalMinutes: number;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  focusSessions: number;
  pomodoros: number;
  avgTimePerTask: number;
  estimatedTime: number;
  actualTime: number;
  variance: number; // percentage
}

export interface TimeByCategory {
  category: string;
  minutes: number;
  percentage: number;
  taskCount: number;
}

export interface DailyTimeData {
  date: string;
  totalMinutes: number;
  completedTasks: number;
  focusSessions: number;
}

export interface HourlyTimeData {
  hour: number;
  minutes: number;
  label: string;
}

export interface TopTask {
  id: number;
  name: string;
  minutes: number;
  percentage: number;
  type: Task["type"];
  iceScore: number;
}

export interface ProductivityMetrics {
  score: number;
  focusTimeRatio: number;
  completionRate: number;
  estimateAccuracy: number;
  pomodoroCompletionRate: number;
  deepWorkRatio: number;
  suggestions: string[];
}

export interface ReportData {
  dateRange: DateRange;
  timeStats: TimeStats;
  byType: TimeByCategory[];
  byTimeBlock: TimeByCategory[];
  byDecision: TimeByCategory[];
  dailyData: DailyTimeData[];
  hourlyData: HourlyTimeData[];
  topTasks: TopTask[];
  productivityMetrics: ProductivityMetrics;
}

// Notes types
export type NoteCategory =
  | "daily-log"
  | "task-note"
  | "reflection"
  | "idea"
  | "meeting";

export interface NoteMetadata {
  mood?: "great" | "good" | "neutral" | "tired" | "stressed";
  energy?: "high" | "medium" | "low";
  location?: string;
  context?: string[];
}

export interface Note {
  id: number;
  userId: number;
  taskId?: number | null;
  title: string;
  content: string; // markdown
  category: NoteCategory;
  tags?: string[];
  metadata?: NoteMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  category?: NoteCategory;
  taskId?: number | null;
  tags?: string[];
  metadata?: NoteMetadata;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {}

// End-of-Day Insights types
export interface NeglectedTask {
  task: Task;
  iceScore: number;
  minutesToday: number;
  reason: string;
}

export interface TimeDistributionInsight {
  planned: { [key: string]: number };
  actual: { [key: string]: number };
  variance: { [key: string]: number };
}

export interface EnergyAlignmentInsight {
  peakHours: number[]; // hours like [9, 10, 11]
  deepWorkDuringPeak: number; // minutes
  deepWorkOffPeak: number; // minutes
  alignmentScore: number; // 0-100
  recommendation: string;
}

export interface EndOfDayInsights {
  date: Date;
  neglectedPriorities: NeglectedTask[];
  completionMomentum: {
    completed: number;
    started: number;
    completionRate: number;
    topCompletions: TopTask[];
  };
  timeDistribution: TimeDistributionInsight;
  energyAlignment: EnergyAlignmentInsight;
  focusQuality: {
    averageSessionMinutes: number;
    totalSessions: number;
    longestSession: number;
    interruptionCount: number;
  };
  tomorrowRecommendations: TaskScheduleSuggestion[];
  wins: string[];
}
