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
  },
});

export const { addSubmission } = submissionsSlice.actions;

export const submissionsReducer = submissionsSlice.reducer;
