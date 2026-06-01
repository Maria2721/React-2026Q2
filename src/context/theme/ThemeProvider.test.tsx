import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <span>{theme}</span>

      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('uses light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('loads dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  it('toggles theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  it('toggles theme from dark to light', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('adds dark class to html element', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('saves theme to localStorage after toggle', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
