import { supabase } from './auth.js';
import { toast, openModal } from './ui.js';

const BUCKET = 'media';
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

export function validateFile(file) {
  if (!ALLOWED.includes(file.type)) return 'Only JPG, PNG, WebP, GIF or PDF files are allowed.';
  if (file.size > MAX_BYTES) return 'File is larger than 5MB.';
  return null;
}

export async function uploadFile(file) {
  const err = validateFile(file);
  if (err) throw new Error(err);
  const safeName = file.name.replace(/[^A-Za-z0-9_.-]/g, '_');
  const path = `${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function listMedia() {
  const { data, error } = await supabase.storage.from(BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } });
  if (error) throw error;
  return (data || [])
    .filter(f => f.name && !f.name.startsWith('.'))
    .map(f => ({ name: f.name, url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl }));
}

export async function deleteMedia(name) {
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) throw error;
}

// An <input type=file> + preview + "choose existing" button, wired to a hidden
// text input holding the resulting URL. Returns nothing; mutates the DOM in place.
const isPdf = url => /\.pdf(\?|$)/i.test(url || '');
const previewMarkup = url => {
  if (!url) return '<span>No file</span>';
  if (isPdf(url)) return '<span class="file-icon">📄 PDF</span>';
  return `<img src="${url}" alt="">`;
};

export function mountImagePicker(container, { value = '', onChange }) {
  container.innerHTML = `
    <div class="image-picker">
      <div class="image-preview ${value ? '' : 'empty'}">
        ${previewMarkup(value)}
      </div>
      <div class="image-picker-actions">
        <label class="btn btn-ghost btn-sm">
          Upload new
          <input type="file" accept="image/*,application/pdf" hidden>
        </label>
        <button type="button" class="btn btn-ghost btn-sm" data-act="browse">Choose existing</button>
        <input type="text" class="image-url-input" placeholder="or paste an image URL" value="${value}">
      </div>
    </div>`;

  const preview = container.querySelector('.image-preview');
  const fileInput = container.querySelector('input[type=file]');
  const urlInput = container.querySelector('.image-url-input');
  const browseBtn = container.querySelector('[data-act="browse"]');

  const setValue = url => {
    urlInput.value = url || '';
    preview.classList.toggle('empty', !url);
    preview.innerHTML = previewMarkup(url);
    onChange(url);
  };

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      toast('Uploading…', 'info');
      const url = await uploadFile(file);
      setValue(url);
      toast('Uploaded.', 'success');
    } catch (e) {
      toast(e.message || 'Upload failed.', 'error');
    } finally {
      fileInput.value = '';
    }
  });

  urlInput.addEventListener('input', () => setValue(urlInput.value.trim()));

  browseBtn.addEventListener('click', async () => {
    let files = [];
    try { files = await listMedia(); } catch (e) { toast('Could not load media library.', 'error'); return; }
    openModal(`
      <button class="modal-close" data-act="close" aria-label="Close">&times;</button>
      <h3>Choose an existing file</h3>
      <div class="media-grid">
        ${files.length ? files.map(f => `
          <button type="button" class="media-item" data-url="${f.url}" title="${f.name}">
            <img src="${f.url}" alt="${f.name}" loading="lazy">
          </button>`).join('') : '<p class="empty-state">No uploads yet.</p>'}
      </div>
    `, {
      onMount: (modal, close) => {
        modal.querySelectorAll('.media-item').forEach(btn => {
          btn.addEventListener('click', () => { setValue(btn.dataset.url); close(); });
        });
      }
    });
  });
}
