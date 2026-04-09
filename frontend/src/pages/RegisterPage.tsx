import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser, updateMyProfile } from '../api/authAPI';

function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg ' +
    'text-sm text-stone-900 placeholder:text-stone-400 hover:border-stone-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent';

  const labelClass =
    'block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5';

  async function handleSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(email, password);
      await loginUser(email, password, false);

      // Save name/org to profile
      await updateMyProfile(
        accountType === 'individual'
          ? { firstName, lastName, supporterType: 'MonetaryDonor' }
          : { organizationName, supporterType: 'MonetaryDonor' }
      );

      navigate('/donor');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to register.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-xl border border-stone-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-stone-900 mb-1">Create account</h2>
        <p className="text-sm text-stone-500 mb-6">Register to connect with Haven as a supporter.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account type toggle */}
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

          {/* Name fields */}
          {accountType === 'individual' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={inputClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Santos"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="orgName">Organization Name</label>
              <input
                id="orgName"
                type="text"
                className={inputClass}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                placeholder="Helping Hands Foundation"
              />
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              placeholder="••••••••••••"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-800" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-5 py-2.5
              bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
              hover:bg-haven-teal-700 transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="text-haven-teal-600 hover:text-haven-teal-700 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
