// Configuration for demo vs production mode
export const APP_CONFIG = {
  IS_DEMO: import.meta.env.VITE_DEMO_MODE === 'true',
  STORAGE_TYPE: import.meta.env.VITE_DEMO_MODE === 'true' ? 'localStorage' : 'database',
  AUTH_ENABLED: import.meta.env.VITE_DEMO_MODE !== 'true',
  DEMO_USER: {
    id: 1,
    email: 'demo@taskpriority.app',
    name: 'Demo User'
  }
} as const

// Demo configuration
export const DEMO_CONFIG = {
  STORAGE_KEYS: {
    TASKS: 'demo-tasks',
    PREFERENCES: 'demo-preferences',
    STATS: 'demo-stats'
  },
  SEED_DATA_VERSION: '1.0.0'
} as const