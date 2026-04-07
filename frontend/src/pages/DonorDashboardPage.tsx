import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
// These interfaces match the real database schema described in CLAUDE.md.
// Swap the filler constants below for API responses of the same shape.

/** Derived from `public_impact_snapshots` + cross-table aggregations */
interface ImpactSnapshot {
  totalGirlsServed: number;
  activeResidents: number;
  reintegrationSuccessRate: number; // percentage 0–100
  yearsOfOperation: number;
  activeSafehouses: number;
  philippineRegionsCovered: number;
  reportingPeriod: string;           // e.g. "2024"
}

/** Derived from `safehouses` joined with `safehouse_monthly_metrics` */
interface SafehouseCard {
  id: string;                        // safehouse_id
  name: string;
  region: string;                    // Luzon | Visayas | Mindanao
  city: string;
  province: string;
  status: 'Active' | 'At Capacity' | 'Accepting Referrals';
  capacityGirls: number;             // capacity_girls
  currentOccupancy: number;          // current_occupancy
  reintegrationRatePercent: number;  // from safehouse_monthly_metrics
  avgProgressPercent: number;        // avg of progress_percent in education_records
}

/** Derived from `donation_allocations` aggregated by program_area */
interface DonationAllocation {
  programArea: string;
  percentOfFunds: number;
  description: string;
}

/** Derived from `safehouse_monthly_metrics` aggregated annually */
interface YearlyOutcome {
  year: number;
  girlsAdmitted: number;
  girlsReintegrated: number;
}

/** Derived from `public_impact_snapshots` outcome_highlights — fully anonymized */
interface OutcomeHighlight {
  id: string;
  pseudonym: string;   // Never a real name — use initials like "Maria A."
  region: string;
  story: string;
  outcome: string;
}

/** Derived from `education_records`, `health_wellbeing_records`, `process_recordings` */
interface ProgramOutcomeMetric {
  label: string;
  completionRate: number; // 0–100
  description: string;
}

// ─── Filler Data ──────────────────────────────────────────────────────────────
// TODO: Replace each constant with a fetch from the API:
//   impactSnapshot  → GET /api/public/impact/snapshot
//   safehouses      → GET /api/public/safehouses
//   yearlyOutcomes  → GET /api/public/impact/yearly
//   allocations     → GET /api/public/impact/allocations
//   highlights      → GET /api/public/impact/highlights
//   programOutcomes → GET /api/public/impact/outcomes

const impactSnapshot: ImpactSnapshot = {
  totalGirlsServed: 1247,
  activeResidents: 89,
  reintegrationSuccessRate: 95,
  yearsOfOperation: 12,
  activeSafehouses: 4,
  philippineRegionsCovered: 3,
  reportingPeriod: '2024',
};

const safehouses: SafehouseCard[] = [
  {
    id: 'sh-001',
    name: 'Haven House Manila',
    region: 'Luzon',
    city: 'Manila',
    province: 'Metro Manila',
    status: 'Active',
    capacityGirls: 30,
    currentOccupancy: 24,
    reintegrationRatePercent: 97,
    avgProgressPercent: 78,
  },
  {
    id: 'sh-002',
    name: 'Light of Hope Cebu',
    region: 'Visayas',
    city: 'Cebu City',
    province: 'Cebu',
    status: 'At Capacity',
    capacityGirls: 25,
    currentOccupancy: 25,
    reintegrationRatePercent: 93,
    avgProgressPercent: 82,
  },
  {
    id: 'sh-003',
    name: 'New Dawn Davao',
    region: 'Mindanao',
    city: 'Davao City',
    province: 'Davao del Sur',
    status: 'Accepting Referrals',
    capacityGirls: 20,
    currentOccupancy: 14,
    reintegrationRatePercent: 96,
    avgProgressPercent: 74,
  },
  {
    id: 'sh-004',
    name: 'Safe Harbor Iloilo',
    region: 'Visayas',
    city: 'Iloilo City',
    province: 'Iloilo',
    status: 'Active',
    capacityGirls: 20,
    currentOccupancy: 18,
    reintegrationRatePercent: 91,
    avgProgressPercent: 71,
  },
];

const yearlyOutcomes: YearlyOutcome[] = [
  { year: 2020, girlsAdmitted: 187, girlsReintegrated: 164 },
  { year: 2021, girlsAdmitted: 203, girlsReintegrated: 189 },
  { year: 2022, girlsAdmitted: 218, girlsReintegrated: 201 },
  { year: 2023, girlsAdmitted: 231, girlsReintegrated: 219 },
  { year: 2024, girlsAdmitted: 247, girlsReintegrated: 235 },
];

const allocations: DonationAllocation[] = [
  {
    programArea: 'Direct Services',
    percentOfFunds: 52,
    description: 'Shelter, food, clothing, hygiene supplies, and medical care for residents.',
  },
  {
    programArea: 'Counseling & Therapy',
    percentOfFunds: 22,
    description: 'Licensed social workers, psychologists, and trauma-informed therapy sessions.',
  },
  {
    programArea: 'Education & Vocational',
    percentOfFunds: 16,
    description: 'School enrollment, tutoring, skills training, and livelihood programs.',
  },
  {
    programArea: 'Operations & Administration',
    percentOfFunds: 10,
    description: 'Safehouse maintenance, staff coordination, reporting, and compliance.',
  },
];

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

const programOutcomes: ProgramOutcomeMetric[] = [
  {
    label: 'Education Completion',
    completionRate: 88,
    description: 'Residents who completed their enrolled academic program or school year',
  },
  {
    label: 'Counseling Engagement',
    completionRate: 96,
    description: 'Residents who completed their full counseling intervention plan',
  },
  {
    label: 'Health Improvement',
    completionRate: 91,
    description: 'Residents showing sustained improvement in nutrition and wellbeing scores',
  },
  {
    label: 'Successful Reintegration',
    completionRate: 95,
    description: 'Closed cases where the resident was safely reintegrated with family or placement',
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

const statusConfig: Record<SafehouseCard['status'], { label: string; classes: string }> = {
  'Active':              { label: 'Active',              classes: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'At Capacity':         { label: 'At Capacity',         classes: 'bg-amber-100 text-amber-800 border-amber-200' },
  'Accepting Referrals': { label: 'Accepting Referrals', classes: 'bg-sky-100 text-sky-800 border-sky-200' },
};

function StatusBadge({ status }: { status: SafehouseCard['status'] }) {
  const config = statusConfig[status];
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
  const pct = Math.min(100, Math.round((current / capacity) * 100));
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

function AllocationBar({ allocation }: { allocation: DonationAllocation }) {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function DonorDashboardPage() {
  const maxAdmitted = Math.max(...yearlyOutcomes.map((o) => o.girlsAdmitted));

  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <section className="bg-haven-teal-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
              Impact Report · {impactSnapshot.reportingPeriod}
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
              value={impactSnapshot.totalGirlsServed.toLocaleString()}
              label="Girls Served Since 2012"
            />
            <GlassKpiCard
              value={`${impactSnapshot.reintegrationSuccessRate}%`}
              label="Reintegration Success Rate"
            />
            <GlassKpiCard
              value={impactSnapshot.activeResidents.toString()}
              label="Residents Currently in Care"
            />
            <GlassKpiCard
              value={impactSnapshot.activeSafehouses.toString()}
              label="Active Safehouses"
            />
            <GlassKpiCard
              value={impactSnapshot.philippineRegionsCovered.toString()}
              label="Philippine Regions"
            />
            <GlassKpiCard
              value={`${impactSnapshot.yearsOfOperation} yrs`}
              label="Years of Operation"
            />
          </div>
        </div>
      </section>

      {/* ── Safehouses ──────────────────────────────────────────────── */}
      <section className="bg-stone-50 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
              Our Safehouses
            </p>
            <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-3">
              Four homes across the Philippines
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

      {/* ── Program Outcomes ────────────────────────────────────────── */}
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
                their individualized benchmarks during the {impactSnapshot.reportingPeriod} reporting period.
              </p>
              <p className="text-sm text-stone-400 italic">
                Rates based on {impactSnapshot.activeResidents} active and recently closed cases.
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

      {/* ── Donation Allocation ─────────────────────────────────────── */}
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
                  90¢ of every peso goes directly to programs
                </p>
                <p className="text-xs text-haven-teal-700">
                  Only 10% covers operations and administration — well below the 25% sector benchmark.
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

      {/* ── Year in Review ──────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
              Year in Review
            </p>
            <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-3">
              Five years of growing impact
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">
              Annual admissions and reintegration outcomes across all Haven safehouses.
            </p>
          </div>

          {/* Bar chart — SVG bars avoid inline styles; each column is a flex item */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 overflow-x-auto">
            <div className="flex items-end gap-3 md:gap-5 min-w-[360px]">
              {yearlyOutcomes.map((outcome) => {
                const BAR_H = 144; // px — matches h-36
                const admittedH = Math.round((outcome.girlsAdmitted / maxAdmitted) * BAR_H);
                const reintegratedH = Math.round((outcome.girlsReintegrated / maxAdmitted) * BAR_H);
                return (
                  <div key={outcome.year} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-stone-700 tabular-nums">
                      {outcome.girlsAdmitted}
                    </span>
                    {/*
                      viewBox="0 0 1 BAR_H" + preserveAspectRatio="none" stretches the single
                      unit-wide bar to fill the flex column width. Heights are in viewBox coords.
                    */}
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

            {/* Legend */}
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
              to="/impact"
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

export default DonorDashboardPage;
