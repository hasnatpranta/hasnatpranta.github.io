import { requireAuth, signOut, supabase } from './auth.js';
import { SECTIONS } from './sections.js';
import { renderBlocks } from './crud.js';
import { listMedia, deleteMedia, uploadFile } from './media.js';
import { toast, confirmDialog } from './ui.js';

async function boot() {
  await requireAuth();

  const sidebar = document.getElementById('sidebar-nav');
  const content = document.getElementById('content');
  const userEmailEl = document.getElementById('user-email');

  const { data: { user } } = await supabase.auth.getUser();
  if (userEmailEl && user) userEmailEl.textContent = user.email;

  sidebar.innerHTML = SECTIONS.map(s => `<a href="#${s.id}" data-id="${s.id}">${s.label}</a>`).join('');
  document.getElementById('logout-btn').addEventListener('click', signOut);

  async function renderSection(id) {
    const section = SECTIONS.find(s => s.id === id) || SECTIONS[0];
    sidebar.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.id === section.id));
    content.innerHTML = `<div class="content-loading">Loading…</div>`;

    if (section.kind === 'overview') return renderOverview(content);
    if (section.kind === 'media') return renderMediaLibrary(content);

    content.innerHTML = `<h1 class="page-title">${section.label}</h1><div class="blocks-mount"></div>`;
    await renderBlocks(content.querySelector('.blocks-mount'), section.blocks);
  }

  window.addEventListener('hashchange', () => renderSection(location.hash.slice(1)));
  renderSection(location.hash.slice(1) || 'overview');
}

async function renderOverview(content) {
  const counts = await Promise.all([
    ['Experience entries', 'experience'],
    ['GIS images', 'gis_items'],
    ['Event maps', 'event_map_items'],
    ['Design pieces', 'design_items'],
    ['Reports', 'reports'],
    ['Collection groups', 'collection_groups'],
    ['Collection items', 'collection_items'],
  ].map(async ([label, table]) => {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    return { label, count: count ?? 0 };
  }));

  content.innerHTML = `
    <h1 class="page-title">Overview</h1>
    <p class="page-sub">Everything here reflects on <a href="https://hasnatpranta.github.io/" target="_blank" rel="noopener">the live portfolio</a> as soon as you save.</p>
    <div class="stat-grid">
      ${counts.map(c => `<div class="stat-tile"><span class="stat-tile-num">${c.count}</span><span class="stat-tile-label">${c.label}</span></div>`).join('')}
    </div>
    <div class="overview-links">
      <a href="#profile" class="overview-link">Edit Profile &amp; Hero →</a>
      <a href="#about" class="overview-link">Edit About →</a>
      <a href="#media" class="overview-link">Media Library →</a>
    </div>`;
}

async function renderMediaLibrary(content) {
  content.innerHTML = `
    <div class="block-header">
      <h1 class="page-title">Media Library</h1>
      <label class="btn btn-primary btn-sm">Upload file<input type="file" accept="image/*,application/pdf" hidden></label>
    </div>
    <div class="media-grid" id="media-lib-grid"><p class="loading-state">Loading…</p></div>`;

  const grid = content.querySelector('#media-lib-grid');
  const fileInput = content.querySelector('input[type=file]');

  async function refresh() {
    grid.innerHTML = '<p class="loading-state">Loading…</p>';
    const files = await listMedia();
    if (!files.length) { grid.innerHTML = '<p class="empty-state">No uploads yet.</p>'; return; }
    grid.innerHTML = files.map(f => `
      <div class="media-item media-item-manage" data-name="${f.name}">
        <img src="${f.url}" alt="${f.name}" loading="lazy">
        <div class="media-item-actions">
          <button type="button" class="icon-btn" data-act="copy" title="Copy URL">⧉</button>
          <button type="button" class="icon-btn icon-btn-danger" data-act="delete" title="Delete">🗑</button>
        </div>
      </div>`).join('');

    grid.querySelectorAll('[data-act="copy"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.closest('.media-item').querySelector('img').src;
        navigator.clipboard.writeText(url);
        toast('URL copied.', 'success');
      });
    });
    grid.querySelectorAll('[data-act="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.closest('.media-item').dataset.name;
        const ok = await confirmDialog({ title: 'Delete this file?', body: 'If it’s still used on the site, that item will show a broken image until you replace it.' });
        if (!ok) return;
        try { await deleteMedia(name); toast('Deleted.', 'success'); refresh(); }
        catch (e) { toast(e.message, 'error'); }
      });
    });
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try { toast('Uploading…', 'info'); await uploadFile(file); toast('Uploaded.', 'success'); refresh(); }
    catch (e) { toast(e.message, 'error'); }
    finally { fileInput.value = ''; }
  });

  refresh();
}

boot();
