import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string if nothing stored', () => {
    expect(storage.getSearch()).toBe('');
  });

  it('saves search value to localStorage', () => {
    storage.setSearch('Rick');

    expect(localStorage.getItem('search')).toBe('Rick');
  });

  it('reads saved search value', () => {
    localStorage.setItem('search', 'Morty');

    expect(storage.getSearch()).toBe('Morty');
  });
});
