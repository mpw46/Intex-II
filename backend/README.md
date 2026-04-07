# Backend — ASP.NET Core 10 API

REST API for Haven, the nonprofit safehouse management platform.

## Setup

```bash
cd Intex2.API
dotnet run --project Intex2.API
# HTTP:  http://localhost:5063
# HTTPS: https://localhost:7082
```

**Connection string:** Configure `IntexConnection` in `appsettings.json` (or user secrets / environment variables).

## Project Structure

```
backend/Intex2.API/
├── Intex2.API.slnx                          # Solution file
└── Intex2.API/
    ├── Program.cs                            # App entry — EF Core, CORS, middleware
    ├── Intex2.API.csproj                     # .NET 10, EF Core 10.0.5, SqlServer
    ├── Controllers/
    │   ├── HomeVisitationController.cs       # Full CRUD + filtering (LIVE)
    │   ├── ResidentsController.cs            # GET all with projection
    │   └── WeatherForecastController.cs      # Template placeholder (unused)
    ├── DTOs/
    │   └── HomeVisitationDto.cs              # Create/Update DTOs for HomeVisitation
    ├── Data/
    │   ├── Intex2104Context.cs               # DbContext — 27 DbSets
    │   ├── Safehouse.cs
    │   ├── Partner.cs
    │   ├── PartnerAssignment.cs
    │   ├── Supporter.cs
    │   ├── Donation.cs
    │   ├── InKindDonationItem.cs
    │   ├── DonationAllocation.cs
    │   ├── Resident.cs                       # 40+ properties (demographics, case categories, risk levels)
    │   ├── ProcessRecording.cs
    │   ├── HomeVisitation.cs
    │   ├── EducationRecord.cs
    │   ├── HealthWellbeingRecord.cs
    │   ├── InterventionPlan.cs
    │   ├── IncidentReport.cs
    │   ├── SocialMediaPost.cs                # 60+ engagement metrics
    │   ├── SafehouseMonthlyMetric.cs
    │   └── PublicImpactSnapshot.cs
    ├── Properties/launchSettings.json
    ├── appsettings.json                      # ConnectionStrings:IntexConnection
    ├── appsettings.Development.json
    └── Intex2.API.http                       # REST client test file
```

## Current State

### Implemented

| Component | Details |
|-----------|---------|
| **18 Entity Models** | All domain entities mapped with proper types and nullable annotations |
| **Intex2104Context** | 27 DbSets covering all tables |
| **HomeVisitationController** | Full CRUD: GET (with filtering by visitType, residentId, socialWorker), GET by ID, POST, PUT, DELETE |
| **ResidentsController** | GET all with select projection (ResidentId, CaseStatus, AssignedSocialWorker, SafehouseId) |
| **DTOs** | HomeVisitationDto, HomeVisitationCreateDto |
| **CORS** | AllowAnyOrigin policy (needs tightening for production) |
| **EF Core + SQL Server** | Configured in Program.cs |
| **OpenAPI/Swagger** | Available in dev environment |

### Live API Endpoints

```
GET    /api/HomeVisitation?visitType=...&residentId=...&socialWorker=...
GET    /api/homevisitation/{id}
POST   /api/homevisitation
PUT    /api/homevisitation/{id}
DELETE /api/homevisitation/{id}
GET    /api/residents
```

## What Needs to Be Built

### Priority 1: Authentication & Authorization

- **ASP.NET Identity** setup (user registration, login, JWT tokens)
- **Roles:** Admin, Staff (optional), Donor
- **Strong password policy** (per class instruction — NOT Microsoft's default values)
- **Auth middleware** on all CUD endpoints (and most R endpoints)
- **Endpoints:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`

### Priority 2: Remaining CRUD Controllers

The frontend has TODO comments for these endpoints:

| Controller | Endpoints | Frontend Consumer |
|-----------|-----------|-------------------|
| SafehousesController | GET, POST, PUT, DELETE | AdminDashboard, DonorDashboard |
| SupportersController | Full CRUD + search | DonorsContributionsPage |
| DonationsController | Full CRUD + aggregations | DonorsContributionsPage, ReportsPage |
| ProcessRecordingsController | Full CRUD per resident | ProcessRecordingPage |
| EducationRecordsController | Full CRUD per resident | ReportsPage |
| HealthRecordsController | Full CRUD per resident | ReportsPage |
| InterventionPlansController | Full CRUD per resident | CaseloadPage |
| IncidentReportsController | Full CRUD per resident | CaseloadPage |
| SocialMediaController | Full CRUD | AdminDashboard |
| **DonorPortalController** | GET own donations, POST fake donation | **DonorPortalPage (NOT BUILT)** — Donor role only |

### Priority 3: Aggregation / Public Endpoints

```
GET /api/public/impact/snapshot          → HomePage, DonorDashboardPage
GET /api/public/impact/featured-quote    → HomePage
GET /api/public/impact/yearly            → DonorDashboardPage
GET /api/public/impact/allocations       → DonorDashboardPage
GET /api/public/impact/highlights        → DonorDashboardPage
GET /api/public/impact/outcomes          → DonorDashboardPage
GET /api/public/safehouses               → DonorDashboardPage
GET /api/admin/dashboard-stats           → AdminDashboardPage
GET /api/reports/monthly-donations       → ReportsPage
GET /api/reports/safehouse-outcomes      → ReportsPage
GET /api/reports/program-outcomes        → ReportsPage
GET /api/reports/annual-accomplishment   → ReportsPage
GET /api/donor/donations                 → DonorPortalPage (donor's own history)
POST /api/donor/donate                   → DonorPortalPage (submit fake donation)
```

### Priority 4: Security Middleware

- **CSP Header** — Content-Security-Policy via middleware (required for IS 414)
- **HSTS** — HTTP Strict Transport Security (bonus)
- **CORS lockdown** — Replace `AllowAnyOrigin` with specific frontend origins
- **Data sanitization** — Input validation on all endpoints

## Dependencies

```xml
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.0.4" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="10.0.5" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.5" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.5" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.5" />
```

### To Add for Auth

```xml
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" />
```

## Configuration

- **Connection string key:** `IntexConnection` in `ConnectionStrings` section of `appsettings.json`
- **Database:** Azure SQL Server (EF Core SqlServer provider)
- **CORS:** Currently `AllowAnyOrigin` — tighten before production
- **Launch profiles:** HTTP (5063), HTTPS (7082)
- **Swagger:** Available at `/openapi/v1.json` in development

## Deployment

Currently deployed to Azure App Service at:
`https://intex2-backend-ezargqcgdwbgd4hq.francecentral-01.azurewebsites.net`

## ML Pipeline Integration

The `ml-pipelines/` folder will contain trained models. The backend needs prediction endpoints (e.g., donor churn, reintegration readiness) — either by loading serialized models directly or calling a Python microservice.
