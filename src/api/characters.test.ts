import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCharacters } from './characters';
import { mockCharacters } from '../test-utils/mocks';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('fetchCharacters', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns characters and pages on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: mockCharacters,
        info: { pages: 3 },
      }),
    });

    const result = await fetchCharacters('Rick', 1);

    expect(mockFetch).toHaveBeenCalled();

    expect(result).toEqual({
      results: mockCharacters,
      pages: 3,
    });
  });

  it('returns empty results and pages=1 on 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    const result = await fetchCharacters('unknown', 1);

    expect(result).toEqual({
      results: [],
      pages: 1,
    });
  });

  it('throws error on server failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    await expect(fetchCharacters('Rick', 1)).rejects.toThrow('Server error');
  });

  it('returns empty results if results is missing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        info: { pages: 2 },
      }),
    });

    const result = await fetchCharacters('Rick', 1);

    expect(result).toEqual({
      results: [],
      pages: 2,
    });
  });
});
