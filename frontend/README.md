# Frontend — React + TypeScript + Vite

React 19 single-page application for the Intex-II nonprofit safehouse management platform.

## Setup

```bash
npm install
npm run dev          # Dev server at http://localhost:5173 with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build locally
```

## Architecture

### Routing (React Router v7)

The app uses `createBrowserRouter` in `src/main.tsx` with two layout branches:

**Public Layout** (`src/components/Layout.tsx`) — top navbar + footer:
- `/` → `HomePage.tsx` — Landing page
- `/impact` → `DonorDashboardPage.tsx` — Donor-facing impact dashboard
- `/login` → `LoginPage.tsx` — Authentication
- `/privacy` → `PrivacyPage.tsx` — Privacy policy

**Admin Layout** (`src/components/AdminLayout.tsx`) — sidebar navigation:
- `/admin` → `AdminDashboardPage.tsx` — KPIs and command center
- `/admin/donors` → `DonorsContributionsPage.tsx` — Supporter management
- `/admin/caseload` → `CaseloadPage.tsx` — Case management
- `/admin/process-recording` → `ProcessRecordingPage.tsx` — Counseling sessions
- `/admin/home-visitation` → `HomeVisitationPage.tsx` — Field visits and case conferences
- `/admin/reports` → `ReportsPage.tsx` — Analytics and trends

### File Structure

```
src/
├── main.tsx                    # Entry point — router config
├── components/
│   ├── Layout.tsx              # Public layout (navbar + Outlet + footer)
│   └── AdminLayout.tsx         # Admin layout (sidebar + Outlet)
├── pages/
│   ├── HomePage.tsx
│   ├── DonorDashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── PrivacyPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── DonorsContributionsPage.tsx
│       ├── CaseloadPage.tsx
│       ├── ProcessRecordingPage.tsx
│       ├── HomeVisitationPage.tsx
│       └── ReportsPage.tsx
├── App.tsx                     # Original Vite boilerplate (not imported)
├── App.css                     # Original boilerplate styles
└── index.css                   # Global styles
```

### Current State

All pages are **placeholder components** with descriptions and planned feature lists. Each page is ready for a team member to pick up and implement independently.

## Design System

- **Primary color:** `#0f4c5c` (dark teal) — used in navbar, sidebar, footer
- **Accent color:** `#e8b931` (gold) — used for active links, branding, highlights
- **Design reference:** See `admin-dashboard-mockup.jsx` in repo root for the admin dashboard mockup with KPI cards, safehouse filtering, and tabbed content

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI framework |
| react-dom | ^19.2.4 | DOM rendering |
| react-router-dom | ^7.14.0 | Client-side routing |
| typescript | ~6.0.2 | Type checking |
| vite | ^8.0.4 | Build tool and dev server |
| @vitejs/plugin-react | ^6.0.1 | React Fast Refresh for Vite |

## TypeScript Configuration

- **Strict mode enabled**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **Target:** ES2023
- **JSX:** react-jsx
- **Module resolution:** bundler

## What Needs to Be Built

### Per Page (see each page component for detailed feature lists)

- **HomePage**: Hero section, mission statement, safehouse overview, donation CTAs, impact stats
- **DonorDashboardPage**: Aggregated anonymized charts/metrics showing organizational impact
- **LoginPage**: Auth forms (login/register), ASP.NET Identity integration, role-based redirect
- **PrivacyPage**: Full GDPR privacy policy content, functional cookie consent banner
- **AdminDashboardPage**: KPI cards, safehouse filter, case conference table, at-risk alerts (see mockup)
- **DonorsContributionsPage**: Supporter CRUD, contribution tracking across all types, allocation views
- **CaseloadPage**: Resident profiles CRUD, demographic fields, case categories, filtering/search
- **ProcessRecordingPage**: Counseling session forms, chronological history per resident
- **HomeVisitationPage**: Visit logging forms, case conference scheduling and history
- **ReportsPage**: Donation trends, outcome metrics, safehouse comparisons, Annual Accomplishment Report

### Cross-Cutting Concerns

- Connect to ASP.NET Core backend API (currently at localhost:5063)
- Implement authentication flow (JWT tokens from backend)
- Add route guards for admin pages (redirect to /login if unauthenticated)
- Cookie consent banner (GDPR-compliant, fully functional)
- Responsive design for desktop and mobile
- Lighthouse accessibility score ≥ 90% on every page
- Content-Security-Policy compliance (avoid inline scripts where possible)

## Expanding ESLint (Optional)

For type-aware lint rules, update `eslint.config.js`:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or tseslint.configs.strictTypeChecked for stricter rules
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
