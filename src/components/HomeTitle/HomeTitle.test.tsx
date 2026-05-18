import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomeTitle } from './HomeTitle';

describe('HomeTitle', () => {
  it('renders home title', () => {
    render(<HomeTitle />);

    expect(
      screen.getByText(/Rick & Morty Character Explorer/i)
    ).toBeInTheDocument();
  });

  it('renders home subtitle', () => {
    render(<HomeTitle />);

    expect(
      screen.getByText(/Find and explore characters instantly/i)
    ).toBeInTheDocument();
  });
});
