import type { Task, User, UserPreferences, CreateTaskInput, UpdateTaskInput, UpdatePreferencesInput, OverviewStats, TaskRecommendations } from '../../utils/types';

const API_BASE = '/api';

async function fetchAPI(endpoint: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText })) as any;
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth
  getMe: (): Promise<User> => fetchAPI('/auth/me'),

  // Tasks
  getTasks: (params?: { status?: string; timeBlock?: string; limit?: number }): Promise<Task[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.timeBlock && params.timeBlock !== 'all') query.append('timeBlock', params.timeBlock);
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    return fetchAPI(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  createTask: (task: CreateTaskInput): Promise<Task> =>
    fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(task) }),

  updateTask: (id: number, task: UpdateTaskInput): Promise<Task> =>
    fetchAPI(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),

  deleteTask: (id: number): Promise<{ success: boolean }> =>
    fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),

  completeTask: (id: number): Promise<Task> =>
    fetchAPI(`/tasks/${id}/complete`, { method: 'PATCH' }),

  // Preferences
  getPreferences: (): Promise<UserPreferences> => fetchAPI('/preferences'),

  updatePreferences: (prefs: UpdatePreferencesInput): Promise<UserPreferences> =>
    fetchAPI('/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),

  // Stats
  getOverview: (): Promise<OverviewStats> => fetchAPI('/stats/overview'),

  getRecommendations: (method: string): Promise<TaskRecommendations> =>
    fetchAPI(`/stats/recommendations?method=${method}`),
};