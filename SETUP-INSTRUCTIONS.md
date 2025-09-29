# 🚀 Task Priority Framework - Setup Instructions

## ✅ **Issue Fixed!**

The "Authentication failed" error has been resolved. Here's how to properly run the development environment:

## **Development Setup**

### 1. **Install Dependencies** (if not done already)
```bash
npm install
```

### 2. **Setup Local Database** (automatic on first run)
```bash
npm run setup-local
```
This creates `dev.db` with sample data.

### 3. **Start Development Servers**

**Option A: Start Both Servers Together**
```bash
npm run dev
```

**Option B: Start Servers Separately**
```bash
# Terminal 1 - Backend API
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

## **Access Points**

- **Frontend**: http://localhost:5174 (or 5173 if available)
- **Backend API**: http://localhost:8787
- **Health Check**: http://localhost:8787/api/health

## **What's Working Now**

✅ **Local SQLite Database** - No Cloudflare D1 needed for development
✅ **Mock Authentication** - Auto-logged in as `dev@example.com`
✅ **All API Endpoints** - Tasks, preferences, stats working
✅ **Sample Data** - 3 test tasks pre-loaded
✅ **TypeScript Compilation** - No errors
✅ **Frontend Build** - React app builds successfully

## **Development Features**

- **Auto Database Setup** - Creates and seeds database on first run
- **Mock Cloudflare Access** - No authentication setup needed locally
- **Hot Reload** - Both frontend and backend reload on changes
- **TypeScript Support** - Full type checking and IntelliSense
- **Sample Tasks** - Pre-loaded with test data to see the app working

## **Test the Integration**

1. **Open Frontend**: http://localhost:5174
2. **You should see**: Welcome message for "Dev User"
3. **Sample Tasks**: 3 pre-loaded tasks with different priorities
4. **Try Adding**: Create a new task using the form
5. **AI Recommendations**: Change the AI method dropdown to see different suggestions
6. **Time Blocking**: Use the tabs to filter by time blocks

## **API Testing**

```bash
# Test authentication
curl http://localhost:8787/api/auth/me

# Test tasks
curl http://localhost:8787/api/tasks

# Test stats
curl http://localhost:8787/api/stats/overview
```

## **Production Deployment**

For production deployment with real Cloudflare Access:

1. Follow the original README.md instructions
2. Set up Cloudflare Access application
3. Configure D1 database
4. Deploy with `npm run deploy`

## **Troubleshooting**

**Port Already in Use?**
```bash
# Kill processes on ports
lsof -ti:8787 | xargs kill
lsof -ti:5173 | xargs kill
```

**Database Issues?**
```bash
# Recreate database
rm dev.db
npm run setup-local
```

**Missing Dependencies?**
```bash
npm install
```

## **What Changed**

- ✅ **Fixed Database Connection** - Now uses local SQLite for development
- ✅ **Fixed Authentication** - Mock headers work correctly
- ✅ **Fixed Server Issues** - Proper Node.js server instead of Wrangler
- ✅ **Added Sample Data** - 3 test tasks to see the app working
- ✅ **Simplified Development** - One command starts everything

The app is now fully functional for local development! 🎉