import { createSlice } from '@reduxjs/toolkit';
import { countries } from '../constants/countries';

interface CountriesState {
  items: string[];
}

const initialState: CountriesState = {
  items: [...countries],
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesReducer = countriesSlice.reducer;
