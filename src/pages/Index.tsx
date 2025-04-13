
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import LoginForm from '@/components/LoginForm';
import TaskBoard from '@/components/TaskBoard';
import Header from '@/components/Header';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="container mx-auto">
          <TaskBoard />
        </main>
      </div>
    </TaskProvider>
  );
};

export default Index;
