import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createDonation } from '../api/donationApi';
import { useAuth } from '../context/AuthContext';
import DonationImpactCards, { SAMPLE_RATES } from './DonationImpactCards';
import type { DonationImpactRate } from './DonationImpactCards';
import { getDonationImpactRates } from '../api/publicImpactApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: Props) {
  const { authSession, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [impactRates, setImpactRates] = useState<DonationImpactRate[]>(SAMPLE_RATES);

  useEffect(() => {
    getDonationImpactRates()
      .then((rates) =>
        setImpactRates(
          rates.map((r) => ({
            impactCategory: r.impactCategory,
            costPerUnit: r.costPerUnit,
            unitLabel: r.unitLabel,
          }))
        )
      )
      .catch(() => {
        // Keep SAMPLE_RATES as fallback
      });
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setIsRecurring(false);
      setNotes('');
      setSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Make a donation"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg pointer-events-auto
                     max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-0.5">
                Support Our Mission
              </p>
              <h2 className="text-lg font-bold text-stone-900">Make a Donation</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-stone-400
                         hover:text-stone-600 hover:bg-stone-100 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Not logged in */}
            {!isAuthenticated && (
              <div className="text-center py-8">
                <p className="text-stone-600 mb-6 text-sm">Please sign in before making a donation.</p>
                <Link
                  to="/login?next=/donate"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-3
                             bg-haven-teal-600 text-white font-semibold rounded-lg
                             hover:bg-haven-teal-700 transition-colors text-sm"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Success state */}
            {isAuthenticated && submitted && (
              <div className="text-center py-6">
                <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-emerald-600">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Thank you!</h3>
                <p className="text-sm text-stone-600 mb-6">
                  Your donation has been recorded. Every contribution brings us closer to
                  providing safety and healing to girls in need.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/donor"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-5 py-2.5
                               bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                               hover:bg-haven-teal-700 transition-colors"
                  >
                    View My Donations
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setAmount('');
                      setNotes('');
                    }}
                    className="inline-flex items-center justify-center px-5 py-2.5
                               bg-white text-stone-700 text-sm font-medium rounded-lg
                               border border-stone-300 hover:bg-stone-50 transition-colors"
                  >
                    Donate Again
                  </button>
                </div>
              </div>
            )}

            {/* Donation form */}
            {isAuthenticated && !submitted && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <div>
                  <label htmlFor="modal-amount" className="block text-sm font-semibold text-stone-700 mb-2">
                    Amount (PHP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">₱</span>
                    <input
                      id="modal-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-9 pr-4 py-3 rounded-lg border border-stone-300 text-stone-900
                                 focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['500', '1000', '2500', '5000'].map(preset => (
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
                  <DonationImpactCards amount={parseFloat(amount) || 0} rates={impactRates} />
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
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform
                      ${isRecurring ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-stone-700">
                    {isRecurring ? 'Monthly recurring donation' : 'One-time donation'}
                  </span>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="modal-notes" className="block text-sm font-semibold text-stone-700 mb-2">
                    Notes <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="modal-notes"
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
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

                {/* Donating-as */}
                <div className="flex items-center px-4 py-3 bg-stone-100 rounded-lg text-sm text-stone-600">
                  Donating as <span className="font-medium text-stone-900 ml-1">{authSession.email}</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !amount}
                  className="w-full py-3.5 bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                             hover:bg-haven-teal-700 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
                >
                  {submitting ? 'Processing...' : 'Complete Donation'}
                </button>

                <p className="text-xs text-stone-400 text-center">
                  All donations are processed in Philippine Pesos (PHP).
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
