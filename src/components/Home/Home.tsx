'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useLocalStorage } from '@/hooks/useLocalStorage';

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

  const pageParam = searchParams?.get('page');
  const characterId = searchParams?.get('character');

  const page = Number(pageParam ?? 1) || 1;

  const { value: searchQuery, setValue: setSearchQuery } =
    useLocalStorage<string>('search', '');

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

  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();

    if (trimmed === searchQuery) return;

    setSearchQuery(trimmed);
    router.replace('/?page=1');
  }, [inputValue, searchQuery, setSearchQuery, router]);

  const handleNextPage = () => {
    if (page < totalPages) {
      router.replace(`/?page=${page + 1}`);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      router.replace(`/?page=${page - 1}`);
    }
  };

  const handleSelectCharacter = (id: number) => {
    router.push(`/?page=${page}&character=${id}`);
  };

  const handleCloseCharacter = () => {
    router.replace(`/?page=${page}`);
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
              Refresh List
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
              Test Error
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
