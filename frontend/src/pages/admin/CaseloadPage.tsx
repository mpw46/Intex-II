function CaseloadPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Caseload Inventory</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Core case management page. Maintains records for all residents following the structure
        used by Philippine social welfare agencies.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>View, create, and update resident profiles</li>
        <li>Demographics and case category tracking (trafficked, abuse, neglect, etc.)</li>
        <li>Disability information</li>
        <li>Family socio-demographic profile (4Ps beneficiary, solo parent, indigenous group, informal settler)</li>
        <li>Admission details and referral information</li>
        <li>Assigned social worker management</li>
        <li>Reintegration tracking</li>
        <li>Filtering and search by case status, safehouse, case category</li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}

export default CaseloadPage;
