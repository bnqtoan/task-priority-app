import type { Task, CreateTaskInput, User, UserPreferences, OverviewStats } from '../utils/types'
import { APP_CONFIG } from '../utils/config'
import { api } from '../client/lib/api'
import { initializeDemoData } from './demo-data'

// Storage interface that both localStorage and API implementations follow
interface TaskStorage {
  // Tasks
  getTasks(): Promise<Task[]>
  createTask(task: CreateTaskInput): Promise<Task>
  updateTask(id: number, task: Partial<Task>): Promise<Task>
  deleteTask(id: number): Promise<void>
  completeTask(id: number): Promise<Task>
  
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

  async getTasks(): Promise<Task[]> {
    return this.getTasksSync()
  }

  async createTask(taskInput: CreateTaskInput): Promise<Task> {
    const tasks = this.getTasksSync()
    const newTask: Task = {
      ...taskInput,
      id: this.getNextId(),
      userId: APP_CONFIG.DEMO_USER.id,
      isCompleted: false,
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
    return this.updateTask(id, { isCompleted: true })
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
    const completedTasks = tasks.filter(t => t.isCompleted).length
    const pendingTasks = totalTasks - completedTasks
    
    // Decision breakdown
    const doTasks = tasks.filter(t => t.decision === 'DO').length
    const delegateTasks = tasks.filter(t => t.decision === 'DELEGATE').length
    const delayTasks = tasks.filter(t => t.decision === 'DELAY').length
    const deleteTasks = tasks.filter(t => t.decision === 'DELETE').length
    
    // Time block breakdown
    const deepWorkTasks = tasks.filter(t => t.timeBlock === 'Deep Work').length
    const collaborativeTasks = tasks.filter(t => t.timeBlock === 'Collaborative').length
    const quickWinTasks = tasks.filter(t => t.timeBlock === 'Quick Wins').length
    const systematicTasks = tasks.filter(t => t.timeBlock === 'Systematic').length
    
    // Type breakdown
    const featureTasks = tasks.filter(t => t.type === 'feature').length
    const bugTasks = tasks.filter(t => t.type === 'bug').length
    const improvementTasks = tasks.filter(t => t.type === 'improvement').length
    const researchTasks = tasks.filter(t => t.type === 'research').length
    const documentationTasks = tasks.filter(t => t.type === 'documentation').length
    const otherTasks = tasks.filter(t => !['feature', 'bug', 'improvement', 'research', 'documentation'].includes(t.type)).length
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      byDecision: {
        do: doTasks,
        delegate: delegateTasks,
        delay: delayTasks,
        delete: deleteTasks
      },
      byTimeBlock: {
        deepWork: deepWorkTasks,
        collaborative: collaborativeTasks,
        quickWins: quickWinTasks,
        systematic: systematicTasks
      },
      byType: {
        feature: featureTasks,
        bug: bugTasks,
        improvement: improvementTasks,
        research: researchTasks,
        documentation: documentationTasks,
        other: otherTasks
      }
    }
  }
}

class ApiTaskStorage implements TaskStorage {
  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks')
    return response.tasks
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    const response = await api.post('/tasks', task)
    return response.task
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task)
    return response.task
  }

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  }

  async completeTask(id: number): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/complete`)
    return response.task
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.user
  }

  async getPreferences(): Promise<UserPreferences> {
    const response = await api.get('/preferences')
    return response.preferences
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await api.put('/preferences', preferences)
    return response.preferences
  }

  async getOverviewStats(): Promise<OverviewStats> {
    const response = await api.get('/stats/overview')
    return response.stats
  }
}

// Export the appropriate storage implementation based on configuration
export const taskStorage: TaskStorage = APP_CONFIG.IS_DEMO 
  ? new LocalStorageTaskStorage()
  : new ApiTaskStorage()

// Export for testing and debugging
export { LocalStorageTaskStorage, ApiTaskStorage }