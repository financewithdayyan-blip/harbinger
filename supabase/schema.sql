-- ============================================================================
-- Harbinger — Supabase schema
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
  case_number text,
  state text not null,
  county text,
  list_type text not null check (list_type in ('pre_foreclosure', 'code_violations')),
  auction_date date,
  owner_first text,
  owner_last text,
  company_entity text,
  phone_1 text,
  phone_2 text,
  phone_3 text,
  email text,
  email_2 text,
  property_street text,
  property_city text,
  property_state text,
  property_zip text,
  mailing_street text,
  mailing_city text,
  mailing_state text,
  mailing_zip text,
  created_at timestamptz not null default now()
);

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
