-- ============================================================================
-- LienLoop — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: tables/columns use IF NOT EXISTS and policies are dropped
-- and recreated, so re-running this file after a schema update just applies
-- the diff.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- user_profiles
-- ----------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company_name text,
  plan text check (plan in ('single_state', 'multi_state', 'nationwide')),
  lead_type text check (lead_type in ('pre_foreclosure', 'code_violations')),
  selected_states text[] not null default '{}',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- County-level narrowing within selected_states. Empty array means "every
-- county in the selected states" (the original, county-less behavior).
alter table public.user_profiles
  add column if not exists selected_counties text[] not null default '{}';

-- Paddle subscription tier + skiptrace credit tracking. `tier` mirrors
-- config/tiers.ts's Tier['name'] and is synced by the paddle-webhook edge
-- function whenever a subscription is created/updated/canceled — it's the
-- source of truth for skiptrace_credits_limit, not something the client sets.
alter table public.user_profiles
  add column if not exists tier text check (tier in ('Starter', 'Pro', 'Advanced', 'Extreme'));
alter table public.user_profiles add column if not exists skiptrace_credits_used int not null default 0;
alter table public.user_profiles add column if not exists skiptrace_credits_limit int not null default 0;
alter table public.user_profiles add column if not exists credits_reset_at timestamptz;
alter table public.user_profiles add column if not exists paddle_customer_id text;
alter table public.user_profiles add column if not exists paddle_subscription_id text;
alter table public.user_profiles add column if not exists subscription_status text;

alter table public.user_profiles enable row level security;

-- Users can read their own profile
drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile row (on signup / onboarding)
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- admin_users
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false
);

alter table public.admin_users enable row level security;

-- Helper: is the current user an admin? SECURITY DEFINER + a table owner
-- with BYPASSRLS means this query does NOT re-trigger admin_users' own RLS
-- policies — which is what avoids the "infinite recursion detected in
-- policy for relation admin_users" error you'd get from a plain
-- `exists (select 1 from admin_users where ...)` inside admin_users' own
-- policies (or inside leads' policies, which also call this).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.admin_users where user_id = auth.uid()),
    false
  );
$$;

-- Any authenticated user can check their own admin row (needed for the
-- frontend admin-check on login). No one can write to this table from the
-- client — admin status is only ever toggled by an existing admin via a
-- policy below, or from the Supabase dashboard / service role.
drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
  on public.admin_users for select
  using (auth.uid() = user_id);

drop policy if exists "admin_users_select_all_if_admin" on public.admin_users;
create policy "admin_users_select_all_if_admin"
  on public.admin_users for select
  using (public.is_admin());

drop policy if exists "admin_users_update_if_admin" on public.admin_users;
create policy "admin_users_update_if_admin"
  on public.admin_users for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can grant/revoke admin status for a user who doesn't have an
-- admin_users row yet (the User Management "toggle admin" upsert).
drop policy if exists "admin_users_insert_if_admin" on public.admin_users;
create policy "admin_users_insert_if_admin"
  on public.admin_users for insert
  with check (public.is_admin());

-- Bootstrapping: the policies above mean no client can ever create the
-- *first* admin (there's no existing admin to authorize it). Seed the
-- first admin manually from the Supabase SQL editor, e.g.:
--   insert into public.admin_users (user_id, is_admin)
--   values ('<auth.users.id of the first admin>', true);

-- ----------------------------------------------------------------------------
-- leads
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  date_pulled date not null default current_date,
  state text not null,
  county text,
  list_type text not null check (list_type in ('pre_foreclosure', 'code_violations')),
  lis_pendens_date date,
  auction_date date,
  violation_description text,
  owner_first text,
  owner_last text,
  phone_1 text,
  phone_2 text,
  phone_3 text,
  email text,
  email_2 text,
  property_street text,
  property_city text,
  property_state text,
  property_zip text,
  beds text,
  baths text,
  sqft text,
  lot_size text,
  property_type text,
  notes text,
  created_at timestamptz not null default now()
);

-- Replaced mailing_* address columns with property detail columns — no
-- mailing-address use case existed, and property specs (beds/baths/sqft/
-- lot size/type/notes) are what's actually needed at the lead level.
alter table public.leads drop column if exists mailing_street;
alter table public.leads drop column if exists mailing_city;
alter table public.leads drop column if exists mailing_state;
alter table public.leads drop column if exists mailing_zip;
alter table public.leads add column if not exists beds text;
alter table public.leads add column if not exists baths text;
alter table public.leads add column if not exists sqft text;
alter table public.leads add column if not exists lot_size text;
alter table public.leads add column if not exists property_type text;
alter table public.leads add column if not exists notes text;

-- Case # and Company/Entity turned out to be unused; lis_pendens_date and
-- violation_description are list-type-specific fields (pre-foreclosure and
-- code violations respectively) surfaced only for their matching list type
-- in the CSV upload mapper.
alter table public.leads drop column if exists case_number;
alter table public.leads drop column if exists company_entity;
alter table public.leads add column if not exists lis_pendens_date date;
alter table public.leads add column if not exists violation_description text;

-- Skiptrace credit reveal system: PII stays masked (see leads_for_user view
-- below) until a user spends a credit through the reveal-lead edge function,
-- which is the only thing allowed to flip is_revealed — never the client
-- directly, and never a plain UPDATE through PostgREST (no RLS UPDATE
-- policy exists for regular users on this table, only the admin one above).
alter table public.leads add column if not exists is_revealed boolean not null default false;
alter table public.leads add column if not exists revealed_by uuid references auth.users (id);
alter table public.leads add column if not exists revealed_at timestamptz;

create index if not exists leads_state_idx on public.leads (state);
create index if not exists leads_list_type_idx on public.leads (list_type);
create index if not exists leads_date_pulled_idx on public.leads (date_pulled);
create index if not exists leads_auction_date_idx on public.leads (auction_date);
create index if not exists leads_county_idx on public.leads (county);

alter table public.leads enable row level security;

-- Admins: full access
drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all"
  on public.leads for all
  using (public.is_admin())
  with check (public.is_admin());

-- Regular users: read-only, filtered by their plan's states + lead type,
-- and further narrowed to selected_counties when the user has picked any
-- (an empty selected_counties means "every county in my selected states").
drop policy if exists "leads_select_by_plan" on public.leads;
create policy "leads_select_by_plan"
  on public.leads for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.onboarding_complete = true
        and up.lead_type = leads.list_type
        and (
          up.plan = 'nationwide'
          or leads.state = any (up.selected_states)
        )
        and (
          coalesce(array_length(up.selected_counties, 1), 0) = 0
          or leads.county = any (up.selected_counties)
        )
    )
  );

-- Regular (non-admin) dashboard reads go through this view instead of the
-- base table. `security_invoker = true` means it still runs under the
-- querying user's own RLS (leads_select_by_plan above still applies for row
-- visibility) — this view only adds column-level masking on top: PII stays
-- null until is_revealed is true. Blurring in the UI alone isn't real
-- security since the raw API response would still contain the data; this is
-- what actually keeps it out of the response for un-revealed rows.
drop view if exists public.leads_for_user;
create view public.leads_for_user
with (security_invoker = true) as
select
  id,
  date_pulled,
  state,
  county,
  list_type,
  lis_pendens_date,
  auction_date,
  violation_description,
  case when is_revealed then owner_first else null end as owner_first,
  case when is_revealed then owner_last else null end as owner_last,
  case when is_revealed then phone_1 else null end as phone_1,
  case when is_revealed then phone_2 else null end as phone_2,
  case when is_revealed then phone_3 else null end as phone_3,
  case when is_revealed then email else null end as email,
  case when is_revealed then email_2 else null end as email_2,
  property_street,
  property_city,
  property_state,
  property_zip,
  beds,
  baths,
  sqft,
  lot_size,
  property_type,
  notes,
  is_revealed,
  revealed_at,
  created_at
from public.leads;

grant select on public.leads_for_user to authenticated;

-- Atomically deducts one credit and reveals a lead. Row-locks both the
-- profile and the lead so two simultaneous reveal requests can't both pass
-- the credit check. Already-revealed leads return as-is with no charge —
-- a reveal is a one-time global unlock for the lead, not a per-user credit
-- spend every time someone views it. Execute is restricted to service_role
-- only: this must be called from the reveal-lead edge function (which
-- derives p_user_id from the caller's verified JWT), never directly from
-- the client SDK with an arbitrary user id.
create or replace function public.reveal_lead(p_lead_id uuid, p_user_id uuid)
returns public.leads
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used int;
  v_limit int;
  v_lead public.leads;
begin
  select skiptrace_credits_used, skiptrace_credits_limit
    into v_used, v_limit
    from public.user_profiles
    where id = p_user_id
    for update;

  if not found or v_limit is null or v_limit = 0 then
    raise exception 'no_active_subscription';
  end if;

  select * into v_lead from public.leads where id = p_lead_id for update;
  if not found then
    raise exception 'lead_not_found';
  end if;

  if v_lead.is_revealed then
    return v_lead;
  end if;

  if v_used >= v_limit then
    raise exception 'insufficient_credits';
  end if;

  update public.user_profiles
    set skiptrace_credits_used = skiptrace_credits_used + 1
    where id = p_user_id;

  update public.leads
    set is_revealed = true, revealed_by = p_user_id, revealed_at = now()
    where id = p_lead_id
    returning * into v_lead;

  return v_lead;
end;
$$;

revoke all on function public.reveal_lead(uuid, uuid) from public;
revoke all on function public.reveal_lead(uuid, uuid) from authenticated;
grant execute on function public.reveal_lead(uuid, uuid) to service_role;

-- ----------------------------------------------------------------------------
-- Helper: auto-create a blank user_profiles row on signup
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, company_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
