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
      name: "🚀 Build Revolutionary AI-Powered Task Manager",
      notes: "Create the next-generation task management system that uses AI to predict optimal work schedules and automatically prioritize tasks based on user behavior patterns.",
      impact: 10,
      confidence: 7,
      ease: 4,
      decision: "do",
      timeBlock: "deep",
      type: "strategic",
      estimatedTime: 240,
      actualTime: 145,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: "🎨 Design Mind-Blowing User Interface",
      notes: "Craft a stunning, intuitive UI that makes users say 'wow' the moment they see it. Include micro-interactions, beautiful animations, and a color scheme that sparks joy.",
      impact: 8,
      confidence: 9,
      ease: 7,
      decision: "do",
      timeBlock: "collaborative",
      type: "operations",
      estimatedTime: 120,
      actualTime: 95,
      status: "completed",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-18'),
      completedAt: new Date('2024-01-18')
    },
    {
      id: 3,
      name: "📚 Write Epic Documentation That Developers Actually Read",
      notes: "Create documentation so good that developers will bookmark it, share it, and actually follow it. Include interactive examples, GIFs, and maybe some memes.",
      impact: 6,
      confidence: 8,
      ease: 9,
      decision: "delay",
      timeBlock: "quick",
      type: "operations",
      estimatedTime: 90,
      actualTime: 25,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: 4,
      name: "📊 Master the Art of Data Analytics",
      notes: "Set up comprehensive analytics to track every click, hover, and scroll. Transform into a data wizard who can predict user behavior with scary accuracy.",
      impact: 7,
      confidence: 6,
      ease: 8,
      decision: "do",
      timeBlock: "systematic",
      type: "growth",
      estimatedTime: 75,
      actualTime: 82,
      status: "completed",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-18'),
      completedAt: new Date('2024-01-18')
    },
    {
      id: 5,
      name: "🕵️ Conduct Top-Secret Competitor Intelligence",
      notes: "Go undercover and analyze every competitor. Create a detailed battle plan that would make Sun Tzu proud. Know thy enemy better than they know themselves.",
      impact: 9,
      confidence: 5,
      ease: 6,
      decision: "delegate",
      timeBlock: "systematic",
      type: "strategic",
      estimatedTime: 200,
      actualTime: 0,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 6,
      name: "⚡ Optimize Everything Until It's Lightning Fast",
      notes: "Make the app so fast that users will question if they've discovered time travel. Every millisecond counts in the race for user satisfaction.",
      impact: 5,
      confidence: 4,
      ease: 3,
      decision: "delete",
      timeBlock: "deep",
      type: "operations",
      estimatedTime: 180,
      actualTime: 0,
      status: "archived",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: 7,
      name: "🎯 Launch Perfect Marketing Campaign",
      notes: "Create a marketing campaign so brilliant it will be studied in business schools. Target the right audience with the right message at the right time.",
      impact: 9,
      confidence: 7,
      ease: 5,
      decision: "do",
      timeBlock: "collaborative",
      type: "revenue",
      estimatedTime: 160,
      actualTime: 75,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 8,
      name: "🔧 Build Robust Testing Framework",
      notes: "Create a testing suite so comprehensive that bugs will be afraid to show their faces. Every edge case covered, every scenario tested.",
      impact: 7,
      confidence: 8,
      ease: 6,
      decision: "do",
      timeBlock: "deep",
      type: "operations",
      estimatedTime: 140,
      actualTime: 67,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: 9,
      name: "💰 Negotiate Million-Dollar Partnership Deal",
      notes: "Secure a game-changing partnership that will propel the business to new heights. Charm, strategy, and a killer presentation required.",
      impact: 10,
      confidence: 3,
      ease: 2,
      decision: "do",
      timeBlock: "systematic",
      type: "revenue",
      estimatedTime: 300,
      actualTime: 0,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: 10,
      name: "🌟 Achieve Work-Life Balance Mastery",
      notes: "Master the ancient art of work-life balance. Become a productivity guru who can work efficiently and still have time for hobbies, family, and Netflix.",
      impact: 8,
      confidence: 4,
      ease: 8,
      decision: "do",
      timeBlock: "quick",
      type: "personal",
      estimatedTime: 60,
      actualTime: 35,
      status: "active",
      isInFocus: false,
      userId: 1,
      createdAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23')
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
  const currentVersion = '3.0.0' // Update this when data format changes (added time tracking fields)
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
  localStorage.setItem('demo-data-version', '3.0.0')
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