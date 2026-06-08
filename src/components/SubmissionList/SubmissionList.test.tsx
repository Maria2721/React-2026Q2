import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmissionList } from './SubmissionList';
import {
  mockSubmission,
  createMockSubmission,
} from '../../test/mocks/submission';
import type { Submission } from '../../types/form';

type Props = {
  submission: Submission;
};

vi.mock('../SubmissionCard/SubmissionCard', () => ({
  SubmissionCard: ({ submission }: Props) => (
    <div data-testid="submission-card">{submission.id}</div>
  ),
}));

describe('SubmissionList', () => {
  it('renders all submissions', () => {
    const submissions = [
      mockSubmission,
      createMockSubmission({ id: '2', name: 'Alex' }),
      createMockSubmission({ id: '3', name: 'John' }),
    ];

    render(<SubmissionList submissions={submissions} />);

    const cards = screen.getAllByTestId('submission-card');

    expect(cards).toHaveLength(3);
  });

  it('passes correct ids to SubmissionCard', () => {
    const submissions = [mockSubmission, createMockSubmission({ id: '2' })];

    render(<SubmissionList submissions={submissions} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders empty list when no submissions provided', () => {
    render(<SubmissionList submissions={[]} />);

    expect(screen.queryAllByTestId('submission-card')).toHaveLength(0);
  });
});
