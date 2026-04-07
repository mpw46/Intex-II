# Haven — Intex-II

Full-stack web application for a nonprofit operating safehouses for survivors of abuse and trafficking in the Philippines. BYU INTEX capstone (IS 401, 413, 414, 455).

## Tech Stack

- **Frontend:** React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + React Router 7 + Axios
- **Backend:** ASP.NET Core 10 / C# + Entity Framework Core 10 + SQL Server
- **Deployment:** Microsoft Azure (App Service + Static Web Apps)

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173

# Backend
cd backend/Intex2.API
dotnet run --project Intex2.API   # http://localhost:5063
```

## Project Structure

```
Intex-II/
├── backend/                     # ASP.NET Core 10 API
│   └── Intex2.API/
│       └── Intex2.API/
│           ├── Controllers/     # HomeVisitationController, ResidentsController
│           ├── Data/            # 18 entity models + Intex2104Context (27 DbSets)
│           ├── DTOs/            # Data transfer objects
│           └── Program.cs       # App config (EF Core, CORS, middleware)
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── api/                 # Axios client + API functions
│       ├── types/               # TypeScript interfaces
│       ├── components/          # Layout, AdminLayout
│       └── pages/               # Public and admin page components
│           └── admin/           # 6 admin pages
├── ml-pipelines/                # (Planned) Jupyter notebooks
├── admin-dashboard-mockup.jsx   # Original design reference
├── CLAUDE.md                    # Full AI context file
└── README.md
```

## Pages

### Public (No Auth)

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page — hero, KPIs, mission, testimonials | UI complete (filler data) |
| `/impact` | Donor-facing impact dashboard — safehouses, outcomes, allocations | UI complete (filler data) |
| `/login` | Sign-in + registration forms | UI complete (needs API) |
| `/privacy` | GDPR + Philippine DPA privacy policy | Complete |

### Donor Portal (Donor Auth Required)

| Route | Page | Status |
|-------|------|--------|
| `/donor` | Donor dashboard — fake donation form + donation history | **Not built yet** |

### Admin Portal (Admin Auth Required)

| Route | Page | Status |
|-------|------|--------|
| `/admin` | Dashboard — KPIs, safehouse selector, tabs | UI complete (filler data) |
| `/admin/donors` | Supporter management + donation tracking | UI complete (filler data) |
| `/admin/caseload` | Resident case management + filtering | UI complete (filler data) |
| `/admin/process-recording` | Counseling session documentation | UI complete (filler data) |
| `/admin/home-visitation` | Home/field visits + case conferences | **Live API** |
| `/admin/reports` | Analytics — donations, outcomes, quarterly | UI complete (filler data) |

## Domain Overview

1. **Donor & Support** — Safehouses, partners, supporters, donations (monetary, in-kind, time, skills, social media), allocations
2. **Case Management** — Residents, process recordings, home visitations, education, health, intervention plans, incident reports
3. **Outreach** — Social media posts, engagement metrics, public impact snapshots

## Database

18 entity models across three domains, mapped to 27 DbSets in `Intex2104Context`. Connected to Azure SQL Server via `IntexConnection` connection string. See `CLAUDE.md` for full schema.

## What Still Needs to Be Done

- [ ] **Donor Portal page** — `/donor` route: fake donation form + donation history (new requirement from updated spec)
- [ ] **Authentication** — ASP.NET Identity with JWT, role-based (Admin/Staff/Donor)
- [ ] **Remaining API controllers** — Donors, Donations, ProcessRecordings, Education, Health, Reports, etc.
- [ ] **Donor API endpoints** — `GET /api/donor/donations` (own history), `POST /api/donor/donate` (fake donation)
- [ ] **Wire frontend pages to API** — Replace filler data with real API calls (TODO comments in each page)
- [ ] **CSP Header** — Content-Security-Policy middleware
- [ ] **CORS lockdown** — Replace AllowAnyOrigin with specific origins
- [ ] **ML Pipelines** — Jupyter notebooks in `ml-pipelines/`
- [ ] **Accessibility** — Lighthouse score ≥ 90% on every page
- [ ] **Responsive polish** — Desktop + mobile on all pages

## Design System

- **Tailwind CSS v4** with custom `@theme` in `src/index.css`
- **Haven Teal** (50–950) — primary palette
- **Haven Violet** (50–950) — accent for public pages
- **Font:** Inter (Google Fonts)
- **Neutrals:** Tailwind `stone` palette

## Security Requirements (IS 414)

HTTPS/TLS, HTTP→HTTPS redirect, ASP.NET Identity auth, strong passwords, RBAC, API auth on all CUD endpoints, delete confirmation, credential security, GDPR privacy policy (done), cookie consent (done), CSP header, public deployment. See `CLAUDE.md` for full details.
