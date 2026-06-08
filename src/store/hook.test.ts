import { describe, expect, it } from 'vitest';

import { useAppDispatch, useAppSelector } from './hooks';

describe('hooks', () => {
  it('exports typed hooks', () => {
    expect(useAppDispatch).toBeDefined();
    expect(useAppSelector).toBeDefined();
  });
});
