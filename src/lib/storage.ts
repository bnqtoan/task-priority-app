import type { Task, CreateTaskInput, User, UserPreferences, OverviewStats, SchedulingWindow, DailyCapacity } from '../utils/types'
import { APP_CONFIG } from '../utils/config'
import { api } from '../client/lib/api'
import { initializeDemoData } from './demo-data'

// Storage interface that both localStorage and API implementations follow
interface TaskStorage {
  // Tasks
  getTasks(params?: { status?: string; timeBlock?: string; scheduledFor?: SchedulingWindow; limit?: number }): Promise<Task[]>
  createTask(task: CreateTaskInput): Promise<Task>
  updateTask(id: number, task: Partial<Task>): Promise<Task>
  deleteTask(id: number): Promise<void>
  completeTask(id: number): Promise<Task>

  // Time tracking
  startFocusSession(taskId: number): Promise<Task>
  endFocusSession(taskId: number, duration: number): Promise<Task>
  addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task>

  // Scheduling
  getTasksForToday(): Promise<Task[]>
  getTasksForWeek(): Promise<Task[]>
  getTasksForMonth(): Promise<Task[]>
  getDailyCapacity(date?: Date): Promise<DailyCapacity>
  completeRecurringTask(id: number): Promise<Task>

  // User
  getCurrentUser(): Promise<User>

  // Preferences
  getPreferences(): Promise<UserPreferences>
  updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>

  // Stats
  getOverviewStats(): Promise<OverviewStats>
}

class LocalStorageTaskStorage implements TaskStorage {
  constructor() {
    // Initialize demo data on first use
    initializeDemoData()
  }

  private getNextId(): number {
    const tasks = this.getTasksSync()
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  }

  private getTasksSync(): Task[] {
    const tasksJson = localStorage.getItem('demo-tasks')
    return tasksJson ? JSON.parse(tasksJson) : []
  }

  private saveTasksSync(tasks: Task[]): void {
    localStorage.setItem('demo-tasks', JSON.stringify(tasks))
  }

  async getTasks(params?: { status?: string; timeBlock?: string; scheduledFor?: SchedulingWindow; limit?: number }): Promise<Task[]> {
    let tasks = this.getTasksSync()

    // Apply filters if provided
    if (params?.status) {
      tasks = tasks.filter(task => task.status === params.status)
    }

    if (params?.timeBlock && params.timeBlock !== 'all') {
      tasks = tasks.filter(task => task.timeBlock === params.timeBlock)
    }

    if (params?.scheduledFor) {
      tasks = tasks.filter(task => task.scheduledFor === params.scheduledFor)
    }

    // Apply limit if provided
    if (params?.limit && params.limit > 0) {
      tasks = tasks.slice(0, params.limit)
    }

    return tasks
  }

  async createTask(taskInput: CreateTaskInput): Promise<Task> {
    const tasks = this.getTasksSync()
    const newTask: Task = {
      ...taskInput,
      id: this.getNextId(),
      userId: APP_CONFIG.DEMO_USER.id,
      notes: taskInput.notes || null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    tasks.push(newTask)
    this.saveTasksSync(tasks)
    return newTask
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task> {
    const tasks = this.getTasksSync()
    const index = tasks.findIndex(t => t.id === id)

    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }

    const updatedTask = {
      ...tasks[index],
      ...taskUpdate,
      updatedAt: new Date()
    }

    tasks[index] = updatedTask
    this.saveTasksSync(tasks)
    return updatedTask
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = this.getTasksSync()
    const filteredTasks = tasks.filter(t => t.id !== id)

    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`)
    }

    this.saveTasksSync(filteredTasks)
  }

  async completeTask(id: number): Promise<Task> {
    return this.updateTask(id, { status: 'completed', completedAt: new Date() })
  }

  async completeRecurringTask(id: number): Promise<Task> {
    const tasks = this.getTasksSync()
    const task = tasks.find(t => t.id === id)

    if (!task) {
      throw new Error('Task not found')
    }

    if (!task.recurringPattern) {
      // Not a recurring task, just complete it normally
      return this.completeTask(id)
    }

    // For recurring tasks, update last completed date and increment streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastCompleted = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null
    let newStreak = task.streakCount || 0

    // Calculate streak
    if (lastCompleted) {
      const daysDiff = Math.floor((today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24))

      if (task.recurringPattern === 'daily' && daysDiff === 1) {
        newStreak += 1
      } else if (task.recurringPattern === 'weekly' && daysDiff >= 6 && daysDiff <= 8) {
        newStreak += 1
      } else if (task.recurringPattern === 'monthly' && daysDiff >= 28 && daysDiff <= 32) {
        newStreak += 1
      } else {
        newStreak = 1 // Reset streak
      }
    } else {
      newStreak = 1 // First completion
    }

    return this.updateTask(id, {
      lastCompletedDate: today,
      streakCount: newStreak,
      status: 'completed',
      completedAt: new Date()
    })
  }

  async startFocusSession(taskId: number): Promise<Task> {
    return this.updateTask(taskId, { 
      isInFocus: true, 
      focusStartedAt: new Date() 
    })
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    const task = await this.updateTask(taskId, { 
      isInFocus: false, 
      focusStartedAt: undefined,
      actualTime: (await this.getTasks()).find(t => t.id === taskId)?.actualTime || 0 + duration
    })
    return task
  }

  async addTimeEntry(taskId: number, duration: number, _type: 'focus' | 'regular'): Promise<Task> {
    const tasks = this.getTasksSync()
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    const updatedTask = {
      ...task,
      actualTime: (task.actualTime || 0) + duration,
      updatedAt: new Date()
    }

    const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t)
    this.saveTasksSync(updatedTasks)
    return updatedTask
  }

  async getTasksForToday(): Promise<Task[]> {
    const tasks = this.getTasksSync()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter(task => {
      if (task.status !== 'active') return false

      // Include tasks scheduled for today
      if (task.scheduledFor === 'today') return true

      // Include recurring daily tasks not completed today
      if (task.recurringPattern === 'daily') {
        const lastCompleted = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null
        if (!lastCompleted || lastCompleted < today) {
          return true
        }
      }

      return false
    })
  }

  async getTasksForWeek(): Promise<Task[]> {
    const tasks = this.getTasksSync()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get start of week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    return tasks.filter(task => {
      if (task.status !== 'active') return false

      // Include tasks scheduled for today or this-week
      if (task.scheduledFor === 'today' || task.scheduledFor === 'this-week') {
        return true
      }

      // Include recurring weekly tasks not completed this week
      if (task.recurringPattern === 'weekly') {
        const lastCompleted = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null
        if (!lastCompleted || lastCompleted < startOfWeek) {
          return true
        }
      }

      // Include recurring daily tasks
      if (task.recurringPattern === 'daily') {
        return true
      }

      return false
    })
  }

  async getTasksForMonth(): Promise<Task[]> {
    const tasks = this.getTasksSync()
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    return tasks.filter(task => {
      if (task.status !== 'active') return false

      // Include tasks scheduled for today, this-week, or this-month
      if (task.scheduledFor === 'today' || task.scheduledFor === 'this-week' || task.scheduledFor === 'this-month') {
        return true
      }

      // Include recurring monthly tasks not completed this month
      if (task.recurringPattern === 'monthly') {
        const lastCompleted = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null
        if (!lastCompleted || lastCompleted < startOfMonth) {
          return true
        }
      }

      // Include recurring weekly and daily tasks
      if (task.recurringPattern === 'weekly' || task.recurringPattern === 'daily') {
        return true
      }

      return false
    })
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    const targetDate = date || new Date()
    targetDate.setHours(0, 0, 0, 0)

    const tasks = await this.getTasksForToday()

    const totalMinutes = 8 * 60 // Assume 8 hour workday
    const scheduledMinutes = tasks.reduce((sum, task) => sum + task.estimatedTime, 0)
    const availableMinutes = totalMinutes - scheduledMinutes

    return {
      totalMinutes,
      scheduledMinutes,
      availableMinutes,
      tasks
    }
  }

  async getCurrentUser(): Promise<User> {
    const userJson = localStorage.getItem('demo-user')
    if (!userJson) {
      throw new Error('Demo user not found')
    }
    return JSON.parse(userJson)
  }

  async getPreferences(): Promise<UserPreferences> {
    const prefsJson = localStorage.getItem('demo-preferences')
    if (!prefsJson) {
      throw new Error('Demo preferences not found')
    }
    return JSON.parse(prefsJson)
  }

  async updatePreferences(preferencesUpdate: Partial<UserPreferences>): Promise<UserPreferences> {
    const currentPrefs = await this.getPreferences()
    const updatedPrefs = {
      ...currentPrefs,
      ...preferencesUpdate,
      updatedAt: new Date()
    }

    localStorage.setItem('demo-preferences', JSON.stringify(updatedPrefs))
    return updatedPrefs
  }

  async getOverviewStats(): Promise<OverviewStats> {
    const tasks = this.getTasksSync()

    // Calculate stats from tasks
    const totalTasks = tasks.length
    const totalTime = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0)

    // Decision breakdown with count and time
    const doTasks = tasks.filter(t => t.decision === 'do')
    const delegateTasks = tasks.filter(t => t.decision === 'delegate')
    const delayTasks = tasks.filter(t => t.decision === 'delay')
    const deleteTasks = tasks.filter(t => t.decision === 'delete')

    // Time block breakdown with count and time
    const deepTasks = tasks.filter(t => t.timeBlock === 'deep')
    const collaborativeTasks = tasks.filter(t => t.timeBlock === 'collaborative')
    const quickTasks = tasks.filter(t => t.timeBlock === 'quick')
    const systematicTasks = tasks.filter(t => t.timeBlock === 'systematic')

    // Type breakdown with count and time
    const revenueTasks = tasks.filter(t => t.type === 'revenue')
    const growthTasks = tasks.filter(t => t.type === 'growth')
    const operationsTasks = tasks.filter(t => t.type === 'operations')
    const strategicTasks = tasks.filter(t => t.type === 'strategic')
    const personalTasks = tasks.filter(t => t.type === 'personal')

    const calculateStats = (taskList: Task[]) => ({
      count: taskList.length,
      time: taskList.reduce((sum, task) => sum + (task.estimatedTime || 0), 0)
    })

    return {
      decisions: {
        do: calculateStats(doTasks),
        delegate: calculateStats(delegateTasks),
        delay: calculateStats(delayTasks),
        delete: calculateStats(deleteTasks)
      },
      timeBlocks: {
        deep: calculateStats(deepTasks),
        collaborative: calculateStats(collaborativeTasks),
        quick: calculateStats(quickTasks),
        systematic: calculateStats(systematicTasks)
      },
      types: {
        revenue: calculateStats(revenueTasks),
        growth: calculateStats(growthTasks),
        operations: calculateStats(operationsTasks),
        strategic: calculateStats(strategicTasks),
        personal: calculateStats(personalTasks)
      },
      totalTasks,
      totalTime
    }
  }
}

class ApiTaskStorage implements TaskStorage {
  async getTasks(params?: { status?: string; timeBlock?: string; scheduledFor?: SchedulingWindow; limit?: number }): Promise<Task[]> {
    return api.getTasks(params)
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    return api.createTask(task)
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return api.updateTask(id, task)
  }

  async deleteTask(id: number): Promise<void> {
    await api.deleteTask(id)
  }

  async completeTask(id: number): Promise<Task> {
    return api.completeTask(id)
  }

  async completeRecurringTask(id: number): Promise<Task> {
    // API implementation - would call api.completeRecurringTask()
    // For now, use same logic as LocalStorage
    const localStorage = new LocalStorageTaskStorage()
    return localStorage.completeRecurringTask(id)
  }

  async startFocusSession(taskId: number): Promise<Task> {
    return api.startFocusSession(taskId)
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return api.endFocusSession(taskId, duration)
  }

  async addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task> {
    return api.addTimeEntry(taskId, duration, type)
  }

  async getTasksForToday(): Promise<Task[]> {
    // API implementation - would call api.getTasksForToday()
    const localStorage = new LocalStorageTaskStorage()
    return localStorage.getTasksForToday()
  }

  async getTasksForWeek(): Promise<Task[]> {
    const localStorage = new LocalStorageTaskStorage()
    return localStorage.getTasksForWeek()
  }

  async getTasksForMonth(): Promise<Task[]> {
    const localStorage = new LocalStorageTaskStorage()
    return localStorage.getTasksForMonth()
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    const localStorage = new LocalStorageTaskStorage()
    return localStorage.getDailyCapacity(date)
  }

  async getCurrentUser(): Promise<User> {
    return api.getMe()
  }

  async getPreferences(): Promise<UserPreferences> {
    return api.getPreferences()
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return api.updatePreferences(preferences)
  }

  async getOverviewStats(): Promise<OverviewStats> {
    return api.getOverview()
  }
}

// Dynamic storage that chooses the right implementation at runtime
class DynamicTaskStorage implements TaskStorage {
  private getStorage(): TaskStorage {
    return APP_CONFIG.IS_DEMO
      ? new LocalStorageTaskStorage()
      : new ApiTaskStorage()
  }

  async getTasks(params?: { status?: string; timeBlock?: string; scheduledFor?: SchedulingWindow; limit?: number }): Promise<Task[]> {
    return this.getStorage().getTasks(params)
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    return this.getStorage().createTask(task)
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.getStorage().updateTask(id, task)
  }

  async deleteTask(id: number): Promise<void> {
    return this.getStorage().deleteTask(id)
  }

  async completeTask(id: number): Promise<Task> {
    return this.getStorage().completeTask(id)
  }

  async completeRecurringTask(id: number): Promise<Task> {
    return this.getStorage().completeRecurringTask(id)
  }

  async startFocusSession(taskId: number): Promise<Task> {
    return this.getStorage().startFocusSession(taskId)
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return this.getStorage().endFocusSession(taskId, duration)
  }

  async addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task> {
    return this.getStorage().addTimeEntry(taskId, duration, type)
  }

  async getTasksForToday(): Promise<Task[]> {
    return this.getStorage().getTasksForToday()
  }

  async getTasksForWeek(): Promise<Task[]> {
    return this.getStorage().getTasksForWeek()
  }

  async getTasksForMonth(): Promise<Task[]> {
    return this.getStorage().getTasksForMonth()
  }

  async getDailyCapacity(date?: Date): Promise<DailyCapacity> {
    return this.getStorage().getDailyCapacity(date)
  }

  async getCurrentUser(): Promise<User> {
    return this.getStorage().getCurrentUser()
  }

  async getPreferences(): Promise<UserPreferences> {
    return this.getStorage().getPreferences()
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.getStorage().updatePreferences(preferences)
  }

  async getOverviewStats(): Promise<OverviewStats> {
    return this.getStorage().getOverviewStats()
  }
}

export const taskStorage: TaskStorage = new DynamicTaskStorage()

// Export for testing and debugging
export { LocalStorageTaskStorage, ApiTaskStorage }