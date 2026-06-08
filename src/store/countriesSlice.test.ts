import { describe, expect, it } from 'vitest';

import { countriesReducer } from './countriesSlice';
import { countries } from '../constants/countries';

describe('countriesSlice', () => {
  it('returns initial state', () => {
    expect(countriesReducer(undefined, { type: 'unknown' })).toEqual({
      items: countries,
    });
  });

  it('contains countries list', () => {
    const state = countriesReducer(undefined, { type: 'unknown' });

    expect(state.items).toEqual(countries);
    expect(state.items.length).toBeGreaterThan(0);
  });
});
