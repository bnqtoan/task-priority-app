# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fullstack task prioritization application combining **ICE scoring** (Impact, Confidence, Ease), **time blocking**, and the **4D decision framework** (DO, DELEGATE, DELAY, DELETE) with 8 AI recommendation algorithms. Single-user personal productivity app deployed on Cloudflare Workers edge network.

**Key Features:**

- Focus Mode with Pomodoro timer, countdown timer, and time tracking
- 8 AI recommendation methods for task prioritization
- Reports & Analytics with productivity metrics
- Scheduling with daily/weekly/monthly views and recurring tasks
- Demo mode using localStorage (no backend required)

## Essential Commands

### Development

```bash
npm run dev                 # Start both client (Vite) and server (Node + Hono)
npm run dev:client          # Frontend only on http://localhost:5173
npm run dev:server          # Backend only on http://localhost:8787
npm run setup-local         # Initialize local D1 database with sample data
```

### Database Operations

```bash
npm run db:generate         # Generate Drizzle migrations from schema changes
npm run db:migrate          # Apply migrations to local D1 database
npm run db:migrate:prod     # Apply migrations to production D1 database
npm run db:studio           # Open Drizzle Studio (visual DB editor)
```

### Building & Deployment

```bash
npm run build               # Build client + server for production
npm run build:client        # Build React app with Vite
npm run build:server        # TypeScript compilation + Wrangler dry-run
npm run deploy              # Deploy to Cloudflare Workers
```

## Architecture

### Dual-Mode System

The app operates in two modes determined by `APP_CONFIG.IS_DEMO`:

**1. Demo Mode** (`IS_DEMO = true`)

- Uses `LocalStorageTaskStorage` from `src/lib/storage.ts`
- All data stored in browser's localStorage
- No authentication required
- Perfect for testing and single-device usage
- Auto-initialized with sample data via `src/lib/demo-data.ts`

**2. Production Mode** (`IS_DEMO = false`)

- Uses `ApiTaskStorage` calling Cloudflare Workers API
- Data stored in Cloudflare D1 (SQLite)
- Authentication via Cloudflare Zero Trust (Access)
- User auto-created on first login from CF-Access headers

### Storage Abstraction Layer

**File:** `src/lib/storage.ts`

The `DynamicTaskStorage` class automatically switches between implementations:

- `LocalStorageTaskStorage`: Direct localStorage manipulation for demo mode
- `ApiTaskStorage`: HTTP calls to `/api/*` endpoints for production

**Critical Behavior:** When `startFocusSession()` is called, it **automatically stops all other active focus sessions** by:

1. Finding tasks with `isInFocus: true`
2. Calculating elapsed time for each
3. Calling `endFocusSession()` to save their time
4. Then starting the new session

This ensures **only one timer tracker runs at a time**.

### Tech Stack Layers

```
Frontend (React 18 + Vite + Tailwind)
    ↓ src/client/lib/api.ts
API Routes (Hono framework)
    ↓ src/server/routes/*.ts
Access Middleware (Cloudflare Zero Trust JWT validation)
    ↓ src/server/middleware/access.ts
Business Logic & Validation
    ↓ Drizzle ORM
Cloudflare D1 (SQLite-based)
```

### Key Files Structure

**Configuration:**

- `src/utils/config.ts` - Detects demo vs production mode
- `wrangler.toml` - Cloudflare Workers config (account ID, D1 binding, Access AUD)

**Data Models:**

- `src/utils/types.ts` - Shared TypeScript types (Task, User, FocusSession, etc.)
- `src/db/schema.ts` - Drizzle ORM schema (users, tasks, timeEntries, userPreferences)

**Core Business Logic:**

- `src/utils/algorithms.ts` - 8 AI recommendation algorithms
- `src/utils/pomodoro.ts` - Pomodoro timer logic and utilities
- `src/utils/timer-modes.ts` - Countdown/count-up timer calculations
- `src/utils/scheduling.ts` - Task scheduling and capacity planning
- `src/utils/analytics.ts` - Reports and productivity metrics calculation

**Backend API:**

- `src/server/index.ts` - Main Hono app with route mounting
- `src/server/routes/tasks.ts` - Task CRUD and focus session endpoints
- `src/server/routes/stats.ts` - Analytics and AI recommendations
- `src/server/middleware/access.ts` - Authentication middleware

**Frontend Components:**

- `src/client/pages/Dashboard.tsx` - Main task list with inline editing
- `src/client/components/FocusModeModal.tsx` - Full-screen focus mode
- `src/client/components/CompactFocusMode.tsx` - Sticky header focus mode
- `src/client/components/DurationSelectorModal.tsx` - Timer duration picker
- `src/client/pages/Reports.tsx` - Analytics dashboard

## Focus Mode & Timer System

### Timer Modes

1. **Count-up** (default): Traditional stopwatch, tracks elapsed time
2. **Countdown**: User sets target duration, displays remaining time while tracking actual elapsed time in background

### Focus Mode Views

1. **Full Mode**: Immersive full-screen with quote and large timer
2. **Compact Mode**: Single-line sticky header at top of screen
3. **Minimized Mode**: Ultra-compact showing only timer and expand button

Users can toggle between modes while session is running. Preference is saved to localStorage.

### Duration Selector Flow

When starting a focus session:

1. `DurationSelectorModal` appears first
2. Quick buttons: [15m] [25m] [30m] [45m] [60m]
3. Smart suggestion from `task.estimatedTime`
4. Custom input supports "25" (minutes) or "1:30" (minutes:seconds)
5. "Skip Timer" option uses count-up mode
6. Selection triggers `startFocusSession(taskId)` then opens focus mode

### Pomodoro Integration

Optional Pomodoro timer with:

- Configurable work/break durations via `PomodoroSettingsComponent`
- Auto-transitions between work → short break → long break
- Visual progress bar and color-coded modes
- Settings stored in localStorage (`pomodoro-settings` key)

## AI Recommendation Algorithms

**File:** `src/utils/algorithms.ts` - `getDecisionRecommendation(task, method)`

All 8 methods return a `{ decision: 'do' | 'delegate' | 'delay' | 'delete', reason: string }`:

1. **simple**: Basic ICE threshold checking
2. **weighted**: Impact (50%) + Confidence (30%) + Ease (20%)
3. **roi**: ROI = Impact / (11 - Ease), considers time efficiency
4. **eisenhower**: Importance/Urgency matrix enhanced with time blocks
5. **skill**: Matches ease (skill) with value potential
6. **energy**: Energy ROI = (Impact × Confidence) / (Effort + Time)
7. **strategic**: Weights tasks by type (revenue: 1.5x, strategic: 1.3x, etc.)
8. **hybrid** (default): ROI (40%) + Value (30%) + Strategic (30%)

The selected method is stored in user preferences and applied across dashboard and stats pages.

## ICE Scoring System

Tasks use a weighted ICE formula configurable via `ICEWeightsSettings` component:

- Default: Impact 50%, Confidence 30%, Ease 20%
- Users can adjust weights (must total 100%)
- Displayed as `calculateWeightedICE(task, weights)` in dashboard
- Stored in `task.iceWeights` in user preferences

## Time Tracking Implementation

### Focus Session Lifecycle

1. **Start**: `startFocusSession(taskId)` sets `isInFocus: true`, records `focusStartedAt`
2. **Pause/Resume**: Tracks `pausedTime` to exclude from elapsed calculation
3. **Complete**: Calls `endFocusSession(taskId, durationMinutes)` which:
   - Sets `isInFocus: false`
   - Clears `focusStartedAt`
   - Adds duration to `task.actualTime`

### Auto-Stop Behavior

**Critical:** Starting a new focus session automatically stops all other active sessions by calculating their elapsed time and calling `endFocusSession()` before starting the new one. This is implemented in both `LocalStorageTaskStorage` (lines 178-200) and API route `/api/tasks/:id/focus/start` (lines 263-331).

### Time Tracking State

- `startTime`: When timer started (fixed)
- `elapsedTime`: `(now - startTime) / 1000 - pausedTime` (seconds)
- `pausedTime`: Total accumulated pause duration (seconds)
- `pauseStartTime`: Timestamp when pause button was pressed

Countdown mode displays `calculateRemaining(startTime, targetDuration, pausedTime)` while always tracking `elapsedTime` in background.

## Database Schema

**Users Table:**

- Auto-created from Cloudflare Access headers on first login
- Email is primary identifier (unique)

**Tasks Table:**

- Includes ICE scores (impact, confidence, ease: 1-10)
- Categorization: type, timeBlock, decision
- Time tracking: actualTime, isInFocus, focusStartedAt
- Scheduling: scheduledFor, recurringPattern, lastCompletedDate, streakCount
- Status: active, completed, archived

**UserPreferences Table:**

- Stores preferredMethod (AI algorithm selection)
- iceWeights (custom ICE scoring weights)

## Authentication Flow

**Production:** Cloudflare Zero Trust (Access)

1. Worker validates `ACCESS_AUD` environment variable
2. Middleware reads `CF-Access-Authenticated-User-Email` header
3. User auto-created in DB if doesn't exist
4. User ID attached to context for all subsequent queries

**Development:** Mock headers

- Email: `dev@example.com`
- Name: `Dev User`
- Set automatically when `NODE_ENV === 'development'`

**Demo Mode:** No authentication

- Uses static demo user: `demo@taskpriority.app`
- All data in localStorage

## Local Development Database

The `npm run dev` command automatically runs `setup-local` which:

1. Deletes existing `dev.db` if present
2. Creates fresh database
3. Applies all migrations from `src/db/migrations/`
4. Inserts sample data via `scripts/setup-local-db.js`

**Manual Migration:**

```bash
# Generate migration after schema changes in src/db/schema.ts
npm run db:generate

# Apply to local DB
npm run db:migrate

# Apply to production
npm run db:migrate:prod
```

**IMPORTANT: Production Migration Issues**
The `db:migrate:prod` command sometimes fails if:

1. Some columns from a migration already exist (it tries to apply ALL pending migrations)
2. The migration file creates tables or indexes that already exist

**Solution:** Apply migrations manually using wrangler:

```bash
# Check production schema first
npx wrangler d1 execute task-priority-db --remote --command="SELECT sql FROM sqlite_master WHERE type='table' AND name='tasks';"

# Apply missing columns one by one
npx wrangler d1 execute task-priority-db --remote --command="ALTER TABLE tasks ADD COLUMN column_name TYPE;"

# Create indexes with IF NOT EXISTS
npx wrangler d1 execute task-priority-db --remote --command="CREATE INDEX IF NOT EXISTS idx_name ON table(column);"
```

**After Schema Changes:** Always verify production database matches local schema before deploying code changes!

## Common Development Patterns

### Adding a New Task Field

1. Update `src/utils/types.ts` - Add to `Task` interface
2. Update `src/db/schema.ts` - Add column to `tasks` table
3. Run `npm run db:generate` - Creates migration file
4. Run `npm run db:migrate` - Applies to local DB
5. Update `src/utils/validation.ts` - Add Zod validation (**see Validation Best Practices below**)
6. Update `src/lib/storage.ts` - Handle in localStorage if needed
7. Update UI components as needed
8. If the field is a date field, add type conversion in `src/server/routes/tasks.ts` (see lines 161-168)

**Validation Best Practices:**
When adding optional or nullable fields that can receive empty strings from form inputs:

- For **optional string enums**: Use `.or(z.literal('')).optional().transform(val => val === '' ? undefined : val)`
- For **nullable string enums**: Use `.or(z.literal('')).nullable().optional().transform(val => val === '' ? null : val)`
- This prevents validation errors when users clear dropdown fields

**Example from scheduledFor and recurringPattern fields:**

```typescript
// Good - handles empty string from cleared dropdown
scheduledFor: z.enum(['today', 'this-week', 'this-month', 'someday'])
  .or(z.literal('')).optional()
  .transform(val => val === '' ? undefined : val),

recurringPattern: z.enum(['daily', 'weekly', 'monthly'])
  .or(z.literal('')).nullable().optional()
  .transform(val => val === '' ? null : val),

// Bad - throws error when empty string is sent
scheduledFor: z.enum(['today', 'this-week', 'this-month', 'someday']).optional(),
recurringPattern: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
```

### Modifying Focus Mode Behavior

All focus mode logic is in:

- `src/client/components/FocusModeModal.tsx` - Main component
- `src/client/components/CompactFocusMode.tsx` - Compact view
- Timer calculations in `src/utils/timer-modes.ts`

State management is local to `FocusModeModal` using React hooks.

### Adding a New AI Algorithm

1. Add method to `getDecisionRecommendation()` in `src/utils/algorithms.ts`
2. Add option to method selector in `src/client/pages/Dashboard.tsx`
3. Algorithm receives full `Task` object, returns `{ decision, reason }`

### Debugging Demo vs Production Mode

Check `APP_CONFIG.IS_DEMO` in `src/utils/config.ts`:

- Returns `true` if `VITE_DEMO_MODE=true` OR hostname includes `task-priority-demo`
- Determines storage backend and authentication flow
- Logged to console on app startup

## Important Implementation Details

### Debounced Task Updates

Dashboard uses debounced updates with 500ms delay for inline editing:

- `debounceTimeouts` ref tracks timers per field
- `localTaskValues` state for immediate UI feedback
- Actual API/storage call happens after user stops typing

### Recurring Tasks

- Store `recurringPattern` (daily/weekly/monthly) and `lastCompletedDate`
- Track `streakCount` for consecutive completions
- `completeRecurringTask()` updates last completed date and streak
- Scheduling views filter by completion date to show only due tasks

### Task Completion with Time Tracking

When completing a task that's currently in focus:

1. Calculate elapsed time from `focusStartedAt`
2. Call `endFocusSession()` to save time
3. Then call `completeTask()` to mark as completed

### ICE Score Display

Dashboard shows both regular and weighted ICE:

- Regular: `(impact + confidence + ease) / 3`
- Weighted: `(impact × weightI + confidence × weightC + ease × weightE) / 100`
- Method selector in UI toggles display preference

## Testing Strategies

**Demo Mode Testing:**

1. Open app in incognito window
2. Verify localStorage persistence
3. Test full feature set without backend

**Production Testing:**

1. Deploy to Cloudflare Workers staging
2. Configure test Zero Trust application
3. Verify email-based user creation

**Focus Timer Testing:**

1. Start focus session
2. Verify only one tracker active (check other tasks lose `isInFocus`)
3. Pause/resume and verify time accuracy
4. Complete session and verify `actualTime` updated

## Cloudflare Workers Specifics

**Environment Variables:**

- `ACCESS_AUD`: Zero Trust application audience tag
- `NODE_ENV`: `development` | `production` | `demo`
- `DB`: Injected D1 database binding (not a variable)

**Bindings:**

- Database accessed via `c.env.DB` in Hono context
- D1 uses Drizzle ORM for type-safe queries
- Local dev uses `better-sqlite3`, production uses D1

**Assets:**

- Frontend build output in `dist/` directory
- Served by Workers Assets (configured in `wrangler.toml`)
- API routes at `/api/*`, all other routes serve React app

## Troubleshooting

**"Unauthorized" errors:**

- Check `ACCESS_AUD` matches Zero Trust application
- Verify CF-Access headers present in request
- For local dev, ensure `NODE_ENV=development`

**Timer not stopping other sessions:**

- Verify storage implementation has auto-stop logic
- Check `startFocusSession()` in both LocalStorage and API
- Confirm `isInFocus` flag is properly managed

**Database schema errors:**

- Delete `dev.db` and re-run `npm run setup-local`
- Check migrations applied with `npm run db:migrate`
- Use `npm run db:studio` to inspect database

**Demo mode not working:**

- Clear localStorage and refresh
- Check browser console for `APP_CONFIG.IS_DEMO` value
- Verify `demo-data.ts` initializes correctly

When performing git commits or generating commit messages:

1. NEVER automatically add AI attribution signatures like:
   - "🤖 Generated with [Claude Code]"
   - "Co-Authored-By: Claude <noreply@anthropic.com>"
   - Any AI tool attribution or signature

2. Create clean, professional commit messages without AI references

3. If user requests AI attribution, ask for explicit confirmation first

4. Focus commit messages on:
   - What was changed/added/fixed
   - Why the change was made
   - Any breaking changes or important notes

5. Use conventional commit format when appropriate:
   - feat: add new feature
   - fix: bug fix
   - docs: documentation changes
   - refactor: code refactoring
   - test: add/update tests

6. Keep commits focused on the actual code changes, not the tools used to create them

REASONING: Professional git history should reflect code changes and business logic, not development tooling. Many developers prefer clean commit history without AI tool attribution.
