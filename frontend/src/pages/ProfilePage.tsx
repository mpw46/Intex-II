import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../api/authAPI';
import type { DonorProfileDto } from '../types/profile';

const SUPPORTER_TYPES = [
  { value: 'MonetaryDonor', label: 'Monetary Donor' },
  { value: 'InKindDonor', label: 'In-Kind Donor' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'SkillsContributor', label: 'Skills Contributor' },
  { value: 'SocialMediaAdvocate', label: 'Social Media Advocate' },
  { value: 'PartnerOrganization', label: 'Partner Organization' },
];

const RELATIONSHIP_TYPES = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Church', label: 'Church' },
  { value: 'Company', label: 'Company' },
  { value: 'NGO', label: 'NGO / Nonprofit' },
  { value: 'Government', label: 'Government Agency' },
  { value: 'Other', label: 'Other' },
];

function ProfilePage() {
  const navigate = useNavigate();
  const { authSession, isAuthenticated } = useAuth();

  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual');
  const [form, setForm] = useState<DonorProfileDto>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    getMyProfile()
      .then((profile) => {
        setForm(profile);
        if (profile.organizationName) {
          setAccountType('organization');
        }
      })
      .catch(() => setError('Unable to load profile.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  function set(field: keyof DonorProfileDto, value: string) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload: DonorProfileDto = {
        ...form,
        // Clear the field that doesn't apply to the selected account type
        firstName: accountType === 'individual' ? form.firstName : undefined,
        lastName: accountType === 'individual' ? form.lastName : undefined,
        organizationName: accountType === 'organization' ? form.organizationName : undefined,
      };
      const updated = await updateMyProfile(payload);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 ' +
    'placeholder:text-stone-400 hover:border-stone-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent';

  const labelClass = 'block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500 text-sm">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-haven-teal-600 mb-1">
            Account Settings
          </p>
          <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
          <p className="text-sm text-stone-500 mt-1">
            Keep your supporter information up to date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email — read only */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-4">Account</h2>
            <div>
              <label className={labelClass}>Email</label>
              <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-500">
                {authSession.email ?? form.email ?? '—'}
              </div>
            </div>
          </div>

          {/* Account type toggle */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-stone-700">Supporter Details</h2>

            <div>
              <label className={labelClass}>Account Type</label>
              <div className="flex rounded-lg border border-stone-300 overflow-hidden text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setAccountType('individual')}
                  className={`flex-1 py-2.5 transition-colors ${
                    accountType === 'individual'
                      ? 'bg-haven-teal-600 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('organization')}
                  className={`flex-1 py-2.5 border-l border-stone-300 transition-colors ${
                    accountType === 'organization'
                      ? 'bg-haven-teal-600 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Organization
                </button>
              </div>
            </div>

            {accountType === 'individual' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className={inputClass}
                    value={form.firstName ?? ''}
                    onChange={(e) => set('firstName', e.target.value)}
                    required
                    placeholder="Maria"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className={inputClass}
                    value={form.lastName ?? ''}
                    onChange={(e) => set('lastName', e.target.value)}
                    required
                    placeholder="Santos"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="orgName">Organization Name</label>
                  <input
                    id="orgName"
                    type="text"
                    className={inputClass}
                    value={form.organizationName ?? ''}
                    onChange={(e) => set('organizationName', e.target.value)}
                    required
                    placeholder="Helping Hands Foundation"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="relType">Organization Type</label>
                  <select
                    id="relType"
                    className={inputClass}
                    value={form.relationshipType ?? ''}
                    onChange={(e) => set('relationshipType', e.target.value)}
                  >
                    <option value="">Select type…</option>
                    {RELATIONSHIP_TYPES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="displayName">
                Display Name <span className="text-stone-400 font-normal normal-case">(optional)</span>
              </label>
              <input
                id="displayName"
                type="text"
                className={inputClass}
                value={form.displayName ?? ''}
                onChange={(e) => set('displayName', e.target.value)}
                placeholder="How you'd like your name to appear"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="supporterType">Supporter Type</label>
              <select
                id="supporterType"
                className={inputClass}
                value={form.supporterType ?? ''}
                onChange={(e) => set('supporterType', e.target.value)}
              >
                <option value="">Select type…</option>
                {SUPPORTER_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-stone-700">Contact</h2>

            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                value={form.phone ?? ''}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+63 912 345 6789"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  className={inputClass}
                  value={form.country ?? ''}
                  onChange={(e) => set('country', e.target.value)}
                  placeholder="Philippines"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="region">Region</label>
                <input
                  id="region"
                  type="text"
                  className={inputClass}
                  value={form.region ?? ''}
                  onChange={(e) => set('region', e.target.value)}
                  placeholder="Luzon"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <p className="text-sm text-emerald-700">Profile saved successfully.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                       hover:bg-haven-teal-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
