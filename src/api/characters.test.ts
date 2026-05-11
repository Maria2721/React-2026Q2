import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCharacters } from './characters';
import { mockCharacter } from '../test-utils/mocks';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('fetchCharacters', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns characters on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: [mockCharacter],
      }),
    });

    const result = await fetchCharacters('Rick');

    expect(mockFetch).toHaveBeenCalled();
    expect(result).toEqual([mockCharacter]);
  });

  it('returns empty array on 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    const result = await fetchCharacters('unknown');

    expect(result).toEqual([]);
  });

  it('throws error on server failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    await expect(fetchCharacters('Rick')).rejects.toThrow('Server error');
  });

  it('returns empty array if results is missing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const result = await fetchCharacters('Rick');

    expect(result).toEqual([]);
  });
});
