# LienLoop

**First to know. First to close.**

A marketplace for skip-traced distressed real estate records (pre-foreclosure, code violations — with probate, tax delinquent, and divorce coming soon).

Built with React + Vite + TypeScript and Supabase (auth, database, storage). Deployed on Vercel.

## Getting started

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). This creates:
   - `user_profiles` — plan, lead type, states, onboarding status
   - `admin_users` — admin flags
   - `leads` — the lead records
   - RLS policies scoping `leads` reads to each user's plan (state + lead type)
   - A trigger that creates a blank `user_profiles` row on signup
3. **Seed your first admin manually** — RLS blocks any client from granting the
   first admin (there's no existing admin to authorize it). In the SQL editor:
   ```sql
   insert into public.admin_users (user_id, is_admin)
   values ('<your auth.users id>', true);
   ```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your project's values (Supabase dashboard → Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never put the service role key in the frontend — every query from the browser goes through RLS using the anon key.

### 3. Install and run

```bash
npm install
npm run dev
```

### 4. Build

```bash
npm run build
```

## Deployment (Vercel)

`vercel.json` includes an SPA rewrite so client-side routes resolve correctly. Set the same two `VITE_SUPABASE_*` environment variables in the Vercel project settings.

## Project structure

```
/src
  /components
    /auth        — LoginForm, SignupForm, AuthLayout
    /onboarding  — PlanSelector, LeadTypeSelector, StateSelector, OnboardingConfirm
    /dashboard   — Sidebar, LeadsFilters, LeadsTable
    /admin       — CSVUploader, ColumnMapper, UserTable
    /ui          — Button, Input, Badge, Modal, Spinner
    ProtectedRoute.tsx — route guards (auth, onboarding, admin)
  /pages         — Login, Signup, Onboarding, Dashboard, Admin, Pricing
  /lib           — supabase.ts, auth.ts, types.ts
  /context       — AuthContext.tsx
  /hooks         — useLeads.ts, useProfile.ts, useAdmin.ts
/supabase
  schema.sql     — full schema + RLS policies
```

## Notes

- Payment is **not** integrated yet. `/pricing` shows the three plans with "Coming Soon" buttons; a `TODO(stripe)` marks where Stripe Checkout will be wired in once pricing is finalized. All users currently get free access.
- CSV uploads use [PapaParse](https://www.papaparse.com/) client-side, with a column-mapping step before insert and per-row validation (rows missing required fields are skipped and logged, not inserted).
