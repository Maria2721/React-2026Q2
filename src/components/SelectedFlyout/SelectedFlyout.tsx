import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { clearSelected } from '../../store/selectedSlice';

export function SelectedFlyout() {
  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector((state) => state.selected.items);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(90%,700px)] -translate-x-1/2">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-white/95 px-6 py-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
            {selectedItems.length}
          </div>

          <div>
            <p className="text-md font-semibold text-gray-900">
              Selected characters
            </p>

            <p className="text-sm text-gray-500">
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
            className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Unselect all
          </button>

          <button
            type="button"
            onClick={() => console.log(selectedItems)}
            className="cursor-pointer rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.97]"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
