import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthMode = 'signin' | 'register';

interface SignInForm {
  email: string;
  password: string;
}

interface RegisterForm {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// Filler data — replace with real API calls
// ---------------------------------------------------------------------------

// Left-panel stats — TODO: Replace with GET /api/public/impact-snapshot
const panelStats = [
  { label: 'Girls Supported', value: '247' },
  { label: 'Reintegrated', value: '89' },
  { label: 'Active Safehouses', value: '4' },
  { label: 'Partner Organizations', value: '12' },
];

// ---------------------------------------------------------------------------
// Icon helpers (inline SVG — no icon library dependency)
// ---------------------------------------------------------------------------

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="h-5 w-5 shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');

  // Sign-in state
  const [signIn, setSignIn] = useState<SignInForm>({ email: '', password: '' });
  const [showSignInPw, setShowSignInPw] = useState(false);

  // Register state
  const [register, setRegister] = useState<RegisterForm>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
  }

  async function handleSignIn(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Replace with POST /api/auth/login
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: signIn.email, password: signIn.password }),
      // });
      // if (!res.ok) throw new Error('Invalid email or password.');
      // const { role } = await res.json();
      // navigate(role === 'Admin' ? '/admin' : '/impact');

      // Filler — remove when API is connected
      await new Promise(r => setTimeout(r, 800));
      void navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);

    if (register.password !== register.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (register.password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with POST /api/auth/register
      // const res = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     displayName: register.displayName,
      //     email: register.email,
      //     password: register.password,
      //   }),
      // });
      // if (!res.ok) throw new Error('Registration failed. Email may already be in use.');
      // navigate('/impact');

      // Filler — remove when API is connected
      await new Promise(r => setTimeout(r, 800));
      void navigate('/impact');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen flex">
      {/* ------------------------------------------------------------------ */}
      {/* Left panel — brand, hidden on mobile                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-1/2 bg-haven-teal-900 flex-col justify-center p-16 text-white gap-12">
        {/* Quote */}
        <p className="text-3xl font-light leading-relaxed text-white/90">
          "Every girl deserves safety, healing, and the chance to rebuild her life."
        </p>

        {/* Glass KPI grid */}
        <div className="grid grid-cols-2 gap-5">
          {panelStats.map(stat => (
            <div key={stat.label}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <p className="text-4xl font-bold tabular-nums mb-1">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-white/40">
          Staff portal — authorised access only.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right panel — form                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 pt-24 sm:px-12 lg:pt-12 lg:px-16 bg-white">
        {/* Mobile wordmark */}
        <div className="lg:hidden mb-10">
          <span className="text-xl font-bold tracking-tight text-stone-900">Haven</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-stone-500 mb-8">
            {mode === 'signin'
              ? 'Sign in to access the Haven staff portal.'
              : 'Register to connect with Haven as a supporter.'}
          </p>

          {/* Mode tabs */}
          <div className="flex rounded-lg border border-stone-200 p-1 mb-8">
            {(['signin', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors duration-150
                  ${mode === m
                    ? 'bg-haven-teal-600 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                {m === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error alert */}
          {error && (
            <div role="alert"
              className="flex items-start gap-3 p-4 mb-6 bg-rose-50 border border-rose-200 rounded-lg transition-none">
              <AlertIcon />
              <p className="text-sm text-rose-800">{error}</p>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Sign-in form                                                      */}
          {/* ---------------------------------------------------------------- */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="signin-email"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signIn.email}
                  onChange={e => setSignIn(s => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg
                    text-sm text-stone-900 placeholder:text-stone-400
                    hover:border-stone-400
                    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signin-password"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showSignInPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={signIn.password}
                    onChange={e => setSignIn(s => ({ ...s, password: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-stone-300 rounded-lg
                      text-sm text-stone-900 placeholder:text-stone-400
                      hover:border-stone-400
                      focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPw(v => !v)}
                    aria-label={showSignInPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400
                      hover:text-stone-600 transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showSignInPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5
                  bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                  transition-colors duration-150 hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Register form                                                     */}
          {/* ---------------------------------------------------------------- */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} noValidate className="space-y-5">
              {/* Display name */}
              <div>
                <label htmlFor="reg-name"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={register.displayName}
                  onChange={e => setRegister(s => ({ ...s, displayName: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg
                    text-sm text-stone-900 placeholder:text-stone-400
                    hover:border-stone-400
                    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                  placeholder="Maria Santos"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={register.email}
                  onChange={e => setRegister(s => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg
                    text-sm text-stone-900 placeholder:text-stone-400
                    hover:border-stone-400
                    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Password
                  <span className="ml-1 font-normal normal-case text-stone-400">
                    (min. 12 characters)
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showRegPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={12}
                    value={register.password}
                    onChange={e => setRegister(s => ({ ...s, password: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-stone-300 rounded-lg
                      text-sm text-stone-900 placeholder:text-stone-400
                      hover:border-stone-400
                      focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw(v => !v)}
                    aria-label={showRegPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400
                      hover:text-stone-600 transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showRegPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="reg-confirm"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showRegConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={register.confirmPassword}
                    onChange={e => setRegister(s => ({ ...s, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-stone-300 rounded-lg
                      text-sm text-stone-900 placeholder:text-stone-400
                      hover:border-stone-400
                      focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirm(v => !v)}
                    aria-label={showRegConfirm ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400
                      hover:text-stone-600 transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showRegConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5
                  bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
                  transition-colors duration-150 hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-xs text-stone-500 text-center">
                By registering you agree to our{' '}
                <a href="/privacy"
                  className="text-haven-teal-600 hover:text-haven-teal-700 underline underline-offset-2">
                  Privacy Policy
                </a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
