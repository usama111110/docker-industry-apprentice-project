
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, TaskStatus } from '@/types/task';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import { getDueDateStatus } from '@/utils/taskUtils';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  onTaskClick?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskClick }) => {
  const { state, filteredTasks, dispatch } = useTaskContext();
  
  const tasks = Object.values(filteredTasks);
  
  const handleTaskStatusChange = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    
    const updatedTask = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: updatedTask
    });
  };
  
  // Prioritize tasks: high priority first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by priority (high -> medium -> low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then sort by due date (if present)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Tasks with due dates come before tasks without
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p className="mb-4">No tasks found matching your filters.</p>
        <Button
          variant="outline"
          onClick={() => dispatch({ type: 'SET_SEARCH_TERM', payload: '' })}
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => {
              const dueDateStatus = getDueDateStatus(task.dueDate);
              
              return (
                <TableRow 
                  key={task.id} 
                  className={`cursor-pointer hover:bg-muted/50 ${task.status === 'done' ? 'text-muted-foreground' : ''}`}
                  onClick={() => onTaskClick && onTaskClick(task.id)}
                >
                  <TableCell className="p-2">
                    <Checkbox
                      checked={task.status === 'done'}
                      onCheckedChange={() => handleTaskStatusChange(task)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={task.status === 'done' ? "Mark as incomplete" : "Mark as complete"}
                    />
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    <div className={task.status === 'done' ? 'line-through opacity-70' : ''}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={
                      task.priority === 'high' ? 'text-red-600 border-red-200 bg-red-50'
                      : task.priority === 'medium' ? 'text-amber-600 border-amber-200 bg-amber-50'
                      : 'text-blue-600 border-blue-200 bg-blue-50'
                    }>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag.id} 
                          className="text-xs px-1 py-0"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {task.dueDate ? (
                      <div className="flex items-center">
                        {dueDateStatus === 'overdue' && <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />}
                        {dueDateStatus === 'today' && <Clock className="h-3 w-3 text-amber-500 mr-1" />}
                        <span className={
                          dueDateStatus === 'overdue' ? 'text-red-500' :
                          dueDateStatus === 'today' ? 'text-amber-500' : ''
                        }>
                          {format(new Date(task.dueDate), 'MMM d')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No date</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={task.status === 'done' ? 'outline' : 'default'} className={
                      task.status === 'todo' ? 'bg-blue-500' :
                      task.status === 'in-progress' ? 'bg-amber-500' :
                      task.status === 'review' ? 'bg-purple-500' : ''
                    }>
                      {task.status === 'todo' ? 'To Do' :
                       task.status === 'in-progress' ? 'In Progress' :
                       task.status === 'review' ? 'Review' : 'Completed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskList;
