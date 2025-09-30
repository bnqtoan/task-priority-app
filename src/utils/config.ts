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

// Detect demo mode based on environment variables or URL
const isDemoMode = (): boolean => {
  // Check environment variables first (for local development)
  const viteDemo = getEnvVar('VITE_DEMO_MODE') === 'true';
  const serverDemo = getEnvVar('DEMO_MODE') === 'true';
  
  if (viteDemo || serverDemo) {
    console.log('Demo mode detected via environment variables:', { viteDemo, serverDemo });
    return true;
  }
  
  // Check URL hostname for demo deployment
  if (typeof window !== 'undefined') {
    const isDemo = window.location.hostname.includes('task-priority-demo');
    console.log('Demo mode hostname check:', window.location.hostname, 'isDemo:', isDemo);
    return isDemo;
  }
  
  console.log('Demo mode: false (no window context)');
  return false;
};

// Configuration for demo vs production mode
export const APP_CONFIG = {
  IS_DEMO: isDemoMode(),
  STORAGE_TYPE: isDemoMode() ? 'localStorage' : 'database',
  AUTH_ENABLED: !isDemoMode(),
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