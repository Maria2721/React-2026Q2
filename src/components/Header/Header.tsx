'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';

const getLinkClass = (isActive: boolean) =>
  clsx(
    'relative text-base font-medium transition-all duration-200',
    'hover:text-indigo-500',

    'after:content-[""] after:absolute after:left-0 after:-bottom-1',
    'after:h-[2px] after:w-full after:transition-transform after:duration-300',

    {
      'text-indigo-500 after:scale-x-100 after:bg-indigo-500': isActive,
      'text-gray-700  dark:text-gray-100 after:scale-x-0 after:bg-indigo-400':
        !isActive,
    }
  );

export function Header() {
  const pathname = usePathname();
  const t = useTranslations('Header');

  const isHome = pathname === '/';
  const isAbout = pathname === '/about';

  return (
    <header className="bg-white dark:bg-gray-800 transition-colors">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-8 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/" className={getLinkClass(isHome)}>
            {t('home')}
          </Link>

          <Link href="/about" className={getLinkClass(isAbout)}>
            {t('about')}
          </Link>
        </nav>

        <div className="flex items-center">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="h-0.5 w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400" />
    </header>
  );
}
