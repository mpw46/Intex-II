import { useState, type ReactElement } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function GridIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Nav configuration
// ---------------------------------------------------------------------------

type NavItemConfig = {
  to: string;
  label: string;
  end?: boolean;
  Icon: () => ReactElement;
};

const navItems: NavItemConfig[] = [
  { to: '/admin',                   label: 'Dashboard',            end: true, Icon: GridIcon },
  { to: '/admin/donors',            label: 'Donors & Contributions',           Icon: UsersIcon },
  { to: '/admin/caseload',          label: 'Caseload',                         Icon: FolderIcon },
  { to: '/admin/process-recording', label: 'Process Recording',                Icon: ClipboardIcon },
  { to: '/admin/home-visitation',   label: 'Home Visitation',                  Icon: HomeIcon },
  { to: '/admin/reports',           label: 'Reports & Analytics',              Icon: ChartIcon },
];

const pageTitles: Record<string, string> = {
  '/admin':                   'Dashboard',
  '/admin/donors':            'Donors & Contributions',
  '/admin/caseload':          'Caseload',
  '/admin/process-recording': 'Process Recording',
  '/admin/home-visitation':   'Home Visitation',
  '/admin/reports':           'Reports & Analytics',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Admin';
  const { authSession, isAuthenticated, isLoading } = useAuth();
  const displayName = authSession.userName ?? authSession.email ?? 'Staff';

  if (!isLoading && (!isAuthenticated || !authSession.roles.includes('Admin'))) {
    return <Navigate to="/login" replace />;
  }
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const Sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-stone-200
        flex flex-col z-30 transition-transform duration-200 ease-out
        lg:translate-x-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Admin sidebar"
    >
      {/* Wordmark */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-stone-200 shrink-0">
        <span className="text-lg font-bold tracking-tight text-stone-900">Haven</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mt-px">
          Staff Portal
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Admin navigation">
        <ul className="space-y-0.5" role="list">
          {navItems.map(({ to, label, end, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-haven-teal-50 text-haven-teal-800 font-semibold border-l-2 border-haven-teal-600'
                    : 'text-stone-600 font-medium hover:bg-stone-100 hover:text-stone-900 border-l-2 border-transparent'
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to public site */}
      <div className="shrink-0 border-t border-stone-200 p-3">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-500
            font-medium hover:bg-stone-100 hover:text-stone-700 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
            focus-visible:ring-offset-2"
        >
          <ChevronLeftIcon />
          Public Site
        </NavLink>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-stone-900/50 z-20"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {Sidebar}

      {/* Top bar */}
      <header
        className="fixed top-0 inset-x-0 lg:left-60 h-16 bg-white border-b border-stone-200
          flex items-center justify-between px-4 z-10"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
          >
            <MenuIcon />
          </button>
          <span className="text-base font-semibold text-stone-900">{pageTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full bg-haven-teal-600 flex items-center justify-center
              text-xs font-bold text-white"
            aria-hidden="true"
          >
            {avatarLetter}
          </div>
          <span className="hidden sm:block text-sm font-medium text-stone-700">{displayName}</span>
        </div>
      </header>

      {/* Page content */}
      <main className="lg:ml-60 pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
