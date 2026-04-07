import { useState, useEffect } from 'react';
import { getVisitations } from '../../api/homeVisitationApi';
import type { HomeVisitation, HomeVisitationCreate } from '../../types/homeVisitation';
import { VISIT_TYPES, COOPERATION_LEVELS, VISIT_OUTCOMES } from '../../types/homeVisitation';

// ---------------------------------------------------------------------------
// Local display type — augments the DB-level ResidentLookup with UI fields
// ---------------------------------------------------------------------------

interface ResidentDisplay {
  residentId: number;
  caseLabel: string;
  safehouseName: string;
  assignedSocialWorker: string;
  caseStatus: string;
}

// ---------------------------------------------------------------------------
// Filler data
// ---------------------------------------------------------------------------

// TODO: Replace with GET /api/residents
const fillerResidents: ResidentDisplay[] = [
  { residentId: 1, caseLabel: 'RES-2024-001', safehouseName: 'Haven House Manila',  assignedSocialWorker: 'Ana Reyes',    caseStatus: 'Active'      },
  { residentId: 2, caseLabel: 'RES-2024-002', safehouseName: 'Light of Hope Cebu',  assignedSocialWorker: 'Ben Cruz',     caseStatus: 'Active'      },
  { residentId: 3, caseLabel: 'RES-2024-003', safehouseName: 'New Dawn Davao',      assignedSocialWorker: 'Celia Santos', caseStatus: 'Closed'      },
  { residentId: 4, caseLabel: 'RES-2024-004', safehouseName: 'Safe Harbor Iloilo',  assignedSocialWorker: 'Ana Reyes',    caseStatus: 'Active'      },
  { residentId: 5, caseLabel: 'RES-2024-005', safehouseName: 'Haven House Manila',  assignedSocialWorker: 'Donna Lim',    caseStatus: 'Active'      },
  { residentId: 6, caseLabel: 'RES-2023-018', safehouseName: 'Light of Hope Cebu',  assignedSocialWorker: 'Ben Cruz',     caseStatus: 'Transferred' },
  { residentId: 7, caseLabel: 'RES-2025-001', safehouseName: 'New Dawn Davao',      assignedSocialWorker: 'Celia Santos', caseStatus: 'Active'      },
  { residentId: 8, caseLabel: 'RES-2024-009', safehouseName: 'Haven House Manila',  assignedSocialWorker: 'Donna Lim',    caseStatus: 'Active'      },
];


// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SOCIAL_WORKERS = ['Ana Reyes', 'Ben Cruz', 'Celia Santos', 'Donna Lim'];

const VISIT_TYPE_COLORS: Record<string, string> = {
  'Initial Assessment':        'bg-sky-100 text-sky-800 border-sky-200',
  'Routine Follow-Up':         'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Reintegration Assessment':  'bg-violet-100 text-violet-800 border-violet-200',
  'Post-Placement Monitoring': 'bg-amber-100 text-amber-800 border-amber-200',
  'Emergency':                 'bg-rose-100 text-rose-800 border-rose-200',
};

const COOPERATION_COLORS: Record<string, string> = {
  'Cooperative':        'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Highly Cooperative': 'bg-teal-100 text-teal-800 border-teal-200',
  'Neutral':            'bg-stone-100 text-stone-600 border-stone-200',
  'Uncooperative':      'bg-orange-100 text-orange-800 border-orange-200',
};

const VISIT_OUTCOME_COLORS: Record<string, string> = {
  'Favorable':       'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Needs Improvement': 'bg-amber-100 text-amber-800 border-amber-200',
  'Unfavorable':     'bg-rose-100 text-rose-800 border-rose-200',
  'Inconclusive':    'bg-stone-100 text-stone-600 border-stone-200',
};

function makeEmptyForm(residentId: number, socialWorker: string): HomeVisitationCreate {
  return {
    residentId,
    visitDate: new Date().toISOString().substring(0, 10),
    socialWorker,
    visitType: 'Routine Follow-Up',
    locationVisited: '',
    familyMembersPresent: '',
    purpose: '',
    observations: '',
    familyCooperationLevel: 'Cooperative',
    safetyConcernsNoted: 'False',
    followUpNeeded: 'False',
    followUpNotes: '',
    visitOutcome: '',
  };
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SearchIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function PlusIcon()   { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function XIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function AlertIcon()  { return <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VisitTypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  const cls = VISIT_TYPE_COLORS[type] ?? 'bg-stone-100 text-stone-700 border-stone-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${cls}`}>
      {type}
    </span>
  );
}

function CooperationBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const cls = COOPERATION_COLORS[level] ?? 'bg-stone-100 text-stone-700 border-stone-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${cls}`}>
      {level}
    </span>
  );
}

function VisitOutcomeBadge({ outcome }: { outcome: string | null }) {
  if (!outcome) return null;
  const cls = VISIT_OUTCOME_COLORS[outcome] ?? 'bg-stone-100 text-stone-700 border-stone-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${cls}`}>
      {outcome}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Detail row used in the view modal
// ---------------------------------------------------------------------------

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-x-3 py-2.5 border-b border-stone-100 last:border-0">
      <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wide leading-5">{label}</dt>
      <dd className="text-sm text-stone-800 leading-5">{children}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function HomeVisitationPage() {
  const [residents]   = useState<ResidentDisplay[]>(fillerResidents);
  const [visitations, setVisitations] = useState<HomeVisitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getVisitations()
      .then(setVisitations)
      .catch(() => setError('Failed to load visitations. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const [residentSearch,    setResidentSearch]    = useState('');
  const [selectedResident,  setSelectedResident]  = useState<ResidentDisplay | null>(null);

  const [modal,         setModal]         = useState<'add' | 'view' | 'delete' | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<HomeVisitation | null>(null);
  const [form,          setForm]          = useState<HomeVisitationCreate>(makeEmptyForm(0, ''));
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const filteredResidents = residents.filter(r => {
    const q = residentSearch.toLowerCase();
    return (
      q === '' ||
      r.caseLabel.toLowerCase().includes(q) ||
      r.safehouseName.toLowerCase().includes(q) ||
      r.assignedSocialWorker.toLowerCase().includes(q)
    );
  });

  const residentVisitations = selectedResident
    ? visitations
        .filter(v => v.residentId === selectedResident.residentId)
        .sort((a, b) => (b.visitDate ?? '').localeCompare(a.visitDate ?? ''))
    : [];

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function openAdd() {
    if (!selectedResident) return;
    setForm(makeEmptyForm(selectedResident.residentId, selectedResident.assignedSocialWorker));
    setSelectedVisit(null);
    setModal('add');
  }

  function openView(v: HomeVisitation) { setSelectedVisit(v); setModal('view'); }
  function openDelete(v: HomeVisitation) { setSelectedVisit(v); setModal('delete'); }

  function saveForm(e: { preventDefault(): void }) {
    e.preventDefault();
    const newVisit: HomeVisitation = {
      visitationId: Date.now(),
      residentId:            form.residentId,
      visitDate:             form.visitDate,
      socialWorker:          form.socialWorker,
      visitType:             form.visitType,
      locationVisited:       form.locationVisited ?? null,
      familyMembersPresent:  form.familyMembersPresent ?? null,
      purpose:               form.purpose ?? null,
      observations:          form.observations ?? null,
      familyCooperationLevel: form.familyCooperationLevel ?? null,
      safetyConcernsNoted:   form.safetyConcernsNoted ?? 'False',
      followUpNeeded:        form.followUpNeeded ?? 'False',
      followUpNotes:         form.followUpNeeded === 'True' ? (form.followUpNotes ?? null) : null,
      visitOutcome:          form.visitOutcome ?? null,
    };
    setVisitations(prev => [newVisit, ...prev]);
    // TODO: POST /api/homevisitation { body: form }
    setModal(null);
  }

  function confirmDelete() {
    if (selectedVisit) {
      setVisitations(prev => prev.filter(v => v.visitationId !== selectedVisit.visitationId));
      // TODO: DELETE /api/homevisitation/${selectedVisit.visitationId}
    }
    setModal(null);
    setSelectedVisit(null);
  }

  const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
    text-stone-900 placeholder:text-stone-400 hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  const textareaCls = `${inputCls} resize-none`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
      Loading visitations…
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-rose-600 text-sm">
      {error}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

      {/* ------------------------------------------------------------------ */}
      {/* Left: Resident list                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className={`w-full lg:w-80 shrink-0 ${mobileShowDetail ? 'hidden lg:block' : ''}`}>
        <h2 className="text-base font-semibold text-stone-900 mb-4">Select Resident</h2>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search by case ID, safehouse…"
            value={residentSearch}
            onChange={e => setResidentSearch(e.target.value)}
            className={`${inputCls} pl-9`}
          />
        </div>

        <div className="space-y-2 lg:max-h-[70vh] overflow-y-auto pr-1">
          {filteredResidents.map(r => (
            <button
              key={r.residentId}
              type="button"
              onClick={() => { setSelectedResident(r); setMobileShowDetail(true); }}
              className={`w-full text-left bg-white rounded-xl border p-4
                transition-all duration-150 hover:shadow-md
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                ${selectedResident?.residentId === r.residentId
                  ? 'border-haven-teal-400 shadow-md'
                  : 'border-stone-200 shadow-sm hover:border-stone-300'}`}
            >
              <p className="text-sm font-semibold font-mono text-stone-900">{r.caseLabel}</p>
              <p className="text-xs text-stone-400 mt-0.5">{r.safehouseName}</p>
              <p className="text-xs text-stone-500 mt-1">{r.assignedSocialWorker}</p>
              <span className={`mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full
                ${r.caseStatus === 'Active' ? 'bg-emerald-100 text-emerald-700'
                  : r.caseStatus === 'Closed' ? 'bg-stone-100 text-stone-500'
                  : 'bg-amber-100 text-amber-700'}`}>
                {r.caseStatus}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right: Visit history                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className={`flex-1 min-w-0 ${!mobileShowDetail ? 'hidden lg:block' : ''}`}>

        {/* Mobile back button */}
        {mobileShowDetail && (
          <button
            type="button"
            onClick={() => setMobileShowDetail(false)}
            className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-haven-teal-600
              mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
              focus-visible:ring-offset-2 rounded py-1"
          >
            ← Back to Residents
          </button>
        )}

        {selectedResident ? (
          <>
            {/* Resident header */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mb-5
              flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-mono text-base font-bold text-stone-900">{selectedResident.caseLabel}</p>
                <p className="text-sm text-stone-500 mt-0.5">
                  {selectedResident.safehouseName} · {selectedResident.assignedSocialWorker}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {residentVisitations.length} visit{residentVisitations.length !== 1 ? 's' : ''} on record
                </p>
              </div>
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2 shrink-0"
              >
                <PlusIcon /> Log Visit
              </button>
            </div>

            {/* Visit list */}
            {residentVisitations.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-stone-400 text-sm">No visits recorded for this resident.</p>
                <button
                  type="button"
                  onClick={openAdd}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
                    text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                    focus-visible:ring-offset-2"
                >
                  <PlusIcon /> Log First Visit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {residentVisitations.map(visit => (
                  <div
                    key={visit.visitationId}
                    className="bg-white rounded-xl border border-stone-200 shadow-sm p-5
                      hover:shadow-md hover:border-stone-300 transition-all duration-200"
                  >
                    {/* Card header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">{visit.visitDate}</span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-sm text-stone-600">{visit.socialWorker}</span>
                        <VisitTypeBadge type={visit.visitType} />
                        {visit.safetyConcernsNoted === 'True' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
                            font-semibold uppercase tracking-wide border bg-rose-100 text-rose-800 border-rose-200">
                            <AlertIcon /> Safety Concern
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openView(visit)}
                          className="text-xs font-medium text-haven-teal-600 hover:text-haven-teal-800
                            px-3 py-1.5 rounded-lg border border-haven-teal-200 hover:bg-haven-teal-50
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                            transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(visit)}
                          className="text-xs font-medium text-stone-500 hover:text-rose-600
                            px-3 py-1.5 rounded-lg border border-stone-200 hover:border-rose-200 hover:bg-rose-50
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400
                            transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {visit.locationVisited && (
                        <div>
                          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Location</span>
                          <p className="text-stone-700 mt-0.5">{visit.locationVisited}</p>
                        </div>
                      )}
                      {visit.familyCooperationLevel && (
                        <div>
                          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Family Cooperation</span>
                          <div className="mt-1">
                            <CooperationBadge level={visit.familyCooperationLevel} />
                          </div>
                        </div>
                      )}
                      {visit.visitOutcome && (
                        <div>
                          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Outcome</span>
                          <div className="mt-1">
                            <VisitOutcomeBadge outcome={visit.visitOutcome} />
                          </div>
                        </div>
                      )}
                      {visit.followUpNeeded === 'True' && visit.followUpNotes && (
                        <div className="sm:col-span-2 mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Follow-up Required</p>
                          <p className="text-xs text-amber-900">{visit.followUpNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-96 bg-white rounded-xl
            border border-stone-200 shadow-sm text-center px-8">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-stone-700">Select a resident</p>
            <p className="text-xs text-stone-400 mt-1">Choose a resident from the list to view or log home visits</p>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* Modal: Add visit                                                     */}
      {/* ================================================================== */}
      {modal === 'add' && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900">Log Home Visit</h2>
                <p className="text-xs text-stone-400 mt-0.5">{selectedResident?.caseLabel} · {selectedResident?.safehouseName}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setModal(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500">
                <XIcon />
              </button>
            </div>

            <form onSubmit={saveForm} className="px-6 py-5 space-y-5">
              {/* Row: date + type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hv-visitDate" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Visit Date <span className="text-rose-500">*</span>
                  </label>
                  <input id="hv-visitDate" type="date" required value={form.visitDate}
                    onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
                    className={inputCls} />
                </div>
                <div>
                  <label htmlFor="hv-visitType" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Visit Type <span className="text-rose-500">*</span>
                  </label>
                  <select id="hv-visitType" required value={form.visitType}
                    onChange={e => setForm(f => ({ ...f, visitType: e.target.value }))}
                    className={inputCls}>
                    {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Row: social worker + location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hv-socialWorker" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Social Worker <span className="text-rose-500">*</span>
                  </label>
                  <select id="hv-socialWorker" required value={form.socialWorker}
                    onChange={e => setForm(f => ({ ...f, socialWorker: e.target.value }))}
                    className={inputCls}>
                    {SOCIAL_WORKERS.map(sw => <option key={sw} value={sw}>{sw}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="hv-location" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Location Visited
                  </label>
                  <input id="hv-location" type="text" placeholder="e.g. Family home — Quezon City"
                    value={form.locationVisited ?? ''}
                    onChange={e => setForm(f => ({ ...f, locationVisited: e.target.value }))}
                    className={inputCls} />
                </div>
              </div>

              {/* Family members present */}
              <div>
                <label htmlFor="hv-familyMembers" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                  Family Members Present
                </label>
                <input id="hv-familyMembers" type="text" placeholder="e.g. Mother, older brother"
                  value={form.familyMembersPresent ?? ''}
                  onChange={e => setForm(f => ({ ...f, familyMembersPresent: e.target.value }))}
                  className={inputCls} />
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="hv-purpose" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                  Purpose of Visit
                </label>
                <textarea id="hv-purpose" rows={2} placeholder="Brief purpose statement…"
                  value={form.purpose ?? ''}
                  onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                  className={textareaCls} />
              </div>

              {/* Observations */}
              <div>
                <label htmlFor="hv-observations" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                  Observations
                </label>
                <textarea id="hv-observations" rows={3} placeholder="Describe home environment, family dynamics, welfare of the resident's support network…"
                  value={form.observations ?? ''}
                  onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
                  className={textareaCls} />
              </div>

              {/* Row: cooperation + safety concern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="hv-cooperation" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Family Cooperation Level
                  </label>
                  <select id="hv-cooperation" value={form.familyCooperationLevel ?? ''}
                    onChange={e => setForm(f => ({ ...f, familyCooperationLevel: e.target.value }))}
                    className={inputCls}>
                    {COOPERATION_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pb-0.5">
                  <input
                    id="safetyConcern"
                    type="checkbox"
                    checked={form.safetyConcernsNoted === 'True'}
                    onChange={e => setForm(f => ({ ...f, safetyConcernsNoted: e.target.checked ? 'True' : 'False' }))}
                    className="h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="safetyConcern" className="text-sm font-medium text-stone-700">
                    Safety concern noted
                  </label>
                </div>
              </div>

              {/* Visit outcome */}
              <div>
                <label htmlFor="hv-outcome" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                  Visit Outcome
                </label>
                <select id="hv-outcome" value={form.visitOutcome ?? ''}
                  onChange={e => setForm(f => ({ ...f, visitOutcome: e.target.value }))}
                  className={inputCls}>
                  <option value="">— Select outcome —</option>
                  {VISIT_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Follow-up */}
              <div className="flex items-center gap-3">
                <input
                  id="hv-followUp"
                  type="checkbox"
                  checked={form.followUpNeeded === 'True'}
                  onChange={e => setForm(f => ({ ...f, followUpNeeded: e.target.checked ? 'True' : 'False' }))}
                  className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 focus:ring-haven-teal-500"
                />
                <label htmlFor="hv-followUp" className="text-sm font-medium text-stone-700">
                  Follow-up required
                </label>
              </div>

              {form.followUpNeeded === 'True' && (
                <div>
                  <label htmlFor="hv-followUpNotes" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                    Follow-up Notes
                  </label>
                  <textarea id="hv-followUpNotes" rows={2} placeholder="Describe required follow-up actions…"
                    value={form.followUpNotes ?? ''}
                    onChange={e => setForm(f => ({ ...f, followUpNotes: e.target.value }))}
                    className={textareaCls} />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-stone-600 rounded-lg border border-stone-200
                    hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                    focus-visible:ring-offset-2 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-haven-teal-600 rounded-lg
                    hover:bg-haven-teal-700 focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 transition-colors">
                  Save Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Modal: View visit details                                            */}
      {/* ================================================================== */}
      {modal === 'view' && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl my-6">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-stone-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-stone-900">{selectedVisit.visitDate}</span>
                <VisitTypeBadge type={selectedVisit.visitType} />
                {selectedVisit.safetyConcernsNoted === 'True' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
                    font-semibold uppercase tracking-wide border bg-rose-100 text-rose-800 border-rose-200">
                    <AlertIcon /> Safety Concern
                  </span>
                )}
              </div>
              <button type="button" aria-label="Close" onClick={() => setModal(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 ml-4 shrink-0">
                <XIcon />
              </button>
            </div>

            <dl className="px-6 py-4">
              <DetailRow label="Social Worker">{selectedVisit.socialWorker ?? '—'}</DetailRow>
              <DetailRow label="Location">{selectedVisit.locationVisited ?? '—'}</DetailRow>
              <DetailRow label="Family Present">{selectedVisit.familyMembersPresent ?? '—'}</DetailRow>
              <DetailRow label="Purpose">{selectedVisit.purpose ?? '—'}</DetailRow>
              <DetailRow label="Observations">{selectedVisit.observations ?? '—'}</DetailRow>
              <DetailRow label="Cooperation">
                {selectedVisit.familyCooperationLevel
                  ? <CooperationBadge level={selectedVisit.familyCooperationLevel} />
                  : '—'}
              </DetailRow>
              <DetailRow label="Safety Concern">
                {selectedVisit.safetyConcernsNoted === 'True'
                  ? <span className="text-rose-700 font-medium">Yes</span>
                  : <span className="text-stone-500">No</span>}
              </DetailRow>
              <DetailRow label="Outcome">
                {selectedVisit.visitOutcome
                  ? <VisitOutcomeBadge outcome={selectedVisit.visitOutcome} />
                  : '—'}
              </DetailRow>
              <DetailRow label="Follow-up">
                {selectedVisit.followUpNeeded === 'True'
                  ? <span className="text-amber-700 font-medium">Yes</span>
                  : <span className="text-stone-500">No</span>}
              </DetailRow>
              {selectedVisit.followUpNeeded === 'True' && (
                <DetailRow label="Follow-up Notes">{selectedVisit.followUpNotes ?? '—'}</DetailRow>
              )}
            </dl>

            <div className="px-6 pb-5 flex justify-end">
              <button type="button" onClick={() => setModal(null)}
                className="px-5 py-2.5 text-sm font-semibold text-stone-600 rounded-lg border border-stone-200
                  hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Modal: Delete confirmation                                           */}
      {/* ================================================================== */}
      {modal === 'delete' && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-base font-bold text-stone-900 mb-2">Delete Visit Record?</h2>
            <p className="text-sm text-stone-600 mb-6">
              This will permanently delete the{' '}
              <span className="font-semibold">{selectedVisit.visitDate}</span>{' '}
              <span className="font-semibold">{selectedVisit.visitType}</span> visit record.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="px-5 py-2.5 text-sm font-semibold text-stone-600 rounded-lg border border-stone-200
                  hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-lg
                  hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
