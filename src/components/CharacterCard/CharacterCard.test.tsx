import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CharacterCard } from './CharacterCard';
import { mockCharacters } from '../../test-utils/mocks';

describe('CharacterCard', () => {
  it('renders character name', () => {
    render(<CharacterCard {...mockCharacters[0]} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders species and gender', () => {
    render(<CharacterCard {...mockCharacters[0]} />);

    expect(screen.getByText(/human • male/i)).toBeInTheDocument();
  });

  it('renders status', () => {
    render(<CharacterCard {...mockCharacters[0]} />);

    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('renders origin and location', () => {
    render(<CharacterCard {...mockCharacters[0]} />);

    expect(screen.getByText('Earth')).toBeInTheDocument();

    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('renders episode count', () => {
    render(<CharacterCard {...mockCharacters[0]} />);

    expect(screen.getByText('2 appearances')).toBeInTheDocument();
  });

  describe('status styles', () => {
    it('renders alive status styles', () => {
      render(<CharacterCard {...mockCharacters[0]} />);

      const status = screen.getByText('Alive');

      expect(status).toHaveClass('bg-green-100');
      expect(status).toHaveClass('text-green-700');
      expect(status).toHaveClass('ring-green-200');
    });

    it('renders dead status styles', () => {
      render(<CharacterCard {...mockCharacters[0]} status="Dead" />);

      const status = screen.getByText('Dead');

      expect(status).toHaveClass('bg-red-100');
      expect(status).toHaveClass('text-red-700');
      expect(status).toHaveClass('ring-red-200');
    });

    it('renders unknown status styles', () => {
      render(<CharacterCard {...mockCharacters[0]} status="unknown" />);

      const status = screen.getByText('unknown');

      expect(status).toHaveClass('bg-gray-100');
      expect(status).toHaveClass('text-gray-600');
      expect(status).toHaveClass('ring-gray-200');
    });
  });
});
