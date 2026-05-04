import { Component } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';

export default class App extends Component {
  render() {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex justify-center p-8">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <Header />

          <main className="flex flex-col gap-6">
            <SearchSection />
            <ResultsSection />
          </main>
        </div>
      </div>
    );
  }
}
