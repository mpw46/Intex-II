import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Cookie consent banner
// ---------------------------------------------------------------------------

const CONSENT_KEY = 'haven-cookie-consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-stone-900 border-t border-stone-700
                 px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-8"
    >
      <p className="text-sm text-stone-300 mb-4 sm:mb-0">
        We use cookies to improve your experience and understand how our site is used.
        Non-essential analytics cookies are only set with your consent.{' '}
        <NavLink to="/privacy" className="text-haven-teal-400 underline underline-offset-2
          hover:text-haven-teal-300 transition-colors duration-150">
          Privacy Policy
        </NavLink>
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={decline}
          className="inline-flex items-center justify-center px-4 py-2
            bg-transparent text-stone-400 text-sm font-medium rounded-lg
            border border-stone-600 transition-colors duration-150
            hover:bg-stone-800 hover:text-stone-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-stone-900"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="inline-flex items-center justify-center px-4 py-2
            bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
            transition-colors duration-150 hover:bg-haven-teal-700
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-stone-900"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(window.scrollY > 60);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const navSolid = !isHome || scrolled;

  const { authSession, isAuthenticated } = useAuth();
  const { isAdmin } = authSession.roles.includes('Admin')
    ? { isAdmin: true }
    : { isAdmin: false };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
                   focus:px-4 focus:py-2 focus:bg-white focus:text-stone-900
                   focus:rounded-lg focus:shadow-lg focus:border focus:border-stone-200"
      >
        Skip to main content
      </a>

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 inset-x-0 h-16 z-30 flex items-center justify-between
                    px-6 md:px-12 transition-all duration-300
                    ${navSolid
                      ? 'bg-white border-b border-stone-200 shadow-sm'
                      : 'bg-haven-teal-900'
                    }`}
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className={`text-xl font-bold tracking-tight transition-colors duration-300
                      ${navSolid ? 'text-stone-900' : 'text-white'}`}
        >
          Haven
        </NavLink>

        <div className="flex items-center gap-6 md:gap-8">
          <NavLink
            to="/impact"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-150
               ${navSolid
                 ? (isActive ? 'text-haven-teal-700' : 'text-stone-600 hover:text-stone-900')
                 : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
               }`
            }
          >
            Impact
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={`text-sm font-medium transition-colors duration-150
                          ${navSolid ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'}`}
            >
              Staff Portal
            </NavLink>
          )}

          {isAuthenticated ? (
            <NavLink
              to="/logout"
              className={`text-sm font-medium transition-colors duration-150
                          ${navSolid ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'}`}
            >
              Sign Out
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={`text-sm font-medium transition-colors duration-150
                          ${navSolid ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'}`}
            >
              Login
            </NavLink>
          )}

          <NavLink
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2
                       bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                       transition-colors duration-150 hover:bg-haven-teal-700
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
          >
            Donate
          </NavLink>
        </div>
      </nav>

      {/* Page content — no container constraints, pages manage their own layout */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Cookie consent banner */}
      <CookieConsent />

      {/* Footer */}
      <footer className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xl font-bold tracking-tight mb-2">Haven</p>
              <p className="text-sm text-stone-400 max-w-sm">
                Providing safe refuge, advocacy, and long-term support for girls who have
                experienced abuse in the Philippines.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-stone-400">
              <NavLink to="/impact" className="hover:text-white transition-colors duration-150">
                Impact
              </NavLink>
              <NavLink to="/privacy" className="hover:text-white transition-colors duration-150">
                Privacy Policy
              </NavLink>
              <NavLink to="/login" className="hover:text-white transition-colors duration-150">
                Staff Login
              </NavLink>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-stone-800">
            <p className="text-xs text-stone-500">
              &copy; {new Date().getFullYear()} Haven. All rights reserved. A 501(c)(3) nonprofit organization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
