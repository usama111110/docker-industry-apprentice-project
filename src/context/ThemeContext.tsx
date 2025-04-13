
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSettings } from '@/types/task';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  compactView: false,
  showCompletedTasks: true,
  defaultTaskView: 'board',
  notifications: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [theme, setTheme] = useState<Theme>(userSettings.theme);
  
  // Effect to apply the theme class to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Apply current theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  // Effect to save user settings to localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);
  
  // Listen to system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme) {
        setTheme(newSettings.theme);
      }
      return updated;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, userSettings, updateUserSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
