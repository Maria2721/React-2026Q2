import { Component } from 'react';

export class Header extends Component {
  render() {
    return (
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">🔍 Search Explorer</h1>
        <p className="text-gray-500 mt-1">Find and explore items instantly</p>
      </header>
    );
  }
}
