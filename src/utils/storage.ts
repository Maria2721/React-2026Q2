const SEARCH_KEY = 'search';

export const storage = {
  getSearch: () => localStorage.getItem(SEARCH_KEY) || '',
  setSearch: (value: string) => localStorage.setItem(SEARCH_KEY, value),
};
