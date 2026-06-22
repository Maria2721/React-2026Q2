'use client';

import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const LOCALES = ['en', 'ru'] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className="
        inline-flex items-center p-1
        rounded-xl border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900/70
        shadow-sm
      "
    >
      {LOCALES.map((lng) => {
        const active = locale === lng;

        return (
          <button
            key={lng}
            onClick={() => handleChange(lng)}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-all',
              active
                ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
