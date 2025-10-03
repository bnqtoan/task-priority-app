import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  Archive,
  X,
  Play,
  Settings,
  Info,
  HelpCircle,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { api } from "../lib/api";
import { taskStorage } from "../../lib/storage";
import { APP_CONFIG } from "../../utils/config";
import { DemoNotice } from "../components/DemoNotice";
import { FocusModeModal } from "../components/FocusModeModal";
import { DurationSelectorModal } from "../components/DurationSelectorModal";
import { ICEWeightsSettings } from "../components/ICEWeightsSettings";
import { PomodoroSettingsComponent } from "../components/PomodoroSettings";
import { GlobalPomodoroWidget } from "../components/GlobalPomodoroWidget";
import { QuickAddFAB } from "../components/QuickAddFAB";
import { NumberInput } from "../components/NumberInput";
import {
  calculateICE,
  calculateWeightedICE,
  getDecisionInfo,
  getTimeBlockInfo,
  DEFAULT_ICE_WEIGHTS,
} from "../lib/helpers";
import {
  getDecisionRecommendation,
  calculateFinalPriority,
} from "../../utils/algorithms";
import {
  getUrgencyInfo,
  formatDeadline,
  isOverdue,
  getUrgencyTier,
} from "../../utils/urgency";
import {
  loadPomodoroSettings,
  savePomodoroSettings,
} from "../../utils/pomodoro";
import { calculateRemaining, formatCountdown } from "../../utils/timer-modes";
import type {
  Task,
  CreateTaskInput,
  User,
  OverviewStats,
  ICEWeights,
  SchedulingWindow,
  RecurringPattern,
  PomodoroSettings,
} from "../../utils/types";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<CreateTaskInput>({
    name: "",
    impact: 5,
    confidence: 5,
    ease: 5,
    type: "operations",
    timeBlock: "quick",
    estimatedTime: 30,
    decision: "do",
    notes: "",
    scheduledFor: "someday",
    recurringPattern: null,
    deadline: null,
    subtasks: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("hybrid");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortMode, setSortMode] = useState<"smart" | "value" | "deadline" | "overdue">("smart");

  // Debounced update functionality
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [localTaskValues, setLocalTaskValues] = useState<{
    [key: string]: any;
  }>({});

  // Track active input field to preserve focus during re-sorts
  const activeInputRef = useRef<{ taskId: number; field: string } | null>(null);

  // Focus mode state
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [floatingWidgetTime, setFloatingWidgetTime] = useState(0);
  const [usePomodoroMode, setUsePomodoroMode] = useState(false);

  // Duration selector state
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [selectedTaskForFocus, setSelectedTaskForFocus] = useState<Task | null>(
    null,
  );

  // Celebration effect state
  const [showCelebration, setShowCelebration] = useState(false);

  // ICE weights state
  const [iceWeights, setIceWeights] = useState<ICEWeights>(DEFAULT_ICE_WEIGHTS);
  const [showWeightsSettings, setShowWeightsSettings] = useState(false);
  const [useWeightedScoring, setUseWeightedScoring] = useState(true);

  // Pomodoro settings
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(
    loadPomodoroSettings(),
  );

  // UI collapse states
  const [showICEGuide, setShowICEGuide] = useState(false);
  const [showDecisionStats, setShowDecisionStats] = useState(false);
  const [showTimeBlockStats, setShowTimeBlockStats] = useState(false);
  const [showFrameworkGuide, setShowFrameworkGuide] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      if (APP_CONFIG.IS_DEMO) {
        // Use storage abstraction for demo mode
        const [userRes, tasksRes, statsRes] = await Promise.all([
          taskStorage.getCurrentUser(),
          taskStorage.getTasks({ status: statusFilter }),
          taskStorage.getOverviewStats(),
        ]);
        setUser(userRes);
        setTasks(tasksRes);
        setStats(statsRes);

        // Check for active focus session
        const activeTask = tasksRes.find((t) => t.isInFocus);
        if (activeTask) {
          setFocusTask(activeTask);
          // Don't auto-open modal, just show the floating widget
          setIsFocusModeOpen(false);
        }
      } else {
        // Use API for production mode
        const [userRes, tasksRes, statsRes] = await Promise.all([
          api.getMe(),
          api.getTasks({ status: statusFilter }),
          api.getOverview(),
        ]);
        setUser(userRes);

        // Convert date strings to Date objects for all tasks
        const tasksWithDates = tasksRes.map(task => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : null,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          focusStartedAt: task.focusStartedAt ? new Date(task.focusStartedAt) : undefined,
          lastCompletedDate: task.lastCompletedDate ? new Date(task.lastCompletedDate) : undefined,
        }));

        setTasks(tasksWithDates);
        setStats(statsRes);

        // Check for active focus session
        const activeTask = tasksWithDates.find((t) => t.isInFocus);
        if (activeTask) {
          setFocusTask(activeTask);
          // Don't auto-open modal, just show the floating widget
          setIsFocusModeOpen(false);
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Reload data when status filter changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [statusFilter]);

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Restore focus after tasks are re-sorted (e.g., when ICE scores change)
  useEffect(() => {
    if (activeInputRef.current) {
      const { taskId, field } = activeInputRef.current;
      // Small delay to ensure DOM has updated after sort
      const timeoutId = setTimeout(() => {
        const input = document.querySelector(
          `input[data-task-id="${taskId}"][data-field="${field}"]`
        ) as HTMLInputElement;
        if (input && document.activeElement !== input) {
          input.focus();
          // Restore cursor to end of input
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [tasks]);

  const addTask = async (taskToAdd?: CreateTaskInput) => {
    const taskData = taskToAdd || newTask;
    if (!taskData.name.trim()) return;

    try {
      const createdTask = APP_CONFIG.IS_DEMO
        ? await taskStorage.createTask(taskData)
        : await api.createTask(taskData);

      setTasks([...tasks, createdTask]);

      // Only reset newTask if we're using the form (not QuickAdd)
      if (!taskToAdd) {
        setNewTask({
          name: "",
          impact: 5,
          confidence: 5,
          ease: 5,
          type: "operations",
          timeBlock: "quick",
          estimatedTime: 30,
          decision: "do",
          notes: "",
          scheduledFor: "someday",
          recurringPattern: null,
        });
      }

      // Refresh stats
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      if (APP_CONFIG.IS_DEMO) {
        await taskStorage.deleteTask(id);
      } else {
        await api.deleteTask(id);
      }
      setTasks(tasks.filter((t) => t.id !== id));

      // Refresh stats
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const updateTask = async (
    id: number,
    field: string,
    value: any,
    skipLocalUpdate = false,
  ) => {
    try {
      console.log("Updating task:", id, "field:", field, "value:", value);
      const updatedTask = APP_CONFIG.IS_DEMO
        ? await taskStorage.updateTask(id, { [field]: value })
        : await api.updateTask(id, { [field]: value });

      console.log("Task updated successfully:", updatedTask);

      // Convert date strings to Date objects
      if (updatedTask.deadline && typeof updatedTask.deadline === 'string') {
        updatedTask.deadline = new Date(updatedTask.deadline);
      }
      if (updatedTask.completedAt && typeof updatedTask.completedAt === 'string') {
        updatedTask.completedAt = new Date(updatedTask.completedAt);
      }
      if (updatedTask.focusStartedAt && typeof updatedTask.focusStartedAt === 'string') {
        updatedTask.focusStartedAt = new Date(updatedTask.focusStartedAt);
      }
      if (updatedTask.lastCompletedDate && typeof updatedTask.lastCompletedDate === 'string') {
        updatedTask.lastCompletedDate = new Date(updatedTask.lastCompletedDate);
      }

      // Only update tasks state if we're not in the middle of debouncing the same field
      if (!skipLocalUpdate) {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      }

      // Refresh stats if the change affects stats
      if (["decision", "timeBlock", "type", "estimatedTime"].includes(field)) {
        const updatedStats = APP_CONFIG.IS_DEMO
          ? await taskStorage.getOverviewStats()
          : await api.getOverview();
        setStats(updatedStats);
      }

      return updatedTask;
    } catch (err) {
      console.error("Failed to update task:", err);
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  };

  // Smart debounced update with adaptive delays
  const debouncedUpdateTask = useCallback(
    (id: number, field: string, value: any) => {
      // Update local state immediately for responsive UI
      setLocalTaskValues((prev) => ({
        ...prev,
        [`${id}-${field}`]: value,
      }));

      // Also update the tasks state for immediate visual feedback
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
      );

      // Clear existing timeout for this task-field combination
      const key = `${id}-${field}`;
      if (debounceTimeouts.current[key]) {
        clearTimeout(debounceTimeouts.current[key]);
      }

      // Smart delay: shorter for text fields, longer for numbers
      const isTextField = field === "name" || field === "notes";
      const debounceDelay = isTextField ? 300 : 200; // Reduced from 500ms

      // Set new timeout to update via API after delay
      debounceTimeouts.current[key] = setTimeout(async () => {
        try {
          // Get the most current value from state
          setLocalTaskValues((prev) => {
            const currentValue = prev[key];

            // If there's still a value in local state, persist it
            if (currentValue !== undefined) {
              // Async function to handle the API call
              (async () => {
                try {
                  await updateTask(id, field, currentValue, true);
                } catch (err) {
                  // On error, refresh from server
                  try {
                    const refreshedTasks = APP_CONFIG.IS_DEMO
                      ? await taskStorage.getTasks({ status: statusFilter })
                      : await api.getTasks({ status: statusFilter });
                    setTasks(refreshedTasks);
                  } catch (refreshErr) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to update task",
                    );
                  }
                }
              })();

              // Remove from local state
              const newState = { ...prev };
              delete newState[key];
              return newState;
            }

            return prev;
          });
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update task",
          );
        }
        delete debounceTimeouts.current[key];
      }, debounceDelay);
    },
    [localTaskValues, statusFilter],
  );

  // Focus mode functions
  const startFocusSession = async (task: Task) => {
    // Show duration selector first
    setSelectedTaskForFocus(task);
    setShowDurationSelector(true);
  };

  const handleDurationSelected = async (duration: number | null | "pomodoro") => {
    setShowDurationSelector(false);
    if (!selectedTaskForFocus) return;

    try {
      const updatedTask = await taskStorage.startFocusSession(
        selectedTaskForFocus.id,
      );

      // Handle Pomodoro mode
      if (duration === "pomodoro") {
        const { startGlobalPomodoroSession } = await import("../../lib/pomodoro-session");
        startGlobalPomodoroSession(selectedTaskForFocus.id);

        setTasks(
          tasks.map((t) =>
            t.id === selectedTaskForFocus.id ? updatedTask : t,
          ),
        );
        setFocusTask(updatedTask);
        setUsePomodoroMode(true);
        setIsFocusModeOpen(true);
        return;
      }

      // Save target duration to database if provided
      if (duration !== null) {
        const taskWithDuration = await taskStorage.updateTask(updatedTask.id, {
          targetDuration: duration,
        });
        setTasks(
          tasks.map((t) =>
            t.id === selectedTaskForFocus.id ? taskWithDuration : t,
          ),
        );
        setFocusTask(taskWithDuration);
      } else {
        setTasks(
          tasks.map((t) =>
            t.id === selectedTaskForFocus.id ? updatedTask : t,
          ),
        );
        setFocusTask(updatedTask);
      }

      setUsePomodoroMode(false);
      setIsFocusModeOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start focus session",
      );
    }
  };

  const handleDurationSelectorClose = () => {
    setShowDurationSelector(false);
    setSelectedTaskForFocus(null);
  };

  const handleStartGlobalPomodoro = async () => {
    // Check if there's already an active Pomodoro session
    const { hasActiveGlobalPomodoro, startGlobalPomodoroSession } = await import("../../lib/pomodoro-session");

    if (hasActiveGlobalPomodoro()) {
      alert("A Pomodoro session is already active! Check the timer widget at the top.");
      return;
    }

    // Start standalone Pomodoro session without task tracking
    // User can work on any task while the Pomodoro timer runs
    startGlobalPomodoroSession(null);
  };

  const endFocusSession = async (duration: number) => {
    if (!focusTask) return;

    try {
      const updatedTask = await taskStorage.endFocusSession(
        focusTask.id,
        duration,
      );
      setTasks(tasks.map((t) => (t.id === focusTask.id ? updatedTask : t)));
      setFocusTask(null);
      setIsFocusModeOpen(false);

      // Refresh stats to include the new time
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to end focus session",
      );
    }
  };

  const closeFocusMode = () => {
    setIsFocusModeOpen(false);
    // Keep focusTask - don't set it to null so timer keeps running in background
  };

  const reopenFocusMode = () => {
    setIsFocusModeOpen(true);
  };

  // Update floating widget timer
  useEffect(() => {
    if (!focusTask || isFocusModeOpen || !focusTask.focusStartedAt) return;

    const interval = setInterval(() => {
      const startTime = new Date(focusTask.focusStartedAt!);
      const pausedTime = focusTask.pausedTime || 0;
      const elapsed =
        Math.floor((Date.now() - startTime.getTime()) / 1000) - pausedTime;
      setFloatingWidgetTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [focusTask, isFocusModeOpen]);

  // Format time for display (HH:MM:SS or MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Search and filter tasks
  const searchAndFilterTasks = (tasksList: Task[]) => {
    let filtered = tasksList;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          (task.notes && task.notes.toLowerCase().includes(query)) ||
          task.type.toLowerCase().includes(query) ||
          task.decision.toLowerCase().includes(query),
      );
    }

    // Apply time block filter
    if (activeTab !== "all") {
      filtered = filtered.filter((t) => t.timeBlock === activeTab);
    }

    return filtered;
  };

  // Calculate ICE scores based on user preference
  const getTaskScore = (task: Task) => {
    return useWeightedScoring
      ? parseFloat(calculateWeightedICE(task, iceWeights))
      : parseFloat(calculateICE(task));
  };

  // Sort tasks based on selected sort mode
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortMode === "smart") {
      // Smart: ICE × Urgency Multiplier
      const priorityA = calculateFinalPriority(a);
      const priorityB = calculateFinalPriority(b);
      return priorityB - priorityA;
    } else if (sortMode === "value") {
      // Value: Pure ICE score
      return getTaskScore(b) - getTaskScore(a);
    } else if (sortMode === "deadline") {
      // Deadline: Sort by urgency tier, then by deadline date
      const tierDiff = getUrgencyTier(b.deadline) - getUrgencyTier(a.deadline);
      if (tierDiff !== 0) return tierDiff;

      // Within same tier, sort by deadline date (earliest first)
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    } else if (sortMode === "overdue") {
      // Overdue only: Show overdue tasks first, sorted by how overdue
      const aOverdue = isOverdue(a.deadline);
      const bOverdue = isOverdue(b.deadline);

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      if (aOverdue && bOverdue && a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime(); // Most overdue first
      }
      return 0;
    }
    return 0;
  });

  // Filter overdue mode to only show overdue tasks
  const filteredForMode = sortMode === "overdue"
    ? sortedTasks.filter(task => isOverdue(task.deadline))
    : sortedTasks;

  const filteredTasks = searchAndFilterTasks(filteredForMode);

  const handleSaveWeights = (newWeights: ICEWeights) => {
    setIceWeights(newWeights);
    // Save to localStorage for persistence
    localStorage.setItem("iceWeights", JSON.stringify(newWeights));
  };

  // Load saved weights on mount
  useEffect(() => {
    const saved = localStorage.getItem("iceWeights");
    if (saved) {
      try {
        setIceWeights(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved weights:", e);
      }
    }

    const savedUseWeighted = localStorage.getItem("useWeightedScoring");
    if (savedUseWeighted !== null) {
      setUseWeightedScoring(savedUseWeighted === "true");
    }
  }, []);

  const getDecisionStats = (decision: string) => {
    if (!stats) return { count: 0, time: 0 };
    return (
      stats.decisions[decision as keyof typeof stats.decisions] || {
        count: 0,
        time: 0,
      }
    );
  };

  const getTimeBlockStats = (block: string) => {
    if (!stats) return { count: 0, time: 0 };
    return (
      stats.timeBlocks[block as keyof typeof stats.timeBlocks] || {
        count: 0,
        time: 0,
      }
    );
  };

  const toggleRowExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const completeTask = async (id: number) => {
    try {
      const completedTask = APP_CONFIG.IS_DEMO
        ? await taskStorage.completeTask(id)
        : await api.completeTask(id);
      setTasks(tasks.map((t) => (t.id === id ? completedTask : t)));

      // Show celebration effect
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Refresh stats
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete task");
    }
  };

  const archiveTask = async (id: number) => {
    try {
      if (APP_CONFIG.IS_DEMO) {
        // For demo, we'll just mark as completed since we don't have archived status
        await taskStorage.completeTask(id);
        setTasks(
          tasks.map((t) =>
            t.id === id
              ? { ...t, status: "completed", completedAt: new Date() }
              : t,
          ),
        );
      } else {
        await api.updateTask(id, { status: "archived" });
        setTasks(
          tasks.map((t) => (t.id === id ? { ...t, status: "archived" } : t)),
        );
      }

      // Refresh stats
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive task");
    }
  };

  const reactivateTask = async (id: number) => {
    try {
      if (APP_CONFIG.IS_DEMO) {
        // For demo, we'll update the task to mark as active
        await taskStorage.updateTask(id, {
          status: "active",
          completedAt: undefined,
        });
        setTasks(
          tasks.map((t) =>
            t.id === id
              ? { ...t, status: "active", completedAt: undefined }
              : t,
          ),
        );
      } else {
        await api.updateTask(id, { status: "active" });
        setTasks(
          tasks.map((t) =>
            t.id === id
              ? { ...t, status: "active", completedAt: undefined }
              : t,
          ),
        );
      }

      // Refresh stats
      const updatedStats = APP_CONFIG.IS_DEMO
        ? await taskStorage.getOverviewStats()
        : await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reactivate task",
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <DemoNotice />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global Pomodoro Widget - Sticky at top */}
      <GlobalPomodoroWidget />

      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Minimal Elegant Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Task Priority Framework
            </h1>
            {user && (
              <p className="text-sm text-gray-500">
                Welcome, {user.name || user.email}
              </p>
            )}
          </div>

          {/* Action Buttons - Elegant & Minimal */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Primary Actions */}
            <button
              onClick={handleStartGlobalPomodoro}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              title="Start Pomodoro Session"
            >
              <span className="text-lg">🍅</span>
              <span className="hidden lg:inline">Start Pomodoro</span>
            </button>

            {/* Navigation Links */}
            <Link
              to="/focus"
              className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
              title="Focus View"
            >
              <Target size={18} />
              <span className="hidden xl:inline">Focus</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
              title="Reports & Analytics"
            >
              <TrendingUp size={18} />
              <span className="hidden xl:inline">Reports</span>
            </Link>
            <Link
              to="/notes"
              className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
              title="Notes"
            >
              <BookOpen size={18} />
              <span className="hidden xl:inline">Notes</span>
            </Link>

            {/* Settings Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                title="Settings"
              >
                <Settings size={18} />
                <span className="hidden xl:inline">Settings</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => setShowPomodoroSettings(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                >
                  🍅 Pomodoro Settings
                </button>
                <button
                  onClick={() => setShowWeightsSettings(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 rounded-b-lg"
                >
                  ⚖️ ICE Weights
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible ICE Guide */}
        <button
          onClick={() => setShowICEGuide(!showICEGuide)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors mb-3"
        >
          <Info size={16} />
          <span>{showICEGuide ? "Hide" : "Show"} ICE Framework Guide</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${showICEGuide ? "rotate-180" : ""}`}
          />
        </button>

        {showICEGuide && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">Impact:</span>
              <p className="text-gray-600 text-xs mt-1">
                Tác động đến mục tiêu (1-10)
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">Confidence:</span>
              <p className="text-gray-600 text-xs mt-1">
                Độ chắc chắn hoàn thành (1-10)
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">Ease:</span>
              <p className="text-gray-600 text-xs mt-1">
                Độ dễ thực hiện (1-10)
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold text-gray-700">ICE Score:</span>
              <p className="text-gray-600 text-xs mt-1">
                {useWeightedScoring
                  ? `Weighted: I(${iceWeights.impact}%) + C(${iceWeights.confidence}%) + E(${iceWeights.ease}%)`
                  : "Simple average of 3 factors"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Decision Stats - Compact with Expansion */}
      <div className="mb-6">
        <button
          onClick={() => setShowDecisionStats(!showDecisionStats)}
          className="w-full bg-white rounded-lg shadow p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              4D Decisions:
            </span>
            <div className="flex gap-4">
              {["do", "delegate", "delay", "delete"].map((decision) => {
                const info = getDecisionInfo(decision);
                const statsData = getDecisionStats(decision);
                return (
                  <div key={decision} className="flex items-center gap-1">
                    <span className="text-lg">{info.icon}</span>
                    <span className="font-semibold text-sm">
                      {statsData.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transform transition-transform text-gray-500 ${showDecisionStats ? "rotate-180" : ""}`}
          />
        </button>

        {showDecisionStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
            {["do", "delegate", "delay", "delete"].map((decision) => {
              const info = getDecisionInfo(decision);
              const statsData = getDecisionStats(decision);
              return (
                <div
                  key={decision}
                  className={`${info.color} border-2 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{info.icon}</span>
                      <span className="font-bold">{info.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {statsData.count} tasks
                    </span>
                  </div>
                  <p className="text-xs mb-2">{info.description}</p>
                  <p className="text-xs mt-1 font-semibold">
                    ⏱️ {statsData.time} phút
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Time Block Stats - Compact with Expansion */}
      <div className="mb-6">
        <button
          onClick={() => setShowTimeBlockStats(!showTimeBlockStats)}
          className="w-full bg-white rounded-lg shadow p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Time Blocks:
            </span>
            <div className="flex gap-4">
              {["deep", "collaborative", "quick", "systematic"].map((block) => {
                const info = getTimeBlockInfo(block);
                const statsData = getTimeBlockStats(block);
                const Icon = info.icon;
                return (
                  <div key={block} className="flex items-center gap-1">
                    <Icon size={16} />
                    <span className="font-semibold text-sm">
                      {statsData.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transform transition-transform text-gray-500 ${showTimeBlockStats ? "rotate-180" : ""}`}
          />
        </button>

        {showTimeBlockStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
            {["deep", "collaborative", "quick", "systematic"].map((block) => {
              const info = getTimeBlockInfo(block);
              const statsData = getTimeBlockStats(block);
              const Icon = info.icon;
              return (
                <div
                  key={block}
                  className={`${info.color} border-2 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon size={20} className="mr-2" />
                      <span className="font-bold">{info.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {statsData.count} tasks
                    </span>
                  </div>
                  <p className="text-xs mb-2">{info.description}</p>
                  <p className="text-xs font-medium">{info.bestTime}</p>
                  <p className="text-xs mt-1 font-semibold">
                    ⏱️ {statsData.time} phút
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Form */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        data-add-task-form
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ➕ Thêm Task Mới
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tên công việc..."
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />

          <div>
            <label className="block text-xs text-gray-600 mb-1">Impact</label>
            <NumberInput
              value={newTask.impact}
              min={1}
              max={10}
              onChange={(value) =>
                setNewTask({
                  ...newTask,
                  impact: value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Confidence
            </label>
            <NumberInput
              value={newTask.confidence}
              min={1}
              max={10}
              onChange={(value) =>
                setNewTask({
                  ...newTask,
                  confidence: value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Ease</label>
            <NumberInput
              value={newTask.ease}
              min={1}
              max={10}
              onChange={(value) =>
                setNewTask({ ...newTask, ease: value })
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={newTask.type}
              onChange={(e) =>
                setNewTask({ ...newTask, type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="revenue">💰 Revenue</option>
              <option value="growth">📈 Growth</option>
              <option value="operations">🔧 Operations</option>
              <option value="strategic">🎯 Strategic</option>
              <option value="personal">✨ Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Time Block
            </label>
            <select
              value={newTask.timeBlock}
              onChange={(e) =>
                setNewTask({ ...newTask, timeBlock: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="deep">🧠 Deep Work</option>
              <option value="collaborative">👥 Collaborative</option>
              <option value="quick">⚡ Quick Wins</option>
              <option value="systematic">🔧 Systematic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Estimated Time (phút)
            </label>
            <NumberInput
              value={newTask.estimatedTime}
              min={5}
              max={1440}
              onChange={(value) =>
                setNewTask({
                  ...newTask,
                  estimatedTime: value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              ⏰ Deadline (Optional)
            </label>
            <input
              type="date"
              value={newTask.deadline ? newTask.deadline.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  deadline: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Decision (4D Framework)
            </label>
            <select
              value={newTask.decision}
              onChange={(e) =>
                setNewTask({ ...newTask, decision: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="do">✅ DO - Làm ngay</option>
              <option value="delegate">👤 DELEGATE - Giao việc</option>
              <option value="delay">⏸️ DELAY - Hoãn lại</option>
              <option value="delete">🗑️ DELETE - Loại bỏ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              📅 Schedule For
            </label>
            <select
              value={newTask.scheduledFor}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  scheduledFor: e.target.value as SchedulingWindow,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="today">🎯 Today</option>
              <option value="this-week">📅 This Week</option>
              <option value="this-month">📊 This Month</option>
              <option value="someday">💭 Someday / Backlog</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              🔄 Recurring
            </label>
            <select
              value={newTask.recurringPattern || ""}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  recurringPattern: (e.target.value ||
                    null) as RecurringPattern,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">None</option>
              <option value="daily">🔄 Daily</option>
              <option value="weekly">📆 Weekly</option>
              <option value="monthly">📅 Monthly</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-1">
            Description / Notes
          </label>
          <textarea
            placeholder="Add detailed description, requirements, or notes about this task..."
            value={newTask.notes || ""}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
        </div>

        <button
          onClick={() => addTask()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition"
        >
          <Plus className="mr-2" size={20} />
          Thêm Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks, descriptions, types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">📋 Active Tasks</option>
              <option value="completed">✅ Completed Tasks</option>
              <option value="archived">📦 Archived Tasks</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-gray-600 font-medium">
              {filteredTasks.length} of {tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {/* AI Method Selector */}
      <div className="bg-white rounded-t-lg shadow-lg">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            🤖 AI Recommendation Method (chọn để xem sự thay đổi ngay bên dưới):
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg font-semibold text-base focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
          >
            <option value="simple">1️⃣ Simple ICE (Original)</option>
            <option value="weighted">2️⃣ Weighted Score (Impact 50%)</option>
            <option value="roi">3️⃣ ROI-Based (Time Efficiency)</option>
            <option value="eisenhower">4️⃣ Eisenhower Enhanced (Urgency)</option>
            <option value="skill">5️⃣ Skill Match (Talent Fit)</option>
            <option value="energy">6️⃣ Energy-Aware (Sustainable)</option>
            <option value="strategic">
              7️⃣ Strategic Alignment (Type-Based)
            </option>
            <option value="hybrid">8️⃣ Hybrid Smart (Recommended) ⭐</option>
          </select>
          <p className="text-xs text-gray-700 mt-2 font-medium">
            {selectedMethod === "simple" &&
              "📝 Basic method using ICE score and impact level"}
            {selectedMethod === "weighted" &&
              "⚖️ Impact (50%) > Confidence (30%) > Ease (20%)"}
            {selectedMethod === "roi" &&
              "📊 Considers ROI = Impact / Effort and time efficiency"}
            {selectedMethod === "eisenhower" &&
              "📋 Classic Important/Urgent matrix with time blocks"}
            {selectedMethod === "skill" &&
              "🎯 Matches your skills (ease) with value potential"}
            {selectedMethod === "energy" &&
              "⚡ Optimizes for energy efficiency and burnout prevention"}
            {selectedMethod === "strategic" &&
              "🎲 Prioritizes based on task type (Revenue > Strategic > Growth)"}
            {selectedMethod === "hybrid" &&
              "🔮 Combines ROI (40%), Value (30%), Strategy (30%) - Most comprehensive"}
          </p>
        </div>

        {/* Sort Mode Selector */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            🎯 Priority Sorting Mode:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setSortMode("smart")}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                sortMode === "smart"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50 border-2 border-blue-200"
              }`}
            >
              🎯 Smart
              {sortMode === "smart" && <div className="text-xs mt-1">ICE × Urgency</div>}
            </button>
            <button
              onClick={() => setSortMode("value")}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                sortMode === "value"
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200"
              }`}
            >
              💎 Value
              {sortMode === "value" && <div className="text-xs mt-1">Pure ICE</div>}
            </button>
            <button
              onClick={() => setSortMode("deadline")}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                sortMode === "deadline"
                  ? "bg-orange-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200"
              }`}
            >
              ⏰ Deadline
              {sortMode === "deadline" && <div className="text-xs mt-1">By Due Date</div>}
            </button>
            <button
              onClick={() => setSortMode("overdue")}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                sortMode === "overdue"
                  ? "bg-red-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200"
              }`}
            >
              🔥 Overdue
              {sortMode === "overdue" && <div className="text-xs mt-1">Only Overdue</div>}
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-2 font-medium">
            {sortMode === "smart" && "🎯 Combines value (ICE score) with deadline urgency (1-3× multiplier)"}
            {sortMode === "value" && "💎 Pure ICE scoring - no deadline influence"}
            {sortMode === "deadline" && "⏰ Sorted by deadline urgency, then by due date"}
            {sortMode === "overdue" && "🔥 Shows only overdue tasks, most overdue first"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          >
            📋 All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("deep")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "deep" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-600"}`}
          >
            🧠 Deep Work ({getTimeBlockStats("deep").count})
          </button>
          <button
            onClick={() => setActiveTab("collaborative")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "collaborative" ? "border-b-2 border-cyan-500 text-cyan-600" : "text-gray-600"}`}
          >
            👥 Collaborative ({getTimeBlockStats("collaborative").count})
          </button>
          <button
            onClick={() => setActiveTab("quick")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "quick" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"}`}
          >
            ⚡ Quick Wins ({getTimeBlockStats("quick").count})
          </button>
          <button
            onClick={() => setActiveTab("systematic")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "systematic" ? "border-b-2 border-rose-500 text-rose-600" : "text-gray-600"}`}
          >
            🔧 Systematic ({getTimeBlockStats("systematic").count})
          </button>
        </div>
      </div>

      {/* Tasks Table - Compact with Expandable Rows */}
      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 w-8"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Task
                </th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                  ICE
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Decision
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  AI Suggest
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => {
                const iceScore = useWeightedScoring
                  ? calculateWeightedICE(task, iceWeights)
                  : calculateICE(task);
                const decisionInfo = getDecisionInfo(task.decision);
                const recommendation = getDecisionRecommendation(
                  task,
                  selectedMethod,
                );
                const priorityColor =
                  parseFloat(iceScore) >= 8
                    ? "bg-green-500"
                    : parseFloat(iceScore) >= 6
                      ? "bg-yellow-500"
                      : "bg-gray-400";
                const isExpanded = expandedRows.has(task.id);

                return (
                  <>
                    {/* Main Row */}
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-2 py-3">
                        <button
                          onClick={() => toggleRowExpansion(task.id)}
                          className="text-gray-400 hover:text-gray-600 transition"
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`${priorityColor} text-white font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap`}
                        >
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              data-task-id={task.id}
                              data-field="name"
                              value={
                                localTaskValues[`${task.id}-name`] ?? task.name
                              }
                              onChange={(e) =>
                                debouncedUpdateTask(
                                  task.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              onFocus={() => {
                                activeInputRef.current = { taskId: task.id, field: "name" };
                              }}
                              onBlur={() => {
                                activeInputRef.current = null;
                              }}
                              className={`flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium ${
                                task.status === "completed"
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            />
                            {/* Status Badge */}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "archived"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {task.status === "completed" && "✅"}
                              {task.status === "archived" && "📦"}
                              {task.status === "active" && "📋"}
                            </span>
                          </div>
                          {task.notes && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {task.notes}
                            </p>
                          )}
                          {task.completedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Completed:{" "}
                              {new Date(task.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-gray-800">
                            {iceScore}
                          </span>
                          <div className="flex gap-1 text-xs text-gray-500">
                            <span>{task.impact}</span>
                            <span>{task.confidence}</span>
                            <span>{task.ease}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={task.decision}
                          onChange={(e) =>
                            updateTask(task.id, "decision", e.target.value)
                          }
                          className={`${decisionInfo.color} border px-3 py-2 rounded-lg text-sm font-medium w-full`}
                        >
                          <option value="do">✅ DO</option>
                          <option value="delegate">👤 DELEGATE</option>
                          <option value="delay">⏸️ DELAY</option>
                          <option value="delete">🗑️ DELETE</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm max-w-xs">
                          <div className="font-semibold text-gray-700 mb-1">
                            {getDecisionInfo(recommendation.decision).icon}{" "}
                            {recommendation.decision.toUpperCase()}
                          </div>
                          <div className="text-gray-600 text-xs line-clamp-2">
                            {recommendation.reason}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Status Action Buttons */}
                          {task.status === "active" && (
                            <>
                              <button
                                onClick={() => startFocusSession(task)}
                                className="text-blue-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50"
                                title="Start focus session"
                              >
                                <Play size={18} />
                              </button>
                              <button
                                onClick={() => completeTask(task.id)}
                                className="text-green-600 hover:text-green-700 transition p-2 rounded-lg hover:bg-green-50"
                                title="Mark as completed"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => archiveTask(task.id)}
                                className="text-gray-600 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-50"
                                title="Archive task"
                              >
                                <Archive size={18} />
                              </button>
                            </>
                          )}

                          {(task.status === "completed" ||
                            task.status === "archived") && (
                            <button
                              onClick={() => reactivateTask(task.id)}
                              className="text-blue-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50"
                              title="Reactivate task"
                            >
                              <Clock size={18} />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50"
                            title="Delete task permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Status Management */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                📊 Status Management
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Current Status
                                  </label>
                                  <div
                                    className={`p-3 rounded-lg border-2 ${
                                      task.status === "completed"
                                        ? "bg-green-50 border-green-200"
                                        : task.status === "archived"
                                          ? "bg-gray-50 border-gray-200"
                                          : "bg-blue-50 border-blue-200"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {task.status === "completed" &&
                                        "✅ Completed"}
                                      {task.status === "archived" &&
                                        "📦 Archived"}
                                      {task.status === "active" && "📋 Active"}
                                    </span>
                                    {task.completedAt && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {new Date(
                                          task.completedAt,
                                        ).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {task.status === "active" && (
                                    <>
                                      <button
                                        onClick={() => completeTask(task.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                      >
                                        <CheckCircle size={16} />
                                        Mark Complete
                                      </button>
                                      <button
                                        onClick={() => archiveTask(task.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                                      >
                                        <Archive size={16} />
                                        Archive
                                      </button>
                                    </>
                                  )}
                                  {(task.status === "completed" ||
                                    task.status === "archived") && (
                                    <button
                                      onClick={() => reactivateTask(task.id)}
                                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                      <Clock size={16} />
                                      Reactivate
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* ICE Scoring */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                🎯 ICE Scoring
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Impact (1-10)
                                  </label>
                                  <NumberInput
                                    value={task.impact}
                                    min={1}
                                    max={10}
                                    onChange={(value) =>
                                      debouncedUpdateTask(task.id, "impact", value)
                                    }
                                    onFocus={() => {
                                      activeInputRef.current = { taskId: task.id, field: "impact" };
                                    }}
                                    onBlur={() => {
                                      activeInputRef.current = null;
                                    }}
                                    data-task-id={task.id}
                                    data-field="impact"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Confidence (1-10)
                                  </label>
                                  <NumberInput
                                    value={task.confidence}
                                    min={1}
                                    max={10}
                                    onChange={(value) =>
                                      debouncedUpdateTask(task.id, "confidence", value)
                                    }
                                    onFocus={() => {
                                      activeInputRef.current = { taskId: task.id, field: "confidence" };
                                    }}
                                    onBlur={() => {
                                      activeInputRef.current = null;
                                    }}
                                    data-task-id={task.id}
                                    data-field="confidence"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Ease (1-10)
                                  </label>
                                  <NumberInput
                                    value={task.ease}
                                    min={1}
                                    max={10}
                                    onChange={(value) =>
                                      debouncedUpdateTask(task.id, "ease", value)
                                    }
                                    onFocus={() => {
                                      activeInputRef.current = { taskId: task.id, field: "ease" };
                                    }}
                                    onBlur={() => {
                                      activeInputRef.current = null;
                                    }}
                                    data-task-id={task.id}
                                    data-field="ease"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Categorization */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                📊 Categorization
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Type
                                  </label>
                                  <select
                                    value={task.type}
                                    onChange={(e) =>
                                      updateTask(
                                        task.id,
                                        "type",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="revenue">💰 Revenue</option>
                                    <option value="growth">📈 Growth</option>
                                    <option value="operations">
                                      🔧 Operations
                                    </option>
                                    <option value="strategic">
                                      🎯 Strategic
                                    </option>
                                    <option value="personal">
                                      ✨ Personal
                                    </option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Time Block
                                  </label>
                                  <select
                                    value={task.timeBlock}
                                    onChange={(e) =>
                                      updateTask(
                                        task.id,
                                        "timeBlock",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="deep">🧠 Deep Work</option>
                                    <option value="collaborative">
                                      👥 Collaborative
                                    </option>
                                    <option value="quick">⚡ Quick Wins</option>
                                    <option value="systematic">
                                      🔧 Systematic
                                    </option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Estimated Time (minutes)
                                  </label>
                                  <NumberInput
                                    value={task.estimatedTime}
                                    min={5}
                                    max={1440}
                                    onChange={(value) =>
                                      debouncedUpdateTask(task.id, "estimatedTime", value)
                                    }
                                    onFocus={() => {
                                      activeInputRef.current = { taskId: task.id, field: "estimatedTime" };
                                    }}
                                    onBlur={() => {
                                      activeInputRef.current = null;
                                    }}
                                    data-task-id={task.id}
                                    data-field="estimatedTime"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Time Tracking */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                ⏱️ Time Tracking
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Estimated
                                  </label>
                                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                                    {task.estimatedTime} min
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Actual Time
                                  </label>
                                  <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
                                    {task.actualTime || 0} min
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Status
                                  </label>
                                  <div
                                    className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                                      task.isInFocus
                                        ? "bg-orange-50 border-orange-200 text-orange-800"
                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {task.isInFocus ? "🔥 In Focus" : "⏸️ Idle"}
                                  </div>
                                </div>
                              </div>
                              {task.actualTime && task.estimatedTime && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>
                                      {Math.round(
                                        (task.actualTime / task.estimatedTime) *
                                          100,
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        task.actualTime / task.estimatedTime > 1
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      }`}
                                      style={{
                                        width: `${Math.min((task.actualTime / task.estimatedTime) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Scheduling */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                📅 Scheduling
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Schedule For
                                  </label>
                                  <select
                                    value={task.scheduledFor || "someday"}
                                    onChange={(e) =>
                                      updateTask(
                                        task.id,
                                        "scheduledFor",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="today">📅 Today</option>
                                    <option value="this-week">
                                      📆 This Week
                                    </option>
                                    <option value="this-month">
                                      🗓️ This Month
                                    </option>
                                    <option value="someday">💭 Someday</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    ⏰ Deadline (Optional)
                                  </label>
                                  <input
                                    type="date"
                                    value={task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''}
                                    onChange={(e) =>
                                      updateTask(
                                        task.id,
                                        "deadline",
                                        e.target.value ? new Date(e.target.value) : null,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Recurring Pattern
                                  </label>
                                  <select
                                    value={task.recurringPattern || ""}
                                    onChange={(e) =>
                                      updateTask(
                                        task.id,
                                        "recurringPattern",
                                        e.target.value || null,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">None</option>
                                    <option value="daily">🔄 Daily</option>
                                    <option value="weekly">📅 Weekly</option>
                                    <option value="monthly">🗓️ Monthly</option>
                                  </select>
                                </div>
                                {task.recurringPattern &&
                                  task.streakCount !== undefined && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                      <p className="text-xs text-purple-700 font-medium">
                                        🔥 Streak: {task.streakCount}{" "}
                                        {task.recurringPattern === "daily"
                                          ? "days"
                                          : task.recurringPattern === "weekly"
                                            ? "weeks"
                                            : "months"}
                                      </p>
                                      {task.lastCompletedDate && (
                                        <p className="text-xs text-purple-600 mt-1">
                                          Last completed:{" "}
                                          {new Date(
                                            task.lastCompletedDate,
                                          ).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                📝 Description
                              </h4>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  data-task-id={task.id}
                                  data-field="notes"
                                  value={
                                    localTaskValues[`${task.id}-notes`] ?? (task.notes || "")
                                  }
                                  onChange={(e) =>
                                    debouncedUpdateTask(task.id, "notes", e.target.value)
                                  }
                                  onFocus={() => {
                                    activeInputRef.current = { taskId: task.id, field: "notes" };
                                  }}
                                  onBlur={() => {
                                    activeInputRef.current = null;
                                  }}
                                  placeholder="Add detailed description, requirements, or notes..."
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                />
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-700 font-medium mb-1">
                                  AI Recommendation:
                                </p>
                                <p className="text-sm text-blue-800">
                                  {recommendation.reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowFrameworkGuide(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-40 transition-all hover:scale-110"
        aria-label="Show framework guide"
      >
        <HelpCircle size={24} />
      </button>

      {/* Framework Guide Modal/Drawer */}
      {showFrameworkGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
          <div className="bg-white w-full max-h-[85vh] md:max-w-4xl md:max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-xl text-gray-800">
                📚 Framework Guide
              </h3>
              <button
                onClick={() => setShowFrameworkGuide(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto p-6">
              <div className="space-y-6">
                {/* 4D Decision Framework */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    💡 4D Decision Framework
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-semibold text-green-700">
                        ✅ DO - Làm ngay
                      </p>
                      <p className="text-sm text-gray-600">
                        High ICE (≥7.5) + High Impact (≥7). Tasks này quan trọng
                        và bạn có khả năng làm tốt.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold text-blue-700">
                        👤 DELEGATE - Giao cho người khác
                      </p>
                      <p className="text-sm text-gray-600">
                        Low Confidence (&lt;5) hoặc High Impact + Low Ease.
                        Người khác có thể làm tốt hơn.
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-semibold text-yellow-700">
                        ⏸️ DELAY - Hoãn lại
                      </p>
                      <p className="text-sm text-gray-600">
                        Medium ICE (5-7.5). Quan trọng nhưng chưa cấp thiết.
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <p className="font-semibold text-red-700">
                        🗑️ DELETE - Loại bỏ
                      </p>
                      <p className="text-sm text-gray-600">
                        Low Impact (&lt;5) + Low ICE (&lt;5). Không đáng để làm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Blocking */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ⏰ Time Blocking Strategy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="font-semibold text-indigo-800 mb-1">
                        🧠 Deep Work
                      </p>
                      <p className="text-sm text-gray-600">
                        Cần tập trung cao, không bị gián đoạn. Best: Sáng sớm
                        hoặc sau giờ nghỉ trưa.
                      </p>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <p className="font-semibold text-cyan-800 mb-1">
                        👥 Collaborative
                      </p>
                      <p className="text-sm text-gray-600">
                        Cần tương tác, feedback. Best: Giờ hành chính khi team
                        online.
                      </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="font-semibold text-amber-800 mb-1">
                        ⚡ Quick Wins
                      </p>
                      <p className="text-sm text-gray-600">
                        Nhanh gọn 5-30 phút. Best: Khi chờ đợi hoặc giữa các
                        task lớn.
                      </p>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                      <p className="font-semibold text-rose-800 mb-1">
                        🔧 Systematic
                      </p>
                      <p className="text-sm text-gray-600">
                        Setup một lần, chạy tự động. Best: Khi có thời gian yên
                        tĩnh.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ICE Scoring Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    🎯 ICE Scoring System
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Impact (1-10):</span> Tác
                      động đến mục tiêu của bạn
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Confidence (1-10):</span>{" "}
                      Độ chắc chắn hoàn thành
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Ease (1-10):</span> Độ dễ
                      thực hiện
                    </p>
                    <p className="text-sm mt-3">
                      <span className="font-semibold">ICE Score:</span>{" "}
                      {useWeightedScoring
                        ? `Weighted formula: I(${iceWeights.impact}%) + C(${iceWeights.confidence}%) + E(${iceWeights.ease}%)`
                        : "Simple average of the 3 factors"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Old Decision Framework Guide - Hidden, replaced by modal */}
      <div className="hidden mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          💡 4D Decision Framework:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold text-green-700">✅ DO - Làm ngay</p>
            <p className="text-sm text-gray-600">
              High ICE (≥7.5) + High Impact (≥7). Tasks này quan trọng và bạn có
              khả năng làm tốt.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Core product development, strategic planning
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-blue-700">
              👤 DELEGATE - Giao việc
            </p>
            <p className="text-sm text-gray-600">
              High Impact nhưng Low Ease (khó với bạn) HOẶC Low Impact nhưng
              Easy (ai cũng làm được).
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Admin tasks, graphic design, data entry
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="font-semibold text-yellow-700">⏸️ DELAY - Hoãn lại</p>
            <p className="text-sm text-gray-600">
              Medium Impact + Low Confidence. Cần thêm thông tin hoặc chưa đến
              lúc phù hợp.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Projects cần thêm research, tasks phụ thuộc vào điều kiện
              khác
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-700">🗑️ DELETE - Loại bỏ</p>
            <p className="text-sm text-gray-600">
              Low Impact (≤4). Không đáng để dành thời gian, energy và
              attention.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Nice-to-have features, vanity metrics, busy work
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3 mt-6">
          🎯 Hướng Dẫn Sử Dụng Time Blocking:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <p className="font-semibold text-indigo-700">🧠 Deep Work Tasks</p>
            <p className="text-sm text-gray-600">
              Schedule vào buổi sáng hoặc khung giờ bạn tập trung tốt nhất. Tắt
              thông báo, không multitask.
            </p>
          </div>
          <div className="border-l-4 border-cyan-500 pl-4">
            <p className="font-semibold text-cyan-700">
              👥 Collaborative Tasks
            </p>
            <p className="text-sm text-gray-600">
              Làm trong giờ hành chính khi team online. Chuẩn bị trước để
              meeting hiệu quả.
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-semibold text-amber-700">⚡ Quick Wins</p>
            <p className="text-sm text-gray-600">
              Làm khi chờ đợi, giữa các task lớn, hoặc khi năng lượng thấp.
              Momentum tốt cho ngày mới.
            </p>
          </div>
          <div className="border-l-4 border-rose-500 pl-4">
            <p className="font-semibold text-rose-700">🔧 Systematic Tasks</p>
            <p className="text-sm text-gray-600">
              Đầu tư thời gian setup một lần, sau đó chạy tự động. Ưu tiên cao
              nếu tiết kiệm được nhiều thời gian.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            <strong>💡 Pro Tip:</strong> Cột "AI Suggest" thay đổi theo method
            bạn chọn phía trên.
          </p>
          <p className="text-xs text-blue-700">
            <strong>Khuyến nghị:</strong> Thử các methods khác nhau để tìm cách
            tính phù hợp nhất với phong cách làm việc của bạn.
            <strong>Hybrid Smart</strong> là balanced nhất,{" "}
            <strong>ROI-Based</strong> tốt cho efficiency,
            <strong>Energy-Aware</strong> tốt cho sustainable productivity,{" "}
            <strong>Strategic</strong> tốt cho business owners.
          </p>
        </div>
      </div>

      {/* Duration Selector Modal */}
      {selectedTaskForFocus && (
        <DurationSelectorModal
          task={selectedTaskForFocus}
          isOpen={showDurationSelector}
          onClose={handleDurationSelectorClose}
          onSelect={handleDurationSelected}
        />
      )}

      {/* Focus Mode Modal */}
      {focusTask && (
        <FocusModeModal
          task={focusTask}
          isOpen={isFocusModeOpen}
          onClose={closeFocusMode}
          onComplete={endFocusSession}
          usePomodoroMode={usePomodoroMode}
          targetDuration={focusTask.targetDuration ?? null}
        />
      )}

      {/* Floating Timer Widget - Shows when modal is closed but task is in focus */}
      {focusTask && !isFocusModeOpen && (
        <div
          onClick={reopenFocusMode}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl px-5 py-3 cursor-pointer hover:scale-105 transition-transform duration-200 z-40 flex items-center gap-4"
        >
          <Clock size={20} className="flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium opacity-90">In Progress</span>
            <span className="text-sm font-bold truncate max-w-[180px]">
              {focusTask.name}
            </span>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            {focusTask.targetDuration ? (
              <>
                <span className="text-2xl font-mono font-bold tabular-nums">
                  {formatCountdown(
                    calculateRemaining(
                      new Date(focusTask.focusStartedAt!),
                      focusTask.targetDuration,
                      focusTask.pausedTime || 0,
                    ),
                  )}
                </span>
                <span className="text-[10px] opacity-75">
                  {calculateRemaining(
                    new Date(focusTask.focusStartedAt!),
                    focusTask.targetDuration,
                    focusTask.pausedTime || 0,
                  ) <= 0
                    ? "overtime"
                    : "remaining"}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-mono font-bold tabular-nums">
                  {formatTime(floatingWidgetTime)}
                </span>
                <span className="text-[10px] opacity-75">click to expand</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ICE Weights Settings Modal */}
      <ICEWeightsSettings
        isOpen={showWeightsSettings}
        currentWeights={iceWeights}
        onClose={() => setShowWeightsSettings(false)}
        onSave={handleSaveWeights}
      />

      {/* Pomodoro Settings Modal */}
      <PomodoroSettingsComponent
        isOpen={showPomodoroSettings}
        currentSettings={pomodoroSettings}
        onClose={() => setShowPomodoroSettings(false)}
        onSave={(settings) => {
          setPomodoroSettings(settings);
          savePomodoroSettings(settings);
          setShowPomodoroSettings(false);
        }}
      />

      {/* Quick Add FAB - Hide when focus mode is open */}
      {!isFocusModeOpen && (
        <QuickAddFAB
          onAdd={async (task) => {
            await addTask(task);
          }}
          onShowFullForm={() => {
            // Scroll to the add task form
            const addTaskForm = document.querySelector("[data-add-task-form]");
            if (addTaskForm) {
              addTaskForm.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
        />
      )}

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <style>
            {`
              @keyframes celebration-fall {
                0% {
                  transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100vh) translateX(var(--x-offset, 0)) rotate(720deg) scale(0.5);
                  opacity: 0;
                }
              }
            `}
          </style>

          {/* Confetti-like particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => {
              const delay = Math.random() * 0.5;
              const duration = 2 + Math.random() * 1;
              const xOffset = (Math.random() - 0.5) * 100;
              const rotation = Math.random() * 360;
              const colors = [
                "bg-yellow-400",
                "bg-green-400",
                "bg-blue-400",
                "bg-purple-400",
                "bg-pink-400",
                "bg-red-400",
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];

              return (
                <div
                  key={i}
                  className={`absolute ${color} rounded-full`}
                  style={{
                    left: "50%",
                    top: "50%",
                    width: `${4 + Math.random() * 8}px`,
                    height: `${4 + Math.random() * 8}px`,
                    animation: `celebration-fall ${duration}s ease-out ${delay}s forwards`,
                    transform: `translateX(${xOffset}vw) rotate(${rotation}deg)`,
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </div>

          {/* Success message */}
          <div className="relative bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl transform animate-bounce">
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-2xl font-bold mb-2">Task Completed!</div>
              <div className="text-sm opacity-90">
                Great job! Keep up the momentum!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Dashboard;
