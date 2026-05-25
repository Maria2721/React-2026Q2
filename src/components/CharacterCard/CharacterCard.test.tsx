import { fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CharacterCard } from './CharacterCard';

import { mockCharacters } from '../../test-utils/mocks';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('CharacterCard', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders character name', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders species and gender', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText(/human • male/i)).toBeInTheDocument();
  });

  it('renders status', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('renders origin and location', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Earth')).toBeInTheDocument();

    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('renders episode count', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('2 appearances')).toBeInTheDocument();
  });

  it('renders selection button', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    expect(
      screen.getByRole('button', {
        name: /select rick sanchez/i,
      })
    ).toBeInTheDocument();
  });

  describe('status styles', () => {
    it('renders alive status styles', () => {
      renderWithProviders(
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

      renderWithProviders(
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

      renderWithProviders(
        <CharacterCard character={unknownCharacter} onSelect={mockOnSelect} />
      );

      const status = screen.getByText('unknown');

      expect(status).toHaveClass('bg-gray-100');
      expect(status).toHaveClass('text-gray-600');
      expect(status).toHaveClass('ring-gray-200');
    });
  });

  it('calls onSelect when card is clicked', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    const card = screen.getByText('Rick Sanchez').closest('div');

    fireEvent.click(card!);

    expect(mockOnSelect).toHaveBeenCalledWith(mockCharacters[0].id);
  });

  it('does not call onSelect when selection button is clicked', () => {
    renderWithProviders(
      <CharacterCard character={mockCharacters[0]} onSelect={mockOnSelect} />
    );

    const selectButton = screen.getByRole('button', {
      name: /select rick sanchez/i,
    });

    fireEvent.click(selectButton);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});
