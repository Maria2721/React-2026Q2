import type { Character, ApiResponse } from '../ts/interfaces';

export const fetchCharacters = async (
  query: string,
  page: number
): Promise<{ results: Character[]; pages: number }> => {
  const baseUrl = 'https://rickandmortyapi.com/api/character';

  const url = new URL(baseUrl);

  if (query) {
    url.searchParams.append('name', query);
  }

  url.searchParams.append('page', String(page));

  const res = await fetch(url.toString());
  const data: ApiResponse = await res.json();

  if (!res.ok) {
    if (res.status === 404) {
      return { results: [], pages: 1 };
    }

    throw new Error(data.error ?? `HTTP error ${res.status}`);
  }

  return {
    results: data.results ?? [],
    pages: data.info?.pages ?? 1,
  };
};
