import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import HomePage from './HomePage';
import { store } from '../../store/store';

import {
  useGetCharactersQuery,
  charactersApi,
} from '../../store/charactersApi';

import { mockCharacters } from '../../test-utils/mocks';

import * as router from 'react-router';

import type {
  SearchProps,
  ResultsProps,
  Character,
  PaginationProps,
} from '../../ts/interfaces';

import type { NavigateFunction, SetURLSearchParams } from 'react-router';

// ---------------- RTK QUERY MOCK ----------------

vi.mock('../../store/charactersApi', async () => {
  const actual = await vi.importActual<
    typeof import('../../store/charactersApi')
  >('../../store/charactersApi');

  return {
    ...actual,
    useGetCharactersQuery: vi.fn(),
  };
});

const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

// ---------------- COMPONENT MOCKS ----------------

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

// ---------------- ROUTER MOCK ----------------

let mockSearchParams = new URLSearchParams('page=1');

const setSearchParamsMock: SetURLSearchParams = vi.fn();
const navigateMock: NavigateFunction = vi.fn();

vi.spyOn(router, 'useSearchParams').mockImplementation(() => [
  mockSearchParams,
  setSearchParamsMock,
]);

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock);

// ---------------- HELPERS ----------------

const createQueryResult = ({
  results = [],
  pages = 1,
  isLoading = false,
  error = undefined,
}: {
  results?: Character[];
  pages?: number;
  isLoading?: boolean;
  error?: unknown;
}) =>
  ({
    data: {
      results,
      pages,
    },
    isLoading,
    isFetching: false,
    error,
  }) as never;

const renderPage = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/?page=1']}>
        <HomePage />
      </MemoryRouter>
    </Provider>
  );

// ---------------- SETUP ----------------

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchParams = new URLSearchParams('page=1');

  mockUseGetCharactersQuery.mockReturnValue(createQueryResult({}));
  localStorage.clear();
});

// ---------------- TESTS ----------------

describe('HomePage', () => {
  it('renders main UI', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    expect(screen.getByText('HomeTitle')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('calls query with correct params', () => {
    renderPage();

    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      query: '',
      page: 1,
    });
  });

  it('renders results', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    expect(screen.getByTestId('results')).toHaveTextContent('Rick Sanchez');
    expect(screen.getByTestId('results')).toHaveTextContent('Morty Smith');
  });

  it('shows loading', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        isLoading: true,
      })
    );

    renderPage();

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('shows error message', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        error: { status: 500, data: {} },
      })
    );

    renderPage();

    expect(screen.getByTestId('error')).not.toHaveTextContent('no-error');
  });

  it('updates search input', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Change Search'));

    expect(screen.getByTestId('search-value')).toHaveTextContent('Rick');
  });

  it('triggers search', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Change Search'));
    await user.click(screen.getByText('Search'));

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      page: '1',
    });
  });

  it('does not search if unchanged', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Search'));

    expect(setSearchParamsMock).not.toHaveBeenCalled();
  });

  it('handles pagination next', async () => {
    const user = userEvent.setup();

    mockSearchParams = new URLSearchParams('page=1');

    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      page: '2',
    });
  });

  it('handles pagination prev', async () => {
    const user = userEvent.setup();

    mockSearchParams = new URLSearchParams('page=2');

    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      page: '1',
    });
  });

  it('navigates on select', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Select'));

    expect(navigateMock).toHaveBeenCalled();
  });

  it('invalidates cache on refresh', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(charactersApi.util, 'invalidateTags');

    renderPage();

    await user.click(screen.getByText(/refresh list/i));

    expect(spy).toHaveBeenCalledWith(['Characters']);
  });

  it('handles crash error', async () => {
    const user = userEvent.setup();

    renderPage();

    await expect(async () => {
      await user.click(screen.getByText(/test error/i));
    }).rejects.toThrow('Test error');
  });
});
