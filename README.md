# Barber Booking

Online booking system for a single barber in Austria. Customers book appointments; the barber manages their schedule.

## Running the app

```bash
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173 in your browser.

## Switching between Mock and Supabase

All data access goes through repository interfaces. Which implementation runs is controlled by a single env var:

| Mode | `.env.local` | Description |
|------|-------------|-------------|
| Mock (default) | `VITE_USE_MOCK=true` | In-memory repositories with seed data. No Supabase required. |
| Supabase | `VITE_USE_MOCK=false` | Real Supabase backend. Requires `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. |

To switch to Supabase:
1. Set `VITE_USE_MOCK=false` in `.env.local`
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Run `npm run dev`

## Key env vars

| Variable | Required for Supabase | Description |
|---|---|---|
| `VITE_USE_MOCK` | No | `true` = use in-memory repos, `false` = Supabase |
| `VITE_SUPABASE_URL` | Yes (when `VITE_USE_MOCK=false`) | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes (when `VITE_USE_MOCK=false`) | Your Supabase anon key |

## Architecture

This project uses a **feature-first** architecture. Each feature owns exactly one database table and is self-contained.

```
src/
  features/
    auth/               → barbers table
    weekly-schedule/    → weekly_schedule table
    schedule-exceptions/→ schedule_exceptions table
    time-blocks/        → time_blocks table
    customers/          → customers table
    appointments/       → appointments table
    slot-holds/         → slot_holds table
  pages/                → route-level components (compose across features)
    hooks/              → cross-feature orchestration hooks
  providers/            → ServiceContext (DI root)
  routing/              → React Router config
  constants/            → shared constants + mock IDs
  lib/                  → Supabase client factory
  utils/                → date helpers
  components/           → shared UI primitives
```

Each feature has four layers:

```
features/<name>/
  domain/       — Class entity with toJSON() / static fromJSON()
  data/         — Repository interface + MockXxxRepository + SupabaseXxxRepository
  application/  — Service class (IXxxService interface + XxxService class)
  presentation/
    hooks/      — Feature-scoped React hooks (use that feature's service only)
    components/ — Feature-scoped UI components
```

### Allowed import directions

```
pages/
  ├── imports from → features/*/presentation/hooks/
  ├── imports from → features/*/presentation/components/
  └── imports from → pages/hooks/

pages/hooks/
  └── imports from → providers/service-context  (uses multiple services)

features/*/presentation/hooks/
  └── imports from → providers/service-context  (uses that feature's service only)

features/*/presentation/components/
  └── imports from → features/*/presentation/hooks/  (own feature only)

providers/service-context
  └── imports from → features/*/application/  (all services)

features/*/application/
  └── imports from → features/*/data/  (own feature only)

features/*/data/
  └── imports from → features/*/domain/  (own feature only)
```

### Architecture Rules

**Rule 1 — Feature isolation**
A feature's `data/`, `domain/`, `application/`, and `presentation/components/` files **MUST NOT import from another feature**. Services do not import other services. There is no cross-feature service composition inside features.

**Exception: AppointmentService depends on SlotHoldRepository** because appointment creation atomically consumes a hold. The repository is the data primitive; that is the correct seam for this cross-aggregate dependency. `AppointmentService` injects `SlotHoldRepository` directly (not `SlotHoldService`) and is responsible for validating the hold, creating the appointment, and deleting the hold in sequence. No other cross-feature repository dependencies are permitted without explicit justification added here.

**Rule 2 — Composition happens in pages**
Pages live in `src/pages/` (outside `features/`). Pages may import services from any feature via the ServiceContext, and may import components from any feature. Pages compose multi-feature workflows.

**Rule 3 — Page-level hooks for orchestration**
Multi-service logic lives in **page-level hooks** in `src/pages/hooks/`, not in components and not in feature services. Page-level hooks consume multiple services via `useServices()` and return state + callbacks consumed by page components. This is the **only** place where multiple services interact.

**Rule 4 — Component consumption rules**
- Components inside a feature use that feature's hooks (which use that feature's service).
- Pages use page-level hooks and import components from any feature.
- Components **never** import services directly — always through a hook.
- Components **never** import repositories directly.

### Why availability logic lives in `src/pages/hooks/use-available-slots.ts`

Computing available booking slots requires data from five features simultaneously: weekly schedule (opening hours), schedule exceptions (closed dates), time blocks (lunch breaks etc.), appointments (already-booked slots), and slot holds (temporarily reserved slots). No single feature owns this logic — it is a cross-feature composition. Putting it inside any one feature's service would require that service to import from four other features, violating Rule 1. Putting it in a page component directly would make it impossible to reuse across pages. `src/pages/hooks/` is the designated composition layer: it can call all five services and return a clean `{ slots, loading, error }` shape to any page that needs it.

### Repository pattern

Every entity has:
1. An **interface** — the contract that services depend on.
2. A **`MockXxxRepository`** — in-memory, ships seed data for UI development.
3. A **`SupabaseXxxRepository`** — talks to Supabase (stubs that throw `'not implemented'` until Phase 3).

Repositories are instantiated inside `ServiceProvider` in `src/providers/service-context.tsx` and wrapped in service classes. Nothing outside `ServiceProvider` should import a repository.

### Data models

Domain entities are **classes** with:
- `static fromJSON(row: XxxRow)` — deserializes from snake_case DB row
- `toJSON(): XxxRow` — serializes back to DB row format

The `XxxRow` interface (DB shape) lives alongside its class in the same domain file.
