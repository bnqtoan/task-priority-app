// Safe way to access import.meta.env that works in both browser and server contexts
const getEnvVar = (name: string): string | undefined => {
  try {
    // In browser context (Vite), use import.meta.env
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[name];
    }
  } catch {
    // Ignore errors in server context
  }
  // In server context (Node.js), import.meta.env doesn't exist, default to undefined
  return undefined;
};

// Configuration for demo vs production mode
export const APP_CONFIG = {
  IS_DEMO: getEnvVar('VITE_DEMO_MODE') === 'true',
  STORAGE_TYPE: getEnvVar('VITE_DEMO_MODE') === 'true' ? 'localStorage' : 'database',
  AUTH_ENABLED: getEnvVar('VITE_DEMO_MODE') !== 'true',
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