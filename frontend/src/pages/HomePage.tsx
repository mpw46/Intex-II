import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImpactSnapshot } from '../api/impactApi';

// ─── Types ────────────────────────────────────────────────────────────────────
// These interfaces describe the shapes coming from the API.
// The filler constants below have the same shape — swap them for useState + fetch
// and the rest of the page works without any other changes.

/** Derived from `public_impact_snapshots` — the four hero overlay numbers */
interface HomeStats {
  totalGirlsServed: number;
  activeSafehouses: number;
  reintegrationSuccessRate: number; // percentage 0–100
  yearsOfOperation: number;
}

/** One anonymized pull-quote from `public_impact_snapshots.outcome_highlights` */
interface FeaturedQuote {
  text: string;
  attribution: string; // e.g. "Former resident, Haven House Manila"
}

// ─── Dynamic filler data ──────────────────────────────────────────────────────
// These two constants are the only things that come from the database on this page.
// When the API is ready, replace them with fetched data — for example:
//
//   const [stats, setStats] = useState<HomeStats>(homeStats);
//   const [quote, setQuote] = useState<FeaturedQuote>(featuredQuote);
//
//   useEffect(() => {
//     fetch('/api/public/impact/snapshot')
//       .then((r) => r.json())
//       .then((data) => setStats(data));
//
//     fetch('/api/public/impact/featured-quote')
//       .then((r) => r.json())
//       .then((data) => setQuote(data));
//   }, []);
//
// The rest of the page — section layouts, labels, copy — does not touch the API.
// See DonorDashboardPage.tsx for a fuller example with more data shapes.

// yearsOfOperation is static — no org founding date table in the DB
const YEARS_OF_OPERATION = 12;

// TODO: Replace with GET /api/public/impact/featured-quote
const featuredQuote: FeaturedQuote = {
  text: "When I arrived, I didn't believe I deserved anything good. The staff here showed me I was wrong. Now I'm back in school and my family is together again.",
  attribution: 'Former resident, Haven House Manila',
};

// ─── Static editorial content ─────────────────────────────────────────────────
// This content describes the organization's programs. It does not come from the
// database — update it here directly whenever the copy changes.

const missionFeatures = [
  {
    title: 'Safe Refuge',
    description:
      'Secure, nurturing safehouses provide girls with immediate protection from danger and a stable environment to begin healing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V12h6v9" />
        <path d="M3 12v9h18v-9" />
      </svg>
    ),
  },
  {
    title: 'Professional Care',
    description:
      'Licensed social workers and counselors provide trauma-informed therapy, education support, and health services tailored to each resident.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Reintegration',
    description:
      'Structured transition planning equips girls with the skills, confidence, and family connections to return safely to their communities.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      </svg>
    ),
  },
];

const howWeHelpSteps = [
  {
    number: '01',
    title: 'Intake & Assessment',
    description:
      'Each girl receives a comprehensive assessment covering safety, health, educational needs, and family background. A dedicated social worker is assigned immediately.',
  },
  {
    number: '02',
    title: 'Counseling & Healing',
    description:
      'Individual and group therapy sessions address trauma, build coping skills, and restore self-worth. Health, education, and spiritual care are woven throughout.',
  },
  {
    number: '03',
    title: 'Reintegration & Monitoring',
    description:
      'When ready, girls transition back to family or a supervised placement. Case workers conduct ongoing home visits to ensure lasting safety and stability.',
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function HomePage() {
  const [stats, setStats] = useState<HomeStats>({
    totalGirlsServed: 0,
    activeSafehouses: 0,
    reintegrationSuccessRate: 0,
    yearsOfOperation: YEARS_OF_OPERATION,
  });

  useEffect(() => {
    getImpactSnapshot().then(snapshot => {
      setStats({
        totalGirlsServed: snapshot.totalGirlsServed,
        activeSafehouses: snapshot.activeSafehouses,
        reintegrationSuccessRate: snapshot.reintegrationSuccessRate,
        yearsOfOperation: YEARS_OF_OPERATION,
      });
    });
  }, []);

  const heroKpis = [
    { value: stats.totalGirlsServed.toLocaleString(), label: 'Lives Impacted' },
    { value: stats.activeSafehouses.toString(),        label: 'Safe Homes' },
    { value: `${stats.reintegrationSuccessRate}%`,     label: 'Reintegration Success' },
    { value: `${stats.yearsOfOperation} yrs`,          label: 'Years of Service' },
  ];

  const impactKpis = [
    { value: stats.totalGirlsServed.toLocaleString(), label: 'Girls Served Since 2012' },
    { value: stats.activeSafehouses.toString(),        label: 'Active Safehouses' },
    { value: '3',                                      label: 'Philippine Regions' },
  ];

  return (
    <div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end bg-haven-teal-900">
        {/*
          Hero background photo — uncomment and replace src when available:
          <img
            src="/hero.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-950/75" aria-hidden="true" />
        */}

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-20 lg:pb-32 w-full">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-5">
              Haven · Safe Refuge
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6">
              Restoring Safety.<br />Rebuilding Lives.
            </h1>
            <p className="text-base lg:text-lg text-white/80 leading-relaxed mb-10 max-w-lg">
              Your support creates real change for girls in the Philippines who have survived
              abuse and deserve a safe place to heal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/impact"
                className="inline-flex items-center justify-center px-8 py-4
                           bg-haven-teal-600 text-white text-base font-semibold rounded-lg
                           transition-all duration-150 hover:bg-haven-teal-700 hover:-translate-y-px
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
                           focus-visible:ring-offset-haven-teal-900"
              >
                See the Impact
              </Link>
              <Link
                to="/impact"
                className="inline-flex items-center justify-center px-8 py-4
                           bg-haven-violet-600 text-white text-base font-semibold rounded-lg
                           transition-colors duration-150 hover:bg-haven-violet-700
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-haven-violet-500 focus-visible:ring-offset-2
                           focus-visible:ring-offset-haven-teal-900"
              >
                Get Involved
              </Link>
            </div>
          </div>

          {/* Floating KPI row — values come from homeStats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {heroKpis.map((kpi) => (
              <GlassKpiCard key={kpi.label} value={kpi.value} label={kpi.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────────────────── */}
      {/* Static editorial section — no API data */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
              Our Mission
            </p>
            <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4">
              A path from trauma to a future worth living
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">
              Haven partners with licensed social welfare organizations across the Philippines to
              operate safehouses that provide immediate protection, professional care, and a clear
              road to reintegration for girls who have survived abuse, trafficking, and neglect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-6
                           hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-2.5 bg-haven-teal-50 rounded-lg text-haven-teal-600 w-fit mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ──────────────────────────────────────────────────────── */}
      {/* impactKpis and featuredQuote come from homeStats / featuredQuote above */}
      <section className="bg-haven-teal-900 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
              Our Impact
            </p>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              Real numbers behind every life changed
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Since 2012, Haven and its in-country partners have built a network of safehouses
              dedicated to one goal: ensuring every girl in their care reaches safety, healing,
              and a future of her own choosing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {impactKpis.map((kpi) => (
              <GlassKpiCard key={kpi.label} value={kpi.value} label={kpi.label} />
            ))}
          </div>

          <blockquote className="border-l-2 border-haven-teal-500 pl-6 max-w-2xl">
            <p className="text-xl font-light leading-relaxed text-white/90 italic mb-4">
              "{featuredQuote.text}"
            </p>
            <cite className="text-sm text-haven-teal-300 not-italic font-medium">
              — {featuredQuote.attribution}
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ── How We Help ─────────────────────────────────────────────────── */}
      {/* Static editorial section — no API data */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
              Our Process
            </p>
            <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4">
              A structured path to healing
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">
              Every girl who enters a Haven safehouse receives a personalized care plan built around
              her story, her needs, and her goals — guided by trained social workers at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howWeHelpSteps.map((step) => (
              <div
                key={step.number}
                className="bg-stone-50 rounded-xl border border-stone-200 p-6
                           hover:shadow-md hover:border-stone-300 transition-all duration-200"
              >
                <p className="text-4xl font-extrabold text-haven-teal-100 mb-4 leading-none">
                  {step.number}
                </p>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get Involved ────────────────────────────────────────────────── */}
      {/* Static editorial section — no API data */}
      <section className="bg-stone-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-3">
              Get Involved
            </p>
            <h2 className="text-3xl font-bold text-stone-900 leading-snug mb-4">
              Every form of support matters
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">
              Whether you give financially, volunteer your skills, or spread the word — your
              involvement directly funds the safehouses and services that change lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donate card */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8
                            hover:shadow-md transition-shadow duration-200">
              <div className="p-2.5 bg-haven-teal-50 rounded-lg text-haven-teal-600 w-fit mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Make a Donation</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Monetary donations fund safehouse operations, staff salaries, counseling services,
                educational materials, and medical care. Every contribution — large or small —
                extends the reach of our work.
              </p>
              <Link
                to="/impact"
                className="inline-flex items-center justify-center px-5 py-2.5
                           bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                           transition-colors duration-150 hover:bg-haven-teal-700
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                Donate Now
              </Link>
            </div>

            {/* Partner card */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8
                            hover:shadow-md transition-shadow duration-200">
              <div className="p-2.5 bg-haven-teal-50 rounded-lg text-haven-teal-600 w-fit mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Partner With Us</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Contribute skills, time, supplies, or professional expertise. We work with
                volunteers, corporate partners, healthcare providers, and educators who share our
                commitment to protecting vulnerable children.
              </p>
              <Link
                to="/impact"
                className="inline-flex items-center justify-center px-5 py-2.5
                           bg-white text-stone-700 text-sm font-medium rounded-lg
                           border border-stone-300 transition-colors duration-150
                           hover:bg-stone-50 hover:border-stone-400
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
