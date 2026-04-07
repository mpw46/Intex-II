function AdminDashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        High-level overview of key metrics — the "command center" for staff managing daily operations.
        See <code>admin-dashboard-mockup.jsx</code> in the repo root for the design reference.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>Safehouse filter dropdown and time range selector</li>
        <li>KPI cards: Active Residents, Open Cases, Reintegrated, Donations, Pending Conferences</li>
        <li>Average resident progress indicator</li>
        <li>Upcoming case conferences table with priority badges</li>
        <li>At-risk resident alerts</li>
        <li>Recent donations summary</li>
        <li>Summarized progress data across safehouses</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default AdminDashboardPage;
