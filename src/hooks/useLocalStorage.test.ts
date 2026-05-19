import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('search', ''));

    expect(result.current.value).toBe('');
  });

  it('reads value from localStorage on mount', () => {
    localStorage.setItem('search', JSON.stringify('Rick'));

    const { result } = renderHook(() => useLocalStorage('search', ''));

    expect(result.current.value).toBe('Rick');
  });

  it('writes value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.setValue('Morty');
    });

    expect(localStorage.getItem('search')).toBe(JSON.stringify('Morty'));
  });

  it('updates state after setValue', () => {
    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.setValue('Summer');
    });

    expect(result.current.value).toBe('Summer');
  });

  it('removes value from localStorage', () => {
    localStorage.setItem('search', JSON.stringify('Beth'));

    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.removeValue();
    });

    expect(localStorage.getItem('search')).toBeNull();
  });

  it('resets state to initialValue after removeValue', () => {
    localStorage.setItem('search', JSON.stringify('Jerry'));

    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe('');
  });

  it('returns initialValue if JSON.parse fails', () => {
    localStorage.setItem('search', 'invalid-json');

    const { result } = renderHook(() => useLocalStorage('search', 'fallback'));

    expect(result.current.value).toBe('fallback');
  });

  it('handles objects correctly', () => {
    const initialValue = {
      name: '',
      age: 0,
    };

    const { result } = renderHook(() => useLocalStorage('user', initialValue));

    act(() => {
      result.current.setValue({
        name: 'Rick',
        age: 70,
      });
    });

    expect(result.current.value).toEqual({
      name: 'Rick',
      age: 70,
    });

    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({
        name: 'Rick',
        age: 70,
      })
    );
  });

  it('handles setItem error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('setItem error');
    });

    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.setValue('Rick');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error writing to localStorage',
      expect.any(Error)
    );
  });

  it('handles removeItem error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem error');
    });

    const { result } = renderHook(() => useLocalStorage('search', ''));

    act(() => {
      result.current.removeValue();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error removing from localStorage',
      expect.any(Error)
    );
  });
});
