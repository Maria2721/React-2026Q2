import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RHFForm } from './RHFForm';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { submissionsReducer } from '../../store/submissionsSlice';

type MockState = {
  countries: {
    items: string[];
  };
};

vi.mock('../../utils/toBase64', () => ({
  toBase64: vi.fn().mockResolvedValue('base64-image'),
}));

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (cb: (state: MockState) => unknown) =>
    cb({
      countries: {
        items: ['USA', 'Germany', 'Kazakhstan'],
      },
    }),
}));

vi.mock('crypto', () => ({
  randomUUID: () => 'test-id',
}));

const store = configureStore({
  reducer: {
    submissions: submissionsReducer,
  },
});

const renderForm = () => {
  const onSuccess = vi.fn();

  render(
    <Provider store={store}>
      <RHFForm onSuccess={onSuccess} />
    </Provider>
  );

  return { onSuccess };
};

describe('RHFForm (stable)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form', () => {
    renderForm();

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows password strength', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Password'), '12345678');

    expect(screen.getByTestId('password-strength')).toBeInTheDocument();
  });

  it('submits valid form (with file)', async () => {
    const user = userEvent.setup();
    const { onSuccess } = renderForm();

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@mail.com');
    await user.type(screen.getByLabelText('Password'), 'StrongPass123!');
    await user.type(
      screen.getByLabelText('Confirm Password'),
      'StrongPass123!'
    );

    const male = screen
      .getAllByRole('radio')
      .find((el) => (el as HTMLInputElement).value === 'male')!;

    await user.click(male);

    const fileInput = screen.getByTestId('image-input');

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    await user.upload(fileInput, file);

    await user.type(screen.getByLabelText('Country'), 'USA');
    await user.click(screen.getByLabelText('Accept Terms'));

    const submit = screen.getByRole('button', { name: /submit/i });

    await waitFor(() => {
      expect(submit).not.toBeDisabled();
    });

    await user.click(submit);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
