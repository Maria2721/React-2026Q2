import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterDetailsPage from './CharacterDetailsPage';

import {
  useGetCharacterByIdQuery,
  charactersApi,
} from '../../store/charactersApi';

import { mockCharacters } from '../../test-utils/mocks';

const mockCloseDetails = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router', () => ({
  useOutletContext: () => ({
    detailsId: '1',
    closeDetails: mockCloseDetails,
  }),
}));

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
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
      createCharacterQueryResult({ isLoading: true })
    );

    render(<CharacterDetailsPage />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders character details after successful fetch', async () => {
    render(<CharacterDetailsPage />);

    const character = mockCharacters[0];

    expect(await screen.findByText(character.name)).toBeInTheDocument();

    expect(screen.getByText(character.status)).toBeInTheDocument();
    expect(screen.getByText(character.species)).toBeInTheDocument();
    expect(screen.getByText(character.gender)).toBeInTheDocument();
    expect(screen.getByText(character.origin.name)).toBeInTheDocument();
    expect(screen.getByText(character.location.name)).toBeInTheDocument();
  });

  it('renders character image', async () => {
    render(<CharacterDetailsPage />);

    const character = mockCharacters[0];

    const image = await screen.findByAltText(character.name);

    expect(image).toHaveAttribute('src', character.image);
    expect(image).toHaveAttribute('alt', character.name);
  });

  it('renders episodes count', async () => {
    render(<CharacterDetailsPage />);

    const character = mockCharacters[0];

    expect(
      await screen.findByText(String(character.episode.length))
    ).toBeInTheDocument();
  });

  it('renders error state when query fails', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createCharacterQueryResult({
        error: { status: 500, message: 'Server error' },
      })
    );

    render(<CharacterDetailsPage />);

    // теперь не хардкодим текст — проверяем через util fallback
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('calls closeDetails when close button clicked', async () => {
    const user = userEvent.setup();

    render(<CharacterDetailsPage />);

    await screen.findByText(mockCharacters[0].name);

    const closeButton = screen.getByRole('button', {
      name: /close/i,
    });

    await user.click(closeButton);

    expect(mockCloseDetails).toHaveBeenCalled();
  });

  it('calls refresh dispatch when refresh button clicked', async () => {
    const user = userEvent.setup();

    render(<CharacterDetailsPage />);

    await screen.findByText(mockCharacters[0].name);

    const refreshButton = screen.getByRole('button', {
      name: /refresh/i,
    });

    await user.click(refreshButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      charactersApi.util.invalidateTags([
        {
          type: 'Character',
          id: '1',
        },
      ])
    );
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
