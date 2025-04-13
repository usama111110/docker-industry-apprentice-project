
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskTag {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: TaskTag[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignee?: string;
  subtasks?: Subtask[];
  completedAt?: string;
  estimatedTime?: number; // in minutes
}

export interface Column {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: TaskStatus[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
  showCompletedTasks: boolean;
  defaultTaskView: 'board' | 'list';
  notifications: boolean;
}

export interface TaskFilter {
  search: string;
  priority?: TaskPriority[];
  tags?: string[];
  dueDate?: 'today' | 'this-week' | 'overdue' | 'no-date' | null;
  assignee?: string | null;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  dueSoonTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  recentlyCompletedTasks: Task[];
}
