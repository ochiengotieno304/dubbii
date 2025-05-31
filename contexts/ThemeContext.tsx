import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const applyThemeClasses = useCallback((currentResolvedTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove all theme-related classes first to prevent conflicts
    root.classList.remove('dark', 'light');
    body.classList.remove(
        'bg-base-100', 'text-base-content', // Light mode classes from tailwind.config
        'dark:bg-slate-800', 'dark:text-gray-100' // Potential explicit dark mode body classes if needed
    );
    // Clean up any other explicit theme bg/text classes if they were added previously
    body.className = body.className.replace(/\bbg-\S+\b/g, '').replace(/\btext-\S+\b/g, '').replace(/\bdark:bg-\S+\b/g, '').replace(/\bdark:text-\S+\b/g, '').trim();


    if (currentResolvedTheme === 'dark') {
      root.classList.add('dark');
      // For dark mode, Tailwind's `dark:` variants will take over.
      // We ensure the body has base dark classes if specific overrides are desired beyond `dark:bg-base-100`
      // For now, relying on `dark:bg-base-100` (which becomes `dark:bg-slate-800` effectively based on previous config)
      // and `dark:text-base-content` (which becomes `dark:text-gray-100`).
      // If body needs different dark theme than other `dark:bg-base-100` elements, add explicit classes here.
      // e.g., body.classList.add('bg-slate-900', 'text-slate-200');
      body.classList.add('bg-slate-800', 'text-gray-100'); // Explicit for body dark to ensure it overrides potential cascade
    } else {
      root.classList.add('light');
      // Apply light mode base classes defined in tailwind.config
      body.classList.add('bg-base-100', 'text-base-content');
    }

    setResolvedTheme(currentResolvedTheme);
  }, []);

  const updateTheme = useCallback((newThemeChoice: Theme) => {
    let newResolvedTheme: 'light' | 'dark';
    if (newThemeChoice === 'system') {
      newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      newResolvedTheme = newThemeChoice;
    }
    applyThemeClasses(newResolvedTheme);
  }, [applyThemeClasses]);

  useEffect(() => {
    updateTheme(theme);
  }, [theme, updateTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  // Initial setup on mount
  useEffect(() => {
    let initialResolved: 'light' | 'dark';
    const storedTheme = localStorage.getItem('theme') as Theme | null;

    if (storedTheme && storedTheme !== 'system') {
        initialResolved = storedTheme;
    } else {
        initialResolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    applyThemeClasses(initialResolved);
    if(storedTheme) setThemeState(storedTheme); // set internal state if theme was stored
    else setThemeState('system');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};