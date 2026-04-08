import { useState, useEffect } from 'react';
import { getSupporters, createSupporter, updateSupporter, deleteSupporter } from '../../api/supportersApi';
import { getDonations, createDonationRecord, deleteDonation, getAllocations } from '../../api/donationsApi';
import { getSafehouses, buildSafehouseNameMap } from '../../api/safehousesApi';
import { getMlDonorRisk } from '../../api/mlApi';
import PaginationBar from '../../components/PaginationBar';
import type { DonationAllocationDto } from '../../types/donation';

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
  retentionRisk?: 'High' | 'Medium' | 'Low'; // ML donor lapse prediction
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
// AllocBar — horizontal percentage bar for the Allocations tab
// ---------------------------------------------------------------------------

function AllocBar({ label, pct, amount }: { label: string; pct: number; amount: number }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 shrink-0 text-right">
        <span className="text-base font-bold tabular-nums text-stone-900">{pct}%</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-stone-800 block mb-1.5">{label}</span>
        <svg className="w-full mb-1.5" height="8" aria-label={`${label}: ${pct}%`}>
          <rect x="0" y="0" width="100%" height="8" rx="4" className="fill-stone-200" />
          <rect x="0" y="0" width={`${pct}%`} height="8" rx="4" className="fill-haven-teal-600" />
        </svg>
        <p className="text-xs text-stone-500">₱{amount.toLocaleString()} allocated</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DonorsContributionsPage() {
  const [supporters, setSupporters]       = useState<Supporter[]>([]);
  const [donations, setDonations]         = useState<Donation[]>([]);
  const [allocations, setAllocations]     = useState<DonationAllocation[]>([]);
  const [loading, setLoading]             = useState(true);
  const [shMap, setShMap]                 = useState<Map<number, string>>(new Map());
  const [search, setSearch]               = useState('');
  const [typeFilter, setTypeFilter]       = useState<SupporterType | 'All'>('All');
  const [statusFilter, setStatusFilter]   = useState<SupporterStatus | 'All'>('All');
  const [page, setPage]                   = useState(1);
  const [pageTab, setPageTab]             = useState<'supporters' | 'allocations'>('supporters');
  const [allAllocations, setAllAllocations] = useState<DonationAllocationDto[]>([]);
  const [allocYear, setAllocYear]         = useState<number | 'All'>('All');

  const PAGE_SIZE = 20;

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

  useEffect(() => {
    Promise.all([getSupporters(), getSafehouses(), getMlDonorRisk().catch(() => []), getAllocations()])
      .then(([rawSupporters, safehouses, mlScores, rawAllocs]) => {
        setAllAllocations(rawAllocs);
        setShMap(buildSafehouseNameMap(safehouses));
        // Build ML risk lookup: supporterId → 'High' | 'Medium' | 'Low'
        const mlMap = new Map<number, string>(
          mlScores.map(s => [s.supporterId, s.riskTier])
        );
        setSupporters(rawSupporters.map(s => ({
          id: String(s.supporterId ?? 0),
          displayName: s.displayName ?? s.organizationName ?? `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim(),
          supporterType: (s.supporterType as SupporterType) ?? 'MonetaryDonor',
          email: s.email ?? '',
          phone: s.phone ?? '',
          relationshipType: s.relationshipType ?? '',
          acquisitionChannel: s.acquisitionChannel ?? '',
          status: (s.status as SupporterStatus) ?? 'Active',
          notes: '',
          retentionRisk: mlMap.get(s.supporterId ?? 0) as 'High' | 'Medium' | 'Low' | undefined,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  function selectSupporter(s: Supporter) {
    setSelected(s);
    setMobileShowDetail(true);
    setDonations([]);
    setAllocations([]);
    getDonations({ supporterId: Number(s.id) }).then(rawDonations => {
      const mapped: Donation[] = rawDonations.map(d => ({
        id: String(d.donationId ?? 0),
        supporterId: s.id,
        donationType: (d.donationType as DonationType) ?? 'Monetary',
        amount: d.estimatedValue ?? (d.amount ? Number(d.amount) : null),
        description: d.notes ?? '',
        channel: d.channelSource ?? '',
        isRecurring: d.isRecurring === 'True' || d.isRecurring === 'Yes',
        campaignName: d.campaignName ?? '',
        date: d.donationDate ?? '',
      }));
      setDonations(mapped);
      // Fetch allocations for all donations in parallel
      if (mapped.length > 0) {
        Promise.all(mapped.map(d => getAllocations({ donationId: Number(d.id) })))
          .then(results => {
            const allAllocs = results.flat();
            setAllocations(allAllocs.map(a => ({
              id: String(a.allocationId ?? 0),
              donationId: String(a.donationId ?? 0),
              safehouse: (a.safehouseId != null ? shMap.get(a.safehouseId) : undefined) ?? 'Unknown',
              programArea: a.programArea ?? '',
              amount: a.amountAllocated ?? 0,
            })));
          });
      }
    });
  }

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

  useEffect(() => { setPage(1); }, [search, typeFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedDonations = selected ? donations : [];
  const selectedAllocations = selected ? allocations : [];

  // -------------------------------------------------------------------------
  // Supporter CRUD
  // -------------------------------------------------------------------------

  function openAdd() { setSupporterForm(emptySupporterForm); setSupporterModal('add'); }
  function openEdit(s: Supporter) { setSupporterForm({ displayName: s.displayName, supporterType: s.supporterType, email: s.email, phone: s.phone, relationshipType: s.relationshipType, acquisitionChannel: s.acquisitionChannel, status: s.status, notes: s.notes }); setSupporterModal('edit'); }
  function openDeleteSupporter(s: Supporter) { setSelected(s); setSupporterModal('delete'); }

  function saveSupporterForm(e: { preventDefault(): void }) {
    e.preventDefault();
    const payload = {
      displayName: supporterForm.displayName,
      supporterType: supporterForm.supporterType,
      email: supporterForm.email,
      phone: supporterForm.phone,
      relationshipType: supporterForm.relationshipType,
      acquisitionChannel: supporterForm.acquisitionChannel,
      status: supporterForm.status,
    };
    if (supporterModal === 'add') {
      createSupporter(payload).then(saved => {
        const ns: Supporter = { id: String(saved.supporterId ?? 0), ...supporterForm };
        setSupporters(p => [ns, ...p]);
        setSupporterModal(null);
      });
    } else if (supporterModal === 'edit' && selected) {
      updateSupporter(Number(selected.id), payload).then(() => {
        setSupporters(p => p.map(s => s.id === selected.id ? { ...s, ...supporterForm } : s));
        setSelected(prev => prev ? { ...prev, ...supporterForm } : null);
        setSupporterModal(null);
      });
    }
  }

  function confirmDeleteSupporter() {
    if (selected) {
      deleteSupporter(Number(selected.id)).then(() => {
        setSupporters(p => p.filter(s => s.id !== selected.id));
        setDonations([]);
        setAllocations([]);
        setSelected(null);
      });
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
    createDonationRecord({
      supporterId: Number(selected.id),
      donationType: donationForm.donationType,
      donationDate: donationForm.date,
      isRecurring: donationForm.isRecurring ? 'True' : 'False',
      campaignName: donationForm.campaignName,
      channelSource: donationForm.channel,
      currencyCode: 'PHP',
      amount: donationForm.amount || undefined,
      estimatedValue: donationForm.amount ? Number(donationForm.amount) : undefined,
      notes: donationForm.description,
    }).then(saved => {
      const nd: Donation = {
        id: String(saved.donationId ?? 0),
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
    });
  }

  function confirmDeleteDonation() {
    if (selectedDonation) {
      deleteDonation(Number(selectedDonation.id)).then(() => {
        setDonations(p => p.filter(d => d.id !== selectedDonation.id));
        setAllocations(p => p.filter(a => a.donationId !== selectedDonation.id));
      });
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

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
      Loading supporters…
    </div>
  );

  // ---------------------------------------------------------------------------
  // Allocations tab derived data
  // ---------------------------------------------------------------------------

  const availableYears = Array.from(
    new Set(allAllocations
      .map(a => a.allocationDate ? new Date(a.allocationDate).getFullYear() : null)
      .filter((y): y is number => y != null))
  ).sort((a, b) => b - a);

  const filteredAllocs = allocYear === 'All'
    ? allAllocations
    : allAllocations.filter(a => a.allocationDate && new Date(a.allocationDate).getFullYear() === allocYear);

  // By safehouse
  const safehouseTotals = new Map<number, number>();
  for (const a of filteredAllocs) {
    if (a.safehouseId != null && a.amountAllocated != null)
      safehouseTotals.set(a.safehouseId, (safehouseTotals.get(a.safehouseId) ?? 0) + a.amountAllocated);
  }
  const safeTotal = [...safehouseTotals.values()].reduce((s, v) => s + v, 0);
  const safehouseRows = [...safehouseTotals.entries()]
    .map(([id, amt]) => ({ label: shMap.get(id) ?? 'Unknown', amount: amt, pct: safeTotal > 0 ? Math.round(amt / safeTotal * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);

  // By program area
  const areaTotals = new Map<string, number>();
  for (const a of filteredAllocs) {
    if (a.programArea && a.amountAllocated != null)
      areaTotals.set(a.programArea, (areaTotals.get(a.programArea) ?? 0) + a.amountAllocated);
  }
  const areaTotal = [...areaTotals.values()].reduce((s, v) => s + v, 0);
  const areaRows = [...areaTotals.entries()]
    .map(([label, amt]) => ({ label, amount: amt, pct: areaTotal > 0 ? Math.round(amt / areaTotal * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      {/* In-page tab bar */}
      <div className="border-b border-stone-200 mb-6 flex gap-0">
        {([['supporters', 'Supporters'], ['allocations', 'Allocations']] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setPageTab(id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150
              ${pageTab === id
                ? 'border-haven-teal-600 text-haven-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ================================================================== */}
      {/* Supporters tab                                                       */}
      {/* ================================================================== */}
      {pageTab === 'supporters' && (
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
            ) : paginated.map(s => (
              <button key={s.id} type="button" onClick={() => { selectSupporter(s); setDetailTab('profile'); }}
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
                  {s.retentionRisk === 'High' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                      font-bold uppercase tracking-wide bg-rose-100 text-rose-700 border border-rose-200">
                      At Risk <span className="opacity-50">ML</span>
                    </span>
                  )}
                  {s.retentionRisk === 'Medium' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                      font-bold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-200">
                      Monitor <span className="opacity-50">ML</span>
                    </span>
                  )}
                  <ChevronRightIcon />
                </div>
              </button>
            ))}
          </div>
          <PaginationBar page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
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
      </div>
      )}{/* end supporters tab */}

      {/* ================================================================== */}
      {/* Allocations tab                                                      */}
      {/* ================================================================== */}
      {pageTab === 'allocations' && (
        <div>
          {/* Year filter */}
          <div className="flex items-center gap-3 mb-6">
            <label htmlFor="alloc-year" className="text-sm font-medium text-stone-700">Year</label>
            <select id="alloc-year" value={String(allocYear)}
              onChange={e => setAllocYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className={selectCls}>
              <option value="All">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {filteredAllocs.length > 0 && (
              <span className="text-xs text-stone-400">{filteredAllocs.length} allocation{filteredAllocs.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Two-column breakdown grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* By Program Area */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-1">By Program Area</h3>
              <p className="text-xs text-stone-400 mb-5">How donations are distributed across programs</p>
              {areaRows.length === 0 ? (
                <p className="text-sm text-stone-400 py-8 text-center">No program area data available.</p>
              ) : (
                <div className="space-y-5">
                  {areaRows.map(r => <AllocBar key={r.label} label={r.label} pct={r.pct} amount={r.amount} />)}
                  <p className="text-xs text-stone-400 pt-3 border-t border-stone-100">
                    Total: <span className="font-semibold text-stone-600">₱{areaTotal.toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* By Safehouse */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-1">By Safehouse</h3>
              <p className="text-xs text-stone-400 mb-5">How donations are distributed across safehouses</p>
              {safehouseRows.length === 0 ? (
                <p className="text-sm text-stone-400 py-8 text-center">No safehouse allocation data available.</p>
              ) : (
                <div className="space-y-5">
                  {safehouseRows.map(r => <AllocBar key={r.label} label={r.label} pct={r.pct} amount={r.amount} />)}
                  <p className="text-xs text-stone-400 pt-3 border-t border-stone-100">
                    Total: <span className="font-semibold text-stone-600">₱{safeTotal.toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}{/* closes pageTab === 'allocations' */}

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
