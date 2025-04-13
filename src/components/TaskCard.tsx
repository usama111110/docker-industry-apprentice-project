
import React from 'react';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, Flag } from 'lucide-react';

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
  return (
    <Card 
      className="mb-2 cursor-pointer hover:shadow-md transition-shadow animate-fade-in" 
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm truncate">{task.title}</h3>
          
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {format(new Date(task.dueDate), 'MMM d')}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
