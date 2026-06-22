'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center gap-4 px-6
        bg-linear-to-br from-blue-50 via-white to-purple-50
        dark:from-gray-800 dark:via-gray-800 dark:to-gray-800
      "
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {t('errorTitle')}
      </h2>

      <p className="text-sm text-gray-500 text-center max-w-md dark:text-gray-400">
        {t('errorDescription')}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="
            px-5 py-2 rounded-xl font-medium text-white transition
            bg-linear-to-r from-blue-500 to-indigo-500
            shadow-sm hover:shadow-md hover:scale-[1.02]
            active:scale-[0.95] cursor-pointer
          "
        >
          {t('tryAgain')}
        </button>
      </div>
    </div>
  );
}
