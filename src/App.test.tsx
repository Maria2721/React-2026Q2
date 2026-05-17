import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import App from './App';
import { fetchCharacters } from './api/characters';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockCharacters } from './test-utils/mocks';

vi.mock('./api/characters', () => ({
  fetchCharacters: vi.fn(),
}));

vi.mock('./hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);
const mockedUseLocalStorage = vi.mocked(useLocalStorage);

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseLocalStorage.mockReturnValue({
      value: '',
      setValue: vi.fn(),
      removeValue: vi.fn(),
    });
  });

  it('calls fetchCharacters on mount', async () => {
    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    expect(mockedFetchCharacters).toHaveBeenCalledWith('');

    await screen.findByRole('button', {
      name: /test error/i,
    });
  });

  it('renders characters after successful fetch', async () => {
    mockedFetchCharacters.mockResolvedValue(mockCharacters);

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('reads search query from useLocalStorage', async () => {
    mockedUseLocalStorage.mockReturnValue({
      value: 'Morty',
      setValue: vi.fn(),
      removeValue: vi.fn(),
    });

    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith('Morty');
    });
  });

  it('handles search flow', async () => {
    const user = userEvent.setup();

    const setValue = vi.fn();

    mockedUseLocalStorage.mockReturnValue({
      value: '',
      setValue,
      removeValue: vi.fn(),
    });

    mockedFetchCharacters.mockResolvedValue(mockCharacters);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', {
      name: /search/i,
    });

    await user.type(input, 'Rick');
    await user.click(button);

    expect(setValue).toHaveBeenCalledWith('Rick');
  });

  it('does not search if query equals stored value', async () => {
    const user = userEvent.setup();

    const setValue = vi.fn();

    mockedUseLocalStorage.mockReturnValue({
      value: 'Rick',
      setValue,
      removeValue: vi.fn(),
    });

    mockedFetchCharacters.mockResolvedValue([]);

    render(<App />);

    const button = screen.getByRole('button', {
      name: /search/i,
    });

    await user.click(button);

    expect(setValue).not.toHaveBeenCalled();
  });
});
