
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, TaskStatus, BoardState, TaskTag, TaskPriority, Subtask } from '@/types/task';

// Initial sample tags
const sampleTags: TaskTag[] = [
  { id: 'tag1', name: 'Frontend', color: '#3B82F6' },
  { id: 'tag2', name: 'Backend', color: '#10B981' },
  { id: 'tag3', name: 'Bug', color: '#EF4444' },
  { id: 'tag4', name: 'Feature', color: '#8B5CF6' },
  { id: 'tag5', name: 'Documentation', color: '#F59E0B' },
];

// Sample subtasks
const createSubtasks = (count: number): Subtask[] => {
  const subtasks: Subtask[] = [];
  for (let i = 0; i < count; i++) {
    subtasks.push({
      id: `subtask-${i}`,
      title: `Subtask ${i + 1}`,
      completed: Math.random() > 0.5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 10)).toISOString(),
    });
  }
  return subtasks;
};

// Initial sample tasks
const initialTasks: { [key: string]: Task } = {
  'task-1': {
    id: 'task-1',
    title: 'Implement user authentication',
    description: 'Create login, registration, and password recovery flows',
    status: 'todo',
    priority: 'high',
    tags: [sampleTags[0], sampleTags[1]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    subtasks: createSubtasks(3),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design dashboard layout',
    description: 'Create wireframes and mockups for the main dashboard',
    status: 'in-progress',
    priority: 'medium',
    tags: [sampleTags[0], sampleTags[4]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    subtasks: createSubtasks(2),
  },
  'task-3': {
    id: 'task-3',
    title: 'Fix navigation bug on mobile',
    description: 'The menu doesn\'t close after selection on mobile devices',
    status: 'todo',
    priority: 'high',
    tags: [sampleTags[0], sampleTags[2]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    subtasks: createSubtasks(0),
  },
  'task-4': {
    id: 'task-4',
    title: 'Implement API integration',
    description: 'Connect frontend with backend APIs',
    status: 'in-progress',
    priority: 'high',
    tags: [sampleTags[0], sampleTags[1]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    subtasks: createSubtasks(4),
  },
  'task-5': {
    id: 'task-5',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples',
    status: 'review',
    priority: 'low',
    tags: [sampleTags[1], sampleTags[4]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    subtasks: createSubtasks(1),
  },
  'task-6': {
    id: 'task-6',
    title: 'Optimize database queries',
    description: 'Improve the performance of slow database queries',
    status: 'done',
    priority: 'medium',
    tags: [sampleTags[1]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    subtasks: createSubtasks(2),
  },
  'task-7': {
    id: 'task-7',
    title: 'Create visual style guide',
    description: 'Document colors, typography, and component styles',
    status: 'done',
    priority: 'medium',
    tags: [sampleTags[0], sampleTags[4]],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    subtasks: createSubtasks(3),
  },
};

// Initial board state
const initialState: BoardState = {
  tasks: initialTasks,
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-3'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-2', 'task-4'],
    },
    'review': {
      id: 'review',
      title: 'Review',
      taskIds: ['task-5'],
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-6', 'task-7'],
    },
  },
  columnOrder: ['todo', 'in-progress', 'review', 'done'],
};

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; sourceColId: TaskStatus; destColId: TaskStatus; newIndex: number } }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'UPDATE_SUBTASK'; payload: { taskId: string; subtaskId: string; completed: boolean } };

interface TaskContextProps {
  state: BoardState;
  dispatch: React.Dispatch<TaskAction>;
  searchTerm: string;
  filteredTasks: { [key: string]: Task };
  availableTags: TaskTag[];
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const taskReducer = (state: BoardState, action: TaskAction): BoardState => {
  switch (action.type) {
    case 'ADD_TASK': {
      const task = action.payload;
      // Add task to the specified column or 'todo' by default
      const column = state.columns[task.status];
      
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.id]: task,
        },
        columns: {
          ...state.columns,
          [task.status]: {
            ...column,
            taskIds: [...column.taskIds, task.id],
          },
        },
      };
    }
    
    case 'UPDATE_TASK': {
      const updatedTask = action.payload;
      const oldTask = state.tasks[updatedTask.id];
      
      // If status changed, we need to move the task between columns
      if (oldTask.status !== updatedTask.status) {
        const sourceColumn = state.columns[oldTask.status];
        const destColumn = state.columns[updatedTask.status];
        
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [updatedTask.id]: updatedTask,
          },
          columns: {
            ...state.columns,
            [oldTask.status]: {
              ...sourceColumn,
              taskIds: sourceColumn.taskIds.filter(id => id !== updatedTask.id),
            },
            [updatedTask.status]: {
              ...destColumn,
              taskIds: [...destColumn.taskIds, updatedTask.id],
            },
          },
        };
      }
      
      // If status didn't change, just update the task
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [updatedTask.id]: updatedTask,
        },
      };
    }
    
    case 'DELETE_TASK': {
      const taskId = action.payload;
      const task = state.tasks[taskId];
      const column = state.columns[task.status];
      
      // Create a copy of tasks without the deleted task
      const newTasks = { ...state.tasks };
      delete newTasks[taskId];
      
      return {
        ...state,
        tasks: newTasks,
        columns: {
          ...state.columns,
          [task.status]: {
            ...column,
            taskIds: column.taskIds.filter(id => id !== taskId),
          },
        },
      };
    }
    
    case 'MOVE_TASK': {
      const { taskId, sourceColId, destColId, newIndex } = action.payload;
      
      // If source and destination are the same
      if (sourceColId === destColId) {
        const column = state.columns[sourceColId];
        const newTaskIds = Array.from(column.taskIds);
        const oldIndex = newTaskIds.indexOf(taskId);
        
        // Remove task from its old position
        newTaskIds.splice(oldIndex, 1);
        // Insert task at new position
        newTaskIds.splice(newIndex, 0, taskId);
        
        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        };
      }
      
      // Moving between different columns
      const sourceColumn = state.columns[sourceColId];
      const destColumn = state.columns[destColId];
      
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(sourceTaskIds.indexOf(taskId), 1);
      
      const destinationTaskIds = Array.from(destColumn.taskIds);
      destinationTaskIds.splice(newIndex, 0, taskId);
      
      // Update the task's status and completion state
      const updatedTask = {
        ...state.tasks[taskId],
        status: destColId,
        updatedAt: new Date().toISOString(),
        // If moving to done, set completedAt, otherwise clear it
        completedAt: destColId === 'done' ? new Date().toISOString() : undefined,
      };
      
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: updatedTask,
        },
        columns: {
          ...state.columns,
          [sourceColId]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destColId]: {
            ...destColumn,
            taskIds: destinationTaskIds,
          },
        },
      };
    }
    
    case 'UPDATE_SUBTASK': {
      const { taskId, subtaskId, completed } = action.payload;
      const task = state.tasks[taskId];
      
      if (!task || !task.subtasks) return state;
      
      const updatedSubtasks = task.subtasks.map(subtask => 
        subtask.id === subtaskId
          ? { ...subtask, completed }
          : subtask
      );
      
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: new Date().toISOString(),
      };
      
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: updatedTask,
        },
      };
    }
    
    case 'SET_SEARCH_TERM':
      return state; // Search term is handled separately
      
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter tasks based on search term
  const filteredTasks = React.useMemo(() => {
    if (!searchTerm) return state.tasks;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    return Object.fromEntries(
      Object.entries(state.tasks).filter(([_, task]) => {
        return (
          task.title.toLowerCase().includes(lowercasedTerm) ||
          task.description.toLowerCase().includes(lowercasedTerm) ||
          task.tags.some(tag => tag.name.toLowerCase().includes(lowercasedTerm)) ||
          task.subtasks?.some(subtask => subtask.title.toLowerCase().includes(lowercasedTerm))
        );
      })
    );
  }, [state.tasks, searchTerm]);
  
  // Handle search term updates
  React.useEffect(() => {
    const handleSearchTermChange = (action: TaskAction) => {
      if (action.type === 'SET_SEARCH_TERM') {
        setSearchTerm(action.payload);
      }
    };
    
    handleSearchTermChange({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  }, [searchTerm]);
  
  return (
    <TaskContext.Provider value={{ 
      state, 
      dispatch, 
      searchTerm, 
      filteredTasks,
      availableTags: sampleTags
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
