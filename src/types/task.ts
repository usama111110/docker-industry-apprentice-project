
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskTag {
  id: string;
  name: string;
  color: string;
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
