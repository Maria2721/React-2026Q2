'use client';

import { useCallback, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { HomeTitle } from '@/components/HomeTitle/HomeTitle';
import { SearchSection } from '@/components/SearchSection/SearchSection';
import { ResultsSection } from '@/components/ResultsSection/ResultsSection';
import { Pagination } from '@/components/Pagination/Pagination';
import { SelectedFlyout } from '@/components/SelectedFlyout/SelectedFlyout';
import { CharacterDetails } from '@/components/CharacterDetails/CharacterDetails';

import { charactersApi, useGetCharactersQuery } from '@/store/charactersApi';
import { useAppDispatch } from '@/store/hooks';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Home');

  const searchQuery = searchParams?.get('search') ?? '';
  const pageParam = searchParams?.get('page');
  const characterId = searchParams?.get('character');
  const page = Number(pageParam ?? 1) || 1;

  const [inputValue, setInputValue] = useState(searchQuery);
  const [crash, setCrash] = useState(false);

  const { data, isLoading, isFetching, error } = useGetCharactersQuery({
    query: searchQuery,
    page,
  });

  const results = data?.results ?? [];
  const totalPages = data?.pages ?? 1;

  const errorMessage = error ? getErrorMessage(error) : null;

  const dispatch = useAppDispatch();

  const handleRefreshList = () => {
    dispatch(charactersApi.util.invalidateTags(['Characters']));
  };

  const handleChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const navigate = useCallback(
    (params: {
      search?: string | null;
      page?: number | null;
      character?: string | number | null;
    }) => {
      const query: Record<string, string> = {};

      if (params.search) query.search = params.search;
      if (params.page) query.page = String(params.page);
      if (params.character) query.character = String(params.character);

      router.replace({ pathname: '/', query });
    },
    [router]
  );

  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();

    if (trimmed === searchQuery) return;

    navigate({
      search: trimmed,
      page: 1,
      character: null,
    });
  }, [inputValue, searchQuery, navigate]);

  const handleNextPage = () => {
    if (page < totalPages) {
      navigate({
        search: searchQuery,
        page: page + 1,
      });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      navigate({
        search: searchQuery,
        page: page - 1,
      });
    }
  };

  const handleSelectCharacter = (id: number) => {
    navigate({
      search: searchQuery,
      page,
      character: id,
    });
  };

  const handleCloseCharacter = () => {
    navigate({
      search: searchQuery,
      page,
      character: null,
    });
  };

  if (crash) {
    throw new Error('Test error');
  }

  return (
    <div className="flex flex-col gap-8">
      <HomeTitle />

      <div className="flex gap-6">
        <div
          className={
            characterId
              ? 'w-1/2 flex flex-col gap-6'
              : 'w-full flex flex-col gap-6'
          }
        >
          <SearchSection
            value={inputValue}
            onChange={handleChange}
            onSearch={handleSearch}
          />

          <div className="flex justify-end">
            <button
              onClick={handleRefreshList}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {t('refresh')}
            </button>
          </div>

          <ResultsSection
            results={results}
            loading={isLoading || isFetching}
            error={errorMessage}
            onSelect={handleSelectCharacter}
          />

          {!(isLoading || isFetching) && results.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setCrash(true)}
              className="px-5 py-2 rounded-xl font-medium text-white transition bg-linear-to-r from-purple-400 to-pink-400 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.95] cursor-pointer"
            >
              {t('error')}
            </button>
          </div>
        </div>

        {characterId && (
          <div className="pl-6 w-1/2 min-h-full">
            <CharacterDetails
              characterId={characterId}
              onClose={handleCloseCharacter}
            />
          </div>
        )}
      </div>

      <SelectedFlyout />
    </div>
  );
}
