# INTEX II ML Pipelines Context

This document is a persistent context brief for AI and team members working in `ml-pipelines/`.
It captures project goals, sprint objectives, and dataset schemas so work can continue smoothly
across model switches.

## 1) Project Overview (Whole App)

We are building an INTEX II application for a nonprofit organization similar to Lighthouse Sanctuary.
The app stack is:

- Frontend: React + TypeScript + Vite
- Backend: .NET 10 / C#
- Data: synthetic nonprofit operations dataset in `ml-pipelines/lighthouse_csv_v7/`

### Business problem domains

1. Donor and support operations  
   Improve donor retention, increase fundraising effectiveness, and link donor activity to impact.

2. Case management and resident outcomes  
   Help staff identify girls at risk, track progress, and prioritize interventions.

3. Social media and outreach strategy  
   Understand what content and posting decisions improve engagement and, later, fundraising outcomes.

### ML philosophy required by course

- Build end-to-end pipelines (problem framing -> prep -> explore -> model -> evaluate -> interpret -> deployment notes).
- Distinguish predictive vs explanatory/causal goals.
- Include clear business interpretation, not only technical metrics.
- Keep notebooks reproducible and executable top-to-bottom.

## 2) Monday Sprint Objectives (Personal ML Scope)

I am responsible for three ML pipelines on Monday:

1. `donor-retention.ipynb`  
   **Type:** Predictive model  
   **Goal:** Predict donor retention likelihood (or lapse risk proxy) so admin users can prioritize outreach.

2. `girls-at-risk.ipynb`  
   **Type:** Predictive model  
   **Goal:** Predict which residents are struggling most and likely need immediate staff attention.

3. `social-media-effectiveness.ipynb`  
   **Type:** Explanatory / causal analysis  
   **Goal:** Identify factors that drive social media engagement (not donation prediction yet).

### What these outputs should enable in the app

- Donor health/risk segmentation in admin views
- Early-warning signals for resident case prioritization
- Explainable guidance for social strategy (timing, platform, content format, CTA patterns)

## 3) Data Location and Conventions

- Dataset folder: `ml-pipelines/lighthouse_csv_v7/`
- Data is synthetic and intentionally contains discoverable trends.
- CSVs are the source of truth if minor naming differences appear vs case handout text.
- Join keys and dates should be validated in each notebook before modeling.

## 4) CSV Schema Reference (17 Tables)

Below is a practical schema summary for each CSV: purpose, likely key(s), and notable columns.

---

## `safehouses.csv`

**Purpose:** Safehouse location and capacity metadata.  
**Primary key:** `safehouse_id`  
**Important columns:** `safehouse_code`, `name`, `region`, `city`, `province`, `status`, `capacity_girls`, `capacity_staff`, `current_occupancy`, `open_date`

## `partners.csv`

**Purpose:** Service partner entities/individuals.  
**Primary key:** `partner_id`  
**Important columns:** `partner_name`, `partner_type`, `role_type`, `contact_name`, `email`, `phone`, `region`, `status`, `start_date`, `end_date`

## `partner_assignments.csv`

**Purpose:** Which partners are assigned to safehouses/program areas.  
**Primary key:** `assignment_id`  
**Foreign keys:** `partner_id`, `safehouse_id`  
**Important columns:** `program_area`, `assignment_start`, `assignment_end`, `is_primary`, `status`, `responsibility_notes`

## `supporters.csv`

**Purpose:** Donor/supporter master records.  
**Primary key:** `supporter_id`  
**Important columns:** `supporter_type`, `display_name`, `organization_name`, `first_name`, `last_name`, `relationship_type`, `region`, `country`, `status`, `first_donation_date`, `acquisition_channel`, `created_at`

## `donations.csv`

**Purpose:** Donation events across monetary and non-monetary types.  
**Primary key:** `donation_id`  
**Foreign keys:** `supporter_id`, optional `created_by_partner_id`, optional `referral_post_id`  
**Important columns:** `donation_type`, `donation_date`, `channel_source`, `amount`, `estimated_value`, `impact_unit`, `is_recurring`, `campaign_name`, `currency_code`

## `in_kind_donation_items.csv`

**Purpose:** Line-item detail for in-kind donations.  
**Primary key:** `item_id`  
**Foreign key:** `donation_id`  
**Important columns:** `item_name`, `item_category`, `quantity`, `unit_of_measure`, `estimated_unit_value`, `intended_use`, `received_condition`

## `donation_allocations.csv`

**Purpose:** Allocation of donation value by safehouse and program area.  
**Primary key:** `allocation_id`  
**Foreign keys:** `donation_id`, `safehouse_id`  
**Important columns:** `program_area`, `amount_allocated`, `allocation_date`, `allocation_notes`

## `residents.csv`

**Purpose:** Core resident case records.  
**Primary key:** `resident_id`  
**Foreign key:** `safehouse_id`  
**Important columns:** `case_status`, `case_category`, subgroup flags (`sub_cat_*`), family context flags (`family_*`), `date_of_admission`, `referral_source`, `assigned_social_worker`, `reintegration_type`, `reintegration_status`, `initial_risk_level`, `current_risk_level`, `date_closed`, `created_at`

## `process_recordings.csv`

**Purpose:** Counseling session documentation over time.  
**Primary key:** `recording_id`  
**Foreign key:** `resident_id`  
**Important columns:** `session_date`, `social_worker`, `session_type`, `session_duration_minutes`, `emotional_state_observed`, `emotional_state_end`, `interventions_applied`, `progress_noted`, `concerns_flagged`, `referral_made`

## `home_visitations.csv`

**Purpose:** Home/field visits and follow-up quality.  
**Primary key:** `visitation_id`  
**Foreign key:** `resident_id`  
**Important columns:** `visit_date`, `social_worker`, `visit_type`, `location_visited`, `family_cooperation_level`, `safety_concerns_noted`, `follow_up_needed`, `visit_outcome`

## `education_records.csv`

**Purpose:** Monthly resident education progress.  
**Primary key:** `education_record_id`  
**Foreign key:** `resident_id`  
**Current CSV columns:** `record_date`, `education_level`, `school_name`, `enrollment_status`, `attendance_rate`, `progress_percent`, `completion_status`, `notes`

## `health_wellbeing_records.csv`

**Purpose:** Monthly health and wellbeing status.  
**Primary key:** `health_record_id`  
**Foreign key:** `resident_id`  
**Current CSV columns:** `record_date`, `general_health_score`, `nutrition_score`, `sleep_quality_score`, `energy_level_score`, `height_cm`, `weight_kg`, `bmi`, `medical_checkup_done`, `dental_checkup_done`, `psychological_checkup_done`, `notes`

## `intervention_plans.csv`

**Purpose:** Structured intervention goals and progress tracking.  
**Primary key:** `plan_id`  
**Foreign key:** `resident_id`  
**Important columns:** `plan_category`, `plan_description`, `services_provided`, `target_value`, `target_date`, `status`, `case_conference_date`, `created_at`, `updated_at`

## `incident_reports.csv`

**Purpose:** Detailed incident-level safety/behavior records.  
**Primary key:** `incident_id`  
**Foreign keys:** `resident_id`, `safehouse_id`  
**Important columns:** `incident_date`, `incident_type`, `severity`, `response_taken`, `resolved`, `resolution_date`, `reported_by`, `follow_up_required`

## `social_media_posts.csv`

**Purpose:** Social post-level metadata, engagement, and donation referral metrics.  
**Primary key:** `post_id`  
**Important columns:** `platform`, `created_at`, `day_of_week`, `post_hour`, `post_type`, `media_type`, `num_hashtags`, `mentions_count`, `has_call_to_action`, `call_to_action_type`, `content_topic`, `sentiment_tone`, `caption_length`, `features_resident_story`, `campaign_name`, `is_boosted`, `boost_budget_php`, `impressions`, `reach`, `likes`, `comments`, `shares`, `saves`, `click_throughs`, `video_views`, `engagement_rate`, `profile_visits`, `donation_referrals`, `estimated_donation_value_php`, `follower_count_at_post`

## `safehouse_monthly_metrics.csv`

**Purpose:** Safehouse-level monthly aggregates for operations and outcomes.  
**Primary key:** `metric_id`  
**Foreign key:** `safehouse_id`  
**Important columns:** `month_start`, `month_end`, `active_residents`, `avg_education_progress`, `avg_health_score`, `process_recording_count`, `home_visitation_count`, `incident_count`, `notes`

## `public_impact_snapshots.csv`

**Purpose:** Public-facing monthly impact summary records.  
**Primary key:** `snapshot_id`  
**Important columns:** `snapshot_date`, `headline`, `summary_text`, `metric_payload_json`, `is_published`, `published_at`

---

## 5) Suggested Target Variables (for current sprint)

These are initial suggestions and can be adjusted after EDA:

- Donor retention notebook:
  - Binary target: retained vs lapsed based on donation recency/frequency windows.
- Girls-at-risk notebook:
  - Binary target: **≥1 incident in the next 30 days** (`incident_reports`, **any severity**) at monthly resident snapshots — broadened from “High severity only” to improve positive-class rate and model learnability. Features still include prior high-severity count as a predictor.
- Social media effectiveness notebook:
  - Outcome variable(s): engagement rate and/or engagement counts normalized by reach.
  - Explanatory covariates: platform, post type, media type, timing, CTA usage, boosts, content topic, sentiment, hashtag intensity.

## 6) Modeling Guardrails

- Prevent leakage (time-based features must precede target period).
- Use train/test split and optionally cross-validation for predictive notebooks.
- Favor interpretability for explanatory notebook (clear coefficient/feature-effect discussion).
- Report business meaning of errors:
  - False negatives in donor lapse prediction -> missed save opportunities
  - False negatives in girls-at-risk prediction -> safety/intervention risk

## 7) Deployment/Integration Direction (Later)

Each notebook should end with notes for app integration:

- API endpoint shape (input/output contract)
- Storage of scored outputs or on-demand scoring strategy
- Where score/insight appears in admin UI
- Monitoring/refresh cadence and model drift checks

## 8) Working Notes

- Notebook names in use:
  - `donor-retention.ipynb`
  - `girls-at-risk.ipynb`
  - `social-media-effectiveness.ipynb`
- Keep this file updated as pipeline definitions evolve.

---

## 9) Problem framing (AI as Problem Setter) — latest session

**Last updated:** 2026-04-06 (brainstorm session; no notebook implementation yet).

### Chosen pipeline directions (team)

| Notebook | Primary intent | Rough business question |
|----------|----------------|-------------------------|
| `donor-retention.ipynb` | Predictive | Which supporters should we prioritize so they do not lapse? |
| `girls-at-risk.ipynb` | Predictive | Which residents are struggling most / need attention soon? |
| `social-media-effectiveness.ipynb` | Explanatory (causal-style) | What drives social engagement (for admin strategy)? |

### Business goals these three pipelines do **not** fully cover

- **Donor ↔ impact linkage:** Retention scores who to nudge; they do not yet answer “how did my gift translate to outcomes?” (`donation_allocations`, `public_impact_snapshots`, resident aggregates).
- **Operations / capacity:** Safehouse strain, staffing vs occupancy, partner coverage (`safehouses`, `partner_assignments`, `safehouse_monthly_metrics`).
- **Volunteer / in-kind / skills:** Non-monetary support (`in_kind_donation_items`, non-monetary donation types) may need different “retention” definitions than monetary donors.
- **Reintegration readiness:** Case handout explicitly asks about readiness for reintegration; **risk of struggle** is related but not the same as **readiness to exit** (`residents.reintegration_*`, visitations, education/health trends).
- **Program quality / intervention effectiveness:** Which intervention categories or plans correlate with better trajectories (`intervention_plans` vs outcomes)—different from “who is at risk now.”
- **Public comms:** What to publish on the impact dashboard (`public_impact_snapshots`) vs what drives social engagement.
- **Ethics / fairness:** Who gets flagged “at risk” and how errors affect trust and care—must be named in problem framing and evaluation, not only accuracy.

### Tables / angles that are easy to **underuse** with the current three problems

- **`donation_allocations` + `donations`:** Donor story → safehouse/program; supports “impact per peso” and campaign targeting by geography or program.
- **`home_visitations`:** Family cooperation, safety, visit outcomes—strong for **reintegration** and **family context**, not only “incident risk.”
- **`intervention_plans`:** Goals, status, case conference dates—intervention **effectiveness** and backlog, not just risk scores.
- **`partners` / `partner_assignments`:** Service gaps by safehouse or program area (who is covered vs not).
- **`process_recordings`:** Text-heavy; risk of **leakage** if future session info is used to predict past risk—must define time window carefully.
- **`public_impact_snapshots`:** Ties to donor-facing app and “metric_payload_json” for dashboards—separate ML story from admin social strategy.

### Blind spots to challenge (tensions for the team to resolve)

- **“Risk” label:** `current_risk_level` may already be staff judgment—predicting it can be circular or just automation of existing labels. Prefer **forward-looking** targets (e.g., incident in next N days, or deterioration in education/health) with clear time cutoffs.
- **Donor retention:** Define **lapse** (recency, frequency, monetary vs any gift) and whether **reactivation** is the same problem as **prevention**.
- **Social media:** “Engagement” can be **gamed** (boosts, reach). Book and course ask for **business meaning**—consider whether a secondary analysis of **donation_referrals** or **click_throughs** belongs in the same notebook as a robustness check (still explanatory, not a full “donation ROI” pipeline).
- **Course requirement:** IS 455 asks for **both** predictive and explanatory angles per pipeline; the three notebooks have a primary goal each—each notebook still needs a **paired** model or analysis (see `textbook-chapters-context.md`).

### Open questions for the next modeling / EDA pass

1. For girls-at-risk: is the target **incidents**, **risk level change**, **composite struggle score**, or **staff triage queue**?
2. For donors: single definition of “active” vs “lapsed” agreed to by the team?
3. For social: single outcome (`engagement_rate` vs raw engagement / reach) and how to treat **boost_budget** and **follower_count_at_post** (confounders).

### Next AI session

- Lock **definitions** (targets, horizons, leakage rules) per notebook before heavy feature engineering.
- ~~Continue “AI as Creative Expander” on feature ideas and joins once targets are fixed.~~ **Done for `girls-at-risk.ipynb`** — see §10.

---

## 10) AI as Creative Expander — `girls-at-risk.ipynb` (prep & exploration)

**Last updated:** 2026-04-06 (target broadened 2026-04-06: **any** incident in 30d, not High-only).

### Implemented target (notebook code)

- **Y = 1** if the resident has **at least one** `incident_reports` row with `incident_date` in `(cutoff, cutoff + 30 days]`, **any** `severity` (Low / Medium / High).
- **Horizon / spine:** First-of-month cutoffs; features use data **strictly before** cutoff.
- **Risk tiers for scoring:** **Within-cohort tertiles** on `predict_proba` among active residents at the score date (top/middle/bottom third ≈ High/Medium/Low). Raw probability is still stored; fixed 0.33/0.66 cutoffs were dropped because uncalibrated scores often sat entirely below 0.33 (“everyone Low”).

### Team decision

First predictors locked: donor retention, girls at risk, social engagement drivers. This section expands **only** the girls-at-risk pipeline for data prep and EDA.

### Target options (pick one; drives all time logic)

- **A — Forward-looking (recommended):** e.g. binary “any **High** severity incident or **RunawayAttempt / SelfHarm / Security** in next *N* days” using only features known **before** that window.
- **B — Deterioration:** drop in `progress_percent` or `general_health_score` over *N* days vs prior *M* days.
- **C — Staff label (weaker):** predict `current_risk_level` — risks **circularity**; use only if framed as “reproduce triage” and validated with forward outcomes.

### Core join spine

- **Anchor:** `residents.resident_id` (+ `safehouse_id`, admission/closure dates).
- **Time-indexed:** `process_recordings`, `education_records`, `health_wellbeing_records`, `home_visitations`, `intervention_plans`, `incident_reports` — aggregate **strictly before** the prediction as-of date.

### Feature families (engineer + explore)

**A. Static / slow-changing (from `residents`)**  
Case category and `sub_cat_*`, `family_*`, `is_pwd` / `has_special_needs`, `initial_risk_level`, `referral_source`, `reintegration_status` (as context, not future leakage), tenure since `date_of_admission` (days), age from `date_of_birth` if reliable.

**B. Safehouse context**  
From `safehouses`: `region`, `capacity_girls` vs `current_occupancy` (utilization), `status`.  
From `safehouse_monthly_metrics`: merge by `safehouse_id` + **month before as-of** — `avg_education_progress`, `avg_health_score`, `incident_count`, `process_recording_count`, `home_visitation_count`, `active_residents` (house-level stress).

**C. Partner / program coverage (optional)**  
`partner_assignments` (+ `partners`) aggregated per `safehouse_id`: count of active assignments by `program_area` (Education, Wellbeing, etc.) — proxy for service intensity.

**D. Counseling intensity & tone (`process_recordings`)**  
Rolling counts: sessions per 30/90 days; mean `session_duration_minutes`; share of `concerns_flagged`, `referral_made`, `progress_noted`; mix of `session_type`; transitions (e.g. start `emotional_state_observed` vs end `emotional_state_end` coded as improved/worse).

**E. Education trajectory (`education_records`)**  
Rolling mean / min of `attendance_rate`, `progress_percent`; slope (linear trend over last *k* records); `completion_status` mix; volatility (std) of progress.

**F. Health trajectory (`health_wellbeing_records`)**  
Rolling means for `general_health_score`, `nutrition_score`, `sleep_quality_score`, `energy_level_score`; BMI change; share of months with `psychological_checkup_done`.

**G. Home & family (`home_visitations`)**  
Count by `visit_type` in window; share with `safety_concerns_noted`, `follow_up_needed`; worst/mode `family_cooperation_level`, `visit_outcome`.

**H. Interventions (`intervention_plans`)**  
Count of **Open** / **On Hold** plans; overdue plans (`target_date` before as-of date and not Achieved); counts by `plan_category` (Safety vs Psychosocial vs Education).

**I. Prior incidents (`incident_reports`)** — **careful**  
Counts by `incident_type` / `severity` in **lookback only** (not in target window if target is future incident). Prior high-severity count is a strong baseline feature.

### Interactions worth trying (after main effects EDA)

- `initial_risk_level` × (recent incident count or declining education slope).  
- `has_special_needs` or `sub_cat_*` × (session frequency or intervention backlog).  
- Safehouse `incident_count` (monthly) × resident-level stress features (house under stress + fragile resident).

### Transformations

- Log1p counts for rare events; clip extreme rates.  
- Standardize rolling features within **safehouse** or globally (justify in notebook).  
- Encode categoricals with **target encoding** only inside **CV train folds** to avoid leakage.

### EDA checklist (relationships to plot / test)

- Stratify outcomes by `safehouse_id`, `case_category`, `initial_risk_level`.  
- Time series: incident spikes vs monthly education/health for sample residents.  
- Correlation / association between **open intervention count** and future incidents.  
- Calibration: if predicting probability of “bad event,” reliability curve for staff trust.

### Leakage rules (non-negotiable)

- No `process_recordings`, `incident_reports`, or outcomes **on or after** the prediction as-of date for that row.  
- Do not use `current_risk_level` as both target and feature unless the problem is explicitly “replicate staff label” with a held-out time split.  
- `date_closed` and post-closure rows: define whether closed cases are excluded or scored only while active.

### Paired explanatory angle (IS 455)

After the classifier, add interpretable analysis: **coefficients / SHAP / partial dependence** on a subset of features — with language that **prediction ≠ causation** (which factors co-occur with higher risk, not proven causes).
