import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDonations } from '../api/donationsApi';
import type { DonationDto } from '../types/donation';

function DonorDashboardPage() {
  const { authSession, isAuthenticated, isLoading } = useAuth();
  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    getDonations()
      .then(setDonations)
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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
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
        {/* Summary card */}
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

        {/* Donate CTA */}
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

        {/* Donation history */}
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
