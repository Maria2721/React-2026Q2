import type { RootState } from './store';

export const selectSelectedItems = (state: RootState) => state.selected.items;

export const selectIsSelected = (id: number) => (state: RootState) =>
  state.selected.items.some((item) => item.id === id);
