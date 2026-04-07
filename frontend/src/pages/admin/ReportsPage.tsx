import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportTab = 'donations' | 'outcomes' | 'safehouses' | 'annual';

interface MonthlyDonation {
  month: string;
  monetary: number;
  inKind: number;
  time: number;
  skills: number;
}

interface SafehouseOutcome {
  name: string;
  region: string;
  activeResidents: number;
  reintegrated: number;
  avgEducationProgress: number;
  avgHealthScore: number;
  avgCounselingSessions: number;
  reintegrationRate: number;
}

interface ProgramOutcome {
  category: string;
  count: number;
  change: number; // pct vs prior year
  positive: boolean;
}

interface AnnualServiceRow {
  service: string;
  serviceType: 'Caring' | 'Healing' | 'Teaching';
  q1: number; q2: number; q3: number; q4: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Filler data
// ---------------------------------------------------------------------------

// TODO: Replace with GET /api/reports/monthly-donations?year=2025
const monthlyDonations: MonthlyDonation[] = [
  { month: 'Jul',  monetary: 185000, inKind: 12000, time: 8000,  skills: 5000  },
  { month: 'Aug',  monetary: 210000, inKind: 9000,  time: 6000,  skills: 12000 },
  { month: 'Sep',  monetary: 195000, inKind: 15000, time: 11000, skills: 7000  },
  { month: 'Oct',  monetary: 240000, inKind: 8000,  time: 9000,  skills: 4000  },
  { month: 'Nov',  monetary: 310000, inKind: 22000, time: 14000, skills: 8000  },
  { month: 'Dec',  monetary: 420000, inKind: 35000, time: 18000, skills: 10000 },
  { month: 'Jan',  monetary: 195000, inKind: 11000, time: 7000,  skills: 6000  },
  { month: 'Feb',  monetary: 220000, inKind: 14000, time: 9000,  skills: 9000  },
  { month: 'Mar',  monetary: 265000, inKind: 17000, time: 12000, skills: 11000 },
  { month: 'Apr',  monetary: 284500, inKind: 19000, time: 8000,  skills: 7500  },
];

// TODO: Replace with GET /api/reports/safehouse-outcomes
const safehouseOutcomes: SafehouseOutcome[] = [
  { name: 'Haven House Manila',  region: 'Luzon',    activeResidents: 12, reintegrated: 28, avgEducationProgress: 74, avgHealthScore: 82, avgCounselingSessions: 18, reintegrationRate: 87 },
  { name: 'Light of Hope Cebu',  region: 'Visayas',  activeResidents: 10, reintegrated: 19, avgEducationProgress: 68, avgHealthScore: 78, avgCounselingSessions: 15, reintegrationRate: 79 },
  { name: 'New Dawn Davao',      region: 'Mindanao', activeResidents: 8,  reintegrated: 14, avgEducationProgress: 71, avgHealthScore: 80, avgCounselingSessions: 16, reintegrationRate: 82 },
  { name: 'Safe Harbor Iloilo',  region: 'Visayas',  activeResidents: 12, reintegrated: 22, avgEducationProgress: 77, avgHealthScore: 85, avgCounselingSessions: 20, reintegrationRate: 91 },
];

// TODO: Replace with GET /api/reports/program-outcomes
const programOutcomes: ProgramOutcome[] = [
  { category: 'Residents Served',         count: 89,  change: 12, positive: true  },
  { category: 'Successful Reintegrations',count: 83,  change: 18, positive: true  },
  { category: 'Education Completions',    count: 61,  change: 8,  positive: true  },
  { category: 'Health Goal Achieved',     count: 74,  change: 15, positive: true  },
  { category: 'Counseling Hours Logged',  count: 1840,change: 22, positive: true  },
  { category: 'Concerns Flagged',         count: 14,  change: 7,  positive: false },
];

// TODO: Replace with GET /api/reports/annual-accomplishment?year=2025
const annualServiceRows: AnnualServiceRow[] = [
  { service: 'Residential Care',          serviceType: 'Caring',  q1: 38, q2: 40, q3: 42, q4: 45, total: 165 },
  { service: 'Medical/Dental Check-ups',  serviceType: 'Caring',  q1: 38, q2: 40, q3: 42, q4: 45, total: 165 },
  { service: 'Nutritional Support',       serviceType: 'Caring',  q1: 38, q2: 40, q3: 42, q4: 45, total: 165 },
  { service: 'Individual Counseling',     serviceType: 'Healing', q1: 128,q2: 140,q3: 155,q4: 148,total: 571 },
  { service: 'Group Therapy Sessions',    serviceType: 'Healing', q1: 24, q2: 28, q3: 32, q4: 30, total: 114 },
  { service: 'Family Counseling',         serviceType: 'Healing', q1: 18, q2: 22, q3: 25, q4: 20, total: 85  },
  { service: 'Trauma-Informed Sessions',  serviceType: 'Healing', q1: 42, q2: 48, q3: 52, q4: 50, total: 192 },
  { service: 'Formal Education Enrolled', serviceType: 'Teaching',q1: 28, q2: 30, q3: 34, q4: 36, total: 128 },
  { service: 'Vocational Training',       serviceType: 'Teaching',q1: 12, q2: 14, q3: 15, q4: 18, total: 59  },
  { service: 'Life Skills Workshops',     serviceType: 'Teaching',q1: 38, q2: 40, q3: 42, q4: 45, total: 165 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPHP(n: number) {
  if (n >= 1000000) return `₱${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `₱${(n / 1000).toFixed(0)}K`;
  return `₱${n.toLocaleString()}`;
}

const BAR_MAX = Math.max(...monthlyDonations.map(m => m.monetary));
const BAR_H = 80;

const SERVICE_TYPE_COLORS: Record<AnnualServiceRow['serviceType'], string> = {
  Caring:   'bg-haven-teal-100 text-haven-teal-800 border-haven-teal-200',
  Healing:  'bg-purple-100 text-purple-800 border-purple-200',
  Teaching: 'bg-sky-100 text-sky-800 border-sky-200',
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function ChevronUpIcon()   { return <svg className="h-3 w-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>; }
function ChevronDownIcon() { return <svg className="h-3 w-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>; }

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const TABS: { id: ReportTab; label: string }[] = [
  { id: 'donations',  label: 'Donation Trends' },
  { id: 'outcomes',   label: 'Resident Outcomes' },
  { id: 'safehouses', label: 'Safehouse Performance' },
  { id: 'annual',     label: 'Annual Accomplishment' },
];

const totalMonetary = monthlyDonations.reduce((s, m) => s + m.monetary, 0);
const totalAllTypes = monthlyDonations.reduce((s, m) => s + m.monetary + m.inKind + m.time + m.skills, 0);
const avgMonthly    = Math.round(totalMonetary / monthlyDonations.length);

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('donations');

  const inputCls = `px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-700
    hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-stone-200 mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
              duration-150 focus-visible:outline-none
              ${tab === t.id
                ? 'border-haven-teal-600 text-haven-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ================================================================== */}
      {/* DONATION TRENDS                                                     */}
      {/* ================================================================== */}
      {tab === 'donations' && (
        <div>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Monetary (10 mo)',  value: formatPHP(totalMonetary) },
              { label: 'All Contribution Types',  value: formatPHP(totalAllTypes) },
              { label: 'Avg Monthly Monetary',    value: formatPHP(avgMonthly) },
              { label: 'Best Month',              value: formatPHP(Math.max(...monthlyDonations.map(m => m.monetary))) },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <p className="text-2xl font-bold tabular-nums text-stone-900 mb-1">{item.value}</p>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Monetary bar chart */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-stone-900">Monthly Monetary Donations</h3>
              <select className={inputCls} aria-label="Select year">
                <option>2025 – 2026</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              {monthlyDonations.map(m => {
                const pct = Math.round((m.monetary / BAR_MAX) * 100);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <svg className="w-full h-20" viewBox={`0 0 1 ${BAR_H}`} preserveAspectRatio="none"
                      aria-label={`${m.month}: ${formatPHP(m.monetary)}`}>
                      <rect x="0" y="0" width="1" height={BAR_H} className="fill-stone-100" />
                      <rect x="0" y={BAR_H - (pct / 100) * BAR_H} width="1" height={(pct / 100) * BAR_H}
                        className="fill-haven-teal-500" />
                    </svg>
                    <span className="text-[10px] text-stone-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contribution mix */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-base font-semibold text-stone-900">Contribution Type Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    {['Month', 'Monetary', 'In-Kind', 'Time', 'Skills', 'Total'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {monthlyDonations.map(m => {
                    const rowTotal = m.monetary + m.inKind + m.time + m.skills;
                    return (
                      <tr key={m.month} className="hover:bg-stone-50 transition-colors duration-100">
                        <td className="px-4 py-3 font-medium text-stone-900">{m.month}</td>
                        <td className="px-4 py-3 tabular-nums text-stone-700">{formatPHP(m.monetary)}</td>
                        <td className="px-4 py-3 tabular-nums text-stone-500">{formatPHP(m.inKind)}</td>
                        <td className="px-4 py-3 tabular-nums text-stone-500">{formatPHP(m.time)}</td>
                        <td className="px-4 py-3 tabular-nums text-stone-500">{formatPHP(m.skills)}</td>
                        <td className="px-4 py-3 tabular-nums font-semibold text-stone-900">{formatPHP(rowTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* RESIDENT OUTCOMES                                                   */}
      {/* ================================================================== */}
      {tab === 'outcomes' && (
        <div>
          {/* Outcome KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {programOutcomes.map(o => (
              <div key={o.category} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold tabular-nums text-stone-900 mb-1">
                  {o.count.toLocaleString()}
                </p>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">{o.category}</p>
                <span className={`text-xs font-semibold ${o.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {o.positive ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  {' '}{Math.abs(o.change)}% vs prior year
                </span>
              </div>
            ))}
          </div>

          {/* Education & health progress per safehouse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-5">Education Progress by Safehouse</h3>
              <div className="space-y-5">
                {safehouseOutcomes.map(s => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-stone-700">{s.name}</span>
                      <span className="text-xs font-semibold text-stone-500">{s.avgEducationProgress}%</span>
                    </div>
                    <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none"
                      aria-label={`${s.avgEducationProgress}%`}>
                      <rect x="0" y="0" width="100" height="8" rx="4" className="fill-stone-100" />
                      <rect x="0" y="0" width={s.avgEducationProgress} height="8" rx="4" className="fill-sky-500" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Health */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-5">Health Score by Safehouse</h3>
              <div className="space-y-5">
                {safehouseOutcomes.map(s => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-stone-700">{s.name}</span>
                      <span className="text-xs font-semibold text-stone-500">{s.avgHealthScore}%</span>
                    </div>
                    <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none"
                      aria-label={`${s.avgHealthScore}%`}>
                      <rect x="0" y="0" width="100" height="8" rx="4" className="fill-stone-100" />
                      <rect x="0" y="0" width={s.avgHealthScore} height="8" rx="4" className="fill-emerald-500" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SAFEHOUSE PERFORMANCE                                               */}
      {/* ================================================================== */}
      {tab === 'safehouses' && (
        <div>
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {safehouseOutcomes.map(s => (
              <div key={s.name} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6
                hover:shadow-md transition-shadow duration-200">
                <div className="mb-4">
                  <p className="text-sm font-bold text-stone-900">{s.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.region}</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Active Residents',    value: String(s.activeResidents) },
                    { label: 'Total Reintegrated',  value: String(s.reintegrated) },
                    { label: 'Reintegration Rate',  value: `${s.reintegrationRate}%` },
                    { label: 'Avg Counseling Sessions', value: String(s.avgCounselingSessions) },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-xs text-stone-400">{row.label}</span>
                      <span className="text-sm font-semibold text-stone-900 tabular-nums">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Reintegration rate visual */}
                <div className="mt-4">
                  <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none"
                    aria-label={`Reintegration rate ${s.reintegrationRate}%`}>
                    <rect x="0" y="0" width="100" height="8" rx="4" className="fill-stone-100" />
                    <rect x="0" y="0" width={s.reintegrationRate} height="8" rx="4" className="fill-haven-teal-500" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-base font-semibold text-stone-900">Full Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    {['Safehouse', 'Region', 'Active', 'Reintegrated', 'Reintegration Rate', 'Avg Education', 'Avg Health', 'Avg Sessions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {safehouseOutcomes.map(s => (
                    <tr key={s.name} className="hover:bg-stone-50 transition-colors duration-100">
                      <td className="px-4 py-3 font-medium text-stone-900">{s.name}</td>
                      <td className="px-4 py-3 text-stone-500">{s.region}</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{s.activeResidents}</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{s.reintegrated}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-haven-teal-700">{s.reintegrationRate}%</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{s.avgEducationProgress}%</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{s.avgHealthScore}%</td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">{s.avgCounselingSessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ANNUAL ACCOMPLISHMENT REPORT                                        */}
      {/* ================================================================== */}
      {tab === 'annual' && (
        <div>
          {/* Report header */}
          <div className="bg-haven-teal-900 text-white rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-haven-teal-300 mb-1">
                  DSWD-Aligned Report
                </p>
                <h3 className="text-xl font-bold">Annual Accomplishment Report</h3>
                <p className="text-sm text-white/60 mt-0.5">Fiscal Year 2025 — All Safehouses</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Total Served', value: '89' },
                  { label: 'Services Rendered', value: annualServiceRows.reduce((s, r) => s + r.total, 0).toLocaleString() },
                  { label: 'Reintegrated', value: '83' },
                ].map(item => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-3">
                    <p className="text-xl font-bold tabular-nums">{item.value}</p>
                    <p className="text-xs text-white/60 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-base font-semibold text-stone-900">Services Provided</h3>
              <p className="text-xs text-stone-400 mt-0.5">Quarterly breakdown — number of beneficiaries per service</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    {['Service', 'Type', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(['Caring', 'Healing', 'Teaching'] as AnnualServiceRow['serviceType'][]).map(type => {
                    const rows = annualServiceRows.filter(r => r.serviceType === type);
                    const typeTotal = rows.reduce((s, r) => s + r.total, 0);
                    return (
                      <>
                        {rows.map((r, i) => (
                          <tr key={r.service} className="hover:bg-stone-50 transition-colors duration-100">
                            <td className="px-4 py-3 text-stone-700">{r.service}</td>
                            <td className="px-4 py-3">
                              {i === 0 && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
                                  font-semibold uppercase tracking-wide border ${SERVICE_TYPE_COLORS[type]}`}>
                                  {type}
                                </span>
                              )}
                            </td>
                            {[r.q1, r.q2, r.q3, r.q4].map((v, qi) => (
                              <td key={qi} className="px-4 py-3 tabular-nums text-stone-700">{v}</td>
                            ))}
                            <td className="px-4 py-3 tabular-nums font-semibold text-stone-900">{r.total}</td>
                          </tr>
                        ))}
                        <tr className="bg-stone-50 border-t border-stone-200">
                          <td className="px-4 py-2 text-xs font-semibold text-stone-500 uppercase" colSpan={2}>{type} Subtotal</td>
                          {(['q1','q2','q3','q4'] as const).map(q => (
                            <td key={q} className="px-4 py-2 tabular-nums text-xs font-semibold text-stone-700">
                              {rows.reduce((s, r) => s + r[q], 0)}
                            </td>
                          ))}
                          <td className="px-4 py-2 tabular-nums text-xs font-bold text-haven-teal-700">{typeTotal}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Beneficiary summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: 'Caring',  desc: 'Residential care, medical, nutritional services',  color: 'border-l-4 border-haven-teal-500' },
              { type: 'Healing', desc: 'Counseling, therapy, and trauma recovery services', color: 'border-l-4 border-purple-500' },
              { type: 'Teaching',desc: 'Education, vocational, and life skills programmes', color: 'border-l-4 border-sky-500' },
            ].map(item => {
              const rows = annualServiceRows.filter(r => r.serviceType === item.type as AnnualServiceRow['serviceType']);
              const total = rows.reduce((s, r) => s + r.total, 0);
              return (
                <div key={item.type} className={`bg-white rounded-xl border border-stone-200 shadow-sm p-5 ${item.color}`}>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">{item.type}</p>
                  <p className="text-3xl font-bold text-stone-900 tabular-nums mb-2">{total.toLocaleString()}</p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
