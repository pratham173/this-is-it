import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ThemeConfig, AccentColor } from '../types';
import { saveSetting, getSetting } from '../services/offlineStorage';

interface ThemeContextValue {
  theme: ThemeConfig;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const ACCENT_COLORS: AccentColor[] = ['rose', 'blue', 'purple', 'green', 'orange', 'cyan'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'system',
    accentColor: 'rose',
  });

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await getSetting('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        applyTheme(theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      applyTheme(theme);
    }
  };

  const applyTheme = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    
    // Determine actual theme mode
    let actualMode = themeConfig.mode;
    if (themeConfig.mode === 'system') {
      actualMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme mode
    root.setAttribute('data-theme', actualMode);
    if (actualMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply accent color
    root.setAttribute('data-accent', themeConfig.accentColor);
  };

  const setThemeMode = useCallback(async (mode: 'light' | 'dark' | 'system') => {
    const newTheme = { ...theme, mode };
    setTheme(newTheme);
    applyTheme(newTheme);
    await saveSetting('theme', newTheme);
  }, [theme]);

  const setAccentColor = useCallback(async (color: AccentColor) => {
    const newTheme = { ...theme, accentColor: color };
    setTheme(newTheme);
    applyTheme(newTheme);
    await saveSetting('theme', newTheme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    let newMode: 'light' | 'dark' | 'system';
    if (theme.mode === 'system') {
      newMode = 'light';
    } else if (theme.mode === 'light') {
      newMode = 'dark';
    } else {
      newMode = 'system';
    }
    setThemeMode(newMode);
  }, [theme.mode, setThemeMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme(theme);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setThemeMode,
    setAccentColor,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export { ACCENT_COLORS };
