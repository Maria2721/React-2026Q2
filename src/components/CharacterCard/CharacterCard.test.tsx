import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CharacterCard } from './CharacterCard';
import { mockCharacters } from '../../test-utils/mocks';

describe('CharacterCard', () => {
  const mockOnSelect = vi.fn();

  it('renders character name', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders species and gender', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText(/human • male/i)).toBeInTheDocument();
  });

  it('renders status', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('renders origin and location', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Earth')).toBeInTheDocument();

    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('renders episode count', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('2 appearances')).toBeInTheDocument();
  });

  describe('status styles', () => {
    it('renders alive status styles', () => {
      render(
        <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
      );

      const status = screen.getByText('Alive');

      expect(status).toHaveClass('bg-green-100');
      expect(status).toHaveClass('text-green-700');
      expect(status).toHaveClass('ring-green-200');
    });

    it('renders dead status styles', () => {
      const deadCharacter = {
        ...mockCharacters[0],
        status: 'Dead',
      };

      render(
        <CharacterCard character={deadCharacter} onSelect={mockOnSelect} />
      );

      const status = screen.getByText('Dead');

      expect(status).toHaveClass('bg-red-100');
      expect(status).toHaveClass('text-red-700');
      expect(status).toHaveClass('ring-red-200');
    });

    it('renders unknown status styles', () => {
      const unknownCharacter = {
        ...mockCharacters[0],
        status: 'unknown',
      };

      render(
        <CharacterCard character={unknownCharacter} onSelect={mockOnSelect} />
      );

      const status = screen.getByText('unknown');

      expect(status).toHaveClass('bg-gray-100');
      expect(status).toHaveClass('text-gray-600');
      expect(status).toHaveClass('ring-gray-200');
    });
  });

  it('calls onSelect when card is clicked', () => {
    render(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    const card = screen.getByText('Rick Sanchez').closest('div');

    card?.click();

    expect(mockOnSelect).toHaveBeenCalledWith(mockCharacters[0].id);
  });
});
