import type {
  Task,
  CreateTaskInput,
  User,
  UserPreferences,
  OverviewStats,
  SchedulingWindow,
  DailyCapacity,
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteCategory,
} from "../utils/types";
import { APP_CONFIG } from "../utils/config";
import { api } from "../client/lib/api";
import { initializeDemoData } from "./demo-data";

// Storage interface that both localStorage and API implementations follow
interface TaskStorage {
  // Tasks
  getTasks(params?: {
    status?: string;
    timeBlock?: string;
    scheduledFor?: SchedulingWindow;
    limit?: number;
  }): Promise<Task[]>;
  createTask(task: CreateTaskInput): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  completeTask(id: number): Promise<Task>;

  // Time tracking
  startFocusSession(taskId: number): Promise<Task>;
  endFocusSession(taskId: number, duration: number): Promise<Task>;
  updatePauseState(
    taskId: number,
    isPaused: boolean,
    pausedTime: number,
    pauseStartTime: Date | null,
  ): Promise<Task>;
  addTimeEntry(
    taskId: number,
    duration: number,
    type: "focus" | "regular",
  ): Promise<Task>;

  // Scheduling
  getTasksForToday(): Promise<Task[]>;
  getTasksForWeek(): Promise<Task[]>;
  getTasksForMonth(): Promise<Task[]>;
  getDailyCapacity(date?: Date): Promise<DailyCapacity>;
  completeRecurringTask(id: number): Promise<Task>;

  // User
  getCurrentUser(): Promise<User>;

  // Preferences
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences>;

  // Stats
  getOverviewStats(): Promise<OverviewStats>;

  // Notes
  getNotes(params?: {
    category?: NoteCategory;
    taskId?: number;
    search?: string;
  }): Promise<Note[]>;
  getNote(id: number): Promise<Note>;
  createNote(note: CreateNoteInput): Promise<Note>;
  updateNote(id: number, note: UpdateNoteInput): Promise<Note>;
  deleteNote(id: number): Promise<void>;
}

class LocalStorageTaskStorage implements TaskStorage {
  constructor() {
    // Initialize demo data on first use
    initializeDemoData();
  }

  private getNextId(): number {
    const tasks = this.getTasksSync();
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  }

  private getTasksSync(): Task[] {
    const tasksJson = localStorage.getItem("demo-tasks");
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  private saveTasksSync(tasks: Task[]): void {
    localStorage.setItem("demo-tasks", JSON.stringify(tasks));
  }

  async getTasks(params?: {
    status?: string;
    timeBlock?: string;
    scheduledFor?: SchedulingWindow;
    limit?: number;
  }): Promise<Task[]> {
    let tasks = this.getTasksSync();

    // Apply filters if provided
    if (params?.status) {
      tasks = tasks.filter((task) => task.status === params.status);
    }

    if (params?.timeBlock && params.timeBlock !== "all") {
      tasks = tasks.filter((task) => task.timeBlock === params.timeBlock);
    }

    if (params?.scheduledFor) {
      tasks = tasks.filter((task) => task.scheduledFor === params.scheduledFor);
    }

    // Apply limit if provided
    if (params?.limit && params.limit > 0) {
      tasks = tasks.slice(0, params.limit);
    }

    return tasks;
  }

  async createTask(taskInput: CreateTaskInput): Promise<Task> {
    const tasks = this.getTasksSync();
    const newTask: Task = {
      ...taskInput,
      id: this.getNextId(),
      userId: APP_CONFIG.DEMO_USER.id,
      notes: taskInput.notes || null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    this.saveTasksSync(tasks);
    return newTask;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task> {
    const tasks = this.getTasksSync();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    console.log("LocalStorage updateTask - before:", tasks[index]);
    console.log("LocalStorage updateTask - update data:", taskUpdate);

    const updatedTask = {
      ...tasks[index],
      ...taskUpdate,
      updatedAt: new Date(),
    };

    console.log("LocalStorage updateTask - after:", updatedTask);

    tasks[index] = updatedTask;
    this.saveTasksSync(tasks);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = this.getTasksSync();
    const filteredTasks = tasks.filter((t) => t.id !== id);

    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.saveTasksSync(filteredTasks);
  }

  async completeTask(id: number): Promise<Task> {
    return this.updateTask(id, {
      status: "completed",
      completedAt: new Date(),
    });
  }

  async completeRecurringTask(id: number): Promise<Task> {
    const tasks = this.getTasksSync();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.recurringPattern) {
      // Not a recurring task, just complete it normally
      return this.completeTask(id);
    }

    // For recurring tasks, update last completed date and increment streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = task.lastCompletedDate
      ? new Date(task.lastCompletedDate)
      : null;
    let newStreak = task.streakCount || 0;

    // Calculate streak
    if (lastCompleted) {
      const daysDiff = Math.floor(
        (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (task.recurringPattern === "daily" && daysDiff === 1) {
        newStreak += 1;
      } else if (
        task.recurringPattern === "weekly" &&
        daysDiff >= 6 &&
        daysDiff <= 8
      ) {
        newStreak += 1;
      } else if (
        task.recurringPattern === "monthly" &&
        daysDiff >= 28 &&
        daysDiff <= 32
      ) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1; // First completion
    }

    return this.updateTask(id, {
      lastCompletedDate: today,
      streakCount: newStreak,
      status: "completed",
      completedAt: new Date(),
    });
  }

  async startFocusSession(taskId: number): Promise<Task> {
    // First, stop any other active focus sessions
    const tasks = this.getTasksSync();
    const activeFocusTasks = tasks.filter(
      (t) => t.isInFocus && t.id !== taskId,
    );

    // End each active session
    for (const task of activeFocusTasks) {
      if (task.focusStartedAt) {
        // Calculate elapsed time, accounting for paused time
        const wallTime = Math.floor(
          (new Date().getTime() - new Date(task.focusStartedAt).getTime()) /
            1000,
        );
        const pausedSeconds = task.pausedTime || 0;
        const elapsed = Math.max(0, wallTime - pausedSeconds);
        const durationMinutes = Math.ceil(elapsed / 60);
        await this.endFocusSession(task.id, durationMinutes);
      } else {
        // If no start time, just clear the flag
        await this.updateTask(task.id, {
          isInFocus: false,
          focusStartedAt: undefined,
        });
      }
    }

    // Now start the new focus session
    return this.updateTask(taskId, {
      isInFocus: true,
      focusStartedAt: new Date(),
      // Clear any previous pause state and target duration when starting new session
      isPaused: false,
      pausedTime: 0,
      pauseStartTime: undefined,
      targetDuration: undefined,
    });
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    // First clear the focus state
    await this.updateTask(taskId, {
      isInFocus: false,
      focusStartedAt: undefined,
      targetDuration: null,
      isPaused: false,
      pausedTime: 0,
      pauseStartTime: null,
    });

    // Then add the time entry (which also updates actualTime)
    return await this.addTimeEntry(taskId, duration, "focus");
  }

  async updatePauseState(
    taskId: number,
    isPaused: boolean,
    pausedTime: number,
    pauseStartTime: Date | null,
  ): Promise<Task> {
    return this.updateTask(taskId, {
      isPaused,
      pausedTime,
      pauseStartTime,
    });
  }

  async addTimeEntry(
    taskId: number,
    duration: number,
    type: "focus" | "regular",
  ): Promise<Task> {
    const tasks = this.getTasksSync();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const now = new Date();
    const startTime = new Date(now.getTime() - duration * 60000);

    const newTimeEntry = {
      id: `${taskId}-${Date.now()}`,
      taskId: taskId,
      startTime: startTime,
      endTime: now,
      duration: duration,
      type: type,
    };

    const updatedTask = {
      ...task,
      actualTime: (task.actualTime || 0) + duration,
      timeEntries: [...(task.timeEntries || []), newTimeEntry],
      updatedAt: new Date(),
    };

    const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    this.saveTasksSync(updatedTasks);
    return updatedTask;
  }

  async getTasksForToday(): Promise<Task[]> {
    const tasks = this.getTasksSync();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (task.status !== "active") return false;

      // Include tasks scheduled for today
      if (task.scheduledFor === "today") return true;

      // Include recurring daily tasks not completed today
      if (task.recurringPattern === "daily") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < today) {
          return true;
        }
      }

      return false;
    });
  }

  async getTasksForWeek(): Promise<Task[]> {
    const tasks = this.getTasksSync();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return tasks.filter((task) => {
      if (task.status !== "active") return false;

      // Include tasks scheduled for today or this-week
      if (task.scheduledFor === "today" || task.scheduledFor === "this-week") {
        return true;
      }

      // Include recurring weekly tasks not completed this week
      if (task.recurringPattern === "weekly") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < startOfWeek) {
          return true;
        }
      }

      // Include recurring daily tasks
      if (task.recurringPattern === "daily") {
        return true;
      }

      return false;
    });
  }

  async getTasksForMonth(): Promise<Task[]> {
    const tasks = this.getTasksSync();
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return tasks.filter((task) => {
      if (task.status !== "active") return false;

      // Include tasks scheduled for today, this-week, or this-month
      if (
        task.scheduledFor === "today" ||
        task.scheduledFor === "this-week" ||
        task.scheduledFor === "this-month"
      ) {
        return true;
      }

      // Include recurring monthly tasks not completed this month
      if (task.recurringPattern === "monthly") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < startOfMonth) {
          return true;
        }
      }

      // Include recurring weekly and daily tasks
      if (
        task.recurringPattern === "weekly" ||
        task.recurringPattern === "daily"
      ) {
        return true;
      }

      return false;
    });
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const tasksForToday = await this.getTasksForToday();

    const totalEstimated = tasksForToday.reduce(
      (sum, task) => sum + task.estimatedTime,
      0,
    );
    const totalActual = tasksForToday.reduce(
      (sum, task) => sum + (task.actualTime || 0),
      0,
    );
    const completedCount = tasksForToday.filter(
      (t) => t.status === "completed",
    ).length;

    return {
      date: targetDate,
      totalTasks: tasksForToday.length,
      completedTasks: completedCount,
      estimatedMinutes: totalEstimated,
      actualMinutes: totalActual,
      remainingMinutes: totalEstimated - totalActual,
      utilizationPercent:
        totalEstimated > 0
          ? Math.round((totalActual / totalEstimated) * 100)
          : 0,
    };
  }

  async getCurrentUser(): Promise<User> {
    const userJson = localStorage.getItem("demo-user");
    if (!userJson) {
      throw new Error("Demo user not found");
    }
    return JSON.parse(userJson);
  }

  async getPreferences(): Promise<UserPreferences> {
    const prefsJson = localStorage.getItem("demo-preferences");
    if (!prefsJson) {
      throw new Error("Demo preferences not found");
    }
    return JSON.parse(prefsJson);
  }

  async updatePreferences(
    preferencesUpdate: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    const currentPrefs = await this.getPreferences();
    const updatedPrefs = {
      ...currentPrefs,
      ...preferencesUpdate,
      updatedAt: new Date(),
    };

    localStorage.setItem("demo-preferences", JSON.stringify(updatedPrefs));
    return updatedPrefs;
  }

  async getOverviewStats(): Promise<OverviewStats> {
    const tasks = this.getTasksSync();

    // Calculate stats from tasks
    const totalTasks = tasks.length;
    const totalTime = tasks.reduce(
      (sum, task) => sum + (task.estimatedTime || 0),
      0,
    );

    // Decision breakdown with count and time
    const doTasks = tasks.filter((t) => t.decision === "do");
    const delegateTasks = tasks.filter((t) => t.decision === "delegate");
    const delayTasks = tasks.filter((t) => t.decision === "delay");
    const deleteTasks = tasks.filter((t) => t.decision === "delete");

    // Time block breakdown with count and time
    const deepTasks = tasks.filter((t) => t.timeBlock === "deep");
    const collaborativeTasks = tasks.filter(
      (t) => t.timeBlock === "collaborative",
    );
    const quickTasks = tasks.filter((t) => t.timeBlock === "quick");
    const systematicTasks = tasks.filter((t) => t.timeBlock === "systematic");

    // Type breakdown with count and time
    const revenueTasks = tasks.filter((t) => t.type === "revenue");
    const growthTasks = tasks.filter((t) => t.type === "growth");
    const operationsTasks = tasks.filter((t) => t.type === "operations");
    const strategicTasks = tasks.filter((t) => t.type === "strategic");
    const personalTasks = tasks.filter((t) => t.type === "personal");

    const calculateStats = (taskList: Task[]) => ({
      count: taskList.length,
      time: taskList.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
    });

    return {
      decisions: {
        do: calculateStats(doTasks),
        delegate: calculateStats(delegateTasks),
        delay: calculateStats(delayTasks),
        delete: calculateStats(deleteTasks),
      },
      timeBlocks: {
        deep: calculateStats(deepTasks),
        collaborative: calculateStats(collaborativeTasks),
        quick: calculateStats(quickTasks),
        systematic: calculateStats(systematicTasks),
      },
      types: {
        revenue: calculateStats(revenueTasks),
        growth: calculateStats(growthTasks),
        operations: calculateStats(operationsTasks),
        strategic: calculateStats(strategicTasks),
        personal: calculateStats(personalTasks),
      },
      totalTasks,
      totalTime,
    };
  }

  // Notes methods
  private getNotesSync(): Note[] {
    const stored = localStorage.getItem("demo-notes");
    if (!stored) return [];

    const notes = JSON.parse(stored);
    return notes.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
  }

  private saveNotesSync(notes: Note[]): void {
    localStorage.setItem("demo-notes", JSON.stringify(notes));
  }

  private getNextNoteId(): number {
    const notes = this.getNotesSync();
    return notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  }

  async getNotes(params?: {
    category?: NoteCategory;
    taskId?: number;
    search?: string;
  }): Promise<Note[]> {
    let notes = this.getNotesSync();

    // Filter by category
    if (params?.category) {
      notes = notes.filter((n) => n.category === params.category);
    }

    // Filter by taskId
    if (params?.taskId !== undefined) {
      notes = notes.filter((n) => n.taskId === params.taskId);
    }

    // Search in title and content
    if (params?.search) {
      const query = params.search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(query))),
      );
    }

    // Sort by most recent first
    return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getNote(id: number): Promise<Note> {
    const notes = this.getNotesSync();
    const note = notes.find((n) => n.id === id);
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return note;
  }

  async createNote(noteInput: CreateNoteInput): Promise<Note> {
    const notes = this.getNotesSync();
    const now = new Date();

    const newNote: Note = {
      id: this.getNextNoteId(),
      userId: 1, // Demo user ID
      taskId: noteInput.taskId || null,
      title: noteInput.title,
      content: noteInput.content,
      category: noteInput.category || "task-note",
      tags: noteInput.tags || [],
      metadata: noteInput.metadata,
      createdAt: now,
      updatedAt: now,
    };

    notes.push(newNote);
    this.saveNotesSync(notes);
    return newNote;
  }

  async updateNote(id: number, noteInput: UpdateNoteInput): Promise<Note> {
    const notes = this.getNotesSync();
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...noteInput,
      updatedAt: new Date(),
    };

    notes[noteIndex] = updatedNote;
    this.saveNotesSync(notes);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<void> {
    const notes = this.getNotesSync();
    const filtered = notes.filter((n) => n.id !== id);

    if (filtered.length === notes.length) {
      throw new Error(`Note with id ${id} not found`);
    }

    this.saveNotesSync(filtered);
  }
}

class ApiTaskStorage implements TaskStorage {
  async getTasks(params?: {
    status?: string;
    timeBlock?: string;
    scheduledFor?: SchedulingWindow;
    limit?: number;
  }): Promise<Task[]> {
    return api.getTasks(params);
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    return api.createTask(task);
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return api.updateTask(id, task);
  }

  async deleteTask(id: number): Promise<void> {
    await api.deleteTask(id);
  }

  async completeTask(id: number): Promise<Task> {
    return api.completeTask(id);
  }

  async completeRecurringTask(id: number): Promise<Task> {
    const tasks = await api.getTasks({ status: "active" });
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.recurringPattern) {
      // Not a recurring task, just complete it normally
      return api.completeTask(id);
    }

    // For recurring tasks, update last completed date and increment streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = task.lastCompletedDate
      ? new Date(task.lastCompletedDate)
      : null;
    let newStreak = task.streakCount || 0;

    // Calculate streak
    if (lastCompleted) {
      const daysDiff = Math.floor(
        (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (task.recurringPattern === "daily" && daysDiff === 1) {
        newStreak += 1;
      } else if (
        task.recurringPattern === "weekly" &&
        daysDiff >= 6 &&
        daysDiff <= 8
      ) {
        newStreak += 1;
      } else if (
        task.recurringPattern === "monthly" &&
        daysDiff >= 28 &&
        daysDiff <= 32
      ) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1; // First completion
    }

    return api.updateTask(id, {
      lastCompletedDate: today,
      streakCount: newStreak,
      status: "completed",
    });
  }

  async startFocusSession(taskId: number): Promise<Task> {
    return api.startFocusSession(taskId);
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return api.endFocusSession(taskId, duration);
  }

  async updatePauseState(
    taskId: number,
    isPaused: boolean,
    pausedTime: number,
    pauseStartTime: Date | null,
  ): Promise<Task> {
    return api.updateTask(taskId, {
      isPaused,
      pausedTime,
      pauseStartTime,
    });
  }

  async addTimeEntry(
    taskId: number,
    duration: number,
    type: "focus" | "regular",
  ): Promise<Task> {
    return api.addTimeEntry(taskId, duration, type);
  }

  async getTasksForToday(): Promise<Task[]> {
    const tasks = await api.getTasks({ status: "active" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      // Include tasks scheduled for today
      if (task.scheduledFor === "today") return true;

      // Include recurring daily tasks not completed today
      if (task.recurringPattern === "daily") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < today) {
          return true;
        }
      }

      return false;
    });
  }

  async getTasksForWeek(): Promise<Task[]> {
    const tasks = await api.getTasks({ status: "active" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return tasks.filter((task) => {
      // Include tasks scheduled for today or this-week
      if (task.scheduledFor === "today" || task.scheduledFor === "this-week") {
        return true;
      }

      // Include recurring weekly tasks not completed this week
      if (task.recurringPattern === "weekly") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < startOfWeek) {
          return true;
        }
      }

      // Include recurring daily tasks
      if (task.recurringPattern === "daily") {
        return true;
      }

      return false;
    });
  }

  async getTasksForMonth(): Promise<Task[]> {
    const tasks = await api.getTasks({ status: "active" });
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return tasks.filter((task) => {
      // Include tasks scheduled for today, this-week, or this-month
      if (
        task.scheduledFor === "today" ||
        task.scheduledFor === "this-week" ||
        task.scheduledFor === "this-month"
      ) {
        return true;
      }

      // Include recurring monthly tasks not completed this month
      if (task.recurringPattern === "monthly") {
        const lastCompleted = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : null;
        if (!lastCompleted || lastCompleted < startOfMonth) {
          return true;
        }
      }

      // Include recurring weekly and daily tasks
      if (
        task.recurringPattern === "weekly" ||
        task.recurringPattern === "daily"
      ) {
        return true;
      }

      return false;
    });
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const tasksForToday = await this.getTasksForToday();

    const totalEstimated = tasksForToday.reduce(
      (sum, task) => sum + task.estimatedTime,
      0,
    );
    const totalActual = tasksForToday.reduce(
      (sum, task) => sum + (task.actualTime || 0),
      0,
    );
    const completedCount = tasksForToday.filter(
      (t) => t.status === "completed",
    ).length;

    return {
      date: targetDate,
      totalTasks: tasksForToday.length,
      completedTasks: completedCount,
      estimatedMinutes: totalEstimated,
      actualMinutes: totalActual,
      remainingMinutes: totalEstimated - totalActual,
      utilizationPercent:
        totalEstimated > 0
          ? Math.round((totalActual / totalEstimated) * 100)
          : 0,
    };
  }

  async getCurrentUser(): Promise<User> {
    return api.getMe();
  }

  async getPreferences(): Promise<UserPreferences> {
    return api.getPreferences();
  }

  async updatePreferences(
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    return api.updatePreferences(preferences);
  }

  async getOverviewStats(): Promise<OverviewStats> {
    return api.getOverview();
  }

  // Notes methods (API implementation)
  async getNotes(params?: {
    category?: NoteCategory;
    taskId?: number;
    search?: string;
  }): Promise<Note[]> {
    // TODO: Implement API endpoint
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.taskId) queryParams.append("taskId", params.taskId.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await fetch(`/api/notes?${queryParams}`);
    if (!response.ok) throw new Error("Failed to fetch notes");
    const data = (await response.json()) as { notes: Note[] };
    return data.notes || [];
  }

  async getNote(id: number): Promise<Note> {
    const response = await fetch(`/api/notes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch note");
    const data = (await response.json()) as { note: Note };
    return data.note;
  }

  async createNote(note: CreateNoteInput): Promise<Note> {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error("Failed to create note");
    const data = (await response.json()) as { note: Note };
    return data.note;
  }

  async updateNote(id: number, note: UpdateNoteInput): Promise<Note> {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (!response.ok) throw new Error("Failed to update note");
    const data = (await response.json()) as { note: Note };
    return data.note;
  }

  async deleteNote(id: number): Promise<void> {
    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete note");
  }
}

// Dynamic storage that chooses the right implementation at runtime
class DynamicTaskStorage implements TaskStorage {
  private getStorage(): TaskStorage {
    return APP_CONFIG.IS_DEMO
      ? new LocalStorageTaskStorage()
      : new ApiTaskStorage();
  }

  async getTasks(params?: {
    status?: string;
    timeBlock?: string;
    scheduledFor?: SchedulingWindow;
    limit?: number;
  }): Promise<Task[]> {
    return this.getStorage().getTasks(params);
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    return this.getStorage().createTask(task);
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.getStorage().updateTask(id, task);
  }

  async deleteTask(id: number): Promise<void> {
    return this.getStorage().deleteTask(id);
  }

  async completeTask(id: number): Promise<Task> {
    return this.getStorage().completeTask(id);
  }

  async completeRecurringTask(id: number): Promise<Task> {
    return this.getStorage().completeRecurringTask(id);
  }

  async startFocusSession(taskId: number): Promise<Task> {
    return this.getStorage().startFocusSession(taskId);
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return this.getStorage().endFocusSession(taskId, duration);
  }

  async updatePauseState(
    taskId: number,
    isPaused: boolean,
    pausedTime: number,
    pauseStartTime: Date | null,
  ): Promise<Task> {
    return this.getStorage().updatePauseState(
      taskId,
      isPaused,
      pausedTime,
      pauseStartTime,
    );
  }

  async addTimeEntry(
    taskId: number,
    duration: number,
    type: "focus" | "regular",
  ): Promise<Task> {
    return this.getStorage().addTimeEntry(taskId, duration, type);
  }

  async getTasksForToday(): Promise<Task[]> {
    return this.getStorage().getTasksForToday();
  }

  async getTasksForWeek(): Promise<Task[]> {
    return this.getStorage().getTasksForWeek();
  }

  async getTasksForMonth(): Promise<Task[]> {
    return this.getStorage().getTasksForMonth();
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    return this.getStorage().getDailyCapacity(date);
  }

  async getCurrentUser(): Promise<User> {
    return this.getStorage().getCurrentUser();
  }

  async getPreferences(): Promise<UserPreferences> {
    return this.getStorage().getPreferences();
  }

  async updatePreferences(
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    return this.getStorage().updatePreferences(preferences);
  }

  async getOverviewStats(): Promise<OverviewStats> {
    return this.getStorage().getOverviewStats();
  }

  // Notes methods
  async getNotes(params?: {
    category?: NoteCategory;
    taskId?: number;
    search?: string;
  }): Promise<Note[]> {
    return this.getStorage().getNotes(params);
  }

  async getNote(id: number): Promise<Note> {
    return this.getStorage().getNote(id);
  }

  async createNote(note: CreateNoteInput): Promise<Note> {
    return this.getStorage().createNote(note);
  }

  async updateNote(id: number, note: UpdateNoteInput): Promise<Note> {
    return this.getStorage().updateNote(id, note);
  }

  async deleteNote(id: number): Promise<void> {
    return this.getStorage().deleteNote(id);
  }
}

export const taskStorage: TaskStorage = new DynamicTaskStorage();

// Export for testing and debugging
export { LocalStorageTaskStorage, ApiTaskStorage };
