import { Component } from 'react';
import type { SearchProps } from '../ts/interfaces';
import { Search } from './Search';

export class SearchSection extends Component<SearchProps> {
  render() {
    const { value, onChange, onSearch } = this.props;

    return (
      <section className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">⚡ Search</h2>

        <Search value={value} onChange={onChange} onSearch={onSearch} />
      </section>
    );
  }
}
