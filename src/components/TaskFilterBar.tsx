
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Check, ChevronDown, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskPriority } from '@/types/task';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from '@/components/ui/badge';

const TaskFilterBar = () => {
  const { searchTerm, dispatch, availableTags } = useTaskContext();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueFilter, setDueFilter] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  const togglePriority = (priority: TaskPriority) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  const clearFilters = () => {
    setSelectedPriorities([]);
    setSelectedTags([]);
    setDueFilter(null);
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
  };

  const applyFilters = () => {
    // In a real app, this would dispatch a more complex filter action
    // For now, we're just using the search term
    setFilterOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-grow">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
        {searchTerm && (
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => dispatch({ type: 'SET_SEARCH_TERM', payload: '' })}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {(selectedPriorities.length > 0 || selectedTags.length > 0 || dueFilter) && (
              <Badge variant="secondary" className="ml-1">
                {selectedPriorities.length + selectedTags.length + (dueFilter ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup heading="Priority">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                  <CommandItem
                    key={priority}
                    onSelect={() => togglePriority(priority)}
                    className="gap-2 capitalize"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      priority === 'low' ? 'bg-blue-500' : 
                      priority === 'medium' ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`} />
                    {priority}
                    {selectedPriorities.includes(priority) && <Check className="h-4 w-4 ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Due Date">
                {[
                  { id: 'today', label: 'Due Today' },
                  { id: 'this-week', label: 'Due This Week' },
                  { id: 'overdue', label: 'Overdue' },
                  { id: 'no-date', label: 'No Due Date' }
                ].map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => setDueFilter(dueFilter === option.id ? null : option.id)}
                  >
                    {option.label}
                    {dueFilter === option.id && <Check className="h-4 w-4 ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Tags">
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => toggleTag(tag.id)}
                    className="gap-2"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                    {selectedTags.includes(tag.id) && <Check className="h-4 w-4 ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            
            <div className="border-t p-2 flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={clearFilters}>
                Reset
              </Button>
              <Button size="sm" className="flex-1" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskFilterBar;
