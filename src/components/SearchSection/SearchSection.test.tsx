import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchSection } from './SearchSection';

describe('SearchSection', () => {
  it('renders title', () => {
    render(<SearchSection value="" onChange={() => {}} onSearch={() => {}} />);

    expect(
      screen.getByRole('heading', { name: /search/i })
    ).toBeInTheDocument();
  });
});
