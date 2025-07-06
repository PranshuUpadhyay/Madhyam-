import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const HomeHeader = () => (
  <header className="absolute top-0 left-0 w-full z-50 bg-white bg-opacity-60">
    <div className="w-full px-4 py-4 flex items-center justify-between text-gray-500">
      <Logo size="h-20 w-auto" />
      <nav className="flex-1">
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl lg:text-[20px] font-semibold">
          {[
            { label: 'Home', to: '/' },
            { label: 'Specials', to: '/specials' },
            { label: 'About', to: '/about' },
            { label: 'See your nearest Donor!', to: '/menu' },
            { label: 'Connect with us', to: '/contact' },
            { label: 'Sign up', to: '/signup' },
          ].map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="block px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-t border-b border-transparent hover:border-black hover:border-l hover:border-r transition-all duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);

const DefaultHeader = () => (
  <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md">
    <div className="w-full px-4 py-3 flex items-center justify-between text-gray-500">
      <Logo size="h-16" />
      <nav className="flex-1">
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl lg:text-[20px] font-semibold">
          {[
            { label: 'Home', to: '/' },
            { label: 'Specials', to: '/specials' },
            { label: 'About', to: '/about' },
            { label: 'See your nearest Donor!', to: '/menu' },
            { label: 'Connect with us', to: '/contact' },
            { label: 'Sign up', to: '/signup' },
          ].map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="block px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-t border-b border-transparent hover:border-black hover:border-l hover:border-r transition-all duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);

const Header = () => {
  const location = useLocation();
  return location.pathname === '/' ? <HomeHeader /> : <DefaultHeader />;
};

export default Header;
