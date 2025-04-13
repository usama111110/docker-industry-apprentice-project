
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTaskStatistics } from '@/utils/taskUtils';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarClock, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const StatsPage = () => {
  const { state } = useTaskContext();
  const stats = getTaskStatistics(state);

  const COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981'];
  const PRIORITY_COLORS = ['#3B82F6', '#F59E0B', '#EF4444'];
  
  // Format data for status chart
  const statusData = Object.entries(stats.tasksByStatus).map(([status, count]) => ({
    name: status === 'todo' ? 'To Do' : 
          status === 'in-progress' ? 'In Progress' : 
          status === 'review' ? 'In Review' : 'Done',
    value: count
  }));
  
  // Format data for priority chart
  const priorityData = Object.entries(stats.tasksByPriority).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count
  }));

  // Create data for completed tasks over time
  const completedTasksData = state.columnOrder.map(status => ({
    name: status === 'todo' ? 'To Do' : 
          status === 'in-progress' ? 'In Progress' : 
          status === 'review' ? 'In Review' : 'Done',
    tasks: state.columns[status].taskIds.length
  }));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid gap-6">
          <h1 className="text-2xl font-bold">Task Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTasks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalTasks > 0 
                    ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate`
                    : 'No tasks yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{stats.dueSoonTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tasks due in the next 48 hours
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.overdueTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tasks past their due date
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Status</CardTitle>
                <CardDescription>Distribution of tasks across workflow stages</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
                <CardDescription>Distribution of tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Tasks">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Number of tasks in each workflow stage</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completedTasksData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="tasks" name="Tasks" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  Recently Completed Tasks
                </CardTitle>
                <CardDescription>Tasks completed in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentlyCompletedTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {stats.recentlyCompletedTasks.map(task => (
                      <li key={task.id} className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          {task.completedAt && format(new Date(task.completedAt), 'MMM d, h:mm a')}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No tasks completed in the last 7 days.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;
