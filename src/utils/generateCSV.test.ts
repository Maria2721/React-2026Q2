import { describe, it, expect } from 'vitest';
import { generateCSV } from './generateCSV';

import { mockCharacters } from '../test-utils/mocks';

describe('generateCSV', () => {
  it('generates CSV with correct headers', () => {
    const result = generateCSV(mockCharacters);

    expect(
      result.startsWith(
        'ID,Name,Status,Species,Gender,Origin,Location,Episodes Count,Episodes,Image,Details URL'
      )
    ).toBe(true);
  });

  it('generates correct number of rows', () => {
    const result = generateCSV(mockCharacters);

    const lines = result.split('\n');

    expect(lines.length).toBe(3);
  });

  it('includes correct character data', () => {
    const result = generateCSV(mockCharacters);

    expect(result).toContain('Rick Sanchez');
    expect(result).toContain('Morty Smith');
  });

  it('builds correct details URL', () => {
    expect(generateCSV(mockCharacters)).toContain(
      'https://rickandmortyapi.com/api/character/1'
    );
  });

  it('handles missing image correctly', () => {
    const characters = [
      {
        ...mockCharacters[0],
        image: undefined,
      },
    ];

    const result = generateCSV(characters);
    const row = result.split('\n')[1].split(',');

    expect(row[9]).toBe('""');
  });
});
