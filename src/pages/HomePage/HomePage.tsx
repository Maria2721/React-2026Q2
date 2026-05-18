import { useState, useEffect, useCallback } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';

import { HomeTitle } from '../../components/HomeTitle/HomeTitle';
import { SearchSection } from '../../components/SearchSection/SearchSection';
import { ResultsSection } from '../../components/ResultsSection/ResultsSection';

import { fetchCharacters } from '../../api/characters';

import type { AppState } from '../../ts/interfaces';

export default function HomePage() {
  const { value: searchQuery, setValue: setSearchQuery } =
    useLocalStorage<string>('search', '');
  const [inputValue, setInputValue] = useState(searchQuery);
  const [results, setResults] = useState<AppState['results']>([]);
  const [loading, setLoading] = useState<AppState['loading']>(false);
  const [error, setError] = useState<AppState['error']>(null);
  const [crash, setCrash] = useState(false);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchCharacters(searchQuery);
        setResults(results);
      } catch {
        setError('Something went wrong. Try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [searchQuery]);

  const handleChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();

    if (trimmed === searchQuery) return;

    setSearchQuery(trimmed);
  }, [inputValue, searchQuery, setSearchQuery]);

  if (crash) {
    throw new Error('Test error');
  }

  return (
    <div className="flex flex-col gap-8">
      <HomeTitle />

      <div className="flex flex-col gap-6">
        <SearchSection
          value={inputValue}
          onChange={handleChange}
          onSearch={handleSearch}
        />

        <ResultsSection results={results} loading={loading} error={error} />

        <div className="flex justify-end">
          <button
            onClick={() => setCrash(true)}
            className="px-5 py-2 rounded-xl font-medium text-white transition bg-linear-to-r from-purple-400 to-pink-400 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.95]"
          >
            Test Error
          </button>
        </div>
      </div>
    </div>
  );
}
