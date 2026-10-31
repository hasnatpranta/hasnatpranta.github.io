import { SUPABASE_URL, SUPABASE_ANON_KEY } from './cms-config.js';

// The public site only ever reads, so it uses plain fetch against the REST API
// rather than downloading the Supabase client. One quick request goes first: if
// the database is paused or unreachable, the page just keeps its built-in content.
const TIMEOUT_MS = 4000;
const SINGLE_ROW = new Set(['profile', 'about_content', 'featured_project']);
const TABLES_BY_PAGE = {
  home: ['profile', 'about_content', 'stats', 'skill_groups', 'hero_pins', 'experience', 'reports'],
  gis: ['featured_project', 'gis_items'],
  'event-maps': ['event_map_items'],
  design: ['design_items'],
  collection: ['collection_groups', 'collection_items'],
};

async function fetchRows(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
  return res.json();
}

const readTable = async table => (SINGLE_ROW.has(table)
  ? (await fetchRows(table, ''))[0] ?? null
  : fetchRows(table, '&order=order_index.asc'));

// Resolves to { seo, <table>: rows, ... }, or null if the CMS can't be reached.
export async function loadPageContent(page) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const [seo] = await fetchRows('seo_meta', `&page_slug=eq.${encodeURIComponent(page)}`);
    const tables = TABLES_BY_PAGE[page] || [];
    const rows = await Promise.all(tables.map(readTable));
    return Object.fromEntries([['seo', seo ?? null], ...tables.map((t, i) => [t, rows[i]])]);
  } catch (err) {
    console.warn('[cms] unavailable, using built-in content.', err);
    return null;
  }
}

// Applies CMS title/description over the page's built-in <title>/<meta> tags, if present.
export function applySeoMeta(meta) {
  if (!meta) return;
  if (meta.title) {
    document.title = meta.title;
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach(el => el.setAttribute('content', meta.title));
  }
  if (meta.description) {
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach(el => el.setAttribute('content', meta.description));
  }
}
