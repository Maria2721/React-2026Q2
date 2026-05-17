import { Search } from '../Search/Search';

import type { SearchProps } from '../../ts/interfaces';

export function SearchSection({ value, onChange, onSearch }: SearchProps) {
  return (
    <section className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">⚡ Search</h2>

      <Search value={value} onChange={onChange} onSearch={onSearch} />
    </section>
  );
}
