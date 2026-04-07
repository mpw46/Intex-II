# Haven — Design System & Style Guide

> Version 1.0 | Last updated: 2026-04-06
> Stack: React 19, TypeScript, Vite, Tailwind CSS v4

---

**READING INSTRUCTIONS FOR AI CODE GENERATORS**

This file is the single source of truth for all visual decisions in the Haven application. When generating any component, page, or UI fragment:

1. Use ONLY the color tokens defined in Section 2. Never invent hex values.
2. Use ONLY the typography scale in Section 3. Never hardcode font sizes.
3. Apply the exact Tailwind class patterns in Section 5. Never deviate for style.
4. Follow the DO/DON'T rules in Section 7 before writing a single line of JSX.
5. When in doubt, go calmer and warmer — this app serves trauma survivors.

---

## 1. Brand Identity

### 1.1 Name & Mission

**Haven** is a case management and public-facing platform for an organization dedicated to protecting girls from abuse and providing safe refuge. Every design decision in this app communicates safety, warmth, and institutional trustworthiness to two audiences:

- **Public visitors** (prospective donors, community members, families seeking help) — need to feel welcomed and empowered to act
- **Internal staff** (admins, social workers, case coordinators) — need clarity, efficiency, and a workspace that does not add to their emotional load

### 1.2 Design Philosophy: Warmth-Forward

Every decision prioritizes emotional safety and calm over efficiency signals:

- **Calming over clinical** — warm stone neutrals instead of cold grays; rounded corners; generous whitespace
- **Trustworthy over flashy** — restraint in animation; no aggressive alerts; no harsh reds; no gradients
- **Dignified over minimal** — enough visual richness to communicate care and investment, not austerity
- **Consistent over creative** — the color system, card shapes, and typography are rigid. Consistency is the trust signal.

### 1.3 Voice & Tone

| Context | Tone | Example |
|---|---|---|
| Public hero section | Hopeful, declarative, strong | "Restoring Safety. Rebuilding Lives." |
| Stat callouts | Grounded, factual, human | "342 girls served this year" |
| Form labels | Neutral, plain language | "Date of intake" (not "Intake timestamp") |
| Status indicators | Factual, never alarmist | "High Risk" (not "DANGER" or "CRITICAL") |
| Error messages | Calm, actionable | "We couldn't save this record. Please try again." |
| Empty states | Encouraging | "No cases match this filter yet." |
| Destructive confirmations | Precise, no drama | "Close this case" (not "DELETE CASE") |

### 1.4 Brand Signature

Solid teal (`haven-teal-600` / `#1a8a6e`) is Haven's connective thread. It appears on primary buttons, active nav indicators, focus rings, icon accents, and stat callout borders on **all page types** — both public and internal. This is what makes the app feel unified.

Violet (`haven-violet-600` / `#6d2fd4`) is a secondary accent used **only on public-facing pages** (e.g., the Donate button on the landing page). It is never used in the dashboard, case management, or any internal tool.

**No gradients of any kind appear anywhere in this application.** Gradients are a hallmark of AI-generated interfaces. All colors in Haven are solid.

---

## 2. Color System

### 2.1 Haven Teal (Primary Brand Color)

| Token | Hex | Usage |
|---|---|---|
| `haven-teal-50` | `#edfaf6` | Icon background tint, active nav bg, filter pill bg |
| `haven-teal-100` | `#d4f7ee` | Subtle tinted section backgrounds |
| `haven-teal-200` | `#a8edda` | Borders on tinted surfaces |
| `haven-teal-300` | `#6ddcbc` | Decorative accents |
| `haven-teal-400` | `#2ec49a` | Light-theme hover accents |
| `haven-teal-500` | `#1fa882` | Focus rings |
| `haven-teal-600` | `#1a8a6e` | **Primary button, active nav border, icon color** |
| `haven-teal-700` | `#166d57` | Primary button hover |
| `haven-teal-800` | `#115544` | Deep accent text on light teal bg |
| `haven-teal-900` | `#0d3330` | Dark section backgrounds (footer, login panel, hero overlay base) |
| `haven-teal-950` | `#0a2623` | Deepest shade, rarely used |

### 2.2 Haven Violet (Public Pages Accent Only)

| Token | Hex | Usage |
|---|---|---|
| `haven-violet-50` | `#f5f0ff` | Very light accent wash |
| `haven-violet-100` | `#ece4fd` | Subtle violet bg |
| `haven-violet-200` | `#d9cafc` | Violet tinted borders |
| `haven-violet-300` | `#bfa0f5` | Light decorative accents |
| `haven-violet-400` | `#a170f0` | Hover accents |
| `haven-violet-500` | `#8547e8` | Focus rings on violet buttons |
| `haven-violet-600` | `#6d2fd4` | **Donate button on landing page** |
| `haven-violet-700` | `#5424a3` | Donate button hover |
| `haven-violet-800` | `#3a1872` | Deep violet |
| `haven-violet-900` | `#230f4a` | Darkest violet |
| `haven-violet-950` | `#160a2e` | Nearly black violet |

**Violet is NEVER used on dashboard pages, navigation elements, form inputs, or status indicators.**

### 2.3 Neutral Scale — Warm Stone (Required)

All neutrals use Tailwind's built-in **`stone`** scale. Stone has a slight warm undertone vs. gray (which reads as cold and clinical). **Never use `gray-*`, `slate-*`, `zinc-*`, or `neutral-*` anywhere in this app.**

| Usage | Tailwind Class | Hex |
|---|---|---|
| Page background | `bg-stone-50` | `#fafaf9` |
| Card / panel background | `bg-white` | `#ffffff` |
| Subtle section background | `bg-stone-100` | `#f5f5f4` |
| Borders | `border-stone-200` | `#e7e5e4` |
| Placeholder / hint text | `text-stone-400` | `#a8a29e` |
| Muted / secondary text | `text-stone-500` | `#78716c` |
| Body text | `text-stone-700` | `#44403c` |
| Headings | `text-stone-900` | `#1c1917` |

### 2.4 Semantic Status Colors (Trauma-Informed)

These colors communicate case status. They are chosen to feel measured and professional, not alarming.

| Status | Badge bg | Badge text | Badge border |
|---|---|---|---|
| Active | `bg-emerald-100` | `text-emerald-800` | `border-emerald-200` |
| Pending | `bg-amber-100` | `text-amber-800` | `border-amber-200` |
| Follow-Up | `bg-sky-100` | `text-sky-800` | `border-sky-200` |
| Closed | `bg-stone-100` | `text-stone-600` | `border-stone-200` |
| High Risk | `bg-rose-100` | `text-rose-800` | `border-rose-200` |

**`red-*` is forbidden for any indicator. Use `rose-*` for high-risk and error states. Red reads as alarming; rose reads as serious but manageable.**

### 2.5 Dark Section Backgrounds

For dark areas (footer, login brand panel, impact/stats sections):

- Primary dark: `bg-haven-teal-900` (`#0d3330`)
- Alternative dark: `bg-stone-900` (`#1c1917`) — footer only
- Hero photo overlay: `bg-stone-950/75` (solid with opacity, **not a gradient**)

### 2.6 Color Rules Summary

1. Primary buttons use `bg-haven-teal-600 hover:bg-haven-teal-700` on **every page type** without exception.
2. Violet is used **only** for the public Donate CTA — nowhere else.
3. **No gradient classes** (`bg-gradient-*`, `from-*`, `to-*`) anywhere in the codebase.
4. All neutrals are `stone-*`. No exceptions.
5. Destructive actions use `bg-rose-600 hover:bg-rose-700` — never teal, never violet.
6. Never place `text-stone-500` on a `stone-200` background — it fails contrast.

---

## 3. Typography

### 3.1 Font

**Inter** — humanist sans-serif, highly legible at small sizes, excellent for both display text and UI labels.

Load via Google Fonts in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

Inter is registered as the default `font-sans` in the Tailwind config (see Section 7). All text in the app uses Inter. Never fall back to system-ui in Haven components.

### 3.2 Type Scale

| Role | Size | Weight | Tailwind Classes |
|---|---|---|---|
| Display — hero H1 | 60px | 800 | `text-6xl font-extrabold leading-tight tracking-tight` |
| Page Title — H1 internal | 36px | 700 | `text-4xl font-bold leading-snug tracking-tight` |
| Section Heading — H2 | 28px | 700 | `text-3xl font-bold leading-snug` |
| Card Heading — H3 | 20px | 600 | `text-xl font-semibold leading-normal` |
| Subheading — H4 | 16px | 600 | `text-base font-semibold leading-relaxed` |
| Body large | 16px | 400 | `text-base font-normal leading-relaxed` |
| Body default | 14px | 400 | `text-sm font-normal leading-relaxed` |
| Body small | 13px | 400 | `text-[13px] font-normal leading-relaxed` |
| Label / UI text | 12px | 500 | `text-xs font-medium` |
| Eyebrow / overline | 11px | 600 | `text-[11px] font-semibold uppercase tracking-widest` |
| KPI stat number | 40px | 700 | `text-5xl font-bold tabular-nums` |
| KPI stat label | 13px | 500 | `text-[13px] font-medium text-stone-500` |
| Badge text | 11px | 600 | `text-[11px] font-semibold uppercase tracking-wide` |
| Table header | 12px | 600 | `text-xs font-semibold uppercase tracking-wider text-stone-500` |
| Table cell | 14px | 400 | `text-sm text-stone-700` |

### 3.3 Typography Rules

1. The Display size (`text-6xl`) is reserved exclusively for the public landing page hero H1.
2. Headings on public/hero pages are white (`text-white`). Headings on internal pages are `text-stone-900`.
3. All numerical KPI values use `tabular-nums` so digits align.
4. Eyebrow labels use the overline style: uppercase, wide tracking, `text-stone-500` on light backgrounds, `text-white/60` on dark backgrounds.
5. Never use font-weight below 400 anywhere.
6. Body text minimum line-height is `leading-relaxed` (1.625). Dense UI text minimum is `leading-normal` (1.5).
7. Truncate long strings in table cells: `truncate max-w-[200px]`.
8. ALL-CAPS text is only permitted for badge labels and table headers.

---

## 4. Spacing & Layout

### 4.1 Core Layout

| Element | Value | Tailwind |
|---|---|---|
| Sidebar width | 240px | `w-60` |
| Content offset (desktop) | 240px | `lg:ml-60` |
| Top nav height | 64px | `h-16` |
| Card inner padding | 20–24px | `p-5` / `p-6` |
| Public page container | 1280px max | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Dashboard content area | 1152px max | `max-w-6xl mx-auto` |
| Between cards | 16px | `gap-4` |
| Section vertical spacing (public) | 80–112px | `py-20 md:py-28` |
| Modal width | 512px | `max-w-lg` |

### 4.2 Border Radius

| Element | Tailwind |
|---|---|
| Cards (all types) | `rounded-xl` |
| Buttons | `rounded-lg` |
| Inputs / selects | `rounded-lg` |
| Badges | `rounded-full` |
| Modals / dialogs | `rounded-2xl` |
| Filter pills / tags | `rounded-md` |
| Sidebar nav items | `rounded-lg` |
| Avatars | `rounded-full` |
| Tooltips | `rounded-md` |

### 4.3 Shadow Scale

| Element | Tailwind |
|---|---|
| Surface cards (default) | `shadow-sm` |
| Surface cards (hover) | `shadow-md` |
| Modals / dialogs | `shadow-xl` |
| Dropdown menus | `shadow-lg ring-1 ring-stone-900/5` |
| Top navigation | `border-b border-stone-200` (no shadow) |
| Glass cards | none (backdrop-blur is the depth cue) |

---

## 4a. Responsive Design (Mobile-First, Required)

The app must be fully functional on mobile and tablet screens — not just "not broken." Design mobile-first, then enhance for larger screens.

### Breakpoint Behaviors

| Element | Mobile (default / `< lg`) | Desktop (`lg+`) |
|---|---|---|
| Sidebar | Hidden; replaced by slide-in drawer triggered by hamburger | Fixed left `w-60` |
| Top nav | Full-width; hamburger icon on left (`lg:hidden`) | Offset `lg:left-60` |
| Main content offset | None (full width) | `lg:ml-60` |
| KPI cards grid | `grid-cols-2` | `grid-cols-4` |
| Case list cards | Full-width stacked | Full-width in main column |
| Filter bar | Wraps to multiple lines | Single row |
| Tables | `overflow-x-auto` horizontal scroll | Full table |
| Modal | Full-screen (`fixed inset-0 rounded-none`) | Centered `max-w-lg rounded-2xl` |
| Login split layout | Single column (brand panel hidden) | Two columns |
| Hero headline | `text-4xl` | `text-6xl` |
| Hero CTA buttons | `flex-col gap-3` stacked | `flex-row gap-4` inline |
| Hero KPI stat row | `grid-cols-2` | `grid-cols-4` |
| Page padding | `px-4 py-4` | `px-6 py-8` |

### Mobile Sidebar Drawer Pattern

```tsx
{/* Mobile: slide-in drawer */}
<div className="lg:hidden">
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-stone-900/50 z-20"
    onClick={closeDrawer}
    aria-hidden="true"
  />
  {/* Drawer */}
  <aside className="fixed inset-y-0 left-0 w-64 bg-white z-30 shadow-xl
                    flex flex-col transition-transform duration-250 ease-in-out">
    {/* Same nav content as desktop sidebar */}
  </aside>
</div>

{/* Desktop: always-visible fixed sidebar */}
<aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-white
                  border-r border-stone-200 flex-col z-20">
  {/* nav content */}
</aside>
```

### Mobile Top Nav (Hamburger)

```tsx
<header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-stone-200
                   flex items-center justify-between px-4 z-10 lg:left-60">
  <button
    className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100
               focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-haven-teal-500 focus-visible:ring-offset-1"
    onClick={openDrawer}
    aria-label="Open navigation"
  >
    <Bars3Icon className="h-6 w-6" />
  </button>
  {/* Page title + right-side actions */}
</header>
```

### Touch Targets

All interactive elements must have a minimum tap target of **44×44px** on mobile. Specific guidance:

- Icon-only buttons: `p-2.5` with `h-5 w-5` icon (44px result)
- Sidebar nav items: `py-2.5` height is sufficient
- Table action buttons (View/Edit/Close): add `py-2 px-3` on mobile via `sm:` prefix if needed

---

## 5. Component Patterns

This is the canonical reference. Copy-paste these class strings exactly.

---

### 5.1 Buttons

#### Primary Button — Teal (all pages, all contexts)

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  px-5 py-2.5
  bg-haven-teal-600
  text-white text-sm font-semibold
  rounded-lg
  transition-colors duration-150
  hover:bg-haven-teal-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Save Case
</button>
```

#### Primary Button Large — Landing Page CTA

Same as above with `px-8 py-4 text-base` and a subtle lift on hover:

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  px-8 py-4
  bg-haven-teal-600
  text-white text-base font-semibold
  rounded-lg
  transition-all duration-150
  hover:bg-haven-teal-700 hover:-translate-y-px
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
">
  See the Impact
</button>
```

#### Donate Button — Violet (landing page only)

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  px-8 py-4
  bg-haven-violet-600
  text-white text-base font-semibold
  rounded-lg
  transition-colors duration-150
  hover:bg-haven-violet-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-haven-violet-500 focus-visible:ring-offset-2
">
  Donate
</button>
```

**This violet button pattern is used ONLY on public-facing pages. Never on dashboard or internal pages.**

#### Secondary Button — Ghost

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  px-5 py-2.5
  bg-white
  text-stone-700 text-sm font-medium
  rounded-lg
  border border-stone-300
  transition-colors duration-150
  hover:bg-stone-50 hover:border-stone-400
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Cancel
</button>
```

#### Destructive Button — Close / Delete

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  px-5 py-2.5
  bg-rose-600
  text-white text-sm font-semibold
  rounded-lg
  transition-colors duration-150
  hover:bg-rose-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-rose-500 focus-visible:ring-offset-2
">
  Close Case
</button>
```

#### Icon-Only Button (top nav, toolbars)

```tsx
<button className="
  p-2
  text-stone-500
  rounded-lg
  transition-colors duration-150
  hover:bg-stone-100 hover:text-stone-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-haven-teal-500 focus-visible:ring-offset-1
">
  <BellIcon className="h-5 w-5" aria-hidden="true" />
  <span className="sr-only">Notifications</span>
</button>
```

#### Table Row Actions (text links, not full buttons)

```tsx
<button className="text-sm font-medium text-haven-teal-600
  hover:text-haven-teal-700 transition-colors duration-150">
  View
</button>
<button className="text-sm font-medium text-stone-600
  hover:text-stone-900 transition-colors duration-150">
  Edit
</button>
<button className="text-sm font-medium text-rose-600
  hover:text-rose-700 transition-colors duration-150 transition-none">
  Close
</button>
```

---

### 5.2 Status Badges

All badges follow the same structural pattern — only color classes vary:

```tsx
<span className="
  inline-flex items-center gap-1
  px-2.5 py-0.5
  rounded-full
  text-[11px] font-semibold uppercase tracking-wide
  border
  {color classes — see table below}
">
  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
  Active
</span>
```

| Status | Classes |
|---|---|
| Active | `bg-emerald-100 text-emerald-800 border-emerald-200` |
| Pending | `bg-amber-100 text-amber-800 border-amber-200` |
| Follow-Up | `bg-sky-100 text-sky-800 border-sky-200` |
| Closed | `bg-stone-100 text-stone-600 border-stone-200` |
| High Risk | `bg-rose-100 text-rose-800 border-rose-200` |

Add `role="status"` and `aria-label="Case status: Active"` for accessibility.

Badge text is always capitalized (e.g., "Active" not "ACTIVE" or "active").

---

### 5.3 Cards

#### Surface Card — Dashboard / Internal Pages

```tsx
<div className="
  bg-white
  rounded-xl
  border border-stone-200
  shadow-sm
  p-6
  transition-shadow duration-200
  hover:shadow-md
">
  {/* content */}
</div>
```

#### Glass Card — Hero / Dark Section Backgrounds

```tsx
<div className="
  bg-white/10
  backdrop-blur-md
  rounded-xl
  border border-white/20
  p-6
  text-white
">
  {/* content */}
</div>
```

#### KPI Stat Card

Used in both hero overlays and dashboard KPI rows. Same data structure, two visual variants via `variant` prop.

```tsx
interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ReactNode;
  variant: 'surface' | 'glass';
}
```

**Surface variant:**
```tsx
<div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-5xl font-bold tabular-nums text-stone-900">
        {value}
      </p>
      {delta && (
        <p className="mt-1 text-[13px] font-medium text-emerald-700">{delta}</p>
      )}
    </div>
    {icon && (
      <div className="p-2 bg-haven-teal-50 rounded-lg text-haven-teal-600">
        {icon}
      </div>
    )}
  </div>
</div>
```

**Glass variant:**
```tsx
<div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-5">
  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
    {label}
  </p>
  <p className="mt-1 text-5xl font-bold tabular-nums text-white">
    {value}
  </p>
  {delta && (
    <p className="mt-1 text-[13px] font-medium text-haven-teal-300">{delta}</p>
  )}
</div>
```

#### Case List Card — Inventory Views

```tsx
<div className="
  bg-white
  rounded-xl
  border border-stone-200
  shadow-sm
  p-5
  flex items-start justify-between gap-4
  hover:shadow-md hover:border-stone-300
  transition-all duration-200
">
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-3 mb-1">
      <span className="text-base font-semibold text-stone-900 truncate">{caseId}</span>
      <StatusBadge status={status} />
    </div>
    <p className="text-sm text-stone-500">Counselor: {counselorName}</p>
    <p className="text-sm text-stone-500 mt-0.5">Opened: {openedDate}</p>
  </div>
  <div className="flex items-center gap-4 shrink-0">
    {/* View / Edit / Close text links */}
  </div>
</div>
```

---

### 5.4 Forms & Inputs

#### Text Input

```tsx
<input
  type="text"
  className="
    w-full
    px-4 py-2.5
    bg-white
    border border-stone-300
    rounded-lg
    text-sm text-stone-900
    placeholder:text-stone-400
    transition-colors duration-150
    hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent
    disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed
  "
/>
```

Select and Textarea follow the same pattern. Textarea adds `resize-y min-h-[100px]`.

#### Search Bar

```tsx
<div className="relative">
  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" aria-hidden="true" />
  <input
    type="search"
    placeholder="Search cases..."
    className="
      w-full pl-9 pr-4 py-2.5
      bg-white border border-stone-300 rounded-lg
      text-sm text-stone-900 placeholder:text-stone-400
      focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent
    "
  />
</div>
```

#### Form Field Wrapper

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-stone-700">
    Date of intake
    {required && <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>}
  </label>
  {/* input here */}
  {error && (
    <p className="text-xs text-rose-600 flex items-center gap-1 transition-none" role="alert">
      <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {error}
    </p>
  )}
</div>
```

#### Active Filter Pill

```tsx
<span className="
  inline-flex items-center gap-1.5
  px-3 py-1
  bg-haven-teal-50 text-haven-teal-800 text-xs font-medium
  rounded-md border border-haven-teal-200
">
  Status: Active
  <button
    className="hover:text-haven-teal-600 transition-colors duration-150"
    aria-label="Remove filter"
  >
    <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
  </button>
</span>
```

---

### 5.5 Navigation

#### Sidebar

```tsx
<aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-white
                  border-r border-stone-200 flex-col z-20">

  {/* Logo zone */}
  <div className="h-16 flex items-center px-5 border-b border-stone-200">
    <span className="text-xl font-bold text-stone-900 tracking-tight">Haven</span>
  </div>

  {/* Nav */}
  <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">

    {/* Active item */}
    <a
      href="/dashboard"
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                 bg-haven-teal-50 text-sm font-semibold text-haven-teal-800
                 border-l-2 border-haven-teal-600"
      aria-current="page"
    >
      <HomeIcon className="h-5 w-5 text-haven-teal-600" aria-hidden="true" />
      Dashboard
    </a>

    {/* Inactive item */}
    <a
      href="/cases"
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                 text-sm font-medium text-stone-600
                 transition-colors duration-150
                 hover:bg-stone-100 hover:text-stone-900"
    >
      <FolderIcon className="h-5 w-5 text-stone-400" aria-hidden="true" />
      Caseload
    </a>
  </nav>

  {/* User zone */}
  <div className="p-3 border-t border-stone-200">
    <div className="flex items-center gap-3 px-3 py-2">
      <img className="h-8 w-8 rounded-full object-cover" src={avatarSrc} alt={name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 truncate">{name}</p>
        <p className="text-xs text-stone-500 truncate">{role}</p>
      </div>
    </div>
  </div>
</aside>
```

#### Dashboard Top Nav Bar

```tsx
<header className="fixed top-0 inset-x-0 lg:left-60 h-16 bg-white
                   border-b border-stone-200 flex items-center
                   justify-between px-4 lg:px-6 z-10">
  {/* Hamburger (mobile only) */}
  <button className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100"
          aria-label="Open navigation">
    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
  </button>

  <h1 className="text-xl font-semibold text-stone-900">{pageTitle}</h1>

  <div className="flex items-center gap-2">
    {/* Icon button actions */}
    <img className="h-8 w-8 rounded-full object-cover" src={avatarSrc} alt="Your account" />
  </div>
</header>
```

#### Public Top Nav (Landing)

Transparent on load, transitions to solid white on scroll. Use a scroll listener to add a class:

```tsx
<nav className={`
  fixed top-0 inset-x-0 h-16 z-30
  flex items-center justify-between px-6 md:px-12
  transition-all duration-300
  ${scrolled
    ? 'bg-white border-b border-stone-200 shadow-sm'
    : 'bg-transparent'
  }
`}>
  <span className={`text-xl font-bold ${scrolled ? 'text-stone-900' : 'text-white'}`}>
    Haven
  </span>
  <div className="flex items-center gap-6">
    <a href="/about" className={`text-sm font-medium ${scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'} transition-colors`}>About</a>
    <a href="/impact" className={`text-sm font-medium ${scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'} transition-colors`}>Impact</a>
    <DonateButton />
    <a href="/login" className={`text-sm font-medium ${scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'} transition-colors`}>Login</a>
  </div>
</nav>
```

---

### 5.6 Alerts & Notices

```tsx
{/* Info */}
<div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-200 rounded-lg" role="status">
  <InformationCircleIcon className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />
  <p className="text-sm text-sky-800">{message}</p>
</div>

{/* Success */}
<div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg" role="status">
  <CheckCircleIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
  <p className="text-sm text-emerald-800">{message}</p>
</div>

{/* Warning */}
<div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg" role="status">
  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
  <p className="text-sm text-amber-800">{message}</p>
</div>

{/* High-Risk Notice */}
<div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg transition-none" role="alert">
  <ShieldExclamationIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
  <p className="text-sm text-rose-800">{message}</p>
</div>
```

---

### 5.7 Tables

```tsx
<div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <caption className="sr-only">Case list</caption>
      <thead>
        <tr className="bg-stone-50 border-b border-stone-200">
          <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Resident ID
          </th>
          <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Date
          </th>
          <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        <tr className="hover:bg-stone-50 transition-colors duration-100">
          <td className="px-4 py-3.5 text-sm text-stone-700">HVL-1023</td>
          <td className="px-4 py-3.5 text-sm text-stone-700">May 12, 2024</td>
          <td className="px-4 py-3.5"><StatusBadge status="high-risk" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

### 5.8 Pagination

```tsx
<div className="flex items-center justify-between px-4 py-3 border-t border-stone-200">
  <p className="text-sm text-stone-500">
    Showing <span className="font-medium text-stone-700">1–20</span> of{' '}
    <span className="font-medium text-stone-700">347</span> results
  </p>
  <nav aria-label="Pagination" className="flex items-center gap-1">
    <button className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-40 transition-colors"
            aria-label="Previous page" disabled>
      <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
    </button>

    {/* Active page — solid teal, NOT a gradient */}
    <button className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-haven-teal-600 text-white"
            aria-current="page">
      1
    </button>

    {/* Inactive pages */}
    <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors">
      2
    </button>

    <span className="px-2 text-stone-400 text-sm">…</span>

    <button className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            aria-label="Next page">
      <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  </nav>
</div>
```

---

### 5.9 Modals / Dialogs

```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50
                flex items-end sm:items-center justify-center p-0 sm:p-4"
     role="dialog" aria-modal="true" aria-labelledby="modal-title">

  {/* Panel — full-screen on mobile, centered card on sm+ */}
  <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-none
                  shadow-xl overflow-hidden">

    {/* Header */}
    <div className="flex items-start justify-between p-6 border-b border-stone-200">
      <div>
        <h2 id="modal-title" className="text-xl font-semibold text-stone-900">{title}</h2>
        {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      <button className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600
                         transition-colors duration-150"
              aria-label="Close modal">
        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    {/* Body */}
    <div className="p-6 space-y-4">
      {children}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 px-6 py-4
                    bg-stone-50 border-t border-stone-200">
      <SecondaryButton>Cancel</SecondaryButton>
      <PrimaryButton>Confirm</PrimaryButton>
    </div>
  </div>
</div>
```

---

### 5.10 Page Layout Shells

#### Dashboard Shell

```tsx
<div className="min-h-screen bg-stone-50">
  <Sidebar />          {/* Fixed left, w-60, hidden on mobile */}
  <MobileDrawer />     {/* Slide-in, lg:hidden */}

  <div className="lg:ml-60">
    <TopNav />         {/* Fixed, h-16, includes mobile hamburger */}
    <main id="main-content" className="pt-16 p-4 lg:p-6 max-w-6xl mx-auto">
      {children}
    </main>
  </div>
</div>
```

#### Public Page Shell

```tsx
<div className="min-h-screen bg-stone-50">
  <PublicNav />        {/* Fixed, transparent → white on scroll */}
  <main id="main-content">
    {/* First child is always <HeroSection /> */}
    {children}
  </main>
  <Footer />           {/* bg-stone-900 dark */}
</div>
```

---

## 6. Page Templates

### 6.1 Landing / Hero Page

Section order:

1. **Hero** — Full-bleed photo, `bg-stone-950/75` solid overlay, eyebrow label, headline, subline, teal primary CTA + violet Donate CTA (stacked on mobile, inline on desktop), glass KPI stat row floating at bottom
2. **Mission** — `bg-stone-50`, 3-col feature cards with `haven-teal-50` icon tiles
3. **Impact** — `bg-haven-teal-900` solid dark, glass KPI cards, pull quote
4. **How We Help** — `bg-white`, 3-step numbered process cards
5. **Get Involved** — `bg-stone-100`, two action cards side by side
6. **Footer** — `bg-stone-900`, white text, nav links, mission statement

**Hero section structure:**

```tsx
<section className="relative min-h-screen flex flex-col justify-end">
  {/* Background photo — decorative */}
  <img
    src={heroPhoto}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />

  {/* Solid dark overlay — NOT a gradient */}
  <div className="absolute inset-0 bg-stone-950/75" aria-hidden="true" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-6 pb-20 lg:pb-32 w-full">
    <div className="max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-4">
        Haven · Safe Refuge
      </p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6">
        Restoring Safety.<br />Rebuilding Lives.
      </h1>
      <p className="text-base lg:text-lg text-white/80 leading-relaxed mb-10 max-w-lg">
        Haven provides safe refuge, advocacy, and long-term support for girls
        who have experienced abuse.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <PrimaryButtonLarge>See the Impact</PrimaryButtonLarge>
        <DonateButton>Donate</DonateButton>
      </div>
    </div>

    {/* Floating KPI stat row */}
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard variant="glass" label="Lives Impacted" value="342" />
      <KpiCard variant="glass" label="Safe Homes" value="28" />
      <KpiCard variant="glass" label="Reintegration Success" value="95%" />
      <KpiCard variant="glass" label="Years of Service" value="12" />
    </div>
  </div>
</section>
```

---

### 6.2 Dashboard Overview

```
[Top Nav: h-16]
[Sidebar: w-60 fixed]

[Main content: pt-16 lg:ml-60]
  ├── Page header row: title left, optional action button right
  ├── Eyebrow: "Overview"
  ├── KPI row: grid grid-cols-2 lg:grid-cols-4 gap-4
  │     KpiCard (surface) × 4
  ├── Section heading: "Recent Cases"
  ├── Filter bar: bg-white rounded-xl border border-stone-200 p-4
  │     search input + status dropdown + date filter
  └── Case list: space-y-3
        CaseListCard × N
        Pagination
```

---

### 6.3 Case List / Inventory

```
[Header row]
  ├── Left: page title (text-4xl font-bold text-stone-900)
  └── Right: Primary "New Case" button

[Alert banner — if applicable]
  e.g. "AI detected 3 high-risk cases this week"
  → bg-amber-50 border border-amber-200 rounded-lg p-4 flex justify-between

[Filter bar]
  bg-white rounded-xl border border-stone-200 shadow-sm p-4
  ├── Search bar (left)
  └── Status | Risk Level | Counselor | Date Range filters (right)

[Results count]
  text-sm text-stone-500

[Case cards]
  space-y-3
  CaseListCard × N

[Pagination]
```

---

### 6.4 Login / Auth Page

Split-panel layout. Brand panel hidden on mobile.

```tsx
<div className="min-h-screen flex">

  {/* Left — dark brand panel (desktop only) */}
  <div className="hidden lg:flex flex-col justify-between w-[480px] min-h-screen
                  bg-haven-teal-900 p-12 text-white">
    <span className="text-2xl font-bold">Haven</span>
    <div>
      <blockquote className="text-xl font-light leading-relaxed text-white/90 mb-8">
        "Every girl deserves safety, dignity, and the chance to heal."
      </blockquote>
      <div className="grid grid-cols-2 gap-3">
        <KpiCard variant="glass" label="Girls Supported" value="1,247" />
        <KpiCard variant="glass" label="Years of Service" value="12" />
      </div>
    </div>
    <p className="text-xs text-white/40">Haven &copy; 2026. Protecting the vulnerable.</p>
  </div>

  {/* Right — form panel */}
  <div className="flex-1 flex items-center justify-center bg-stone-50 p-6 lg:p-12">
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Welcome back</h1>
      <p className="text-stone-500 mb-8">Sign in to your Haven account.</p>
      {/* form fields */}
      <PrimaryButton className="w-full justify-center mt-6">Sign In</PrimaryButton>
    </div>
  </div>

</div>
```

---

### 6.5 Admin / Settings View

```tsx
<div className="space-y-6">
  <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
    <div className="px-6 py-4 border-b border-stone-200">
      <h3 className="text-base font-semibold text-stone-900">User Management</h3>
      <p className="text-sm text-stone-500 mt-0.5">Manage staff access and roles.</p>
    </div>
    <div className="p-6">
      {/* table or list content */}
    </div>
  </div>
  {/* repeat for each settings section */}
</div>
```

---

### 6.6 Public Stats / Impact Page

Uses the same glass KPI cards from the hero section, on a `bg-haven-teal-900` background. This demonstrates component reuse — the `KpiCard` component with `variant="glass"` works identically here.

---

## 7. AI Generation Rules

These rules are written for AI code generators. Follow them precisely.

### DO Rules

1. **DO** use `bg-haven-teal-600 hover:bg-haven-teal-700` for ALL primary buttons, on every page type without exception.
2. **DO** use `bg-haven-violet-600 hover:bg-haven-violet-700` only for the Donate CTA on the public landing page — nowhere else.
3. **DO** use the `stone-*` scale for all neutral colors. No other neutral family.
4. **DO** use `rose-*` for all error states and high-risk indicators.
5. **DO** apply `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2` to every interactive element.
6. **DO** add `transition-none` to High Risk badges, Close Case buttons, error messages, and crisis contact info sections.
7. **DO** wrap all tables in `overflow-x-auto` for mobile horizontal scroll.
8. **DO** use `lg:ml-60` for the main content offset. Never `ml-60` without the `lg:` prefix.
9. **DO** include a hamburger `<button className="lg:hidden ...">` in the dashboard top nav.
10. **DO** use `bg-stone-950/75` (solid with opacity) for the hero photo overlay.
11. **DO** make all hero headlines responsive: `text-4xl md:text-5xl lg:text-6xl`.
12. **DO** stack CTA buttons on mobile: `flex flex-col sm:flex-row`.
13. **DO** use `tabular-nums` on all KPI stat numbers.
14. **DO** use `rounded-xl` on all cards, `rounded-lg` on all buttons and inputs, `rounded-full` on all badges.
15. **DO** use `role="dialog" aria-modal="true"` on modals and `aria-label` on all icon-only buttons.

### DON'T Rules

1. **NEVER use any gradient** — no `bg-gradient-*`, no `from-*`, no `to-*` classes anywhere in the codebase. Gradients look AI-generated.
2. **NEVER use `gray-*`, `slate-*`, `zinc-*`, or `neutral-*`** for neutral colors. Stone only.
3. **NEVER use `red-*`** for any indicator, error, or status. Use `rose-*`.
4. **NEVER use `blue-*`** for primary actions. Teal is the brand color.
5. **NEVER use the default browser focus outline** (`outline: auto`). Always use the teal ring system.
6. **NEVER use `shadow-xl`** on surface cards — that shadow level is reserved for modals only.
7. **NEVER use ALL-CAPS text** except for badge labels and table column headers.
8. **NEVER place `text-stone-500` on a `stone-200` background** — the contrast ratio is insufficient.
9. **NEVER use the violet color on any dashboard or internal page** — it is public-pages-only.
10. **NEVER apply hover effects to disabled buttons** — disabled state is `opacity-50 cursor-not-allowed`, nothing more.
11. **NEVER animate** High Risk badge appearance, Close Case confirmation dialogs, form error messages, or crisis contact text.
12. **NEVER use the solid dark background (`bg-haven-teal-900`) on internal dashboard pages** — it is for public impact sections, the login brand panel, and the footer only.
13. **NEVER hardcode hex values** in className strings. Use the haven token names (`haven-teal-600`) or Tailwind built-ins (`emerald-100`).
14. **NEVER omit `aria-hidden="true"`** on decorative images, icons inside labeled buttons, and status indicator dots.
15. **NEVER use `<br>` for spacing** between elements. Use margin/padding utilities.

---

### Tailwind CSS v4 Configuration

Tailwind CSS v4 uses a CSS-first configuration. Replace `frontend/src/index.css` with:

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Haven Teal Palette */
  --color-haven-teal-50:  #edfaf6;
  --color-haven-teal-100: #d4f7ee;
  --color-haven-teal-200: #a8edda;
  --color-haven-teal-300: #6ddcbc;
  --color-haven-teal-400: #2ec49a;
  --color-haven-teal-500: #1fa882;
  --color-haven-teal-600: #1a8a6e;
  --color-haven-teal-700: #166d57;
  --color-haven-teal-800: #115544;
  --color-haven-teal-900: #0d3330;
  --color-haven-teal-950: #0a2623;

  /* Haven Violet Palette (public pages only) */
  --color-haven-violet-50:  #f5f0ff;
  --color-haven-violet-100: #ece4fd;
  --color-haven-violet-200: #d9cafc;
  --color-haven-violet-300: #bfa0f5;
  --color-haven-violet-400: #a170f0;
  --color-haven-violet-500: #8547e8;
  --color-haven-violet-600: #6d2fd4;
  --color-haven-violet-700: #5424a3;
  --color-haven-violet-800: #3a1872;
  --color-haven-violet-900: #230f4a;
  --color-haven-violet-950: #160a2e;
}

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

@layer base {
  html {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    @apply bg-stone-50 text-stone-700;
  }

  /* Suppress default focus outline — use ring system instead */
  *:focus {
    outline: none;
  }
  *:focus-visible {
    outline: 2px solid theme(colors.haven-teal.500);
    outline-offset: 2px;
  }

  /* Respect user motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

Also update `frontend/vite.config.ts` to add the Tailwind Vite plugin:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

And add Inter font preconnect to `frontend/index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

---

### Color Token Quick Reference

Copy-paste cheat sheet for building any page:

```
PRIMARY BUTTON:      bg-haven-teal-600 hover:bg-haven-teal-700
DONATE BUTTON:       bg-haven-violet-600 hover:bg-haven-violet-700  ← landing page only
DESTRUCTIVE:         bg-rose-600 hover:bg-rose-700
GHOST BUTTON:        bg-white border border-stone-300 hover:bg-stone-50
FOCUS RING:          focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2

PAGE BG:             bg-stone-50
CARD (internal):     bg-white rounded-xl border border-stone-200 shadow-sm
CARD (hero/dark):    bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
DARK SECTION:        bg-haven-teal-900
HERO OVERLAY:        bg-stone-950/75  ← NOT a gradient

ACTIVE NAV ITEM:     bg-haven-teal-50 border-l-2 border-haven-teal-600 text-haven-teal-800
ACTIVE PAGE NUM:     bg-haven-teal-600 text-white  ← solid, NOT gradient
ICON BG TINT:        bg-haven-teal-50 text-haven-teal-600
FILTER PILL:         bg-haven-teal-50 text-haven-teal-800 border border-haven-teal-200

HEADING TEXT:        text-stone-900
BODY TEXT:           text-stone-700
SECONDARY TEXT:      text-stone-500
PLACEHOLDER:         placeholder:text-stone-400
BORDER:              border-stone-200
DIVIDER:             divide-stone-100

STATUS BADGES:
  Active:    bg-emerald-100 text-emerald-800 border-emerald-200
  Pending:   bg-amber-100 text-amber-800 border-amber-200
  Follow-Up: bg-sky-100 text-sky-800 border-sky-200
  Closed:    bg-stone-100 text-stone-600 border-stone-200
  High Risk: bg-rose-100 text-rose-800 border-rose-200
```

---

## 8. Accessibility Standards

### 8.1 WCAG 2.1 AA Requirements

Haven must meet WCAG 2.1 AA for all pages. The app serves vulnerable populations — accessibility is non-negotiable.

**Contrast ratios (required pairs):**

| Text / Background | Ratio | Status |
|---|---|---|
| `text-stone-700` on `bg-white` | 5.74:1 | Pass |
| `text-stone-700` on `bg-stone-50` | 5.51:1 | Pass |
| `text-stone-900` on `bg-white` | 16.75:1 | Pass |
| `text-white` on `bg-haven-teal-600` | 4.72:1 | Pass |
| `text-white` on `bg-haven-teal-900` | 14.2:1 | Pass |
| `text-emerald-800` on `bg-emerald-100` | 6.1:1 | Pass |
| `text-rose-800` on `bg-rose-100` | 5.8:1 | Pass |
| `text-stone-500` on `bg-stone-50` | 4.6:1 | Pass |
| `text-stone-500` on `bg-stone-200` | 2.1:1 | **FAIL — never use** |

### 8.2 Focus States

Every interactive element must have a visible focus indicator when navigated by keyboard.

**Standard (light backgrounds):**
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2
```

**On dark backgrounds** (login panel, footer, hero):
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-haven-teal-900
```

Never write `focus:outline-none` without a compensating visible indicator.

### 8.3 Touch Targets

Minimum 44×44px on mobile. Enforce via padding:
- Buttons with `p-2.5` and `h-5 w-5` icon = 44px minimum
- Sidebar nav items with `py-2.5` meet height requirement
- Table row actions: use `py-2 px-3` when on mobile-first tables

### 8.4 Semantic HTML

Use proper landmark elements on every page:

```html
<header>   <!-- top nav -->
<nav>      <!-- sidebar navigation, public nav -->
<main>     <!-- primary page content, always with id="main-content" -->
<aside>    <!-- sidebar shell element -->
<footer>   <!-- page footer -->
```

### 8.5 ARIA Patterns

```tsx
// Active nav link
<a aria-current="page" ...>Dashboard</a>

// Status badge
<span role="status" aria-label="Case status: Active">...</span>

// Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Close Case</h2>
</div>

// Table
<table>
  <caption className="sr-only">Case inventory list</caption>
  ...
</table>
<th scope="col">...</th>

// Icon-only button
<button aria-label="Open notifications">
  <BellIcon aria-hidden="true" />
</button>

// Decorative image
<img src="..." alt="" aria-hidden="true" />

// Required field error
<input aria-required="true" aria-describedby="field-error" />
<p id="field-error" role="alert" className="transition-none">{error}</p>
```

### 8.6 Screen Reader Utilities

```tsx
{/* Visually hidden */}
<span className="sr-only">Current page: Dashboard</span>

{/* Skip navigation — visible only on keyboard focus */}
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
             focus:px-4 focus:py-2 focus:bg-white focus:text-stone-900
             focus:rounded-lg focus:shadow-lg focus:border focus:border-stone-200"
>
  Skip to main content
</a>
```

### 8.7 Color Alone

Never convey status, error, or category using color alone. Always pair color with:
- A text label (e.g., the word "Active" inside a badge)
- An icon (e.g., `CheckCircleIcon` alongside a success message)
- A pattern (e.g., the dot indicator inside status badges)

---

## 9. Motion & Animation

### 9.1 Duration Guidelines

| Interaction | Duration | Easing | Tailwind |
|---|---|---|---|
| Button / link hover color | 150ms | ease-in-out | `transition-colors duration-150` |
| Button hover lift | 150ms | ease-out | `transition-all duration-150` |
| Card shadow on hover | 200ms | ease-out | `transition-shadow duration-200` |
| Card border on hover | 200ms | ease-out | `transition-all duration-200` |
| Modal appear | 200ms | ease-out | `transition-all duration-200` |
| Sidebar drawer (mobile) | 250ms | ease-in-out | `transition-transform duration-250` |
| Page fade-in | 300ms | ease-out | `transition-opacity duration-300` |

**Maximum duration anywhere in the app: 400ms.**

### 9.2 Easing

- `ease-out` — for elements entering (modals, drawers, tooltips appearing)
- `ease-in` — for elements exiting
- `ease-in-out` — for hover state changes
- Never use `ease-linear` — it reads as mechanical

### 9.3 Animation Prohibition Zones

These elements must have `transition-none` applied — zero animation:

| Element | Reason |
|---|---|
| High Risk status badge | Animation on critical status reads as alarm/alert |
| Close Case confirm button | Final destructive action must feel deliberate |
| Form error messages | Delayed appearance is an accessibility failure |
| Crisis contact information | Emergency content must be instantly available |
| Any text containing hotline numbers | Same as above |

```tsx
{/* Example — error must appear without animation */}
<p role="alert" className="text-xs text-rose-600 transition-none">{error}</p>

{/* Example — high risk badge */}
<StatusBadge status="high-risk" className="transition-none" />
```

### 9.4 Reduced Motion

The `@media (prefers-reduced-motion: reduce)` block in the base CSS (Section 7) handles this globally. It is already included in the Tailwind config — do not remove it.

---

## 10. Setup Sequence

When starting from the Vite template, set up in this order:

1. Install dependencies: `npm install tailwindcss @tailwindcss/vite`
2. Update `vite.config.ts` with the Tailwind Vite plugin (see Section 7)
3. Replace `frontend/src/index.css` with the `@theme` config block (see Section 7)
4. Add Inter font `<link>` tags to `frontend/index.html` (see Section 7)
5. Clear `App.tsx` and `App.css` boilerplate completely
6. Build shared components in this order:
   - `src/components/ui/Button.tsx`
   - `src/components/ui/StatusBadge.tsx`
   - `src/components/ui/KpiCard.tsx`
   - `src/components/ui/SurfaceCard.tsx`
   - `src/components/ui/FormField.tsx`
   - `src/components/layout/Sidebar.tsx`
   - `src/components/layout/TopNav.tsx`
   - `src/components/layout/DashboardShell.tsx`
   - `src/components/layout/PublicShell.tsx`
7. Then build pages in `src/pages/`

### File Naming Convention

- Components: `PascalCase.tsx` (e.g., `KpiCard.tsx`, `StatusBadge.tsx`)
- Pages: `PascalCase.tsx` in `src/pages/`
- Shared UI primitives: `src/components/ui/`
- Layout shells: `src/components/layout/`
- Hooks: `camelCase.ts` prefixed with `use` in `src/hooks/`
- Types: `PascalCase.ts` in `src/types/`
