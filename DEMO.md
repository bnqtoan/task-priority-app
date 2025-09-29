# Demo Version Documentation

This document outlines the demo version constraints, implementation strategy, and best practices for maintaining sync between production and demo versions.

## Demo Version Overview

The demo branch provides a **public demonstration** of the Task Priority Framework without authentication requirements. All data is stored locally in the browser's localStorage, making it perfect for:

- **Public showcases** and portfolio demonstrations
- **User trials** without signup friction
- **Feature previews** for potential users
- **Development testing** without backend dependencies

## Key Constraints & Differences

### ❌ **Demo Limitations**

| Feature | Production | Demo |
|---------|------------|------|
| **Authentication** | Cloudflare Zero Trust | None (bypassed) |
| **Data Storage** | Cloudflare D1 Database | Browser localStorage |
| **Data Persistence** | Permanent, cross-device | Local browser only |
| **User Management** | Multi-user with isolation | Single demo user |
| **Data Sync** | Real-time across devices | Local only |
| **Backup/Export** | Database backups | Manual JSON export |

### ✅ **Demo Capabilities**

- ✅ Full task management (CRUD operations)
- ✅ All 8 AI recommendation algorithms
- ✅ ICE scoring and prioritization
- ✅ 4D decision framework (DO/DELEGATE/DELAY/DELETE)
- ✅ Time blocking categorization
- ✅ Real-time statistics and analytics
- ✅ All UI components and interactions
- ✅ Responsive design and mobile support

## Implementation Strategy

### 1. **Configuration-Based Approach**

Use environment variables and feature flags to control demo vs production behavior:

```typescript
// src/utils/config.ts
export const APP_CONFIG = {
  IS_DEMO: process.env.VITE_DEMO_MODE === 'true',
  STORAGE_TYPE: process.env.VITE_DEMO_MODE === 'true' ? 'localStorage' : 'database',
  AUTH_ENABLED: process.env.VITE_DEMO_MODE !== 'true',
  DEMO_USER: {
    id: 1,
    email: 'demo@taskpriority.app',
    name: 'Demo User'
  }
}
```

### 2. **Abstract Storage Layer**

Create a storage abstraction that can switch between localStorage and API calls:

```typescript
// src/lib/storage.ts
interface TaskStorage {
  getTasks(): Promise<Task[]>
  createTask(task: CreateTaskInput): Promise<Task>
  updateTask(id: number, task: Partial<Task>): Promise<Task>
  deleteTask(id: number): Promise<void>
}

class LocalStorageTaskStorage implements TaskStorage {
  // localStorage implementation
}

class ApiTaskStorage implements TaskStorage {
  // API implementation
}

export const taskStorage: TaskStorage = APP_CONFIG.IS_DEMO 
  ? new LocalStorageTaskStorage()
  : new ApiTaskStorage()
```

### 3. **Demo-Specific Components**

```typescript
// src/components/DemoNotice.tsx
export const DemoNotice = () => {
  if (!APP_CONFIG.IS_DEMO) return null
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-800">
            🚀 <strong>Demo Mode:</strong> Your data is stored locally and will be lost when you clear browser data.
            <a href="/signup" className="underline ml-2">Try the full version</a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

## Branch Management Strategy

### **Branching Model**

```
main (production)
├── demo (public demo)
├── feature/new-feature
└── hotfix/urgent-fix
```

### **Sync Workflow**

#### Option 1: **Regular Merge Strategy** (Recommended)

```bash
# 1. Update demo branch with latest production changes
git checkout demo
git merge main

# 2. Handle demo-specific conflicts
# 3. Test demo functionality
# 4. Push updated demo branch
git push origin demo
```

#### Option 2: **Cherry-Pick Strategy** (For selective updates)

```bash
# 1. Identify commits to sync
git log main --oneline --since="1 week ago"

# 2. Cherry-pick specific commits
git checkout demo
git cherry-pick <commit-hash>

# 3. Resolve conflicts and test
```

### **Automated Sync Process**

Create a GitHub Action to automate the sync:

```yaml
# .github/workflows/sync-demo.yml
name: Sync Demo Branch

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  sync-demo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Sync demo branch
        run: |
          git checkout demo
          git merge main --no-ff -m "Auto-sync from main"
          git push origin demo
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Development Best Practices

### 1. **Feature Flag Architecture**

Always wrap demo-specific code with feature flags:

```typescript
// ✅ Good: Feature-flagged approach
if (APP_CONFIG.IS_DEMO) {
  // Demo-specific logic
} else {
  // Production logic
}

// ❌ Bad: Separate files that diverge
// demo-api.ts vs production-api.ts
```

### 2. **Shared Core Logic**

Keep business logic identical between versions:

```typescript
// ✅ Good: Shared algorithms and calculations
export const calculateICE = (task: Task): string => {
  // Same logic for both demo and production
  return ((task.impact * task.confidence * task.ease) / 100).toFixed(2)
}

// ✅ Good: Shared UI components
export const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  // Same UI for both versions
}
```

### 3. **Demo Data Management**

```typescript
// src/lib/demo-data.ts
export const DEMO_SEED_DATA = {
  tasks: [
    {
      id: 1,
      title: "Implement user authentication",
      description: "Set up secure login system",
      impact: 9,
      confidence: 8,
      ease: 6,
      decision: "DO",
      timeBlock: "Deep Work"
    },
    // ... more sample tasks
  ]
}

export const initializeDemoData = () => {
  if (!localStorage.getItem('demo-tasks')) {
    localStorage.setItem('demo-tasks', JSON.stringify(DEMO_SEED_DATA.tasks))
  }
}
```

### 4. **Environment-Specific Builds**

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  define: {
    'process.env.VITE_DEMO_MODE': JSON.stringify(mode === 'demo'),
  },
  // ... other config
}))
```

```json
// package.json
{
  "scripts": {
    "build:demo": "vite build --mode demo",
    "build:prod": "vite build --mode production",
    "dev:demo": "vite dev --mode demo"
  }
}
```

## Deployment Strategy

### **Separate Deployments**

```yaml
# wrangler.toml (production)
name = "task-priority-app"
route = "app.taskpriority.com"

# wrangler.demo.toml (demo)
name = "task-priority-demo"
route = "demo.taskpriority.com"
```

### **Deploy Commands**

```bash
# Production deployment
npm run build:prod
wrangler deploy

# Demo deployment  
npm run build:demo
wrangler deploy --config wrangler.demo.toml
```

## Testing Strategy

### **Automated Testing**

```typescript
// tests/demo.test.ts
describe('Demo Mode', () => {
  beforeEach(() => {
    process.env.VITE_DEMO_MODE = 'true'
    localStorage.clear()
  })

  it('should use localStorage for task storage', () => {
    // Test localStorage functionality
  })

  it('should bypass authentication', () => {
    // Test auth bypass
  })

  it('should show demo notice', () => {
    // Test demo UI components
  })
})
```

### **Manual Testing Checklist**

- [ ] All task operations work (create, read, update, delete)
- [ ] Data persists in localStorage across page refreshes
- [ ] AI recommendations function correctly
- [ ] Statistics update in real-time
- [ ] Demo notice is visible
- [ ] No authentication prompts appear
- [ ] Export/import functionality works
- [ ] Mobile responsiveness maintained

## Monitoring & Analytics

### **Demo Usage Tracking**

```typescript
// Track demo usage without personal data
if (APP_CONFIG.IS_DEMO) {
  analytics.track('demo_session_started', {
    timestamp: Date.now(),
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`
  })
}
```

### **Performance Monitoring**

- Monitor localStorage performance vs database performance
- Track demo conversion rates (demo → signup)
- Monitor demo session duration and engagement

## Migration Path

### **Demo to Production Migration**

For users wanting to migrate from demo to production:

```typescript
// src/utils/migration.ts
export const exportDemoData = () => {
  const tasks = localStorage.getItem('demo-tasks')
  const preferences = localStorage.getItem('demo-preferences')
  
  return {
    tasks: tasks ? JSON.parse(tasks) : [],
    preferences: preferences ? JSON.parse(preferences) : {},
    exportDate: new Date().toISOString()
  }
}

export const importToProduction = async (demoData: DemoExport) => {
  // API calls to import data to production account
}
```

## Troubleshooting

### **Common Issues**

1. **Demo data lost**: Educate users about localStorage limitations
2. **Feature divergence**: Regular automated testing between versions
3. **Merge conflicts**: Careful conflict resolution during syncs
4. **Performance differences**: Monitor both versions separately

### **Debug Tools**

```typescript
// Debug helper for demo mode
if (APP_CONFIG.IS_DEMO && window.location.search.includes('debug=true')) {
  window.demoDebug = {
    clearData: () => localStorage.clear(),
    exportData: exportDemoData,
    seedData: () => initializeDemoData()
  }
}
```

## Future Considerations

### **Potential Enhancements**

1. **Cloud sync for demo**: Limited cloud storage for demo users
2. **Demo time limits**: Automatic data expiration
3. **Advanced export**: Multiple format support (CSV, JSON, PDF)
4. **Demo templates**: Pre-built scenario data sets
5. **Collaboration preview**: Simulated multi-user scenarios

### **Scaling Strategy**

As the app grows, consider:
- Feature flags management system (LaunchDarkly, etc.)
- Automated testing pipelines for both versions
- A/B testing between demo and production features
- User feedback collection specific to demo experience

---

This strategy ensures clean separation between demo and production while maintaining code reusability and minimizing development complexity.