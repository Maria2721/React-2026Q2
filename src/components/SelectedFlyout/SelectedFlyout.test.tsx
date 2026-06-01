import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SelectedFlyout } from './SelectedFlyout';

import { mockCharacters } from '../../test-utils/mocks';
import { createMockState } from '../../test-utils/createMockState';

import * as csvUtils from '../../utils/generateCSV';
import * as downloadUtils from '../../utils/downloadCSV';

import { clearSelected } from '../../store/selectedSlice';
import * as hooks from '../../store/hooks';

vi.mock('../../store/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

const mockedUseAppDispatch = vi.mocked(hooks.useAppDispatch);
const mockedUseAppSelector = vi.mocked(hooks.useAppSelector);

const mockDispatch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockedUseAppDispatch.mockReturnValue(mockDispatch);
});

describe('SelectedFlyout', () => {
  it('does not render when selected items are empty', () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector(createMockState([]))
    );

    const { container } = render(<SelectedFlyout />);

    expect(container.firstChild).toBeNull();
  });

  it('renders flyout with correct count and text', () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector(createMockState(mockCharacters))
    );

    render(<SelectedFlyout />);

    expect(screen.getByText('Selected characters')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2 characters selected')).toBeInTheDocument();
  });

  it('dispatches clearSelected when Unselect all clicked', async () => {
    const user = userEvent.setup();

    mockedUseAppSelector.mockImplementation((selector) =>
      selector(createMockState(mockCharacters))
    );

    render(<SelectedFlyout />);

    await user.click(screen.getByText('Unselect all'));

    expect(mockDispatch).toHaveBeenCalledWith(clearSelected());
  });

  it('generates CSV and downloads file on click', async () => {
    const user = userEvent.setup();

    const generateSpy = vi.spyOn(csvUtils, 'generateCSV');
    const downloadSpy = vi.spyOn(downloadUtils, 'downloadCSV');

    mockedUseAppSelector.mockImplementation((selector) =>
      selector(createMockState(mockCharacters))
    );

    render(<SelectedFlyout />);

    await user.click(screen.getByText('Download CSV'));

    expect(generateSpy).toHaveBeenCalledWith(mockCharacters);

    expect(downloadSpy).toHaveBeenCalledWith(expect.any(String), '2_items.csv');
  });

  it('does not render when items are empty (duplicate safety check)', () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector(createMockState([]))
    );

    const { container } = render(<SelectedFlyout />);

    expect(container.firstChild).toBeNull();
  });
});
