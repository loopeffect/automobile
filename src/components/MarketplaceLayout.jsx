import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useStore from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import { animated, useSpring } from '@react-spring/web';

const AlvioLogo = () => (
  <Link to="/" className="flex items-center flex-shrink-0">
    <img src="/alvio-logo.png" alt="ALVIO" className="h-8 w-auto" />
  </Link>
);

const UserMenu = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashboardPath =
    user.role === 'admin' ? '/dashboard/admin'
    : user.role === 'dealer' ? '/dashboard/dealer'
    : '/dashboard/buyer';

  const roleColor = { admin: 'text-yellow-400', dealer: 'text-blue-400', buyer: 'text-green-400' };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full pl-1 pr-3 py-1 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            : user.name?.[0]?.toUpperCase()
          }
        </div>
        <span className="text-white text-sm font-medium hidden sm:block max-w-[100px] truncate">{user.name}</span>
        <svg className={`w-3 h-3 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#0f1d40] border border-blue-900/50 rounded-2xl shadow-xl overflow-hidden z-50">
          {/* Role badge */}
          <div className="px-4 py-3 border-b border-blue-900/30">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className={`text-xs font-medium capitalize mt-0.5 ${roleColor[user.role]}`}>{user.role}</p>
          </div>

          <div className="py-1">
            <Link to={dashboardPath} onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-blue-200/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>

            <Link to="/messages" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-blue-200/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Messages
            </Link>

            {user.role === 'buyer' && (
              <Link to="/my-orders" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-blue-200/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                My Orders
              </Link>
            )}

            {(user.role === 'dealer' || user.role === 'admin') && (
              <Link to="/listings/add" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-blue-200/80 hover:text-white hover:bg-white/5 text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Listing
              </Link>
            )}
          </div>

          <div className="border-t border-blue-900/30 py-1">
            <button onClick={() => { logout(); setOpen(false); navigate('/'); }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm w-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MarketplaceLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const orbA = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.16 },
    to: async (next) => {
      while (1) {
        await next({ transform: 'translate3d(30px, -20px, 0px) scale(1.08)', opacity: 0.24 });
        await next({ transform: 'translate3d(-18px, 24px, 0px) scale(0.96)', opacity: 0.15 });
        await next({ transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.16 });
      }
    },
    config: { mass: 7, tension: 28, friction: 24 },
  });

  const orbB = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.2 },
    to: async (next) => {
      while (1) {
        await next({ transform: 'translate3d(-26px, 22px, 0px) scale(1.05)', opacity: 0.28 });
        await next({ transform: 'translate3d(22px, -14px, 0px) scale(0.94)', opacity: 0.18 });
        await next({ transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.2 });
      }
    },
    config: { mass: 8, tension: 26, friction: 22 },
  });

  const navLinks = [
    { label: 'Browse', to: '/listings' },
    { label: 'Dealers', to: '/dealers' },
  ];

  const activeCls = 'text-white border-b-2 border-blue-500 pb-0.5';
  const inactiveCls = 'text-white/60 hover:text-white transition-colors';

  return (
    <div className="alvio-market-root min-h-screen flex flex-col bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <animated.div
          style={orbA}
          className="absolute -top-28 -left-24 w-[28rem] h-[28rem] rounded-full bg-blue-500/30 blur-3xl"
        />
        <animated.div
          style={orbB}
          className="absolute top-40 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#0f1d40] blur-3xl"
        />
      </div>

      {/* ── Top Nav ── */}
      <header className="bg-[#0b1630]/85 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-black/20 border-b border-blue-900/40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">

          <AlvioLogo />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map(({ label, to }) => (
              <motion.div key={to} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}>
                <NavLink to={to}
                  className={({ isActive }) => `text-sm font-medium ${isActive ? activeCls : inactiveCls}`}>
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Messages icon with unread badge */}
            {user && (
              <Link to="/messages" className="relative p-2 text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-blue-900/40 bg-[#0b1630]/95 backdrop-blur-md px-4 py-3 flex flex-col gap-3"
            >
              {navLinks.map(({ label, to }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {label}
                </NavLink>
              ))}
              {!user && (
                <div className="flex gap-3 pt-2 border-t border-blue-900/30">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center border border-blue-700 text-white text-sm py-2 rounded-xl">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center bg-blue-500 text-white text-sm py-2 rounded-xl">Register</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer strip ── */}
      <footer className="bg-[#0b1630]/90 backdrop-blur-md py-4 px-4 sm:px-6 text-center text-blue-200/50 text-xs border-t border-blue-900/30 relative z-10">
        © {new Date().getFullYear()} ALVIO Automotive Marketplace · All rights reserved
      </footer>
    </div>
  );
};

export default MarketplaceLayout;
