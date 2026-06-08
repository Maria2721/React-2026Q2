import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmissionCard } from './SubmissionCard';
import {
  mockSubmission,
  createMockSubmission,
} from '../../test/mocks/submission';

describe('SubmissionCard', () => {
  it('renders basic submission data', () => {
    render(<SubmissionCard submission={mockSubmission} />);

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    expect(screen.getByText('Kazakhstan')).toBeInTheDocument();
    expect(screen.getByText('female')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders fallback when image is missing', () => {
    render(
      <SubmissionCard submission={createMockSubmission({ image: null })} />
    );

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(
      <SubmissionCard
        submission={createMockSubmission({
          image: 'https://test.com/avatar.png',
        })}
      />
    );

    const img = screen.getByAltText('Maria');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://test.com/avatar.png');
  });

  it('shows uncontrolled badge', () => {
    render(<SubmissionCard submission={mockSubmission} />);

    expect(screen.getByText('uncontrolled')).toBeInTheDocument();
  });

  it('shows rhf badge style', () => {
    render(
      <SubmissionCard
        submission={createMockSubmission({
          formType: 'rhf',
        })}
      />
    );

    const badge = screen.getByText('rhf');

    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/bg-emerald-100/);
  });

  it('applies isNew styles when submission is new', () => {
    render(
      <SubmissionCard submission={createMockSubmission({ isNew: true })} />
    );

    const card = screen.getByTestId('submission-card');

    expect(card.className).toMatch(/animate-glow/);
    expect(card.className).toMatch(/border-purple-500/);
  });
});
