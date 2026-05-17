import type { Character, ApiResponse } from '../ts/interfaces';

export const fetchCharacters = async (query: string): Promise<Character[]> => {
  const baseUrl = 'https://rickandmortyapi.com/api/character';

  const url = query ? `${baseUrl}/?name=${encodeURIComponent(query)}` : baseUrl;

  const res = await fetch(url);
  const data: ApiResponse = await res.json();

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }

    throw new Error(data.error ?? `HTTP error ${res.status}`);
  }

  return data.results ?? [];
};
