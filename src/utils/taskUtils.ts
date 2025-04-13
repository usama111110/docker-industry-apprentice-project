import { BoardState, Task, TaskStatistics, TaskStatus, TaskPriority } from '@/types/task';

export const getTaskStatistics = (state: BoardState): TaskStatistics => {
  const now = new Date();
  const tasks = Object.values(state.tasks);
  
  // Tasks completed
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  
  // Tasks due in the next 48 hours but not completed
  const dueSoonTasks = tasks.filter(task => {
    if (task.status === 'done' || !task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff > 0 && hoursDiff <= 48;
  }).length;
  
  // Tasks that are overdue
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'done' || !task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    return dueDate < now;
  }).length;
  
  // Count tasks by status
  const tasksByStatus = {
    'todo': 0,
    'in-progress': 0,
    'review': 0,
    'done': 0
  };
  
  tasks.forEach(task => {
    tasksByStatus[task.status]++;
  });
  
  // Count tasks by priority
  const tasksByPriority = {
    'low': 0,
    'medium': 0,
    'high': 0
  };
  
  tasks.forEach(task => {
    tasksByPriority[task.priority]++;
  });
  
  // Get recently completed tasks (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentlyCompletedTasks = tasks
    .filter(task => 
      task.status === 'done' && 
      task.completedAt && 
      new Date(task.completedAt) > sevenDaysAgo
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  return {
    totalTasks: tasks.length,
    completedTasks,
    dueSoonTasks,
    overdueTasks,
    tasksByStatus: tasksByStatus as Record<TaskStatus, number>,
    tasksByPriority: tasksByPriority as Record<TaskPriority, number>,
    recentlyCompletedTasks
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // If date is today, show only time
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // If date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise show full date
  return date.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

export const getDueDateStatus = (dueDate?: string): 'overdue' | 'today' | 'upcoming' | 'none' => {
  if (!dueDate) return 'none';
  
  const now = new Date();
  const due = new Date(dueDate);
  
  // Reset time part for date comparison
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate2 = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  if (dueDate2 < nowDate) return 'overdue';
  if (dueDate2.getTime() === nowDate.getTime()) return 'today';
  return 'upcoming';
};
