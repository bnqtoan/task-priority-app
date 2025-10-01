# Product Requirements Document (PRD)

## Task Priority Framework - Fullstack Application

**Version:** 2.0 (Updated with Zero Trust Auth)  
**Date:** September 29, 2025  
**Target Platform:** Cloudflare Workers  
**Author:** Product Team

---

## 1. Executive Summary

Build a fullstack task priority management application that helps users evaluate, prioritize, and make decisions about their daily tasks using multiple AI recommendation algorithms. The app will run entirely on Cloudflare's edge infrastructure with Zero Trust authentication.

**Core Value Proposition:**

- Multi-method AI task prioritization (8 algorithms)
- Time blocking optimization
- 4D decision framework (DO/DELEGATE/DELAY/DELETE)
- Fast, global, serverless architecture
- Secure with Cloudflare Access (Zero Trust)

---

## 2. Tech Stack (Cloudflare Workers Ecosystem)

### 2.1 Frontend

- **Framework:** React 18+ with Vite
- **Routing:** React Router v7 (Remix)
- **Styling:** Tailwind CSS (core utilities only)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **UI Reference:** `task-priority-framework` artifact (already built)

### 2.2 Backend

- **Runtime:** Cloudflare Workers (V8 isolates)
- **Framework:** Hono (lightweight web framework)
- **Language:** TypeScript

### 2.3 Database

- **Primary DB:** Cloudflare D1 (SQLite-based)
- **ORM:** Drizzle ORM
- **Migration Tool:** Drizzle Kit

### 2.4 Authentication ✨ **UPDATED**

- **Strategy:** Cloudflare Access (Zero Trust)
- **Identity Provider:** One-time PIN (OTP) via email OR GitHub OAuth
- **Authorization:** JWT validation via `CF-Access-JWT-Assertion` header
- **No custom auth API needed** - Cloudflare handles it all!

### 2.5 Development Tools

- **CLI:** Wrangler
- **Package Manager:** npm/pnpm
- **TypeScript:** v5.x
- **Build Tool:** Vite

### 2.6 Deployment

- **Platform:** Cloudflare Workers
- **CI/CD:** GitHub Actions (optional)
- **Domain:** Cloudflare Pages custom domain
- **Protection:** Cloudflare Access policy

---

## 3. UI Reference 🎨

**IMPORTANT:** The complete React UI is already built in artifact `task-priority-framework`.

Claude Code should:

1. ✅ **Copy the entire React component structure** from that artifact
2. ✅ **Reuse all existing components** (TaskTable, StatsCards, MethodSelector, etc.)
3. ✅ **Keep the same styling** (Tailwind classes)
4. ✅ **Maintain the same UX flow**

**Only changes needed:**

- Remove mock data → Connect to real API
- Add API client for fetch calls
- Add loading states
- Add error handling

**DO NOT recreate the UI from scratch.** Just adapt the existing artifact to connect with the backend API.

---

## 4. Database Schema (Drizzle ORM)

### 4.1 Users Table ✨ **SIMPLIFIED**

```typescript
// Cloudflare Access handles auth, so we only need basic user info
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(), // From CF-Access-Authenticated-User-Email
  name: text("name"),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

### 4.2 Tasks Table (UNCHANGED)

```typescript
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Task details
  name: text("name").notNull(),
  notes: text("notes"),

  // ICE Scoring
  impact: integer("impact").notNull(), // 1-10
  confidence: integer("confidence").notNull(), // 1-10
  ease: integer("ease").notNull(), // 1-10

  // Categorization
  type: text("type").notNull(), // 'revenue' | 'growth' | 'operations' | 'strategic' | 'personal'
  timeBlock: text("time_block").notNull(), // 'deep' | 'collaborative' | 'quick' | 'systematic'

  // Time & Decision
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  decision: text("decision").notNull(), // 'do' | 'delegate' | 'delay' | 'delete'

  // Status
  status: text("status").notNull().default("active"), // 'active' | 'completed' | 'archived'

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});
```

### 4.3 User Preferences Table (UNCHANGED)

```typescript
export const userPreferences = sqliteTable("user_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),

  // AI Method preference
  preferredMethod: text("preferred_method").notNull().default("hybrid"),

  // UI preferences
  defaultTimeBlock: text("default_time_block").default("all"),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

**Note:** No sessions table needed - Cloudflare Access handles sessions!

---

## 5. Cloudflare Access Setup ✨ **NEW SECTION**

### 5.1 Access Application Configuration

**In Cloudflare Dashboard:**

1. Go to **Zero Trust** → **Access** → **Applications**
2. Click **Add an application** → **Self-hosted**
3. Configure:
   - **Application name:** Task Priority App
   - **Subdomain:** task-priority (or your custom domain)
   - **Domain:** yourdomain.com
   - **Path:** Leave blank (protect entire app)

4. **Identity provider:** Choose one:
   - **One-time PIN** (email-based, simplest)
   - **GitHub** (OAuth)
   - Both (users can choose)

5. **Policy:**
   - **Policy name:** Allow Team Members
   - **Action:** Allow
   - **Include:** Emails ending in `@yourdomain.com` OR specific email addresses
   - **Session duration:** 8 hours

### 5.2 JWT Validation in Worker

Cloudflare Access adds these headers to every request:

- `CF-Access-JWT-Assertion` - JWT token
- `CF-Access-Authenticated-User-Email` - User email
- `CF-Access-Authenticated-User-Name` - User name (if available)

**Worker middleware validates:**

```typescript
async function validateAccess(request: Request): Promise<User | null> {
  const jwt = request.headers.get("CF-Access-JWT-Assertion");
  const email = request.headers.get("CF-Access-Authenticated-User-Email");

  if (!jwt || !email) {
    return null; // Not authenticated via Cloudflare Access
  }

  // JWT is already validated by Cloudflare Access
  // Just extract user info and create/update user in DB

  return {
    email,
    name: request.headers.get("CF-Access-Authenticated-User-Name") || email,
  };
}
```

### 5.3 Benefits of Zero Trust Auth

✅ **No auth code to write** - Cloudflare handles login UI, sessions, MFA  
✅ **No password storage** - No security liability  
✅ **No session management** - Cloudflare manages it  
✅ **Built-in security** - DDOS protection, rate limiting, anomaly detection  
✅ **Free tier available** - Up to 50 users  
✅ **Multiple IdPs** - One-time PIN, GitHub, Google, etc.

---

## 6. API Endpoints (Hono Routes)

### 6.1 Authentication ✨ **SIMPLIFIED**

```
GET    /api/auth/me              - Get current user (from Access headers)
                                   Returns: { email, name, userId }
```

That's it! No signup/login/logout endpoints needed.

### 6.2 Task Routes (Protected)

```
GET    /api/tasks                - List all tasks for user
                                   Query params: ?status=active&timeBlock=deep&limit=50
POST   /api/tasks                - Create new task
GET    /api/tasks/:id            - Get single task
PUT    /api/tasks/:id            - Update task
DELETE /api/tasks/:id            - Delete task
PATCH  /api/tasks/:id/complete   - Mark task as completed
```

### 6.3 Preferences Routes (Protected)

```
GET    /api/preferences          - Get user preferences
PUT    /api/preferences          - Update user preferences
```

### 6.4 Stats Routes (Protected)

```
GET    /api/stats/overview       - Get overview stats (counts by decision, time block, type)
GET    /api/stats/recommendations - Get AI recommendations for all tasks with selected method
                                    Query params: ?method=hybrid
```

---

## 7. Frontend Architecture

### 7.1 Pages Structure

```
/                    - Landing page (public, before Access auth)
/app                 - Main dashboard (protected by Cloudflare Access)
/app/settings        - Settings page (protected)
```

### 7.2 Component Reuse from Artifact

**Copy these components directly from `task-priority-framework` artifact:**

1. **Main Dashboard Component**
   - Header with method selector
   - 4 Decision cards (DO/DELEGATE/DELAY/DELETE stats)
   - 4 Time Block cards
   - Add Task form
   - Task table with tabs
   - Decision framework guide

2. **Utility Functions**
   - All 8 AI recommendation algorithms
   - ICE score calculator
   - Helper functions (getTypeInfo, getTimeBlockInfo, getDecisionInfo)

**Only add:**

- API client (`/lib/api.ts`)
- Loading states
- Error handling
- Toast notifications (optional)

### 7.3 State Management

```typescript
// In Dashboard component
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);
const [selectedMethod, setSelectedMethod] = useState("hybrid");
const [user, setUser] = useState<User | null>(null);

// Fetch on mount
useEffect(() => {
  fetchUser();
  fetchTasks();
}, []);
```

---

## 8. Data Flow

### 8.1 Authentication Flow

```
1. User visits app → Cloudflare Access intercepts
2. Access shows login page (OTP or OAuth)
3. User authenticates → Access creates session
4. Access redirects to app with JWT headers
5. Worker validates headers → Creates/updates user in DB
6. App fetches user data and tasks
```

### 8.2 Task CRUD Flow

```
Frontend (React)
  ↓ fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) })
Cloudflare Worker (Hono)
  ↓ Validate Access JWT (middleware)
  ↓ Extract userId from headers
  ↓ Insert task (Drizzle ORM)
Cloudflare D1 (SQLite)
  ↑ Return inserted task
Worker Response (JSON)
  ↑ Update local state
Frontend (React)
```

---

## 9. File Structure

```
/task-priority-app
├── /src
│   ├── /server              # Backend (Hono + Workers)
│   │   ├── index.ts         # Main worker entry
│   │   ├── /routes
│   │   │   ├── auth.ts      # Auth routes (just /me endpoint)
│   │   │   ├── tasks.ts     # Task CRUD routes
│   │   │   ├── preferences.ts
│   │   │   └── stats.ts
│   │   ├── /middleware
│   │   │   ├── access.ts    # Cloudflare Access validation
│   │   │   └── cors.ts
│   │   └── /lib
│   │       └── db.ts        # Drizzle DB instance
│   │
│   ├── /client              # Frontend (React)
│   │   ├── main.tsx         # React entry
│   │   ├── App.tsx          # Root component with routing
│   │   ├── /pages
│   │   │   ├── Landing.tsx  # Public landing page
│   │   │   ├── Dashboard.tsx # Main app (copy from artifact)
│   │   │   └── Settings.tsx
│   │   ├── /components
│   │   │   ├── Header.tsx
│   │   │   ├── TaskTable.tsx      # Copy from artifact
│   │   │   ├── TaskForm.tsx       # Copy from artifact
│   │   │   ├── StatsCards.tsx     # Copy from artifact
│   │   │   ├── TimeBlockCards.tsx # Copy from artifact
│   │   │   └── MethodSelector.tsx # Copy from artifact
│   │   └── /lib
│   │       ├── api.ts       # API client
│   │       └── types.ts     # TypeScript types
│   │
│   ├── /db                  # Database
│   │   ├── schema.ts        # Drizzle schema
│   │   └── /migrations      # SQL migrations
│   │
│   └── /utils               # Shared utilities
│       ├── algorithms.ts    # 8 AI methods (copy from artifact)
│       ├── validation.ts    # Zod schemas
│       └── constants.ts     # App constants
│
├── /public                  # Static assets
├── wrangler.toml            # Cloudflare config
├── drizzle.config.ts        # Drizzle Kit config
├── vite.config.ts           # Vite config
├── tsconfig.json
├── package.json
└── README.md
```

---

## 10. Middleware: Access Validation

```typescript
// src/server/middleware/access.ts
import { createMiddleware } from "hono/factory";
import { db } from "../lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const accessMiddleware = createMiddleware(async (c, next) => {
  // Get headers from Cloudflare Access
  const email = c.req.header("CF-Access-Authenticated-User-Email");
  const name = c.req.header("CF-Access-Authenticated-User-Name");

  if (!email) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Find or create user
  let user = await db.select().from(users).where(eq(users.email, email)).get();

  if (!user) {
    // Auto-create user on first access
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: name || email.split("@")[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    user = newUser;
  }

  // Attach user to context
  c.set("user", user);

  await next();
});
```

---

## 11. Development Workflow

### 11.1 Local Development

```bash
# Install dependencies
npm install

# Setup D1 database locally
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations locally

# Start dev server (Vite + Wrangler)
npm run dev            # Frontend: http://localhost:5173
                       # Backend: http://localhost:8787

# View local D1 data
npm run db:studio      # Drizzle Studio
```

**Note:** Local development won't have Cloudflare Access headers.

- Create a mock middleware for local dev that sets dummy headers
- Or use `wrangler dev --remote` to test with real Access

### 11.2 Cloudflare Access Setup (Before Deployment)

**In Cloudflare Dashboard:**

1. **Zero Trust** → **Access** → **Applications** → **Add application**
2. Configure as described in Section 5.1
3. Get your Access **AUD (Audience) tag** from application settings
4. Add to `wrangler.toml`:
   ```toml
   [vars]
   ACCESS_AUD = "your-aud-tag-here"
   ```

### 11.3 Deployment

```bash
# Create remote D1 database
npx wrangler d1 create task-priority-db

# Update wrangler.toml with database_id

# Push migrations to production
npm run db:migrate:prod

# Deploy to Cloudflare
npm run deploy

# Visit your app (will redirect to Access login)
https://task-priority.yourdomain.com
```

---

## 12. Environment Configuration

### 12.1 wrangler.toml

```toml
name = "task-priority-app"
main = "src/server/index.ts"
compatibility_date = "2025-09-29"
compatibility_flags = ["nodejs_compat"]

# Assets (Frontend build output)
[assets]
directory = "./dist/client"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "task-priority-db"
database_id = "your-database-id-here"

# Variables (non-secret)
[vars]
ACCESS_AUD = "your-access-aud-tag"

# Development (local D1)
[dev]
port = 8787
```

### 12.2 .env (Local Development Only)

```bash
# Local D1
DATABASE_URL=file:./dev.db

# Cloudflare (for migrations)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
CLOUDFLARE_D1_TOKEN=your-api-token

# Mock Access headers for local dev
MOCK_USER_EMAIL=dev@example.com
MOCK_USER_NAME=Dev User
```

---

## 13. Security Requirements

### 13.1 Authentication (via Cloudflare Access)

- ✅ Session-based with httpOnly cookies (handled by Access)
- ✅ CSRF protection (handled by Access)
- ✅ MFA available (configurable in Access)
- ✅ Session expiry (configurable in Access policy)

### 13.2 Authorization

- Validate JWT headers in every request
- Users can only access their own tasks
- Validate userId in all DB queries

### 13.3 Input Validation

- Validate all inputs using Zod
- Sanitize user inputs to prevent XSS
- Rate limiting (built into Cloudflare Access)

### 13.4 CORS

- Only allow requests with valid Access JWT
- No public API endpoints

---

## 14. API Client (Frontend)

```typescript
// src/client/lib/api.ts
const API_BASE = "/api";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include", // Include cookies
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth
  getMe: () => fetchAPI("/auth/me"),

  // Tasks
  getTasks: (params?: { status?: string; timeBlock?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/tasks?${query}`);
  },

  createTask: (task: CreateTaskInput) =>
    fetchAPI("/tasks", { method: "POST", body: JSON.stringify(task) }),

  updateTask: (id: number, task: UpdateTaskInput) =>
    fetchAPI(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) }),

  deleteTask: (id: number) => fetchAPI(`/tasks/${id}`, { method: "DELETE" }),

  completeTask: (id: number) =>
    fetchAPI(`/tasks/${id}/complete`, { method: "PATCH" }),

  // Preferences
  getPreferences: () => fetchAPI("/preferences"),
  updatePreferences: (prefs: UpdatePreferencesInput) =>
    fetchAPI("/preferences", { method: "PUT", body: JSON.stringify(prefs) }),

  // Stats
  getOverview: () => fetchAPI("/stats/overview"),
  getRecommendations: (method: string) =>
    fetchAPI(`/stats/recommendations?method=${method}`),
};
```

---

## 15. Testing Strategy

### 15.1 Unit Tests

- Algorithm functions (all 8 methods)
- Validation schemas
- Utility functions

### 15.2 Integration Tests

- API endpoint responses
- Database queries
- Access middleware

### 15.3 Manual Testing

- Test Access login flow (OTP/GitHub)
- Test task CRUD
- Test method switching
- Test on mobile

---

## 16. Performance Requirements

Same as before:

- API endpoints: < 100ms (p95)
- Dashboard load: < 2s (p95)
- Task operations: < 500ms (p95)

---

## 17. Implementation Priority for Claude Code

### Phase 1: Setup (30 minutes)

1. ✅ Initialize project with Vite + Wrangler
2. ✅ Setup Drizzle ORM + D1
3. ✅ Create database schema
4. ✅ Run local migrations

### Phase 2: Backend (1 hour)

5. ✅ Setup Hono server
6. ✅ Create Access validation middleware
7. ✅ Implement `/api/auth/me` endpoint
8. ✅ Implement tasks CRUD endpoints
9. ✅ Implement preferences endpoints
10. ✅ Implement stats endpoints

### Phase 3: Frontend (1 hour)

11. ✅ **Copy React components from artifact** `task-priority-framework`
12. ✅ Create API client
13. ✅ Connect Dashboard to API
14. ✅ Add loading states
15. ✅ Add error handling

### Phase 4: Integration (30 minutes)

16. ✅ Test full flow locally (with mock Access headers)
17. ✅ Fix any bugs
18. ✅ Add basic error messages

### Phase 5: Deployment (30 minutes)

19. ✅ Setup Cloudflare Access application
20. ✅ Deploy to Cloudflare Workers
21. ✅ Run production migrations
22. ✅ Test with real Access authentication

**Total estimated time: 3-4 hours**

---

## 18. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^7.0.0",
    "hono": "^4.0.0",
    "drizzle-orm": "^0.36.0",
    "lucide-react": "^0.460.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "wrangler": "^3.90.0",
    "drizzle-kit": "^0.28.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 19. Critical Instructions for Claude Code

### 🎨 UI Implementation

**DO NOT recreate the UI from scratch!**

1. ✅ Open artifact `task-priority-framework`
2. ✅ Copy the entire React component code
3. ✅ Reuse all existing components, styles, and logic
4. ✅ Only add API integration layer

The UI is **already perfect** - just connect it to the backend!

### 🔐 Authentication

**DO NOT build custom auth!**

1. ✅ Use Cloudflare Access middleware only
2. ✅ Validate JWT headers in every protected route
3. ✅ Auto-create users on first access
4. ✅ For local dev, create mock middleware that sets dummy headers

### 🗄️ Database

1. ✅ Use Drizzle ORM (not raw SQL)
2. ✅ Use provided schema (Section 4)
3. ✅ Add indexes on userId, status, createdAt
4. ✅ Use transactions for complex operations

### 🤖 AI Algorithms

1. ✅ Copy all 8 algorithms from artifact `task-priority-framework`
2. ✅ Put in `/utils/algorithms.ts`
3. ✅ Use same function signatures
4. ✅ Keep all logic identical

---

## 20. Success Criteria

### MVP Ready When:

- ✅ Cloudflare Access authentication works
- ✅ User can create/edit/delete tasks
- ✅ All 8 AI methods work correctly
- ✅ Task table shows live recommendations
- ✅ Stats cards update in real-time
- ✅ Data persists in D1
- ✅ UI matches the artifact exactly
- ✅ Deployed to Cloudflare Workers
- ✅ < 2s page load time

---

## 21. Benefits of This Architecture

✅ **No custom auth code** - Save 4-6 hours of development  
✅ **No password security liability** - Cloudflare handles it  
✅ **No session management complexity**  
✅ **Built-in DDOS protection**  
✅ **Free for up to 50 users**  
✅ **Enterprise-grade security**  
✅ **Multiple IdP support** (OTP, GitHub, Google, etc.)  
✅ **UI already built** - Just integrate with API  
✅ **Serverless, globally distributed**  
✅ **Auto-scaling**

---

## 22. Final Notes

### For Claude Code:

1. **Read artifact `task-priority-framework` first** - All UI components are there
2. **Focus on backend + API integration** - Frontend is 80% done
3. **Test with mock Access headers locally** - Real Access only on production
4. **Keep it simple** - Don't over-engineer
5. **Ask for clarification** if anything is unclear

### For Implementation:

- Start with database schema
- Then backend API
- Then copy frontend from artifact
- Finally integrate and deploy

**Total build time: 3-4 hours instead of 10-12 hours!**

---

**END OF PRD v2.0**
