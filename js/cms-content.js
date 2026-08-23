import { supabase, cmsEnabled } from './supabase-client.js';

// Every loader resolves to null on any failure (no config, network error,
// empty table) so callers can fall back to the site's built-in defaults.
// The public site must never break because the CMS is unreachable.
async function safeSelect(table, { order, single } = {}) {
  if (!cmsEnabled) return null;
  try {
    let q = supabase.from(table).select('*');
    if (order) q = q.order(order, { ascending: true });
    const { data, error } = single ? await q.maybeSingle() : await q;
    if (error) throw error;
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    return data;
  } catch (err) {
    console.warn(`[cms] ${table} unavailable, using built-in content.`, err);
    return null;
  }
}

export const loadProfile = () => safeSelect('profile', { single: true });
export const loadAboutContent = () => safeSelect('about_content', { single: true });
export const loadStats = () => safeSelect('stats', { order: 'order_index' });
export const loadSkillGroups = () => safeSelect('skill_groups', { order: 'order_index' });
export const loadHeroPins = () => safeSelect('hero_pins', { order: 'order_index' });
export const loadExperience = () => safeSelect('experience', { order: 'order_index' });
export const loadGisItems = () => safeSelect('gis_items', { order: 'order_index' });
export const loadFeaturedProject = () => safeSelect('featured_project', { single: true });
export const loadEventMapItems = () => safeSelect('event_map_items', { order: 'order_index' });
export const loadDesignItems = () => safeSelect('design_items', { order: 'order_index' });
export const loadReports = () => safeSelect('reports', { order: 'order_index' });
export const loadCollectionGroups = () => safeSelect('collection_groups', { order: 'order_index' });
export const loadCollectionItems = () => safeSelect('collection_items', { order: 'order_index' });
export const loadSocialLinks = () => safeSelect('social_links', { order: 'order_index' });

export async function loadSeoMeta(pageSlug) {
  if (!cmsEnabled) return null;
  try {
    const { data, error } = await supabase.from('seo_meta').select('*').eq('page_slug', pageSlug).maybeSingle();
    if (error || !data || (!data.title && !data.description)) return null;
    return data;
  } catch (err) {
    console.warn('[cms] seo_meta unavailable, using built-in tags.', err);
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
