import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UncontrolledForm } from './UncontrolledForm';

const dispatchMock = vi.fn();
const safeParseMock = vi.fn();

vi.mock('../../store/hooks', () => ({
  useAppSelector: () => ['USA', 'Germany'],
  useAppDispatch: () => dispatchMock,
}));

vi.mock('../../store/submissionsSlice', () => ({
  addSubmission: (payload: unknown) => ({
    type: 'addSubmission',
    payload,
  }),
  markAsOld: (id: string) => ({
    type: 'markAsOld',
    payload: id,
  }),
}));

vi.mock('../../validation/formSchema', () => ({
  formSchema: () => ({
    safeParse: safeParseMock,
  }),
}));

vi.mock('../../utils/toBase64', () => ({
  toBase64: vi.fn(async () => 'base64-image'),
}));

vi.mock('../../utils/getPasswordStrength', () => ({
  getPasswordStrength: (value: string) => {
    if (value.length < 4) return 'Weak';
    if (value.length < 8) return 'Medium';
    return 'Strong';
  },
}));

const renderForm = (onSuccess = vi.fn()) => {
  render(<UncontrolledForm onSuccess={onSuccess} />);
  return { onSuccess };
};

const fillForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John' },
  });

  fireEvent.change(screen.getByLabelText('Age'), {
    target: { value: '25' },
  });

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'john@mail.com' },
  });

  fireEvent.click(screen.getByLabelText('Male'));

  fireEvent.change(screen.getByLabelText('Country'), {
    target: { value: 'USA' },
  });

  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: '12345678' },
  });

  fireEvent.change(screen.getByLabelText('Confirm Password'), {
    target: { value: '12345678' },
  });

  fireEvent.click(screen.getByLabelText('Accept Terms'));
};

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    safeParseMock.mockReset();
  });

  it('renders form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('updates password strength', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123' },
    });

    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it('shows validation errors when schema fails', async () => {
    safeParseMock.mockReturnValueOnce({
      success: false,
      error: {
        issues: [
          { path: ['name'], message: 'Name is required' },
          { path: ['email'], message: 'Email invalid' },
        ],
      },
    });

    renderForm();

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email invalid')).toBeInTheDocument();
    });
  });

  it('resets form after submit', async () => {
    safeParseMock.mockReturnValueOnce({
      success: true,
      data: {
        name: 'John',
        age: '25',
        email: 'john@mail.com',
        gender: 'male',
        country: 'USA',
        password: '12345678',
        confirmPassword: '12345678',
        terms: true,
        image: null,
      },
    });

    renderForm();

    fillForm();

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
    });
  });

  it('dispatches submission with image conversion', async () => {
    const { toBase64 } = await import('../../utils/toBase64');

    safeParseMock.mockReturnValueOnce({
      success: true,
      data: {
        name: 'John',
        age: '25',
        email: 'john@mail.com',
        gender: 'male',
        country: 'USA',
        password: '12345678',
        confirmPassword: '12345678',
        terms: true,
        image: new File(['img'], 'test.png', { type: 'image/png' }),
      },
    });

    renderForm();

    const fileInput = screen.getByLabelText('Image') as HTMLInputElement;

    const file = new File(['img'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(toBase64).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalled();
    });
  });
});
