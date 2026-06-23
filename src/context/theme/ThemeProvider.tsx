'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext } from './ThemeContext';

import type { Theme, ThemeContextValue } from './types';

interface ThemeProviderProps {
  children: ReactNode;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  return (localStorage.getItem('theme') as Theme) ?? 'light';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    localStorage.setItem('theme', theme);
  }, [theme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
