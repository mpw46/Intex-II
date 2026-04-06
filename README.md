# Intex-II

Full-stack web application for a nonprofit organization operating safehouses for survivors of abuse and trafficking in the Philippines. Built as a BYU INTEX capstone project (IS 401, IS 413, IS 414, IS 455).

## Tech Stack

- **Frontend:** React 19 + TypeScript 6 + Vite 8 + React Router v7
- **Backend:** ASP.NET Core 10 / C# (.NET 10)
- **Database:** TBD (Azure SQL, MySQL, or PostgreSQL)
- **ML:** Jupyter notebooks (Python) with deployed API endpoints
- **Deployment:** Microsoft Azure

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd backend/Intex2.API
dotnet run --project Intex2.API   # http://localhost:5063
```

## Project Structure

```
Intex-II/
├── backend/                  # ASP.NET Core 10 API
│   └── Intex2.API/
├── frontend/                 # React + Vite SPA
│   └── src/
│       ├── components/       # Layout, AdminLayout
│       └── pages/            # Public and admin page components
│           └── admin/        # Authenticated admin pages
├── ml-pipelines/             # (Planned) Jupyter notebooks
├── admin-dashboard-mockup.jsx  # Design reference
├── CLAUDE.md                 # AI context file (detailed project spec)
└── README.md                 # This file
```

## Application Pages

### Public (No Authentication)

| Route | Description |
|-------|-------------|
| `/` | Landing page — organization mission, safehouses, calls to action |
| `/impact` | Donor-facing dashboard — anonymized impact data and outcomes |
| `/login` | Login and registration |
| `/privacy` | GDPR-compliant privacy policy |

### Admin Portal (Authenticated)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — KPIs, active residents, donations, case conferences |
| `/admin/donors` | Manage supporters and track all contribution types |
| `/admin/caseload` | Case management — resident profiles, demographics, filtering |
| `/admin/process-recording` | Counseling session documentation |
| `/admin/home-visitation` | Home/field visits and case conferences |
| `/admin/reports` | Analytics, trends, and reports |

## Domain Overview

The application serves three core domains:

1. **Donor & Support** — Track safehouses, partners, supporters, and all donation types (monetary, in-kind, time, skills, social media advocacy). Support donor retention analysis and campaign effectiveness.

2. **Case Management** — Manage residents across their full lifecycle: intake, case assessment, counseling (process recordings), education, health services, home visitations, intervention plans, and reintegration. Follows Philippine social welfare agency documentation standards.

3. **Outreach & Communication** — Track social media activity and engagement metrics. Connect content strategy to donation outcomes.

## Database

17 tables across three domains. See `CLAUDE.md` for the full schema reference, or the data dictionary in the project specification.

**Donor Domain:** safehouses, partners, partner_assignments, supporters, donations, in_kind_donation_items, donation_allocations

**Case Management Domain:** residents, process_recordings, home_visitations, education_records, health_wellbeing_records, intervention_plans, incident_reports

**Outreach Domain:** social_media_posts, safehouse_monthly_metrics, public_impact_snapshots

## Security Requirements

- HTTPS/TLS with HTTP → HTTPS redirect
- ASP.NET Identity authentication with strong password policy
- Role-based access control (Admin, Donor, unauthenticated)
- Content-Security-Policy HTTP header
- GDPR privacy policy and functional cookie consent
- Credentials stored securely (never in code)
- Delete confirmation for data integrity

## ML Pipelines

Jupyter notebooks in `ml-pipelines/`. Each pipeline follows the full lifecycle:
Problem Framing → Data Prep → Exploration → Modeling → Evaluation → Deployment

Pipelines should address meaningful business questions across donor analytics, case management outcomes, and social media effectiveness.

## Key Notes

- Organization name is TBD (using "Intex II" as placeholder)
- All resident data involves minors who are abuse survivors — privacy is paramount
- Currency: Philippine Pesos (PHP)
- Geography: Philippines (Luzon, Visayas, Mindanao regions)
- Must be responsive (desktop + mobile) with Lighthouse accessibility ≥ 90%
- Design reference: `admin-dashboard-mockup.jsx` (color scheme: `#0f4c5c` teal, `#e8b931` gold)
