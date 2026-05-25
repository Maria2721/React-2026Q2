import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div
      className="
      min-h-screen flex items-center justify-center px-6
      bg-linear-to-br from-blue-50 via-white to-purple-50
      dark:from-gray-800 dark:via-gray-800 dark:to-gray-800
    "
    >
      <div className="text-center max-w-md">
        <h1
          className="
          text-7xl font-extrabold tracking-tight
          text-indigo-600
          dark:text-indigo-400
        "
        >
          404
        </h1>

        <h2
          className="
          mt-6 text-2xl font-semibold
          text-slate-800
          dark:text-gray-100
        "
        >
          Page not found
        </h2>

        <p
          className="
          mt-3
          text-slate-500
          dark:text-gray-400
        "
        >
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="
            mt-6 inline-flex items-center justify-center
            rounded-xl px-6 py-3 font-medium text-white
            bg-indigo-600 shadow-md transition
            hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]
            dark:bg-indigo-500 dark:hover:bg-indigo-400
          "
        >
          Go back home
        </Link>

        <p
          className="
          mt-3 text-xs
          text-slate-400
          dark:text-gray-500
        "
        >
          Check the URL or return to the main application
        </p>
      </div>
    </div>
  );
}
