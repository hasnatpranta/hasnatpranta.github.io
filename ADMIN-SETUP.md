# Admin Dashboard Setup

This portfolio now has a full content-management backend: an admin dashboard where
you add/edit/delete/reorder every section, backed by a real database, with changes
appearing on the live site automatically. This document is the one-time setup —
after this, day-to-day use is just logging in at `/admin/` and editing.

## Architecture, in one paragraph

[Supabase](https://supabase.com) provides a Postgres database, user authentication,
file storage, and an auto-generated API — one free service instead of four. Both the
public portfolio and the admin dashboard remain **plain static files on GitHub Pages**;
they talk to Supabase directly from the browser using its JavaScript SDK. There is no
server to run, no Node build step, and no separate hosting bill. Security is enforced
in the database itself via Row Level Security (RLS): anyone can *read* published
content, but only the one admin account can *write*. Public pages open immediately from
their built-in content and fetch dashboard content in the background, so a slow or
paused database can never hold the live portfolio up.

## One-time setup (about 10 minutes)

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → sign up (free tier is enough) → **New
project**. Pick any name/region and a database password (you won't need this password
again — Supabase manages it; the dashboard never asks for it).

### 2. Run the database schema
In your project: **SQL Editor → New query**. Open [`supabase/schema.sql`](supabase/schema.sql)
from this repo, paste its full contents, and click **Run**. This creates every table,
sets up Row Level Security, and creates a public `media` storage bucket.

### 3. Seed it with your real content
New query again → paste the full contents of [`supabase/seed.sql`](supabase/seed.sql) →
**Run**. This pre-fills every table with the portfolio's actual current content (reusing
the images already hosted on GitHub Pages), so the dashboard opens already populated
instead of empty.

### 4. Lock the project to a single admin
**Authentication → Providers → Email** → turn **off** "Allow new users to sign up."
This stops anyone else from creating a login. Even if it is left on, a stranger's
account still can't change anything: writes are limited to one confirmed email address
in the `private.is_admin()` function in `supabase/schema.sql`. To use a different admin
email, change it there and in the database.

### 5. Create your admin account
**Authentication → Users → Add user**. Use the admin email above, tick **Auto Confirm**,
and choose a password — directly in Supabase's own screen, not anywhere in this codebase
or in any AI conversation.

### 6. Connect the site to your project
**Project Settings → API**. Copy two values:
- **Project URL**
- **anon / public** key (⚠️ not the `service_role` key — never use that one here)

Open [`js/cms-config.js`](js/cms-config.js) and paste them in:
```js
export const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```
Save, commit, and push. That's it — the dashboard and the live site are now connected.

> The anon key is meant to be public (it's in Supabase's own docs as safe to ship
> client-side) — real protection comes from the RLS policies in `schema.sql`, not from
> hiding this key. There is no secret to keep out of GitHub in this architecture.

## Using the dashboard

Go to `https://hasnatpranta.github.io/admin/` and sign in with the account from step 5.

- **Sidebar** — one entry per section: Profile & Hero, About, Globe Pins, Experience,
  GIS Work, Event Maps, Design Work, Reports, Collection, SEO, Media Library.
- **Singleton sections** (Profile, About text, Featured Project) are one form —
  edit and click **Save**.
- **List sections** (Experience, GIS images, Event Maps, Reports, Collection, etc.)
  show every row with a thumbnail, a **Published/Hidden** toggle, edit (✎) and delete
  (🗑) buttons, and a drag handle (⠿) to reorder — drag and the new order saves
  automatically.
- **Add** opens the same form empty. Required fields are marked with `*`.
- **Images** — either upload a new file, or click **Choose existing** to reuse
  something already in the Media Library. Files go to Supabase Storage and are
  validated (image/PDF only, 5MB max) before upload.
- **Delete** always asks for confirmation first.
- Everything you publish appears on the live site within a few seconds — no rebuild,
  no redeploy. Toggling something to **Hidden** removes it from the site immediately
  without deleting your work.

## Local development

Same as before — right-click `server.ps1` → **Run with PowerShell** → open
`http://localhost:8788`. The admin dashboard is at `http://localhost:8788/admin/`.
Both talk to your live Supabase project even when developing locally (there's no
separate "local database").

## Production deployment

Nothing changes about how the site itself ships — it's still `git push` to
`hasnatpranta/hasnatpranta.github.io`, and GitHub Pages serves it. The "backend" is
Supabase's hosted infrastructure, already in production the moment you create the
project; there's no separate deploy step for it.

## Environment variables / configuration values

This is a static site, so there's no server process reading `process.env` — the two
connection values live in the checked-in `js/cms-config.js` (see `js/cms-config.example.js`
for the template). They are:

| Name | Where it's used | Secret? |
|---|---|---|
| `SUPABASE_URL` | `js/cms-config.js` | No — public by design |
| `SUPABASE_ANON_KEY` | `js/cms-config.js` | No — public by design, protected by RLS |

The Postgres database password and the `service_role` key are never used anywhere in
this project — don't paste them into any file here.

## API structure

There's no hand-written API — Supabase auto-generates a REST API over every table
(PostgREST). Public pages only read, using plain `fetch` (`js/cms-content.js`). The
dashboard calls it through the `@supabase/supabase-js` client library (loaded from a
CDN, no install needed):

- `supabase.from('table').select('*')` — read
- `supabase.from('table').insert(...)` / `.update(...)` / `.delete()` — write, only
  succeeds for a signed-in session (enforced by RLS, not by the client code)
- `supabase.auth.signInWithPassword(...)` — login
- `supabase.storage.from('media').upload(...)` — file upload

## Database schema

See [`supabase/schema.sql`](supabase/schema.sql) for the full definition (tables,
columns, RLS policies) and [`supabase/seed.sql`](supabase/seed.sql) for the initial
content. Tables: `profile`, `about_content`, `stats`, `skill_groups`, `hero_pins`,
`experience`, `gis_items`, `featured_project`, `event_map_items`, `design_items`,
`reports`, `collection_groups`, `collection_items`, `seo_meta`.

## Keeping the database awake

Supabase pauses free projects after about a week without activity. The
`Keep dashboard database awake` GitHub Action pings it twice a week so that doesn't
happen. If a ping fails, GitHub emails you; the public site keeps working either way.

## Troubleshooting

- **Dashboard shows "not configured yet"** — `js/cms-config.js` still has empty
  values; do step 6 above.
- **Dashboard can't log in or save, but the public site is fine** — the project may be
  paused. Open it in the Supabase dashboard and click **Restore**.
- **Login fails** — the admin user must be created in the Supabase dashboard (step 5);
  the dashboard has no self-registration.
- **A new item doesn't show on the site** — check its **Published** toggle is on.
- **Images don't load** — check the URL in Media Library, or that the file was
  actually uploaded (Supabase free tier storage limit is 1GB).
