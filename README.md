# Kabirul Hasnat Pranta — 3D Interactive Portfolio

A single-page portfolio website with an interactive 3D globe (Three.js) showing
work locations across Bangladesh and the 31 countries of the banknote collection.

## Viewing the site locally

The site uses JavaScript modules, so it must be viewed through a local server —
**double-clicking `index.html` will not work.**

1. Right-click `server.ps1` → **Run with PowerShell**
2. Open your browser at **http://localhost:8788**

(An internet connection is needed for the 3D library, fonts, and world map outlines,
all loaded from CDNs.)

## Publishing online (free options)

- **Netlify Drop** — go to https://app.netlify.com/drop and drag this whole folder
  into the page. You get a live URL in seconds; free custom subdomain included.
- **GitHub Pages** — push this folder to a GitHub repository, then enable
  Pages in the repo settings (Settings → Pages → deploy from branch).

## Folder structure

```
index.html          — all page content (edit text here)
css/style.css       — colors, fonts, layout
js/main.js          — 3D globe, galleries, lightbox, animations
assets/img/         — web-optimized images (originals stay in D:\Portfolio)
assets/files/       — downloadable CV
server.ps1          — local preview server
```

## Updating content

- **Text** (about, experience, contact): edit `index.html` directly.
- **Adding images**: put a full-size copy in `assets/img/<section>/` and a small
  copy in `assets/img/<section>/thumb/`, then add an entry to the matching list
  at the top of `js/main.js`.
- **Globe pins**: edit the `workPins` / `noteCountries` lists at the top of `js/main.js`.
