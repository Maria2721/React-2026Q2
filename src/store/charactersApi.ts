import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Character, ApiResponse } from '../ts/interfaces';

const cacheTTL = Number(import.meta.env.VITE_CACHE_TTL ?? 60);

export const charactersApi = createApi({
  reducerPath: 'charactersApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/',
  }),

  tagTypes: ['Characters', 'Character'],

  endpoints: (builder) => ({
    getCharacters: builder.query<
      { results: Character[]; pages: number },
      { query: string; page: number }
    >({
      query: ({ query, page }) => {
        const params = new URLSearchParams();

        if (query) {
          params.set('name', query);
        }

        params.set('page', String(page));

        return `character?${params.toString()}`;
      },

      transformResponse: (response: ApiResponse) => ({
        results: response.results ?? [],
        pages: response.info?.pages ?? 1,
      }),

      keepUnusedDataFor: cacheTTL,

      providesTags: ['Characters'],
    }),

    getCharacterById: builder.query<Character, string>({
      query: (id) => `character/${id}`,

      keepUnusedDataFor: cacheTTL,

      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } =
  charactersApi;
