import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Character } from '../ts/interfaces';

import {
  buildCharactersQuery,
  transformCharactersResponse,
} from './charactersApi.helpers';

const cacheTTL = Number(process.env.NEXT_CACHE_TTL ?? 60);

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
      query: buildCharactersQuery,

      transformResponse: transformCharactersResponse,

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
