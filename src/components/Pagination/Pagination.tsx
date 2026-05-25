import type { PaginationProps } from '../../ts/interfaces';

function IconLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function IconRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5 15.75 12l-7.5 7.5"
      />
    </svg>
  );
}

export function Pagination({
  page,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-2">
      <div
        className="
        flex items-center gap-3 px-4 py-3 rounded-2xl
        border border-gray-200 bg-white shadow-sm
        dark:bg-gray-900/70 dark:border-gray-800 dark:shadow-black/30
        transition-colors
      "
      >
        <button
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="
            w-10 h-10 flex items-center justify-center
            rounded-lg border
            bg-gray-50 border-gray-200 text-gray-700
            transition-all duration-200 cursor-pointer

            hover:bg-gray-100 hover:border-gray-300
            active:scale-[0.95]

            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:bg-gray-50 disabled:hover:border-gray-200

            dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-200
            dark:hover:bg-gray-700 dark:hover:border-gray-600
            dark:disabled:opacity-30 dark:disabled:hover:bg-gray-800/60
          "
        >
          <IconLeft />
        </button>

        <div className="flex items-center gap-2 px-3 min-w-22.5 justify-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {page}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalPages}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="
            w-10 h-10 flex items-center justify-center
            rounded-lg border
            bg-gray-50 border-gray-200 text-gray-700
            transition-all duration-200 cursor-pointer

            hover:bg-gray-100 hover:border-gray-300
            active:scale-[0.95]

            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:bg-gray-50 disabled:hover:border-gray-200

            dark:bg-gray-800/60 dark:border-gray-700 dark:text-gray-200
            dark:hover:bg-gray-700 dark:hover:border-gray-600
            dark:disabled:opacity-30 dark:disabled:hover:bg-gray-800/60
          "
        >
          <IconRight />
        </button>
      </div>
    </div>
  );
}
