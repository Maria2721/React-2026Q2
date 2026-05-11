import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders main title', () => {
    render(<Header />);

    expect(screen.getByText('🔍 Search Explorer')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Header />);

    expect(
      screen.getByText('Find and explore items instantly')
    ).toBeInTheDocument();
  });
});
