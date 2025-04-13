
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Search, LogOut, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TaskDialog from './TaskDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { dispatch } = useTaskContext();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch({ type: 'SET_SEARCH_TERM', payload: value });
  };

  const handleAddTask = () => {
    setIsTaskDialogOpen(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-taskBlue-700 mr-8">TaskFlow</h1>
            
            {!isMobile && (
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            )}
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          {(!isMobile || isMenuOpen) && (
            <div className={`flex items-center gap-4 ${isMobile ? 'flex-col absolute top-16 right-0 bg-white p-4 shadow-md rounded-md animate-fade-in' : 'flex-row'}`}>
              {isMobile && (
                <div className="relative w-full mb-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              )}
              
              <Button
                variant="default"
                size={isMobile ? "default" : "sm"}
                className="bg-taskBlue-600 hover:bg-taskBlue-700"
                onClick={handleAddTask}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <TaskDialog
        taskId={null}
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
      />
    </header>
  );
};

export default Header;
