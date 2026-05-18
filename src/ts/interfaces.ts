interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
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
  info?: {
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results?: Character[];
  error?: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

export type {
  SearchProps,
  AppState,
  ResultsProps,
  Character,
  ApiResponse,
  PaginationProps,
};
