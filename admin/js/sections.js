// Declarative config for every manageable section. The CRUD engine (crud.js)
// renders forms/lists purely from this data — add a field here and it shows
// up in the dashboard with no other code changes.

export const SECTIONS = [
  { id: 'overview', label: 'Overview', kind: 'overview' },

  {
    id: 'profile', label: 'Profile & Hero', kind: 'blocks',
    blocks: [{
      type: 'singleton', table: 'profile', title: 'Profile',
      fields: [
        { key: 'full_name', label: 'Full name', type: 'text', required: true },
        { key: 'headline', label: 'Role headline', type: 'text', required: true, hint: 'Shown under your name in the hero, e.g. "Urban Planner · MEL Specialist · GIS Analyst"' },
        { key: 'location', label: 'Location', type: 'text', hint: 'Small kicker above your name' },
        { key: 'hero_tagline', label: 'Hero tagline', type: 'textarea' },
        { key: 'email', label: 'Contact email', type: 'email' },
        { key: 'phone', label: 'Phone', type: 'text', hint: 'Include country code, digits only, e.g. +8801XXXXXXXXX' },
        { key: 'cv_url', label: 'CV file (PDF)', type: 'image' },
      ],
    }],
  },

  {
    id: 'about', label: 'About', kind: 'blocks',
    blocks: [
      {
        type: 'singleton', table: 'about_content', title: 'About text',
        fields: [
          { key: 'paragraph_1', label: 'Paragraph 1', type: 'richtext' },
          { key: 'paragraph_2', label: 'Paragraph 2', type: 'richtext' },
          { key: 'paragraph_3', label: 'Paragraph 3', type: 'richtext' },
        ],
      },
      {
        type: 'list', table: 'stats', title: 'Stats', orderable: true,
        fields: [
          { key: 'value', label: 'Number', type: 'number', required: true },
          { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+' },
          { key: 'label', label: 'Label', type: 'text', required: true },
        ],
        rowTitle: r => `${r.value}${r.suffix || ''} — ${r.label}`,
      },
      {
        type: 'list', table: 'skill_groups', title: 'Skill Groups', orderable: true,
        fields: [
          { key: 'title', label: 'Group title', type: 'text', required: true, placeholder: 'Spatial' },
          { key: 'items', label: 'Skills (separated by · )', type: 'text', required: true },
        ],
        rowTitle: r => r.title,
      },
    ],
  },

  {
    id: 'hero_pins', label: 'Globe Pins', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'hero_pins', title: 'Hero Globe Pins', orderable: true,
      fields: [
        { key: 'layer', label: 'Layer', type: 'select', required: true, options: [['work', "Where I've worked (teal)"], ['notes', 'Banknote countries (gold)']] },
        { key: 'name', label: 'Name / Country', type: 'text', required: true },
        { key: 'sub', label: 'Subtitle', type: 'text', hint: 'Work layer only — role/project blurb shown on hover' },
        { key: 'count', label: 'Banknote count', type: 'number', hint: 'Notes layer only — drives pin size' },
        { key: 'lat', label: 'Latitude', type: 'number', step: 'any', required: true },
        { key: 'lon', label: 'Longitude', type: 'number', step: 'any', required: true },
      ],
      rowTitle: r => `[${r.layer}] ${r.name}`,
    }],
  },

  {
    id: 'experience', label: 'Experience', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'experience', title: 'Experience Timeline', orderable: true,
      fields: [
        { key: 'date_range', label: 'Date range', type: 'text', required: true, placeholder: 'Apr 2024 — Present' },
        { key: 'title', label: 'Title — Organization', type: 'text', required: true },
        { key: 'org_line', label: 'Project / org line', type: 'text' },
        { key: 'description', label: 'Description', type: 'richtext' },
      ],
      rowTitle: r => r.title,
    }],
  },

  {
    id: 'gis', label: 'GIS Work', kind: 'blocks',
    blocks: [
      {
        type: 'singleton', table: 'featured_project', title: 'Featured Project Write-up',
        fields: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'description', label: 'Description', type: 'richtext' },
          { key: 'tools', label: 'Tools / methods line', type: 'text' },
        ],
      },
      {
        type: 'list', table: 'gis_items', title: 'GIS Images', orderable: true,
        fields: [
          { key: 'image_url', label: 'Image', type: 'image', required: true },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'caption', label: 'Caption', type: 'text', hint: 'Shown in the lightbox; defaults to the title if left blank' },
          { key: 'featured', label: 'Show in featured project gallery', type: 'checkbox' },
        ],
        rowTitle: r => r.title,
        thumbKey: 'thumb_url', imageKey: 'image_url',
      },
    ],
  },

  {
    id: 'event_maps', label: 'Event Maps', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'event_map_items', title: 'Event Map Images', orderable: true,
      fields: [
        { key: 'image_url', label: 'Image', type: 'image', required: true },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'caption', label: 'Caption', type: 'text' },
      ],
      rowTitle: r => r.title,
      thumbKey: 'thumb_url', imageKey: 'image_url',
    }],
  },

  {
    id: 'design', label: 'Design Work', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'design_items', title: 'Design Images', orderable: true,
      fields: [
        { key: 'image_url', label: 'Image', type: 'image', required: true },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'caption', label: 'Caption', type: 'text' },
      ],
      rowTitle: r => r.title,
      thumbKey: 'thumb_url', imageKey: 'image_url',
    }],
  },

  {
    id: 'reports', label: 'Reports', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'reports', title: 'Reports', orderable: true,
      fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'richtext' },
        { key: 'tag', label: 'Tag line', type: 'text', placeholder: 'MEL · WASH · climate resilience' },
      ],
      rowTitle: r => r.title,
    }],
  },

  {
    id: 'collection', label: 'Collection', kind: 'blocks',
    blocks: [
      {
        type: 'list', table: 'collection_groups', title: 'Groups', orderable: true,
        fields: [
          { key: 'title', label: 'Group title', type: 'text', required: true },
          { key: 'slug', label: 'Slug', type: 'text', required: true, hint: 'Lowercase, no spaces — used internally' },
          { key: 'description', label: 'Description', type: 'text' },
        ],
        rowTitle: r => r.title,
      },
      {
        type: 'list', table: 'collection_items', title: 'Collages', orderable: true,
        fields: [
          { key: 'image_url', label: 'Image', type: 'image', required: true },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'group_id', label: 'Group', type: 'relation', relation: { table: 'collection_groups', valueKey: 'id', labelKey: 'title' }, required: true },
        ],
        rowTitle: r => r.title,
        thumbKey: 'thumb_url', imageKey: 'image_url',
      },
    ],
  },

  {
    id: 'seo', label: 'SEO', kind: 'blocks',
    blocks: [{
      type: 'list', table: 'seo_meta', title: 'Page Metadata', orderable: false, noAdd: true, noDelete: true, noPublishToggle: true, pk: 'page_slug', sortKey: 'page_slug',
      fields: [
        { key: 'page_slug', label: 'Page', type: 'text', readonly: true },
        { key: 'title', label: 'Title tag', type: 'text' },
        { key: 'description', label: 'Meta description', type: 'textarea' },
      ],
      rowTitle: r => r.page_slug,
    }],
  },

  { id: 'media', label: 'Media Library', kind: 'media' },
];
