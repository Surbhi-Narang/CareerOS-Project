import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Theme Context
const ThemeContext = createContext();

// 2. Custom hook to use theme anywhere in the app
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 3. Theme Provider component
export function ThemeProvider({ children }) {
  // Check localStorage for saved theme, default to 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('career_os_theme');
      return savedTheme === 'dark' ? 'dark' : 'light';
    } catch (err) {
      return 'light';
    }
  });

  // Whenever theme changes, update <html> attribute and save to localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('career_os_theme', theme);
    } catch (err) {
      console.error('Failed to save theme to localStorage', err);
    }
  }, [theme]);

  // Function to switch between light and dark modes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
