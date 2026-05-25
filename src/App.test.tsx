import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import App from './App';

import { store } from './store/store';

const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('App routing', () => {
  it('renders HomePage on / route', () => {
    renderWithRouter(['/']);

    expect(
      screen.getByText(/Rick & Morty Character Explorer/i)
    ).toBeInTheDocument();
  });

  it('renders AboutPage on /about route', () => {
    renderWithRouter(['/about']);

    expect(
      screen.getByText(/React application for searching and exploring/i)
    ).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown route', () => {
    renderWithRouter(['/random-route']);

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
