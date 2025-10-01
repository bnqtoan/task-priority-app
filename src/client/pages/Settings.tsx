import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import type {
  User,
  UserPreferences,
  UpdatePreferencesInput,
} from "../../utils/types";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, prefsRes] = await Promise.all([
        api.getMe(),
        api.getPreferences(),
      ]);

      setUser(userRes);
      setPreferences(prefsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: UpdatePreferencesInput) => {
    try {
      setSaving(true);
      const updated = await api.updatePreferences(updates);
      setPreferences(updated);
      setSuccess("Preferences updated successfully!");
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update preferences",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* User Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{user?.name || "Not set"}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              User information is managed by Cloudflare Access and cannot be
              changed here.
            </p>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            AI Recommendation Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred AI Method
              </label>
              <select
                value={preferences?.preferredMethod || "hybrid"}
                onChange={(e) =>
                  updatePreferences({ preferredMethod: e.target.value })
                }
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="simple">1️⃣ Simple ICE (Original)</option>
                <option value="weighted">2️⃣ Weighted Score (Impact 50%)</option>
                <option value="roi">3️⃣ ROI-Based (Time Efficiency)</option>
                <option value="eisenhower">
                  4️⃣ Eisenhower Enhanced (Urgency)
                </option>
                <option value="skill">5️⃣ Skill Match (Talent Fit)</option>
                <option value="energy">6️⃣ Energy-Aware (Sustainable)</option>
                <option value="strategic">
                  7️⃣ Strategic Alignment (Type-Based)
                </option>
                <option value="hybrid">8️⃣ Hybrid Smart (Recommended) ⭐</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This will be the default method selected when you load the
                dashboard.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Time Block Filter
              </label>
              <select
                value={preferences?.defaultTimeBlock || "all"}
                onChange={(e) =>
                  updatePreferences({ defaultTimeBlock: e.target.value })
                }
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="all">📋 All Tasks</option>
                <option value="deep">🧠 Deep Work</option>
                <option value="collaborative">👥 Collaborative</option>
                <option value="quick">⚡ Quick Wins</option>
                <option value="systematic">🔧 Systematic</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This will be the default tab selected when you load the
                dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Task Priority Framework
            </h3>
            <p className="text-blue-800 text-sm mb-2">
              A comprehensive task prioritization system combining ICE scoring,
              time blocking, and the 4D decision framework (DO, DELEGATE, DELAY,
              DELETE).
            </p>
            <p className="text-blue-700 text-xs">
              Powered by 8 different AI recommendation algorithms to help you
              make better decisions about your tasks and optimize your
              productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
