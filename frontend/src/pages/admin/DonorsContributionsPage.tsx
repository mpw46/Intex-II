import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SupporterType =
  | 'MonetaryDonor'
  | 'InKindDonor'
  | 'Volunteer'
  | 'SkillsContributor'
  | 'SocialMediaAdvocate'
  | 'PartnerOrganization';

type SupporterStatus = 'Active' | 'Inactive';

type DonationType = 'Monetary' | 'InKind' | 'Time' | 'Skills' | 'SocialMedia';

type ContributionTab = 'profile' | 'donations' | 'allocations';

interface Supporter {
  id: string;
  displayName: string;
  supporterType: SupporterType;
  email: string;
  phone: string;
  relationshipType: string;
  acquisitionChannel: string;
  status: SupporterStatus;
  notes: string;
}

interface Donation {
  id: string;
  supporterId: string;
  donationType: DonationType;
  amount: number | null;
  description: string;
  channel: string;
  isRecurring: boolean;
  campaignName: string;
  date: string;
}

interface DonationAllocation {
  id: string;
  donationId: string;
  safehouse: string;
  programArea: string;
  amount: number;
}

interface SupporterFormDraft {
  displayName: string;
  supporterType: SupporterType;
  email: string;
  phone: string;
  relationshipType: string;
  acquisitionChannel: string;
  status: SupporterStatus;
  notes: string;
}

interface DonationFormDraft {
  donationType: DonationType;
  amount: string;
  description: string;
  channel: string;
  isRecurring: boolean;
  campaignName: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Filler data
// ---------------------------------------------------------------------------

// TODO: Replace with GET /api/supporters
const fillerSupporters: Supporter[] = [
  { id: 'SUP-001', displayName: 'Reyes Family Foundation', supporterType: 'MonetaryDonor',       email: 'giving@reyesfdn.ph',      phone: '+63 2 8800 1234', relationshipType: 'Foundation',        acquisitionChannel: 'Direct Outreach', status: 'Active',   notes: 'Long-term partner since 2021. Prefers quarterly updates.' },
  { id: 'SUP-002', displayName: 'Luz Macaraeg',            supporterType: 'Volunteer',            email: 'luz.m@email.com',         phone: '+63 917 555 0101', relationshipType: 'Individual',       acquisitionChannel: 'Website',         status: 'Active',   notes: 'Social work graduate, available weekends.' },
  { id: 'SUP-003', displayName: 'Cebu Business Network',   supporterType: 'PartnerOrganization',  email: 'partnerships@cbnet.ph',   phone: '+63 32 411 5000', relationshipType: 'Corporate Partner', acquisitionChannel: 'Referral',        status: 'Active',   notes: '' },
  { id: 'SUP-004', displayName: 'Daniel Tan',              supporterType: 'MonetaryDonor',        email: 'daniel.t@gmail.com',      phone: '+63 918 777 0202', relationshipType: 'Individual',       acquisitionChannel: 'Social Media',    status: 'Active',   notes: 'Discovered us via Instagram campaign.' },
  { id: 'SUP-005', displayName: 'Grace Soriano',           supporterType: 'InKindDonor',          email: 'grace.s@email.com',       phone: '+63 919 333 0303', relationshipType: 'Individual',       acquisitionChannel: 'Event',           status: 'Active',   notes: 'Donates school supplies every school year.' },
  { id: 'SUP-006', displayName: 'Global Care Corp.',       supporterType: 'MonetaryDonor',        email: 'csr@globalcare.com',      phone: '+1 415 222 3344',  relationshipType: 'Corporate Donor',  acquisitionChannel: 'Direct Outreach', status: 'Active',   notes: 'US-based CSR programme. Annual commitment.' },
  { id: 'SUP-007', displayName: 'Marco Rivera',            supporterType: 'SkillsContributor',    email: 'marco.r@techconsult.ph',  phone: '+63 920 444 0404', relationshipType: 'Individual',       acquisitionChannel: 'Referral',        status: 'Inactive', notes: 'IT consultant; helped set up network at Manila house.' },
  { id: 'SUP-008', displayName: 'Hope Advocates PH',       supporterType: 'SocialMediaAdvocate', email: 'info@hopeadvocates.ph',   phone: '+63 2 7900 5678',  relationshipType: 'Advocacy Group',   acquisitionChannel: 'Social Media',    status: 'Active',   notes: '' },
];

// TODO: Replace with GET /api/donations?supporterId=:id
const fillerDonations: Donation[] = [
  { id: 'DON-001', supporterId: 'SUP-001', donationType: 'Monetary', amount: 150000, description: 'Q1 2026 grant',           channel: 'Bank Transfer', isRecurring: true,  campaignName: 'General Fund',     date: '2026-01-15' },
  { id: 'DON-002', supporterId: 'SUP-001', donationType: 'Monetary', amount: 150000, description: 'Q4 2025 grant',           channel: 'Bank Transfer', isRecurring: true,  campaignName: 'General Fund',     date: '2025-10-15' },
  { id: 'DON-003', supporterId: 'SUP-002', donationType: 'Time',     amount: null,   description: '12 hrs group facilitation',channel: 'In Person',    isRecurring: false, campaignName: '',                 date: '2026-03-08' },
  { id: 'DON-004', supporterId: 'SUP-004', donationType: 'Monetary', amount: 6000,   description: 'Monthly giving',          channel: 'GCash',         isRecurring: true,  campaignName: 'Monthly Donors',   date: '2026-04-01' },
  { id: 'DON-005', supporterId: 'SUP-005', donationType: 'InKind',   amount: null,   description: '30 school supply kits',   channel: 'Drop-off',      isRecurring: false, campaignName: 'Back to School',   date: '2026-06-01' },
  { id: 'DON-006', supporterId: 'SUP-006', donationType: 'Monetary', amount: 250000, description: '2026 CSR commitment',     channel: 'Wire Transfer', isRecurring: true,  campaignName: 'Corporate Partner',date: '2026-03-01' },
  { id: 'DON-007', supporterId: 'SUP-008', donationType: 'SocialMedia', amount: null, description: '42 shares, 18 tags',    channel: 'Instagram',     isRecurring: false, campaignName: 'Awareness Month',  date: '2026-04-05' },
];

// TODO: Replace with GET /api/donation-allocations?donationId=:id
const fillerAllocations: DonationAllocation[] = [
  { id: 'ALLOC-001', donationId: 'DON-001', safehouse: 'Haven House Manila',  programArea: 'Counseling',    amount: 60000  },
  { id: 'ALLOC-002', donationId: 'DON-001', safehouse: 'Light of Hope Cebu',  programArea: 'Education',     amount: 50000  },
  { id: 'ALLOC-003', donationId: 'DON-001', safehouse: 'New Dawn Davao',       programArea: 'Health',        amount: 40000  },
  { id: 'ALLOC-004', donationId: 'DON-006', safehouse: 'Safe Harbor Iloilo',  programArea: 'General Ops',   amount: 100000 },
  { id: 'ALLOC-005', donationId: 'DON-006', safehouse: 'Haven House Manila',  programArea: 'Reintegration', amount: 150000 },
];

// ---------------------------------------------------------------------------
// Constants / maps
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<SupporterType, string> = {
  MonetaryDonor:       'Monetary Donor',
  InKindDonor:         'In-Kind Donor',
  Volunteer:           'Volunteer',
  SkillsContributor:   'Skills Contributor',
  SocialMediaAdvocate: 'Social Media Advocate',
  PartnerOrganization: 'Partner Org.',
};

const TYPE_COLORS: Record<SupporterType, string> = {
  MonetaryDonor:       'bg-emerald-100 text-emerald-800 border-emerald-200',
  InKindDonor:         'bg-sky-100 text-sky-800 border-sky-200',
  Volunteer:           'bg-amber-100 text-amber-800 border-amber-200',
  SkillsContributor:   'bg-purple-100 text-purple-800 border-purple-200',
  SocialMediaAdvocate: 'bg-haven-teal-100 text-haven-teal-800 border-haven-teal-200',
  PartnerOrganization: 'bg-stone-100 text-stone-700 border-stone-200',
};

const DON_TYPE_COLORS: Record<DonationType, string> = {
  Monetary:    'bg-emerald-100 text-emerald-800 border-emerald-200',
  InKind:      'bg-sky-100 text-sky-800 border-sky-200',
  Time:        'bg-amber-100 text-amber-800 border-amber-200',
  Skills:      'bg-purple-100 text-purple-800 border-purple-200',
  SocialMedia: 'bg-haven-teal-100 text-haven-teal-800 border-haven-teal-200',
};

const ACQUISITION_CHANNELS = ['Website', 'Referral', 'Event', 'Social Media', 'Direct Outreach'];

// TODO: Use PROGRAM_AREAS and SAFEHOUSES in allocation form when implemented
// const PROGRAM_AREAS = ['General Ops', 'Counseling', 'Education', 'Health', 'Reintegration', 'Housing'];
// const SAFEHOUSES = ['Haven House Manila', 'Light of Hope Cebu', 'New Dawn Davao', 'Safe Harbor Iloilo'];

const emptySupporterForm: SupporterFormDraft = {
  displayName: '', supporterType: 'MonetaryDonor', email: '', phone: '',
  relationshipType: '', acquisitionChannel: 'Website', status: 'Active', notes: '',
};

const emptyDonationForm: DonationFormDraft = {
  donationType: 'Monetary', amount: '', description: '', channel: 'Bank Transfer',
  isRecurring: false, campaignName: '', date: new Date().toISOString().substring(0, 10),
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PlusIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function SearchIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function XIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function ChevronRightIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>; }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypeBadge({ type }: { type: SupporterType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${TYPE_COLORS[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

function DonTypeBadge({ type }: { type: DonationType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${DON_TYPE_COLORS[type]}`}>
      {type}
    </span>
  );
}

function StatusPill({ status }: { status: SupporterStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border
      ${status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DonorsContributionsPage() {
  const [supporters, setSupporters]       = useState<Supporter[]>(fillerSupporters);
  const [donations, setDonations]         = useState<Donation[]>(fillerDonations);
  const [search, setSearch]               = useState('');
  const [typeFilter, setTypeFilter]       = useState<SupporterType | 'All'>('All');
  const [statusFilter, setStatusFilter]   = useState<SupporterStatus | 'All'>('All');

  // Selected supporter detail panel
  const [selected, setSelected]           = useState<Supporter | null>(null);
  const [detailTab, setDetailTab]         = useState<ContributionTab>('profile');
  // Mobile: show list or detail one at a time
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // Supporter modal
  const [supporterModal, setSupporterModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [supporterForm, setSupporterForm]   = useState<SupporterFormDraft>(emptySupporterForm);

  // Donation modal
  const [donationModal, setDonationModal] = useState<'add' | 'delete' | null>(null);
  const [donationForm, setDonationForm]   = useState<DonationFormDraft>(emptyDonationForm);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const filtered = supporters.filter(s => {
    const q = search.toLowerCase();
    const matchQ = q === '' || s.displayName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchT = typeFilter === 'All' || s.supporterType === typeFilter;
    const matchS = statusFilter === 'All' || s.status === statusFilter;
    return matchQ && matchT && matchS;
  });

  const selectedDonations = selected
    ? donations.filter(d => d.supporterId === selected.id)
    : [];

  const selectedAllocations = selectedDonations.length
    ? fillerAllocations.filter(a => selectedDonations.some(d => d.id === a.donationId))
    : [];

  // -------------------------------------------------------------------------
  // Supporter CRUD
  // -------------------------------------------------------------------------

  function openAdd() { setSupporterForm(emptySupporterForm); setSupporterModal('add'); }
  function openEdit(s: Supporter) { setSupporterForm({ displayName: s.displayName, supporterType: s.supporterType, email: s.email, phone: s.phone, relationshipType: s.relationshipType, acquisitionChannel: s.acquisitionChannel, status: s.status, notes: s.notes }); setSupporterModal('edit'); }
  function openDeleteSupporter(s: Supporter) { setSelected(s); setSupporterModal('delete'); }

  function saveSupporterForm(e: { preventDefault(): void }) {
    e.preventDefault();
    if (supporterModal === 'add') {
      const ns: Supporter = { id: `SUP-${Date.now().toString().slice(-6)}`, ...supporterForm };
      setSupporters(p => [ns, ...p]);
      // TODO: POST /api/supporters { body: supporterForm }
    } else if (supporterModal === 'edit' && selected) {
      setSupporters(p => p.map(s => s.id === selected.id ? { ...s, ...supporterForm } : s));
      setSelected(prev => prev ? { ...prev, ...supporterForm } : null);
      // TODO: PUT /api/supporters/${selected.id} { body: supporterForm }
    }
    setSupporterModal(null);
  }

  function confirmDeleteSupporter() {
    if (selected) {
      setSupporters(p => p.filter(s => s.id !== selected.id));
      setDonations(p => p.filter(d => d.supporterId !== selected.id));
      setSelected(null);
      // TODO: DELETE /api/supporters/${selected.id}
    }
    setSupporterModal(null);
  }

  // -------------------------------------------------------------------------
  // Donation CRUD
  // -------------------------------------------------------------------------

  function openAddDonation() { setDonationForm(emptyDonationForm); setSelectedDonation(null); setDonationModal('add'); }
  function openDeleteDonation(d: Donation) { setSelectedDonation(d); setDonationModal('delete'); }

  function saveDonationForm(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!selected) return;
    const nd: Donation = {
      id: `DON-${Date.now().toString().slice(-6)}`,
      supporterId: selected.id,
      donationType: donationForm.donationType,
      amount: donationForm.amount ? Number(donationForm.amount) : null,
      description: donationForm.description,
      channel: donationForm.channel,
      isRecurring: donationForm.isRecurring,
      campaignName: donationForm.campaignName,
      date: donationForm.date,
    };
    setDonations(p => [nd, ...p]);
    setDonationModal(null);
    // TODO: POST /api/donations { body: nd }
  }

  function confirmDeleteDonation() {
    if (selectedDonation) {
      setDonations(p => p.filter(d => d.id !== selectedDonation.id));
      // TODO: DELETE /api/donations/${selectedDonation.id}
    }
    setDonationModal(null);
    setSelectedDonation(null);
  }

  // -------------------------------------------------------------------------
  // Shared classes
  // -------------------------------------------------------------------------

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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---------------------------------------------------------------- */}
        {/* Left: Supporter list (hidden on mobile when detail is open)      */}
        {/* ---------------------------------------------------------------- */}
        <div className={`w-full lg:w-96 shrink-0 ${mobileShowDetail ? 'hidden lg:block' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">
              Supporters <span className="text-stone-400 font-normal">({filtered.length})</span>
            </h2>
            <button type="button" onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-haven-teal-600 text-white
                text-xs font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                focus-visible:ring-offset-2">
              <PlusIcon /> Add
            </button>
          </div>

          {/* Search + filters */}
          <div className="space-y-2 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"><SearchIcon /></span>
              <input type="search" placeholder="Search name or email…" value={search}
                onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} />
            </div>
            <div className="flex gap-2">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as SupporterType | 'All')}
                className={`${selectCls} flex-1 text-xs`} aria-label="Filter by type">
                <option value="All">All Types</option>
                {(Object.keys(TYPE_LABELS) as SupporterType[]).map(t => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as SupporterStatus | 'All')}
                className={`${selectCls} text-xs`} aria-label="Filter by status">
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 lg:max-h-[60vh] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-stone-400 py-8 text-center">No supporters found.</p>
            ) : filtered.map(s => (
              <button key={s.id} type="button" onClick={() => { setSelected(s); setDetailTab('profile'); setMobileShowDetail(true); }}
                className={`w-full text-left bg-white rounded-xl border p-4 flex items-start justify-between gap-3
                  transition-all duration-150 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  ${selected?.id === s.id ? 'border-haven-teal-400 shadow-md' : 'border-stone-200 shadow-sm hover:border-stone-300'}`}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{s.displayName}</p>
                  <p className="text-xs text-stone-400 truncate mt-0.5">{s.email}</p>
                  <div className="mt-2"><TypeBadge type={s.supporterType} /></div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusPill status={s.status} />
                  <ChevronRightIcon />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right: Detail panel (hidden on mobile when list is shown)        */}
        {/* ---------------------------------------------------------------- */}
        <div className={`flex-1 min-w-0 ${!mobileShowDetail ? 'hidden lg:block' : ''}`}>
        {selected ? (
          <div>
            {/* Mobile back button */}
            <button type="button" onClick={() => setMobileShowDetail(false)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-haven-teal-600
                mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                focus-visible:ring-offset-2 rounded py-1">
              ← Back to Supporters
            </button>

            {/* Supporter header */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">{selected.displayName}</h2>
                  <p className="text-sm text-stone-500 mt-0.5">{selected.email} · {selected.phone}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <TypeBadge type={selected.supporterType} />
                    <StatusPill status={selected.status} />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => openEdit(selected)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-700 text-sm
                      font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                      focus-visible:ring-offset-2">
                    Edit
                  </button>
                  <button type="button" onClick={() => openDeleteSupporter(selected)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-600 text-sm
                      font-medium rounded-lg border border-rose-200 transition-colors hover:bg-rose-50
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                      focus-visible:ring-offset-2">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Detail tabs */}
            <div className="flex gap-0 border-b border-stone-200 mb-5">
              {([
                { id: 'profile' as ContributionTab, label: 'Profile' },
                { id: 'donations' as ContributionTab, label: `Donations (${selectedDonations.length})` },
                { id: 'allocations' as ContributionTab, label: 'Allocations' },
              ]).map(t => (
                <button key={t.id} type="button" onClick={() => setDetailTab(t.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150
                    focus-visible:outline-none
                    ${detailTab === t.id
                      ? 'border-haven-teal-600 text-haven-teal-700'
                      : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Profile tab */}
            {detailTab === 'profile' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    { label: 'Supporter ID',      value: selected.id },
                    { label: 'Relationship Type', value: selected.relationshipType || '—' },
                    { label: 'Acquisition Channel', value: selected.acquisitionChannel },
                    { label: 'Status',            value: selected.status },
                  ].map(row => (
                    <div key={row.label}>
                      <dt className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">{row.label}</dt>
                      <dd className="text-sm text-stone-900">{row.value}</dd>
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Notes</dt>
                    <dd className="text-sm text-stone-700 leading-relaxed">{selected.notes || 'No notes.'}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Donations tab */}
            {detailTab === 'donations' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-stone-500">{selectedDonations.length} contributions recorded</p>
                  <button type="button" onClick={openAddDonation}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-haven-teal-600 text-white
                      text-xs font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                      focus-visible:ring-offset-2">
                    <PlusIcon /> Log Contribution
                  </button>
                </div>
                {selectedDonations.length === 0 ? (
                  <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-10 text-center text-sm text-stone-400">
                    No contributions logged yet.
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200">
                            {['Date', 'Type', 'Amount / Description', 'Channel', 'Campaign', 'Recurring', ''].map(h => (
                              <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {selectedDonations.map(d => (
                            <tr key={d.id} className="hover:bg-stone-50 transition-colors duration-100">
                              <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{d.date}</td>
                              <td className="px-4 py-3"><DonTypeBadge type={d.donationType} /></td>
                              <td className="px-4 py-3">
                                {d.amount !== null
                                  ? <span className="font-medium text-stone-900">₱{d.amount.toLocaleString()}</span>
                                  : <span className="text-stone-500">{d.description}</span>
                                }
                              </td>
                              <td className="px-4 py-3 text-stone-600">{d.channel}</td>
                              <td className="px-4 py-3 text-stone-500">{d.campaignName || '—'}</td>
                              <td className="px-4 py-3 text-center">
                                {d.isRecurring
                                  ? <span className="text-emerald-600 text-xs font-semibold">Yes</span>
                                  : <span className="text-stone-400 text-xs">No</span>}
                              </td>
                              <td className="px-4 py-3">
                                <button type="button" onClick={() => openDeleteDonation(d)}
                                  className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                                    focus-visible:ring-offset-1 rounded">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Allocations tab */}
            {detailTab === 'allocations' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                {selectedAllocations.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-stone-400">No allocations recorded for this supporter's donations.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200">
                          {['Donation', 'Safehouse', 'Program Area', 'Amount'].map(h => (
                            <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {selectedAllocations.map(a => (
                          <tr key={a.id} className="hover:bg-stone-50 transition-colors duration-100">
                            <td className="px-4 py-3 font-mono text-xs text-stone-500">{a.donationId}</td>
                            <td className="px-4 py-3 text-stone-700">{a.safehouse}</td>
                            <td className="px-4 py-3 text-stone-700">{a.programArea}</td>
                            <td className="px-4 py-3 font-medium text-stone-900 tabular-nums">₱{a.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-64">
            <p className="text-sm text-stone-400">Select a supporter to view details.</p>
          </div>
        )}
      </div>
      </div>{/* closes flex flex-col lg:flex-row */}

      {/* ================================================================== */}
      {/* MODAL: Add / Edit Supporter                                         */}
      {/* ================================================================== */}
      {(supporterModal === 'add' || supporterModal === 'edit') && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setSupporterModal(null)} aria-modal="true" role="dialog" aria-labelledby="sup-modal-title">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <form onSubmit={saveSupporterForm}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
                <h2 id="sup-modal-title" className="text-lg font-semibold text-stone-900">
                  {supporterModal === 'add' ? 'Add Supporter' : 'Edit Supporter'}
                </h2>
                <button type="button" onClick={() => setSupporterModal(null)} aria-label="Close"
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"><XIcon /></button>
              </div>
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {[
                  { id: 'sf-name', label: 'Display Name *', type: 'text', field: 'displayName' as const, required: true, placeholder: 'Organisation or full name' },
                  { id: 'sf-email', label: 'Email', type: 'email', field: 'email' as const, required: false, placeholder: 'contact@example.com' },
                  { id: 'sf-phone', label: 'Phone', type: 'tel', field: 'phone' as const, required: false, placeholder: '+63 9XX XXX XXXX' },
                  { id: 'sf-rel', label: 'Relationship Type', type: 'text', field: 'relationshipType' as const, required: false, placeholder: 'e.g. Individual, Foundation' },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input id={f.id} type={f.type} required={f.required} placeholder={f.placeholder}
                      value={supporterForm[f.field]} onChange={e => setSupporterForm(p => ({ ...p, [f.field]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
                <div>
                  <label htmlFor="sf-type" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Supporter Type</label>
                  <select id="sf-type" value={supporterForm.supporterType}
                    onChange={e => setSupporterForm(p => ({ ...p, supporterType: e.target.value as SupporterType }))}
                    className={inputCls}>
                    {(Object.keys(TYPE_LABELS) as SupporterType[]).map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sf-channel" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Acquisition Channel</label>
                  <select id="sf-channel" value={supporterForm.acquisitionChannel}
                    onChange={e => setSupporterForm(p => ({ ...p, acquisitionChannel: e.target.value }))}
                    className={inputCls}>
                    {ACQUISITION_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sf-status" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Status</label>
                  <select id="sf-status" value={supporterForm.status}
                    onChange={e => setSupporterForm(p => ({ ...p, status: e.target.value as SupporterStatus }))}
                    className={inputCls}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sf-notes" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Notes</label>
                  <textarea id="sf-notes" rows={3} value={supporterForm.notes}
                    onChange={e => setSupporterForm(p => ({ ...p, notes: e.target.value }))}
                    className={inputCls} placeholder="Internal notes…" />
                </div>
              </div>
              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setSupporterModal(null)}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                    text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
                <button type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                    text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                  {supporterModal === 'add' ? 'Add Supporter' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donation add modal */}
      {donationModal === 'add' && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setDonationModal(null)} aria-modal="true" role="dialog" aria-labelledby="don-modal-title">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <form onSubmit={saveDonationForm}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
                <h2 id="don-modal-title" className="text-lg font-semibold text-stone-900">Log Contribution</h2>
                <button type="button" onClick={() => setDonationModal(null)} aria-label="Close"
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"><XIcon /></button>
              </div>
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="df-type" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Type</label>
                    <select id="df-type" value={donationForm.donationType}
                      onChange={e => setDonationForm(p => ({ ...p, donationType: e.target.value as DonationType }))}
                      className={inputCls}>
                      {(['Monetary','InKind','Time','Skills','SocialMedia'] as DonationType[]).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="df-date" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Date</label>
                    <input id="df-date" type="date" value={donationForm.date}
                      onChange={e => setDonationForm(p => ({ ...p, date: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>
                {donationForm.donationType === 'Monetary' && (
                  <div>
                    <label htmlFor="df-amount" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Amount (PHP)</label>
                    <input id="df-amount" type="number" min="0" value={donationForm.amount}
                      onChange={e => setDonationForm(p => ({ ...p, amount: e.target.value }))}
                      className={inputCls} placeholder="0.00" />
                  </div>
                )}
                <div>
                  <label htmlFor="df-desc" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Description</label>
                  <input id="df-desc" type="text" value={donationForm.description}
                    onChange={e => setDonationForm(p => ({ ...p, description: e.target.value }))}
                    className={inputCls} placeholder="Brief description of contribution" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="df-channel" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Channel</label>
                    <input id="df-channel" type="text" value={donationForm.channel}
                      onChange={e => setDonationForm(p => ({ ...p, channel: e.target.value }))}
                      className={inputCls} placeholder="Bank Transfer, GCash…" />
                  </div>
                  <div>
                    <label htmlFor="df-campaign" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Campaign</label>
                    <input id="df-campaign" type="text" value={donationForm.campaignName}
                      onChange={e => setDonationForm(p => ({ ...p, campaignName: e.target.value }))}
                      className={inputCls} placeholder="General Fund…" />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={donationForm.isRecurring}
                    onChange={e => setDonationForm(p => ({ ...p, isRecurring: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300 text-haven-teal-600
                      focus:ring-haven-teal-500 focus:ring-offset-0" />
                  <span className="text-sm text-stone-700">Recurring contribution</span>
                </label>
              </div>
              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setDonationModal(null)}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                    text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
                <button type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                    text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modals */}
      {(supporterModal === 'delete' || donationModal === 'delete') && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => { setSupporterModal(null); setDonationModal(null); }}
          aria-modal="true" role="dialog">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-stone-900 mb-2">Confirm Removal</h2>
              <p className="text-sm text-stone-600">
                {supporterModal === 'delete'
                  ? `Remove ${selected?.displayName}? All associated donation records will also be deleted.`
                  : `Delete this contribution record? This cannot be undone.`}
              </p>
            </div>
            <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => { setSupporterModal(null); setDonationModal(null); }}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                  text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
              <button type="button"
                onClick={supporterModal === 'delete' ? confirmDeleteSupporter : confirmDeleteDonation}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-rose-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-rose-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
