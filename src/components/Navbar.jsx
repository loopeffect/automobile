import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const pathToKey = (path) => {
  if (path === '/' || path === '') return 'home';
  const p = path.replace(/^\//, '');
  return p === 'features' ? 'features' : p === 'technology' ? 'technology' : p === 'models' ? 'models' : null;
};

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeKey = pathToKey(location.pathname);
  const { t, toggleLang } = useLang();

  const navLinks = [
    { key: 'home', label: t.nav.home, to: '/' },
    { key: 'features', label: t.nav.features, to: '/features' },
    { key: 'technology', label: t.nav.technology, to: '/technology' },
    { key: 'models', label: t.nav.models, to: '/models' },
  ];

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-300 ${
      darkMode ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-sm'
    }`}>

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/alvio-logo.png"
          alt="ALVIO"
          className={`h-8 w-auto transition-all duration-300 ${darkMode ? '' : 'invert'}`}
        />
      </Link>

      {/* Desktop Nav Links — centered */}
      <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map(({ key, label, to }) => {
          const isActive = key === activeKey;
          return (
            <li key={key}>
              <Link
                to={to}
                className={`text-sm font-medium transition-colors duration-200 pb-1 ${
                  isActive
                    ? `border-b-2 border-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`
                    : darkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors duration-200 ${
            darkMode
              ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
              : 'border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900'
          }`}
        >
          {t.nav.lang}
        </button>

        {/* Dark / light toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          {darkMode ? (
            /* Sun — shown in dark mode so user can switch to light */
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            /* Moon — shown in light mode so user can switch to dark */
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#06080f]/95 backdrop-blur-md py-5 px-6 flex flex-col gap-4 md:hidden border-t border-white/10">
          {navLinks.map(({ key, label, to }) => (
            <Link
              key={key}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors duration-200 ${
                key === activeKey ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
