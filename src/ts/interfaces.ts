interface SearchState {
  value: string;
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

interface PressedState {
  isPressed: boolean;
}

export type { SearchState, SearchProps, PressedState };
