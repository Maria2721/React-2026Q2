interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

interface PressedState {
  isPressed: boolean;
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  episode: string[];
}

interface AppState {
  query: string;
  results: Character[];
  loading: boolean;
  error: string | null;
  crash: boolean;
}

interface ResultsProps {
  results: Character[];
  loading: boolean;
  error: string | null;
}

interface ApiResponse {
  results?: Character[];
  error?: string;
}

export type {
  SearchProps,
  PressedState,
  AppState,
  ResultsProps,
  Character,
  ApiResponse,
};
