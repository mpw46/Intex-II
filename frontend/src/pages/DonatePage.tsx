import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { createDonation } from '../api/donationApi';
import { useAuth } from '../context/AuthContext';

function DonatePage() {
  const { authSession, isAuthenticated, isLoading } = useAuth();
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-haven-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnTo: '/donate' }} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createDonation({
        donationType: 'Monetary',
        donationDate: new Date().toISOString().split('T')[0],
        isRecurring: isRecurring ? 'True' : 'False',
        channelSource: 'Website',
        currencyCode: 'PHP',
        amount,
        notes: notes || undefined,
      });

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-emerald-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-3">Thank you!</h1>
          <p className="text-base text-stone-600 leading-relaxed mb-8">
            Your donation has been recorded. Every contribution
            brings us closer to providing safety, healing, and hope to girls in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/donor"
              className="inline-flex items-center justify-center px-6 py-3
                         bg-haven-teal-600 text-white font-semibold rounded-lg
                         hover:bg-haven-teal-700 transition-colors"
            >
              View My Donations
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setAmount('');
                setNotes('');
              }}
              className="inline-flex items-center justify-center px-6 py-3
                         bg-white text-stone-700 font-medium rounded-lg border border-stone-300
                         hover:bg-stone-50 transition-colors"
            >
              Make Another Donation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="bg-haven-teal-900 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
            Support Our Mission
          </p>
          <h1 className="text-4xl font-bold text-white leading-snug tracking-tight mb-4">
            Give the gift of safety and healing
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            Your donation funds shelter, counseling, education, and the dedicated staff who
            walk alongside every girl on her journey to recovery.
          </p>
        </div>
      </section>

      {/* ── Form / Auth Gate ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 md:px-12">

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 rounded-full border-2 border-haven-teal-600 border-t-transparent animate-spin" />
            </div>
          )}

          {/* Not logged in — prompt to sign in */}
          {!isLoading && !isAuthenticated && (
            <div className="text-center py-16">
              <div className="h-14 w-14 bg-haven-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                  strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-haven-teal-600">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">Sign in to donate</h2>
              <p className="text-sm text-stone-500 mb-8 max-w-xs mx-auto">
                Please sign in to your account before making a donation.
              </p>
              <Link
                to="/login?next=/donate"
                className="inline-flex items-center justify-center px-6 py-3
                           bg-haven-teal-600 text-white font-semibold rounded-lg
                           hover:bg-haven-teal-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Logged in — show donation form */}
          {!isLoading && isAuthenticated && (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-stone-700 mb-2">
                  Amount (PHP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">
                    ₱
                  </span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-stone-300 text-stone-900
                               focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                  />
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2 mt-3">
                  {['500', '1000', '2500', '5000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors
                        ${amount === preset
                          ? 'bg-haven-teal-50 text-haven-teal-700 border-haven-teal-300'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      ₱{parseInt(preset).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isRecurring}
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${isRecurring ? 'bg-haven-teal-600' : 'bg-stone-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform
                      ${isRecurring ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <span className="text-sm text-stone-700">
                  {isRecurring ? 'Monthly recurring donation' : 'One-time donation'}
                </span>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-stone-700 mb-2">
                  Notes <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any message you'd like to include..."
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900 resize-none
                             focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              {/* Donating-as banner */}
              <div className="flex items-center justify-between px-4 py-3 bg-stone-100 rounded-lg text-sm text-stone-600">
                <span>
                  Donating as <span className="font-medium text-stone-900">{authSession.email}</span>
                </span>
                <Link to="/logout" className="text-haven-teal-600 hover:text-haven-teal-700 font-medium transition-colors">
                  Not you? Log out
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !amount}
                className="w-full py-4 bg-haven-teal-600 text-white text-base font-semibold rounded-lg
                           hover:bg-haven-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                {submitting ? 'Processing...' : 'Complete Donation'}
              </button>

              <p className="text-xs text-stone-400 text-center">
                All donations are processed in Philippine Pesos (PHP).
                You will receive a confirmation at the email address provided.
              </p>
            </form>
          )}


        </div>
      </section>
    </div>
  );
}

export default DonatePage;
