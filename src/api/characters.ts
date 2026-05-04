import type { Character, ApiResponse } from '../ts/interfaces';

export const fetchCharacters = async (query: string): Promise<Character[]> => {
  const url = query
    ? `https://rickandmortyapi.com/api/character/?name=${query}`
    : `https://rickandmortyapi.com/api/character`;

  const res = await fetch(url);
  const data: ApiResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? `HTTP error ${res.status}`);
  }

  return data.results ?? [];
};
