import { Component } from 'react';
import type { SearchProps, PressedState } from '../ts/interfaces';

export class Search extends Component<SearchProps, PressedState> {
  state: PressedState = {
    isPressed: false,
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  };

  triggerSearch = () => {
    this.props.onSearch();

    this.setState({ isPressed: true });

    setTimeout(() => {
      this.setState({ isPressed: false });
    }, 150);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.triggerSearch();
    }
  };

  render() {
    const { value } = this.props;
    const { isPressed } = this.state;

    return (
      <div
        className="
          flex items-center gap-3 p-2 rounded-2xl border border-gray-800
          bg-white shadow-sm transition
          focus-within:border-blue-500
          focus-within:ring-2 focus-within:ring-blue-200
        "
      >
        <input
          value={value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Search anything..."
          className="
            flex-1 bg-transparent px-3 py-2
            text-gray-800 placeholder-gray-400
            outline-none
          "
        />

        <button
          onClick={this.triggerSearch}
          className={`
            px-5 py-2 rounded-xl font-medium text-white transition
            bg-linear-to-r from-blue-500 to-indigo-500
            shadow-sm hover:shadow-md hover:scale-[1.02]
            active:scale-[0.95]
            ${isPressed ? 'scale-[0.95] shadow-inner' : ''}
          `}
        >
          Search
        </button>
      </div>
    );
  }
}
