'use client';

import { Provider } from 'react-redux';

import { ThemeProvider } from '@/context/theme/ThemeProvider';
import { store } from '@/store/store';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
