import { NavLink, Outlet } from 'react-router-dom';

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  height: '64px',
  backgroundColor: '#0f4c5c',
  color: '#fff',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#e8b931',
  textDecoration: 'none',
};

const linkContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
};

const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0.25rem 0',
  fontSize: '0.95rem',
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  borderBottom: '2px solid #e8b931',
};

const footerStyle: React.CSSProperties = {
  padding: '1.5rem 2rem',
  backgroundColor: '#0f4c5c',
  color: '#ccc',
  textAlign: 'center',
  fontSize: '0.85rem',
  marginTop: 'auto',
};

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <NavLink to="/" style={logoStyle}>
          Intex II
        </NavLink>
        <div style={linkContainerStyle}>
          <NavLink to="/" end style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Home
          </NavLink>
          <NavLink to="/impact" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Impact
          </NavLink>
          <NavLink to="/login" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Login
          </NavLink>
          <NavLink to="/admin" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Admin
          </NavLink>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      <footer style={footerStyle}>
        <p>
          Intex II &mdash;{' '}
          <NavLink to="/privacy" style={{ color: '#e8b931', textDecoration: 'underline' }}>
            Privacy Policy
          </NavLink>
        </p>
      </footer>
    </div>
  );
}

export default Layout;
