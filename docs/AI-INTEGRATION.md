# AI Agent Integration Guide

Complete guide for integrating the Task Priority App API with AI agents, LLMs, and automation tools.

## Overview

The Task Priority App API is optimized for AI agent integration with **OpenAPI 3.1.0** specifications designed for:
- **Function calling** (OpenAI, Claude, Gemini)
- **Model Context Protocol (MCP)** (Anthropic)
- **Agent frameworks** (LangChain, Haystack, Semantic Kernel, Google ADK)
- **Workflow automation** (Zapier, Make, n8n)

## Quick Start for AI Agents

### 1. Access the AI-Optimized OpenAPI Spec

**Development:**
```
http://localhost:8787/api/openapi-ai.json
```

**Production:**
```
https://your-app.workers.dev/api/openapi-ai.json
```

**Swagger UI (Interactive):**
```
http://localhost:8787/api/docs/ai
```

### 2. Key Features for AI

✅ **operationId** on every endpoint (required for function calling)
✅ **Rich descriptions** (context for AI to choose correct function)
✅ **Examples** in requests/responses
✅ **Parameter descriptions** with constraints
✅ **x-ai-usage-guide** with common workflows
✅ **OpenAPI 3.1.0** format (compatible with all major frameworks)

## AI Framework Integration

### OpenAI Function Calling

```python
import openai
import requests

# Load OpenAPI spec
openapi_spec = requests.get("http://localhost:8787/api/openapi-ai.json").json()

# Convert to OpenAI function format (simplified - use a library like openapi-llm)
functions = convert_openapi_to_functions(openapi_spec)

# Use with ChatGPT
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Create a high-impact task for writing documentation"}
    ],
    functions=functions,
    function_call="auto"
)

# Execute the function call
if response.choices[0].get("function_call"):
    function_name = response.choices[0]["function_call"]["name"]
    arguments = json.loads(response.choices[0]["function_call"]["arguments"])

    # Call the actual API
    if function_name == "createTask":
        result = requests.post(
            "http://localhost:8787/api/tasks",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json=arguments
        )
```

### Anthropic Claude with MCP

**Install MCP Server:**
```bash
npm install -g @modelcontextprotocol/server-openapi
```

**Configure Claude Desktop:**
```json
{
  "mcpServers": {
    "task-priority": {
      "command": "mcp-server-openapi",
      "args": ["http://localhost:8787/api/openapi-ai.json"],
      "env": {
        "AUTHORIZATION": "Bearer task_live_..."
      }
    }
  }
}
```

**Use in Claude:**
```
You: "Create a task for implementing the new feature with high impact"

Claude will automatically:
1. Read the OpenAPI spec
2. Call createTask with appropriate parameters
3. Return the created task details
```

### LangChain Integration

```python
from langchain.agents import load_tools, initialize_agent
from langchain.llms import OpenAI
from langchain.tools.openapi.utils.openapi_utils import OpenAPISpec
from langchain.tools.openapi.utils.api_models import APIOperation

# Load OpenAPI spec
spec = OpenAPISpec.from_url("http://localhost:8787/api/openapi-ai.json")

# Create tools from spec
tools = load_tools(["openapi"], openapi_spec=spec, headers={
    "Authorization": "Bearer task_live_..."
})

# Initialize agent
llm = OpenAI(temperature=0)
agent = initialize_agent(
    tools,
    llm,
    agent="zero-shot-react-description",
    verbose=True
)

# Use natural language
agent.run("Create a strategic task for Q4 planning with high confidence")
```

### Google ADK (Agent Development Kit)

```typescript
import { Agent } from '@google-cloud/adk';
import { OpenAPIToolset } from '@google-cloud/adk/tools';

const agent = new Agent({
  model: 'gemini-pro',
  tools: [
    new OpenAPIToolset({
      spec: 'http://localhost:8787/api/openapi-ai.json',
      headers: {
        'Authorization': 'Bearer task_live_...'
      }
    })
  ]
});

const response = await agent.chat("List my top 5 priority tasks");
```

### Azure AI Foundry

```python
from azure.ai.foundry import AIAgent
from azure.ai.foundry.tools import OpenAPITool

agent = AIAgent(
    tools=[
        OpenAPITool(
            spec_url="http://localhost:8787/api/openapi-ai.json",
            auth_type="api_key",
            auth_header="Authorization",
            auth_prefix="Bearer "
        )
    ]
)

result = agent.run("Start tracking time on my highest impact task")
```

## Common AI Workflows

### 1. Create and Prioritize Task

**Natural Language Input:**
```
"Create a task for writing documentation. It's high impact (8), I'm confident (7),
and moderately easy (6). It's growth-related and needs deep focus time."
```

**AI Agent Flow:**
1. Calls `createTask` with:
   ```json
   {
     "name": "Write documentation",
     "impact": 8,
     "confidence": 7,
     "ease": 6,
     "type": "growth",
     "timeBlock": "deep",
     "estimatedTime": 120,
     "decision": "do"
   }
   ```
2. System auto-assigns decision based on ICE scores
3. Returns created task with ID

### 2. Track Time on Task

**Natural Language:**
```
"Start working on task #5"
"I worked for 25 minutes, stop the timer"
```

**AI Agent Flow:**
1. Calls `startFocusSession` with task ID
2. User works on task
3. Calls `endFocusSession` with duration
4. Time automatically added to task

### 3. Get Prioritized Task List

**Natural Language:**
```
"What should I work on next?"
"Show me my highest priority tasks"
```

**AI Agent Flow:**
1. Calls `getStatistics` with method="hybrid"
2. Calls `listTasks` filtered by decision="do"
3. Presents top tasks sorted by priority score

### 4. Productivity Analytics

**Natural Language:**
```
"How productive was I this week?"
"What's my completion rate?"
```

**AI Agent Flow:**
1. Calls `getStatistics`
2. Analyzes:
   - Total tasks vs completed
   - Time spent
   - Tasks by decision (do/delegate/delay/delete)
3. Provides insights

## Authentication for AI Agents

### Step 1: Generate API Key

**Via Web UI:**
1. Navigate to `/api-keys`
2. Click "Create New Key"
3. Name it (e.g., "Claude MCP", "ChatGPT Plugin")
4. Copy the key (starts with `task_live_...`)

**Via API:**
```bash
curl -X POST http://localhost:8787/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Agent",
    "expiresInDays": 90
  }'
```

### Step 2: Configure Agent

**Environment Variable:**
```bash
export TASK_API_KEY="task_live_abc123..."
export TASK_API_URL="http://localhost:8787"
```

**In Code:**
```python
headers = {
    "Authorization": f"Bearer {os.environ['TASK_API_KEY']}"
}
```

## Function Calling Reference

### Available Operations (operationId)

| Operation | Purpose | Required Params |
|-----------|---------|-----------------|
| `checkHealth` | Health check | None |
| `listTasks` | Get all tasks | None (optional: status filter) |
| `getTask` | Get single task | id |
| `createTask` | Create new task | name, impact, confidence, ease, type, timeBlock, estimatedTime, decision |
| `updateTask` | Update task | id + fields to update |
| `deleteTask` | Delete task | id |
| `startFocusSession` | Start time tracking | id (task) |
| `endFocusSession` | Stop time tracking | id, durationMinutes |
| `getStatistics` | Get analytics | None (optional: method) |
| `listApiKeys` | List API keys | None |
| `createApiKey` | Create API key | name (optional: expiresInDays) |
| `deleteApiKey` | Delete API key | id |

### Parameter Constraints

**ICE Scores (Impact, Confidence, Ease):**
- Type: integer
- Range: 1-10
- Required for task creation

**Task Type:**
- Enum: `revenue`, `growth`, `operations`, `strategic`, `personal`
- Use for categorization and strategic planning

**Time Block:**
- Enum: `deep`, `collaborative`, `quick`, `systematic`
- Helps schedule tasks for appropriate time slots

**Decision (4D Framework):**
- Enum: `do`, `delegate`, `delay`, `delete`
- Auto-suggested by AI based on ICE scores

**Estimated Time:**
- Type: integer (minutes)
- Used for time blocking and capacity planning

## Rate Limits

| Auth Type | Limit | Window |
|-----------|-------|--------|
| API Key | 1,000 requests | 1 hour |
| Web UI | 10,000 requests | 1 hour |

**Headers Returned:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 2025-10-04T14:30:00Z
```

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Invalid API key"
}
```
**Solution:** Check API key format and validity

### 400 Validation Error
```json
{
  "error": "Validation error",
  "details": {
    "impact": "Must be between 1 and 10"
  }
}
```
**Solution:** Review parameter constraints in OpenAPI spec

### 429 Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 1847
}
```
**Solution:** Implement exponential backoff or reduce request frequency

## Testing Your Integration

### 1. Validate OpenAPI Spec

```bash
# Using Swagger CLI
swagger-cli validate http://localhost:8787/api/openapi-ai.json

# Using OpenAPI Generator
openapi-generator-cli validate -i http://localhost:8787/api/openapi-ai.json
```

### 2. Test Function Calling

```python
# Test with OpenAI function calling
import openai
import json

def test_create_task():
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": "Create a task for code review with impact 7, confidence 8, ease 5"
        }],
        functions=[{
            "name": "createTask",
            "description": "Create a new task with ICE scoring",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "impact": {"type": "integer", "minimum": 1, "maximum": 10},
                    "confidence": {"type": "integer", "minimum": 1, "maximum": 10},
                    "ease": {"type": "integer", "minimum": 1, "maximum": 10},
                    # ... other params from OpenAPI spec
                },
                "required": ["name", "impact", "confidence", "ease", "type", "timeBlock", "estimatedTime", "decision"]
            }
        }],
        function_call="auto"
    )

    print(json.dumps(response, indent=2))

test_create_task()
```

### 3. Test with cURL

```bash
# Health check (no auth)
curl http://localhost:8787/api/health

# Create task (with auth)
curl -X POST http://localhost:8787/api/tasks \
  -H "Authorization: Bearer task_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Task",
    "impact": 8,
    "confidence": 7,
    "ease": 6,
    "type": "operations",
    "timeBlock": "quick",
    "estimatedTime": 30,
    "decision": "do"
  }'
```

## Advanced Features

### Custom AI Recommendations

The API supports 8 different AI recommendation methods:

```python
methods = [
    "simple",      # Basic ICE threshold
    "weighted",    # Weighted ICE scoring
    "roi",         # ROI-based prioritization
    "eisenhower",  # Urgency/importance matrix
    "skill",       # Skill-based matching
    "energy",      # Energy ROI optimization
    "strategic",   # Strategic value weighting
    "hybrid"       # Combined approach (recommended)
]

for method in methods:
    stats = get_statistics(method=method)
    print(f"{method}: {stats['tasksByDecision']}")
```

### Batch Operations

```python
# Create multiple tasks efficiently
tasks_to_create = [
    {"name": "Task 1", "impact": 8, ...},
    {"name": "Task 2", "impact": 7, ...},
    {"name": "Task 3", "impact": 9, ...}
]

created_tasks = []
for task_data in tasks_to_create:
    task = create_task(**task_data)
    created_tasks.append(task)

# Get prioritized list
stats = get_statistics(method="hybrid")
high_priority = list_tasks(status="active")
```

## Production Deployment

### 1. Update Server URLs in OpenAPI Spec

Replace `http://localhost:8787` with your production URL:
```
https://your-app.workers.dev
```

### 2. Secure API Keys

- Use environment variables
- Rotate keys every 90 days
- Monitor usage with request counts
- Delete unused keys

### 3. Monitor Rate Limits

```python
import requests

response = requests.get(
    "https://your-app.workers.dev/api/tasks",
    headers={"Authorization": f"Bearer {API_KEY}"}
)

print(f"Remaining: {response.headers.get('X-RateLimit-Remaining')}")
print(f"Reset at: {response.headers.get('X-RateLimit-Reset')}")
```

## Support & Resources

**OpenAPI Specs:**
- Standard: `/api/openapi.json`
- AI-optimized: `/api/openapi-ai.json`
- Interactive docs: `/api/docs` and `/api/docs/ai`

**Documentation:**
- API Keys Guide: `docs/API-KEYS.md`
- Project Overview: `CLAUDE.md`

**Examples:**
- Function calling examples in this guide
- Integration patterns for major frameworks
- Error handling best practices

---

**Last Updated:** 2025-10-04
**OpenAPI Version:** 3.1.0
**Supported Frameworks:** OpenAI, Claude/MCP, LangChain, Google ADK, Azure AI
