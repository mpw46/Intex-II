import { useState, useEffect } from 'react';
import { getDonations } from '../../api/donationsApi';
import { getResidents } from '../../api/residentsApi';
import { getSafehouses } from '../../api/safehousesApi';
import { getRecordings } from '../../api/processRecordingsApi';
import { getMonthlyMetrics, getSocialMediaPosts } from '../../api/reportsApi';
import { getMlDonorRisk, getMlResidentRisk, getMlSocialEngagement } from '../../api/mlApi';
import type { MlDonorRiskDto, MlResidentRiskDto, MlSocialEngagementDriverDto } from '../../types/ml';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportTab = 'donations' | 'social' | 'residents' | 'annual';

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


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPHP(n: number) {
  if (n >= 1000000) return `₱${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `₱${(n / 1000).toFixed(0)}K`;
  return `₱${n.toLocaleString()}`;
}

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
function GlobeIcon()       { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const TABS: { id: ReportTab; label: string }[] = [
  { id: 'donations', label: 'Donation & Donor Trends' },
  { id: 'social',    label: 'Social Media Trends'     },
  { id: 'residents', label: 'Resident Information'    },
  { id: 'annual',    label: 'Annual Accomplishment'   },
];

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function quarterOf(dateStr: string | undefined | null): 'q1' | 'q2' | 'q3' | 'q4' | null {
  if (!dateStr) return null;
  const m = new Date(dateStr).getMonth();
  if (m < 3) return 'q1';
  if (m < 6) return 'q2';
  if (m < 9) return 'q3';
  return 'q4';
}

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('donations');
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([]);
  const [safehouseOutcomes, setSafehouseOutcomes] = useState<SafehouseOutcome[]>([]);
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([]);
  const [annualServiceRows, setAnnualServiceRows] = useState<AnnualServiceRow[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [mlHighDonors, setMlHighDonors] = useState<MlDonorRiskDto[]>([]);
  const [mlHighResidents, setMlHighResidents] = useState<MlResidentRiskDto[]>([]);
  const [mlEngagementDrivers, setMlEngagementDrivers] = useState<MlSocialEngagementDriverDto[]>([]);
  const [mlEngagementDriversDT, setMlEngagementDriversDT] = useState<MlSocialEngagementDriverDto[]>([]);

  // Derived values — recomputed whenever monthlyDonations changes
  const BAR_MAX = monthlyDonations.length > 0 ? Math.max(...monthlyDonations.map(m => m.monetary)) : 1;
  const totalMonetary = monthlyDonations.reduce((s, m) => s + m.monetary, 0);
  const totalAllTypes = monthlyDonations.reduce((s, m) => s + m.monetary + m.inKind + m.time + m.skills, 0);
  const avgMonthly    = Math.round(totalMonetary / (monthlyDonations.length || 1));

  useEffect(() => {
    Promise.all([
      getDonations(),
      getResidents(),
      getSafehouses(),
      getMonthlyMetrics(),
      getRecordings(),
      getSocialMediaPosts(),
      getMlDonorRisk('High').catch(() => [] as MlDonorRiskDto[]),
      getMlResidentRisk('High').catch(() => [] as MlResidentRiskDto[]),
      getMlSocialEngagement('OLS').catch(() => [] as MlSocialEngagementDriverDto[]),
      getMlSocialEngagement('DecisionTree').catch(() => [] as MlSocialEngagementDriverDto[]),
    ]).then(([donations, residents, safehouses, metrics, recordings, posts, mlDonors, mlResidents, mlDrivers, mlDriversDT]) => {
      const now = new Date();
      const thisYear = now.getFullYear();
      const lastYear = thisYear - 1;

      // ---- Monthly donations ----
      const donMap = new Map<string, MonthlyDonation>();
      for (const d of donations) {
        if (!d.donationDate) continue;
        const dt = new Date(d.donationDate);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        const label = `${MONTH_ABBR[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`;
        if (!donMap.has(key)) donMap.set(key, { month: label, monetary: 0, inKind: 0, time: 0, skills: 0 });
        const entry = donMap.get(key)!;
        const val = d.estimatedValue ?? 0;
        if (d.donationType === 'Monetary')  entry.monetary += val;
        else if (d.donationType === 'InKind')  entry.inKind  += val;
        else if (d.donationType === 'Time')    entry.time    += val;
        else if (d.donationType === 'Skills')  entry.skills  += val;
      }
      const sortedMonths = [...donMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12);
      setMonthlyDonations(sortedMonths.map(([, v]) => v));

      // ---- Safehouse outcomes ----
      const shOutcomes: SafehouseOutcome[] = safehouses
        .filter(sh => sh.name)
        .map(sh => {
          const shResidents = residents.filter(r => r.safehouseId === sh.safehouseId);
          const active = shResidents.filter(r => r.caseStatus === 'Active').length;
          const reintegrated = shResidents.filter(r => r.reintegrationStatus === 'Completed').length;
          const total = shResidents.length;
          const reintegrationRate = total > 0 ? Math.round(reintegrated / total * 100) : 0;

          const shMetrics = metrics
            .filter(m => m.safehouseId === sh.safehouseId)
            .sort((a, b) => (b.monthStart ?? '').localeCompare(a.monthStart ?? ''));
          const latest = shMetrics[0];

          return {
            name: sh.name ?? '',
            region: sh.region ?? '',
            activeResidents: active,
            reintegrated,
            reintegrationRate,
            avgEducationProgress: Math.round(parseFloat(latest?.avgEducationProgress ?? '0') || 0),
            avgHealthScore:       Math.round(parseFloat(latest?.avgHealthScore ?? '0') || 0),
            avgCounselingSessions: latest?.processRecordingCount ?? 0,
          };
        });
      setSafehouseOutcomes(shOutcomes);

      // ---- Program outcomes ----
      const pctChange = (curr: number, prev: number) =>
        prev > 0 ? Math.round((curr - prev) / prev * 100) : 0;

      const admittedThisYear  = residents.filter(r => r.dateOfAdmission?.startsWith(String(thisYear))).length;
      const admittedLastYear  = residents.filter(r => r.dateOfAdmission?.startsWith(String(lastYear))).length;
      const reintThisYear     = residents.filter(r =>
        r.reintegrationStatus === 'Completed' && r.dateClosed?.startsWith(String(thisYear))
      ).length;
      const reintLastYear     = residents.filter(r =>
        r.reintegrationStatus === 'Completed' && r.dateClosed?.startsWith(String(lastYear))
      ).length;
      const activeCount       = residents.filter(r => r.caseStatus === 'Active').length;
      const sessThisYear      = recordings.filter(r => r.sessionDate?.startsWith(String(thisYear))).length;
      const sessLastYear      = recordings.filter(r => r.sessionDate?.startsWith(String(lastYear))).length;

      setProgramOutcomes([
        {
          category: `Girls Admitted (${thisYear})`,
          count: admittedThisYear,
          change: pctChange(admittedThisYear, admittedLastYear),
          positive: admittedThisYear >= admittedLastYear,
        },
        {
          category: 'Currently Active Residents',
          count: activeCount,
          change: 0,
          positive: true,
        },
        {
          category: `Reintegrated (${thisYear})`,
          count: reintThisYear,
          change: pctChange(reintThisYear, reintLastYear),
          positive: reintThisYear >= reintLastYear,
        },
        {
          category: `Counseling Sessions (${thisYear})`,
          count: sessThisYear,
          change: pctChange(sessThisYear, sessLastYear),
          positive: sessThisYear >= sessLastYear,
        },
        {
          category: 'Total Girls Served (All Time)',
          count: residents.length,
          change: 0,
          positive: true,
        },
      ]);

      // ---- Annual service rows (process recordings grouped by sessionType + quarter) ----
      const thisYearRecs = recordings.filter(r => r.sessionDate?.startsWith(String(thisYear)));
      const sessionTypes = [...new Set(thisYearRecs.map(r => r.sessionType).filter(Boolean))] as string[];
      const serviceRows: AnnualServiceRow[] = sessionTypes.map(st => {
        const recs = thisYearRecs.filter(r => r.sessionType === st);
        const q1 = recs.filter(r => quarterOf(r.sessionDate) === 'q1').length;
        const q2 = recs.filter(r => quarterOf(r.sessionDate) === 'q2').length;
        const q3 = recs.filter(r => quarterOf(r.sessionDate) === 'q3').length;
        const q4 = recs.filter(r => quarterOf(r.sessionDate) === 'q4').length;
        const label = st === 'Individual' ? 'Individual Counseling'
                    : st === 'Group'      ? 'Group Therapy'
                    : st;
        return { service: label, serviceType: 'Healing', q1, q2, q3, q4, total: q1 + q2 + q3 + q4 };
      });
      setAnnualServiceRows(serviceRows);

      // ---- Platform stats ----
      type PlatformAccum = { followers: number[]; reach: number[]; engagement: number[]; donations: number[] };
      const platformMap = new Map<string, PlatformAccum>();
      for (const post of posts) {
        const pl = post.platform ?? 'Unknown';
        if (!platformMap.has(pl)) platformMap.set(pl, { followers: [], reach: [], engagement: [], donations: [] });
        const e = platformMap.get(pl)!;
        e.followers.push(post.followerCountAtPost ?? 0);
        e.reach.push(post.reach ?? 0);
        e.engagement.push(post.engagementRate ?? 0);
        e.donations.push(post.estimatedDonationValuePhp ?? 0);
      }
      const pStats: PlatformStat[] = [...platformMap.entries()].map(([platform, data]) => ({
        platform: platform as PlatformStat['platform'],
        followers: Math.round(data.followers.reduce((s, v) => s + v, 0) / (data.followers.length || 1)),
        totalReach: data.reach.reduce((s, v) => s + v, 0),
        engagementRate: parseFloat((data.engagement.reduce((s, v) => s + v, 0) / (data.engagement.length || 1)).toFixed(1)),
        donationsAttributed: data.donations.reduce((s, v) => s + v, 0),
      }));
      setPlatformStats(pStats);

      // ---- Recent social posts ----
      const recentPosts: SocialPost[] = [...posts]
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 8)
        .map(p => ({
          id: String(p.postId),
          platform: (p.platform ?? 'Facebook') as SocialPost['platform'],
          contentType: p.contentTopic ?? p.postType ?? 'Post',
          date: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
            : '',
          reach: p.reach ?? 0,
          likes: p.likes ?? 0,
          shares: p.shares ?? 0,
          donationsAttributed: p.estimatedDonationValuePhp ?? 0,
        }));
      setSocialPosts(recentPosts);

      // ---- ML data ----
      setMlHighDonors((mlDonors as MlDonorRiskDto[]).slice(0, 5));
      setMlHighResidents((mlResidents as MlResidentRiskDto[]).sort((a, b) => b.riskProbability - a.riskProbability).slice(0, 8));
      setMlEngagementDrivers((mlDrivers as MlSocialEngagementDriverDto[]).slice(0, 10));
      setMlEngagementDriversDT((mlDriversDT as MlSocialEngagementDriverDto[]).slice(0, 10));
    });
  }, []);

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
      {/* DONATION & DONOR TRENDS                                            */}
      {/* ================================================================== */}
      {tab === 'donations' && (
        <div>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: `Total Monetary (${monthlyDonations.length} mo)`, value: formatPHP(totalMonetary) },
              { label: 'All Contribution Types',                          value: formatPHP(totalAllTypes) },
              { label: 'Avg Monthly Monetary',                            value: formatPHP(avgMonthly) },
              { label: 'Best Month',                                      value: formatPHP(BAR_MAX) },
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
                <option>Last 12 Months</option>
              </select>
            </div>
            {monthlyDonations.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Loading…</p>
            ) : (
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
            )}
          </div>

          {/* Contribution mix */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-6">
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

          {/* ML — Contact ASAP (high lapse-risk donors) */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-stone-900">Donor Retention — Contact ASAP</h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-50
                border border-rose-200 rounded-full px-2 py-0.5">ML Model</span>
            </div>
            <p className="text-xs text-stone-400 mb-5">
              Donors flagged as high lapse-risk by the nightly retention model.
            </p>
            {mlHighDonors.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">
                No high-risk donors scored yet — model runs nightly.
              </p>
            ) : (
              <div className="space-y-2">
                {mlHighDonors.map(d => (
                  <div key={d.supporterId}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-rose-50
                      border border-rose-100">
                    <span className="text-sm font-medium text-stone-800">
                      {d.displayName ?? `Supporter #${d.supporterId}`}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500">
                        Lapse probability
                      </span>
                      <span className="text-sm font-bold tabular-nums text-rose-700">
                        {Math.round(d.lapseProbability * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* SOCIAL MEDIA TRENDS                                                */}
      {/* ================================================================== */}
      {tab === 'social' && (
        <div>
          {/* Platform summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {platformStats.map(p => (
              <div key={p.platform} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
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
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-4">Avg Followers</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Reach</span>
                    <span className="font-medium text-stone-700">{p.totalReach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Avg Engagement Rate</span>
                    <span className="font-medium text-stone-700">{p.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Donations Attributed</span>
                    <span className="font-medium text-emerald-600">{formatPHP(p.donationsAttributed)}</span>
                  </div>
                </div>
              </div>
            ))}
            {platformStats.length === 0 && (
              <div className="sm:col-span-3 text-center py-12 text-stone-400 text-sm">Loading…</div>
            )}
          </div>

          {/* Platform totals summary */}
          {platformStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Followers', value: platformStats.reduce((s, p) => s + p.followers, 0).toLocaleString() },
                { label: 'Total Reach',     value: platformStats.reduce((s, p) => s + p.totalReach, 0).toLocaleString() },
                { label: 'Avg Engagement',  value: `${(platformStats.reduce((s, p) => s + p.engagementRate, 0) / platformStats.length).toFixed(1)}%` },
                { label: 'Total Donations', value: formatPHP(platformStats.reduce((s, p) => s + p.donationsAttributed, 0)) },
              ].map(item => (
                <div key={item.label} className="bg-haven-teal-900 rounded-xl p-5 text-white">
                  <p className="text-2xl font-bold tabular-nums mb-1">{item.value}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wide">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Posts table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-6">
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
                  {socialPosts.map(post => (
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
                  {socialPosts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">Loading…</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ML — Top Engagement Drivers (two models side by side) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {(
              [
                { label: 'OLS Model', drivers: mlEngagementDrivers },
                { label: 'Decision Tree Model', drivers: mlEngagementDriversDT },
              ] as { label: string; drivers: MlSocialEngagementDriverDto[] }[]
            ).map(({ label, drivers }) => (
              <div key={label} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-stone-900">Top Engagement Drivers — {label}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-haven-teal-700
                    bg-haven-teal-50 border border-haven-teal-200 rounded-full px-2 py-0.5">ML Model</span>
                </div>
                {drivers.length === 0 ? (
                  <p className="text-sm text-stone-400 py-8 text-center">
                    No engagement drivers scored yet — model runs nightly.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200">
                          {['Rank', 'Feature', 'Direction', 'Weight'].map(h => (
                            <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider
                              text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {drivers.map(d => (
                          <tr key={d.rank} className="hover:bg-stone-50 transition-colors duration-100">
                            <td className="px-4 py-3 tabular-nums font-semibold text-stone-400 w-12">
                              #{d.rank}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-stone-800">
                              {d.featureName}
                            </td>
                            <td className="px-4 py-3">
                              {d.direction === 'positive' && (
                                <span className="text-emerald-600 font-bold text-base">↑</span>
                              )}
                              {d.direction === 'negative' && (
                                <span className="text-rose-600 font-bold text-base">↓</span>
                              )}
                              {!d.direction && (
                                <span className="text-stone-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 tabular-nums text-stone-700">
                              {d.importance.toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* RESIDENT INFORMATION                                               */}
      {/* ================================================================== */}
      {tab === 'residents' && (
        <div>
          {/* Outcome KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {programOutcomes.map(o => (
              <div key={o.category} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold tabular-nums text-stone-900 mb-1">
                  {o.count.toLocaleString()}
                </p>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">{o.category}</p>
                {o.change !== 0 && (
                  <span className={`text-xs font-semibold ${o.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {o.positive ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    {' '}{Math.abs(o.change)}% vs prior year
                  </span>
                )}
              </div>
            ))}
            {programOutcomes.length === 0 && (
              <div className="col-span-3 text-center py-12 text-stone-400 text-sm">Loading…</div>
            )}
          </div>

          {/* Safehouse cards grid */}
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
                    { label: 'Active Residents',       value: String(s.activeResidents) },
                    { label: 'Total Reintegrated',     value: String(s.reintegrated) },
                    { label: 'Reintegration Rate',     value: `${s.reintegrationRate}%` },
                    { label: 'Avg Counseling Sessions',value: String(s.avgCounselingSessions) },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-xs text-stone-400">{row.label}</span>
                      <span className="text-sm font-semibold text-stone-900 tabular-nums">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <svg className="w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none"
                    aria-label={`Reintegration rate ${s.reintegrationRate}%`}>
                    <rect x="0" y="0" width="100" height="8" rx="4" className="fill-stone-100" />
                    <rect x="0" y="0" width={s.reintegrationRate} height="8" rx="4" className="fill-haven-teal-500" />
                  </svg>
                </div>
              </div>
            ))}
            {safehouseOutcomes.length === 0 && (
              <div className="sm:col-span-2 xl:col-span-4 text-center py-12 text-stone-400 text-sm">Loading…</div>
            )}
          </div>

          {/* ML — Struggling Residents */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-stone-900">Struggling Residents — Flagged High Risk</h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-50
                border border-rose-200 rounded-full px-2 py-0.5">ML Model</span>
            </div>
            <p className="text-xs text-stone-400 mb-5">
              Residents scored as high-risk by the nightly girls-at-risk model. Sorted by risk probability.
            </p>
            {mlHighResidents.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">
                No high-risk residents scored yet — model runs nightly.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      {['Case ID', 'Safehouse', 'Risk Probability'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider
                          text-stone-500 px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {mlHighResidents.map(r => (
                      <tr key={r.residentId} className="hover:bg-rose-50 transition-colors duration-100">
                        <td className="px-4 py-3 font-mono text-xs text-stone-700">
                          {r.caseControlNo ?? `#${r.residentId}`}
                        </td>
                        <td className="px-4 py-3 text-stone-600">
                          {r.safehouseName ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-rose-500"
                                style={{ width: `${Math.round(r.riskProbability * 100)}%` }}
                              />
                            </div>
                            <span className="tabular-nums font-bold text-rose-700">
                              {Math.round(r.riskProbability * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                <p className="text-sm text-white/60 mt-0.5">
                  Fiscal Year {new Date().getFullYear()} — All Safehouses
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Total Served',      value: programOutcomes.find(o => o.category.startsWith('Total'))?.count.toLocaleString() ?? '…' },
                  { label: 'Services Rendered', value: annualServiceRows.reduce((s, r) => s + r.total, 0).toLocaleString() },
                  { label: 'Reintegrated',      value: programOutcomes.find(o => o.category.startsWith('Reintegrated'))?.count.toLocaleString() ?? '…' },
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
                  {annualServiceRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">Loading…</td>
                    </tr>
                  ) : (
                    (['Caring', 'Healing', 'Teaching'] as AnnualServiceRow['serviceType'][]).map(type => {
                      const rows = annualServiceRows.filter(r => r.serviceType === type);
                      if (rows.length === 0) return null;
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
                    })
                  )}
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
