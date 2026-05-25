import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import HomePage from './HomePage';
import { store } from '../../store/store';

import { fetchCharacters } from '../../api/characters';
import { mockCharacters } from '../../test-utils/mocks';

import * as router from 'react-router';

import type {
  SearchProps,
  ResultsProps,
  Character,
  PaginationProps,
} from '../../ts/interfaces';

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
  ResultsSection: ({ results, loading, error, onSelect }: ResultsProps) => (
    <div>
      <div data-testid="results">
        {results.map((r: Character) => r.name).join(', ')}
      </div>

      <div data-testid="loading">{loading ? 'loading' : 'idle'}</div>
      <div data-testid="error">{error ?? 'no-error'}</div>

      <button onClick={() => onSelect(1)}>Select</button>
    </div>
  ),
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  Pagination: ({ page, totalPages, onPrev, onNext }: PaginationProps) => (
    <div>
      <div data-testid="page">{page}</div>
      <div data-testid="total-pages">{totalPages}</div>

      <button onClick={onPrev}>Prev</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/SelectedFlyout/SelectedFlyout', () => ({
  SelectedFlyout: () => <div>Flyout</div>,
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();

  return {
    ...actual,
  };
});

const setSearchParamsMock = vi.fn();
const navigateMock = vi.fn();

const renderPage = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/?page=1']}>
        <HomePage />
      </MemoryRouter>
    </Provider>
  );

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(router, 'useSearchParams').mockReturnValue([
    new URLSearchParams('page=1'),
    setSearchParamsMock,
  ] as ReturnType<typeof router.useSearchParams>);

  vi.spyOn(router, 'useNavigate').mockReturnValue(
    navigateMock as ReturnType<typeof router.useNavigate>
  );

  localStorage.clear();
});

describe('HomePage', () => {
  it('renders page sections', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    expect(await screen.findByText('HomeTitle')).toBeInTheDocument();
    expect(await screen.findByTestId('results')).toBeInTheDocument();
  });

  it('fetches characters on mount with correct args', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith('', 1);
    });
  });

  it('passes fetched results to ResultsSection', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    expect(await screen.findByTestId('results')).toHaveTextContent(
      'Rick Sanchez'
    );

    expect(await screen.findByTestId('results')).toHaveTextContent(
      'Morty Smith'
    );
  });

  it('handles fetch error', async () => {
    vi.mocked(fetchCharacters).mockRejectedValue(new Error('API Error'));

    renderPage();

    expect(
      await screen.findByText('Something went wrong. Try again.')
    ).toBeInTheDocument();
  });

  it('updates input via SearchSection', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacters).mockResolvedValue({
      results: [],
      pages: 1,
    });

    renderPage();

    await user.click(screen.getByText('Change Search'));

    expect(screen.getByTestId('search-value')).toHaveTextContent('Rick');
  });

  it('triggers search and updates params', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    await user.click(screen.getByText('Change Search'));
    await user.click(screen.getByText('Search'));

    expect(setSearchParamsMock).toHaveBeenCalledWith({ page: '1' });
  });

  it('does not trigger search if unchanged', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: [],
      pages: 1,
    });

    renderPage();

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledTimes(1);
    });

    setSearchParamsMock.mockClear();

    await userEvent.setup().click(screen.getByText('Search'));

    expect(setSearchParamsMock).not.toHaveBeenCalled();
  });

  it('renders pagination when results exist', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    expect(await screen.findByTestId('page')).toHaveTextContent('1');
    expect(await screen.findByTestId('total-pages')).toHaveTextContent('3');
  });

  it('handles next page click', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacters).mockResolvedValue({
      results: mockCharacters,
      pages: 3,
    });

    renderPage();

    const nextButton = await screen.findByRole('button', { name: /next/i });

    await user.click(nextButton);

    await waitFor(() => {
      expect(setSearchParamsMock).toHaveBeenCalledWith({
        page: '2',
      });
    });
  });
});
