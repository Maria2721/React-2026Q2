import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterDetailsPage from './CharacterDetailsPage';

import { fetchCharacterById } from '../../api/characters';
import { mockCharacters } from '../../test-utils/mocks';

const mockCloseDetails = vi.fn();

vi.mock('react-router', () => ({
  useOutletContext: () => ({
    detailsId: '1',
    closeDetails: mockCloseDetails,
  }),
}));

vi.mock('../../api/characters', () => ({
  fetchCharacterById: vi.fn(),
}));

describe('CharacterDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches character on mount', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacters[0]);

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(fetchCharacterById).toHaveBeenCalledWith('1');
    });
  });

  it('renders loading state', () => {
    vi.mocked(fetchCharacterById).mockImplementation(
      () =>
        new Promise(() => {
          // pending promise
        })
    );

    render(<CharacterDetailsPage />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders character details after successful fetch', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacters[0]);

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCharacters[0].name)).toBeInTheDocument();
    });

    expect(screen.getByText(mockCharacters[0].status)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].species)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].gender)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].origin.name)).toBeInTheDocument();

    expect(
      screen.getByText(mockCharacters[0].location.name)
    ).toBeInTheDocument();
  });

  it('renders character image', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacters[0]);

    render(<CharacterDetailsPage />);

    const image = await screen.findByAltText(mockCharacters[0].name);

    expect(image).toHaveAttribute('src', mockCharacters[0].image);

    expect(image).toHaveAttribute('alt', mockCharacters[0].name);
  });

  it('renders episodes count', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacters[0]);

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(String(mockCharacters[0].episode.length))
      ).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    vi.mocked(fetchCharacterById).mockRejectedValue(new Error('API Error'));

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load character')).toBeInTheDocument();
    });
  });

  it('calls closeDetails when close button clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacters[0]);

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCharacters[0].name)).toBeInTheDocument();
    });

    const button = screen.getByRole('button');

    await user.click(button);

    expect(mockCloseDetails).toHaveBeenCalled();
  });

  it('renders Unknown when card value is missing', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue({
      ...mockCharacters[0],
      origin: { name: '' },
    });

    render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  it('returns null when character is not loaded yet', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValue(null as never);

    const { container } = render(<CharacterDetailsPage />);

    await waitFor(() => {
      expect(fetchCharacterById).toHaveBeenCalled();
    });

    expect(container).toBeEmptyDOMElement();
  });
});
