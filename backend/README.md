# Backend — ASP.NET Core 10 API

REST API for the Intex-II nonprofit safehouse management platform.

## Setup

```bash
cd Intex2.API
dotnet run --project Intex2.API
# HTTP:  http://localhost:5063
# HTTPS: https://localhost:7082
```

## Project Structure

```
backend/
└── Intex2.API/
    ├── Intex2.API.slnx                  # Solution file
    └── Intex2.API/
        ├── Program.cs                    # App entry point — middleware pipeline
        ├── Intex2.API.csproj             # .NET 10 project config
        ├── Controllers/
        │   └── WeatherForecastController.cs  # Template placeholder (replace)
        ├── WeatherForecast.cs            # Template model (replace)
        ├── Properties/
        │   └── launchSettings.json       # Dev server ports and profiles
        ├── appsettings.json              # Production config
        ├── appsettings.Development.json  # Dev config
        └── Intex2.API.http               # REST client test file
```

## Current State

The backend is a fresh ASP.NET Core 10 template with only the default WeatherForecast controller. Everything below needs to be built.

## What Needs to Be Built

### Database & Models

Choose one: Azure SQL Database, MySQL, or PostgreSQL. Use Entity Framework Core for ORM.

**17 tables across three domains:**

**Donor & Support Domain:**
- `Safehouses` — Physical locations (id, name, region, city, province, status, capacity_girls, capacity_staff, current_occupancy)
- `Partners` — Service delivery orgs/individuals (partner_type [Organization/Individual], role_type [Education/Evaluation/SafehouseOps/FindSafehouse/Logistics/Transport/Maintenance])
- `PartnerAssignments` — Partner ↔ safehouse ↔ program area mapping
- `Supporters` — Donors/volunteers (supporter_type [MonetaryDonor/InKindDonor/Volunteer/SkillsContributor/SocialMediaAdvocate/PartnerOrganization], relationship_type [Local/International/PartnerOrganization], acquisition_channel [Website/SocialMedia/Event/WordOfMouth/PartnerReferral/Church])
- `Donations` — All donation events (donation_type [Monetary/InKind/Time/Skills/SocialMedia], channel_source [Campaign/Event/Direct/SocialMedia/PartnerReferral], currency: PHP)
- `InKindDonationItems` — Line items (item_category [Food/Supplies/Clothing/SchoolMaterials/Hygiene/Furniture/Medical])
- `DonationAllocations` — Distribution across safehouses and program areas [Education/Wellbeing/Operations/Transport/Maintenance/Outreach]

**Case Management Domain:**
- `Residents` — Core case records (case_status [Active/Closed/Transferred], case_category [Abandoned/Foundling/Surrendered/Neglected], boolean sub-categories for trafficked/child_labor/physical_abuse/sexual_abuse/osaec/cicl/at_risk/street_child/child_with_hiv, disability fields, family flags [4ps/solo_parent/indigenous/informal_settler], reintegration_type, risk_level [Low/Medium/High/Critical])
- `ProcessRecordings` — Counseling sessions (session_type [Individual/Group], emotional_state [Calm/Anxious/Sad/Angry/Hopeful/Withdrawn/Happy/Distressed], interventions, follow-ups)
- `HomeVisitations` — Field visits (visit_type [Initial Assessment/Routine Follow-Up/Reintegration Assessment/Post-Placement Monitoring/Emergency], family_cooperation_level [Highly Cooperative/Cooperative/Neutral/Uncooperative], visit_outcome [Favorable/Needs Improvement/Unfavorable/Inconclusive])
- `EducationRecords` — Monthly progress (program_name [Bridge Program/Secondary Support/Vocational Skills/Literacy Boost], attendance_rate 0-1, progress_percent 0-100)
- `HealthWellbeingRecords` — Monthly health data (weight, height, bmi, nutrition/sleep/energy scores)
- `InterventionPlans` — Individual goals and services
- `IncidentReports` — Safety and behavioral incidents

**Outreach Domain:**
- `SocialMediaPosts` — Posts with engagement metrics (platform, likes, shares, comments, reach, donations_attributed)
- `SafehouseMonthlyMetrics` — Aggregated monthly outcome metrics
- `PublicImpactSnapshots` — Anonymized impact reports for public/donor communication

### API Controllers to Build

Each controller should support appropriate CRUD operations:

| Controller | Endpoints | Auth Required |
|-----------|-----------|---------------|
| AuthController | POST /login, GET /auth/me, POST /register | No (public) |
| SafehousesController | GET, POST, PUT, DELETE | Read: mixed, CUD: Admin |
| SupportersController | Full CRUD + search/filter | Admin |
| DonationsController | Full CRUD + aggregations | Admin; Donor can read own |
| ResidentsController | Full CRUD + search/filter | Admin/Staff |
| ProcessRecordingsController | Full CRUD per resident | Admin/Staff |
| HomeVisitationsController | Full CRUD per resident | Admin/Staff |
| EducationRecordsController | Full CRUD per resident | Admin/Staff |
| HealthRecordsController | Full CRUD per resident | Admin/Staff |
| ReportsController | GET aggregated analytics | Admin/Staff |
| PublicImpactController | GET anonymized data | No (public) |
| SocialMediaController | Full CRUD | Admin |

### Authentication & Security

- **ASP.NET Identity** for user management
- **JWT tokens** for API authentication
- **Roles:** Admin, Staff (optional), Donor
- **Strong password policy** (per class instruction — NOT Microsoft's default suggestions)
- **HTTPS** with HTTP → HTTPS redirect
- **CORS** configured for frontend origin
- **CSP header** via middleware
- **HSTS** (bonus)
- **Data sanitization** to prevent injection attacks

### Configuration

- Database connection string in `appsettings.json` (or .env / secrets manager — never commit secrets)
- Identity database can be separate from operational database
- CORS origins for frontend dev server (localhost:5173) and production URL

## Dependencies to Add

```xml
<!-- Likely needed packages -->
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" />  <!-- or Npgsql/Pomelo for PG/MySQL -->
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" />
```

## ML Pipeline Integration

The `ml-pipelines/` folder will contain Jupyter notebooks with trained models. The backend needs to expose prediction endpoints (e.g., donor churn probability, reintegration readiness score) by loading serialized models or calling a Python microservice.
