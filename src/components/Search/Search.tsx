import { useState } from 'react';

import type { SearchProps } from '../../ts/interfaces';

export function Search({ value, onChange, onSearch }: SearchProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const triggerSearch = () => {
    onSearch();
    setIsPressed(true);

    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    triggerSearch();
  };

  return (
    <form
      data-testid="search-form"
      onSubmit={handleSubmit}
      className="
          flex items-center gap-3 p-2 rounded-2xl border border-gray-800
          bg-white shadow-sm transition
          focus-within:border-blue-500
          focus-within:ring-2 focus-within:ring-blue-200
        "
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search anything..."
        className="
            flex-1 bg-transparent px-3 py-2
            text-gray-800 placeholder-gray-400
            outline-none
          "
      />

      <button
        aria-pressed={isPressed}
        type="submit"
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
    </form>
  );
}
