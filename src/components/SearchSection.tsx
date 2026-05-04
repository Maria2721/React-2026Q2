import { Component } from 'react';
import type { SearchState } from '../ts/interfaces';
import { Search } from './Search';

export class SearchSection extends Component<object, SearchState> {
  state: SearchState = {
    value: '',
  };

  componentDidMount() {
    const saved = localStorage.getItem('search');

    if (saved) {
      this.setState({ value: saved });
    }
  }

  handleChange = (value: string) => {
    this.setState({ value });
  };

  handleSearch = () => {
    const trimmed = this.state.value.trim();
    const saved = localStorage.getItem('search');

    if (trimmed === saved) return;

    localStorage.setItem('search', trimmed);
  };

  render() {
    return (
      <section className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">⚡ Search</h2>

        <Search
          value={this.state.value}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
        />
      </section>
    );
  }
}
