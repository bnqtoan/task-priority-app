# Task Priority Framework - Fullstack Application

A comprehensive task prioritization system combining ICE scoring, time blocking, and the 4D decision framework (DO, DELEGATE, DELAY, DELETE) with 8 AI recommendation algorithms.

## Features

- **8 AI Recommendation Methods**: Simple ICE, Weighted, ROI-based, Eisenhower Enhanced, Skill Match, Energy-Aware, Strategic Alignment, and Hybrid Smart
- **Time Blocking**: Deep Work, Collaborative, Quick Wins, and Systematic categorization
- **4D Decision Framework**: DO, DELEGATE, DELAY, DELETE
- **Real-time Stats**: Overview of tasks by decision, time block, and type
- **Cloudflare Zero Trust Auth**: Secure authentication without custom auth code
- **Global Edge Deployment**: Runs on Cloudflare Workers for fast global access

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide React
- **Backend**: Hono (lightweight web framework) on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite-based) with Drizzle ORM
- **Authentication**: Cloudflare Access (Zero Trust)
- **Deployment**: Cloudflare Workers + Pages

## Quick Start

### 1. Install Dependencies

```bash
cd task-priority-app
npm install
```

### 2. Set up Local Database

```bash
# Generate migration files
npm run db:generate

# Apply migrations to local D1 database
npm run db:migrate
```

### 3. Start Development Server

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:8787
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8787/api
- Health Check: http://localhost:8787/api/health

## Production Deployment

### 1. Set up Cloudflare Access

1. Go to **Cloudflare Dashboard** → **Zero Trust** → **Access** → **Applications**
2. Create a new **Self-hosted** application:
   - **Application name**: Task Priority App
   - **Subdomain**: task-priority (or your custom domain)
   - **Domain**: yourdomain.com
3. Configure **Identity Provider** (OTP via email or GitHub OAuth)
4. Set up **Access Policy** for your team/users
5. Copy the **AUD (Audience) tag** from application settings

### 2. Create Production Database

```bash
# Create D1 database in Cloudflare
npx wrangler d1 create task-priority-db

# Update wrangler.toml with the database_id from the output
```

### 3. Update Configuration

Edit `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "task-priority-db"
database_id = "your-database-id-here"  # From step 2

[vars]
ACCESS_AUD = "your-access-aud-tag"  # From step 1
```

### 4. Deploy

```bash
# Run migrations on production database
npm run db:migrate:prod

# Build and deploy
npm run deploy
```

### 5. Access Your App

Visit your deployed app (e.g., `https://task-priority.yourdomain.com`) and you'll be redirected to Cloudflare Access login.

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - List user tasks (with optional filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as completed

### Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

### Stats
- `GET /api/stats/overview` - Get overview statistics
- `GET /api/stats/recommendations?method=hybrid` - Get AI recommendations

## AI Recommendation Methods

1. **Simple ICE**: Basic ICE scoring with impact threshold
2. **Weighted Score**: Impact (50%) + Confidence (30%) + Ease (20%)
3. **ROI-Based**: Return on Investment with time efficiency
4. **Eisenhower Enhanced**: Important/Urgent matrix with time blocks
5. **Skill Match**: Matches skills (ease) with value potential
6. **Energy-Aware**: Optimizes for energy efficiency and burnout prevention
7. **Strategic Alignment**: Prioritizes based on task type weights
8. **Hybrid Smart**: Combines ROI (40%) + Value (30%) + Strategy (30%)

## Development

### Database Operations

```bash
# Generate new migration
npm run db:generate

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate:prod

# Open Drizzle Studio
npm run db:studio
```

### Local Development Authentication

For local development, the app uses mock Cloudflare Access headers:
- Email: `dev@example.com`
- Name: `Dev User`

In production, real Cloudflare Access headers are used for authentication.

### Environment Variables

Create `.env` for local development:

```bash
# Local D1
DATABASE_URL=file:./dev.db

# Cloudflare (for migrations)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
CLOUDFLARE_D1_TOKEN=your-api-token
```

## Architecture

```
Frontend (React)
  ↓ fetch('/api/tasks')
Cloudflare Worker (Hono)
  ↓ Validate Access JWT
  ↓ CRUD Operations (Drizzle ORM)
Cloudflare D1 (SQLite)
```

## Benefits

✅ **No custom auth code** - Cloudflare handles login, sessions, MFA
✅ **No password security liability**
✅ **Built-in DDOS protection**
✅ **Free tier available** (up to 50 users)
✅ **Enterprise-grade security**
✅ **Multiple IdP support**
✅ **Serverless, globally distributed**
✅ **Auto-scaling**

## License

MIT License