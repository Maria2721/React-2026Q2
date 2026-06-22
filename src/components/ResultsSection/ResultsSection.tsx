'use client';

import { useTranslations } from 'next-intl';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import type { ResultsProps } from '../../ts/interfaces';

export function ResultsSection({
  results,
  loading,
  error,
  onSelect,
}: ResultsProps) {
  const t = useTranslations('ResultsSection');

  const isEmpty = !loading && !error && results.length === 0;
  const hasResults = !loading && !error && results.length > 0;

  return (
    <section
      className="
      bg-white dark:bg-gray-900/70
      p-5 rounded-2xl shadow-md dark:shadow-black/30
      border border-gray-100 dark:border-gray-800
      transition-colors
    "
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
        📦 {t('title')}
      </h2>

      {loading && (
        <div className="flex justify-center py-6">
          <div
            data-testid="loader"
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          />
        </div>
      )}

      {error && (
        <div
          className="
          p-3 rounded-lg
          text-red-600 bg-red-50
          dark:text-red-200 dark:bg-red-900/20
        "
        >
          {error}
        </div>
      )}

      {isEmpty && (
        <div
          className="
          text-sm text-center py-6
          text-gray-400 dark:text-gray-500
        "
        >
          {t('isEmpty')}
        </div>
      )}

      {hasResults && (
        <div className="grid gap-3">
          {results.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}
