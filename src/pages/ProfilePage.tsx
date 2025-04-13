
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sun, Moon, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { userSettings, updateUserSettings } = useTheme();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>You need to be logged in to view this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full" onClick={logout}>
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Theme Preference</h3>
                  <RadioGroup 
                    defaultValue={userSettings.theme}
                    onValueChange={(value) => updateUserSettings({ theme: value as 'light' | 'dark' | 'system' })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center">
                        <Laptop className="h-4 w-4 mr-2" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Display Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Display tasks in a more compact layout
                      </p>
                    </div>
                    <Switch 
                      id="compact-view" 
                      checked={userSettings.compactView}
                      onCheckedChange={(checked) => updateUserSettings({ compactView: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-completed">Show Completed Tasks</Label>
                      <p className="text-sm text-muted-foreground">
                        Show completed tasks on the board
                      </p>
                    </div>
                    <Switch 
                      id="show-completed" 
                      checked={userSettings.showCompletedTasks}
                      onCheckedChange={(checked) => updateUserSettings({ showCompletedTasks: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">View Preferences</h3>
                  
                  <RadioGroup 
                    defaultValue={userSettings.defaultTaskView}
                    onValueChange={(value) => updateUserSettings({ defaultTaskView: value as 'board' | 'list' })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="board" id="default-board" />
                      <Label htmlFor="default-board">
                        Default to Board View
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="list" id="default-list" />
                      <Label htmlFor="default-list">
                        Default to List View
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for due dates and updates
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={userSettings.notifications}
                      onCheckedChange={(checked) => updateUserSettings({ notifications: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
