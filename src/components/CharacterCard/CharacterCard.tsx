import clsx from 'clsx';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { toggleSelected } from '../../store/selectedSlice';

import { selectIsSelected } from '../../store/selectors';

import type { Character } from '../../ts/interfaces';

interface CharacterCardProps {
  character: Character;
  onSelect: (id: number) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  const { id, name, status, species, gender, origin, location, episode } =
    character;

  const dispatch = useAppDispatch();

  const isSelected = useAppSelector(selectIsSelected(id));

  const handleCheckboxChange = () => {
    dispatch(toggleSelected(character));
  };

  const statusStyles =
    status === 'Alive'
      ? 'bg-green-100 text-green-700 ring-green-200'
      : status === 'Dead'
        ? 'bg-red-100 text-red-700 ring-red-200'
        : 'bg-gray-100 text-gray-600 ring-gray-200';

  return (
    <div
      className={clsx(
        'group relative cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        isSelected && 'border-blue-300 ring-2 ring-blue-500 bg-blue-50/30'
      )}
      onClick={() => onSelect(id)}
    >
      <div
        className="absolute top-5 right-5 z-20"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleCheckboxChange}
          aria-label={`Select ${name}`}
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 cursor-pointer',
            isSelected
              ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-200'
              : 'border-gray-300 bg-white/90 text-transparent hover:border-blue-400 hover:bg-blue-50'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 0 1 .006 1.414l-8 8a1 1 0 0 1-1.42-.008l-4-4a1 1 0 0 1 1.414-1.414l3.294 3.293 7.296-7.29a1 1 0 0 1 1.41.005Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3 pr-10">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {species} • {gender}
          </p>
        </div>

        <span
          className={clsx(
            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1',
            statusStyles
          )}
        >
          {status}
        </span>
      </div>

      <div className="relative z-10 my-4 h-1 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70 transition group-hover:opacity-100" />

      <div className="relative z-10 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-blue-500">
            Origin
          </p>
          <p className="font-medium text-gray-800 truncate">{origin?.name}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-purple-500">
            Location
          </p>
          <p className="font-medium text-gray-800 truncate">{location?.name}</p>
        </div>

        <div className="space-y-1 col-span-2">
          <p className="text-xs uppercase tracking-wider text-pink-500">
            Episodes
          </p>
          <p className="font-semibold text-gray-900">
            {episode?.length} appearances
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 transition group-hover:opacity-10" />
    </div>
  );
}
