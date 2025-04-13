
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4">
          <Dashboard />
        </main>
      </div>
    </TaskProvider>
  );
};

export default Index;
