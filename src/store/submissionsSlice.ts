import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Submission } from '../types/form';

interface SubmissionsState {
  items: Submission[];
}

const initialState: SubmissionsState = {
  items: [],
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: (
      state: SubmissionsState,
      action: PayloadAction<Submission>
    ) => {
      state.items.unshift(action.payload);
    },
    markAsOld: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.isNew = false;
      }
    },
  },
});

export const { addSubmission, markAsOld } = submissionsSlice.actions;

export const submissionsReducer = submissionsSlice.reducer;
