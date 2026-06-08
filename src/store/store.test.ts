import { describe, expect, it } from 'vitest';
import { store } from './store';

describe('store', () => {
  it('contains all reducers', () => {
    const state = store.getState();

    expect(state.submissions).toBeDefined();
    expect(state.countries).toBeDefined();
  });
});
