function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Home / Landing Page</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        A modern, professional landing page that introduces the organization, its mission,
        and provides clear calls to action for visitors to engage or support.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>Hero section with organization mission statement</li>
        <li>Overview of safehouse locations and services</li>
        <li>Call-to-action buttons for donations and engagement</li>
        <li>Quick impact statistics (residents served, safehouses active, etc.)</li>
        <li>Testimonials / success stories section</li>
        <li>Link to login for staff members</li>
        <li>Footer with privacy policy link</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default HomePage;
