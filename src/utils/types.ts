// Shared types for frontend and backend
export interface Task {
  id: number;
  userId: number;
  name: string;
  notes: string | null;
  impact: number; // 1-10
  confidence: number; // 1-10
  ease: number; // 1-10
  type: 'revenue' | 'growth' | 'operations' | 'strategic' | 'personal';
  timeBlock: 'deep' | 'collaborative' | 'quick' | 'systematic';
  estimatedTime: number; // in minutes
  decision: 'do' | 'delegate' | 'delay' | 'delete';
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: number;
  userId: number;
  preferredMethod: string;
  defaultTimeBlock?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  name: string;
  notes?: string | null;
  impact: number;
  confidence: number;
  ease: number;
  type: Task['type'];
  timeBlock: Task['timeBlock'];
  estimatedTime: number;
  decision: Task['decision'];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: Task['status'];
}

export interface UpdatePreferencesInput {
  preferredMethod?: string;
  defaultTimeBlock?: string;
}

export interface OverviewStats {
  decisions: {
    do: { count: number; time: number };
    delegate: { count: number; time: number };
    delay: { count: number; time: number };
    delete: { count: number; time: number };
  };
  timeBlocks: {
    deep: { count: number; time: number };
    collaborative: { count: number; time: number };
    quick: { count: number; time: number };
    systematic: { count: number; time: number };
  };
  types: {
    revenue: { count: number; time: number };
    growth: { count: number; time: number };
    operations: { count: number; time: number };
    strategic: { count: number; time: number };
    personal: { count: number; time: number };
  };
  totalTasks: number;
  totalTime: number;
}

export interface AIRecommendation {
  decision: Task['decision'];
  reason: string;
}

export interface TaskRecommendations {
  [taskId: number]: AIRecommendation;
}