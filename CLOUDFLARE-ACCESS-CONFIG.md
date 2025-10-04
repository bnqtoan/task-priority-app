# Cloudflare Access Configuration

## Issue: API Documentation Pages Require Authentication

The Swagger UI and OpenAPI endpoints are currently protected by Cloudflare Access, requiring login to view the documentation. These endpoints should be publicly accessible.

## Solution: Configure Bypass Rules

### Step 1: Access Cloudflare Zero Trust Dashboard

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Select your account
3. Navigate to **Access** → **Applications**

### Step 2: Find Your Application

Find the application protecting `task-priority-app.bnqtoan.workers.dev`

### Step 3: Add Bypass Policy

1. Click **Edit** on your application
2. Scroll to **Policies** section
3. Click **Add a policy**
4. Configure the policy:
   - **Policy name**: Public API Documentation
   - **Action**: Bypass
   - **Session duration**: N/A (not applicable for bypass)

### Step 4: Configure Policy Rules

Under **Configure rules**, add the following:

**Include:**
- Selector: `Hostname`
- Value: `task-priority-app.bnqtoan.workers.dev`

**AND** (add multiple conditions):
- Selector: `Path`
- Value: `/api/docs`

- Selector: `Path`
- Value: `/api/docs/ai`

- Selector: `Path`
- Value: `/api/openapi.json`

- Selector: `Path`
- Value: `/api/openapi-ai.json`

- Selector: `Path`
- Value: `/api/health`

### Step 5: Save and Test

1. Click **Save policy**
2. Click **Save application**
3. Wait 1-2 minutes for changes to propagate
4. Test the endpoints:
   - https://task-priority-app.bnqtoan.workers.dev/api/docs
   - https://task-priority-app.bnqtoan.workers.dev/api/openapi.json

## Alternative: Use Path Wildcards

If your Cloudflare Access supports path wildcards, you can simplify:

- Path: `/api/docs*` (matches `/api/docs` and `/api/docs/ai`)
- Path: `/api/openapi*.json` (matches both OpenAPI specs)

## Verification

After configuration, these endpoints should be publicly accessible without authentication:

✅ `/api/docs` - Swagger UI (Full API)
✅ `/api/docs/ai` - AI-Optimized Documentation
✅ `/api/openapi.json` - OpenAPI Specification
✅ `/api/openapi-ai.json` - AI-Optimized OpenAPI Spec
✅ `/api/health` - Health Check

All other API endpoints (`/api/tasks`, `/api/stats`, etc.) will remain protected by Cloudflare Access.
