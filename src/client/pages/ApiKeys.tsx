import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Copy, Plus, Trash2, Key, Clock, Calendar, ArrowLeft, BookOpen } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  key?: string; // Only present on creation
  lastUsedAt: Date | null;
  requestCount: number;
  expiresAt: Date | null;
  createdAt: Date;
}

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpireDays, setNewKeyExpireDays] = useState<number | undefined>(90);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/api-keys");
      if (!response.ok) throw new Error("Failed to load API keys");
      const data = (await response.json()) as { apiKeys: any[] };
      setApiKeys(
        data.apiKeys.map((key: any) => ({
          ...key,
          lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
          expiresAt: key.expiresAt ? new Date(key.expiresAt) : null,
          createdAt: new Date(key.createdAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError("API key name is required");
      return;
    }

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          expiresInDays: newKeyExpireDays,
        }),
      });

      if (!response.ok) throw new Error("Failed to create API key");
      const data = (await response.json()) as { apiKey: { key: string } };

      setCreatedKey(data.apiKey.key);
      setNewKeyName("");
      setNewKeyExpireDays(90);
      setShowCreateModal(false);
      await loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete API key");
      await loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return expiresAt < new Date();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading API keys...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Key className="w-8 h-8" />
          API Keys
        </h1>
        <p className="text-gray-600 mt-2">
          Manage API keys for programmatic access to your tasks and data
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {createdKey && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-2">API Key Created Successfully!</p>
              <p className="text-sm mb-3">
                Save this key securely - it won't be shown again.
              </p>
              <div className="bg-white border border-green-300 rounded p-3 font-mono text-sm break-all flex items-center gap-2">
                <code className="flex-1">{createdKey}</code>
                <button
                  onClick={() => copyToClipboard(createdKey, "created")}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  {copiedKeyId === "created" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <button
              onClick={() => setCreatedKey(null)}
              className="text-green-500 hover:text-green-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Your API Keys</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Key
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No API keys yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First API Key
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Key Prefix</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Used</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Requests</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expires</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{key.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {key.prefix}...
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(key.lastUsedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{key.requestCount}</td>
                  <td className="px-4 py-3 text-sm">
                    {key.expiresAt ? (
                      <span
                        className={`flex items-center gap-1 ${
                          isExpired(key.expiresAt) ? "text-red-600 font-semibold" : "text-gray-600"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {isExpired(key.expiresAt) ? "Expired" : formatDate(key.expiresAt)}
                      </span>
                    ) : (
                      <span className="text-gray-500">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(key.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-1 ml-auto"
                      title="Delete API key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New API Key</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Mobile App, CLI Tool, Zapier Integration"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration
                </label>
                <select
                  value={newKeyExpireDays || "never"}
                  onChange={(e) =>
                    setNewKeyExpireDays(e.target.value === "never" ? undefined : parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">Security Note:</p>
                <p>
                  This API key will be shown only once. Store it securely in a password manager or
                  environment variable.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyName("");
                  setNewKeyExpireDays(90);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                disabled={!newKeyName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Section */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Using Your API Keys</h3>
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            View API Documentation
          </a>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="font-semibold text-blue-900 mb-2">📚 Interactive API Documentation</p>
            <p className="text-blue-800 mb-2">
              Explore the complete API reference with interactive examples:
            </p>
            <div className="flex gap-3">
              <a
                href="/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Swagger UI (Full API)
              </a>
              <span className="text-blue-400">•</span>
              <a
                href="/api/docs/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                AI-Optimized Docs
              </a>
              <span className="text-blue-400">•</span>
              <a
                href="/api/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                OpenAPI Spec
              </a>
            </div>
          </div>

          <div>
            <p className="font-medium mb-1">Authentication:</p>
            <pre className="bg-white border border-gray-300 rounded p-3 overflow-x-auto">
              <code>curl -H "Authorization: Bearer task_live_..." \{"\n"}  https://your-app.workers.dev/api/tasks</code>
            </pre>
          </div>

          <div>
            <p className="font-medium mb-1">Rate Limits:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>API Key authentication: 1,000 requests per hour</li>
              <li>Web UI (Cloudflare Access): 10,000 requests per hour</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-1">Available Endpoints:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <code className="bg-white px-1 py-0.5 rounded">GET /api/tasks</code> - List all tasks
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">POST /api/tasks</code> - Create a task
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">PATCH /api/tasks/:id</code> - Update a task
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">DELETE /api/tasks/:id</code> - Delete a task
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">GET /api/stats/overview</code> - Get overview statistics
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">GET /api/stats/recommendations?method=hybrid</code> - Get AI recommendations
              </li>
              <li>
                <code className="bg-white px-1 py-0.5 rounded">GET /api/notes</code> - List notes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
