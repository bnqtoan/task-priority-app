# API Keys - Programmatic Access Guide

Complete guide to using API keys for extending the Task Priority App with external integrations.

## Overview

The app now supports **dual authentication**:
- **Cloudflare Zero Trust**: For web UI access (browser-based)
- **API Keys**: For programmatic access (CLI, scripts, mobile apps, third-party integrations)

## Key Features

✅ **Bearer Token Authentication** - Industry-standard `Authorization: Bearer` header
✅ **SHA-256 Hashed Storage** - Keys are hashed before storage (never stored in plaintext)
✅ **Rate Limiting** - 1,000 requests/hour for API keys, 10,000 requests/hour for web UI
✅ **Expiration Support** - Optional expiration dates (7, 30, 90, 180, 365 days, or never)
✅ **Usage Tracking** - Last used timestamp and request count
✅ **Web UI Management** - Create, view, and delete keys at `/api-keys`

## Quick Start

### 1. Create an API Key

**Via Web UI:**
1. Navigate to `/api-keys` in your browser
2. Click "Create New Key"
3. Enter a descriptive name (e.g., "Mobile App", "Zapier Integration")
4. Select expiration (default: 90 days)
5. **Copy and save the key immediately** - it won't be shown again!

**Key Format:**
```
task_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- `task_` - Prefix for identification
- `live` - Environment (live for production, test for development)
- 40 random alphanumeric characters

### 2. Use the API Key

**cURL Example:**
```bash
curl -H "Authorization: Bearer task_live_abc123..." \
  https://your-app.workers.dev/api/tasks
```

**JavaScript Example:**
```javascript
const API_KEY = 'task_live_abc123...';
const BASE_URL = 'https://your-app.workers.dev';

async function getTasks() {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  return response.json();
}
```

**Python Example:**
```python
import requests

API_KEY = 'task_live_abc123...'
BASE_URL = 'https://your-app.workers.dev'

headers = {
    'Authorization': f'Bearer {API_KEY}'
}

response = requests.get(f'{BASE_URL}/api/tasks', headers=headers)
tasks = response.json()
```

## Available Endpoints

All API endpoints support both Cloudflare Access and API key authentication.

### Tasks

**GET /api/tasks** - List all tasks
```bash
curl -H "Authorization: Bearer $API_KEY" \
  https://your-app.workers.dev/api/tasks
```

**POST /api/tasks** - Create a task
```bash
curl -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Complete API integration",
    "impact": 8,
    "confidence": 7,
    "ease": 6,
    "type": "operations",
    "timeBlock": "deep",
    "estimatedTime": 120,
    "decision": "do"
  }' \
  https://your-app.workers.dev/api/tasks
```

**PATCH /api/tasks/:id** - Update a task
```bash
curl -X PATCH \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' \
  https://your-app.workers.dev/api/tasks/123
```

**DELETE /api/tasks/:id** - Delete a task
```bash
curl -X DELETE \
  -H "Authorization: Bearer $API_KEY" \
  https://your-app.workers.dev/api/tasks/123
```

### Focus Sessions

**POST /api/tasks/:id/focus/start** - Start focus session
```bash
curl -X POST \
  -H "Authorization: Bearer $API_KEY" \
  https://your-app.workers.dev/api/tasks/123/focus/start
```

**POST /api/tasks/:id/focus/end** - End focus session
```bash
curl -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"durationMinutes": 25}' \
  https://your-app.workers.dev/api/tasks/123/focus/end
```

### Statistics & Analytics

**GET /api/stats** - Get productivity stats
```bash
curl -H "Authorization: Bearer $API_KEY" \
  https://your-app.workers.dev/api/stats
```

### Notes

**GET /api/notes** - List all notes
**POST /api/notes** - Create a note
**PATCH /api/notes/:id** - Update a note
**DELETE /api/notes/:id** - Delete a note

### API Key Management

**GET /api/api-keys** - List your API keys (requires web auth or existing API key)
**POST /api/api-keys** - Create new API key
**PATCH /api/api-keys/:id** - Update API key name
**DELETE /api/api-keys/:id** - Delete API key

## Rate Limiting

Rate limits are applied per user:

| Auth Method | Limit | Window |
|-------------|-------|--------|
| API Key | 1,000 requests | 1 hour |
| Cloudflare Access (Web UI) | 10,000 requests | 1 hour |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 2025-10-04T14:30:00Z
```

**429 Response (Rate Limit Exceeded):**
```json
{
  "error": "Rate limit exceeded",
  "limit": 1000,
  "windowSeconds": 3600,
  "retryAfter": 1847
}
```

## Security Best Practices

### Storage
- **Never commit API keys to git** - Use `.gitignore`
- **Use environment variables** - Store keys in `.env` files
- **Use password managers** - For personal keys
- **Use secrets managers** - For production (AWS Secrets Manager, 1Password, etc.)

### Key Rotation
1. Create new API key
2. Update all integrations to use new key
3. Delete old key once confirmed working
4. Recommended rotation: every 90 days

### Key Naming
Use descriptive names to identify integrations:
- ✅ "Production Mobile App"
- ✅ "Zapier Task Automation"
- ✅ "CI/CD Pipeline"
- ❌ "Key 1"
- ❌ "test"

### Scoping (Future)
Current implementation: Full access to user's data
Future: Add scopes like `read:tasks`, `write:tasks`, `read:stats`

## Integration Examples

### Zapier Integration

**Trigger:** New task created
```javascript
// Zapier Code Step
const API_KEY = process.env.API_KEY;
const response = await fetch('https://your-app.workers.dev/api/tasks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: inputData.taskName,
    impact: 7,
    confidence: 7,
    ease: 5,
    type: 'operations',
    timeBlock: 'quick',
    estimatedTime: 30,
    decision: 'do'
  })
});

return await response.json();
```

### CLI Tool

**Example: Node.js CLI**
```javascript
#!/usr/bin/env node
const API_KEY = process.env.TASK_API_KEY;
const BASE_URL = process.env.TASK_API_URL || 'https://your-app.workers.dev';

async function listTasks() {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  const { tasks } = await response.json();

  tasks.forEach(task => {
    console.log(`[${task.id}] ${task.name} - ${task.decision.toUpperCase()}`);
  });
}

listTasks().catch(console.error);
```

### Mobile App (React Native)

```javascript
// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://your-app.workers.dev';

export class TaskAPIClient {
  private apiKey: string | null = null;

  async setAPIKey(key: string) {
    this.apiKey = key;
    await AsyncStorage.setItem('api_key', key);
  }

  async loadAPIKey() {
    this.apiKey = await AsyncStorage.getItem('api_key');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.apiKey) throw new Error('API key not configured');

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getTasks() {
    return this.request('/api/tasks');
  }

  async createTask(task: CreateTaskInput) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }
}
```

## Troubleshooting

### 401 Unauthorized

**Error:**
```json
{
  "error": "Invalid API key"
}
```

**Solutions:**
1. Verify key format: `task_live_` or `task_test_` prefix
2. Check key hasn't expired
3. Ensure key hasn't been deleted
4. Verify key is not revoked

### 429 Rate Limit Exceeded

**Solutions:**
1. Implement exponential backoff
2. Cache responses when possible
3. Use webhooks instead of polling
4. Contact admin to increase limits

### Key Not Working After Creation

**Possible causes:**
1. Copied key incorrectly (missing characters)
2. Extra whitespace in environment variable
3. Key expired immediately after creation
4. Database migration not applied

**Debug:**
```bash
# Test key format
echo $API_KEY | grep -E "^task_(live|test)_[a-zA-Z0-9]{40}$"

# Test API connection
curl -v -H "Authorization: Bearer $API_KEY" \
  https://your-app.workers.dev/api/health
```

## Technical Implementation

### Database Schema

```sql
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,  -- SHA-256 hash
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,           -- First 8 chars for identification
  last_used_at INTEGER,
  request_count INTEGER DEFAULT 0,
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Authentication Flow

1. Client sends request with `Authorization: Bearer task_live_...` header
2. Middleware extracts API key from header
3. Validates format: `/^task_(live|test)_[a-zA-Z0-9]{40}$/`
4. Hashes key using SHA-256
5. Looks up hash in database
6. Checks expiration
7. Updates `last_used_at` and `request_count`
8. Attaches user to request context
9. Checks rate limit
10. Proceeds to route handler

### Security

- **Hashing**: SHA-256 (Web Crypto API)
- **Storage**: Only hash stored in database
- **Transmission**: HTTPS only (enforced by Cloudflare)
- **Rotation**: Manual via UI (create new, delete old)
- **Revocation**: Immediate (delete key)

## Production Deployment

### Before Deployment

1. **Apply database migration:**
```bash
npm run db:migrate:prod
```

2. **Configure rate limiting (optional):**
```bash
# Create rate limiter namespace
wrangler rate-limit create api-rate-limit --limit 1000 --period 3600
```

3. **Deploy:**
```bash
npm run deploy
```

### Verify Deployment

```bash
# Test health endpoint
curl https://your-app.workers.dev/api/health

# Create test API key via web UI
# Test API key
curl -H "Authorization: Bearer task_live_..." \
  https://your-app.workers.dev/api/tasks
```

## Future Enhancements

- [ ] API key scopes (read-only, write-only, admin)
- [ ] Webhook support (task completed, deadline approaching)
- [ ] GraphQL endpoint
- [ ] API usage analytics dashboard
- [ ] Multiple API keys per integration
- [ ] IP whitelisting
- [ ] OAuth 2.0 support for third-party apps
- [ ] SDK libraries (npm, pip, gem)

## Support

For issues or questions:
1. Check this documentation
2. Review `/api-keys` page in web UI
3. Check browser console for errors
4. Review `wrangler tail` logs in production
5. Open issue on GitHub

---

**Last Updated:** 2025-10-04
**Version:** 1.0.0
