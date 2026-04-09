import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDonations } from '../api/donationsApi';
import { getImpactSnapshot } from '../api/publicImpactApi';
import { getMlDonorImpact } from '../api/mlApi';
import type { DonationDto } from '../types/donation';
import type { ImpactSnapshotDto } from '../types/publicImpact';
import type { MlDonorImpactDto } from '../types/ml';

const TIERS = [
  { name: 'Friend',   min: 0,     next: 5000   },
  { name: 'Champion', min: 5000,  next: 15000  },
  { name: 'Guardian', min: 15000, next: 50000  },
  { name: 'Hero',     min: 50000, next: null   },
];

function DonorDashboardPage() {
  const { authSession, isAuthenticated, isLoading } = useAuth();
  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [snapshot, setSnapshot] = useState<ImpactSnapshotDto | null>(null);
  const [donorImpact, setDonorImpact] = useState<MlDonorImpactDto[]>([]);

  useEffect(() => {
    getImpactSnapshot().then(setSnapshot).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      getDonations().catch(() => [] as DonationDto[]),
      getMlDonorImpact().catch(() => [] as MlDonorImpactDto[]),
    ])
      .then(([donationData, impactData]) => {
        setDonations(donationData);
        setDonorImpact(impactData);
      })
      .catch(() => setFetchError('Unable to load your donation history.'))
      .finally(() => setFetching(false));
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-haven-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const totalDonated = donations.reduce((sum, d) => {
    const amt = parseFloat(d.amount ?? '0');
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Tier logic
  const currentTier = [...TIERS].reverse().find(t => totalDonated >= t.min) ?? TIERS[0];
  const tierProgress = currentTier.next
    ? Math.min(100, ((totalDonated - currentTier.min) / (currentTier.next - currentTier.min)) * 100)
    : 100;

  // Monthly chart data
  const monthlyData = donations
    .filter(d => d.donationDate && d.amount)
    .reduce((acc, d) => {
      const month = d.donationDate!.slice(0, 7);
      const amt = parseFloat(d.amount!) || 0;
      const existing = acc.find(m => m.month === month);
      if (existing) existing.amount += amt;
      else acc.push({ month, amount: amt });
      return acc;
    }, [] as { month: string; amount: number }[])
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(d => ({
      ...d,
      label: new Date(d.month + '-01').toLocaleDateString('en-PH', { month: 'short', year: '2-digit' }),
    }));

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <section className="bg-haven-teal-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-2">
            Donor Portal
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">My Donations</h1>
          <p className="text-sm text-white/60">{authSession.email}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-8">

        {/* ── Summary cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
              Total Donated
            </p>
            <p className="text-3xl font-bold text-haven-teal-700">
              ₱{totalDonated.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
              Donations Made
            </p>
            <p className="text-3xl font-bold text-haven-teal-700">{donations.length}</p>
          </div>
        </div>

        {/* ── Donor Milestone / Tier ──────────────────────────────────── */}
        {!fetching && donations.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Donor Milestone
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-haven-teal-50 text-haven-teal-700">
                {currentTier.name}
              </span>
              {currentTier.next && (
                <span className="text-sm text-stone-500">
                  ₱{(currentTier.next - totalDonated).toLocaleString('en-PH', { minimumFractionDigits: 0 })} away from{' '}
                  <span className="font-medium text-stone-700">
                    {TIERS[TIERS.indexOf(currentTier) + 1]?.name}
                  </span>
                </span>
              )}
              {!currentTier.next && (
                <span className="text-sm text-stone-500">You've reached the highest tier — thank you!</span>
              )}
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div
                className="bg-haven-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-400">
              <span>{currentTier.name} (₱{currentTier.min.toLocaleString()})</span>
              {currentTier.next && (
                <span>{TIERS[TIERS.indexOf(currentTier) + 1]?.name} (₱{currentTier.next.toLocaleString()})</span>
              )}
            </div>
          </div>
        )}

        {/* ── Donation History Chart ──────────────────────────────────── */}
        {!fetching && monthlyData.length > 1 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
              Donation History
            </p>
            <p className="text-lg font-bold text-stone-900 mb-6">Your giving over time</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barCategoryGap="35%">
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => {
                    const num = typeof value === 'number' ? value : parseFloat(String(value));
                    return [`₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, 'Donated'];
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  cursor={{ fill: '#f5f5f4' }}
                />
                <Bar dataKey="amount" fill="#1a8a6e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}


        {/* ── ML — Predicted Program Impact ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-lg font-bold text-stone-900">Predicted Program Impact</p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-haven-teal-700 bg-haven-teal-50 border-haven-teal-200">
              ML Model
            </span>
          </div>
          <p className="text-xs text-stone-400 mb-5">
            Based on your giving history, here is how contributions like yours are typically allocated across programs.
          </p>
          {donorImpact.length === 0 ? (
            <p className="text-sm text-stone-400">No prediction available yet — model runs nightly.</p>
          ) : (
            <div className="space-y-4">
              {donorImpact.map(d => (
                <div key={d.programArea}>
                  <div className="flex justify-between text-xs text-stone-600 mb-1">
                    <span className="font-medium">{d.programArea.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-haven-teal-700">{d.predictedPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div
                      className="bg-haven-teal-500 h-2 rounded-full"
                      style={{ width: `${d.predictedPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Your Impact in Numbers ──────────────────────────────────── */}
        {snapshot && (
          <div className="bg-haven-teal-50 rounded-xl border border-haven-teal-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-haven-teal-600 mb-1">
              Collective Impact
            </p>
            <p className="text-lg font-bold text-stone-900 mb-1">Your generosity is part of this</p>
            <p className="text-sm text-stone-500 mb-6">
              Together with donors like you, Haven has made a real difference.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-haven-teal-700">
                  {snapshot.totalGirlsServed.toLocaleString()}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">Girls served</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-haven-teal-700">
                  {snapshot.activeResidents}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">Active residents</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-haven-teal-700">
                  {snapshot.reintegrationSuccessRate}%
                </p>
                <p className="text-xs text-stone-500 mt-0.5">Reintegration rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-haven-teal-700">
                  {snapshot.activeSafehouses}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">Active safehouses</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Donate CTA ─────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
                       text-sm font-semibold rounded-lg hover:bg-haven-teal-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Make a Donation
          </Link>
        </div>

        {/* ── Donation history table ──────────────────────────────────── */}
        {fetchError && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
            <p className="text-sm text-rose-700">{fetchError}</p>
          </div>
        )}

        {fetching ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-haven-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
            <p className="text-stone-500 mb-4">You have not made any donations yet.</p>
            <Link
              to="/donate"
              className="inline-flex items-center px-5 py-2.5 bg-haven-teal-600 text-white
                         text-sm font-semibold rounded-lg hover:bg-haven-teal-700 transition-colors"
            >
              Make your first donation
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="text-sm font-semibold text-stone-700">Donation History</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Amount (PHP)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Frequency</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {donations.map((d) => (
                  <tr key={d.donationId} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 text-stone-700 whitespace-nowrap">
                      {d.donationDate ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-700">{d.donationType ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-stone-900 whitespace-nowrap">
                      {d.amount
                        ? `₱${parseFloat(d.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                        ${d.isRecurring === 'True'
                          ? 'bg-haven-teal-50 text-haven-teal-700'
                          : 'bg-stone-100 text-stone-600'}`}>
                        {d.isRecurring === 'True' ? 'Monthly' : 'One-time'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden md:table-cell max-w-xs truncate">
                      {d.notes ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default DonorDashboardPage;
