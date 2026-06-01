import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Outlet } from 'react-router';

import { useLocalStorage } from '../../hooks/useLocalStorage';

import { HomeTitle } from '../../components/HomeTitle/HomeTitle';
import { SearchSection } from '../../components/SearchSection/SearchSection';
import { ResultsSection } from '../../components/ResultsSection/ResultsSection';
import { Pagination } from '../../components/Pagination/Pagination';
import { SelectedFlyout } from '../../components/SelectedFlyout/SelectedFlyout';

import {
  charactersApi,
  useGetCharactersQuery,
} from '../../store/charactersApi';

import { useAppDispatch } from '../../store/hooks';

export default function HomePage() {
  const { value: searchQuery, setValue: setSearchQuery } =
    useLocalStorage<string>('search', '');

  const [inputValue, setInputValue] = useState(searchQuery);
  const [crash, setCrash] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const detailsId = searchParams.get('details');

  const { data, isLoading, isFetching, error } = useGetCharactersQuery({
    query: searchQuery,
    page,
  });

  const results = data?.results ?? [];
  const totalPages = data?.pages ?? 1;

  const errorMessage = error ? 'Something went wrong. Try again.' : null;

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
    setSearchParams({ page: '1' });
  }, [inputValue, searchQuery, setSearchParams, setSearchQuery]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setSearchParams({ page: String(page + 1) });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ page: String(page - 1) });
    }
  };

  const handleSelectCharacter = (id: number) => {
    const page = searchParams.get('page') || '1';

    setSearchParams({ page, details: String(id) });

    navigate(`character/${id}?page=${page}&details=${id}`);
  };

  const closeDetails = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('details');

    setSearchParams(params);
    navigate('/');
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
            detailsId
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

        {detailsId && (
          <div className="border-l pl-6 w-1/2 min-h-full">
            <Outlet context={{ detailsId, closeDetails }} />
          </div>
        )}
      </div>

      <SelectedFlyout />
    </div>
  );
}
