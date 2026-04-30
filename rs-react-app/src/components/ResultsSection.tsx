import { Component } from 'react';

export class ResultsSection extends Component {
  render() {
    return (
      <section className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">📦 Results</h2>

        <div className="text-gray-400 text-sm min-h-62.5 flex items-center justify-center">
          No results yet
        </div>
      </section>
    );
  }
}
