# Kabirul Hasnat Pranta — 3D Interactive Portfolio + Admin Dashboard

A portfolio website with an interactive 3D globe (Three.js) showing work locations
across Bangladesh and the 31 countries of a banknote collection — plus a full admin
dashboard for managing every section of the site without touching code.

**Live site:** https://hasnatpranta.github.io/
**Admin dashboard:** https://hasnatpranta.github.io/admin/ (see [ADMIN-SETUP.md](ADMIN-SETUP.md) to connect it)

## Architecture

- **Frontend:** plain HTML/CSS/JavaScript (ES modules), no build step, no framework.
  Three.js (globe) and Google Fonts load from a CDN.
- **Backend:** [Supabase](https://supabase.com) — Postgres database + authentication +
  file storage + an auto-generated API, called directly from the browser.
- **Hosting:** GitHub Pages, for both the public site and the admin dashboard.
- **Content flow:** Dashboard → Supabase (database) → public pages. Each page opens
  immediately from its built-in content, then fetches dashboard content in the
  background, so the site never waits on the database.

See [ADMIN-SETUP.md](ADMIN-SETUP.md) for the full setup walkthrough, dashboard usage
guide, schema reference, and environment/configuration values.

## Viewing the site locally

The site uses JavaScript modules, so it must be viewed through a local server —
**double-clicking `index.html` will not work.**

1. Right-click `server.ps1` → **Run with PowerShell**
2. Open your browser at **http://localhost:8788** (site) or
   **http://localhost:8788/admin/** (dashboard)

(An internet connection is needed for the 3D library, fonts, world map outlines, and
the Supabase SDK, all loaded from CDNs.)

## Folder structure

```
index.html, gis.html, event-maps.html,        — public pages
  design.html, collection.html
css/style.css                                  — public site styling
js/main.js                                      — 3D globe, galleries, lightbox, CMS wiring
js/cms-content.js                               — reads dashboard content for public pages
js/cms-config.js                                — Supabase project URL + public key
js/supabase-client.js                           — Supabase client, used by the dashboard only
assets/data/world.geo.json                      — country outlines for the globe
.github/workflows/keep-dashboard-awake.yml      — stops the free database from pausing
admin/                                          — the admin dashboard (separate static app)
  index.html, dashboard.html
  css/admin.css
  js/app.js         — sidebar, routing, overview, media library
  js/crud.js         — generic add/edit/delete/reorder engine
  js/sections.js     — declares every manageable section + its fields
  js/auth.js          — login/logout/route guard
  js/media.js         — image upload + picker
  js/ui.js            — toasts, confirm dialogs, modals
supabase/
  schema.sql           — database tables + Row Level Security policies
  seed.sql              — pre-fills the CMS with today's real content
assets/img/            — web-optimized images (originals stay in D:\Portfolio)
assets/files/          — downloadable CV
server.ps1              — local preview server
```

## Updating content

**Preferred:** use the [admin dashboard](https://hasnatpranta.github.io/admin/) —
add/edit/delete/reorder/publish every section with forms, image upload, and drag
handles. See [ADMIN-SETUP.md](ADMIN-SETUP.md).

**Without the dashboard** (CMS not yet configured, or a one-off tweak): the site's
built-in fallback content lives directly in the HTML/JS, exactly as before:
- Text (about, experience, contact): edit the relevant `.html` file directly.
- Images: add a full-size copy to `assets/img/<section>/` and a thumb to
  `assets/img/<section>/thumb/`, then add an entry to the matching list at the top
  of `js/main.js`.
- Globe pins: edit `defaultWorkPins` / `defaultNoteCountries` at the top of `js/main.js`.

## Deployment

```bash
git add -A
git commit -m "..."
git push
```
GitHub Pages redeploys automatically. The database/backend (Supabase) needs no
separate deploy — it's live the moment the project is created.
