import { configureStore } from '@reduxjs/toolkit';

import selectedReducer from './selectedSlice';
import { charactersApi } from './charactersApi';

export const store = configureStore({
  reducer: {
    selected: selectedReducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
