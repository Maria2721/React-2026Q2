import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import selectedReducer from '../store/selectedSlice';

import type { ReactElement } from 'react';

export function renderWithProviders(ui: ReactElement) {
  const store = configureStore({
    reducer: {
      selected: selectedReducer,
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}
