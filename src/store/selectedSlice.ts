import { createSlice } from '@reduxjs/toolkit';

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
  reducers: {},
});

export default selectedSlice.reducer;
