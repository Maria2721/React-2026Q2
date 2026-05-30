import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterDetailsPage from './CharacterDetailsPage';

import { useGetCharacterByIdQuery } from '../../store/charactersApi';
import { mockCharacters } from '../../test-utils/mocks';

const mockCloseDetails = vi.fn();

vi.mock('react-router', () => ({
  useOutletContext: () => ({
    detailsId: '1',
    closeDetails: mockCloseDetails,
  }),
}));

vi.mock('../../store/charactersApi', async () => {
  const actual = await vi.importActual<
    typeof import('../../store/charactersApi')
  >('../../store/charactersApi');

  return {
    ...actual,
    useGetCharacterByIdQuery: vi.fn(),
  };
});

const mockUseGetCharacterByIdQuery = vi.mocked(useGetCharacterByIdQuery);

const createCharacterQueryResult = ({
  character = mockCharacters[0],
  isLoading = false,
  error = undefined,
}: {
  character?: (typeof mockCharacters)[number] | null;
  isLoading?: boolean;
  error?: unknown;
}) =>
  ({
    data: character,
    isLoading,
    error,
  }) as never;

describe('CharacterDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({})
    );
  });

  it('calls query hook with details id', () => {
    render(<CharacterDetailsPage />);

    expect(mockUseGetCharacterByIdQuery).toHaveBeenCalledWith('1');
  });

  it('renders loading state', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        isLoading: true,
      })
    );

    render(<CharacterDetailsPage />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders character details after successful fetch', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: mockCharacters[0],
      })
    );

    render(<CharacterDetailsPage />);

    expect(await screen.findByText(mockCharacters[0].name)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].status)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].species)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].gender)).toBeInTheDocument();

    expect(screen.getByText(mockCharacters[0].origin.name)).toBeInTheDocument();

    expect(
      screen.getByText(mockCharacters[0].location.name)
    ).toBeInTheDocument();
  });

  it('renders character image', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: mockCharacters[0],
      })
    );

    render(<CharacterDetailsPage />);

    const image = await screen.findByAltText(mockCharacters[0].name);

    expect(image).toHaveAttribute('src', mockCharacters[0].image);

    expect(image).toHaveAttribute('alt', mockCharacters[0].name);
  });

  it('renders episodes count', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: mockCharacters[0],
      })
    );

    render(<CharacterDetailsPage />);

    expect(
      await screen.findByText(String(mockCharacters[0].episode.length))
    ).toBeInTheDocument();
  });

  it('renders error state when query fails', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        error: { status: 500 },
      })
    );

    render(<CharacterDetailsPage />);

    expect(
      await screen.findByText('Failed to load character')
    ).toBeInTheDocument();
  });

  it('calls closeDetails when close button clicked', async () => {
    const user = userEvent.setup();

    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: mockCharacters[0],
      })
    );

    render(<CharacterDetailsPage />);

    await screen.findByText(mockCharacters[0].name);

    const button = screen.getByRole('button');

    await user.click(button);

    expect(mockCloseDetails).toHaveBeenCalled();
  });

  it('renders Unknown when card value is missing', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: {
          ...mockCharacters[0],
          origin: { name: '' },
        },
      })
    );

    render(<CharacterDetailsPage />);

    expect(await screen.findByText('Unknown')).toBeInTheDocument();
  });

  it('returns null when character is missing', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        character: null,
      })
    );

    const { container } = render(<CharacterDetailsPage />);

    expect(container).toBeEmptyDOMElement();
  });
});
