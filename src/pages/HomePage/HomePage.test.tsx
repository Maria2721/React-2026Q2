import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import HomePage from './HomePage';
import { store } from '../../store/store';

import { useGetCharactersQuery } from '../../store/charactersApi';
import { mockCharacters } from '../../test-utils/mocks';

import * as router from 'react-router';

import type {
  SearchProps,
  ResultsProps,
  Character,
  PaginationProps,
} from '../../ts/interfaces';

vi.mock('../../store/charactersApi', async () => {
  const actual = await vi.importActual<
    typeof import('../../store/charactersApi')
  >('../../store/charactersApi');

  return {
    ...actual,
    useGetCharactersQuery: vi.fn(),
  };
});

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

const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

const setSearchParamsMock = vi.fn();
const navigateMock = vi.fn();

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

beforeEach(() => {
  vi.clearAllMocks();

  mockUseGetCharactersQuery.mockReturnValue(createQueryResult({}));

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
  it('renders page sections', () => {
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

  it('calls query hook with correct params', () => {
    renderPage();

    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      query: '',
      page: 1,
    });
  });

  it('passes fetched results to ResultsSection', () => {
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

  it('shows loading state', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        isLoading: true,
      })
    );

    renderPage();

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('handles query error', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        error: { status: 500 },
      })
    );

    renderPage();

    expect(screen.getByTestId('error')).toHaveTextContent(
      'Something went wrong. Try again.'
    );
  });

  it('updates input via SearchSection', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Change Search'));

    expect(screen.getByTestId('search-value')).toHaveTextContent('Rick');
  });

  it('triggers search and updates params', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText('Change Search'));
    await user.click(screen.getByText('Search'));

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      page: '1',
    });
  });

  it('does not trigger search if unchanged', async () => {
    renderPage();

    await userEvent.setup().click(screen.getByText('Search'));

    expect(setSearchParamsMock).not.toHaveBeenCalled();
  });

  it('renders pagination when results exist', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    expect(screen.getByTestId('page')).toHaveTextContent('1');

    expect(screen.getByTestId('total-pages')).toHaveTextContent('3');
  });

  it('handles next page click', async () => {
    const user = userEvent.setup();

    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        results: mockCharacters,
        pages: 3,
      })
    );

    renderPage();

    await user.click(
      screen.getByRole('button', {
        name: /next/i,
      })
    );

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      page: '2',
    });
  });
});
