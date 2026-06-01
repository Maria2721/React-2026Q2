import { describe, it, expect } from 'vitest';

import { transformCharactersResponse } from './charactersApi.helpers';

import type { ApiResponse } from '../ts/interfaces';

import { mockCharacters } from '../test-utils/mocks';

describe('transformCharactersResponse', () => {
  it('transforms full response correctly', () => {
    const response: ApiResponse = {
      results: mockCharacters,
      info: {
        pages: 5,
        next: null,
        prev: null,
      },
    };

    const result = transformCharactersResponse(response);

    expect(result.pages).toBe(5);
    expect(result.results).toEqual(mockCharacters);
  });

  it('returns empty array when results is missing', () => {
    const response = {
      info: {
        pages: 5,
        next: null,
        prev: null,
      },
    } as ApiResponse;

    const result = transformCharactersResponse(response);

    expect(result.results).toEqual([]);
    expect(result.pages).toBe(5);
  });

  it('returns pages = 1 when info is missing', () => {
    const response = {
      results: mockCharacters,
    } as ApiResponse;

    const result = transformCharactersResponse(response);

    expect(result.results).toEqual(mockCharacters);
    expect(result.pages).toBe(1);
  });

  it('returns defaults when everything is missing', () => {
    const response = {} as ApiResponse;

    const result = transformCharactersResponse(response);

    expect(result.results).toEqual([]);
    expect(result.pages).toBe(1);
  });
});
