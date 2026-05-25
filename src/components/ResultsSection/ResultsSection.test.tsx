import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ResultsSection } from './ResultsSection';

import { mockCharacters } from '../../test-utils/mocks';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('ResultsSection', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title', () => {
    renderWithProviders(
      <ResultsSection
        results={[]}
        loading={false}
        error=""
        onSelect={mockOnSelect}
      />
    );

    expect(
      screen.getByRole('heading', {
        name: /results/i,
      })
    ).toBeInTheDocument();
  });

  describe('states', () => {
    it('renders loader when loading', () => {
      renderWithProviders(
        <ResultsSection
          results={[]}
          loading={true}
          error=""
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('renders error message', () => {
      renderWithProviders(
        <ResultsSection
          results={[]}
          loading={false}
          error="Something went wrong"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('renders empty state message', () => {
      renderWithProviders(
        <ResultsSection
          results={[]}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  describe('results rendering', () => {
    it('renders character cards', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();

      expect(screen.getByText('Morty Smith')).toBeInTheDocument();

      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    });

    it('renders selection buttons for each character', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      const buttons = screen.getAllByRole('button', {
        name: /select/i,
      });

      expect(buttons).toHaveLength(2);
    });

    it('does not render empty state when results exist', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
    });

    it('does not render results while loading', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={true}
          error=""
          onSelect={mockOnSelect}
        />
      );

      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('does not render results when error exists', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error="Server error"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();

      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });

    it('renders all character names', () => {
      renderWithProviders(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      mockCharacters.forEach((character) => {
        expect(screen.getByText(character.name)).toBeInTheDocument();
      });
    });
  });
});
