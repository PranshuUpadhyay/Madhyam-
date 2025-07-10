import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';

const UserMenu = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  if (!user) return null;
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
        {initials}
      </div>
      <span className="font-semibold text-gray-700">{user.firstName}</span>
      <button
        onClick={() => {
          logout();
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/');
        }}
        className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

const HomeHeader = () => {
  const { isAuthenticated } = useApp();
  return (
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
            {!isAuthenticated && (
              <li>
                <Link
                  to="/signup"
                  className="block px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-t border-b border-transparent hover:border-black hover:border-l hover:border-r transition-all duration-300"
                >
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {isAuthenticated && <UserMenu />}
      </div>
    </header>
  );
};

const DefaultHeader = () => {
  const { isAuthenticated } = useApp();
  return (
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
            {!isAuthenticated && (
              <li>
                <Link
                  to="/signup"
                  className="block px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-t border-b border-transparent hover:border-black hover:border-l hover:border-r transition-all duration-300"
                >
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {isAuthenticated && <UserMenu />}
      </div>
    </header>
  );
};

const Header = () => {
  const location = useLocation();
  return location.pathname === '/' ? <HomeHeader /> : <DefaultHeader />;
};

export default Header;
