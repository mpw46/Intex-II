function LoginPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login / Register</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Allows users to authenticate using a username and password, with proper validation
        and error handling. Supports role-based access (Admin, Staff, Donor).
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>Login form (username/email + password)</li>
        <li>Registration form for new accounts (with admin approval workflow)</li>
        <li>Password reset flow</li>
        <li>Role-based access: Admin, Staff, Donor</li>
        <li>ASP.NET Identity integration with strong password requirements</li>
        <li>Optional: Third-party authentication (Google, etc.)</li>
        <li>Optional: Two-factor / multi-factor authentication</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default LoginPage;
