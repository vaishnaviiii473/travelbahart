// =============================================
// TRAVELBHARAT - FRONTEND LOGIC (API-CONNECTED)
// =============================================

const API_BASE = (function () {
  if (window.location.protocol === 'file:' || window.location.port === '5500' || window.location.port === '5173') {
    return 'http://localhost:5000/api';
  }
  return 'https://travelbahartt.onrender.com/api';
})();

let STATES_DATA = [];
let STATES_LOADED = false;

const POPULAR_STATE_IDS = ["rajasthan", "kerala", "uttarakhand", "meghalaya", "goa", "himachal_pradesh"];
const LESSER_KNOWN_GEMS = [
  { name: "Hampi, Karnataka", state: "karnataka", desc: "Step into a surreal landscape of boulders and the forgotten ruins of a mighty empire." },
  { name: "Varanasi Spirituals", state: "uttar_pradesh", desc: "Where the Ganga glows at dawn and death is celebrated as liberation." },
  { name: "Valley of Flowers", state: "uttarakhand", desc: "A secret Himalayan valley carpeted with impossible wildflower bloom." }
];

function showLoadingBanner() {
  if (document.getElementById('api-loading-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'api-loading-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#FF6B1A;color:white;text-align:center;padding:10px;font-family:sans-serif;font-size:13px;z-index:9999;';
  banner.textContent = '⏳ Loading destinations... please wait a moment (first load takes ~30 seconds)';
  document.body.prepend(banner);
}

function hideLoadingBanner() {
  const banner = document.getElementById('api-loading-banner');
  if (banner) banner.remove();
}

async function apiGet(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function loadAllStates() {
  if (STATES_LOADED) return STATES_DATA;
  showLoadingBanner();
  try {
    const json = await apiGet('/states');
    STATES_DATA = json.data || [];
    STATES_LOADED = true;
    hideLoadingBanner();
  } catch (err) {
    hideLoadingBanner();
    console.error('Failed to load states from API:', err);
    showApiError();
    STATES_DATA = [];
  }
  return STATES_DATA;
}

async function fetchState(stateId) {
  if (STATES_LOADED) {
    const cached = STATES_DATA.find(s => s.id === stateId);
    if (cached) return cached;
  }
  try {
    const json = await apiGet(`/states/${stateId}`);
    return json.data || null;
  } catch (err) {
    console.error('Failed to load state:', err);
    return null;
  }
}

async function searchPlacesAPI(q, category) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  try {
    const json = await apiGet(`/states/search/places?${params.toString()}`);
    return json.data || [];
  } catch (err) {
    console.error('Search API failed, falling back to local filter:', err);
    return getAllPlacesLocal().filter(p => {
      const matchQ = !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.city.toLowerCase().includes(q.toLowerCase()) ||
        p.stateName.toLowerCase().includes(q.toLowerCase());
      const matchCat = !category || p.category === category;
      return matchQ && matchCat;
    });
  }
}

function showApiError() {
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#E03E3E;color:white;text-align:center;padding:10px;font-family:sans-serif;font-size:13px;z-index:9999;';
  banner.textContent = '⚠️ Could not reach the TravelBharat API. Is the backend running at ' + API_BASE + ' ?';
  document.body.prepend(banner);
}

function getStateLocal(id) { return STATES_DATA.find(s => s.id === id) || null; }
function getAllPlacesLocal() { return STATES_DATA.flatMap(s => (s.places || []).map(p => ({ ...p, stateName: s.name, stateId: s.id }))); }
function getStateParam() { return new URLSearchParams(window.location.search).get('state'); }

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30));
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }
}

function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

async function renderHomePage() {
  showLoadingState();
  await loadAllStates();
  hideLoadingState();
  renderCategoriesSection();
  renderPopularStates();
  renderAllStatesAZ();
  renderLesserKnownGems();
  initHeroSearch();
  initMainSearch();
}

function showLoadingState() {
  ['categories-grid', 'popular-states-grid', 'states-az-grid', 'gems-grid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<p style="color:var(--muted);padding:1rem 0">Loading…</p>';
  });
}
function hideLoadingState() {}

function renderCategoriesSection() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  const allPlaces = getAllPlacesLocal();
  const cats = [
    { name: "Heritage",  icon: "🏛️", count: allPlaces.filter(p => p.category === "Heritage").length },
    { name: "Nature",    icon: "🌿", count: allPlaces.filter(p => p.category === "Nature").length },
    { name: "Religious", icon: "🕌", count: allPlaces.filter(p => p.category === "Religious").length },
    { name: "Adventure", icon: "🧗", count: allPlaces.filter(p => p.category === "Adventure").length },
  ];
  grid.innerHTML = cats.map((c) => `
    <a class="category-card fade-up" href="#" data-cat="${c.name}" onclick="filterByCategory('${c.name}',event)">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count} destinations</div>
    </a>`).join('');
}

async function filterByCategory(cat, e) {
  e.preventDefault();
  document.querySelectorAll('.category-card').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  const places = await searchPlacesAPI('', cat);
  showSearchResults(places, `${cat} Destinations`);
  document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
}

function renderPopularStates() {
  const grid = document.getElementById('popular-states-grid');
  if (!grid) return;
  const states = POPULAR_STATE_IDS.map(id => getStateLocal(id)).filter(Boolean);
  if (!states.length) { grid.innerHTML = '<p style="color:var(--muted)">No states available.</p>'; return; }
  grid.innerHTML = states.map(s => `
    <a class="state-card fade-up" href="state.html?state=${s.id}">
      <img class="state-card-img" src="${s.image}" alt="${s.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#c9a87c,#8B6347)'">
      <div class="state-card-body">
        <span class="state-badge">${s.category}</span>
        <div class="state-card-name">${s.name}</div>
        <div class="state-card-desc">${s.tagline}</div>
        <div class="state-card-link">Explore ${s.name} →</div>
      </div>
    </a>`).join('');
}

function renderAllStatesAZ() {
  const grid = document.getElementById('states-az-grid');
  if (!grid) return;
  const sorted = [...STATES_DATA].sort((a, b) => a.name.localeCompare(b.name));
  if (!sorted.length) { grid.innerHTML = '<p style="color:var(--muted)">No states available.</p>'; return; }
  grid.innerHTML = sorted.map(s => `
    <a class="state-az-card fade-up" href="state.html?state=${s.id}">
      <div class="state-az-flag">${s.emoji}</div>
      <div class="state-az-info">
        <div class="state-az-name">${s.name}</div>
        <div class="state-az-places">${(s.places || []).length} destination${(s.places || []).length !== 1 ? 's' : ''}</div>
      </div>
    </a>`).join('');
}

function renderLesserKnownGems() {
  const grid = document.getElementById('gems-grid');
  if (!grid) return;
  const imgs = [
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"
  ];
  grid.innerHTML = LESSER_KNOWN_GEMS.map((g, i) => `
    <a class="gem-card fade-up" href="state.html?state=${g.state}">
      <img class="gem-card-img" src="${imgs[i]}" alt="${g.name}" loading="lazy">
      <div class="gem-overlay"></div>
      <div class="gem-body">
        <span class="gem-badge">Featured Destination</span>
        <div class="gem-title">${g.name}</div>
        <div class="gem-desc">${g.desc}</div>
      </div>
    </a>`).join('');
}

function initHeroSearch() {
  const input = document.getElementById('hero-search-input');
  if (!input) return;
  const btn = document.getElementById('hero-search-btn');
  const doSearch = async () => {
    const q = input.value.trim();
    if (!q) return;
    const results = await searchPlacesAPI(q, '');
    showSearchResults(results, `Results for "${q}"`);
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };
  btn?.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

function initMainSearch() {
  const input  = document.getElementById('main-search-input');
  const select = document.getElementById('main-search-select');
  const btn    = document.getElementById('main-search-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const q   = input?.value.trim() || '';
    const cat = select?.value || '';
    const results = await searchPlacesAPI(q, cat);
    const label = q ? `"${q}"` : cat ? cat : 'All Destinations';
    showSearchResults(results, `Results for ${label}`);
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function showSearchResults(places, title) {
  const section = document.getElementById('search-results');
  if (!section) return;
  section.classList.add('visible');
  const titleEl = document.getElementById('results-title');
  if (titleEl) titleEl.textContent = `${title} (${places.length})`;
  const grid = document.getElementById('results-grid');
  if (!grid) return;
  if (!places.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem 0">No destinations found. Try a different search.</p>';
    return;
  }
  grid.innerHTML = places.map(p => `
    <a class="result-card" href="state.html?state=${p.stateId}&place=${p.id}">
      <img class="result-img" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="result-body">
        <div class="result-state">${p.stateName}</div>
        <div class="result-name">${p.name}</div>
        <div class="result-cat">${p.category} • ${p.city}</div>
      </div>
    </a>`).join('');
}

async function renderStatePage() {
  const stateId = getStateParam();
  await loadAllStates().catch(() => {});
  let state = getStateLocal(stateId);
  if (!state) state = await fetchState(stateId);
  if (!state) {
    document.body.innerHTML = '<div style="padding:100px 5%;text-align:center"><h1>State not found</h1><a href="index.html">← Back to Home</a></div>';
    return;
  }
  document.title = `${state.name} — TravelBharat`;
  if (typeof window.updateStateSEO === 'function') window.updateStateSEO(state);
  const heroBg = document.getElementById('state-hero-bg-img');
  if (heroBg) heroBg.src = state.heroImage;
  const heroTitle = document.getElementById('state-hero-title');
  if (heroTitle) heroTitle.textContent = state.name;
  const heroTitleMain = document.getElementById('state-hero-title-main');
  if (heroTitleMain) heroTitleMain.textContent = state.name;
  const heroTagline = document.getElementById('state-hero-tagline');
  if (heroTagline) heroTagline.textContent = state.tagline;
  const heroMeta = document.getElementById('state-hero-meta');
  if (heroMeta) heroMeta.innerHTML = `
    <div class="meta-item"><span class="meta-icon">📅</span> Best Time: ${state.bestTime}</div>
    <div class="meta-item"><span class="meta-icon">🗣️</span> ${state.language}</div>
    <div class="meta-item"><span class="meta-icon">🍽️</span> ${state.cuisine}</div>
  `;
  const factsGrid = document.getElementById('facts-grid');
  if (factsGrid) factsGrid.innerHTML = `
    <div class="fact-item"><span class="fact-icon">📍</span><span class="fact-value">${state.capital}</span><span class="fact-label">Capital</span></div>
    <div class="fact-item"><span class="fact-icon">🗺️</span><span class="fact-value">${state.area}</span><span class="fact-label">Area</span></div>
    <div class="fact-item"><span class="fact-icon">🏛️</span><span class="fact-value">${(state.places || []).length}+</span><span class="fact-label">Destinations</span></div>
    <div class="fact-item"><span class="fact-icon">📅</span><span class="fact-value">${state.bestTime}</span><span class="fact-label">Best Time</span></div>
    <div class="fact-item"><span class="fact-icon">🍽️</span><span class="fact-value">${state.cuisine.split('/')[0].trim()}</span><span class="fact-label">Local Food</span></div>
  `;
  const aboutText = document.getElementById('about-text');
  if (aboutText) aboutText.innerHTML = `
    <p>${state.about}</p>
    <ul class="about-highlights">
      <li><span class="highlight-icon">✈️</span> Nearest major airport to ${state.capital}</li>
      <li><span class="highlight-icon">🚆</span> Well-connected by Indian Railways network</li>
      <li><span class="highlight-icon">🛣️</span> National Highways accessible</li>
      <li><span class="highlight-icon">🏨</span> Accommodation for every budget available</li>
    </ul>`;
  const aboutImages = document.getElementById('about-images');
  if (aboutImages && (state.places || []).length >= 1) {
    const imgs = state.places.slice(0, 3);
    aboutImages.innerHTML = imgs.map(p => `<div class="about-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>`).join('');
  }
  const placesSectionTitle = document.getElementById('places-section-title');
  if (placesSectionTitle) placesSectionTitle.textContent = `Explore ${state.name}`;
  const cats = ['All', ...new Set((state.places || []).map(p => p.category))];
  const filtersEl = document.getElementById('places-filter');
  if (filtersEl) {
    filtersEl.innerHTML = cats.map((c, i) => `
      <button class="filter-btn${i === 0 ? ' active' : ''}" data-cat="${c}" onclick="filterPlaces('${c}', this)">${c}</button>`).join('');
  }
  renderPlaces(state.places || [], state);
  const placeParam = new URLSearchParams(window.location.search).get('place');
  if (placeParam) {
    const place = (state.places || []).find(p => p.id === placeParam);
    if (place) setTimeout(() => openModal(place, state.name), 400);
  }
  window.__currentState = state;
}

function renderPlaces(places, state) {
  const grid = document.getElementById('places-grid');
  if (!grid) return;
  const st = state || window.__currentState;
  if (!places.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem 0">No destinations in this category yet.</p>';
    return;
  }
  grid.innerHTML = places.map(p => `
    <div class="place-card fade-up" onclick='openModal(${JSON.stringify(p)}, "${st.name}")'>
      <div class="place-card-img-wrap">
        <img class="place-card-img" src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="place-card-cat">${p.category}</span>
      </div>
      <div class="place-card-body">
        <div class="place-card-name">${p.name}</div>
        <div class="place-card-city">📍 ${p.city}</div>
        <div class="place-card-desc">${p.desc}</div>
        <div class="place-card-footer">
          <span class="place-best-time">🌤️ ${p.bestTime}</span>
          <span class="place-explore">Explore →</span>
        </div>
      </div>
    </div>`).join('');
  setTimeout(initScrollAnimations, 50);
}

function filterPlaces(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const state = window.__currentState;
  if (!state) return;
  const filtered = cat === 'All' ? (state.places || []) : (state.places || []).filter(p => p.category === cat);
  renderPlaces(filtered, state);
}

let _galleryImages = [];
let _galleryIdx = 0;

function openModal(place, stateName) {
  const modal = document.getElementById('place-modal');
  if (!modal) return;
  const p = typeof place === 'string' ? JSON.parse(place) : place;
  _galleryImages = (p.images && p.images.length) ? p.images : (p.image ? [p.image] : []);
  _galleryIdx = 0;
  const mainImg = document.getElementById('modal-img');
  if (mainImg) { mainImg.style.opacity = '1'; mainImg.src = _galleryImages[0] || ''; }
  const counter = document.getElementById('img-counter');
  if (counter) counter.textContent = `1 / ${_galleryImages.length || 1}`;
  const strip = document.getElementById('gallery-strip');
  if (strip) {
    if (_galleryImages.length > 1) {
      strip.innerHTML = _galleryImages.map((src, i) => `
        <div class="gallery-thumb${i === 0 ? ' active' : ''}" onclick="setGalleryImage(${i})">
          <img src="${src}" alt="Photo ${i + 1}" loading="lazy"/>
        </div>`).join('');
      strip.style.display = 'flex';
    } else { strip.innerHTML = ''; strip.style.display = 'none'; }
  }
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = _galleryImages.length <= 1;
  document.getElementById('modal-title').textContent     = p.name;
  document.getElementById('modal-city').textContent      = `${p.city}, ${stateName}`;
  document.getElementById('modal-category').textContent  = p.category;
  document.getElementById('modal-best-time').textContent = p.bestTime;
  document.getElementById('modal-entry').textContent     = p.entryFee || 'Check locally';
  document.getElementById('modal-desc').textContent      = p.desc;
  const nearby = document.getElementById('modal-nearby');
  if (nearby) nearby.innerHTML = (p.nearby || []).map(n => `<span class="nearby-tag">📍 ${n}</span>`).join('');
  const mapSlot = document.getElementById('modal-map-link');
  if (mapSlot) mapSlot.innerHTML = p.mapLink ? `<a href="${p.mapLink}" target="_blank" rel="noopener noreferrer" class="btn-maps">🗺️ View on Google Maps</a>` : '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setGalleryImage(idx) {
  if (!_galleryImages.length) return;
  _galleryIdx = Math.max(0, Math.min(idx, _galleryImages.length - 1));
  const img = document.getElementById('modal-img');
  if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = _galleryImages[_galleryIdx]; img.style.opacity = '1'; }, 150); }
  const counter = document.getElementById('img-counter');
  if (counter) counter.textContent = `${_galleryIdx + 1} / ${_galleryImages.length}`;
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === _galleryIdx));
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (prevBtn) prevBtn.disabled = _galleryIdx === 0;
  if (nextBtn) nextBtn.disabled = _galleryIdx === _galleryImages.length - 1;
}

function galleryNav(dir) { setGalleryImage(_galleryIdx + dir); }

function closeModal() {
  const modal = document.getElementById('place-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function handleModalClick(e) { if (e.target === e.currentTarget) closeModal(); }

document.addEventListener('keydown', e => {
  const modal = document.getElementById('place-modal');
  if (e.key === 'Escape') closeModal();
  if (modal && modal.classList.contains('open')) {
    if (e.key === 'ArrowLeft')  galleryNav(-1);
    if (e.key === 'ArrowRight') galleryNav(1);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  if (document.getElementById('home-page'))  renderHomePage();
  if (document.getElementById('state-page')) renderStatePage();
  setTimeout(initScrollAnimations, 100);
});
