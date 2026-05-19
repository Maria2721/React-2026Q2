import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ResultsSection } from './ResultsSection';
import { mockCharacters } from '../../test-utils/mocks';

describe('ResultsSection', () => {
  const mockOnSelect = vi.fn();

  it('renders section title', () => {
    render(
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
      render(
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
      render(
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
      render(
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
      render(
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

    it('does not render empty state when results exist', () => {
      render(
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
      render(
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
      render(
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

    it('passes onSelect to CharacterCard', () => {
      render(
        <ResultsSection
          results={mockCharacters}
          loading={false}
          error=""
          onSelect={mockOnSelect}
        />
      );

      const cards = screen.getAllByText(/rick|morty/i);

      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
