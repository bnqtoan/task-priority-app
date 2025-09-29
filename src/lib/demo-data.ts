import type { Task, User, UserPreferences } from '../utils/types'

export const DEMO_SEED_DATA = {
  user: {
    id: 1,
    email: 'demo@taskpriority.app',
    name: 'Demo User',
    createdAt: new Date(),
    updatedAt: new Date()
  } as User,

  tasks: [
    {
      id: 1,
      name: "Implement user authentication",
      notes: "Set up secure login system with OAuth integration",
      impact: 9,
      confidence: 8,
      ease: 6,
      decision: "do",
      timeBlock: "deep",
      type: "strategic",
      estimatedTime: 120,
      status: "active",
      userId: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: "Design landing page mockup",
      notes: "Create wireframes and high-fidelity designs for homepage",
      impact: 7,
      confidence: 9,
      ease: 8,
      decision: "do",
      timeBlock: "collaborative",
      type: "operations",
      estimatedTime: 90,
      status: "active",
      userId: 1,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 3,
      name: "Update project documentation",
      notes: "Refresh README and API documentation",
      impact: 5,
      confidence: 10,
      ease: 9,
      decision: "delay",
      timeBlock: "quick",
      type: "operations",
      estimatedTime: 45,
      status: "active",
      userId: 1,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: 4,
      name: "Set up analytics tracking",
      notes: "Implement Google Analytics and user behavior tracking",
      impact: 6,
      confidence: 7,
      ease: 7,
      decision: "do",
      timeBlock: "systematic",
      type: "growth",
      estimatedTime: 60,
      status: "completed",
      userId: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-18'),
      completedAt: new Date('2024-01-18')
    },
    {
      id: 5,
      name: "Research competitor features",
      notes: "Analyze top 5 competitors and document feature gaps",
      impact: 8,
      confidence: 6,
      ease: 4,
      decision: "delegate",
      timeBlock: "systematic",
      type: "strategic",
      estimatedTime: 180,
      status: "active",
      userId: 1,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 6,
      name: "Optimize database queries",
      notes: "Improve query performance for large datasets",
      impact: 4,
      confidence: 5,
      ease: 3,
      decision: "delete",
      timeBlock: "deep",
      type: "operations",
      estimatedTime: 150,
      status: "active",
      userId: 1,
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19')
    }
  ] as Task[],

  preferences: {
    id: 1,
    userId: 1,
    preferredMethod: "hybrid",
    defaultTimeBlock: "deep",
    createdAt: new Date(),
    updatedAt: new Date()
  } as UserPreferences
}

export const initializeDemoData = () => {
  const currentVersion = '2.0.0' // Update this when data format changes
  const storedVersion = localStorage.getItem('demo-data-version')

  // Force reset if version changed or data format is incompatible
  if (storedVersion !== currentVersion) {
    resetDemoData()
    localStorage.setItem('demo-data-version', currentVersion)
    return
  }

  // Initialize tasks if not present
  if (!localStorage.getItem('demo-tasks')) {
    localStorage.setItem('demo-tasks', JSON.stringify(DEMO_SEED_DATA.tasks))
  }

  // Initialize user preferences if not present
  if (!localStorage.getItem('demo-preferences')) {
    localStorage.setItem('demo-preferences', JSON.stringify(DEMO_SEED_DATA.preferences))
  }

  // Initialize user data if not present
  if (!localStorage.getItem('demo-user')) {
    localStorage.setItem('demo-user', JSON.stringify(DEMO_SEED_DATA.user))
  }
}

export const resetDemoData = () => {
  localStorage.setItem('demo-tasks', JSON.stringify(DEMO_SEED_DATA.tasks))
  localStorage.setItem('demo-preferences', JSON.stringify(DEMO_SEED_DATA.preferences))
  localStorage.setItem('demo-user', JSON.stringify(DEMO_SEED_DATA.user))
  localStorage.setItem('demo-data-version', '2.0.0')
}

export const exportDemoData = () => {
  const tasks = localStorage.getItem('demo-tasks')
  const preferences = localStorage.getItem('demo-preferences')
  const user = localStorage.getItem('demo-user')

  return {
    tasks: tasks ? JSON.parse(tasks) : [],
    preferences: preferences ? JSON.parse(preferences) : {},
    user: user ? JSON.parse(user) : {},
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  }
}

export const importDemoData = (data: any) => {
  if (data.tasks) {
    localStorage.setItem('demo-tasks', JSON.stringify(data.tasks))
  }
  if (data.preferences) {
    localStorage.setItem('demo-preferences', JSON.stringify(data.preferences))
  }
  if (data.user) {
    localStorage.setItem('demo-user', JSON.stringify(data.user))
  }
}