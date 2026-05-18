import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from './HomePage';

import { fetchCharacters } from '../../api/characters';

import { mockCharacters } from '../../test-utils/mocks';

import type { SearchProps, ResultsProps } from '../../ts/interfaces';

vi.mock('../../api/characters', () => ({
  fetchCharacters: vi.fn(),
}));

vi.mock('../../components/HomeTitle/HomeTitle', () => ({
  HomeTitle: () => <div>HomeTitle</div>,
}));

vi.mock('../../components/SearchSection/SearchSection', () => ({
  SearchSection: ({ value, onChange, onSearch }: SearchProps) => (
    <div>
      <div data-testid="search-value">{value}</div>

      <button onClick={() => onChange('Rick')}>Change Search</button>

      <button onClick={onSearch}>Search</button>
    </div>
  ),
}));

vi.mock('../../components/ResultsSection/ResultsSection', () => ({
  ResultsSection: ({ results, loading, error }: ResultsProps) => (
    <div>
      <div data-testid="results">{JSON.stringify(results)}</div>

      <div data-testid="loading">{loading ? 'loading' : 'idle'}</div>

      <div data-testid="error">{error ?? 'no-error'}</div>
    </div>
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders page sections', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacters);

    render(<HomePage />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalled();
    });

    expect(screen.getByText('HomeTitle')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('fetches characters on mount', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacters);

    render(<HomePage />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith('');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
  });

  it('passes fetched results to ResultsSection', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacters);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('results')).toHaveTextContent('Rick Sanchez');
    });

    expect(screen.getByTestId('results')).toHaveTextContent('Morty Smith');
  });

  it('handles fetch error', async () => {
    vi.mocked(fetchCharacters).mockRejectedValue(new Error('API Error'));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Something went wrong. Try again.'
      );
    });
  });

  it('updates input value via SearchSection', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByText('Change Search'));

    expect(screen.getByTestId('search-value')).toHaveTextContent('Rick');
  });

  it('saves search query to localStorage', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByText('Change Search'));
    await user.click(screen.getByText('Search'));

    expect(localStorage.getItem('search')).toBe(JSON.stringify('Rick'));
  });

  it('does not update localStorage if value unchanged', async () => {
    const user = userEvent.setup();

    localStorage.setItem('search', JSON.stringify('Rick'));

    render(<HomePage />);

    await user.click(screen.getByText('Search'));

    expect(localStorage.getItem('search')).toBe(JSON.stringify('Rick'));
  });
});
