import { supabase } from './auth.js';
import { toast, confirmDialog, openModal, escapeHtml } from './ui.js';
import { mountImagePicker } from './media.js';

/* ================================================================
   FIELD RENDERING — builds one form from a field-config array.
================================================================ */
function mountRichText(container, value) {
  container.innerHTML = `
    <div class="richtext">
      <div class="richtext-toolbar">
        <button type="button" data-cmd="bold"><b>B</b></button>
        <button type="button" data-cmd="italic"><i>I</i></button>
        <button type="button" data-cmd="createlink">Link</button>
      </div>
      <div class="richtext-body" contenteditable="true">${value || ''}</div>
    </div>`;
  const body = container.querySelector('.richtext-body');
  container.querySelectorAll('.richtext-toolbar button').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd === 'createlink') {
        const url = prompt('Link URL:');
        if (url) document.execCommand(cmd, false, url);
      } else {
        document.execCommand(cmd, false, null);
      }
      body.focus();
    });
  });
  return () => body.innerHTML.trim();
}

async function fetchRelationOptions(relation) {
  const { data, error } = await supabase.from(relation.table).select('*').order('order_index', { ascending: true });
  if (error) return [];
  return (data || []).map(r => [r[relation.valueKey], r[relation.labelKey]]);
}

// Renders `fields` into `form`, pre-filled from `values`. Returns an async
// getValues() that reads the current state of every field back into an object.
async function buildForm(form, fields, values = {}) {
  form.innerHTML = '';
  const readers = {};

  for (const field of fields) {
    const wrap = document.createElement('div');
    wrap.className = `form-field field-${field.type}`;
    const val = values[field.key] ?? '';
    const label = document.createElement('label');
    label.textContent = field.label + (field.required ? ' *' : '');
    wrap.appendChild(label);

    if (field.type === 'textarea') {
      wrap.innerHTML += `<textarea name="${field.key}" rows="3" placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(val)}</textarea>`;
      readers[field.key] = () => wrap.querySelector('textarea').value;
    } else if (field.type === 'richtext') {
      const mount = document.createElement('div');
      wrap.appendChild(mount);
      const getHtml = mountRichText(mount, val);
      readers[field.key] = getHtml;
    } else if (field.type === 'select') {
      const sel = document.createElement('select');
      sel.name = field.key;
      field.options.forEach(([v, l]) => {
        const opt = document.createElement('option');
        opt.value = v; opt.textContent = l; opt.selected = v === val;
        sel.appendChild(opt);
      });
      wrap.appendChild(sel);
      readers[field.key] = () => sel.value;
    } else if (field.type === 'relation') {
      const sel = document.createElement('select');
      sel.name = field.key;
      const options = await fetchRelationOptions(field.relation);
      options.forEach(([v, l]) => {
        const opt = document.createElement('option');
        opt.value = v; opt.textContent = l; opt.selected = v === val;
        sel.appendChild(opt);
      });
      wrap.appendChild(sel);
      readers[field.key] = () => sel.value;
    } else if (field.type === 'checkbox') {
      wrap.innerHTML = `<label class="switch-row"><span class="switch"><input type="checkbox" name="${field.key}" ${val ? 'checked' : ''}><span class="switch-track"></span></span> ${field.label}</label>`;
      readers[field.key] = () => wrap.querySelector('input').checked;
    } else if (field.type === 'image') {
      const mount = document.createElement('div');
      wrap.appendChild(mount);
      let current = val;
      mountImagePicker(mount, { value: val, onChange: url => { current = url; } });
      readers[field.key] = () => current;
    } else if (field.type === 'number') {
      wrap.innerHTML += `<input type="number" name="${field.key}" step="${field.step || '1'}" value="${escapeHtml(val)}" placeholder="${escapeHtml(field.placeholder || '')}">`;
      readers[field.key] = () => { const n = wrap.querySelector('input').value; return n === '' ? null : Number(n); };
    } else {
      // text / email
      wrap.innerHTML += `<input type="${field.type === 'email' ? 'email' : 'text'}" name="${field.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(field.placeholder || '')}" ${field.readonly ? 'readonly' : ''}>`;
      readers[field.key] = () => wrap.querySelector('input').value;
    }

    if (field.hint) wrap.innerHTML += `<p class="field-hint">${field.hint}</p>`;
    form.appendChild(wrap);
  }

  return {
    getValues: () => {
      const out = {};
      for (const f of fields) out[f.key] = readers[f.key]();
      return out;
    },
    validate: () => {
      const values = form.querySelectorAll('[name]');
      for (const field of fields) {
        if (field.required) {
          const v = readers[field.key]();
          if (v === '' || v === null || v === undefined) return `"${field.label}" is required.`;
        }
      }
      return null;
    },
  };
}

/* ================================================================
   SINGLETON BLOCK — one row, id = 1, edit-in-place form.
================================================================ */
export async function renderSingletonBlock(container, block) {
  container.innerHTML = `<h2 class="block-title">${block.title}</h2><form class="entity-form"></form>`;
  const form = container.querySelector('form');
  const { data } = await supabase.from(block.table).select('*').eq('id', 1).maybeSingle();
  const { getValues, validate } = await buildForm(form, block.fields, data || {});

  const saveBar = document.createElement('div');
  saveBar.className = 'form-savebar';
  saveBar.innerHTML = `<button type="submit" class="btn btn-primary">Save changes</button><span class="save-status"></span>`;
  form.appendChild(saveBar);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const err = validate();
    if (err) { toast(err, 'error'); return; }
    const payload = getValues();
    const status = form.querySelector('.save-status');
    status.textContent = 'Saving…';
    const { error } = await supabase.from(block.table).update(payload).eq('id', 1);
    status.textContent = '';
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved.', 'success');
  });
}

/* ================================================================
   LIST BLOCK — rows with add / edit / delete / publish-toggle / reorder.
================================================================ */
export async function renderListBlock(container, block) {
  const pk = block.pk || 'id';
  container.innerHTML = `
    <div class="block-header">
      <h2 class="block-title">${block.title}</h2>
      ${block.noAdd ? '' : '<button type="button" class="btn btn-primary btn-sm" data-act="add">+ Add</button>'}
    </div>
    <div class="entity-list" data-empty="No items yet."></div>`;
  const listEl = container.querySelector('.entity-list');
  const addBtn = container.querySelector('[data-act="add"]');

  async function fetchRows() {
    let q = supabase.from(block.table).select('*');
    const sortKey = block.orderable ? 'order_index' : (block.sortKey || 'created_at');
    q = q.order(sortKey, { ascending: true });
    const { data, error } = await q;
    if (error) { toast(error.message, 'error'); return []; }
    return data || [];
  }

  function rowLabel(row) {
    return block.rowTitle ? block.rowTitle(row) : (row.title || row.name || row[pk]);
  }

  async function refresh() {
    listEl.innerHTML = '<p class="loading-state">Loading…</p>';
    const rows = await fetchRows();
    if (!rows.length) { listEl.innerHTML = `<p class="empty-state">${listEl.dataset.empty}</p>`; return; }
    listEl.innerHTML = '';
    rows.forEach(row => listEl.appendChild(renderRow(row)));
  }

  function renderRow(row) {
    const li = document.createElement('div');
    li.className = 'entity-row';
    li.draggable = !!block.orderable;
    li.dataset.pk = row[pk];
    const thumb = block.thumbKey || block.imageKey ? (row[block.thumbKey] || row[block.imageKey]) : null;
    li.innerHTML = `
      ${block.orderable ? '<span class="drag-handle" title="Drag to reorder">⠿</span>' : ''}
      ${thumb ? `<img class="row-thumb" src="${thumb}" alt="">` : ''}
      <span class="row-title">${escapeHtml(rowLabel(row))}</span>
      <span class="row-actions">
        ${block.noPublishToggle ? '' : `<button type="button" class="row-toggle ${row.published ? 'on' : ''}" data-act="toggle" title="Published">${row.published ? 'Published' : 'Hidden'}</button>`}
        <button type="button" class="icon-btn" data-act="edit" title="Edit">✎</button>
        ${block.noDelete ? '' : '<button type="button" class="icon-btn icon-btn-danger" data-act="delete" title="Delete">🗑</button>'}
      </span>`;

    li.querySelector('[data-act="edit"]').onclick = () => openEditor(row);
    const toggleBtn = li.querySelector('[data-act="toggle"]');
    if (toggleBtn) toggleBtn.onclick = async () => {
      const { error } = await supabase.from(block.table).update({ published: !row.published }).eq(pk, row[pk]);
      if (error) { toast(error.message, 'error'); return; }
      toast(!row.published ? 'Published.' : 'Hidden from the live site.', 'success');
      refresh();
    };
    const delBtn = li.querySelector('[data-act="delete"]');
    if (delBtn) delBtn.onclick = async () => {
      const ok = await confirmDialog({ title: `Delete "${rowLabel(row)}"?`, body: 'This cannot be undone.' });
      if (!ok) return;
      const { error } = await supabase.from(block.table).delete().eq(pk, row[pk]);
      if (error) { toast(error.message, 'error'); return; }
      toast('Deleted.', 'success');
      refresh();
    };

    if (block.orderable) {
      li.addEventListener('dragstart', () => li.classList.add('dragging'));
      li.addEventListener('dragend', async () => {
        li.classList.remove('dragging');
        const ids = [...listEl.children].map(el => el.dataset.pk);
        await Promise.all(ids.map((id, i) => supabase.from(block.table).update({ order_index: i }).eq(pk, id)));
      });
      li.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = listEl.querySelector('.dragging');
        if (!dragging || dragging === li) return;
        const rect = li.getBoundingClientRect();
        const after = (e.clientY - rect.top) > rect.height / 2;
        listEl.insertBefore(dragging, after ? li.nextSibling : li);
      });
    }
    return li;
  }

  function openEditor(row) {
    const isNew = !row;
    openModal(`
      <button class="modal-close" data-act="close" aria-label="Close">&times;</button>
      <h3>${isNew ? 'Add' : 'Edit'} ${block.title.replace(/s$/, '')}</h3>
      <form class="entity-form"></form>
    `, {
      onMount: async (modal, close) => {
        const form = modal.querySelector('form');
        const initial = row || {};
        if (!block.noPublishToggle && isNew) initial.published = true;
        const { getValues, validate } = await buildForm(form, block.fields, initial);
        const actions = document.createElement('div');
        actions.className = 'modal-actions';
        actions.innerHTML = `<button type="button" class="btn btn-ghost" data-act="cancel">Cancel</button><button type="submit" class="btn btn-primary">${isNew ? 'Add' : 'Save'}</button>`;
        form.appendChild(actions);
        actions.querySelector('[data-act="cancel"]').onclick = close;

        form.addEventListener('submit', async e => {
          e.preventDefault();
          const err = validate();
          if (err) { toast(err, 'error'); return; }
          const payload = getValues();
          if (block.pk) delete payload[block.pk]; // never let the UI change a primary key
          if (isNew) {
            if (block.orderable) {
              const { count } = await supabase.from(block.table).select('*', { count: 'exact', head: true });
              payload.order_index = count || 0;
            }
            if (!block.noPublishToggle) payload.published = true;
            const { error } = await supabase.from(block.table).insert(payload);
            if (error) { toast(error.message, 'error'); return; }
            toast('Added.', 'success');
          } else {
            const { error } = await supabase.from(block.table).update(payload).eq(pk, row[pk]);
            if (error) { toast(error.message, 'error'); return; }
            toast('Saved.', 'success');
          }
          close();
          refresh();
        });
      },
    });
  }

  if (addBtn) addBtn.onclick = () => openEditor(null);
  await refresh();
}

export async function renderBlocks(container, blocks) {
  container.innerHTML = '';
  for (const block of blocks) {
    const section = document.createElement('section');
    section.className = 'block';
    container.appendChild(section);
    if (block.type === 'singleton') await renderSingletonBlock(section, block);
    else await renderListBlock(section, block);
  }
}
