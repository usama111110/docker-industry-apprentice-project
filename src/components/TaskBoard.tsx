
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { useTaskContext } from '@/context/TaskContext';
import TaskDialog from './TaskDialog';
import { useTheme } from '@/context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

const TaskBoard: React.FC = () => {
  const { state, dispatch, filteredTasks } = useTaskContext();
  const { userSettings } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped at the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch({
      type: 'MOVE_TASK',
      payload: {
        taskId: draggableId,
        sourceColId: source.droppableId as any,
        destColId: destination.droppableId as any,
        newIndex: destination.index,
      },
    });
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setIsTaskDialogOpen(false);
    setSelectedTaskId(null);
  };
  
  const handleAddTask = (status: string) => {
    const newTaskId = uuidv4();
    setSelectedTaskId(null); // This will create a new task
    setIsTaskDialogOpen(true);
  };

  const getFilteredTasksForColumn = (columnId: string) => {
    // If user has chosen to hide completed tasks and this is the done column
    if (!userSettings.showCompletedTasks && columnId === 'done') {
      return [];
    }
    
    return state.columns[columnId].taskIds
      .filter(taskId => filteredTasks[taskId])
      .map(taskId => filteredTasks[taskId]);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto p-2 pb-6 min-h-[calc(100vh-350px)]">
          {state.columnOrder.map((columnId, index) => {
            const column = state.columns[columnId];
            const tasks = getFilteredTasksForColumn(columnId);

            return (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasks}
                index={index}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            );
          })}
        </div>
      </DragDropContext>

      <TaskDialog
        taskId={selectedTaskId}
        isOpen={isTaskDialogOpen}
        onClose={handleTaskDialogClose}
      />
    </>
  );
};

export default TaskBoard;
