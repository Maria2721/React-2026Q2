import { CharacterCard } from '../CharacterCard/CharacterCard';

import type { ResultsProps } from '../../ts/interfaces';

export function ResultsSection({ results, loading, error }: ResultsProps) {
  const isEmpty = !loading && !error && results.length === 0;
  const hasResults = !loading && !error && results.length > 0;

  return (
    <section className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">📦 Results</h2>

      {loading && (
        <div className="flex justify-center py-6">
          <div
            data-testid="loader"
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      {isEmpty && (
        <div className="text-gray-400 text-sm text-center py-6">
          No results found
        </div>
      )}

      {hasResults && (
        <div className="grid gap-3">
          {results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  );
}
