import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

import { Header } from './components/Header/Header';
import { SearchSection } from './components/SearchSection/SearchSection';
import { ResultsSection } from './components/ResultsSection/ResultsSection';
import { fetchCharacters } from './api/characters';

import type { AppState } from './ts/interfaces';

export default function App() {
  const { value: searchQuery, setValue: setSearchQuery } =
    useLocalStorage<string>('search', '');
  const [query, setQuery] = useState(searchQuery);
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
    setQuery(value);
  }, []);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();

    if (trimmed === searchQuery) return;

    setQuery(trimmed);
    setSearchQuery(trimmed);
  }, [query, searchQuery, setSearchQuery]);

  if (crash) {
    throw new Error('Test error');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex justify-center p-8">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <Header />

        <main className="flex flex-col gap-6">
          <SearchSection
            value={query}
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
        </main>
      </div>
    </div>
  );
}
