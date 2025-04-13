
import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, Subtask } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskDialogProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ taskId, isOpen, onClose }) => {
  const { state, dispatch, availableTags } = useTaskContext();
  
  const emptyTask: Task = {
    id: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    createdAt: '',
    updatedAt: '',
    subtasks: [],
  };
  
  const [formData, setFormData] = useState<Task>(emptyTask);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newSubtask, setNewSubtask] = useState('');
  
  const isNewTask = !taskId;
  
  // Load task data when dialog opens
  useEffect(() => {
    if (isOpen && taskId && state.tasks[taskId]) {
      setFormData(state.tasks[taskId]);
      if (state.tasks[taskId].dueDate) {
        setSelectedDate(new Date(state.tasks[taskId].dueDate));
      } else {
        setSelectedDate(undefined);
      }
    } else if (isOpen && !taskId) {
      // Create new task
      setFormData({
        ...emptyTask,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
      });
      setSelectedDate(undefined);
    }
  }, [isOpen, taskId, state.tasks]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagToggle = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;
    
    setFormData(prev => {
      const isSelected = prev.tags.some(t => t.id === tagId);
      
      if (isSelected) {
        return { ...prev, tags: prev.tags.filter(t => t.id !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString() : undefined,
    }));
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask: Subtask = {
      id: uuidv4(),
      title: newSubtask,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setFormData(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), subtask],
    }));
    
    setNewSubtask('');
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks?.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed } 
          : subtask
      ),
    }));
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter(subtask => subtask.id !== subtaskId),
    }));
  };
  
  const handleSubmit = () => {
    const now = new Date().toISOString();
    const updatedTask: Task = {
      ...formData,
      updatedAt: now,
    };
    
    // If status is changed to 'done', set completedAt
    if (updatedTask.status === 'done' && !updatedTask.completedAt) {
      updatedTask.completedAt = now;
    } else if (updatedTask.status !== 'done') {
      updatedTask.completedAt = undefined;
    }
    
    if (isNewTask) {
      dispatch({ type: 'ADD_TASK', payload: updatedTask });
    } else {
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (!isNewTask && taskId) {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNewTask ? 'Add New Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Task title"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Task description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={formData.tags.some(t => t.id === tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  style={
                    formData.tags.some(t => t.id === tag.id)
                      ? { backgroundColor: tag.color, color: 'white' }
                      : { borderColor: tag.color, color: tag.color }
                  }
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subtasks section */}
          <div className="grid gap-2 mt-2">
            <Label>Subtasks</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <Button variant="outline" size="icon" onClick={handleAddSubtask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {formData.subtasks && formData.subtasks.length > 0 ? (
                <div className="rounded-md border divide-y">
                  {formData.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 p-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                        id={`subtask-${subtask.id}`}
                      />
                      <Label
                        htmlFor={`subtask-${subtask.id}`}
                        className={`flex-grow text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {subtask.title}
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveSubtask(subtask.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No subtasks yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          {!isNewTask && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isNewTask ? 'Create Task' : 'Update Task'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
