import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-indigo-600 tracking-tight">
          404
        </h1>

        <h2 className="mt-6 text-2xl font-semibold text-slate-800">
          Page not found
        </h2>

        <p className="mt-3 text-slate-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium shadow-md transition hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
        >
          Go back home
        </Link>

        <p className="mt-3 text-xs text-slate-400">
          Check the URL or return to the main application
        </p>
      </div>
    </div>
  );
}
