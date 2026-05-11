import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import App from './App';
import { fetchCharacters } from './api/characters';
import { mockCharacters } from './test-utils/mocks';
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

  it('renders characters after successful fetch', async () => {
    mockedFetchCharacters.mockResolvedValue(mockCharacters);

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('reads search from localStorage on mount', async () => {
    mockedStorage.getSearch.mockReturnValue('Morty');

    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(mockedStorage.getSearch).toHaveBeenCalled();
    });
  });

  it('handles search flow (input + click + fetch)', async () => {
    const user = userEvent.setup();

    mockedStorage.getSearch.mockReturnValue('');
    mockedFetchCharacters.mockResolvedValue(mockCharacters);

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
