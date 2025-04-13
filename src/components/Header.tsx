
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  PlusCircle, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Moon, 
  Sun, 
  BarChart 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TaskDialog from './TaskDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { dispatch } = useTaskContext();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-background border-b px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary mr-8 flex items-center">
              <span className="bg-primary text-primary-foreground rounded p-1 mr-2 text-sm">TF</span>
              TaskFlow
            </Link>
            
            {!isMobile && (
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <div className={`flex items-center gap-4 ${isMobile ? 'flex-col absolute top-16 right-0 bg-background p-4 shadow-md rounded-md animate-fade-in border' : 'flex-row'}`}>
              {isMobile && (
                <div className="relative w-full mb-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              )}
              
              {/* Stats Link */}
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                className={location.pathname === '/stats' ? 'bg-accent' : ''}
                asChild
              >
                <Link to="/stats">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span className={`${isMobile ? '' : 'hidden md:inline'}`}>Stats</span>
                </Link>
              </Button>
              
              {/* Add Task Button */}
              <Button
                variant="default"
                size={isMobile ? "default" : "sm"}
                onClick={handleAddTask}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className={`${isMobile ? '' : 'hidden md:inline'}`}>New Task</span>
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground"
              >
                {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
