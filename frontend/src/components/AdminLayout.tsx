import { NavLink, Outlet } from 'react-router-dom';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
};

const sidebarStyle: React.CSSProperties = {
  width: '240px',
  backgroundColor: '#0f4c5c',
  color: '#fff',
  padding: '1.5rem 0',
  flexShrink: 0,
};

const sidebarHeaderStyle: React.CSSProperties = {
  padding: '0 1.25rem 1rem',
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#e8b931',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  marginBottom: '0.5rem',
};

const linkStyle: React.CSSProperties = {
  display: 'block',
  color: '#ccc',
  textDecoration: 'none',
  padding: '0.6rem 1.25rem',
  fontSize: '0.9rem',
  transition: 'background 0.15s',
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#fff',
  backgroundColor: 'rgba(232, 185, 49, 0.2)',
  borderLeft: '3px solid #e8b931',
};

const backLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#e8b931',
  marginTop: '1rem',
  borderTop: '1px solid rgba(255,255,255,0.15)',
  paddingTop: '1rem',
};

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/donors', label: 'Donors & Contributions' },
  { to: '/admin/caseload', label: 'Caseload Inventory' },
  { to: '/admin/process-recording', label: 'Process Recording' },
  { to: '/admin/home-visitation', label: 'Home Visitation' },
  { to: '/admin/reports', label: 'Reports & Analytics' },
];

function AdminLayout() {
  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>Admin Portal</div>
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/" style={backLinkStyle}>
          &larr; Back to Site
        </NavLink>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
