import { useState, useEffect } from 'react';
import type { HomeVisitation } from '../../types/homeVisitation';
import { getVisitations } from '../../api/homeVisitationApi';

function HomeVisitationPage() {
  const [visitations, setVisitations] = useState<HomeVisitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVisitations()
      .then(data => setVisitations(data))
      .catch(() => setError('Failed to load data. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#0f4c5c' }}>Home Visitations</h1>
      <p style={{ color: '#6b7280' }}>{visitations.length} records found</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visitations.map(v => (
          <li key={v.visitationId} style={{
            padding: '1rem',
            marginBottom: '0.5rem',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <strong>Visit #{v.visitationId}</strong> — Resident {v.residentId ?? '—'}
            {' | '}{v.visitType ?? 'No type'}
            {' | '}{v.visitDate ?? 'No date'}
            {' | '}{v.socialWorker ?? 'No worker'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeVisitationPage;
