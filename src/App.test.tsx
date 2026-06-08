import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

vi.mock('./components/SubmissionSection/SubmissionSection', () => ({
  SubmissionSection: () => <div data-testid="submission-section" />,
}));

vi.mock('./components/UncontrolledForm/UncontrolledForm', () => ({
  UncontrolledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Submit Uncontrolled</button>
  ),
}));

vi.mock('./components/RHFForm/RHFForm', () => ({
  RHFForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Submit RHF</button>
  ),
}));

vi.mock('./components/Modal/Modal', () => ({
  Modal: ({
    isOpen,
    title,
    children,
    onClose,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div>
        <div data-testid="modal-title">{title}</div>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main buttons and submission section', () => {
    render(<App />);

    expect(screen.getByText('Open Uncontrolled Form')).toBeInTheDocument();

    expect(screen.getByText('Open React Hook Form')).toBeInTheDocument();

    expect(screen.getByTestId('submission-section')).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Open Uncontrolled Form'));

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      'Uncontrolled Form'
    );

    expect(screen.getByText('Submit Uncontrolled')).toBeInTheDocument();
  });

  it('opens RHF modal', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Open React Hook Form'));

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      'React Hook Form'
    );

    expect(screen.getByText('Submit RHF')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Open React Hook Form'));

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('closes modal on form success (uncontrolled)', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Open Uncontrolled Form'));
    fireEvent.click(screen.getByText('Submit Uncontrolled'));

    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('closes modal on form success (RHF)', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Open React Hook Form'));
    fireEvent.click(screen.getByText('Submit RHF'));

    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });
});
