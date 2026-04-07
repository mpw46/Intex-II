import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getSafehouses,
  createDonation,
  createDonationAllocation,
} from '../api/donationApi';
import type { SafehouseOption } from '../api/donationApi';

const DONATION_TYPES = ['Monetary', 'InKind', 'Time', 'Skills'] as const;
const PROGRAM_AREAS = ['Direct Services', 'Counseling', 'Education', 'Operations'] as const;

function DonatePage() {
  const [safehouses, setSafehouses] = useState<SafehouseOption[]>([]);

  const [donationType, setDonationType] = useState<string>('Monetary');
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [safehouseId, setSafehouseId] = useState<string>('');
  const [programArea, setProgramArea] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [notes, setNotes] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSafehouses()
      .then(setSafehouses)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const donation = await createDonation({
        donationType,
        donationDate: new Date().toISOString().split('T')[0],
        isRecurring: isRecurring ? 'True' : 'False',
        campaignName: campaignName || undefined,
        channelSource: 'Website',
        currencyCode: 'PHP',
        amount: donationType === 'Monetary' ? amount : undefined,
        notes: [
          donorName ? `Donor: ${donorName}` : '',
          donorEmail ? `Email: ${donorEmail}` : '',
          notes,
        ].filter(Boolean).join(' | ') || undefined,
      });

      if (programArea && donation.donationId) {
        await createDonationAllocation({
          donationId: donation.donationId,
          safehouseId: safehouseId ? parseInt(safehouseId) : undefined,
          programArea,
          amountAllocated: donationType === 'Monetary' && amount ? parseFloat(amount) : undefined,
          allocationDate: new Date().toISOString().split('T')[0],
        });
      }

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
            Your {donationType.toLowerCase()} donation has been recorded. Every contribution
            brings us closer to providing safety, healing, and hope to girls in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/impact"
              className="inline-flex items-center justify-center px-6 py-3
                         bg-haven-teal-600 text-white font-semibold rounded-lg
                         hover:bg-haven-teal-700 transition-colors"
            >
              View Our Impact
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setAmount('');
                setNotes('');
                setCampaignName('');
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

      {/* ── Form ────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Donation type */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-3">
                Donation Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DONATION_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDonationType(type)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-colors
                      ${donationType === type
                        ? 'bg-haven-teal-600 text-white border-haven-teal-600'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-haven-teal-400'
                      }`}
                  >
                    {type === 'InKind' ? 'In-Kind' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount (monetary only) */}
            {donationType === 'Monetary' && (
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
            )}

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

            {/* Safehouse + Program area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="safehouse" className="block text-sm font-semibold text-stone-700 mb-2">
                  Support a Safehouse <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <select
                  id="safehouse"
                  value={safehouseId}
                  onChange={(e) => setSafehouseId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900 bg-white
                             focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                >
                  <option value="">Any safehouse</option>
                  {safehouses.map((sh) => (
                    <option key={sh.safehouseId} value={sh.safehouseId}>
                      {sh.name} — {sh.region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="programArea" className="block text-sm font-semibold text-stone-700 mb-2">
                  Program Area <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <select
                  id="programArea"
                  value={programArea}
                  onChange={(e) => setProgramArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900 bg-white
                             focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                >
                  <option value="">Where needed most</option>
                  {PROGRAM_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campaign */}
            <div>
              <label htmlFor="campaign" className="block text-sm font-semibold text-stone-700 mb-2">
                Campaign <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                id="campaign"
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Holiday Drive 2026"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900
                           focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
              />
            </div>

            {/* Donor info */}
            <div className="border-t border-stone-200 pt-8">
              <p className="text-sm font-semibold text-stone-700 mb-4">Your Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donorName" className="block text-xs font-medium text-stone-500 mb-1.5">
                    Name
                  </label>
                  <input
                    id="donorName"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900
                               focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="donorEmail" className="block text-xs font-medium text-stone-500 mb-1.5">
                    Email
                  </label>
                  <input
                    id="donorEmail"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 text-stone-900
                               focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-haven-teal-500"
                  />
                </div>
              </div>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || (donationType === 'Monetary' && !amount)}
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
        </div>
      </section>
    </div>
  );
}

export default DonatePage;
