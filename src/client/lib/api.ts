import type {
  Task,
  User,
  UserPreferences,
  CreateTaskInput,
  UpdateTaskInput,
  UpdatePreferencesInput,
  OverviewStats,
  TaskRecommendations,
} from "../../utils/types";

const API_BASE = "/api";

async function fetchAPI(endpoint: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ error: response.statusText }))) as any;
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth
  getMe: (): Promise<User> => fetchAPI("/auth/me"),

  // Tasks
  getTasks: async (params?: {
    status?: string;
    timeBlock?: string;
    limit?: number;
  }): Promise<Task[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.timeBlock && params.timeBlock !== "all")
      query.append("timeBlock", params.timeBlock);
    if (params?.limit) query.append("limit", params.limit.toString());

    const queryString = query.toString();
    const response = await fetchAPI(
      `/tasks${queryString ? `?${queryString}` : ""}`,
    );
    return response.tasks;
  },

  createTask: async (task: CreateTaskInput): Promise<Task> => {
    const response = await fetchAPI("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    return response.task;
  },

  updateTask: async (id: number, task: UpdateTaskInput): Promise<Task> => {
    const response = await fetchAPI(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    return response.task;
  },

  deleteTask: (id: number): Promise<{ success: boolean }> =>
    fetchAPI(`/tasks/${id}`, { method: "DELETE" }),

  completeTask: async (id: number): Promise<Task> => {
    const response = await fetchAPI(`/tasks/${id}/complete`, {
      method: "PATCH",
    });
    return response.task;
  },

  // Time tracking
  startFocusSession: async (taskId: number): Promise<Task> => {
    const response = await fetchAPI(`/tasks/${taskId}/focus/start`, {
      method: "PATCH",
    });
    return response.task;
  },

  endFocusSession: async (taskId: number, duration: number): Promise<Task> => {
    const response = await fetchAPI(`/tasks/${taskId}/focus/end`, {
      method: "PATCH",
      body: JSON.stringify({ duration }),
    });
    return response.task;
  },

  addTimeEntry: async (
    taskId: number,
    duration: number,
    type: "focus" | "regular",
  ): Promise<Task> => {
    const response = await fetchAPI(`/tasks/${taskId}/time`, {
      method: "POST",
      body: JSON.stringify({ duration, type }),
    });
    return response.task;
  },

  // Preferences
  getPreferences: (): Promise<UserPreferences> => fetchAPI("/preferences"),

  updatePreferences: (
    prefs: UpdatePreferencesInput,
  ): Promise<UserPreferences> =>
    fetchAPI("/preferences", { method: "PUT", body: JSON.stringify(prefs) }),

  // Stats
  getOverview: (): Promise<OverviewStats> => fetchAPI("/stats/overview"),

  getRecommendations: (method: string): Promise<TaskRecommendations> =>
    fetchAPI(`/stats/recommendations?method=${method}`),
};
