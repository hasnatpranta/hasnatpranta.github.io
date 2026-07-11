import * as THREE from 'three';

/* ================================================================
   DATA
================================================================ */
const workPins = [
  { name: 'Satkhira', sub: 'GO4IMPact — MEL Coordinator (current)', lat: 22.72, lon: 89.07 },
  { name: 'Khulna', sub: 'CRC — M&E Officer · KUET', lat: 22.82, lon: 89.55 },
  { name: 'Dhaka', sub: 'Traffic & feasibility studies (DNCC, DSCC)', lat: 23.81, lon: 90.41 },
  { name: 'Gaibandha & Kurigram', sub: 'GIS mapping — Red Crescent (BDRCS)', lat: 25.55, lon: 89.55 },
  { name: 'Rajshahi', sub: 'Urban LEDS II — open green space plan', lat: 24.37, lon: 88.6 },
  { name: 'Bagerhat (Sarankhola)', sub: 'Storm-surge vulnerability study', lat: 22.31, lon: 89.79 },
];

const noteCountries = [
  ['Bangladesh', 81, 23.7, 90.4], ['India', 9, 21.0, 78.0], ['Pakistan', 8, 30.4, 69.4],
  ['Nepal', 6, 28.4, 84.1], ['China', 3, 35.0, 104.0], ['United States', 3, 39.8, -98.6],
  ['Mongolia', 3, 46.9, 103.8], ['Ukraine', 3, 48.4, 31.2], ['Trinidad and Tobago', 2, 10.7, -61.2],
  ['Saudi Arabia', 2, 24.0, 45.0], ['Qatar', 2, 25.3, 51.2], ['Malaysia', 2, 4.2, 102.0],
  ['Venezuela', 2, 6.4, -66.6], ['Iraq', 2, 33.2, 43.7], ['Philippines', 1, 12.9, 121.8],
  ['Croatia', 1, 45.1, 15.2], ['Nicaragua', 1, 12.9, -85.2], ['Kyrgyzstan', 1, 41.2, 74.8],
  ['Argentina', 1, -38.4, -63.6], ['Hong Kong', 1, 22.3, 114.2], ['Soviet Union', 1, 55.7, 37.6],
  ['South Sudan', 1, 6.9, 31.3], ['Myanmar', 1, 21.9, 95.9], ['Bahamas', 1, 25.0, -77.4],
  ['Transnistria', 1, 47.2, 29.5], ['Bhutan', 1, 27.5, 90.4], ['Cambodia', 1, 12.6, 104.9],
  ['Sri Lanka', 1, 7.9, 80.8], ['North Korea', 1, 40.3, 127.5], ['Egypt', 1, 26.8, 30.8],
  ['Oman', 1, 21.5, 55.9],
];

const gisImages = [
  ['Assasuni', 'Programme activity coverage — Assasuni Upazila, Satkhira'],
  ['Shyamnagar', 'Activity coverage on the edge of the Sundarbans — Shyamnagar'],
  ['Municipality', 'Activity coverage — Satkhira Municipality'],
];
const featuredGis = [
  ['Picture5', 'Physical Vulnerability Index (PVI) risk map'],
  ['Picture1', 'Khontakata Union — study area'],
  ['Picture2', 'Terrain elevation model'],
  ['Picture4', 'Storm-surge inundation, 6 m scenario'],
  ['Picture3', 'Storm-surge inundation, 4 m scenario'],
  ['Picture6', 'Building Vulnerability Index (BVI) risk map'],
  ['Picture7', 'Cyclone shelter service areas — served'],
  ['Picture8', 'Cyclone shelter service areas — unserved'],
  ['Picture9', 'Cyclone shelter service areas — overserved'],
];
const eventImages = [
  ['7fe45255-a83f-4f7c-90f2-ee856b70003a', 'Festival site map — Fiverr client, USA'],
  ['a4efd411-8028-4287-88ab-ac80ba167df6', 'Event map commission — Fiverr'],
  ['ac50b61a-58cb-4323-8b1e-94251ef39891', 'Event map commission — Fiverr'],
  ['ac88045b-5831-45a2-a3d1-4156ba134d07', 'Event map commission — Fiverr'],
  ['e6a57742-9803-4331-9369-68d018e89a75', 'Event map commission — Fiverr'],
];
const designImages = [
  ['Banner_DDLG', 'Programme roll-up banner — GO4IMPact / WaterAid–Swisscontact'],
  ['Banner_Photo_gallery', 'Photo gallery banner — programme event'],
  ['Poster', 'Campaign poster'],
  ['News', 'News / bulletin design'],
  ['Photobooth', 'Event photobooth frame'],
];
const collages = [
  ['World_00_One_Note_Per_Country', 'One note per country — the whole collection', 'world'],
  ['Theme_03_Chronological_Timeline', 'A timeline of the world — arranged by year of issue', 'theme'],
  ['Theme_02_Faces_of_Currency', 'Faces of currency', 'theme'],
  ['Theme_04_Colour_Spectrum', 'The colour spectrum of money', 'theme'],
  ['Theme_01_The_Number_One', 'The number one, around the world', 'theme'],
  ['Bangladesh_00_Denomination_Showcase', 'Bangladesh — denomination showcase', 'bd'],
  ['Bangladesh_01_One_Taka_Evolution', 'Evolution of the one taka', 'bd'],
  ['Bangladesh_02_Two_Taka_Variations', 'Two taka variations', 'bd'],
  ['Bangladesh_03_Five_Taka_Evolution', 'Evolution of the five taka', 'bd'],
  ['Bangladesh_04_Ten_Taka_Variations', 'Ten taka variations', 'bd'],
  ['Bangladesh_05_Twenty_Taka', 'Twenty taka', 'bd'],
  ['Bangladesh_06_Fifty_Taka', 'Fifty taka', 'bd'],
  ['Bangladesh_07_Higher_Denominations', 'Higher denominations of Bangladesh', 'bd'],
  ['World_01_India', 'India', 'world'],
  ['World_02_Pakistan', 'Pakistan', 'world'],
  ['World_03_Nepal_Bhutan_SriLanka', 'Nepal, Bhutan & Sri Lanka', 'world'],
  ['World_04_Middle_East', 'The Middle East', 'world'],
  ['World_05_East_Southeast_Asia', 'East & Southeast Asia', 'world'],
  ['World_06_Europe_ExUSSR', 'Europe & the former USSR', 'world'],
  ['World_07_Americas_Africa', 'The Americas & Africa', 'world'],
  ['Denomination_01_Ones', 'Ones of the world', 'denom'],
  ['Denomination_02_Twos', 'Twos of the world', 'denom'],
  ['Denomination_03_Fives', 'Fives of the world', 'denom'],
  ['Denomination_04_Tens', 'Tens of the world', 'denom'],
  ['Denomination_05_Twenties', 'Twenties of the world', 'denom'],
  ['Denomination_06_Fifties', 'Fifties of the world', 'denom'],
  ['Denomination_07_Hundreds', 'Hundreds of the world', 'denom'],
  ['Denomination_08_High_200_500_1000', 'High denominations — 200, 500 & 1000', 'denom'],
  ['Denomination_09_Odd_Fractional', 'Odd & fractional denominations', 'denom'],
];

/* ================================================================
   GLOBE
================================================================ */
const canvas = document.getElementById('globe-canvas');
const tooltip = document.getElementById('globe-tooltip');
const R = 1;

function latLonToVec3(lat, lon, r = R) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

const globeGroup = new THREE.Group();
scene.add(globeGroup);

// Sphere body
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(R, 64, 64),
  new THREE.MeshPhongMaterial({ color: 0x101c33, transparent: true, opacity: 0.94, shininess: 12 })
);
globeGroup.add(sphere);

// Graticule
const gratMat = new THREE.LineBasicMaterial({ color: 0x2a3b5c, transparent: true, opacity: 0.5 });
for (let lat = -60; lat <= 60; lat += 30) {
  const pts = [];
  for (let lon = -180; lon <= 180; lon += 4) pts.push(latLonToVec3(lat, lon, R * 1.001));
  globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
}
for (let lon = -180; lon < 180; lon += 30) {
  const pts = [];
  for (let lat = -90; lat <= 90; lat += 4) pts.push(latLonToVec3(lat, lon, R * 1.001));
  globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
}

// Atmosphere glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(R * 1.12, 48, 48),
  new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false,
    uniforms: { c: { value: new THREE.Color(0x3ec6b5) } },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vN; uniform vec3 c; void main(){ float i = pow(0.72 - dot(vN, vec3(0,0,1.0)), 3.0); gl_FragColor = vec4(c, 1.0) * i; }`
  })
);
scene.add(glow);

// Land outlines (fetched; globe degrades gracefully without them)
fetch('https://cdn.jsdelivr.net/npm/world-geojson-smaller@1.0.1/world.geo.json')
  .then(r => { if (!r.ok) throw 0; return r.json(); })
  .catch(() => fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json').then(r => r.json()))
  .then(geo => {
    const mat = new THREE.LineBasicMaterial({ color: 0x4d6488, transparent: true, opacity: 0.85 });
    const segs = [];
    const addRing = ring => {
      for (let i = 0; i < ring.length - 1; i++) {
        if (Math.abs(ring[i][0] - ring[i + 1][0]) > 180) continue;
        segs.push(latLonToVec3(ring[i][1], ring[i][0], R * 1.002));
        segs.push(latLonToVec3(ring[i + 1][1], ring[i + 1][0], R * 1.002));
      }
    };
    geo.features.forEach(f => {
      const g = f.geometry;
      if (!g) return;
      if (g.type === 'Polygon') g.coordinates.forEach(addRing);
      else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(addRing));
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints(segs);
    globeGroup.add(new THREE.LineSegments(lineGeo, mat));
  })
  .catch(() => { /* graticule-only globe */ });

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.85));
const keyLight = new THREE.DirectionalLight(0xfff2d8, 1.1);
keyLight.position.set(4, 2, 4);
scene.add(keyLight);

// Pins
const pinGroups = { work: new THREE.Group(), notes: new THREE.Group() };
globeGroup.add(pinGroups.work, pinGroups.notes);
const pickables = [];

function makePin(lat, lon, color, size, data) {
  const pos = latLonToVec3(lat, lon, R * 1.005);
  const pin = new THREE.Mesh(
    new THREE.SphereGeometry(size, 12, 12),
    new THREE.MeshBasicMaterial({ color })
  );
  pin.position.copy(pos);
  pin.userData = data;
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.9, 12, 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 })
  );
  halo.position.copy(pos);
  pickables.push(pin);
  const g = new THREE.Group();
  g.add(halo, pin);
  return g;
}

workPins.forEach(p =>
  pinGroups.work.add(makePin(p.lat, p.lon, 0x3ec6b5, 0.016, { title: p.name, sub: p.sub })));
noteCountries.forEach(([name, count, lat, lon]) =>
  pinGroups.notes.add(makePin(lat, lon, 0xd4a94e, 0.010 + Math.min(count, 12) * 0.0011,
    { title: name, sub: count + (count === 1 ? ' banknote' : ' banknotes') + ' in the collection' })));

// Layer toggles
document.querySelectorAll('.legend-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    pinGroups[btn.dataset.layer].visible = btn.classList.contains('active');
  });
});

// Sizing: globe sits right-of-center on desktop, behind content on mobile
let isMobile = false;
function layout() {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  isMobile = w < 720;
  camera.position.set(isMobile ? 0 : -1.15, 0.15, 3.55);
  camera.lookAt(isMobile ? 0 : -1.15 + 0.75, 0, 0);
  camera.updateProjectionMatrix();
  globeGroup.position.x = glow.position.x = isMobile ? 0 : 0.95;
}
layout();
window.addEventListener('resize', layout);

// Drag + inertia
let dragging = false, px = 0, py = 0, vx = 0.0016, vy = 0, userTouched = false;
const startDrag = (x, y) => { dragging = true; px = x; py = y; userTouched = true; canvas.classList.add('dragging'); };
const moveDrag = (x, y) => {
  if (!dragging) return;
  vx = (x - px) * 0.00022 + vx * 0.5;
  vy = (y - py) * 0.00022 + vy * 0.5;
  globeGroup.rotation.y += (x - px) * 0.005;
  globeGroup.rotation.x = Math.max(-0.9, Math.min(0.9, globeGroup.rotation.x + (y - py) * 0.005));
  px = x; py = y;
};
const endDrag = () => { dragging = false; canvas.classList.remove('dragging'); };
canvas.addEventListener('pointerdown', e => startDrag(e.clientX, e.clientY));
window.addEventListener('pointermove', e => moveDrag(e.clientX, e.clientY));
window.addEventListener('pointerup', endDrag);

// Hover tooltip
const raycaster = new THREE.Raycaster();
raycaster.params.Points = { threshold: 0.05 };
const mouseNDC = new THREE.Vector2(-2, -2);
let mouseClient = { x: 0, y: 0 };
canvas.addEventListener('pointermove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  mouseClient = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});

// Initial orientation: South Asia facing camera
globeGroup.rotation.y = -2.05;
globeGroup.rotation.x = 0.28;

// Only render while the hero is on screen
let heroVisible = true;
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0.02 })
  .observe(document.querySelector('.hero'));

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (!heroVisible || document.hidden) return;
  const dt = clock.getDelta();

  if (!dragging) {
    if (!userTouched) globeGroup.rotation.y += 0.0016;
    else {
      globeGroup.rotation.y += vx;
      globeGroup.rotation.x = Math.max(-0.9, Math.min(0.9, globeGroup.rotation.x + vy));
      vx *= 0.965; vy *= 0.965;
      if (Math.abs(vx) < 0.0004) vx = 0.0004; // settle back into gentle spin
    }
  }

  // pulse halos
  const t = clock.elapsedTime;
  [pinGroups.work, pinGroups.notes].forEach(gr =>
    gr.children.forEach((g, i) => {
      const halo = g.children[0];
      const s = 1 + 0.25 * Math.sin(t * 2 + i);
      halo.scale.setScalar(s);
    }));

  // hover
  raycaster.setFromCamera(mouseNDC, camera);
  const visiblePicks = pickables.filter(p => p.parent.parent.visible);
  const hits = raycaster.intersectObjects(visiblePicks, false);
  if (hits.length) {
    const d = hits[0].object.userData;
    tooltip.innerHTML = `<div class="tt-title">${d.title}</div><div class="tt-sub">${d.sub}</div>`;
    tooltip.style.left = mouseClient.x + 'px';
    tooltip.style.top = mouseClient.y + 'px';
    tooltip.classList.add('visible');
    document.body.style.cursor = 'pointer';
  } else {
    tooltip.classList.remove('visible');
    document.body.style.cursor = '';
  }

  renderer.render(scene, camera);
}
animate();

/* ================================================================
   GALLERIES + LIGHTBOX
================================================================ */
const lbState = { items: [], index: 0 };
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-caption');

function openLightbox(items, index) {
  lbState.items = items; lbState.index = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function updateLightbox() {
  const [src, cap] = lbState.items[lbState.index];
  lbImg.src = src; lbImg.alt = cap; lbCap.textContent = cap;
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lb-close').onclick = closeLightbox;
document.getElementById('lb-prev').onclick = () => { lbState.index = (lbState.index - 1 + lbState.items.length) % lbState.items.length; updateLightbox(); };
document.getElementById('lb-next').onclick = () => { lbState.index = (lbState.index + 1) % lbState.items.length; updateLightbox(); };
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lb-prev').onclick();
  if (e.key === 'ArrowRight') document.getElementById('lb-next').onclick();
});

function buildGallery(containerId, folder, list, extra = '') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const full = list.map(([base, cap]) => [`assets/img/${folder}/${base}.jpg`, cap]);
  list.forEach(([base, cap, cat], i) => {
    const fig = document.createElement('figure');
    fig.className = 'g-item' + extra;
    if (cat) fig.dataset.cat = cat;
    fig.innerHTML = `<img src="assets/img/${folder}/thumb/${base}.jpg" alt="${cap}" loading="lazy">
      <figcaption class="g-label">${cap}</figcaption>`;
    fig.addEventListener('click', () => {
      const visible = [...el.querySelectorAll('.g-item:not(.hidden)')];
      const visibleFull = visible.map(v => full[[...el.children].indexOf(v)]);
      openLightbox(visibleFull, visible.indexOf(fig));
    });
    el.appendChild(fig);
  });
}

buildGallery('featured-gis', 'gis', featuredGis);
buildGallery('gis-grid', 'gis', gisImages);
buildGallery('event-grid', 'event', eventImages);
buildGallery('design-grid', 'design', designImages);
buildGallery('collage-grid', 'collages', collages);

// Collection filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('#collage-grid .g-item').forEach(item => {
      item.classList.toggle('hidden', f !== 'all' && item.dataset.cat !== f);
    });
  });
});

/* ================================================================
   SCROLL FX
================================================================ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.classList.contains('about-stats')) runCounters();
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .g-item').forEach(el => io.observe(el));

let countersRun = false;
function runCounters() {
  if (countersRun) return;
  countersRun = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.count;
    const t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const navbar = document.getElementById('navbar');
const progress = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h * 100) + '%';
}, { passive: true });

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
