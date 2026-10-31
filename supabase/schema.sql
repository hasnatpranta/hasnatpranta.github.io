-- ============================================================
-- Portfolio CMS schema for Kabirul Hasnat Pranta's portfolio
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run
-- Safe to re-run: uses "create table if not exists" throughout.
-- ============================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------- PROFILE (singleton) ----------
create table if not exists profile (
  id int primary key default 1,
  full_name text not null default 'Kabirul Hasnat Pranta',
  headline text not null default 'Urban Planner · MEL Specialist · GIS Analyst',
  location text default 'Satkhira, Bangladesh',
  hero_tagline text default 'I map places, measure change, and turn field data into decisions — for WASH, climate resilience and migration programmes across Bangladesh.',
  email text default 'hasnatpranta@gmail.com',
  phone text default '+8801627081889',
  cv_url text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);
insert into profile (id) values (1) on conflict (id) do nothing;

-- ---------- ABOUT (singleton text + child lists) ----------
create table if not exists about_content (
  id int primary key default 1,
  paragraph_1 text,
  paragraph_2 text,
  paragraph_3 text,
  updated_at timestamptz not null default now(),
  constraint about_singleton check (id = 1)
);
insert into about_content (id) values (1) on conflict (id) do nothing;

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  value int not null,
  suffix text default '+',
  label text not null,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  items text not null,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- HERO GLOBE PINS (teal "where I've worked" + gold "banknote countries") ----------
create table if not exists hero_pins (
  id uuid primary key default gen_random_uuid(),
  layer text not null check (layer in ('work','notes')),
  name text not null,
  sub text,           -- work: role/project blurb. notes: shown as "<count> banknotes in the collection"
  count int,           -- notes layer only: drives pin size
  lat numeric not null,
  lon numeric not null,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- EXPERIENCE ----------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  date_range text not null,
  title text not null,
  org_line text,
  description text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- GIS WORK ----------
create table if not exists gis_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text not null,
  thumb_url text,
  featured boolean not null default false,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists featured_project (
  id int primary key default 1,
  title text default 'Cyclone shelter access & storm-surge vulnerability',
  location text default 'Khontakata Union, Sarankhola Upazila, Bagerhat',
  description text,
  tools text default 'ArcGIS · elevation modelling · service area analysis · risk indexing',
  updated_at timestamptz not null default now(),
  constraint featured_project_singleton check (id = 1)
);
insert into featured_project (id) values (1) on conflict (id) do nothing;

-- ---------- EVENT MAPS ----------
create table if not exists event_map_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text not null,
  thumb_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- DESIGN WORK ----------
create table if not exists design_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text not null,
  thumb_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- REPORTS ----------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- BANKNOTE COLLECTION ----------
create table if not exists collection_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists collection_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references collection_groups(id) on delete cascade,
  title text not null,
  image_url text not null,
  thumb_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Contact info (email/phone/CV) lives on the `profile` singleton above —
-- the site has no separate social-icons UI today, so no table for that.

-- ---------- SEO METADATA (one row per page) ----------
create table if not exists seo_meta (
  page_slug text primary key,
  title text,
  description text,
  updated_at timestamptz not null default now()
);
insert into seo_meta (page_slug) values
  ('home'), ('gis'), ('event-maps'), ('design'), ('collection')
on conflict (page_slug) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) can read published rows.
-- Only the one admin account (see private.is_admin below) can write.
-- ============================================================

alter table profile enable row level security;
alter table about_content enable row level security;
alter table stats enable row level security;
alter table skill_groups enable row level security;
alter table hero_pins enable row level security;
alter table experience enable row level security;
alter table gis_items enable row level security;
alter table featured_project enable row level security;
alter table event_map_items enable row level security;
alter table design_items enable row level security;
alter table reports enable row level security;
alter table collection_groups enable row level security;
alter table collection_items enable row level security;
alter table seo_meta enable row level security;

-- Only this confirmed account may write. Being signed in is not enough: if public
-- sign-ups are ever left on, a stranger's account must still be unable to edit anything.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and u.email = 'hasnatpranta@gmail.com'
      and u.email_confirmed_at is not null
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Singleton / always-readable tables: public read, admin write
do $$
declare t text;
begin
  foreach t in array array['profile','about_content','featured_project','seo_meta'] loop
    execute format('drop policy if exists "public read %I" on %I', t, t);
    execute format('create policy "public read %I" on %I for select using (true)', t, t);
    execute format('drop policy if exists "admin write %I" on %I', t, t);
    execute format('create policy "admin write %I" on %I for all using (private.is_admin()) with check (private.is_admin())', t, t);
  end loop;
end $$;

-- List tables with a published flag: public reads only published rows, admin sees/writes everything
do $$
declare t text;
begin
  foreach t in array array['hero_pins','stats','skill_groups','experience','gis_items','event_map_items','design_items','reports','collection_groups','collection_items'] loop
    execute format('drop policy if exists "public read published %I" on %I', t, t);
    execute format('create policy "public read published %I" on %I for select using (published = true or private.is_admin())', t, t);
    execute format('drop policy if exists "admin write %I" on %I', t, t);
    execute format('create policy "admin write %I" on %I for all using (private.is_admin()) with check (private.is_admin())', t, t);
  end loop;
end $$;

-- ============================================================
-- STORAGE: public "media" bucket for uploaded images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert with check (bucket_id = 'media' and private.is_admin());

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update using (bucket_id = 'media' and private.is_admin());

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and private.is_admin());

-- ============================================================
-- Done. Next steps (in the Supabase dashboard):
-- 1. Authentication -> Providers -> Email -> turn OFF "Allow new users to sign up"
--    (keeps this a single-admin project; nobody else can register).
-- 2. Authentication -> Users -> Add user -> enter your email + a password you choose.
--    This is the only account that can log into the dashboard.
-- 3. Project Settings -> API -> copy the "Project URL" and the "anon public" key
--    (NOT the service_role key) and send both to Claude.
-- ============================================================
