import type { Character } from '../ts/interfaces';

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function generateCSV(characters: Character[]): string {
  const headers = [
    'ID',
    'Name',
    'Status',
    'Species',
    'Gender',
    'Origin',
    'Location',
    'Episodes Count',
    'Episodes',
    'Image',
    'Details URL',
  ];

  const rows = characters.map((character) => [
    character.id,
    escapeCSV(character.name),
    escapeCSV(character.status),
    escapeCSV(character.species),
    escapeCSV(character.gender),
    escapeCSV(character.origin.name),
    escapeCSV(character.location.name),
    character.episode.length,
    escapeCSV(character.episode.join(' | ')),
    escapeCSV(character.image ?? ''),
    escapeCSV(`https://rickandmortyapi.com/api/character/${character.id}`),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
