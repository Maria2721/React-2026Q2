import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import App from './App';
import { fetchCharacters } from './api/characters';
import { mockCharacter } from './test-utils/mocks';
import { storage } from './utils/storage';

vi.mock('./api/characters', () => ({
  fetchCharacters: vi.fn(),
}));
vi.mock('./utils/storage', () => ({
  storage: {
    getSearch: vi.fn(),
    setSearch: vi.fn(),
  },
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);
const mockedStorage = vi.mocked(storage);

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('calls fetchCharacters on mount', async () => {
    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    expect(mockedFetchCharacters).toHaveBeenCalled();

    await screen.findByRole('button', {
      name: /test error/i,
    });
  });

  it('shows loader while fetching data', () => {
    mockedFetchCharacters.mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders characters after successful fetch', async () => {
    mockedFetchCharacters.mockResolvedValue([mockCharacter]);

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows error message when api fails', async () => {
    mockedFetchCharacters.mockRejectedValue(new Error('API Error'));

    render(<App />);

    expect(
      await screen.findByText('Something went wrong. Try again.')
    ).toBeInTheDocument();
  });

  it('reads search from localStorage on mount', () => {
    mockedStorage.getSearch.mockReturnValue('Morty');

    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    expect(mockedStorage.getSearch).toHaveBeenCalled();
  });

  it('handles search flow (input + click + fetch)', async () => {
    const user = userEvent.setup();

    mockedStorage.getSearch.mockReturnValue('');
    mockedFetchCharacters.mockResolvedValue([mockCharacter]);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Rick');
    await user.click(button);

    expect(mockedStorage.setSearch).toHaveBeenCalledWith('Rick');
    expect(mockedFetchCharacters).toHaveBeenCalled();
  });

  it('does not fetch again if search is same as stored value', async () => {
    const user = userEvent.setup();

    mockedStorage.getSearch.mockReturnValue('Rick');
    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    mockedFetchCharacters.mockClear();

    const button = screen.getByRole('button', { name: /search/i });

    await user.click(button);

    expect(mockedFetchCharacters).not.toHaveBeenCalled();
  });
});
