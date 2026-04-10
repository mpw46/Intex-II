import { useState, useEffect, useMemo } from 'react';
import { getImpactSnapshot, getImpactAllocations, getDonationImpactRates } from '../api/publicImpactApi';
import type { ImpactSnapshotDto, AllocationSummaryDto, DonationImpactRateDto } from '../types/publicImpact';

type Platform = 'Instagram' | 'Facebook' | 'WhatsApp' | 'LinkedIn';
type TimePeriod = 'last30' | 'lastQuarter' | 'ytd' | 'allTime';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS: Platform[] = ['Instagram', 'Facebook', 'WhatsApp', 'LinkedIn'];

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'lastQuarter', label: 'Last Quarter' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'allTime', label: 'All Time' },
];

const PERIOD_TEXT: Record<TimePeriod, string> = {
  last30: 'this past month',
  lastQuarter: 'this past quarter',
  ytd: 'this year',
  allTime: 'over the years',
};

const SNAPSHOT_FIELDS: { key: string; label: string; format: (v: number) => string }[] = [
  { key: 'totalGirlsServed', label: 'Total Girls Served', format: v => v.toLocaleString() },
  { key: 'activeResidents', label: 'Active Residents', format: v => v.toLocaleString() },
  { key: 'reintegrationSuccessRate', label: 'Reintegration Success Rate', format: v => `${v}%` },
  { key: 'yearsOfOperation', label: 'Years of Operation', format: v => String(v) },
  { key: 'activeSafehouses', label: 'Active Safehouses', format: v => String(v) },
  { key: 'philippineRegionsCovered', label: 'Regions Covered', format: v => String(v) },
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('lastQuarter');
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [snapshot, setSnapshot] = useState<ImpactSnapshotDto | null>(null);
  const [allocations, setAllocations] = useState<AllocationSummaryDto[]>([]);
  const [impactRates, setImpactRates] = useState<DonationImpactRateDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Fetch public metrics when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setCopied(false);
    setShared(false);
    Promise.all([getImpactSnapshot(), getImpactAllocations(), getDonationImpactRates()])
      .then(([snap, allocs, rates]) => {
        setSnapshot(snap);
        setAllocations(allocs);
        setImpactRates(rates);
        setSelectedMetrics(new Set([
          'snapshot.totalGirlsServed',
          'snapshot.reintegrationSuccessRate',
          'snapshot.activeSafehouses',
        ]));
      })
      .catch(() => { /* graceful — checkboxes will be empty */ })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ── Generate post text ──────────────────────────────────────────────
  const postText = useMemo(() => {
    if (selectedMetrics.size === 0) return 'Select metrics above to generate a post preview.';

    const period = PERIOD_TEXT[timePeriod];
    const lines: string[] = [];

    const openers: Record<Platform, string> = {
      Instagram: `Here's what Haven has accomplished ${period} \u2728`,
      Facebook: `We're proud to share Haven's impact ${period}:`,
      WhatsApp: `Haven Impact Update \u2014 ${period}:`,
      LinkedIn: `Haven Project \u2014 Impact Report (${period}):`,
    };
    lines.push(openers[platform]);
    lines.push('');

    // Snapshot metrics
    for (const f of SNAPSHOT_FIELDS) {
      if (!selectedMetrics.has(`snapshot.${f.key}`) || !snapshot) continue;
      const val = snapshot[f.key as keyof ImpactSnapshotDto] as number;
      lines.push(`\u2022 ${f.label}: ${f.format(val)}`);
    }

    // Allocation metrics
    for (const a of allocations) {
      if (!selectedMetrics.has(`allocation.${a.programArea}`)) continue;
      lines.push(`\u2022 ${a.programArea}: ${a.percentOfFunds}% of funds`);
    }

    // Donation impact rates
    for (const r of impactRates) {
      if (!selectedMetrics.has(`rate.${r.impactCategory}`)) continue;
      lines.push(`\u2022 ${r.impactCategory}: \u20B1${r.costPerUnit.toLocaleString()} per ${r.unitLabel}`);
    }

    lines.push('');

    if (platform === 'Instagram' || platform === 'Facebook') {
      lines.push('Every contribution matters. Together we restore futures. \u{1F49A}');
      lines.push('');
      lines.push('#HavenProject #EndTrafficking #RestoringFutures #Philippines');
    } else if (platform === 'LinkedIn') {
      lines.push('Learn more about how Haven is making a difference in the Philippines.');
    } else {
      lines.push('Thank you for your continued support \u{1F64F}');
    }

    return lines.join('\n');
  }, [platform, timePeriod, selectedMetrics, snapshot, allocations, impactRates]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked in insecure context */
    }
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Container */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center p-0 sm:p-4 pointer-events-none">
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xl mx-auto
            overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Create social post"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-stone-200 shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Create Social Post</h2>
              <p className="text-xs text-stone-500 mt-0.5">Generate an impact post for sharing</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body ───────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* (a) Platform selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                      ${platform === p
                        ? 'bg-haven-teal-600 text-white border-haven-teal-600'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* (b) Time period */}
            <div>
              <label htmlFor="cp-period" className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Time Period
              </label>
              <select
                id="cp-period"
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value as TimePeriod)}
                className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900
                  hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
              >
                {PERIOD_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* (c) Metric checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Include Metrics
              </label>

              {loading ? (
                <div className="py-6 text-center text-sm text-stone-400">Loading metrics…</div>
              ) : (
                <div className="max-h-52 overflow-y-auto rounded-lg border border-stone-200 divide-y divide-stone-100">
                  {/* Impact Snapshot */}
                  {snapshot && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Impact Snapshot</p>
                      {SNAPSHOT_FIELDS.map(f => {
                        const val = snapshot[f.key as keyof ImpactSnapshotDto] as number;
                        const k = `snapshot.${f.key}`;
                        return (
                          <label key={k} className="flex items-center gap-2.5 py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.has(k)}
                              onChange={() => toggleMetric(k)}
                              className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 accent-haven-teal-600
                                focus:ring-haven-teal-500"
                            />
                            <span className="text-sm text-stone-700">
                              {f.label}: <strong className="text-stone-900">{f.format(val)}</strong>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Fund Allocations */}
                  {allocations.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Fund Allocations</p>
                      {allocations.map(a => {
                        const k = `allocation.${a.programArea}`;
                        return (
                          <label key={k} className="flex items-center gap-2.5 py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.has(k)}
                              onChange={() => toggleMetric(k)}
                              className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 accent-haven-teal-600
                                focus:ring-haven-teal-500"
                            />
                            <span className="text-sm text-stone-700">
                              {a.programArea}: <strong className="text-stone-900">{a.percentOfFunds}%</strong> of funds
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Donation Impact Rates */}
                  {impactRates.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Donation Impact</p>
                      {impactRates.map(r => {
                        const k = `rate.${r.impactCategory}`;
                        return (
                          <label key={k} className="flex items-center gap-2.5 py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.has(k)}
                              onChange={() => toggleMetric(k)}
                              className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 accent-haven-teal-600
                                focus:ring-haven-teal-500"
                            />
                            <span className="text-sm text-stone-700">
                              {r.impactCategory}: <strong className="text-stone-900">{'\u20B1'}{r.costPerUnit.toLocaleString()}</strong> per {r.unitLabel}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* (d) Live preview */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Post Preview
              </label>
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 text-sm text-stone-700
                leading-relaxed whitespace-pre-wrap min-h-[120px]">
                {postText}
              </div>

              {/* Image placeholder */}
              <button
                type="button"
                className="mt-3 w-full border-2 border-dashed border-stone-300 rounded-lg p-3 text-center
                  text-stone-400 text-sm hover:border-stone-400 transition-colors cursor-default
                  flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                Attach image (coming soon)
              </button>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 shrink-0 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-300
                hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border
                  border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3a2.25 2.25 0 0 0-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.334a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg
                  bg-haven-teal-600 text-white hover:bg-haven-teal-700 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                {shared ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Shared!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    Share to {platform}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
