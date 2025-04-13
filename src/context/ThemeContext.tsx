import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
export type ThemeType = 'light' | 'dark';

// Define theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  placeholder: string;
  disabled: string;
}

// Define light theme colors
const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#2196F3',
  background: '#ffffff',
  card: '#f5f5f5',
  text: '#333333',
  border: '#eeeeee',
  notification: '#FF6B6B',
  error: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  placeholder: '#999999',
  disabled: '#cccccc',
};

// Define dark theme colors
const darkColors: ThemeColors = {
  primary: '#66BB6A',
  secondary: '#42A5F5',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#333333',
  notification: '#FF6B6B',
  error: '#FF6B6B',
  success: '#66BB6A',
  warning: '#FFD54F',
  info: '#42A5F5',
  placeholder: '#777777',
  disabled: '#555555',
};

// Define theme context type
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Save theme to AsyncStorage when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };

    saveTheme();
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set theme directly
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  // Get colors based on current theme
  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 