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

### 2. Deploy the Edge Functions

Two Supabase Edge Functions back the credits/billing system — deploy them with the Supabase CLI (`supabase login` + `supabase link` first):

```bash
supabase functions deploy reveal-lead
supabase functions deploy paddle-webhook --no-verify-jwt
```

`paddle-webhook` needs `--no-verify-jwt` because Paddle calls it directly with no Supabase session — its own HMAC signature check (using the secret below) is what authenticates the request instead.

Set the webhook's secret (found in Paddle Dashboard → Developer Tools → Notifications, on the destination pointed at this function's URL):

```bash
supabase secrets set PADDLE_WEBHOOK_SECRET=whsec_...
```

`reveal-lead` needs no extra secrets — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to every Edge Function.

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your project's values (Supabase dashboard → Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PADDLE_CLIENT_TOKEN=your-paddle-client-side-token
VITE_PADDLE_ENV=sandbox
```

Never put the service role key or the Paddle **API key**/webhook secret in the frontend — only the Paddle *client-side token* is meant to be public. Every Supabase query from the browser goes through RLS using the anon key.

Leave `VITE_PADDLE_CLIENT_TOKEN` unset to ship with checkout buttons showing "Checkout coming soon" instead of breaking.

### 4. Install and run

```bash
npm install
npm run dev
```

### 5. Build

```bash
npm run build
```

## Deployment (Vercel)

`vercel.json` includes an SPA rewrite so client-side routes resolve correctly. Set the same environment variables from step 3 in the Vercel project settings.

## Project structure

```
/src
  /components
    /auth        — LoginForm, SignupForm, AuthLayout
    /onboarding  — PlanSelector, LeadTypeSelector, StateSelector, CountySelector, OnboardingConfirm
    /dashboard   — Sidebar, LeadsFilters, LeadsTable
    /admin       — CSVUploader, ColumnMapper, UserTable
    /ui          — Button, Input, Badge, Modal, Spinner, Logo
    ProtectedRoute.tsx — route guards (auth, onboarding, admin)
  /pages         — Login, Signup, Onboarding, Dashboard, Admin, Pricing, Landing
  /lib           — supabase.ts, auth.ts, types.ts, counties.ts, credits.ts, paddle.ts
  /config        — tiers.ts (Paddle price IDs + credit/feature definitions per tier)
  /context       — AuthContext.tsx
  /hooks         — useLeads.ts, useProfile.ts, useAdmin.ts, useRevealLead.ts
/supabase
  schema.sql     — full schema + RLS policies
  /functions
    reveal-lead    — spends one credit, reveals a lead's PII (server-side check)
    paddle-webhook — syncs Paddle subscription events onto user_profiles
```

## Skiptrace credits & billing (Paddle)

Lead contact info (owner name, phone, email) is masked by default — see the
`leads_for_user` view in `schema.sql`, which nulls those columns unless
`is_revealed` is true. The **only** way to flip that is the `reveal-lead`
Edge Function, which atomically checks and deducts a credit via the
`reveal_lead()` Postgres function (see schema.sql) — never the client.

Subscription tiers, prices, and feature lists live in `src/config/tiers.ts`
and are pushed to Paddle Checkout via `src/lib/paddle.ts`. `paddle-webhook`
is what actually grants credits after a successful payment — **it was
written from Paddle's documented payload shape but not verified against a
live account**, so send a few test events from the Paddle dashboard and
confirm the field paths in that function before going live.

## Notes

- CSV uploads use [PapaParse](https://www.papaparse.com/) client-side, with a column-mapping step before insert and per-row validation (rows missing required fields are skipped and logged, not inserted).
