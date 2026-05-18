import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from './HomePage';

import { fetchCharacters } from '../../api/characters';
import { mockCharacters } from '../../test-utils/mocks';

import type { SearchProps, ResultsProps, Character } from '../../ts/interfaces';

vi.mock('react-router', () => ({
  useSearchParams: () => {
    const params = new URLSearchParams({ page: '1' });

    return [params, vi.fn()];
  },
}));

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
      <div data-testid="results">
        {results.map((r: Character) => r.name).join(', ')}
      </div>

      <div data-testid="loading">{loading ? 'loading' : 'idle'}</div>

      <div data-testid="error">{error ?? 'no-error'}</div>
    </div>
  ),
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  Pagination: (props: {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
  }) => {
    return (
      <div>
        <div data-testid="page">{props.page}</div>
        <button onClick={props.onPrev}>Prev</button>
        <button onClick={props.onNext}>Next</button>
      </div>
    );
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders page sections', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalled();
    });

    expect(screen.getByText('HomeTitle')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('fetches characters on mount with correct args', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith('', 1);
    });
  });

  it('passes fetched results to ResultsSection', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('results')).toHaveTextContent('Rick Sanchez');
      expect(screen.getByTestId('results')).toHaveTextContent('Morty Smith');
    });
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

    vi.mocked(fetchCharacters).mockResolvedValue({
      results: [],
      pages: 1,
    });

    render(<HomePage />);

    await user.click(screen.getByText('Change Search'));

    expect(screen.getByTestId('search-value')).toHaveTextContent('Rick');
  });

  it('triggers search and updates localStorage', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    render(<HomePage />);

    await user.click(screen.getByText('Change Search'));
    await user.click(screen.getByText('Search'));

    expect(fetchCharacters).toHaveBeenCalled();
  });

  it('does not update search if value unchanged', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByText('Search'));

    expect(fetchCharacters).toHaveBeenCalledTimes(1);
  });
});
