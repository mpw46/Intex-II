import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const cookieConsentStorageKey = 'haven-cookie-consent';

type ConsentChoice = 'accepted' | 'declined' | null;

interface CookieConsentContextValue {
  consentChoice: ConsentChoice;
  hasResponded: boolean;
  acceptCookies: () => void;
  declineCookies: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextValue | undefined
>(undefined);

function readInitialConsentValue(): ConsentChoice {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(cookieConsentStorageKey);
  if (stored === 'accepted' || stored === 'declined') return stored;
  return null;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentChoice, setConsentChoice] = useState<ConsentChoice>(
    readInitialConsentValue
  );

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consentChoice,
      hasResponded: consentChoice !== null,
      acceptCookies() {
        window.localStorage.setItem(cookieConsentStorageKey, 'accepted');
        setConsentChoice('accepted');
      },
      declineCookies() {
        window.localStorage.setItem(cookieConsentStorageKey, 'declined');
        setConsentChoice('declined');
      },
      resetConsent() {
        window.localStorage.removeItem(cookieConsentStorageKey);
        setConsentChoice(null);
      },
    }),
    [consentChoice]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      'useCookieConsent must be used within a CookieConsentProvider.'
    );
  }

  return context;
}
