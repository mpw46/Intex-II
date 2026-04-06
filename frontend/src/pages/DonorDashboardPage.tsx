function DonorDashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Impact / Donor-Facing Dashboard</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Displays aggregated, anonymized data showing the organization's impact
        (e.g., outcomes, progress, and resource use) in a clear and visually understandable way.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>Aggregated outcome metrics (residents served, reintegration rates)</li>
        <li>Progress visualizations and charts</li>
        <li>Resource allocation breakdown by safehouse/program</li>
        <li>Donation impact stories (anonymized)</li>
        <li>Year-over-year growth metrics</li>
        <li>All data anonymized to protect resident privacy</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default DonorDashboardPage;
