# CLAUDE.md — AI Context for Intex-II

## What Is This Project?

Intex-II is a full-stack web application for a US-based 501(c)(3) nonprofit organization that operates safehouses for girls who are survivors of sexual abuse or sex trafficking in the Philippines. The organization contracts with in-country partners to provide safehouses and rehabilitation services, funded by local and international donors.

This is a BYU capstone project (INTEX) spanning IS 401 (Project Management), IS 413 (Enterprise App Development), IS 414 (Security), and IS 455 (Machine Learning). The final deliverable includes a deployed web app, ML pipelines, a video walkthrough, and a live presentation to judges.

**Deadline: Friday, April 10, 2026 at 10:00 AM** (presentation day begins at 12:00 PM).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8, React Router v7 |
| Backend | ASP.NET Core 10 / C# (.NET 10) |
| Database | Azure SQL Database, MySQL, or PostgreSQL (team's choice) |
| ML Pipelines | Jupyter notebooks (Python), deployed via API endpoints |
| Deployment | Microsoft Azure (recommended) |
| Auth | ASP.NET Identity with role-based access control (RBAC) |

## Repository Structure

```
Intex-II/
├── backend/
│   └── Intex2.API/
│       ├── Intex2.API.slnx              # Solution file
│       └── Intex2.API/
│           ├── Program.cs                # ASP.NET Core entry point
│           ├── Intex2.API.csproj         # .NET 10 project file
│           ├── Controllers/              # API controllers
│           ├── Properties/launchSettings.json
│           ├── appsettings.json
│           └── appsettings.Development.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx                      # App entry — router setup
│   │   ├── components/
│   │   │   ├── Layout.tsx                # Public site layout (navbar + footer + Outlet)
│   │   │   └── AdminLayout.tsx           # Admin portal layout (sidebar + Outlet)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx              # / — Public landing page
│   │   │   ├── DonorDashboardPage.tsx    # /impact — Public donor-facing dashboard
│   │   │   ├── LoginPage.tsx             # /login — Authentication
│   │   │   ├── PrivacyPage.tsx           # /privacy — Privacy policy
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.tsx        # /admin — Command center
│   │   │       ├── DonorsContributionsPage.tsx   # /admin/donors
│   │   │       ├── CaseloadPage.tsx              # /admin/caseload
│   │   │       ├── ProcessRecordingPage.tsx      # /admin/process-recording
│   │   │       ├── HomeVisitationPage.tsx        # /admin/home-visitation
│   │   │       └── ReportsPage.tsx               # /admin/reports
│   │   ├── App.tsx                       # Original Vite boilerplate (not imported)
│   │   ├── App.css                       # Original boilerplate styles
│   │   └── index.css                     # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   └── eslint.config.js
├── ml-pipelines/                         # (To be created) Jupyter notebooks
├── admin-dashboard-mockup.jsx            # Design reference for admin dashboard
├── .gitignore
└── CLAUDE.md                             # This file
```

## Application Domain

### Three Core Domains

**1. Donor & Support Domain**
- Safehouses, partners, supporters, donations (monetary, in-kind, time, skills, social media), donation allocations
- Goal: Donor retention, growth prediction, personalized outreach, connecting donations to outcomes

**2. Case Management Domain**
- Residents, case information, process recordings (counseling sessions), home visitations, education records, health/wellbeing records, intervention plans, incident reports
- Goal: Track girls across full lifecycle — intake → counseling → education → health → reintegration
- Follows Philippine social welfare agency documentation standards

**3. Outreach & Communication Domain**
- Social media posts, engagement metrics, public impact snapshots
- Goal: Optimize social media strategy to convert engagement into donations

### Database Schema (17 Tables)

**Donor Domain:**
- `safehouses` — Physical locations (fields: safehouse_id, name, region, city, province, status, capacity_girls, capacity_staff, current_occupancy)
- `partners` — Service delivery organizations/individuals (partner_id, partner_name, partner_type, role_type, status)
- `partner_assignments` — Partner ↔ safehouse ↔ program area mapping
- `supporters` — Donors/volunteers (supporter_id, supporter_type [MonetaryDonor/InKindDonor/Volunteer/SkillsContributor/SocialMediaAdvocate/PartnerOrganization], display_name, relationship_type, acquisition_channel, status)
- `donations` — All donation events (donation_id, supporter_id, donation_type [Monetary/InKind/Time/Skills/SocialMedia], amount, channel_source, is_recurring, campaign_name)
- `in_kind_donation_items` — Line items for in-kind donations (item_category [Food/Supplies/Clothing/SchoolMaterials/Hygiene/Furniture/Medical])
- `donation_allocations` — How donations distribute across safehouses and program areas

**Case Management Domain:**
- `residents` — Core case records (resident_id, safehouse_id, case_status [Active/Closed/Transferred], case_category [Abandoned/Foundling/Surrendered/Neglected], sub-category booleans for trafficked/child_labor/physical_abuse/sexual_abuse/osaec/cicl/at_risk/street_child/child_with_hiv, disability info, family socio-demographic flags [4ps/solo_parent/indigenous/informal_settler], admission details, assigned_social_worker, reintegration_type, reintegration_status, risk levels)
- `process_recordings` — Counseling sessions (recording_id, resident_id, session_date, social_worker, session_type [Individual/Group], emotional_state_observed, emotional_state_end, session_narrative, interventions_applied, follow_up_actions, progress_noted, concerns_flagged)
- `home_visitations` — Field visits (visit_type [Initial Assessment/Routine Follow-Up/Reintegration Assessment/Post-Placement Monitoring/Emergency], family_cooperation_level, safety_concerns_noted, visit_outcome)
- `education_records` — Monthly education tracking (program_name, attendance_rate, progress_percent, gpa_like_score, completion_status)
- `health_wellbeing_records` — Monthly health data (weight, height, bmi, nutrition_score, sleep_score, energy_level, dental/medical checkups)
- `intervention_plans` — Individual goals and services
- `incident_reports` — Safety and behavioral incidents

**Outreach Domain:**
- `social_media_posts` — Posts with engagement metrics (platform, content_type, likes, shares, comments, reach, link_clicks, donations_attributed)
- `safehouse_monthly_metrics` — Aggregated monthly outcome metrics per safehouse
- `public_impact_snapshots` — Anonymized aggregate reports for public/donor communication

## Pages & Routes

### Public (No Auth Required)
| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | Landing page — mission, safehouses, CTAs, impact stats |
| `/impact` | DonorDashboardPage | Aggregated anonymized impact data for donors |
| `/login` | LoginPage | Username/password auth + registration |
| `/privacy` | PrivacyPage | GDPR-compliant privacy policy + cookie consent |

### Admin/Staff Portal (Auth Required)
| Route | Page | Purpose |
|-------|------|---------|
| `/admin` | AdminDashboardPage | KPIs, active residents, donations, case conferences |
| `/admin/donors` | DonorsContributionsPage | Manage supporters, track all contribution types |
| `/admin/caseload` | CaseloadPage | Core case management — resident profiles, filtering |
| `/admin/process-recording` | ProcessRecordingPage | Counseling session documentation |
| `/admin/home-visitation` | HomeVisitationPage | Home/field visits + case conferences |
| `/admin/reports` | ReportsPage | Analytics, trends, Annual Accomplishment Report format |

## Security Requirements (IS 414)

- **HTTPS/TLS** on all public connections, redirect HTTP → HTTPS
- **Authentication**: ASP.NET Identity, username/password, strong password policy (per class instruction — do NOT follow Microsoft's suggested values)
- **RBAC**: Admin can CRUD, Donor can view own history/impact, unauthenticated can see public pages
- **API auth**: All CUD endpoints require auth; most R endpoints too. `/login` and `/auth/me` are exceptions
- **Integrity**: Delete confirmation required
- **Credentials**: Store in .env or secrets manager — NEVER in code or public repo
- **Privacy**: GDPR privacy policy in footer, fully functional cookie consent
- **CSP Header**: Content-Security-Policy HTTP header (not meta tag) — only sources needed
- **Deployment**: Publicly accessible (Azure recommended)
- **Bonus**: Third-party auth, MFA, HSTS, browser-accessible cookie for user settings (e.g., dark mode), data sanitization/encoding, Docker containers, real DBMS for both operational and identity databases

### Test Accounts Needed for Grading
1. Admin user WITHOUT MFA
2. Donor user WITHOUT MFA (connected to historical donations)
3. Account WITH MFA enabled (graders won't log in, just verify MFA is required)

## ML Pipelines (IS 455)

Place Jupyter notebooks in `ml-pipelines/` folder. Each notebook must be:
- Self-contained and fully executable
- Named descriptively (e.g., `donor-churn-classifier.ipynb`, `reintegration-readiness.ipynb`)
- Follows full pipeline: Problem Framing → Data Prep → Exploration → Modeling → Evaluation → Deployment
- Each pipeline addresses a **different** business problem
- Must include both causal/explanatory AND predictive models
- Must deploy into the web app (API endpoint, dashboard, interactive form)
- Must include written analysis of discovered relationships and causal claims

## Design Reference

- `admin-dashboard-mockup.jsx` in repo root — complete React component showing admin dashboard design
- Color scheme: Primary dark teal `#0f4c5c`, accent gold `#e8b931`
- KPI cards, safehouse filtering, tabbed content (overview, at-risk alerts, donations)
- Mock data for 4 safehouses: Haven House Manila, Light of Hope Cebu, New Dawn Davao, Safe Harbor Iloilo

## Development Commands

```bash
# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server with HMR
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run preview      # Preview production build

# Backend
cd backend/Intex2.API
dotnet run --project Intex2.API   # Run API (HTTP: localhost:5063, HTTPS: localhost:7082)
```

## Key Constraints

- TypeScript strict mode: `noUnusedLocals` and `noUnusedParameters` are enabled — clean imports required
- The organization name has not been chosen yet (placeholder: "Intex II")
- All resident data is extremely sensitive (minors who are abuse survivors) — privacy and anonymization are paramount
- The app must be responsive (desktop + mobile) with Lighthouse accessibility score ≥ 90% on every page
- Data is in Philippine pesos (PHP) for monetary values
- Geographic context: Philippines (regions: Luzon, Visayas, Mindanao)
