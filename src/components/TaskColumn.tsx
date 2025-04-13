
import React from 'react';
import { Task, Column } from '@/types/task';
import TaskCard from './TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  index: number;
  onTaskClick: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ column, tasks, index, onTaskClick }) => {
  return (
    <div className="flex flex-col h-full min-h-[400px] w-[300px] bg-slate-50 rounded-md shadow">
      <div className="p-3 border-b font-medium flex justify-between items-center">
        <div className="flex items-center">
          <h3>{column.title}</h3>
          <span className="ml-2 bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
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
