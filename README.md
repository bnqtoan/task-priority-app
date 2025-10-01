# Task Priority Framework - Fullstack Application

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bnqtoan/task-priority-app)

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

### Option 1: One-Click Deploy (Recommended)

Click the deploy button above to automatically deploy to Cloudflare Workers. You'll need to:

1. **Authenticate with Cloudflare** - Log in to your Cloudflare account
2. **Set up Zero Trust** - Follow the Zero Trust setup instructions below
3. **Configure Environment Variables** - Add your AUD tag after deployment

### Option 2: Manual Deployment

1. **Clone and Setup**

   ```bash
   git clone https://github.com/bnqtoan/task-priority-app
   cd task-priority-app
   npm install
   ```

2. **Configure Cloudflare**

   ```bash
   wrangler login
   wrangler d1 create task-priority-db
   ```

3. **Update Configuration**
   - Copy the database ID from the output
   - Update `wrangler.toml` with your account ID and database ID
   - Set up Zero Trust (see instructions below)

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Zero Trust Authentication Setup

This application uses Cloudflare Zero Trust for secure authentication. Follow these steps to configure it:

### Step 1: Access Zero Trust Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Navigate to **Zero Trust** in the left sidebar
4. If this is your first time, set up a team name (e.g., `your-company-team`)

### Step 2: Create Access Application

1. In Zero Trust dashboard, go to **Access** → **Applications**
2. Click **Add an application**
3. Choose **Self-hosted**
4. Configure the application:

   **Application Configuration:**
   - **Application name**: `Task Priority App`
   - **Session Duration**: `24 hours` (or your preference)
   - **Application domain**: `your-app-name.your-subdomain.workers.dev`

   **Authentication Policy:**
   - **Policy name**: `Task Priority Access`
   - **Action**: `Allow`
   - **Session duration**: `24 hours`

   **Access Rules (Choose one):**

   **Option A - Email-based access:**
   - **Include**: `Emails`
   - Add authorized email addresses (e.g., `your-email@example.com`)

   **Option B - Domain-based access:**
   - **Include**: `Email domains`
   - Add your organization's domain (e.g., `@yourcompany.com`)

   **Option C - Everyone with login:**
   - **Include**: `Everyone`
   - Note: This allows anyone with a valid login provider

### Step 3: Get Application AUD Tag

1. After creating the application, click on it in the Applications list
2. Copy the **Application Audience (AUD) Tag**
3. The AUD tag looks like: `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### Step 4: Configure Your Application

**For One-Click Deploy:**

1. After deployment, go to your Cloudflare Workers dashboard
2. Click on your deployed worker
3. Go to **Settings** → **Variables**
4. Edit the `ACCESS_AUD` variable and paste your AUD tag

**For Manual Deploy:**

1. Update `wrangler.toml`:
   ```toml
   [vars]
   ACCESS_AUD = "your-actual-aud-tag-here"
   ```
2. Redeploy: `npm run deploy`

### Step 5: Test Authentication

1. Visit your deployed application URL
2. You should be redirected to Cloudflare Access login
3. Log in with an authorized account
4. You'll be redirected back to your application with full access

### Troubleshooting Zero Trust

**"Unauthorized" Error:**

- Verify the AUD tag is correctly set in your environment variables
- Check that your email/domain is included in the Access policy
- Ensure the application domain matches your deployed URL

**Login Loop:**

- Check that the Access application domain exactly matches your deployed URL
- Verify the session duration is set appropriately

**Still Having Issues?**

- Check Cloudflare Zero Trust logs in the dashboard
- Verify your authentication policy rules
- Ensure you're using the correct login provider

## Additional Configuration

### Environment Variables

The application uses these environment variables:

- `ACCESS_AUD`: Your Cloudflare Zero Trust Application Audience tag
- `NODE_ENV`: Set to `development` for local development, `production` for deployment

### Database Management

```bash
# Apply migrations to production database
npm run db:migrate:prod

# Open Drizzle Studio to view/edit database
npm run db:studio
```

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
