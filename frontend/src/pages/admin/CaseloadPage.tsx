import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CaseStatus = 'Active' | 'Pending' | 'Closed' | 'Transferred';
type CaseCategory = 'Abandoned' | 'Foundling' | 'Surrendered' | 'Neglected' | 'Exploited';
type ReintegrationType = 'Family' | 'Independent Living' | 'Foster Care' | 'Adoption' | 'N/A';
type ReintegrationStatus = 'Not Started' | 'In Progress' | 'Completed';
type RiskLevel = 'Standard' | 'High Risk';

interface Resident {
  id: string;
  caseId: string;
  safehouse: string;
  caseStatus: CaseStatus;
  caseCategory: CaseCategory;
  // Sub-categories
  isTrafficked: boolean;
  isChildLabor: boolean;
  isPhysicalAbuse: boolean;
  isSexualAbuse: boolean;
  isOsaec: boolean;
  isCicl: boolean;
  isAtRisk: boolean;
  isStreetChild: boolean;
  isChildWithHiv: boolean;
  // Family profile
  is4ps: boolean;
  isSoloParent: boolean;
  isIndigenous: boolean;
  isInformalSettler: boolean;
  // Case details
  admissionDate: string;
  assignedSocialWorker: string;
  referralSource: string;
  riskLevel: RiskLevel;
  reintegrationType: ReintegrationType;
  reintegrationStatus: ReintegrationStatus;
  daysInProgram: number;
  // Optional disability
  hasDisability: boolean;
  disabilityDetails: string;
}

interface ResidentFormDraft {
  safehouse: string;
  caseStatus: CaseStatus;
  caseCategory: CaseCategory;
  isTrafficked: boolean;
  isChildLabor: boolean;
  isPhysicalAbuse: boolean;
  isSexualAbuse: boolean;
  isOsaec: boolean;
  isCicl: boolean;
  isAtRisk: boolean;
  isStreetChild: boolean;
  isChildWithHiv: boolean;
  is4ps: boolean;
  isSoloParent: boolean;
  isIndigenous: boolean;
  isInformalSettler: boolean;
  admissionDate: string;
  assignedSocialWorker: string;
  referralSource: string;
  riskLevel: RiskLevel;
  reintegrationType: ReintegrationType;
  reintegrationStatus: ReintegrationStatus;
  hasDisability: boolean;
  disabilityDetails: string;
}

// ---------------------------------------------------------------------------
// Filler data
// ---------------------------------------------------------------------------

// TODO: Replace with GET /api/residents
const fillerResidents: Resident[] = [
  { id: '1', caseId: 'RES-2024-001', safehouse: 'Haven House Manila',  caseStatus: 'Active',      caseCategory: 'Exploited',   isTrafficked: true,  isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: true,  isOsaec: true,  isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: true,  isSoloParent: true,  isIndigenous: false, isInformalSettler: true,  admissionDate: '2024-06-12', assignedSocialWorker: 'Ana Reyes',    referralSource: 'DSWD Referral',    riskLevel: 'High Risk', reintegrationType: 'Family',          reintegrationStatus: 'Not Started', daysInProgram: 298, hasDisability: false, disabilityDetails: '' },
  { id: '2', caseId: 'RES-2024-002', safehouse: 'Light of Hope Cebu',  caseStatus: 'Active',      caseCategory: 'Neglected',   isTrafficked: false, isChildLabor: true,  isPhysicalAbuse: true,  isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: true,  isChildWithHiv: false, is4ps: true,  isSoloParent: false, isIndigenous: true,  isInformalSettler: true,  admissionDate: '2024-08-03', assignedSocialWorker: 'Ben Cruz',     referralSource: 'Police Referral',  riskLevel: 'High Risk', reintegrationType: 'Foster Care',     reintegrationStatus: 'Not Started', daysInProgram: 246, hasDisability: false, disabilityDetails: '' },
  { id: '3', caseId: 'RES-2024-003', safehouse: 'New Dawn Davao',      caseStatus: 'Active',      caseCategory: 'Abandoned',   isTrafficked: false, isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: true,  isStreetChild: false, isChildWithHiv: false, is4ps: false, isSoloParent: false, isIndigenous: true,  isInformalSettler: false, admissionDate: '2024-04-20', assignedSocialWorker: 'Celia Santos', referralSource: 'Barangay Official', riskLevel: 'Standard',  reintegrationType: 'Family',          reintegrationStatus: 'In Progress', daysInProgram: 351, hasDisability: true,  disabilityDetails: 'Mild hearing impairment' },
  { id: '4', caseId: 'RES-2024-004', safehouse: 'Safe Harbor Iloilo',  caseStatus: 'Active',      caseCategory: 'Surrendered', isTrafficked: false, isChildLabor: false, isPhysicalAbuse: true,  isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: true,  isSoloParent: true,  isIndigenous: false, isInformalSettler: true,  admissionDate: '2024-09-15', assignedSocialWorker: 'Ana Reyes',    referralSource: 'NBI Referral',     riskLevel: 'Standard',  reintegrationType: 'Independent Living', reintegrationStatus: 'Not Started', daysInProgram: 203, hasDisability: false, disabilityDetails: '' },
  { id: '5', caseId: 'RES-2024-005', safehouse: 'Haven House Manila',  caseStatus: 'Active',      caseCategory: 'Exploited',   isTrafficked: true,  isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: true,  isOsaec: true,  isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: false, isSoloParent: false, isIndigenous: false, isInformalSettler: false, admissionDate: '2024-11-01', assignedSocialWorker: 'Donna Lim',    referralSource: 'DSWD Referral',    riskLevel: 'High Risk', reintegrationType: 'Family',          reintegrationStatus: 'Not Started', daysInProgram: 156, hasDisability: false, disabilityDetails: '' },
  { id: '6', caseId: 'RES-2023-018', safehouse: 'Light of Hope Cebu',  caseStatus: 'Active',      caseCategory: 'Neglected',   isTrafficked: false, isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: true,  isSoloParent: false, isIndigenous: false, isInformalSettler: false, admissionDate: '2023-10-08', assignedSocialWorker: 'Ben Cruz',     referralSource: 'Hospital Referral',riskLevel: 'Standard',  reintegrationType: 'Family',          reintegrationStatus: 'In Progress', daysInProgram: 546, hasDisability: false, disabilityDetails: '' },
  { id: '7', caseId: 'RES-2025-001', safehouse: 'New Dawn Davao',      caseStatus: 'Pending',     caseCategory: 'Foundling',   isTrafficked: false, isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: true,  isStreetChild: false, isChildWithHiv: false, is4ps: false, isSoloParent: false, isIndigenous: false, isInformalSettler: false, admissionDate: '2025-01-30', assignedSocialWorker: 'Celia Santos', referralSource: 'LGU Referral',     riskLevel: 'Standard',  reintegrationType: 'N/A',             reintegrationStatus: 'Not Started', daysInProgram: 66,  hasDisability: false, disabilityDetails: '' },
  { id: '8', caseId: 'RES-2023-025', safehouse: 'New Dawn Davao',      caseStatus: 'Closed',      caseCategory: 'Exploited',   isTrafficked: true,  isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: true,  isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: true,  isSoloParent: true,  isIndigenous: false, isInformalSettler: true,  admissionDate: '2023-03-01', assignedSocialWorker: 'Ben Cruz',     referralSource: 'DSWD Referral',    riskLevel: 'Standard',  reintegrationType: 'Family',          reintegrationStatus: 'Completed',   daysInProgram: 720, hasDisability: false, disabilityDetails: '' },
  { id: '9', caseId: 'RES-2024-009', safehouse: 'Haven House Manila',  caseStatus: 'Active',      caseCategory: 'Neglected',   isTrafficked: false, isChildLabor: false, isPhysicalAbuse: true,  isSexualAbuse: false, isOsaec: false, isCicl: true,  isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: false, isSoloParent: false, isIndigenous: false, isInformalSettler: false, admissionDate: '2024-07-22', assignedSocialWorker: 'Donna Lim',    referralSource: 'Court Order',      riskLevel: 'Standard',  reintegrationType: 'Independent Living', reintegrationStatus: 'Not Started', daysInProgram: 258, hasDisability: true,  disabilityDetails: 'Developmental delay' },
  { id: '10', caseId: 'RES-2024-011', safehouse: 'Safe Harbor Iloilo', caseStatus: 'Transferred', caseCategory: 'Surrendered', isTrafficked: false, isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: false, isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false, is4ps: true,  isSoloParent: false, isIndigenous: true,  isInformalSettler: false, admissionDate: '2024-05-10', assignedSocialWorker: 'Ana Reyes',    referralSource: 'NGO Referral',     riskLevel: 'Standard',  reintegrationType: 'Foster Care',     reintegrationStatus: 'In Progress', daysInProgram: 331, hasDisability: false, disabilityDetails: '' },
];

const SAFEHOUSES = ['Haven House Manila', 'Light of Hope Cebu', 'New Dawn Davao', 'Safe Harbor Iloilo'];
const SOCIAL_WORKERS = ['Ana Reyes', 'Ben Cruz', 'Celia Santos', 'Donna Lim'];

const STATUS_COLORS: Record<CaseStatus, string> = {
  Active:      'bg-emerald-100 text-emerald-800 border-emerald-200',
  Pending:     'bg-amber-100 text-amber-800 border-amber-200',
  Transferred: 'bg-sky-100 text-sky-800 border-sky-200',
  Closed:      'bg-stone-100 text-stone-600 border-stone-200',
};

const emptyForm: ResidentFormDraft = {
  safehouse: SAFEHOUSES[0], caseStatus: 'Pending', caseCategory: 'Neglected',
  isTrafficked: false, isChildLabor: false, isPhysicalAbuse: false, isSexualAbuse: false,
  isOsaec: false, isCicl: false, isAtRisk: false, isStreetChild: false, isChildWithHiv: false,
  is4ps: false, isSoloParent: false, isIndigenous: false, isInformalSettler: false,
  admissionDate: new Date().toISOString().substring(0, 10),
  assignedSocialWorker: SOCIAL_WORKERS[0], referralSource: '', riskLevel: 'Standard',
  reintegrationType: 'N/A', reintegrationStatus: 'Not Started',
  hasDisability: false, disabilityDetails: '',
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PlusIcon()   { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function SearchIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function XIcon()      { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${STATUS_COLORS[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
    </span>
  );
}

function CheckBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-700">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-stone-300 text-haven-teal-600
          focus:ring-haven-teal-500 focus:ring-offset-0" />
      {label}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CaseloadPage() {
  const [residents, setResidents]     = useState<Resident[]>(fillerResidents);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'All'>('All');
  const [safeFilter, setSafeFilter]   = useState('All');
  const [catFilter, setCatFilter]     = useState<CaseCategory | 'All'>('All');
  const [riskFilter, setRiskFilter]   = useState<RiskLevel | 'All'>('All');

  // Modal / detail
  const [modal, setModal]             = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected]       = useState<Resident | null>(null);
  const [detailOpen, setDetailOpen]   = useState(false);
  const [form, setForm]               = useState<ResidentFormDraft>(emptyForm);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const filtered = residents.filter(r => {
    const q = search.toLowerCase();
    const matchQ = q === '' || r.caseId.toLowerCase().includes(q) || r.assignedSocialWorker.toLowerCase().includes(q) || r.referralSource.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || r.caseStatus === statusFilter;
    const matchSh = safeFilter === 'All' || r.safehouse === safeFilter;
    const matchC = catFilter === 'All' || r.caseCategory === catFilter;
    const matchR = riskFilter === 'All' || r.riskLevel === riskFilter;
    return matchQ && matchS && matchSh && matchC && matchR;
  });

  // -------------------------------------------------------------------------
  // CRUD
  // -------------------------------------------------------------------------

  function openAdd() { setForm(emptyForm); setSelected(null); setModal('add'); }
  function openEdit(r: Resident) {
    setForm({ safehouse: r.safehouse, caseStatus: r.caseStatus, caseCategory: r.caseCategory, isTrafficked: r.isTrafficked, isChildLabor: r.isChildLabor, isPhysicalAbuse: r.isPhysicalAbuse, isSexualAbuse: r.isSexualAbuse, isOsaec: r.isOsaec, isCicl: r.isCicl, isAtRisk: r.isAtRisk, isStreetChild: r.isStreetChild, isChildWithHiv: r.isChildWithHiv, is4ps: r.is4ps, isSoloParent: r.isSoloParent, isIndigenous: r.isIndigenous, isInformalSettler: r.isInformalSettler, admissionDate: r.admissionDate, assignedSocialWorker: r.assignedSocialWorker, referralSource: r.referralSource, riskLevel: r.riskLevel, reintegrationType: r.reintegrationType, reintegrationStatus: r.reintegrationStatus, hasDisability: r.hasDisability, disabilityDetails: r.disabilityDetails });
    setSelected(r);
    setModal('edit');
  }

  function saveForm(e: { preventDefault(): void }) {
    e.preventDefault();
    const today = new Date().toISOString().substring(0, 10);
    const admission = form.admissionDate || today;
    const days = Math.floor((new Date(today).getTime() - new Date(admission).getTime()) / 86400000);
    if (modal === 'add') {
      const nr: Resident = { id: String(Date.now()), caseId: `RES-${new Date().getFullYear()}-${String(residents.length + 1).padStart(3,'0')}`, ...form, daysInProgram: days };
      setResidents(p => [nr, ...p]);
      // TODO: POST /api/residents { body: form }
    } else if (modal === 'edit' && selected) {
      setResidents(p => p.map(r => r.id === selected.id ? { ...r, ...form, daysInProgram: days } : r));
      setSelected(prev => prev ? { ...prev, ...form, daysInProgram: days } : null);
      // TODO: PUT /api/residents/${selected.id} { body: form }
    }
    setModal(null);
  }

  function confirmDelete() {
    if (selected) {
      setResidents(p => p.filter(r => r.id !== selected.id));
      setSelected(null);
      setDetailOpen(false);
      // TODO: DELETE /api/residents/${selected.id}
    }
    setModal(null);
  }

  function handleRowClick(r: Resident) { setSelected(r); setDetailOpen(true); }

  const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
    text-stone-900 placeholder:text-stone-400 hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;
  const selectCls = `px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-700
    hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Caseload Inventory</h2>
          <p className="text-sm text-stone-500">{filtered.length} of {residents.length} residents</p>
        </div>
        <button type="button" onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
            text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
            focus-visible:ring-offset-2">
          <PlusIcon /> New Resident Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"><SearchIcon /></span>
          <input type="search" placeholder="Search by case ID, social worker, referral…" value={search}
            onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as CaseStatus | 'All')} className={selectCls} aria-label="Filter by status">
          <option value="All">All Statuses</option>
          {(['Active','Pending','Transferred','Closed'] as CaseStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={safeFilter} onChange={e => setSafeFilter(e.target.value)} className={selectCls} aria-label="Filter by safehouse">
          <option value="All">All Safehouses</option>
          {SAFEHOUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value as CaseCategory | 'All')} className={selectCls} aria-label="Filter by category">
          <option value="All">All Categories</option>
          {(['Abandoned','Foundling','Surrendered','Neglected','Exploited'] as CaseCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as RiskLevel | 'All')} className={selectCls} aria-label="Filter by risk">
          <option value="All">All Risk Levels</option>
          <option value="Standard">Standard</option>
          <option value="High Risk">High Risk</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                {['Case ID', 'Safehouse', 'Category', 'Status', 'Risk', 'Social Worker', 'Admission', 'Days', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-stone-400">No residents match the current filters.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}
                  className="hover:bg-stone-50 transition-colors duration-100 cursor-pointer"
                  onClick={() => handleRowClick(r)}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-stone-700">{r.caseId}</td>
                  <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{r.safehouse}</td>
                  <td className="px-4 py-3 text-stone-700">{r.caseCategory}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.caseStatus} /></td>
                  <td className="px-4 py-3">
                    {r.riskLevel === 'High Risk'
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border transition-none bg-rose-100 text-rose-800 border-rose-200"><span className="h-1.5 w-1.5 rounded-full bg-current" />High Risk</span>
                      : <span className="text-xs text-stone-400">Standard</span>}
                  </td>
                  <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{r.assignedSocialWorker}</td>
                  <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{r.admissionDate}</td>
                  <td className="px-4 py-3 text-stone-700 tabular-nums">{r.daysInProgram}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => openEdit(r)}
                        className="text-sm font-medium text-haven-teal-600 hover:text-haven-teal-700
                          transition-colors focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-haven-teal-500 focus-visible:ring-offset-1 rounded py-2 px-3">Edit</button>
                      <button type="button" onClick={() => { setSelected(r); setModal('delete'); }}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700
                          transition-colors focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-rose-500 focus-visible:ring-offset-1 rounded py-2 px-3">Close</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Resident detail slide-over                                          */}
      {/* ================================================================== */}
      {detailOpen && selected && (
        <>
          <div className="fixed inset-0 bg-stone-900/30 z-30" onClick={() => setDetailOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-xl z-40 flex flex-col"
            aria-label="Resident detail">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
              <div>
                <p className="font-mono text-sm font-bold text-stone-900">{selected.caseId}</p>
                <p className="text-xs text-stone-400 mt-0.5">{selected.safehouse}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => openEdit(selected)}
                  className="px-3 py-1.5 text-xs font-semibold text-haven-teal-600 bg-haven-teal-50
                    border border-haven-teal-200 rounded-lg hover:bg-haven-teal-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500">Edit</button>
                <button type="button" onClick={() => setDetailOpen(false)} aria-label="Close"
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"><XIcon /></button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Status row */}
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.caseStatus} />
                {selected.riskLevel === 'High Risk' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border transition-none bg-rose-100 text-rose-800 border-rose-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />High Risk</span>
                )}
              </div>

              {/* Case details */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Case Details</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { label: 'Category',           value: selected.caseCategory },
                    { label: 'Admission Date',      value: selected.admissionDate },
                    { label: 'Days in Program',     value: String(selected.daysInProgram) },
                    { label: 'Social Worker',       value: selected.assignedSocialWorker },
                    { label: 'Referral Source',     value: selected.referralSource || '—' },
                    { label: 'Reintegration Type',  value: selected.reintegrationType },
                    { label: 'Reintegration Status',value: selected.reintegrationStatus },
                  ].map(row => (
                    <div key={row.label}>
                      <dt className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">{row.label}</dt>
                      <dd className="text-sm text-stone-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Sub-categories */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Sub-Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Trafficked',     active: selected.isTrafficked },
                    { label: 'Child Labor',    active: selected.isChildLabor },
                    { label: 'Physical Abuse', active: selected.isPhysicalAbuse },
                    { label: 'Sexual Abuse',   active: selected.isSexualAbuse },
                    { label: 'OSAEC',          active: selected.isOsaec },
                    { label: 'CICL',           active: selected.isCicl },
                    { label: 'At Risk',        active: selected.isAtRisk },
                    { label: 'Street Child',   active: selected.isStreetChild },
                    { label: 'Child w/ HIV',   active: selected.isChildWithHiv },
                  ].filter(s => s.active).map(s => (
                    <span key={s.label} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                      bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wide transition-none">
                      {s.label}
                    </span>
                  ))}
                  {![selected.isTrafficked, selected.isChildLabor, selected.isPhysicalAbuse, selected.isSexualAbuse, selected.isOsaec, selected.isCicl, selected.isAtRisk, selected.isStreetChild, selected.isChildWithHiv].some(Boolean) && (
                    <span className="text-sm text-stone-400">None recorded</span>
                  )}
                </div>
              </section>

              {/* Family profile */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Family Socio-Demographic</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '4Ps Beneficiary',  active: selected.is4ps },
                    { label: 'Solo Parent',       active: selected.isSoloParent },
                    { label: 'Indigenous Group',  active: selected.isIndigenous },
                    { label: 'Informal Settler',  active: selected.isInformalSettler },
                  ].filter(s => s.active).map(s => (
                    <span key={s.label} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                      bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wide">
                      {s.label}
                    </span>
                  ))}
                  {![selected.is4ps, selected.isSoloParent, selected.isIndigenous, selected.isInformalSettler].some(Boolean) && (
                    <span className="text-sm text-stone-400">None recorded</span>
                  )}
                </div>
              </section>

              {/* Disability */}
              {selected.hasDisability && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Disability</h3>
                  <p className="text-sm text-stone-700">{selected.disabilityDetails || 'Details not recorded.'}</p>
                </section>
              )}
            </div>

            {/* Footer link to process recording */}
            <div className="shrink-0 border-t border-stone-200 px-6 py-4">
              <a href={`/admin/process-recording?case=${selected.caseId}`}
                className="block w-full text-center px-5 py-2.5 bg-haven-teal-600 text-white text-sm
                  font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2">
                View Process Recordings
              </a>
            </div>
          </aside>
        </>
      )}

      {/* ================================================================== */}
      {/* MODAL: Add / Edit Resident                                          */}
      {/* ================================================================== */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setModal(null)} aria-modal="true" role="dialog" aria-labelledby="res-modal-title">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <form onSubmit={saveForm} className="flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
                <h2 id="res-modal-title" className="text-lg font-semibold text-stone-900">
                  {modal === 'add' ? 'New Resident Record' : `Edit ${selected?.caseId}`}
                </h2>
                <button type="button" onClick={() => setModal(null)} aria-label="Close"
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"><XIcon /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Placement */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Placement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="r-safe" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Safehouse</label>
                      <select id="r-safe" value={form.safehouse} onChange={e => setForm(f => ({ ...f, safehouse: e.target.value }))} className={inputCls}>
                        {SAFEHOUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="r-sw" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Social Worker</label>
                      <select id="r-sw" value={form.assignedSocialWorker} onChange={e => setForm(f => ({ ...f, assignedSocialWorker: e.target.value }))} className={inputCls}>
                        {SOCIAL_WORKERS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="r-admit" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Admission Date</label>
                      <input id="r-admit" type="date" value={form.admissionDate} onChange={e => setForm(f => ({ ...f, admissionDate: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="r-ref" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Referral Source</label>
                      <input id="r-ref" type="text" value={form.referralSource} onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))} className={inputCls} placeholder="DSWD, Police, NGO…" />
                    </div>
                  </div>
                </div>

                {/* Case classification */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Case Classification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="r-cat" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Category</label>
                      <select id="r-cat" value={form.caseCategory} onChange={e => setForm(f => ({ ...f, caseCategory: e.target.value as CaseCategory }))} className={inputCls}>
                        {(['Abandoned','Foundling','Surrendered','Neglected','Exploited'] as CaseCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="r-status" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Case Status</label>
                      <select id="r-status" value={form.caseStatus} onChange={e => setForm(f => ({ ...f, caseStatus: e.target.value as CaseStatus }))} className={inputCls}>
                        {(['Active','Pending','Transferred','Closed'] as CaseStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="r-risk" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Risk Level</label>
                      <select id="r-risk" value={form.riskLevel} onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value as RiskLevel }))} className={inputCls}>
                        <option value="Standard">Standard</option>
                        <option value="High Risk">High Risk</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-categories */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Sub-Categories</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <CheckBox label="Trafficked"     checked={form.isTrafficked}    onChange={v => setForm(f => ({...f, isTrafficked: v}))} />
                    <CheckBox label="Child Labor"    checked={form.isChildLabor}    onChange={v => setForm(f => ({...f, isChildLabor: v}))} />
                    <CheckBox label="Physical Abuse" checked={form.isPhysicalAbuse} onChange={v => setForm(f => ({...f, isPhysicalAbuse: v}))} />
                    <CheckBox label="Sexual Abuse"   checked={form.isSexualAbuse}   onChange={v => setForm(f => ({...f, isSexualAbuse: v}))} />
                    <CheckBox label="OSAEC"          checked={form.isOsaec}         onChange={v => setForm(f => ({...f, isOsaec: v}))} />
                    <CheckBox label="CICL"           checked={form.isCicl}          onChange={v => setForm(f => ({...f, isCicl: v}))} />
                    <CheckBox label="At Risk"        checked={form.isAtRisk}        onChange={v => setForm(f => ({...f, isAtRisk: v}))} />
                    <CheckBox label="Street Child"   checked={form.isStreetChild}   onChange={v => setForm(f => ({...f, isStreetChild: v}))} />
                    <CheckBox label="Child w/ HIV"   checked={form.isChildWithHiv}  onChange={v => setForm(f => ({...f, isChildWithHiv: v}))} />
                  </div>
                </div>

                {/* Family profile */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Family Socio-Demographic Profile</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <CheckBox label="4Ps Beneficiary"  checked={form.is4ps}           onChange={v => setForm(f => ({...f, is4ps: v}))} />
                    <CheckBox label="Solo Parent"       checked={form.isSoloParent}    onChange={v => setForm(f => ({...f, isSoloParent: v}))} />
                    <CheckBox label="Indigenous Group"  checked={form.isIndigenous}    onChange={v => setForm(f => ({...f, isIndigenous: v}))} />
                    <CheckBox label="Informal Settler"  checked={form.isInformalSettler} onChange={v => setForm(f => ({...f, isInformalSettler: v}))} />
                  </div>
                </div>

                {/* Disability */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Disability</h3>
                  <CheckBox label="Has a disability" checked={form.hasDisability} onChange={v => setForm(f => ({...f, hasDisability: v}))} />
                  {form.hasDisability && (
                    <div className="mt-3">
                      <label htmlFor="r-dis" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Details</label>
                      <input id="r-dis" type="text" value={form.disabilityDetails} onChange={e => setForm(f => ({...f, disabilityDetails: e.target.value}))} className={inputCls} placeholder="Describe disability…" />
                    </div>
                  )}
                </div>

                {/* Reintegration */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Reintegration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="r-rtype" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Type</label>
                      <select id="r-rtype" value={form.reintegrationType} onChange={e => setForm(f => ({...f, reintegrationType: e.target.value as ReintegrationType}))} className={inputCls}>
                        {(['Family','Independent Living','Foster Care','Adoption','N/A'] as ReintegrationType[]).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="r-rstatus" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Status</label>
                      <select id="r-rstatus" value={form.reintegrationStatus} onChange={e => setForm(f => ({...f, reintegrationStatus: e.target.value as ReintegrationStatus}))} className={inputCls}>
                        {(['Not Started','In Progress','Completed'] as ReintegrationStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setModal(null)}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                    text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
                <button type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                    text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                  {modal === 'add' ? 'Create Record' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {modal === 'delete' && selected && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setModal(null)} aria-modal="true" role="dialog">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-stone-900 mb-2">Close Case</h2>
              <p className="text-sm text-stone-600">Close case record <strong>{selected.caseId}</strong>? This will remove it from active caseloads.</p>
            </div>
            <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                  text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-rose-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-rose-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-none">
                Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
