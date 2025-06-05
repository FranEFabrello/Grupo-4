import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme() || 'light';
  const [theme, setTheme] = useState('system');
  const [colorScheme, setColorScheme] = useState(systemScheme);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setColorScheme(colorScheme || 'light');
      }
    });
    return () => listener.remove();
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(systemScheme);
    } else {
      setColorScheme(theme);
    }
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};