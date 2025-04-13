
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getTaskStatistics } from '@/utils/taskUtils';

const DashboardSummary: React.FC = () => {
  const { state } = useTaskContext();
  const stats = getTaskStatistics(state);
  
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTasks}</div>
          <Progress className="h-2 mt-2" value={completionRate} />
          <p className="text-xs text-muted-foreground mt-2">
            {completionRate}% complete
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Check className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.completedTasks}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {stats.tasksByStatus['done']} tasks done
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">{stats.dueSoonTasks}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Tasks due in the next 48 hours
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{stats.overdueTasks}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Tasks that need attention
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
