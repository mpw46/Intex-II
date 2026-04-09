import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getImpactSnapshot,
  getImpactSafehouses,
  getYearlyOutcomes,
  getAllocations,
  getProgramOutcomes,
} from '../api/impactApi';
import type {
  ImpactSnapshot,
  SafehouseCard,
  YearlyOutcome,
  DonationAllocationSummary,
  ProgramOutcomeMetric,
} from '../api/impactApi';

// ─── Fallback filler (used while loading or on error) ────────────────────────

const FALLBACK_SNAPSHOT: ImpactSnapshot = {
  totalGirlsServed: 0,
  activeResidents: 0,
  reintegrationSuccessRate: 0,
  yearsOfOperation: 0,
  activeSafehouses: 0,
  philippineRegionsCovered: 0,
  reportingPeriod: new Date().getFullYear().toString(),
};

// Stories of Hope are always static — pre-anonymized by staff
interface OutcomeHighlight {
  id: string;
  pseudonym: string;
  region: string;
  story: string;
  outcome: string;
}

const highlights: OutcomeHighlight[] = [
  {
    id: 'h-001',
    pseudonym: 'Maria A.',
    region: 'Luzon',
    story:
      'Admitted at 14 after a trafficking case referral, Maria spent 18 months in Haven House Manila. She completed her secondary education while in care and was reunited with her grandmother.',
    outcome: 'Graduated secondary school · Successfully reintegrated with family',
  },
  {
    id: 'h-002',
    pseudonym: 'Rowena T.',
    region: 'Visayas',
    story:
      'Rowena arrived at Light of Hope Cebu with no family contact information. Through social work outreach and 14 months of intensive counseling, a stable placement with extended family was secured.',
    outcome: 'Family reunification · Now enrolled in vocational training',
  },
  {
    id: 'h-003',
    pseudonym: 'Jasmine D.',
    region: 'Mindanao',
    story:
      'After a year at New Dawn Davao, Jasmine regained trust in adults and completed her first school year with full attendance. She was placed in a licensed foster home near her home province.',
    outcome: '100% school attendance · Stable foster placement secured',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlassKpiCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">{label}</p>
      <p className="mt-1 text-4xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

type SafehouseStatus = 'Active' | 'At Capacity' | 'Accepting Referrals';

const statusConfig: Record<SafehouseStatus, { label: string; classes: string }> = {
  'Active':              { label: 'Active',              classes: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'At Capacity':         { label: 'At Capacity',         classes: 'bg-amber-100 text-amber-800 border-amber-200' },
  'Accepting Referrals': { label: 'Accepting Referrals', classes: 'bg-sky-100 text-sky-800 border-sky-200' },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as SafehouseStatus] ?? statusConfig['Active'];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                  text-[11px] font-semibold uppercase tracking-wide border ${config.classes}`}
      role="status"
      aria-label={`Safehouse status: ${config.label}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  );
}

function OccupancyBar({ current, capacity }: { current: number; capacity: number }) {
  const pct = capacity > 0 ? Math.min(100, Math.round((current / capacity) * 100)) : 0;
  const fillClass = pct >= 100 ? 'fill-amber-500' : 'fill-haven-teal-600';
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-stone-500">Occupancy</span>
        <span className="text-xs font-semibold text-stone-700">{current} / {capacity}</span>
      </div>
      <svg
        className="w-full"
        height="6"
        aria-label={`${current} of ${capacity} beds occupied`}
      >
        <rect x="0" y="0" width="100%" height="6" rx="3" className="fill-stone-200" />
        <rect x="0" y="0" width={`${pct}%`} height="6" rx="3" className={fillClass} />
      </svg>
    </div>
  );
}

function OutcomeBar({ metric }: { metric: ProgramOutcomeMetric }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-stone-700">{metric.label}</span>
        <span className="text-sm font-bold tabular-nums text-haven-teal-700">
          {metric.completionRate}%
        </span>
      </div>
      <svg
        className="w-full mb-1"
        height="8"
        aria-label={`${metric.label}: ${metric.completionRate}%`}
      >
        <rect x="0" y="0" width="100%" height="8" rx="4" className="fill-stone-200" />
        <rect x="0" y="0" width={`${metric.completionRate}%`} height="8" rx="4" className="fill-haven-teal-600" />
      </svg>
      <p className="text-xs text-stone-500">{metric.description}</p>
    </div>
  );
}

function AllocationBar({ allocation }: { allocation: DonationAllocationSummary }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 shrink-0 text-right">
        <span className="text-base font-bold tabular-nums text-stone-900">
          {allocation.percentOfFunds}%
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-stone-800 block mb-1.5">
          {allocation.programArea}
        </span>
        <svg
          className="w-full mb-1.5"
          height="8"
          aria-label={`${allocation.programArea}: ${allocation.percentOfFunds}% of funds`}
        >
          <rect x="0" y="0" width="100%" height="8" rx="4" className="fill-stone-200" />
          <rect x="0" y="0" width={`${allocation.percentOfFunds}%`} height="8" rx="4" className="fill-haven-teal-600" />
        </svg>
        <p className="text-xs text-stone-500">{allocation.description}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-haven-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500 text-sm">Loading impact data...</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PublicImpactPage() {
  const [snapshot, setSnapshot] = useState<ImpactSnapshot>(FALLBACK_SNAPSHOT);
  const [safehouses, setSafehouses] = useState<SafehouseCard[]>([]);
  const [yearlyOutcomes, setYearlyOutcomes] = useState<YearlyOutcome[]>([]);
  const [allocations, setAllocations] = useState<DonationAllocationSummary[]>([]);
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcomeMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [snap, houses, yearly, allocs, outcomes] = await Promise.all([
          getImpactSnapshot(),
          getImpactSafehouses(),
          getYearlyOutcomes(),
          getAllocations(),
          getProgramOutcomes(),
        ]);
        setSnapshot(snap);
        setSafehouses(houses);
        setYearlyOutcomes(yearly);
        setAllocations(allocs);
        setProgramOutcomes(outcomes);
      } catch {
        // silently handled — UI shows whatever data loaded successfully
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const maxAdmitted = yearlyOutcomes.length > 0
    ? Math.max(...yearlyOutcomes.map((o) => o.girlsAdmitted))
    : 1;

  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <section className="bg-haven-teal-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
              Impact Report · {snapshot.reportingPeriod}
            </p>
            <h1 className="text-4xl font-bold text-white leading-snug tracking-tight mb-4">
              Real change, transparently shared
            </h1>
            <p className="text-base text-white/70 leading-relaxed">
              All data on this page is aggregated and anonymized to protect resident privacy.
              No individual identifying information is ever published.
            </p>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <GlassKpiCard
              value={snapshot.totalGirlsServed.toLocaleString()}
              label="Girls Served Since Founding"
            />
            <GlassKpiCard
              value={`${snapshot.reintegrationSuccessRate}%`}
              label="Reintegration Success Rate"
            />
            <GlassKpiCard
              value={snapshot.activeResidents.toString()}
              label="Residents Currently in Care"
            />
            <GlassKpiCard
              value={snapshot.activeSafehouses.toString()}
              label="Active Safehouses"
            />
            <GlassKpiCard
              value={snapshot.philippineRegionsCovered.toString()}
              label="Philippine Regions"
            />
            <GlassKpiCard
              value={`${snapshot.yearsOfOperation} yrs`}
              label="Years of Operation"
            />
          </div>
        </div>
      </section>

      {/* ── Safehouses ──────────────────────────────────────────────── */}
      {safehouses.length > 0 && (
        <section className="bg-stone-50 py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
                Our Safehouses
              </p>
              <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-3">
                {safehouses.length} home{safehouses.length !== 1 ? 's' : ''} across the Philippines
              </h2>
              <p className="text-base text-stone-600 leading-relaxed">
                Each safehouse operates with a dedicated team of licensed social workers,
                counselors, and care staff, serving girls across Luzon, Visayas, and Mindanao.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {safehouses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm p-6
                             hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900">{house.name}</h3>
                      <p className="text-sm text-stone-500 mt-0.5">
                        {house.city}, {house.province} · {house.region}
                      </p>
                    </div>
                    <StatusBadge status={house.status} />
                  </div>

                  <OccupancyBar current={house.currentOccupancy} capacity={house.capacityGirls} />

                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-stone-100">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">
                        Reintegration Rate
                      </p>
                      <p className="text-2xl font-bold tabular-nums text-haven-teal-700">
                        {house.reintegrationRatePercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">
                        Avg. Progress
                      </p>
                      <p className="text-2xl font-bold tabular-nums text-stone-900">
                        {house.avgProgressPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Program Outcomes ────────────────────────────────────────── */}
      {programOutcomes.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
                  Program Outcomes
                </p>
                <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4">
                  Measuring what matters
                </h2>
                <p className="text-base text-stone-600 leading-relaxed mb-6">
                  Each resident's progress is tracked across four core program areas. These
                  completion rates represent the percentage of residents who met or exceeded
                  their individualized benchmarks during the {snapshot.reportingPeriod} reporting period.
                </p>
                <p className="text-sm text-stone-400 italic">
                  Rates based on {snapshot.activeResidents} active and recently closed cases.
                  Data sourced from case management records and monthly outcome assessments.
                </p>
              </div>

              <div className="space-y-7">
                {programOutcomes.map((metric) => (
                  <OutcomeBar key={metric.label} metric={metric} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Donation Allocation ─────────────────────────────────────── */}
      {allocations.length > 0 && (
        <section className="bg-stone-50 py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
                  Financial Transparency
                </p>
                <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4">
                  Where your donation goes
                </h2>
                <p className="text-base text-stone-600 leading-relaxed mb-4">
                  We are committed to directing the majority of every donation toward direct
                  resident services. Our operating model prioritizes lean administration so
                  that more reaches the girls in our care.
                </p>
                <div className="bg-haven-teal-50 rounded-xl border border-haven-teal-200 p-4">
                  <p className="text-sm font-semibold text-haven-teal-800 mb-1">
                    Maximum impact for every peso
                  </p>
                  <p className="text-xs text-haven-teal-700">
                    The majority of funds go directly to programs supporting the girls in our care.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {allocations.map((allocation) => (
                  <AllocationBar key={allocation.programArea} allocation={allocation} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Year in Review ──────────────────────────────────────────── */}
      {yearlyOutcomes.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
                Year in Review
              </p>
              <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-3">
                {yearlyOutcomes.length} year{yearlyOutcomes.length !== 1 ? 's' : ''} of growing impact
              </h2>
              <p className="text-base text-stone-600 leading-relaxed">
                Annual admissions and reintegration outcomes across all safehouses.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 overflow-x-auto">
              <div className="flex items-end gap-3 md:gap-5 min-w-[360px]">
                {yearlyOutcomes.map((outcome) => {
                  const BAR_H = 144;
                  const admittedH = Math.round((outcome.girlsAdmitted / maxAdmitted) * BAR_H);
                  const reintegratedH = Math.round((outcome.girlsReintegrated / maxAdmitted) * BAR_H);
                  return (
                    <div key={outcome.year} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-semibold text-stone-700 tabular-nums">
                        {outcome.girlsAdmitted}
                      </span>
                      <svg
                        viewBox={`0 0 1 ${BAR_H}`}
                        preserveAspectRatio="none"
                        className="w-full"
                        height={BAR_H}
                        aria-label={`${outcome.year}: ${outcome.girlsAdmitted} admitted, ${outcome.girlsReintegrated} reintegrated`}
                      >
                        <rect x="0" y={BAR_H - admittedH} width="1" height={admittedH} rx="0.05" className="fill-haven-teal-200" />
                        <rect x="0" y={BAR_H - reintegratedH} width="1" height={reintegratedH} rx="0.05" className="fill-haven-teal-600" />
                      </svg>
                      <span className="text-xs font-medium text-stone-500">{outcome.year}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-haven-teal-600" aria-hidden="true" />
                  <span className="text-xs text-stone-600">Reintegrated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-haven-teal-200" aria-hidden="true" />
                  <span className="text-xs text-stone-600">Admitted</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Stories of Hope ─────────────────────────────────────────── */}
      <section className="bg-haven-teal-900 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
              Stories of Hope
            </p>
            <h2 className="text-3xl font-bold text-white leading-snug mb-3">
              Behind every number is a person
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              All names are pseudonyms. Identifying details have been changed or removed
              to protect the privacy and dignity of the individuals described.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-base font-semibold text-white">{h.pseudonym}</p>
                    <p className="text-xs text-white/60 mt-0.5">{h.region}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-haven-teal-700 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-haven-teal-200" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-5">{h.story}</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-1">
                    Outcome
                  </p>
                  <p className="text-xs text-white/70">{h.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-stone-100 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
            Make a Difference
          </p>
          <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4 max-w-xl mx-auto">
            Your support makes every number on this page possible
          </h2>
          <p className="text-base text-stone-600 leading-relaxed mb-10 max-w-lg mx-auto">
            Donations fund shelter, counseling, education, and the dedicated staff who
            walk alongside every girl on her journey to safety and healing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-8 py-4
                         bg-haven-teal-600 text-white text-base font-semibold rounded-lg
                         transition-colors duration-150 hover:bg-haven-teal-700
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
            >
              Donate Now
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4
                         bg-white text-stone-700 text-base font-medium rounded-lg
                         border border-stone-300 transition-colors duration-150
                         hover:bg-stone-50 hover:border-stone-400
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
            >
              Learn About Our Work
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default PublicImpactPage;
