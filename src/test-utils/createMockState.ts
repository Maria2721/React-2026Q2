import { charactersApi } from '../store/charactersApi';
import type { RootState } from '../store/store';

const baseApiState = charactersApi.reducer(undefined, { type: '@@INIT' });

export function createMockState(items: RootState['selected']['items'] = []) {
  return {
    selected: {
      items,
    },
    charactersApi: baseApiState,
  } as RootState;
}
