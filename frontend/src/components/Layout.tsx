import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../api/authAPI';
import transparentLogo from '../assets/transparent-logo.png';
import DonateModal from './DonateModal';


function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { resetConsent } = useCookieConsent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(window.scrollY > 60);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const navSolid = !isHome || scrolled;

  const { authSession, isAuthenticated } = useAuth();
  const isAdmin = authSession.roles.includes('Admin');
  const isDonor = isAuthenticated && !isAdmin;
  const [donateOpen, setDonateOpen] = useState(false);
  const [donorDisplayName, setDonorDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!isDonor) { setDonorDisplayName(null); return; }
    getMyProfile().then((p) => {
      const name =
        p.displayName?.trim() ||
        [p.firstName, p.lastName].filter(Boolean).join(' ') ||
        p.organizationName?.trim() ||
        null;
      setDonorDisplayName(name);
    }).catch(() => {});
  }, [isDonor]);


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
        <NavLink to="/" className="flex items-center shrink-0">
          <img
            src={transparentLogo}
            alt="Haven"
            className="h-10 w-auto shrink-0"
          />
        </NavLink>

        <div className="flex items-center gap-6 md:gap-8">
          {isDonor && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150
                 ${navSolid
                   ? (isActive ? 'text-haven-teal-700' : 'text-stone-600 hover:text-stone-900')
                   : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                 }`
              }
            >
              Home
            </NavLink>
          )}

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
            Our Impact
          </NavLink>

          {isDonor && (
            <NavLink
              to="/donor"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150
                 ${navSolid
                   ? (isActive ? 'text-haven-teal-700' : 'text-stone-600 hover:text-stone-900')
                   : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                 }`
              }
            >
              My Donations
            </NavLink>
          )}

          {isDonor && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150
                 ${navSolid
                   ? (isActive ? 'text-haven-teal-700' : 'text-stone-600 hover:text-stone-900')
                   : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                 }`
              }
            >
              Profile
            </NavLink>
          )}

          {isDonor && (
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150
                 ${navSolid
                   ? (isActive ? 'text-haven-teal-700' : 'text-stone-600 hover:text-stone-900')
                   : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                 }`
              }
            >
              Privacy Policy
            </NavLink>
          )}

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
            <span className={`text-sm transition-colors duration-300
                              ${navSolid ? 'text-stone-500' : 'text-white/70'}`}>
              {donorDisplayName ?? authSession.email}
            </span>
          ) : null}

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

          {!isAuthenticated && (
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
          )}
        </div>
      </nav>

      {/* Page content — no container constraints, pages manage their own layout */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Floating donate button — opens modal for authenticated donors */}
      {isDonor && (
        <button
          type="button"
          onClick={() => setDonateOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2
                     px-5 py-3 bg-haven-teal-600 text-white text-sm font-semibold
                     rounded-full shadow-lg hover:bg-haven-teal-700 transition-colors
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Donate
        </button>
      )}

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />


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
                Our Impact
              </NavLink>
              <NavLink to="/privacy" className="hover:text-white transition-colors duration-150">
                Privacy Policy
              </NavLink>
              <button
                type="button"
                onClick={resetConsent}
                className="hover:text-white transition-colors duration-150 text-left"
              >
                Cookie Preferences
              </button>
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
