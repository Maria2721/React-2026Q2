import clsx from 'clsx';
import { NavLink } from 'react-router';

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'relative text-md font-medium transition-all duration-200',
    'hover:text-indigo-500',

    'after:content-[""] after:absolute after:left-0 after:-bottom-1',
    'after:h-[2px] after:w-full after:transition-transform after:duration-300',

    {
      'text-indigo-500 after:scale-x-100 after:bg-indigo-500': isActive,
      'text-gray-700 after:scale-x-0 after:bg-indigo-400': !isActive,
    }
  );

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-8 py-4 flex gap-6">
        <NavLink to="/" className={getLinkClass}>
          Home
        </NavLink>

        <NavLink to="/about" className={getLinkClass}>
          About
        </NavLink>
      </nav>

      <div className="h-0.5 w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70" />
    </header>
  );
}
