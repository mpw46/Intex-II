import { useState, useEffect } from 'react';
import type { HomeVisitation, HomeVisitationCreate, ResidentLookup } from '../../types/homeVisitation';
import { VISIT_TYPES, COOPERATION_LEVELS } from '../../types/homeVisitation';
import { getVisitations, createVisitation, updateVisitation, deleteVisitation, getResidents } from '../../api/homeVisitationApi';

const emptyForm: HomeVisitationCreate = {
  residentId: null,
  visitDate: '',
  socialWorker: '',
  visitType: '',
  locationVisited: '',
  familyMembersPresent: '',
  purpose: '',
  observations: '',
  familyCooperationLevel: '',
  safetyConcernsNoted: '',
  followUpNeeded: '',
  followUpNotes: '',
  visitOutcome: '',
};

function HomeVisitationPage() {
  const [visitations, setVisitations] = useState<HomeVisitation[]>([]);
  const [residents, setResidents] = useState<ResidentLookup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HomeVisitationCreate>({ ...emptyForm });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Filters
  const [filterVisitType, setFilterVisitType] = useState('');
  const [filterSocialWorker, setFilterSocialWorker] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [v, r] = await Promise.all([getVisitations(), getResidents()]);
      setVisitations(v);
      setResidents(r);
    } catch {
      setError('Failed to load data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(v: HomeVisitation) {
    setForm({
      residentId: v.residentId,
      visitDate: v.visitDate ?? '',
      socialWorker: v.socialWorker ?? '',
      visitType: v.visitType ?? '',
      locationVisited: v.locationVisited ?? '',
      familyMembersPresent: v.familyMembersPresent ?? '',
      purpose: v.purpose ?? '',
      observations: v.observations ?? '',
      familyCooperationLevel: v.familyCooperationLevel ?? '',
      safetyConcernsNoted: v.safetyConcernsNoted ?? '',
      followUpNeeded: v.followUpNeeded ?? '',
      followUpNotes: v.followUpNotes ?? '',
      visitOutcome: v.visitOutcome ?? '',
    });
    setEditingId(v.visitationId);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId !== null) {
        await updateVisitation(editingId, form);
      } else {
        await createVisitation(form);
      }
      setShowForm(false);
      await loadData();
    } catch {
      setError('Failed to save. Please check your input and try again.');
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      await deleteVisitation(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch {
      setError('Failed to delete record.');
    }
  }

  function handleFieldChange(field: keyof HomeVisitationCreate, value: string | number | null) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Filtered list
  const filtered = visitations.filter(v => {
    if (filterVisitType && v.visitType !== filterVisitType) return false;
    if (filterSocialWorker && !(v.socialWorker ?? '').toLowerCase().includes(filterSocialWorker.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Home Visitation</h1>
          <p style={subtitleStyle}>Log home and field visits, track outcomes, and plan follow-ups</p>
        </div>
        <button onClick={openCreateForm} style={addButtonStyle}>+ New Visit</button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={errorBannerStyle}>
          {error}
          <button onClick={() => setError(null)} style={dismissStyle}>&times;</button>
        </div>
      )}

      {/* Filters */}
      <div style={filterBarStyle}>
        <select
          value={filterVisitType}
          onChange={e => setFilterVisitType(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Visit Types</option>
          {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter by social worker..."
          value={filterSocialWorker}
          onChange={e => setFilterSocialWorker(e.target.value)}
          style={inputStyle}
        />
        {(filterVisitType || filterSocialWorker) && (
          <button
            onClick={() => { setFilterVisitType(''); setFilterSocialWorker(''); }}
            style={clearFilterStyle}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Data table */}
      <div style={tableContainerStyle}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            No home visitations found.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Resident ID</th>
                <th style={thStyle}>Visit Type</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Social Worker</th>
                <th style={thStyle}>Cooperation</th>
                <th style={thStyle}>Outcome</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.visitationId} style={trStyle}>
                  <td style={tdStyle}>{v.residentId ?? '—'}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(v.visitType)}>{v.visitType ?? '—'}</span>
                  </td>
                  <td style={tdStyle}>{v.visitDate ?? '—'}</td>
                  <td style={tdStyle}>{v.socialWorker ?? '—'}</td>
                  <td style={tdStyle}>{v.familyCooperationLevel ?? '—'}</td>
                  <td style={tdStyle}>{v.visitOutcome ?? '—'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openEditForm(v)} style={editBtnStyle}>Edit</button>
                    <button onClick={() => setDeleteConfirmId(v.visitationId)} style={deleteBtnStyle}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId !== null && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ margin: '0 0 1rem' }}>Confirm Delete</h3>
            <p>Are you sure you want to delete this visitation record? This action cannot be undone.</p>
            <div style={modalActionsStyle}>
              <button onClick={() => setDeleteConfirmId(null)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} style={confirmDeleteBtnStyle}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1.5rem' }}>
              {editingId !== null ? 'Edit Visitation' : 'New Home Visitation'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                {/* Resident */}
                <label style={labelStyle}>
                  Resident *
                  <select
                    value={form.residentId ?? ''}
                    onChange={e => handleFieldChange('residentId', e.target.value ? Number(e.target.value) : null)}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Resident</option>
                    {residents.map(r => (
                      <option key={r.residentId} value={r.residentId}>
                        #{r.residentId} — {r.caseStatus ?? 'Unknown'} ({r.assignedSocialWorker ?? 'Unassigned'})
                      </option>
                    ))}
                  </select>
                </label>

                {/* Visit Type */}
                <label style={labelStyle}>
                  Visit Type *
                  <select
                    value={form.visitType}
                    onChange={e => handleFieldChange('visitType', e.target.value)}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Type</option>
                    {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>

                {/* Date */}
                <label style={labelStyle}>
                  Visit Date *
                  <input
                    type="date"
                    value={form.visitDate}
                    onChange={e => handleFieldChange('visitDate', e.target.value)}
                    style={inputStyle}
                    required
                  />
                </label>

                {/* Social Worker */}
                <label style={labelStyle}>
                  Social Worker *
                  <input
                    type="text"
                    value={form.socialWorker}
                    onChange={e => handleFieldChange('socialWorker', e.target.value)}
                    style={inputStyle}
                    required
                  />
                </label>

                {/* Location Visited */}
                <label style={labelStyle}>
                  Location Visited
                  <input
                    type="text"
                    value={form.locationVisited ?? ''}
                    onChange={e => handleFieldChange('locationVisited', e.target.value)}
                    style={inputStyle}
                  />
                </label>

                {/* Family Members Present */}
                <label style={labelStyle}>
                  Family Members Present
                  <input
                    type="text"
                    value={form.familyMembersPresent ?? ''}
                    onChange={e => handleFieldChange('familyMembersPresent', e.target.value)}
                    style={inputStyle}
                  />
                </label>

                {/* Purpose */}
                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  Purpose
                  <textarea
                    value={form.purpose ?? ''}
                    onChange={e => handleFieldChange('purpose', e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </label>

                {/* Cooperation Level */}
                <label style={labelStyle}>
                  Family Cooperation Level
                  <select
                    value={form.familyCooperationLevel ?? ''}
                    onChange={e => handleFieldChange('familyCooperationLevel', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select Level</option>
                    {COOPERATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </label>

                {/* Follow-Up Needed */}
                <label style={labelStyle}>
                  Follow-Up Needed
                  <select
                    value={form.followUpNeeded ?? ''}
                    onChange={e => handleFieldChange('followUpNeeded', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>

                {/* Observations */}
                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  Observations
                  <textarea
                    value={form.observations ?? ''}
                    onChange={e => handleFieldChange('observations', e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </label>

                {/* Safety Concerns */}
                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  Safety Concerns Noted
                  <textarea
                    value={form.safetyConcernsNoted ?? ''}
                    onChange={e => handleFieldChange('safetyConcernsNoted', e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </label>

                {/* Follow-Up Notes */}
                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  Follow-Up Notes
                  <textarea
                    value={form.followUpNotes ?? ''}
                    onChange={e => handleFieldChange('followUpNotes', e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </label>

                {/* Visit Outcome */}
                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  Visit Outcome
                  <textarea
                    value={form.visitOutcome ?? ''}
                    onChange={e => handleFieldChange('visitOutcome', e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                </label>
              </div>

              <div style={modalActionsStyle}>
                <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>
                  {editingId !== null ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Styles ----

const pageStyle: React.CSSProperties = {
  padding: '2rem',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.75rem',
  color: '#0f4c5c',
};

const subtitleStyle: React.CSSProperties = {
  margin: '0.25rem 0 0',
  color: '#6b7280',
  fontSize: '0.95rem',
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: '#0f4c5c',
  color: '#fff',
  border: 'none',
  padding: '0.6rem 1.25rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const errorBannerStyle: React.CSSProperties = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const dismissStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#991b1b',
  fontSize: '1.2rem',
  cursor: 'pointer',
};

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
};

const clearFilterStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  color: '#6b7280',
};

const tableContainerStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  overflowX: 'auto',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #e5e7eb',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid #f3f4f6',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  fontSize: '0.9rem',
  color: '#374151',
};

function badgeStyle(visitType: string | null): React.CSSProperties {
  const colors: Record<string, { bg: string; color: string }> = {
    'Emergency': { bg: '#fef2f2', color: '#991b1b' },
    'Initial Assessment': { bg: '#eff6ff', color: '#1e40af' },
    'Routine Follow-Up': { bg: '#f0fdf4', color: '#166534' },
    'Reintegration Assessment': { bg: '#fefce8', color: '#854d0e' },
    'Post-Placement Monitoring': { bg: '#f5f3ff', color: '#5b21b6' },
  };
  const c = colors[visitType ?? ''] ?? { bg: '#f3f4f6', color: '#374151' };
  return {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backgroundColor: c.bg,
    color: c.color,
  };
}

const editBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#0f4c5c',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '0.85rem',
  marginRight: '0.5rem',
};

const deleteBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#dc2626',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '0.85rem',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  padding: '2rem',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
};

const modalActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '1.5rem',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#374151',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: '#fff',
  color: '#374151',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const saveBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  background: '#0f4c5c',
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const confirmDeleteBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  background: '#dc2626',
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

export default HomeVisitationPage;
