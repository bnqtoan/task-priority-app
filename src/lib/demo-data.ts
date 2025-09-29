import type { Task, CreateTaskInput, User, UserPreferences } from '../utils/types'

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
      title: "Implement user authentication",
      description: "Set up secure login system with OAuth integration",
      impact: 9,
      confidence: 8,
      ease: 6,
      decision: "DO",
      timeBlock: "Deep Work",
      type: "feature",
      isCompleted: false,
      userId: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: "Design landing page mockup",
      description: "Create wireframes and high-fidelity designs for homepage",
      impact: 7,
      confidence: 9,
      ease: 8,
      decision: "DO",
      timeBlock: "Collaborative",
      type: "design",
      isCompleted: false,
      userId: 1,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 3,
      title: "Update project documentation",
      description: "Refresh README and API documentation",
      impact: 5,
      confidence: 10,
      ease: 9,
      decision: "DELAY",
      timeBlock: "Quick Wins",
      type: "documentation",
      isCompleted: false,
      userId: 1,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: 4,
      title: "Set up analytics tracking",
      description: "Implement Google Analytics and user behavior tracking",
      impact: 6,
      confidence: 7,
      ease: 7,
      decision: "DO",
      timeBlock: "Systematic",
      type: "feature",
      isCompleted: true,
      userId: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 5,
      title: "Research competitor features",
      description: "Analyze top 5 competitors and document feature gaps",
      impact: 8,
      confidence: 6,
      ease: 4,
      decision: "DELEGATE",
      timeBlock: "Systematic",
      type: "research",
      isCompleted: false,
      userId: 1,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 6,
      title: "Optimize database queries",
      description: "Improve query performance for large datasets",
      impact: 4,
      confidence: 5,
      ease: 3,
      decision: "DELETE",
      timeBlock: "Deep Work",
      type: "optimization",
      isCompleted: false,
      userId: 1,
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19')
    }
  ] as Task[],
  
  preferences: {
    id: 1,
    userId: 1,
    defaultTimeBlock: "Deep Work",
    defaultDecision: "DO",
    impactWeight: 1.0,
    confidenceWeight: 1.0,
    easeWeight: 1.0,
    createdAt: new Date(),
    updatedAt: new Date()
  } as UserPreferences
}

export const initializeDemoData = () => {
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