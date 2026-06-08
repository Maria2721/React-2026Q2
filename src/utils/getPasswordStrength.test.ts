import { describe, it, expect } from 'vitest';
import { getPasswordStrength } from './getPasswordStrength';

describe('getPasswordStrength', () => {
  it('returns empty string for empty password', () => {
    expect(getPasswordStrength('')).toBe('');
  });

  it('returns Weak for low complexity passwords', () => {
    expect(getPasswordStrength('a')).toBe('Weak');
    expect(getPasswordStrength('1')).toBe('Weak');
    expect(getPasswordStrength('!')).toBe('Weak');
  });

  it('returns Medium for moderate complexity passwords', () => {
    expect(getPasswordStrength('aA')).toBe('Medium');
    expect(getPasswordStrength('a1')).toBe('Medium');
    expect(getPasswordStrength('A1')).toBe('Medium');
    expect(getPasswordStrength('a!')).toBe('Medium');
  });

  it('returns Strong for complex passwords', () => {
    expect(getPasswordStrength('aA1!')).toBe('Strong');
    expect(getPasswordStrength('Password1!')).toBe('Strong');
    expect(getPasswordStrength('Abc123$')).toBe('Strong');
  });
});
