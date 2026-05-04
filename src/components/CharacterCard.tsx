import { Component } from 'react';
import type { Character } from '../ts/interfaces';

export class CharacterCard extends Component<Character> {
  render() {
    const { name, status, species, gender, origin, location, episode } =
      this.props;

    const statusStyles =
      status === 'Alive'
        ? 'bg-green-100 text-green-700 ring-green-200'
        : status === 'Dead'
          ? 'bg-red-100 text-red-700 ring-red-200'
          : 'bg-gray-100 text-gray-600 ring-gray-200';

    return (
      <div className="group relative p-5 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {species} • {gender}
            </p>
          </div>

          <span
            className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ring-1 ${statusStyles}`}
          >
            {status}
          </span>
        </div>

        <div className="my-4 h-1 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70 group-hover:opacity-100 transition" />

        <div className="grid grid-cols-2 gap-4 text-sm">
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
            <p className="font-medium text-gray-800 truncate">
              {location?.name}
            </p>
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

        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 transition" />
      </div>
    );
  }
}
