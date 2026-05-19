import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders current page and total pages', () => {
    render(
      <Pagination page={2} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPrev when prev button clicked', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();

    render(
      <Pagination page={2} totalPages={5} onNext={vi.fn()} onPrev={onPrev} />
    );

    await user.click(screen.getByLabelText('Previous page'));

    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when next button clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(
      <Pagination page={2} totalPages={5} onNext={onNext} onPrev={vi.fn()} />
    );

    await user.click(screen.getByLabelText('Next page'));

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables prev button on first page', () => {
    render(
      <Pagination page={1} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
    );

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination page={5} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
    );

    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('enables both buttons on middle page', () => {
    render(
      <Pagination page={3} totalPages={5} onNext={vi.fn()} onPrev={vi.fn()} />
    );

    expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });
});
