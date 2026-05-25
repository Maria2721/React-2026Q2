import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelected } from '../../store/selectedSlice';

import { generateCSV } from '../../utils/csv';
import { downloadCSV } from '../../utils/downloadCSV';

export function SelectedFlyout() {
  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector((state) => state.selected.items);

  const handleDownload = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const csvContent = generateCSV(selectedItems);

    const fileName = `${selectedItems.length}_items.csv`;

    downloadCSV(csvContent, fileName);
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(90%,700px)] -translate-x-1/2">
      <div
        className="
        flex items-center justify-between gap-4
        rounded-2xl border px-6 py-4
        shadow-2xl backdrop-blur-md
        bg-white/95 border-blue-200

        dark:bg-gray-900/70 dark:border-gray-800 dark:shadow-black/40
      "
      >
        <div className="flex items-center gap-3">
          <div
            className="
            flex h-10 w-10 items-center justify-center rounded-full
            bg-blue-100 text-sm font-bold text-blue-600

            dark:bg-blue-500/10 dark:text-blue-300
          "
          >
            {selectedItems.length}
          </div>

          <div>
            <p className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Selected characters
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedItems.length}{' '}
              {selectedItems.length === 1
                ? 'character selected'
                : 'characters selected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(clearSelected())}
            className="
              cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium
              border-gray-200 text-gray-600

              hover:border-red-200 hover:bg-red-50 hover:text-red-600
              transition

              dark:border-gray-700 dark:text-gray-300
              dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-300
            "
          >
            Unselect all
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="
              cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white
              bg-linear-to-r from-blue-500 via-purple-500 to-pink-500
              shadow-md transition

              hover:scale-[1.02] hover:shadow-lg active:scale-[0.97]
            "
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
