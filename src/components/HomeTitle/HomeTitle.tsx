'use client';

import { useTranslations } from 'next-intl';

export function HomeTitle() {
  const t = useTranslations('Home');

  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        🔍 {t('title')}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{t('subTitle')}</p>
    </section>
  );
}
