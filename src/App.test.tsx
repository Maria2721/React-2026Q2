import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

import App from './App';

const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App routing', () => {
  it('renders HomePage on / route', () => {
    renderWithRouter(['/']);

    expect(screen.getByText(/search explorer/i)).toBeInTheDocument();
  });

  it('renders AboutPage on /about route', () => {
    renderWithRouter(['/about']);

    expect(screen.getByText(/about this application/i)).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown route', () => {
    renderWithRouter(['/random-route']);

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
