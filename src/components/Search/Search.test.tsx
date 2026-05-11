import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Search } from './Search';

describe('Search', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders input value', () => {
    render(<Search value="Rick" onChange={() => {}} onSearch={() => {}} />);

    expect(screen.getByDisplayValue('Rick')).toBeInTheDocument();
  });

  it('calls onChange with typed value', () => {
    const handleChange = vi.fn();

    render(<Search value="" onChange={handleChange} onSearch={() => {}} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'Morty' },
    });

    expect(handleChange).toHaveBeenCalledWith('Morty');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch on form submit', () => {
    const handleSearch = vi.fn();

    render(<Search value="Rick" onChange={() => {}} onSearch={handleSearch} />);

    const form = screen.getByTestId('search-form');

    fireEvent.submit(form);

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('adds pressed styles temporarily after submit', () => {
    vi.useFakeTimers();

    render(<Search value="Rick" onChange={() => {}} onSearch={() => {}} />);

    const form = screen.getByTestId('search-form');

    const button = screen.getByRole('button', {
      name: /search/i,
    });

    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.submit(form);

    expect(button).toHaveAttribute('aria-pressed', 'true');

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
