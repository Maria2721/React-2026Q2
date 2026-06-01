import { describe, it, expect } from 'vitest';

import { selectSelectedItems, selectIsSelected } from './selectors';

import { mockCharacters } from '../test-utils/mocks';

describe('selectors', () => {
  const state = {
    selected: {
      items: [mockCharacters[0], mockCharacters[1]],
    },
  };

  it('selectSelectedItems returns selected items', () => {
    expect(selectSelectedItems(state as never)).toEqual([
      mockCharacters[0],
      mockCharacters[1],
    ]);
  });

  it('selectIsSelected returns true when character exists', () => {
    const selector = selectIsSelected(mockCharacters[0].id);

    expect(selector(state as never)).toBe(true);
  });

  it('selectIsSelected returns false when character does not exist', () => {
    const selector = selectIsSelected(999999);

    expect(selector(state as never)).toBe(false);
  });
});
