import type { Task, CreateTaskInput, User, UserPreferences, OverviewStats } from '../utils/types'
import { APP_CONFIG } from '../utils/config'
import { api } from '../client/lib/api'
import { initializeDemoData } from './demo-data'

// Storage interface that both localStorage and API implementations follow
interface TaskStorage {
  // Tasks
  getTasks(params?: { status?: string; timeBlock?: string; limit?: number }): Promise<Task[]>
  createTask(task: CreateTaskInput): Promise<Task>
  updateTask(id: number, task: Partial<Task>): Promise<Task>
  deleteTask(id: number): Promise<void>
  completeTask(id: number): Promise<Task>

  // Time tracking
  startFocusSession(taskId: number): Promise<Task>
  endFocusSession(taskId: number, duration: number): Promise<Task>
  addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task>

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

  async getTasks(params?: { status?: string; timeBlock?: string; limit?: number }): Promise<Task[]> {
    let tasks = this.getTasksSync()

    // Apply filters if provided
    if (params?.status) {
      tasks = tasks.filter(task => task.status === params.status)
    }

    if (params?.timeBlock && params.timeBlock !== 'all') {
      tasks = tasks.filter(task => task.timeBlock === params.timeBlock)
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
  async getTasks(params?: { status?: string; timeBlock?: string; limit?: number }): Promise<Task[]> {
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

  async startFocusSession(taskId: number): Promise<Task> {
    return api.startFocusSession(taskId)
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return api.endFocusSession(taskId, duration)
  }

  async addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task> {
    return api.addTimeEntry(taskId, duration, type)
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

  async getTasks(params?: { status?: string; timeBlock?: string; limit?: number }): Promise<Task[]> {
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

  async startFocusSession(taskId: number): Promise<Task> {
    return this.getStorage().startFocusSession(taskId)
  }

  async endFocusSession(taskId: number, duration: number): Promise<Task> {
    return this.getStorage().endFocusSession(taskId, duration)
  }

  async addTimeEntry(taskId: number, duration: number, type: 'focus' | 'regular'): Promise<Task> {
    return this.getStorage().addTimeEntry(taskId, duration, type)
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