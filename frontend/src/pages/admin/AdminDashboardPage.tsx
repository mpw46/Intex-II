import { type ReactElement, useState, useEffect } from 'react';
import { getResidents } from '../../api/residentsApi';
import { getSafehouses } from '../../api/safehousesApi';
import { getSupporters } from '../../api/supportersApi';
import { getDonations } from '../../api/donationsApi';
import { getInterventionPlans, getMonthlyMetrics } from '../../api/reportsApi';
import { getVisitations } from '../../api/homeVisitationApi';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityItem {
  id: string;
  type: 'donation' | 'resident' | 'conference' | 'visit';
  description: string;
  time: string;
}

interface SafehouseRow {
  name: string;
  region: string;
  capacity: number;
  current: number;
}

interface DashboardStats {
  activeResidents: number;
  activeResidentsLastMonth: number;
  activeDonors: number;
  donationsThisMonth: number;
  upcomingConferences: number;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

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
  const [stats, setStats] = useState<DashboardStats>({
    activeResidents: 0, activeResidentsLastMonth: 0,
    activeDonors: 0, donationsThisMonth: 0, upcomingConferences: 0,
  });
  const [safehouses, setSafehouses] = useState<SafehouseRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().substring(0, 10);
    const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().substring(0, 10);

    Promise.all([
      getResidents({ caseStatus: 'Active' }),
      getSupporters({ status: 'Active' }),
      getDonations(),
      getInterventionPlans(),
      getSafehouses(),
      getMonthlyMetrics(),
      getVisitations(),
    ]).then(([activeRes, activeSup, allDonations, plans, shData, metrics, visits]) => {
      // KPIs
      const donThisMonth = allDonations
        .filter(d => d.donationDate && d.donationDate >= thisMonthStart)
        .reduce((sum, d) => sum + (d.estimatedValue ?? 0), 0);

      const upcoming = plans.filter(p =>
        p.caseConferenceDate && p.caseConferenceDate >= now.toISOString().substring(0, 10)
      ).length;

      // Prior-month active residents from monthly metrics
      const lastMonthMetrics = metrics.filter(m =>
        m.monthStart && m.monthStart >= lastMonthStart && m.monthStart <= lastMonthEnd
      );
      const activeResLastMonth = lastMonthMetrics.reduce((s, m) => s + (m.activeResidents ?? 0), 0);

      setStats({
        activeResidents: activeRes.length,
        activeResidentsLastMonth: activeResLastMonth,
        activeDonors: activeSup.length,
        donationsThisMonth: donThisMonth,
        upcomingConferences: upcoming,
      });

      setSafehouses(shData.map(s => ({
        name: s.name ?? '',
        region: s.region ?? '',
        capacity: s.capacityGirls ?? 0,
        current: s.currentOccupancy ?? 0,
      })));

      // Recent activity: merge latest records from 3 tables and sort
      const donActivity: ActivityItem[] = allDonations
        .filter(d => d.donationDate)
        .sort((a, b) => (b.donationDate ?? '').localeCompare(a.donationDate ?? ''))
        .slice(0, 3)
        .map(d => ({
          id: `don-${d.donationId}`,
          type: 'donation' as const,
          description: `New ${d.donationType?.toLowerCase() ?? ''} donation received`,
          time: relativeTime(d.donationDate!),
        }));

      const resActivity: ActivityItem[] = activeRes
        .filter(r => r.dateOfAdmission)
        .sort((a, b) => (b.dateOfAdmission ?? '').localeCompare(a.dateOfAdmission ?? ''))
        .slice(0, 2)
        .map(r => ({
          id: `res-${r.residentId}`,
          type: 'resident' as const,
          description: `New resident case ${r.caseControlNo ?? r.residentId} opened`,
          time: relativeTime(r.dateOfAdmission!),
        }));

      const visitActivity: ActivityItem[] = visits
        .filter(v => v.visitDate)
        .sort((a, b) => (b.visitDate ?? '').localeCompare(a.visitDate ?? ''))
        .slice(0, 2)
        .map(v => ({
          id: `vis-${v.visitationId}`,
          type: 'visit' as const,
          description: `Home visit completed — ${v.visitType ?? 'Field visit'}`,
          time: relativeTime(v.visitDate!),
        }));

      const confActivity: ActivityItem[] = plans
        .filter(p => p.caseConferenceDate)
        .sort((a, b) => (b.caseConferenceDate ?? '').localeCompare(a.caseConferenceDate ?? ''))
        .slice(0, 2)
        .map(p => ({
          id: `conf-${p.planId}`,
          type: 'conference' as const,
          description: `Case conference — ${p.planCategory ?? 'scheduled'}`,
          time: relativeTime(p.caseConferenceDate!),
        }));

      const all = [...donActivity, ...resActivity, ...visitActivity, ...confActivity]
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 5);
      setRecentActivity(all);
    });
  }, []);

  const resDelta = stats.activeResidents - stats.activeResidentsLastMonth;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Active Residents"
          value={String(stats.activeResidents)}
          change={resDelta !== 0 ? `${Math.abs(resDelta)} vs last month` : undefined}
          positive={resDelta >= 0}
          icon={<PersonIcon />}
        />
        <KpiCard
          label="Active Donors"
          value={String(stats.activeDonors)}
          icon={<HeartIcon />}
        />
        <KpiCard
          label="Donations This Month"
          value={formatPHP(stats.donationsThisMonth)}
          icon={<PhilIcon />}
        />
        <KpiCard
          label="Upcoming Conferences"
          value={String(stats.upcomingConferences)}
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
