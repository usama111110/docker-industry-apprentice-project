
import React from 'react';
import { Task, Column } from '@/types/task';
import TaskCard from './TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  index: number;
  onTaskClick: (taskId: string) => void;
  onAddTask?: (status: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ column, tasks, index, onTaskClick, onAddTask }) => {
  return (
    <div className="flex flex-col h-full min-h-[400px] w-[300px] bg-card rounded-md shadow-sm border">
      <div className="p-3 border-b font-medium flex justify-between items-center">
        <div className="flex items-center">
          <h3>{column.title}</h3>
          <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        {onAddTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-accent/50' : ''
            }`}
          >
            {tasks.length === 0 && (
              <div className="flex h-20 items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md">
                {column.id === 'todo' ? 'Add tasks to get started' : 'Drag tasks here'}
              </div>
            )}
            
            {tasks.map((task, taskIndex) => (
              <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? '0.8' : '1',
                    }}
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
