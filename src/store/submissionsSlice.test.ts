import { describe, expect, it } from 'vitest';

import {
  submissionsReducer,
  addSubmission,
  markAsOld,
} from './submissionsSlice';

import type { Submission } from '../types/form';

import { mockSubmission } from '../test/mocks/submission';

describe('submissionsSlice', () => {
  it('returns initial state', () => {
    expect(submissionsReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
    });
  });

  it('adds submission to the beginning of the list', () => {
    const state = submissionsReducer(
      { items: [] },
      addSubmission(mockSubmission)
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockSubmission);
  });

  it('stores submission history in reverse chronological order', () => {
    const first: Submission = {
      ...mockSubmission,
      id: '1',
    };

    const second: Submission = {
      ...mockSubmission,
      id: '2',
    };

    let state = submissionsReducer({ items: [] }, addSubmission(first));

    state = submissionsReducer(state, addSubmission(second));

    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('2');
    expect(state.items[1].id).toBe('1');
  });

  it('marks submission as old', () => {
    const state = submissionsReducer(
      {
        items: [mockSubmission],
      },
      markAsOld('1')
    );

    expect(state.items[0].isNew).toBe(false);
  });

  it('does nothing when submission is not found', () => {
    const state = submissionsReducer(
      {
        items: [mockSubmission],
      },
      markAsOld('999')
    );

    expect(state.items[0].isNew).toBe(true);
  });
});
