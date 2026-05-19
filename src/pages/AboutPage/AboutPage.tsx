export default function AboutPage() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-linear-to-br from-indigo-600 to-violet-600 p-10 text-white">
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Rick & Morty Character Explorer
          </h1>

          <p className="mb-6 text-base leading-relaxed text-indigo-100">
            A React application for searching and exploring characters from the
            Rick & Morty universe.
          </p>
        </div>

        <div className="p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700">
              M
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Maria Ivanova
              </h2>

              <p className="text-slate-500">Frontend Developer</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              This project was created as part of the RS School React course.
            </p>

            <p>
              The application demonstrates routing, API interaction, reusable
              components, state management, testing and responsive UI
              development.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://github.com/Maria2721"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span>🐙</span>
              GitHub Profile
            </a>

            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              <span>🎓</span>
              RS School React Course
            </a>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
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
                  className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm"
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
