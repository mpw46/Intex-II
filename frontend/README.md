# Frontend — React + TypeScript + Vite + Tailwind

React 19 single-page application for Haven, the nonprofit safehouse management platform.

## Setup

```bash
npm install
npm run dev          # http://localhost:5173 with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

## Architecture

### Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| react / react-dom | ^19.2.4 | UI framework |
| react-router-dom | ^7.14.0 | Client-side routing |
| tailwindcss | ^4.2.2 | Utility-first CSS (v4 — CSS-based config) |
| @tailwindcss/vite | ^4.2.2 | Tailwind Vite integration |
| axios | ^1.14.0 | HTTP client for API calls |
| typescript | ~6.0.2 | Type checking (strict mode) |
| vite | ^8.0.4 | Build tool and dev server |

### Routing (React Router v7)

Router configured via `createBrowserRouter` in `src/main.tsx`:

**Public Layout** (`src/components/Layout.tsx`) — navbar + cookie consent + footer:
- `/` → `HomePage.tsx` — Landing page with hero, KPIs, mission features
- `/impact` → `DonorDashboardPage.tsx` — Donor-facing impact dashboard
- `/login` → `LoginPage.tsx` — Sign-in + registration forms
- `/privacy` → `PrivacyPage.tsx` — Full GDPR + Philippine DPA privacy policy

**Donor Portal** (needs new layout or route — **NOT BUILT YET**):
- `/donor` → `DonorPortalPage.tsx` — Authenticated donor: fake donation form + view own donation history

**Admin Layout** (`src/components/AdminLayout.tsx`) — collapsible sidebar + top bar:
- `/admin` → `AdminDashboardPage.tsx` — KPI cards, safehouse selector, 4 tabs
- `/admin/donors` → `DonorsContributionsPage.tsx` — Supporter + donation management
- `/admin/caseload` → `CaseloadPage.tsx` — Resident case management with filtering
- `/admin/process-recording` → `ProcessRecordingPage.tsx` — Counseling session docs
- `/admin/home-visitation` → `HomeVisitationPage.tsx` — **LIVE API** (full CRUD)
- `/admin/reports` → `ReportsPage.tsx` — Donation trends, outcomes, quarterly data

### File Structure

```
src/
├── main.tsx                         # Router config entry point
├── index.css                        # Tailwind v4 @import + @theme (custom palettes)
├── api/
│   ├── apiClient.ts                 # Axios instance (VITE_API_URL)
│   └── homeVisitationApi.ts         # HomeVisitation CRUD functions
├── types/
│   └── homeVisitation.ts            # Interfaces + constants
├── components/
│   ├── Layout.tsx                   # Public layout (navbar, cookie consent, footer)
│   └── AdminLayout.tsx              # Admin layout (sidebar, top bar, mobile drawer)
├── pages/
│   ├── HomePage.tsx                 # ~400 lines — hero, KPIs, mission, testimonials
│   ├── DonorDashboardPage.tsx       # ~650 lines — safehouse cards, outcomes, allocations
│   ├── LoginPage.tsx                # ~470 lines — sign-in + register with validation
│   ├── PrivacyPage.tsx              # ~430 lines — full privacy policy with TOC sidebar
│   └── admin/
│       ├── AdminDashboardPage.tsx   # ~1100 lines — 4 tabs, KPIs, safehouse filtering
│       ├── DonorsContributionsPage.tsx # ~800 lines — supporter + donation management
│       ├── CaseloadPage.tsx         # ~620 lines — resident profiles, filtering
│       ├── ProcessRecordingPage.tsx  # ~560 lines — session forms, history
│       ├── HomeVisitationPage.tsx    # ~790 lines — LIVE CRUD via API
│       └── ReportsPage.tsx          # ~480 lines — charts, outcomes, quarterly
├── App.tsx                          # Original Vite boilerplate (NOT imported)
└── App.css                          # Original boilerplate (NOT imported)
```

### API Integration Pattern

Each page uses **filler data** defined as typed constants at the top of the file. Each constant has a `TODO` comment indicating which API endpoint should replace it. Pattern:

```tsx
// TODO: Replace with GET /api/admin/dashboard-stats
const dashboardStats: DashboardStats = { /* filler */ };
```

When wiring to the API:
1. Import from `src/api/apiClient.ts` (Axios instance configured with `VITE_API_URL`)
2. Replace the filler constant with `useState` + `useEffect` fetch
3. The rest of the page (layouts, labels, components) works unchanged — interfaces match

**HomeVisitationPage is the reference implementation** — it's the only page fully wired to the backend API with create, read, update, delete operations.

### Environment Variables

| Variable | File | Value |
|----------|------|-------|
| `VITE_API_URL` | `.env.development` | Azure backend URL + `/api` |
| `VITE_API_URL` | `.env.production` | Azure backend URL + `/api` |

## Design System

### Tailwind CSS v4

No `tailwind.config.js` or `postcss.config.js` needed. Tailwind v4 uses `@theme` blocks in CSS:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-haven-teal-600: #1a8a6e;
  --color-haven-violet-500: #8547e8;
  /* ... full 50-950 scales */
}
```

### Color Palettes

- **Haven Teal** (50–950) — primary brand color, used for navbar, buttons, active states
- **Haven Violet** (50–950) — accent for public-facing pages
- **Stone** — neutrals (backgrounds, text, borders)

### Typography

- **Font:** Inter (300–800 weights, Google Fonts)
- Antialiased rendering, optimized legibility

### Accessibility

- Skip-to-content link in Layout
- `prefers-reduced-motion` respected (animations disabled)
- Focus-visible rings: 2px solid `#1fa882`
- Cookie consent banner with `role="dialog"` and `aria-live="polite"`
- Semantic HTML throughout (nav, main, aside, footer with aria-labels)

## What Still Needs Wiring

Every page except HomeVisitation uses filler data. Each has TODO comments marking what to fetch:

| Page | Key API Endpoints Needed |
|------|-------------------------|
| HomePage | `GET /api/public/impact/snapshot`, `GET /api/public/impact/featured-quote` |
| DonorDashboardPage | `GET /api/public/safehouses`, `GET /api/public/impact/yearly`, `/allocations`, `/highlights`, `/outcomes` |
| LoginPage | `POST /api/auth/login`, `POST /api/auth/register` |
| **DonorPortalPage** | **NOT BUILT** — needs `GET /api/donor/donations` (own history), `POST /api/donor/donate` (fake donation) |
| AdminDashboardPage | `GET /api/admin/dashboard-stats`, `GET /api/safehouses` |
| DonorsContributionsPage | Supporter CRUD, Donation CRUD |
| CaseloadPage | Resident CRUD with filtering |
| ProcessRecordingPage | ProcessRecording CRUD per resident |
| ReportsPage | `GET /api/reports/monthly-donations`, `/safehouse-outcomes`, `/program-outcomes`, `/annual-accomplishment` |

## TypeScript Configuration

- **Strict mode:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **Target:** ES2023, **JSX:** react-jsx, **Module resolution:** bundler
- Clean imports required — unused imports cause build failures

## ESLint

Flat config format with: JS recommended, TypeScript recommended, React Hooks, React Refresh. Browser globals, ECMAVersion 2020.
