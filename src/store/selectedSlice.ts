import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Character } from '../ts/interfaces';

type SelectedState = {
  items: Character[];
};

const initialState: SelectedState = {
  items: [],
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    toggleSelected(state, action: PayloadAction<Character>) {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (exists) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );

        return;
      }

      state.items.push(action.payload);
    },

    clearSelected(state) {
      state.items = [];
    },
  },
});

export const { toggleSelected, clearSelected } = selectedSlice.actions;

export default selectedSlice.reducer;
