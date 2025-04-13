
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome to TaskFlow!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card className="shadow-lg border-taskBlue-100 animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-taskBlue-700">TaskFlow</CardTitle>
          <CardDescription>
            Enter your credentials to access your tasks
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-taskBlue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <CardFooter className="pt-4 pb-0 px-0 flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-taskBlue-600 hover:bg-taskBlue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              
              <p className="text-xs text-center mt-4 text-gray-500">
                Demo credentials: any email, password: at least 6 characters
              </p>
            </CardFooter>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
