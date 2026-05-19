import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

import { fetchCharacterById } from '../../api/characters';
import type { Character } from '../../ts/interfaces';

type Context = {
  detailsId: string;
  closeDetails: () => void;
};

function CloseIcon() {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function CharacterDetailsPage() {
  const { detailsId, closeDetails } = useOutletContext<Context>();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCharacterById(detailsId);
        setCharacter(data);
      } catch {
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [detailsId]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!character) return null;

  const statusStyles =
    character.status === 'Alive'
      ? 'bg-green-100 text-green-700 ring-green-200'
      : character.status === 'Dead'
        ? 'bg-red-100 text-red-700 ring-red-200'
        : 'bg-gray-100 text-gray-600 ring-gray-200';

  const infoCards = [
    {
      label: 'Species',
      value: character.species,
      color:
        'from-blue-500/10 to-cyan-500/10 border-blue-100 hover:border-blue-200',
      text: 'text-blue-600',
    },
    {
      label: 'Gender',
      value: character.gender,
      color:
        'from-purple-500/10 to-pink-500/10 border-purple-100 hover:border-purple-200',
      text: 'text-purple-600',
    },
    {
      label: 'Origin',
      value: character.origin?.name,
      color:
        'from-orange-500/10 to-yellow-500/10 border-orange-100 hover:border-orange-200',
      text: 'text-orange-600',
    },
    {
      label: 'Location',
      value: character.location?.name,
      color:
        'from-emerald-500/10 to-green-500/10 border-emerald-100 hover:border-emerald-200',
      text: 'text-emerald-600',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
      <button
        onClick={closeDetails}
        className="absolute top-5 right-5 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-gray-500 hover:text-gray-900 hover:scale-105 hover:shadow-md transition-all cursor-pointer"
      >
        <CloseIcon />
      </button>

      <div className="relative z-10">
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="h-80 w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-white/70">
                  Character Profile
                </p>

                <h2 className="text-4xl font-black text-white drop-shadow-sm">
                  {character.name}
                </h2>
              </div>

              <span
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 backdrop-blur-sm bg-white/90 ${statusStyles}`}
              >
                {character.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-14 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

            <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
              Character Details
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-2xl border bg-linear-to-br ${card.color} bg-white/90 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/40 blur-2xl group-hover:scale-125 transition-transform duration-500" />

                <div className="relative">
                  <p
                    className={`text-xs uppercase tracking-[0.25em] font-semibold ${card.text}`}
                  >
                    {card.label}
                  </p>

                  <p className="mt-3 text-lg font-bold text-gray-900 leading-snug">
                    {card.value || 'Unknown'}
                  </p>
                </div>
              </div>
            ))}

            <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-linear-to-br from-pink-500/10 to-rose-500/10 p-6 shadow-sm hover:shadow-lg transition-all sm:col-span-2">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-pink-200/40 blur-3xl" />

              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] font-semibold text-pink-600">
                    Episodes
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-gray-900">
                    {character.episode?.length}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Total appearances in the series
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-inner">
                  <span className="text-3xl">🎬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
