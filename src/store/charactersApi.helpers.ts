import type { ApiResponse } from '../ts/interfaces';

export function buildCharactersQuery(params: { query: string; page: number }) {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set('name', params.query);
  }

  searchParams.set('page', String(params.page));

  return `character?${searchParams.toString()}`;
}

export function transformCharactersResponse(response: ApiResponse) {
  return {
    results: response.results ?? [],
    pages: response.info?.pages ?? 1,
  };
}
