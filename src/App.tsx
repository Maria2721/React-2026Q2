import { Component } from 'react';
import type { AppState } from './ts/interfaces';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { fetchCharacters } from './api/characters';
import { storage } from './utils/storage';

export default class App extends Component<object, AppState> {
  state: AppState = {
    query: '',
    results: [],
    loading: false,
    error: null,
    crash: false,
  };

  componentDidMount() {
    const saved = storage.getSearch();

    this.setState({ query: saved }, () => {
      this.fetchData();
    });
  }

  handleChange = (value: string) => {
    this.setState({ query: value });
  };

  handleSearch = () => {
    const trimmed = this.state.query.trim();
    const saved = storage.getSearch();

    if (trimmed === saved) return;

    storage.setSearch(trimmed);

    this.setState({ query: trimmed }, () => {
      this.fetchData();
    });
  };

  fetchData = async () => {
    const { query } = this.state;

    this.setState({ loading: true, error: null });

    try {
      const results = await fetchCharacters(query);

      this.setState({
        results,
        loading: false,
      });
    } catch {
      this.setState({
        error: 'Something went wrong. Try again.',
        loading: false,
        results: [],
      });
    }
  };

  render() {
    const { query, results, loading, error } = this.state;

    if (this.state.crash) {
      throw new Error('Test error');
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex justify-center p-8">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <Header />

          <main className="flex flex-col gap-6">
            <SearchSection
              value={query}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
            />

            <ResultsSection results={results} loading={loading} error={error} />

            <div className="flex justify-end">
              <button
                onClick={() => this.setState({ crash: true })}
                className="px-5 py-2 rounded-xl font-medium text-white transition bg-linear-to-r from-purple-400 to-pink-400 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.95]"
              >
                Test Error
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
