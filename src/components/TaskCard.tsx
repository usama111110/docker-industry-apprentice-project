
import React from 'react';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckSquare, Clock, Flag, ListChecks } from 'lucide-react';
import { getDueDateStatus } from '@/utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800'
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : 'none';
  
  // Calculate subtask completion
  const completedSubtasks = task.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const hasSubtasks = totalSubtasks > 0;

  return (
    <Card 
      className="mb-2 cursor-pointer hover:shadow-md transition-shadow animate-fade-in" 
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm truncate">{task.title}</h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          
          {/* Subtasks progress */}
          {hasSubtasks && (
            <div className="flex items-center text-xs text-muted-foreground">
              <ListChecks className="h-3 w-3 mr-1" />
              <span>
                {completedSubtasks}/{totalSubtasks} completed
              </span>
            </div>
          )}
          
          {/* Due date with status-based styling */}
          {task.dueDate && (
            <div className="flex items-center text-xs">
              <Clock className={`h-3 w-3 mr-1 ${
                dueDateStatus === 'overdue' ? 'text-red-500' : 
                dueDateStatus === 'today' ? 'text-amber-500' : 
                'text-muted-foreground'
              }`} />
              <span className={
                dueDateStatus === 'overdue' ? 'text-red-500' : 
                dueDateStatus === 'today' ? 'text-amber-500' : 
                'text-muted-foreground'
              }>
                {format(new Date(task.dueDate), 'MMM d')}
                {dueDateStatus === 'overdue' && ' (overdue)'}
                {dueDateStatus === 'today' && ' (today)'}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 mt-1 max-w-[70%]">
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
            
            <Badge 
              variant="outline" 
              className={`text-xs flex items-center gap-1 ${priorityColors[task.priority]}`}
            >
              <Flag className="h-3 w-3" /> 
              {task.priority}
            </Badge>
          </div>
          
          {/* Show completed mark if the task is done */}
          {task.status === 'done' && (
            <div className="absolute top-2 right-2">
              <CheckSquare className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
