import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import App from './App';
import { fetchCharacters } from './api/characters';
import { mockCharacter } from './test-utils/mocks';

vi.mock('./api/characters', () => ({
  fetchCharacters: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);

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
});
