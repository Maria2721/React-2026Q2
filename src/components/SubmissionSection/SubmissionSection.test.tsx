import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmissionSection } from './SubmissionSection';
import { mockSubmission } from '../../test/mocks/submission';
import type { Submission } from '../../types/form';

const fakeState = {
  submissions: {
    items: [] as Submission[],
  },
};

vi.mock('../../store/hooks', () => ({
  useAppSelector: (selector: (state: typeof fakeState) => unknown) =>
    selector(fakeState),
}));

vi.mock('../SubmissionList/SubmissionList', () => ({
  SubmissionList: ({ submissions }: { submissions: Submission[] }) => (
    <div data-testid="submission-list">
      {submissions.map((s) => (
        <div key={s.id}>{s.id}</div>
      ))}
    </div>
  ),
}));

describe('SubmissionSection', () => {
  beforeEach(() => {
    fakeState.submissions.items = [];
  });

  it('renders empty state when submissions array is empty', () => {
    render(<SubmissionSection />);

    expect(
      screen.getByText('Submitted forms will appear here')
    ).toBeInTheDocument();

    expect(screen.queryByTestId('submission-list')).not.toBeInTheDocument();
  });

  it('renders SubmissionList when submissions exist', () => {
    fakeState.submissions.items = [
      mockSubmission,
      { ...mockSubmission, id: '2' },
    ];

    render(<SubmissionSection />);

    expect(screen.getByTestId('submission-list')).toBeInTheDocument();

    expect(
      screen.queryByText('Submitted forms will appear here')
    ).not.toBeInTheDocument();
  });

  it('handles single submission correctly (edge case)', () => {
    fakeState.submissions.items = [mockSubmission];

    render(<SubmissionSection />);

    expect(screen.getByTestId('submission-list')).toBeInTheDocument();
  });

  it('ensures conditional rendering switches correctly', () => {
    fakeState.submissions.items = [];
    const { rerender } = render(<SubmissionSection />);

    expect(
      screen.getByText('Submitted forms will appear here')
    ).toBeInTheDocument();

    fakeState.submissions.items = [mockSubmission];

    rerender(<SubmissionSection />);

    expect(screen.getByTestId('submission-list')).toBeInTheDocument();
  });
});
