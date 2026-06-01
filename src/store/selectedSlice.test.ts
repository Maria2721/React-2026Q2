import { describe, it, expect } from 'vitest';

import reducer, { toggleSelected, clearSelected } from './selectedSlice';

import { mockCharacters } from '../test-utils/mocks';

describe('selectedSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
    });
  });

  it('adds character when not selected', () => {
    const state = reducer({ items: [] }, toggleSelected(mockCharacters[0]));

    expect(state.items).toEqual([mockCharacters[0]]);
  });

  it('removes character when already selected', () => {
    const state = reducer(
      {
        items: [mockCharacters[0]],
      },
      toggleSelected(mockCharacters[0])
    );

    expect(state.items).toEqual([]);
  });

  it('keeps other characters when removing one', () => {
    const state = reducer(
      {
        items: [mockCharacters[0], mockCharacters[1]],
      },
      toggleSelected(mockCharacters[0])
    );

    expect(state.items).toEqual([mockCharacters[1]]);
  });

  it('clears all selected characters', () => {
    const state = reducer(
      {
        items: [mockCharacters[0], mockCharacters[1]],
      },
      clearSelected()
    );

    expect(state.items).toEqual([]);
  });
});
