# CLAUDE.md — AI Context for Intex-II (Haven)

## What Is This Project?

**Haven** is a full-stack web application for a US-based 501(c)(3) nonprofit that operates safehouses for girls who are survivors of sexual abuse or sex trafficking in the Philippines. The organization contracts with in-country partners to provide safehouses and rehabilitation services, funded by local and international donors.

This is a BYU capstone project (INTEX) spanning IS 401 (Project Management), IS 413 (Enterprise App Development), IS 414 (Security), and IS 455 (Machine Learning).

**Deadline: Friday, April 10, 2026 at 10:00 AM** (presentations begin at 12:00 PM).

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite | React 19.2, TS 6.0, Vite 8.0 |
| Routing | React Router | v7.14 |
| Styling | Tailwind CSS (v4, CSS-based config) | 4.2.2 |
| HTTP Client | Axios | 1.14.0 |
| Backend | ASP.NET Core / C# (.NET 10) | 10.0 |
| ORM | Entity Framework Core | 10.0.5 |
| Database | Azure SQL Server | via EF Core SqlServer provider |
| Deployment | Microsoft Azure | App Service (backend) + Static Web Apps (frontend) |

## Repository Structure

```
Intex-II/
├── backend/
│   └── Intex2.API/
│       ├── Intex2.API.slnx
│       └── Intex2.API/
│           ├── Program.cs                     # App entry — EF Core, CORS, middleware
│           ├── Intex2.API.csproj              # .NET 10 + EF Core + SqlServer
│           ├── Controllers/
│           │   ├── HomeVisitationController.cs # Full CRUD with filtering
│           │   ├── ResidentsController.cs      # GET all with projection
│           │   └── WeatherForecastController.cs# Template (unused)
│           ├── DTOs/
│           │   └── HomeVisitationDto.cs        # Create/Update DTOs
│           ├── Data/
│           │   ├── Intex2104Context.cs         # DbContext — 27 DbSets
│           │   └── [18 entity model classes]
│           ├── Properties/launchSettings.json
│           ├── appsettings.json               # Connection string (IntexConnection)
│           └── appsettings.Development.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx                           # Router config (createBrowserRouter)
│   │   ├── index.css                          # Tailwind v4 @import + @theme (colors, fonts)
│   │   ├── api/
│   │   │   ├── apiClient.ts                   # Axios instance (uses VITE_API_URL)
│   │   │   └── homeVisitationApi.ts           # HomeVisitation CRUD functions
│   │   ├── types/
│   │   │   └── homeVisitation.ts              # TS interfaces + constants
│   │   ├── components/
│   │   │   ├── Layout.tsx                     # Public layout (navbar, cookie consent, footer)
│   │   │   └── AdminLayout.tsx                # Admin portal (sidebar, top bar, responsive)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx                   # Landing page with filler data
│   │   │   ├── DonorDashboardPage.tsx         # Impact dashboard with filler data
│   │   │   ├── LoginPage.tsx                  # Auth forms (sign-in + register)
│   │   │   ├── PrivacyPage.tsx                # Full GDPR privacy policy
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.tsx      # KPI cards, tabs, safehouse selector
│   │   │       ├── DonorsContributionsPage.tsx  # Supporter + donation management
│   │   │       ├── CaseloadPage.tsx            # Resident case management
│   │   │       ├── ProcessRecordingPage.tsx     # Counseling session docs
│   │   │       ├── HomeVisitationPage.tsx       # LIVE API — full CRUD
│   │   │       └── ReportsPage.tsx             # Analytics with charts
│   │   ├── App.tsx                            # Original Vite boilerplate (not imported)
│   │   └── App.css                            # Original boilerplate (not imported)
│   ├── index.html                             # Inter font, favicon
│   ├── package.json
│   ├── vite.config.ts                         # React + Tailwind plugins
│   ├── .env.development                       # VITE_API_URL (Azure backend)
│   ├── .env.production                        # VITE_API_URL (Azure backend)
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   └── eslint.config.js
├── ml-pipelines/                              # (To be created) Jupyter notebooks
├── admin-dashboard-mockup.jsx                 # Original design reference
├── .gitignore
├── CLAUDE.md                                  # This file
└── README.md
```

## Current Implementation Status

### Frontend Pages — All Built with Filler Data

| Route | Page | Status | Notes |
|-------|------|--------|-------|
| `/` | HomePage | Filler data | Hero, KPIs, mission features, testimonials. TODO: fetch from API |
| `/impact` | DonorDashboardPage | Filler data | Safehouse cards, yearly outcomes, allocations, highlights |
| `/login` | LoginPage | UI complete | Sign-in + register forms. TODO: wire to ASP.NET Identity |
| `/privacy` | PrivacyPage | Complete | Full GDPR + Philippine DPA content with TOC sidebar |
| `/donor` | DonorPortalPage | **NOT BUILT** | Authenticated donor page — fake donation form + donation history. New requirement from updated spec |
| `/admin` | AdminDashboardPage | Filler data | KPIs, safehouse selector, 4 tabs. TODO: API integration |
| `/admin/donors` | DonorsContributionsPage | Filler data | Supporter CRUD, donation tracking. TODO: API |
| `/admin/caseload` | CaseloadPage | Filler data | Resident profiles, filtering. TODO: API |
| `/admin/process-recording` | ProcessRecordingPage | Filler data | Session forms, history. TODO: API |
| `/admin/home-visitation` | HomeVisitationPage | **LIVE API** | Full CRUD wired to backend |
| `/admin/reports` | ReportsPage | Filler data | Donation charts, outcomes, quarterly data. TODO: API |

### Backend — Partially Implemented

| Component | Status | Details |
|-----------|--------|---------|
| Entity Models (18) | Complete | All domain entities mapped in Data/ folder |
| DbContext | Complete | Intex2104Context with 27 DbSets |
| HomeVisitationController | Complete | Full CRUD + filtering by visitType, residentId, socialWorker |
| ResidentsController | Complete | GET all with select projection |
| Auth / Identity | Not started | No ASP.NET Identity configured yet |
| Other Controllers | Not started | Donors, Donations, ProcessRecordings, Education, Health, etc. |
| CSP Header | Not started | Required for IS 414 |

### Cross-Cutting Features

| Feature | Status |
|---------|--------|
| Cookie Consent Banner | Complete (localStorage-based, accept/decline) |
| Privacy Policy | Complete (GDPR + Philippine DPA) |
| Responsive Design | In progress (layouts responsive, pages vary) |
| Authentication | Not started |
| RBAC | Not started |
| HTTPS/TLS | Handled by Azure |
| Deployment | Active (Azure App Service + Static Web Apps) |

## Application Domain

### Three Core Domains

**1. Donor & Support Domain**
- Safehouses, partners, supporters, donations (monetary, in-kind, time, skills, social media), donation allocations
- Goal: Donor retention, growth prediction, personalized outreach, connecting donations to outcomes

**2. Case Management Domain**
- Residents, process recordings (counseling), home visitations, education records, health/wellbeing, intervention plans, incident reports
- Goal: Track girls across full lifecycle — intake → counseling → education → health → reintegration
- Follows Philippine social welfare agency documentation standards

**3. Outreach & Communication Domain**
- Social media posts, engagement metrics, public impact snapshots, safehouse monthly metrics
- Goal: Optimize social media strategy to convert engagement into donations

### Database Schema (18 Entity Models)

**Donor Domain:**
- `Safehouse` — Physical locations (safehouse_id, name, region [Luzon/Visayas/Mindanao], city, province, status, capacity_girls, capacity_staff, current_occupancy)
- `Partner` — Service orgs/individuals (partner_type [Organization/Individual], role_type [Education/Evaluation/SafehouseOps/FindSafehouse/Logistics/Transport/Maintenance])
- `PartnerAssignment` — Partner ↔ safehouse ↔ program area
- `Supporter` — Donors/volunteers (supporter_type [MonetaryDonor/InKindDonor/Volunteer/SkillsContributor/SocialMediaAdvocate/PartnerOrganization], acquisition_channel [Website/SocialMedia/Event/WordOfMouth/PartnerReferral/Church])
- `Donation` — All events (donation_type [Monetary/InKind/Time/Skills/SocialMedia], channel_source [Campaign/Event/Direct/SocialMedia/PartnerReferral], currency: PHP)
- `InKindDonationItem` — Line items (item_category [Food/Supplies/Clothing/SchoolMaterials/Hygiene/Furniture/Medical])
- `DonationAllocation` — Distribution across safehouses and program areas

**Case Management Domain:**
- `Resident` — 40+ properties (case_status [Active/Closed/Transferred], case_category [Abandoned/Foundling/Surrendered/Neglected], boolean sub-categories, disability fields, family flags [4ps/solo_parent/indigenous/informal_settler], reintegration_type, risk_level [Low/Medium/High/Critical])
- `ProcessRecording` — Counseling sessions (session_type [Individual/Group], emotional_state enums, interventions, follow-ups)
- `HomeVisitation` — Field visits (visit_type [Initial Assessment/Routine Follow-Up/Reintegration Assessment/Post-Placement Monitoring/Emergency], cooperation_level, visit_outcome)
- `EducationRecord` — Monthly progress (program_name, attendance_rate, progress_percent)
- `HealthWellbeingRecord` — Monthly health (weight, height, bmi, nutrition/sleep/energy scores)
- `InterventionPlan` — Individual goals and services
- `IncidentReport` — Safety and behavioral incidents

**Outreach Domain:**
- `SocialMediaPost` — Posts with 60+ engagement/performance metrics
- `SafehouseMonthlyMetric` — Aggregated monthly outcomes
- `PublicImpactSnapshot` — Anonymized impact reports

## Design System

- **Tailwind CSS v4** — configured via `@theme` in `src/index.css` (no tailwind.config.js)
- **Haven Teal palette** — 50-950 scale, primary: `haven-teal-600` (#1a8a6e), dark: `haven-teal-900` (#0d3330)
- **Haven Violet palette** — 50-950 scale, accent for public pages
- **Font:** Inter (300-800 weights via Google Fonts)
- **Base:** `stone` palette for neutrals (`bg-stone-50`, `text-stone-700`)
- **Focus visible:** 2px solid `#1fa882` (haven-teal-500)
- **Reduced motion:** Respected via `prefers-reduced-motion` media query

## API Patterns

### Frontend API Client
- `src/api/apiClient.ts` — Axios instance using `import.meta.env.VITE_API_URL`
- Environment URLs in `.env.development` and `.env.production`
- Currently points to: `https://intex2-backend-ezargqcgdwbgd4hq.francecentral-01.azurewebsites.net/api`

### Implemented Endpoints
```
GET    /api/HomeVisitation?visitType=...&residentId=...&socialWorker=...
GET    /api/homevisitation/{id}
POST   /api/homevisitation
PUT    /api/homevisitation/{id}
DELETE /api/homevisitation/{id}
GET    /api/residents  (select projection: ResidentId, CaseStatus, AssignedSocialWorker, SafehouseId)
```

### Planned Endpoints (from TODO comments in frontend pages)
```
GET /api/admin/dashboard-stats
GET /api/safehouses
GET /api/public/impact/snapshot
GET /api/public/impact/featured-quote
GET /api/public/impact/yearly
GET /api/public/impact/allocations
GET /api/public/impact/highlights
GET /api/public/impact/outcomes
GET /api/reports/monthly-donations?year=...
GET /api/reports/safehouse-outcomes
GET /api/reports/program-outcomes
GET /api/reports/annual-accomplishment?year=...
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
GET  /api/donor/donations          # Donor's own donation history
POST /api/donor/donate             # Submit a fake donation
```

## Security Requirements (IS 414)

- **HTTPS/TLS** on all public connections, HTTP → HTTPS redirect
- **Authentication**: ASP.NET Identity, username/password, strong password policy (per class instruction — do NOT follow Microsoft's default suggested values)
- **RBAC**: Admin can CRUD all data, Donor can donate and view own donation history/impact, unauthenticated can see public pages (home, impact, privacy, login)
- **API auth**: All CUD endpoints require auth; most R endpoints too. `/login` and `/auth/me` are exceptions
- **Integrity**: Delete confirmation required
- **Credentials**: Store in .env or secrets manager — NEVER in code or public repo
- **Privacy**: GDPR privacy policy (DONE) + fully functional cookie consent (DONE — localStorage-based)
- **CSP Header**: Content-Security-Policy HTTP header (not meta tag)
- **Deployment**: Publicly accessible on Azure (DONE)
- **Bonus options**: Third-party auth, MFA, HSTS, browser-accessible cookie for user settings (e.g., dark mode), data sanitization/encoding, Docker containers

### Test Accounts Needed for Grading
1. Admin user WITHOUT MFA
2. Donor user WITHOUT MFA (connected to historical donations)
3. Account WITH MFA enabled (graders verify MFA prompt, won't log in)

## ML Pipelines (IS 455)

Place Jupyter notebooks in `ml-pipelines/`. Each notebook must be:
- Self-contained, fully executable, named descriptively
- Full pipeline: Problem Framing → Data Prep → Exploration → Modeling → Evaluation → Deployment
- Each addresses a **different** business problem
- Must include both causal/explanatory AND predictive models
- Must deploy into the web app (API endpoint, dashboard, interactive form)
- Must include written analysis of relationships and causal claims

## Development Commands

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173 with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint

# Backend
cd backend/Intex2.API
dotnet run --project Intex2.API   # HTTP: localhost:5063, HTTPS: localhost:7082
```

## Key Constraints

- TypeScript strict mode: `noUnusedLocals` and `noUnusedParameters` enabled
- Tailwind v4 uses `@theme` in CSS — no `tailwind.config.js` or `postcss.config.js`
- All resident data involves minors who are abuse survivors — privacy is paramount
- Currency: Philippine Pesos (PHP)
- Geography: Philippines (Luzon, Visayas, Mindanao)
- Must be responsive (desktop + mobile) with Lighthouse accessibility ≥ 90%
- CORS currently allows any origin (needs tightening for production)
- Connection string key: `IntexConnection` in appsettings.json
