# AI-Powered Work Analysis Integration Plan

## Overview
Integrate Cloudflare Workers AI to analyze time logs, task notes, and work patterns across both short-term (daily) and long-term (multi-year) periods to provide intelligent insights about productivity, work habits, and career trajectory.

---

## Phase 1: Infrastructure Setup

### 1.1 Add Workers AI Binding
**File:** `wrangler.toml`
```toml
# Add after [assets] section
[ai]
binding = "AI"
```

### 1.2 Update TypeScript Types
**File:** `src/server/lib/db.ts`
```typescript
export interface Env {
  DB: D1Database;
  AI: any; // Cloudflare AI binding
  ACCESS_AUD?: string;
  NODE_ENV?: string;
}
```

### 1.3 Create AI Service Layer
**New file:** `src/server/services/ai-insights.ts`

Core responsibilities:
- Centralized AI interaction logic
- Model selection utilities (Llama 3.1, QwQ, Gemma 3)
- Prompt engineering helpers
- Response parsing and validation
- Error handling and fallbacks

```typescript
export class AIInsightsService {
  constructor(private ai: any) {}

  async generateInsight(prompt: string, model?: string): Promise<string>
  async generateEmbedding(text: string): Promise<number[]>
  async batchAnalysis(prompts: string[]): Promise<string[]>
}
```

---

## Phase 2: Database Schema Extensions

### 2.1 Work Aggregates Table
**Purpose:** Store pre-computed monthly/quarterly/yearly summaries for efficient long-term analysis

**Migration:** `src/db/migrations/XXXX_create_work_aggregates.sql`
```sql
CREATE TABLE work_aggregates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Period definition
  period_type TEXT NOT NULL, -- 'week' | 'month' | 'quarter' | 'year'
  period_start INTEGER NOT NULL, -- timestamp
  period_end INTEGER NOT NULL,   -- timestamp

  -- Aggregated metrics (JSON)
  task_stats TEXT NOT NULL,        -- {completed, totalTime, byType, byDecision, avgICE}
  time_distribution TEXT NOT NULL, -- {deep, collaborative, quick, systematic}
  productivity_metrics TEXT NOT NULL, -- {completionRate, estimateAccuracy, focusRatio}
  behavior_patterns TEXT NOT NULL,    -- {peakHours, streaks, interruptions}
  notes_summary TEXT,              -- {count, avgMood, topTopics, sentimentScore}

  -- Metadata
  generated_at INTEGER NOT NULL,
  data_quality_score REAL, -- 0-1, based on data completeness

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_work_aggregates_user_period ON work_aggregates(user_id, period_type, period_start);
```

### 2.2 Note Embeddings Table
**Purpose:** Enable semantic search across years of notes

**Migration:** `src/db/migrations/XXXX_create_note_embeddings.sql`
```sql
CREATE TABLE note_embeddings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Embedding vector (stored as JSON array for SQLite compatibility)
  embedding TEXT NOT NULL, -- JSON array of 1024 floats from bge-large-en-v1.5

  -- Metadata
  model_version TEXT NOT NULL DEFAULT 'bge-large-en-v1.5',
  generated_at INTEGER NOT NULL,

  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_note_embeddings_note ON note_embeddings(note_id);
CREATE INDEX idx_note_embeddings_user ON note_embeddings(user_id);
```

### 2.3 AI Insights History Table
**Purpose:** Cache generated insights to avoid re-running expensive AI calls

**Migration:** `src/db/migrations/XXXX_create_ai_insights.sql`
```sql
CREATE TABLE ai_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Insight metadata
  insight_type TEXT NOT NULL, -- 'daily-summary' | 'weekly-analysis' | 'long-term' | 'note-analysis' | 'prediction'
  analysis_period_start INTEGER NOT NULL,
  analysis_period_end INTEGER NOT NULL,

  -- Content
  content TEXT NOT NULL, -- AI-generated insight (JSON)
  prompt_used TEXT,      -- The prompt that generated this (for debugging)
  model_used TEXT NOT NULL,

  -- Context references
  task_ids TEXT,  -- JSON array of task IDs used in analysis
  note_ids TEXT,  -- JSON array of note IDs used

  -- Caching
  cache_expires_at INTEGER,
  cache_invalidated INTEGER DEFAULT 0, -- boolean

  -- Metrics
  generation_time_ms INTEGER,
  tokens_used INTEGER,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_ai_insights_user_type ON ai_insights(user_id, insight_type, analysis_period_start);
CREATE INDEX idx_ai_insights_cache ON ai_insights(cache_expires_at, cache_invalidated);
```

### 2.4 User AI Preferences Table
**Purpose:** Store user preferences for AI features

**Migration:** `src/db/migrations/XXXX_create_user_ai_preferences.sql`
```sql
CREATE TABLE user_ai_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Feature toggles
  ai_insights_enabled INTEGER DEFAULT 1, -- boolean
  daily_insights_enabled INTEGER DEFAULT 1,
  weekly_insights_enabled INTEGER DEFAULT 1,
  long_term_insights_enabled INTEGER DEFAULT 1,
  note_ai_enabled INTEGER DEFAULT 1,

  -- Model preferences
  preferred_model TEXT DEFAULT '@cf/meta/llama-3.1-8b-instruct',

  -- Privacy settings
  data_retention_days INTEGER DEFAULT 365, -- how long to keep AI insights
  share_aggregates INTEGER DEFAULT 0, -- future: opt-in to anonymized benchmarking

  -- Notification preferences
  daily_summary_time TEXT, -- e.g., "18:00" for 6pm daily summary
  weekly_summary_day TEXT, -- e.g., "friday"

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### 2.5 Update Schema Types
**File:** `src/db/schema.ts`
- Add new table definitions using Drizzle ORM
- Export TypeScript types for each table

---

## Phase 3: Data Aggregation System

### 3.1 Aggregate Computation Service
**New file:** `src/server/services/work-aggregator.ts`

```typescript
export class WorkAggregator {
  async computeMonthlyAggregate(userId: number, month: Date): Promise<WorkAggregate>
  async computeQuarterlyAggregate(userId: number, quarter: Date): Promise<WorkAggregate>
  async computeYearlyAggregate(userId: number, year: Date): Promise<WorkAggregate>

  // Ensure all periods have aggregates
  async ensureAggregatesUpToDate(userId: number): Promise<void>

  // Helper: compress monthly aggregate to ~500 tokens for AI consumption
  async summarizeAggregateForAI(aggregate: WorkAggregate): Promise<string>
}
```

**Aggregate computation logic:**
1. Fetch all tasks/time entries/notes for period
2. Calculate metrics (completion rate, time distribution, ICE averages, etc.)
3. Identify patterns (peak hours, streaks, dominant task types)
4. Summarize notes (count, mood distribution, extract themes)
5. Store in `work_aggregates` table

### 3.2 Background Job for Aggregate Generation
**New file:** `src/server/jobs/generate-aggregates.ts`

Options for running:
- **Cron Trigger** (if available in Cloudflare Workers)
- **On-demand API endpoint** (user triggers or runs monthly)
- **Incremental on insert** (update current period on task completion)

---

## Phase 4: AI Analysis Endpoints

### 4.1 Daily Insights
**New route:** `POST /api/insights/daily-summary`

**Request:**
```json
{
  "date": "2025-10-02" // optional, defaults to today
}
```

**Process:**
1. Fetch today's tasks, time entries, notes
2. Calculate basic metrics (completion count, time spent, etc.)
3. Build AI prompt with structured data
4. Call AI model with prompt
5. Parse and structure response
6. Store in `ai_insights` table (cache for 24h)
7. Return insight to user

**AI Prompt Template:**
```
Analyze this user's workday on [DATE]:

TASKS COMPLETED (X tasks):
- [Task name] (Type: revenue, ICE: 8.3, Time: 45min, Decision: do)
- [Task name] (Type: operations, ICE: 6.1, Time: 30min, Decision: do)
...

NOTES WRITTEN:
- "[Note title]" (Category: daily-log, Mood: good, Energy: high)
  Content preview: "..."

TIME DISTRIBUTION:
- Deep work: 120 min (40%)
- Collaborative: 90 min (30%)
- Quick wins: 60 min (20%)
- Systematic: 30 min (10%)

FOCUS QUALITY:
- Focus sessions: 3
- Average session: 35 min
- Interruptions: 1 (sessions <10min)

PRODUCTIVITY METRICS:
- Completion rate: 85% (17/20 planned)
- Estimate accuracy: -15% (tasks took 15% less time)
- ICE average: 7.2

Provide a daily summary with:
1. TOP 3 WINS: Specific accomplishments worth celebrating
2. ENERGY PATTERN: When were they most productive today? (specific hours)
3. IMPROVEMENT OPPORTUNITY: One concrete suggestion for tomorrow
4. EMOTIONAL TONE: Based on notes and task patterns, how did they feel today?
5. TOMORROW'S FOCUS: Top 2 tasks to prioritize based on ICE and patterns

Format as JSON:
{
  "wins": ["...", "...", "..."],
  "energyPattern": "Peak productivity 9-11am during deep work sessions",
  "improvement": "...",
  "emotionalTone": "Positive and focused, with high energy",
  "tomorrowFocus": ["Task X", "Task Y"]
}
```

### 4.2 Weekly Analysis
**New route:** `POST /api/insights/weekly-analysis`

**Request:**
```json
{
  "weekStart": "2025-09-28" // Monday of the week to analyze
}
```

**Process:**
1. Fetch week's tasks, time entries, notes
2. Calculate weekly trends
3. Compare to previous week
4. Identify patterns (best/worst days, recurring blockers)
5. Generate AI analysis
6. Cache for 7 days

### 4.3 Long-Term Analysis (Multi-Year)
**New route:** `POST /api/insights/long-term-analysis`

**Request:**
```json
{
  "dateRange": {
    "start": "2022-01-01",
    "end": "2025-01-01"
  },
  "analysisType": "career-trajectory", // or "seasonal-patterns", "goal-achievement"
  "focusAreas": ["deep-work", "revenue-tasks"], // optional filters
  "compareWith": { // optional baseline period
    "start": "2019-01-01",
    "end": "2022-01-01"
  }
}
```

**Process:**
1. Fetch monthly aggregates for period (e.g., 36 months)
2. Compute yearly summaries
3. Apply progressive summarization if needed (aggregate → quarterly → yearly)
4. Build condensed timeline for AI (~500 tokens per year)
5. Call AI model with multi-year prompt
6. Return structured insights

**AI Prompt Template (3-year analysis):**
```
Analyze this professional's 3-year work pattern (2022-2025):

=== 2022 SUMMARY ===
Tasks: 520 completed (65% completion rate)
Time invested: 12,480 minutes total
Distribution: Operations (45%), Revenue (30%), Strategic (15%), Growth (5%), Personal (5%)
Peak periods: Q2 (productivity: 8.5/10), Q4 (productivity: 7.8/10)
Average ICE score: 6.8
Deep work ratio: 35%
Focus quality: 28 min avg session
Notes themes: "Learning new systems", "Process documentation", "Client support"
Mood distribution: Good (50%), Neutral (30%), Tired (15%), Great (5%)

=== 2023 SUMMARY ===
Tasks: 612 completed (72% completion rate)
Time invested: 14,220 minutes total
Distribution: Revenue (40%), Strategic (25%), Operations (20%), Growth (10%), Personal (5%)
Peak periods: Q1 (productivity: 8.8/10), Q3 (productivity: 8.2/10)
Average ICE score: 7.4
Deep work ratio: 48%
Focus quality: 38 min avg session
Notes themes: "Team building", "Revenue optimization", "Strategic planning"
Mood distribution: Good (60%), Great (20%), Neutral (15%), Tired (5%)

=== 2024 SUMMARY ===
Tasks: 680 completed (78% completion rate)
Time invested: 15,360 minutes total
Distribution: Strategic (42%), Revenue (35%), Growth (15%), Operations (5%), Personal (3%)
Peak periods: Q2 (productivity: 9.2/10), Q3 (productivity: 9.0/10), Q4 (productivity: 8.8/10)
Average ICE score: 7.9
Deep work ratio: 58%
Focus quality: 45 min avg session
Notes themes: "Leadership", "Innovation projects", "Long-term vision"
Mood distribution: Great (45%), Good (40%), Neutral (10%), High energy (5%)

Provide comprehensive career analysis:

1. CAREER EVOLUTION NARRATIVE (300 words):
   - Describe the professional's journey from 2022 to 2024
   - Highlight key transitions and growth milestones

2. TOP 5 GROWTH INDICATORS:
   - Concrete evidence from data showing development
   - Quantify improvements where possible

3. PRODUCTIVITY TRAJECTORY:
   - Is productivity improving, stable, or declining?
   - Which metrics support this assessment?

4. WORK-LIFE BALANCE ASSESSMENT:
   - Time distribution health
   - Burnout risk indicators
   - Sustainable pace analysis

5. SKILL DEVELOPMENT:
   - Which competencies are being built (based on task types)?
   - Mastery indicators (faster completion, higher complexity)

6. STRATEGIC ALIGNMENT:
   - Is time allocation aligned with high-impact work?
   - Shift from tactical to strategic over time?

7. RECOMMENDATIONS FOR NEXT 12 MONTHS:
   - 3 specific, actionable suggestions
   - Based on trajectory and patterns

Format as JSON.
```

### 4.4 Note Intelligence
**New route:** `POST /api/insights/analyze-note`

**Request:**
```json
{
  "noteId": 123,
  "analysisType": "extract-actions" // or "suggest-tags", "detect-mood", "find-related"
}
```

**Process:**
1. Fetch note content
2. Generate embedding (for semantic search)
3. Store embedding in `note_embeddings`
4. Call AI for specific analysis type
5. Return structured results

**Use cases:**
- Extract action items from meeting notes
- Auto-suggest tags based on content
- Detect mood/energy without manual input
- Find related notes via semantic similarity

### 4.5 Task Prediction
**New route:** `POST /api/insights/predict-task-duration`

**Request:**
```json
{
  "taskId": 456,
  "context": {
    "scheduledFor": "tomorrow",
    "timeOfDay": "morning"
  }
}
```

**Process:**
1. Fetch task details (ICE scores, type, timeBlock, estimate)
2. Fetch user's historical data for similar tasks
3. Calculate personal accuracy factor
4. Call AI to predict actual duration
5. Return prediction with confidence interval

### 4.6 Natural Language Queries
**New route:** `POST /api/insights/ask`

**Request:**
```json
{
  "question": "What were my most productive days last month?"
}
```

**Process:**
1. Parse question to determine:
   - Time period (last month)
   - Metric (productive days)
   - Filters/constraints
2. Fetch relevant data
3. Build context-aware prompt
4. Call AI with question + data
5. Return natural language answer

**Example questions:**
- "How much time did I spend on revenue tasks vs operations this quarter?"
- "Why did I complete fewer tasks this week compared to last week?"
- "What patterns do you see in my deep work habits?"
- "When am I most likely to procrastinate?"

---

## Phase 5: Long-Term Optimization Strategies

### 5.1 Hierarchical Aggregation for Context Limits

**Challenge:** 3 years of data = too much for context window

**Solution: Progressive Summarization**
```
Level 0: Raw data (tasks, time entries, notes)
   ↓
Level 1: Daily aggregates (365 days/year × 3 years = 1,095 summaries)
   ↓
Level 2: Weekly aggregates (52 weeks/year × 3 years = 156 summaries)
   ↓
Level 3: Monthly aggregates (12 months/year × 3 years = 36 summaries)
   ↓
Level 4: Quarterly aggregates (4 quarters/year × 3 years = 12 summaries)
   ↓
Level 5: Yearly aggregates (3 summaries)
   ↓
AI Analysis: Feed Level 5 (3 summaries) or Level 4 (12 summaries) to AI
```

**Token budget:**
- Yearly summary: ~1,200 tokens each
- 3 years = ~3,600 tokens of input
- Leaves ~124,400 tokens for AI reasoning (in 128K context model)

### 5.2 Semantic Search via Embeddings

**For analyzing notes across years:**

**Step 1: Generate embeddings for all notes**
```typescript
// Run once for historical notes, then on each new note
async function generateNoteEmbedding(noteId: number) {
  const note = await fetchNote(noteId);
  const text = `${note.title}\n\n${note.content}`;

  const embedding = await env.AI.run('@cf/baai/bge-large-en-v1.5', {
    text: [text]
  });

  await storeEmbedding(noteId, embedding.data[0]);
}
```

**Step 2: Semantic search**
```typescript
async function findRelatedNotes(query: string, limit: number = 20) {
  // Convert query to embedding
  const queryEmbedding = await env.AI.run('@cf/baai/bge-large-en-v1.5', {
    text: [query]
  });

  // Fetch all embeddings (or use vector database if available)
  const allEmbeddings = await fetchAllNoteEmbeddings();

  // Calculate cosine similarity
  const similarities = allEmbeddings.map(e => ({
    noteId: e.noteId,
    similarity: cosineSimilarity(queryEmbedding.data[0], e.embedding)
  }));

  // Return top N most similar
  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}
```

**Step 3: Send only relevant notes to AI**
```typescript
// User asks: "What were my main challenges in 2023?"
const relevantNotes = await findRelatedNotes("challenges problems issues blockers 2023", 20);
// Only send these 20 notes to AI instead of all 500+ notes from that year
```

### 5.3 Intelligent Drill-Down

**Two-pass approach:**

**Pass 1: High-level analysis (cheap)**
- Feed quarterly/yearly aggregates to AI
- AI identifies interesting patterns (e.g., "Productivity dropped in Q2 2024")

**Pass 2: Targeted deep-dive (only when needed)**
- Fetch detailed task/time entry data ONLY for Q2 2024
- AI analyzes task-level data to find root cause
- Return specific insights

### 5.4 Caching Strategy

**Cache at multiple levels:**

1. **Aggregate cache** (work_aggregates table)
   - Monthly aggregates: recompute only current month
   - Historical months: never recompute (immutable)

2. **Insight cache** (ai_insights table)
   - Daily insights: cache for 24 hours
   - Weekly insights: cache for 7 days
   - Long-term insights: cache for 30 days
   - Invalidate on: manual refresh request

3. **Embedding cache** (note_embeddings table)
   - Generate once per note
   - Regenerate only if note content changes
   - Model version tracking for upgrades

### 5.5 Model Selection Strategy

**Choose model based on task complexity:**

| Task | Model | Reasoning |
|------|-------|-----------|
| Daily summary | `@cf/meta/llama-3.1-8b-instruct` | Fast, balanced, good for routine analysis |
| Weekly analysis | `@cf/meta/llama-3.1-8b-instruct` | Same as daily |
| Long-term (3yr) | `@cf/qwen/qwq-32b-preview` | Deep reasoning for complex patterns |
| Note analysis | `@cf/meta/llama-3.1-8b-instruct` | Fast, efficient for text understanding |
| Embeddings | `@cf/baai/bge-large-en-v1.5` | Specialized for semantic similarity |
| Predictions | `@cf/qwen/qwq-32b-preview` | Reasoning required for predictions |

**Cost optimization:**
- Use smaller models (8B) for routine tasks
- Use larger models (32B) only for complex reasoning
- Batch similar requests when possible

---

## Phase 6: UI/UX Enhancements

### 6.1 AI Insights Dashboard
**New page:** `src/client/pages/AIInsights.tsx`

**Layout:**
```
┌─────────────────────────────────────────┐
│  AI Insights                            │
├─────────────────────────────────────────┤
│                                         │
│  [Today] [This Week] [Long-term]        │  ← Tabs
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Daily Summary - Oct 2, 2025     │   │
│  ├─────────────────────────────────┤   │
│  │ 🎯 Top Wins:                     │   │
│  │ • Completed strategic planning   │   │
│  │ • 2 hours of deep work on X     │   │
│  │                                 │   │
│  │ ⚡ Energy Pattern:               │   │
│  │ Peak productivity 9-11am        │   │
│  │                                 │   │
│  │ 💡 Tomorrow's Focus:             │   │
│  │ • Task A (ICE: 8.5)             │   │
│  │ • Task B (ICE: 7.8)             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Ask AI about your work          │   │
│  │ ┌─────────────────────────────┐ │   │
│  │ │ What were my most productive │ │   │
│  │ │ days last month?             │ │   │
│  │ └─────────────────────────────┘ │   │
│  │              [Ask] →             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Recent Insights:                      │
│  • Weekly Analysis (Sep 28 - Oct 4)   │
│  • Career Trajectory (2022-2024)      │
│  • Note Analysis: Meeting 10/1        │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- `DailySummaryCard.tsx` - Shows daily AI insights
- `WeeklyAnalysisCard.tsx` - Weekly patterns
- `LongTermInsightsCard.tsx` - Career trajectory
- `AIChatInterface.tsx` - Natural language queries
- `InsightHistory.tsx` - List of past insights

### 6.2 Enhanced Reports Page
**File:** `src/client/pages/Reports.tsx`

**Add new tab:** "AI Analysis"

**Additions:**
- Contextual AI insights alongside charts
- "Explain this pattern" button on visualizations
- AI-generated recommendations section

### 6.3 Smart Note Features
**File:** `src/client/pages/Notes.tsx`

**Add AI features:**
- "Suggest tags" button (calls `/api/insights/analyze-note`)
- "Extract action items" button
- "Find related notes" (semantic search)
- Auto-populate mood from note tone

### 6.4 Task Prediction UI
**File:** `src/client/components/TaskForm.tsx`

**Enhancement:**
When user enters estimated time, show:
```
Estimated: 60 min
AI Prediction: 45 min (based on your history with similar tasks)
Confidence: 85%
```

### 6.5 Notification System
**New component:** `src/client/components/AINotifications.tsx`

**Trigger notifications:**
- End-of-day insight ready (6pm daily)
- Weekly review available (Friday evening)
- Unusual pattern detected ("You've worked 10+ hours for 5 days straight")
- Achievement unlocked ("30-day streak on deep work!")

---

## Phase 7: Implementation Roadmap

### Week 1-2: Foundation
- [ ] Add AI binding to wrangler.toml
- [ ] Create database migrations (work_aggregates, note_embeddings, ai_insights, user_ai_preferences)
- [ ] Run migrations on local and production
- [ ] Create `AIInsightsService` class
- [ ] Create `WorkAggregator` service
- [ ] Write unit tests for aggregation logic

### Week 3-4: Daily & Weekly Insights
- [ ] Implement `/api/insights/daily-summary` endpoint
- [ ] Implement `/api/insights/weekly-analysis` endpoint
- [ ] Create daily summary UI component
- [ ] Create weekly analysis UI component
- [ ] Build AI Insights page skeleton
- [ ] Add caching logic for insights
- [ ] Test with real data

### Week 5-6: Long-Term Analysis
- [ ] Implement aggregate computation job
- [ ] Generate historical aggregates for existing users
- [ ] Implement `/api/insights/long-term-analysis` endpoint
- [ ] Create long-term insights UI
- [ ] Add date range selector for multi-year analysis
- [ ] Test with 1-3 years of data

### Week 7-8: Note Intelligence
- [ ] Implement embedding generation for notes
- [ ] Backfill embeddings for existing notes
- [ ] Implement `/api/insights/analyze-note` endpoint
- [ ] Add semantic search functionality
- [ ] Enhance Notes page with AI features
- [ ] Add "suggest tags" and "extract actions" buttons

### Week 9-10: Predictions & Queries
- [ ] Implement `/api/insights/predict-task-duration` endpoint
- [ ] Add prediction display to task form
- [ ] Implement `/api/insights/ask` endpoint
- [ ] Create AI chat interface component
- [ ] Add question history tracking
- [ ] Test with various question types

### Week 11-12: Polish & Optimization
- [ ] Optimize prompt engineering for better results
- [ ] Add error handling and fallbacks
- [ ] Implement rate limiting (if needed)
- [ ] Add user preferences for AI features
- [ ] Create onboarding flow for AI features
- [ ] Write documentation
- [ ] Performance testing with large datasets
- [ ] Deploy to production

---

## Technical Specifications

### Model Recommendations

| Use Case | Recommended Model | Context Window | Parameters | Speed |
|----------|------------------|----------------|------------|-------|
| Daily Summary | `@cf/meta/llama-3.1-8b-instruct` | 128K | 8B | Fast |
| Weekly Analysis | `@cf/meta/llama-3.1-8b-instruct` | 128K | 8B | Fast |
| Long-term (3yr) | `@cf/qwen/qwq-32b-preview` | 32K | 32B | Moderate |
| Note Analysis | `@cf/meta/llama-3.1-8b-instruct` | 128K | 8B | Fast |
| Embeddings | `@cf/baai/bge-large-en-v1.5` | N/A | 340M | Fast |
| Deep Reasoning | `@cf/qwen/qwq-32b-preview` | 32K | 32B | Moderate |

### API Structure

```
POST /api/insights/daily-summary
POST /api/insights/weekly-analysis
POST /api/insights/long-term-analysis
POST /api/insights/analyze-note
POST /api/insights/predict-task-duration
POST /api/insights/ask

GET  /api/insights/history
DELETE /api/insights/:id

POST /api/insights/generate-aggregates  (admin/cron)
GET  /api/insights/user-preferences
PUT  /api/insights/user-preferences
```

### Privacy & Security

**Data Handling:**
- All AI analysis happens server-side (not client-side)
- No data sent to external APIs (Cloudflare Workers AI is on-edge)
- User controls data retention (default: 365 days for insights)
- Option to delete all AI insights
- Opt-in for each AI feature

**Transparency:**
- Show which data feeds each insight
- Display prompts used (in debug mode)
- Track tokens used per request
- Allow users to export their AI insights

**Compliance:**
- GDPR-ready: right to deletion, data portability
- No PII sent to AI models (only task/note content)
- Anonymized aggregate data only (if benchmarking feature added)

### Performance Targets

| Operation | Target Latency | Notes |
|-----------|---------------|-------|
| Daily summary | <3 seconds | Cache hit: <100ms |
| Weekly analysis | <5 seconds | Cache hit: <100ms |
| Long-term (3yr) | <10 seconds | Cache hit: <100ms |
| Note embedding | <1 second | One-time per note |
| Semantic search | <2 seconds | Search + AI synthesis |
| Natural language query | <5 seconds | Depends on complexity |

### Cost Estimation

**Cloudflare Workers AI pricing (as of 2025):**
- Text generation: ~$0.01 per 1M input tokens
- Embeddings: ~$0.001 per 1M tokens

**Monthly cost per active user:**
- Daily summaries (30/month): ~30,000 tokens = $0.0003
- Weekly analyses (4/month): ~20,000 tokens = $0.0002
- Long-term analysis (1/month): ~50,000 tokens = $0.0005
- Note embeddings (assume 20/month): ~10,000 tokens = $0.00001
- **Total: ~$0.001/user/month** (negligible)

**For 1,000 active users: ~$1/month**

---

## Success Metrics

### Engagement Metrics
- % of users who enable AI insights
- Daily active users viewing AI insights
- Average insights viewed per user per week
- Natural language queries per user per month

### Quality Metrics
- User ratings of insight relevance (1-5 stars)
- % of AI recommendations acted upon
- False positive rate (irrelevant insights flagged by users)
- User feedback sentiment

### Product Metrics
- Retention rate: users with AI enabled vs disabled
- Feature adoption: which AI features are most used?
- Time saved: user-reported value of insights
- Referral rate: do AI features drive word-of-mouth?

### Technical Metrics
- Average AI response latency
- Cache hit rate (% of insights served from cache)
- Error rate (AI calls that fail)
- Token usage per user (cost tracking)

---

## Future Enhancements (Phase 8+)

### Advanced Features
1. **Team Insights** (multi-user support)
   - Compare productivity across team members
   - Identify collaboration patterns
   - Workload balancing recommendations

2. **Goal Tracking with AI**
   - Set productivity goals ("Increase deep work to 60%")
   - AI monitors progress and suggests adjustments
   - Celebrate milestones automatically

3. **Habit Formation Coach**
   - AI identifies desired habits from patterns
   - Nudges and reminders to reinforce habits
   - Streak tracking with motivational messages

4. **Benchmarking** (opt-in)
   - Compare your productivity to anonymized peer data
   - Industry-specific benchmarks
   - Percentile rankings on key metrics

5. **Voice Insights**
   - Daily summary as audio (text-to-speech)
   - Voice commands for queries
   - Podcast-style weekly reviews

6. **Predictive Scheduling**
   - AI suggests optimal task scheduling
   - Auto-reschedule based on capacity
   - Buffer time recommendations

7. **Contextual Recommendations**
   - "You're low energy - here are quick wins to build momentum"
   - "Peak hours coming up - start your hardest task now"
   - "You've been in meetings all day - schedule deep work tomorrow"

8. **Integration with External Tools**
   - Calendar analysis (meeting load vs deep work)
   - Email patterns (response time analysis)
   - GitHub/GitLab (code productivity metrics)

---

## Conclusion

This plan provides a comprehensive roadmap for integrating Cloudflare Workers AI into the task priority app, enabling both short-term daily insights and long-term career trajectory analysis. The implementation is designed to be:

- **Scalable**: Handles 3+ years of data via hierarchical aggregation
- **Cost-effective**: Uses caching and smart model selection
- **Privacy-first**: All analysis on-edge, user controls retention
- **User-friendly**: Natural language queries and contextual insights
- **Actionable**: Recommendations based on personal patterns

By following this phased approach, you can incrementally add AI capabilities while maintaining code quality and user experience.

---

**Next Steps:**
1. Review and adjust plan based on priorities
2. Set up development environment with AI binding
3. Run database migrations
4. Start with Week 1-2 foundation work
5. Iterate based on user feedback

**Questions to consider:**
- Which features are highest priority for MVP?
- Should we start with daily insights or long-term analysis?
- Do we want to enable AI features for all users or beta test first?
- What's the target timeline for production release?
