import { type ReactElement } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  { id: '1', type: 'donation',    description: 'Global Care Corp. donated ₱250,000',                time: '2 hours ago' },
  { id: '2', type: 'resident',    description: 'New resident admitted — Light of Hope Cebu',         time: '5 hours ago' },
  { id: '3', type: 'conference',  description: 'Case conference scheduled for RES-2024-007',         time: 'Yesterday'   },
  { id: '4', type: 'visit',       description: 'Home visit completed — RES-2024-012',                time: 'Yesterday'   },
  { id: '5', type: 'donation',    description: 'Reyes Family Foundation recurring donation received', time: '2 days ago'  },
];

// ---------------------------------------------------------------------------
// Lookup maps
// ---------------------------------------------------------------------------

const ACTIVITY_DOT: Record<ActivityItem['type'], string> = {
  donation:   'bg-emerald-500',
  resident:   'bg-haven-teal-500',
  conference: 'bg-amber-500',
  visit:      'bg-sky-500',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPHP(n: number) {
  return `₱${n.toLocaleString()}`;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
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
// Icons
// ---------------------------------------------------------------------------

function PersonIcon()   { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function HeartIcon()    { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function PhilIcon()     { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function CalendarIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  const resDelta = dashboardStats.activeResidents - dashboardStats.activeResidentsLastMonth;
  const donDelta = pctChange(dashboardStats.donationsThisMonth, dashboardStats.donationsLastMonth);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

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
  );
}
