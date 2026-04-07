function DonorsContributionsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Donors &amp; Contributions</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Manage supporter profiles and track all types of contributions. View donation allocations
        across safehouses and program areas.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>Supporter directory with search and filtering</li>
        <li>Create and manage supporter profiles</li>
        <li>Classification by type: monetary donor, volunteer, skills contributor, social media advocate</li>
        <li>Status tracking: active / inactive supporters</li>
        <li>Track all contribution types: monetary, in-kind, time, skills, social media</li>
        <li>Record and review donation activity</li>
        <li>View donation allocations across safehouses and programs</li>
        <li>Donation receipts and history</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default DonorsContributionsPage;
