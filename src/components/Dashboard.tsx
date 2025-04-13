
import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import TaskList from './TaskList';
import TaskFilterBar from './TaskFilterBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSummary from './DashboardSummary';
import { useTheme } from '@/context/ThemeContext';

const Dashboard: React.FC = () => {
  const { userSettings } = useTheme();
  const [activeView, setActiveView] = useState<'board' | 'list'>(userSettings.defaultTaskView);

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      <DashboardSummary />
      
      <TaskFilterBar />
      
      <Tabs defaultValue={activeView} onValueChange={(value) => setActiveView(value as 'board' | 'list')} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="board" className="mt-0">
          <TaskBoard />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <TaskList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
