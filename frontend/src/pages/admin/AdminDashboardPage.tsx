import { useState, type ReactElement } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DashboardTab = 'overview' | 'donors' | 'social' | 'tracker';

type SupporterType =
  | 'MonetaryDonor'
  | 'InKindDonor'
  | 'Volunteer'
  | 'SkillsContributor'
  | 'SocialMediaAdvocate'
  | 'PartnerOrganization';

type SupporterStatus = 'Active' | 'Inactive';
type CaseStatus = 'Active' | 'Pending' | 'Closed' | 'Transferred';
type ResidentStage = 'Intake' | 'Counseling' | 'Education' | 'Health Program' | 'Reintegration';

interface Supporter {
  id: string;
  displayName: string;
  supporterType: SupporterType;
  email: string;
  relationshipType: string;
  acquisitionChannel: string;
  status: SupporterStatus;
  contributionDisplay: string;
  donationCount: number;
  lastActivityDate: string;
}

interface SupporterDraftForm {
  displayName: string;
  supporterType: SupporterType;
  email: string;
  relationshipType: string;
  acquisitionChannel: string;
  status: SupporterStatus;
}

interface SocialPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'Twitter / X';
  contentType: string;
  date: string;
  reach: number;
  likes: number;
  shares: number;
  donationsAttributed: number;
}

interface PlatformStat {
  platform: 'Facebook' | 'Instagram' | 'Twitter / X';
  followers: number;
  totalReach: number;
  engagementRate: number;
  donationsAttributed: number;
}

interface TrackerResident {
  caseId: string;
  safehouse: string;
  caseStatus: CaseStatus;
  riskLevel: 'Standard' | 'High Risk';
  assignedSocialWorker: string;
  admissionDate: string;
  daysInProgram: number;
  currentStage: ResidentStage;
}

interface ActivityItem {
  id: string;
  type: 'donation' | 'resident' | 'conference' | 'visit';
  description: string;
  time: string;
}

// ---------------------------------------------------------------------------
// Filler data — replace each block with the indicated API call
// ---------------------------------------------------------------------------

// TODO: Replace with GET /api/admin/dashboard-stats
const dashboardStats = {
  activeResidents: 42,
  activeResidentsLastMonth: 39,
  activeDonors: 89,
  activeDonorsLastMonth: 84,
  donationsThisMonth: 284500,
  donationsLastMonth: 253200,
  upcomingConferences: 7,
};

// TODO: Replace with GET /api/safehouses
const safehouses = [
  { name: 'Haven House Manila',    region: 'Luzon',    capacity: 15, current: 12 },
  { name: 'Light of Hope Cebu',    region: 'Visayas',  capacity: 12, current: 10 },
  { name: 'New Dawn Davao',        region: 'Mindanao', capacity: 10, current: 8  },
  { name: 'Safe Harbor Iloilo',    region: 'Visayas',  capacity: 12, current: 12 },
];

// TODO: Replace with GET /api/admin/recent-activity
const recentActivity: ActivityItem[] = [
  { id: '1', type: 'donation',    description: 'Global Care Corp. donated ₱250,000',                    time: '2 hours ago' },
  { id: '2', type: 'resident',    description: 'New resident admitted — Light of Hope Cebu',             time: '5 hours ago' },
  { id: '3', type: 'conference',  description: 'Case conference scheduled for RES-2024-007',             time: 'Yesterday' },
  { id: '4', type: 'visit',       description: 'Home visit completed — RES-2024-012',                    time: 'Yesterday' },
  { id: '5', type: 'donation',    description: 'Reyes Family Foundation recurring donation received',     time: '2 days ago' },
];

// TODO: Replace with GET /api/supporters
const fillerSupporters: Supporter[] = [
  {
    id: 'SUP-001', displayName: 'Reyes Family Foundation', supporterType: 'MonetaryDonor',
    email: 'giving@reyesfdn.ph', relationshipType: 'Foundation', acquisitionChannel: 'Direct Outreach',
    status: 'Active', contributionDisplay: '₱450,000', donationCount: 12, lastActivityDate: '2026-03-15',
  },
  {
    id: 'SUP-002', displayName: 'Luz Macaraeg', supporterType: 'Volunteer',
    email: 'luz.m@email.com', relationshipType: 'Individual', acquisitionChannel: 'Website',
    status: 'Active', contributionDisplay: '84 volunteer hrs', donationCount: 18, lastActivityDate: '2026-04-01',
  },
  {
    id: 'SUP-003', displayName: 'Cebu Business Network', supporterType: 'PartnerOrganization',
    email: 'partnerships@cbnet.ph', relationshipType: 'Corporate Partner', acquisitionChannel: 'Referral',
    status: 'Active', contributionDisplay: '₱120,000', donationCount: 4, lastActivityDate: '2026-02-28',
  },
  {
    id: 'SUP-004', displayName: 'Daniel Tan', supporterType: 'MonetaryDonor',
    email: 'daniel.t@gmail.com', relationshipType: 'Individual', acquisitionChannel: 'Social Media',
    status: 'Active', contributionDisplay: '₱36,000', donationCount: 6, lastActivityDate: '2026-03-30',
  },
  {
    id: 'SUP-005', displayName: 'Grace Soriano', supporterType: 'InKindDonor',
    email: 'grace.s@email.com', relationshipType: 'Individual', acquisitionChannel: 'Event',
    status: 'Active', contributionDisplay: '8 in-kind items', donationCount: 8, lastActivityDate: '2026-01-20',
  },
  {
    id: 'SUP-006', displayName: 'Global Care Corp.', supporterType: 'MonetaryDonor',
    email: 'csr@globalcare.com', relationshipType: 'Corporate Donor', acquisitionChannel: 'Direct Outreach',
    status: 'Active', contributionDisplay: '₱750,000', donationCount: 3, lastActivityDate: '2026-03-01',
  },
  {
    id: 'SUP-007', displayName: 'Marco Rivera', supporterType: 'SkillsContributor',
    email: 'marco.r@techconsult.ph', relationshipType: 'Individual', acquisitionChannel: 'Referral',
    status: 'Inactive', contributionDisplay: '2 projects', donationCount: 2, lastActivityDate: '2025-11-10',
  },
  {
    id: 'SUP-008', displayName: 'Hope Advocates PH', supporterType: 'SocialMediaAdvocate',
    email: 'info@hopeadvocates.ph', relationshipType: 'Advocacy Group', acquisitionChannel: 'Social Media',
    status: 'Active', contributionDisplay: '42 shares', donationCount: 42, lastActivityDate: '2026-04-05',
  },
];

// TODO: Replace with GET /api/social-media/platform-stats
const platformStats: PlatformStat[] = [
  { platform: 'Facebook',    followers: 4820, totalReach: 18400, engagementRate: 6.2, donationsAttributed: 45000 },
  { platform: 'Instagram',   followers: 2340, totalReach: 9800,  engagementRate: 8.7, donationsAttributed: 22000 },
  { platform: 'Twitter / X', followers: 890,  totalReach: 3200,  engagementRate: 3.1, donationsAttributed: 8500  },
];

// TODO: Replace with GET /api/social-media/posts?limit=8
const fillerSocialPosts: SocialPost[] = [
  { id: 'P1', platform: 'Facebook',    contentType: 'Impact Story',   date: '2026-04-01', reach: 4820, likes: 312, shares: 89,  donationsAttributed: 18500 },
  { id: 'P2', platform: 'Instagram',   contentType: 'Milestone Post', date: '2026-03-28', reach: 3140, likes: 487, shares: 62,  donationsAttributed: 9200  },
  { id: 'P3', platform: 'Facebook',    contentType: 'Program Update', date: '2026-03-22', reach: 2890, likes: 218, shares: 44,  donationsAttributed: 6800  },
  { id: 'P4', platform: 'Twitter / X', contentType: 'Awareness',      date: '2026-03-18', reach: 1620, likes: 104, shares: 211, donationsAttributed: 3200  },
  { id: 'P5', platform: 'Instagram',   contentType: 'Impact Story',   date: '2026-03-12', reach: 2710, likes: 395, shares: 78,  donationsAttributed: 8100  },
  { id: 'P6', platform: 'Facebook',    contentType: 'Fundraiser',     date: '2026-03-05', reach: 5340, likes: 441, shares: 132, donationsAttributed: 28000 },
];

// TODO: Replace with GET /api/residents?fields=caseId,safehouse,caseStatus,riskLevel,socialWorker,admissionDate,stage
const fillerResidents: TrackerResident[] = [
  { caseId: 'RES-2024-001', safehouse: 'Haven House Manila',  caseStatus: 'Active',      riskLevel: 'Standard',  assignedSocialWorker: 'Ana Reyes',    admissionDate: '2024-06-12', daysInProgram: 298, currentStage: 'Counseling' },
  { caseId: 'RES-2024-002', safehouse: 'Light of Hope Cebu',  caseStatus: 'Active',      riskLevel: 'High Risk', assignedSocialWorker: 'Ben Cruz',     admissionDate: '2024-08-03', daysInProgram: 246, currentStage: 'Intake' },
  { caseId: 'RES-2024-003', safehouse: 'New Dawn Davao',      caseStatus: 'Active',      riskLevel: 'Standard',  assignedSocialWorker: 'Celia Santos', admissionDate: '2024-04-20', daysInProgram: 351, currentStage: 'Education' },
  { caseId: 'RES-2024-004', safehouse: 'Safe Harbor Iloilo',  caseStatus: 'Active',      riskLevel: 'Standard',  assignedSocialWorker: 'Ana Reyes',    admissionDate: '2024-09-15', daysInProgram: 203, currentStage: 'Health Program' },
  { caseId: 'RES-2024-005', safehouse: 'Haven House Manila',  caseStatus: 'Active',      riskLevel: 'High Risk', assignedSocialWorker: 'Donna Lim',    admissionDate: '2024-11-01', daysInProgram: 156, currentStage: 'Counseling' },
  { caseId: 'RES-2023-018', safehouse: 'Light of Hope Cebu',  caseStatus: 'Active',      riskLevel: 'Standard',  assignedSocialWorker: 'Ben Cruz',     admissionDate: '2023-10-08', daysInProgram: 546, currentStage: 'Reintegration' },
  { caseId: 'RES-2025-001', safehouse: 'New Dawn Davao',      caseStatus: 'Pending',     riskLevel: 'Standard',  assignedSocialWorker: 'Celia Santos', admissionDate: '2025-01-30', daysInProgram: 66,  currentStage: 'Intake' },
  { caseId: 'RES-2024-009', safehouse: 'Haven House Manila',  caseStatus: 'Active',      riskLevel: 'Standard',  assignedSocialWorker: 'Donna Lim',    admissionDate: '2024-07-22', daysInProgram: 258, currentStage: 'Education' },
  { caseId: 'RES-2024-011', safehouse: 'Safe Harbor Iloilo',  caseStatus: 'Transferred', riskLevel: 'Standard',  assignedSocialWorker: 'Ana Reyes',    admissionDate: '2024-05-10', daysInProgram: 331, currentStage: 'Reintegration' },
  { caseId: 'RES-2023-025', safehouse: 'New Dawn Davao',      caseStatus: 'Closed',      riskLevel: 'Standard',  assignedSocialWorker: 'Ben Cruz',     admissionDate: '2023-03-01', daysInProgram: 720, currentStage: 'Reintegration' },
];

// ---------------------------------------------------------------------------
// Lookup maps
// ---------------------------------------------------------------------------

const SUPPORTER_TYPE_LABELS: Record<SupporterType, string> = {
  MonetaryDonor:        'Monetary Donor',
  InKindDonor:          'In-Kind Donor',
  Volunteer:            'Volunteer',
  SkillsContributor:    'Skills Contributor',
  SocialMediaAdvocate:  'Social Media Advocate',
  PartnerOrganization:  'Partner Organization',
};

const SUPPORTER_TYPE_COLORS: Record<SupporterType, string> = {
  MonetaryDonor:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  InKindDonor:          'bg-sky-100 text-sky-800 border-sky-200',
  Volunteer:            'bg-amber-100 text-amber-800 border-amber-200',
  SkillsContributor:    'bg-purple-100 text-purple-800 border-purple-200',
  SocialMediaAdvocate:  'bg-haven-teal-100 text-haven-teal-800 border-haven-teal-200',
  PartnerOrganization:  'bg-stone-100 text-stone-700 border-stone-200',
};

const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  Active:      'bg-emerald-100 text-emerald-800 border-emerald-200',
  Pending:     'bg-amber-100 text-amber-800 border-amber-200',
  Transferred: 'bg-sky-100 text-sky-800 border-sky-200',
  Closed:      'bg-stone-100 text-stone-600 border-stone-200',
};

const STAGE_COLORS: Record<ResidentStage, string> = {
  Intake:          'bg-amber-50 text-amber-700',
  Counseling:      'bg-sky-50 text-sky-700',
  Education:       'bg-purple-50 text-purple-700',
  'Health Program':'bg-emerald-50 text-emerald-700',
  Reintegration:   'bg-haven-teal-50 text-haven-teal-700',
};

const ACTIVITY_DOT: Record<ActivityItem['type'], string> = {
  donation:   'bg-emerald-500',
  resident:   'bg-haven-teal-500',
  conference: 'bg-amber-500',
  visit:      'bg-sky-500',
};

const ACQUISITION_CHANNELS = ['Website', 'Referral', 'Event', 'Social Media', 'Direct Outreach'];

const SAFEHOUSE_NAMES = ['All', ...safehouses.map(s => s.name)];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function formatPHP(n: number) {
  return `₱${n.toLocaleString()}`;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ---------------------------------------------------------------------------
// Badge components
// ---------------------------------------------------------------------------

function TypeBadge({ type }: { type: SupporterType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${SUPPORTER_TYPE_COLORS[type]}`}>
      {SUPPORTER_TYPE_LABELS[type]}
    </span>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${CASE_STATUS_COLORS[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SupporterStatusBadge({ status }: { status: SupporterStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border
      ${status === 'Active'
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
        : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: ReactElement;
}

function KpiCard({ label, value, change, positive, icon }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-lg bg-haven-teal-50 flex items-center justify-center
          text-haven-teal-600">
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tabular-nums text-stone-900 mb-1">{value}</p>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG icons for KPI cards + modals
// ---------------------------------------------------------------------------

function PersonIcon()   { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function HeartIcon()    { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function PhilIcon()     { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function CalendarIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UsersIcon2()   { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function GlobeIcon()    { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function XIcon()        { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function PlusIcon()     { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function SearchIcon()   { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }

// ---------------------------------------------------------------------------
// Empty donor form
// ---------------------------------------------------------------------------

const emptyDonorForm: SupporterDraftForm = {
  displayName: '',
  supporterType: 'MonetaryDonor',
  email: '',
  relationshipType: '',
  acquisitionChannel: 'Website',
  status: 'Active',
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'donors',   label: 'Donors & Contributions' },
  { id: 'social',   label: 'Social Media' },
  { id: 'tracker',  label: 'Participant Tracker' },
];

export default function AdminDashboardPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Donors tab state
  const [donorList, setDonorList]               = useState<Supporter[]>(fillerSupporters);
  const [donorSearch, setDonorSearch]           = useState('');
  const [donorTypeFilter, setDonorTypeFilter]   = useState<SupporterType | 'All'>('All');
  const [donorStatusFilter, setDonorStatusFilter] = useState<SupporterStatus | 'All'>('All');
  const [donorModal, setDonorModal]             = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedDonor, setSelectedDonor]       = useState<Supporter | null>(null);
  const [donorForm, setDonorForm]               = useState<SupporterDraftForm>(emptyDonorForm);

  // Tracker tab state
  const [trackerSearch, setTrackerSearch]           = useState('');
  const [trackerStatus, setTrackerStatus]           = useState<CaseStatus | 'All'>('All');
  const [trackerSafehouse, setTrackerSafehouse]     = useState('All');

  // -------------------------------------------------------------------------
  // Donor CRUD helpers
  // -------------------------------------------------------------------------

  function openAdd() {
    setDonorForm(emptyDonorForm);
    setSelectedDonor(null);
    setDonorModal('add');
  }

  function openEdit(donor: Supporter) {
    setDonorForm({
      displayName: donor.displayName,
      supporterType: donor.supporterType,
      email: donor.email,
      relationshipType: donor.relationshipType,
      acquisitionChannel: donor.acquisitionChannel,
      status: donor.status,
    });
    setSelectedDonor(donor);
    setDonorModal('edit');
  }

  function openDelete(donor: Supporter) {
    setSelectedDonor(donor);
    setDonorModal('delete');
  }

  function closeModal() {
    setDonorModal(null);
    setSelectedDonor(null);
  }

  function handleSaveDonor(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!donorForm.displayName.trim()) return;

    if (donorModal === 'add') {
      const newSupporter: Supporter = {
        id: `SUP-${Date.now().toString().slice(-6)}`,
        ...donorForm,
        contributionDisplay: '—',
        donationCount: 0,
        lastActivityDate: new Date().toISOString().substring(0, 10),
      };
      setDonorList(prev => [newSupporter, ...prev]);
      // TODO: POST /api/supporters { body: donorForm }
    } else if (donorModal === 'edit' && selectedDonor) {
      setDonorList(prev =>
        prev.map(d => d.id === selectedDonor.id ? { ...d, ...donorForm } : d)
      );
      // TODO: PUT /api/supporters/${selectedDonor.id} { body: donorForm }
    }
    closeModal();
  }

  function confirmDelete() {
    if (selectedDonor) {
      setDonorList(prev => prev.filter(d => d.id !== selectedDonor.id));
      // TODO: DELETE /api/supporters/${selectedDonor.id}
    }
    closeModal();
  }

  // -------------------------------------------------------------------------
  // Derived / filtered lists
  // -------------------------------------------------------------------------

  const filteredDonors = donorList.filter(d => {
    const q = donorSearch.toLowerCase();
    const matchSearch = q === '' || d.displayName.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
    const matchType   = donorTypeFilter === 'All' || d.supporterType === donorTypeFilter;
    const matchStatus = donorStatusFilter === 'All' || d.status === donorStatusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const filteredResidents = fillerResidents.filter(r => {
    const q = trackerSearch.toLowerCase();
    const matchSearch   = q === '' || r.caseId.toLowerCase().includes(q) || r.assignedSocialWorker.toLowerCase().includes(q);
    const matchStatus   = trackerStatus === 'All' || r.caseStatus === trackerStatus;
    const matchSafehouse = trackerSafehouse === 'All' || r.safehouse === trackerSafehouse;
    return matchSearch && matchStatus && matchSafehouse;
  });

  const resDelta  = dashboardStats.activeResidents - dashboardStats.activeResidentsLastMonth;
  const donDelta  = pctChange(dashboardStats.donationsThisMonth, dashboardStats.donationsLastMonth);

  // -------------------------------------------------------------------------
  // Shared input / select class
  // -------------------------------------------------------------------------

  const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
    text-stone-900 placeholder:text-stone-400 hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  const selectCls = `px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-700
    hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-haven-teal-500
    focus:border-transparent`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-stone-200 mb-8 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap
              transition-colors duration-150 focus-visible:outline-none
              ${activeTab === tab.id
                ? 'border-haven-teal-600 text-haven-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================================================================== */}
      {/* TAB: OVERVIEW                                                       */}
      {/* ================================================================== */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              label="Active Residents"
              value={String(dashboardStats.activeResidents)}
              change={`${Math.abs(resDelta)} this month`}
              positive={resDelta >= 0}
              icon={<PersonIcon />}
            />
            <KpiCard
              label="Active Donors"
              value={String(dashboardStats.activeDonors)}
              change={`${Math.abs(dashboardStats.activeDonors - dashboardStats.activeDonorsLastMonth)} vs last month`}
              positive={dashboardStats.activeDonors >= dashboardStats.activeDonorsLastMonth}
              icon={<HeartIcon />}
            />
            <KpiCard
              label="Donations This Month"
              value={formatPHP(dashboardStats.donationsThisMonth)}
              change={`${Math.abs(donDelta)}%`}
              positive={donDelta >= 0}
              icon={<PhilIcon />}
            />
            <KpiCard
              label="Upcoming Conferences"
              value={String(dashboardStats.upcomingConferences)}
              icon={<CalendarIcon />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Safehouse occupancy */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-stone-900 mb-5">Safehouse Occupancy</h2>
              <div className="space-y-5">
                {safehouses.map(sh => {
                  const pct = Math.round((sh.current / sh.capacity) * 100);
                  const atCapacity = sh.current >= sh.capacity;
                  return (
                    <div key={sh.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-medium text-stone-900">{sh.name}</span>
                          <span className="ml-2 text-xs text-stone-400">{sh.region}</span>
                        </div>
                        <span className={`text-xs font-semibold ${atCapacity ? 'text-rose-600' : 'text-stone-500'}`}>
                          {sh.current} / {sh.capacity}
                        </span>
                      </div>
                      <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none"
                        aria-label={`${pct}% capacity`}>
                        <rect x="0" y="0" width="100" height="8" rx="4" className="fill-stone-100" />
                        <rect x="0" y="0" width={pct} height="8" rx="4"
                          className={atCapacity ? 'fill-rose-500' : 'fill-haven-teal-500'} />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-stone-900 mb-5">Recent Activity</h2>
              <ul className="space-y-4">
                {recentActivity.map(item => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${ACTIVITY_DOT[item.type]}`}
                      aria-hidden="true" />
                    <div>
                      <p className="text-sm text-stone-700 leading-snug">{item.description}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB: DONORS & CONTRIBUTIONS                                         */}
      {/* ================================================================== */}
      {activeTab === 'donors' && (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Supporters</h2>
              <p className="text-sm text-stone-500">{donorList.length} total records</p>
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5
                bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                transition-colors duration-150 hover:bg-haven-teal-700
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
            >
              <PlusIcon />
              Add Supporter
            </button>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder="Search by name or email…"
                value={donorSearch}
                onChange={e => setDonorSearch(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
            <select
              value={donorTypeFilter}
              onChange={e => setDonorTypeFilter(e.target.value as SupporterType | 'All')}
              className={selectCls}
              aria-label="Filter by type"
            >
              <option value="All">All Types</option>
              {(Object.keys(SUPPORTER_TYPE_LABELS) as SupporterType[]).map(t => (
                <option key={t} value={t}>{SUPPORTER_TYPE_LABELS[t]}</option>
              ))}
            </select>
            <select
              value={donorStatusFilter}
              onChange={e => setDonorStatusFilter(e.target.value as SupporterStatus | 'All')}
              className={selectCls}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    {['Name', 'Type', 'Status', 'Contributions', 'Last Activity', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider
                        text-stone-500 px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredDonors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-stone-400">
                        No supporters match the current filters.
                      </td>
                    </tr>
                  ) : filteredDonors.map(donor => (
                    <tr key={donor.id} className="hover:bg-stone-50 transition-colors duration-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{donor.displayName}</p>
                        <p className="text-xs text-stone-400">{donor.email}</p>
                      </td>
                      <td className="px-4 py-3"><TypeBadge type={donor.supporterType} /></td>
                      <td className="px-4 py-3"><SupporterStatusBadge status={donor.status} /></td>
                      <td className="px-4 py-3 text-stone-700 tabular-nums">{donor.contributionDisplay}</td>
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{donor.lastActivityDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(donor)}
                            className="text-sm font-medium text-haven-teal-600 hover:text-haven-teal-700
                              transition-colors focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-haven-teal-500 focus-visible:ring-offset-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(donor)}
                            className="text-sm font-medium text-rose-600 hover:text-rose-700
                              transition-colors focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-rose-500 focus-visible:ring-offset-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Showing {filteredDonors.length} of {donorList.length} records
          </p>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB: SOCIAL MEDIA                                                   */}
      {/* ================================================================== */}
      {activeTab === 'social' && (
        <div>
          {/* Platform summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {platformStats.map(p => (
              <div key={p.platform}
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-lg bg-haven-teal-50 flex items-center justify-center
                    text-haven-teal-600">
                    <GlobeIcon />
                  </div>
                  <span className="text-xs font-semibold text-stone-400">{p.platform}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-stone-900 mb-1">
                  {p.followers.toLocaleString()}
                </p>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-4">Followers</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Monthly Reach</span>
                    <span className="font-medium text-stone-700">{p.totalReach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Engagement Rate</span>
                    <span className="font-medium text-stone-700">{p.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Donations Attributed</span>
                    <span className="font-medium text-emerald-600">{formatPHP(p.donationsAttributed)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform totals summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Followers',  value: platformStats.reduce((s, p) => s + p.followers, 0).toLocaleString() },
              { label: 'Total Reach',      value: platformStats.reduce((s, p) => s + p.totalReach, 0).toLocaleString() },
              { label: 'Avg Engagement',   value: `${(platformStats.reduce((s, p) => s + p.engagementRate, 0) / platformStats.length).toFixed(1)}%` },
              { label: 'Total Donations',  value: formatPHP(platformStats.reduce((s, p) => s + p.donationsAttributed, 0)) },
            ].map(item => (
              <div key={item.label} className="bg-haven-teal-900 rounded-xl p-5 text-white">
                <p className="text-2xl font-bold tabular-nums mb-1">{item.value}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Posts table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-base font-semibold text-stone-900">Recent Posts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    {['Date', 'Platform', 'Content Type', 'Reach', 'Likes', 'Shares', 'Donations'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider
                        text-stone-500 px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {fillerSocialPosts.map(post => (
                    <tr key={post.id} className="hover:bg-stone-50 transition-colors duration-100">
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{post.date}</td>
                      <td className="px-4 py-3 font-medium text-stone-900">{post.platform}</td>
                      <td className="px-4 py-3 text-stone-700">{post.contentType}</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{post.reach.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{post.likes.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{post.shares.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums font-medium text-emerald-600">
                        {formatPHP(post.donationsAttributed)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB: PARTICIPANT TRACKER                                            */}
      {/* ================================================================== */}
      {activeTab === 'tracker' && (
        <div>
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder="Search by case ID or social worker…"
                value={trackerSearch}
                onChange={e => setTrackerSearch(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
            <select
              value={trackerSafehouse}
              onChange={e => setTrackerSafehouse(e.target.value)}
              className={selectCls}
              aria-label="Filter by safehouse"
            >
              {SAFEHOUSE_NAMES.map(n => <option key={n} value={n}>{n === 'All' ? 'All Safehouses' : n}</option>)}
            </select>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['All', 'Active', 'Pending', 'Transferred', 'Closed'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setTrackerStatus(s === 'All' ? 'All' : s as CaseStatus)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2
                  ${trackerStatus === s
                    ? 'bg-haven-teal-600 text-white'
                    : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-stone-400 mb-4">
            Showing {filteredResidents.length} of {fillerResidents.length} residents
          </p>

          {/* Resident cards */}
          {filteredResidents.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
              <UsersIcon2 />
              <p className="text-stone-400 text-sm mt-2">No residents match the current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredResidents.map(r => (
                <div key={r.caseId}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm p-5
                    hover:shadow-md hover:border-stone-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-900 font-mono">{r.caseId}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{r.safehouse}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={r.caseStatus} />
                      {r.riskLevel === 'High Risk' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                          text-[11px] font-semibold uppercase tracking-wide border transition-none
                          bg-rose-100 text-rose-800 border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          High Risk
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Social Worker</span>
                      <span className="font-medium">{r.assignedSocialWorker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Days in Program</span>
                      <span className="font-medium tabular-nums">{r.daysInProgram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Current Stage</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold
                        ${STAGE_COLORS[r.currentStage]}`}>
                        {r.currentStage}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/admin/caseload?case=${r.caseId}`}
                    className="block w-full text-center text-sm font-medium text-haven-teal-600
                      hover:text-haven-teal-700 transition-colors duration-150 py-1.5 border-t
                      border-stone-100 focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 rounded"
                  >
                    View Full Record →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: Add / Edit Supporter                                         */}
      {/* ================================================================== */}
      {(donorModal === 'add' || donorModal === 'edit') && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50
            flex items-end sm:items-center p-0 sm:p-4"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSaveDonor}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
                <h2 id="modal-title" className="text-lg font-semibold text-stone-900">
                  {donorModal === 'add' ? 'Add Supporter' : 'Edit Supporter'}
                </h2>
                <button type="button" onClick={closeModal} aria-label="Close"
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500">
                  <XIcon />
                </button>
              </div>

              {/* Fields */}
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Display Name */}
                <div>
                  <label htmlFor="m-name"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input id="m-name" type="text" required value={donorForm.displayName}
                    onChange={e => setDonorForm(f => ({ ...f, displayName: e.target.value }))}
                    className={inputCls} placeholder="Organisation or full name" />
                </div>

                {/* Supporter Type */}
                <div>
                  <label htmlFor="m-type"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Supporter Type
                  </label>
                  <select id="m-type" value={donorForm.supporterType}
                    onChange={e => setDonorForm(f => ({ ...f, supporterType: e.target.value as SupporterType }))}
                    className={`${inputCls}`}>
                    {(Object.keys(SUPPORTER_TYPE_LABELS) as SupporterType[]).map(t => (
                      <option key={t} value={t}>{SUPPORTER_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="m-email"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input id="m-email" type="email" value={donorForm.email}
                    onChange={e => setDonorForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls} placeholder="contact@example.com" />
                </div>

                {/* Relationship Type */}
                <div>
                  <label htmlFor="m-rel"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Relationship Type
                  </label>
                  <input id="m-rel" type="text" value={donorForm.relationshipType}
                    onChange={e => setDonorForm(f => ({ ...f, relationshipType: e.target.value }))}
                    className={inputCls} placeholder="e.g. Individual, Foundation, Corporate" />
                </div>

                {/* Acquisition Channel */}
                <div>
                  <label htmlFor="m-channel"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Acquisition Channel
                  </label>
                  <select id="m-channel" value={donorForm.acquisitionChannel}
                    onChange={e => setDonorForm(f => ({ ...f, acquisitionChannel: e.target.value }))}
                    className={inputCls}>
                    {ACQUISITION_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="m-status"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select id="m-status" value={donorForm.status}
                    onChange={e => setDonorForm(f => ({ ...f, status: e.target.value as SupporterStatus }))}
                    className={inputCls}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white
                    text-stone-700 text-sm font-medium rounded-lg border border-stone-300
                    transition-colors duration-150 hover:bg-stone-50
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                  Cancel
                </button>
                <button type="submit"
                  className="inline-flex items-center justify-center px-5 py-2.5
                    bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                    transition-colors duration-150 hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                  {donorModal === 'add' ? 'Add Supporter' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: Delete confirmation                                          */}
      {/* ================================================================== */}
      {donorModal === 'delete' && selectedDonor && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50
            flex items-end sm:items-center p-0 sm:p-4"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-title"
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4">
              <h2 id="delete-title" className="text-lg font-semibold text-stone-900 mb-2">
                Remove Supporter
              </h2>
              <p className="text-sm text-stone-600">
                Are you sure you want to remove{' '}
                <strong className="text-stone-900">{selectedDonor.displayName}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={closeModal}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white
                  text-stone-700 text-sm font-medium rounded-lg border border-stone-300
                  transition-colors duration-150 hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete}
                className="inline-flex items-center justify-center px-5 py-2.5
                  bg-rose-600 text-white text-sm font-semibold rounded-lg
                  transition-colors duration-150 hover:bg-rose-700
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-rose-500 focus-visible:ring-offset-2">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
