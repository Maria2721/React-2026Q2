'use client';

import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <section
      className="
      overflow-hidden rounded-3xl border shadow-xl
      bg-white border-slate-200
      dark:bg-gray-900/70 dark:border-gray-800 dark:shadow-black/40
    "
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div
          className="
          flex flex-col justify-center p-10 text-white
          bg-linear-to-br from-indigo-600 to-violet-600
          dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-gray-100
        "
        >
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            {t('title')}
          </h1>

          <p
            className="
            mb-6 text-base leading-relaxed text-indigo-100
            dark:text-gray-300
          "
          >
            {t('subTitle')}
          </p>
        </div>

        <div className="p-10">
          <div className="mb-8 flex items-center gap-4">
            <div
              className="
              flex h-20 w-20 items-center justify-center rounded-2xl
              bg-indigo-100 text-indigo-700 text-3xl font-bold
              dark:bg-indigo-500/10 dark:text-indigo-300
            "
            >
              M
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                {t('name')}
              </h2>

              <p className="text-slate-500 dark:text-gray-400">
                {t('developer')}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600 dark:text-gray-300">
            <p>{t('created')}</p>

            <p>{t('desc')}</p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://github.com/Maria2721"
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-medium
                border-slate-200 text-slate-700
                hover:border-indigo-300 hover:bg-indigo-50
                transition
                dark:border-gray-700 dark:text-gray-200
                dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10
              "
            >
              <span>🐙</span>
              GitHub Profile
            </a>

            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium text-white
                bg-indigo-600 hover:bg-indigo-700 transition
                dark:bg-indigo-500/80 dark:hover:bg-indigo-500
              "
            >
              <span>🎓</span>
              RS School React Course
            </a>
          </div>

          <div
            className="
            mt-10 rounded-2xl border p-5
            border-slate-100 bg-slate-50
            dark:border-gray-800 dark:bg-gray-800/40
          "
          >
            <div
              className="
              mb-2 flex items-center gap-2 text-sm font-semibold
              text-slate-800 dark:text-gray-200
            "
            >
              <span>🌐</span>
              Technologies Used
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'React',
                'TypeScript',
                'React Router',
                'Vite',
                'Tailwind CSS',
                'Vitest',
              ].map((tech) => (
                <span
                  key={tech}
                  className="
                    rounded-full px-3 py-1 text-sm shadow-sm
                    bg-white text-slate-700
                    dark:bg-gray-700/50 dark:text-gray-200
                  "
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
