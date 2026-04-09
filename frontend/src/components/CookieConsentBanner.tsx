import { useCookieConsent } from '../context/CookieConsentContext';

function CookieConsentBanner() {
  const { hasAcknowledgedConsent, acknowledgeConsent } = useCookieConsent();

  if (hasAcknowledgedConsent) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-stone-900 border-t border-stone-700
                 px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-8"
    >
      <p className="text-sm text-stone-300 mb-4 sm:mb-0">
        We use cookies to improve your experience and understand how our site is used.
        Non-essential analytics cookies are only set with your consent.{' '}
        <a
          href="/privacy"
          className="text-haven-teal-400 underline underline-offset-2 hover:text-haven-teal-300 transition-colors duration-150"
        >
          Privacy Policy
        </a>
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={acknowledgeConsent}
          className="inline-flex items-center justify-center px-4 py-2
            bg-transparent text-stone-400 text-sm font-medium rounded-lg
            border border-stone-600 transition-colors duration-150
            hover:bg-stone-800 hover:text-stone-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-stone-900"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={acknowledgeConsent}
          className="inline-flex items-center justify-center px-4 py-2
            bg-haven-teal-600 text-white text-sm font-semibold rounded-lg
            transition-colors duration-150 hover:bg-haven-teal-700
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-stone-900"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
