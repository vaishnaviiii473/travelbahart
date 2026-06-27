// =============================================
// TRAVELBHARAT — REVIEWS & SOCIAL FEATURES
// reviews.js  (include AFTER app.js on state.html)
// =============================================

const REVIEWS_API = API_BASE + '/reviews';

// ── WISHLIST (localStorage) ───────────────────────────────────
const Wishlist = {
  KEY: 'tb_wishlist',

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  has(placeId) {
    return this.get().some(p => p.id === placeId);
  },

  toggle(place, stateName) {
    let list = this.get();
    if (this.has(place.id)) {
      list = list.filter(p => p.id !== place.id);
    } else {
      list.push({
        id:        place.id,
        name:      place.name,
        city:      place.city,
        stateName,
        category:  place.category,
        image:     place.image,
        stateId:   window.__currentState?.id || '',
      });
    }
    this.save(list);
    return this.has(place.id);
  },

  count() { return this.get().length; },
};

// ── SOCIAL SHARE ─────────────────────────────────────────────
function buildShareUrl(place, stateName) {
  const base  = window.location.origin + window.location.pathname;
  const state = window.__currentState?.id || '';
  return `${base}?state=${state}&place=${place.id}`;
}

function sharePlace(place, stateName, platform) {
  const url   = encodeURIComponent(buildShareUrl(place, stateName));
  const text  = encodeURIComponent(`✈️ Discover ${place.name} in ${stateName} — ${place.desc?.slice(0, 80)}… | TravelBharat`);
  const links = {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=TravelBharat,IncredibleIndia,${place.name.replace(/\s+/g,'')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    copy:     null,
  };

  if (platform === 'copy') {
    navigator.clipboard.writeText(decodeURIComponent(url))
      .then(() => showReviewToast('🔗 Link copied to clipboard!'))
      .catch(() => {
        const tmp = document.createElement('textarea');
        tmp.value = decodeURIComponent(url);
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
        showReviewToast('🔗 Link copied!');
      });
    return;
  }

  window.open(links[platform], '_blank', 'width=600,height=450');
}

// ── REVIEWS — FETCH & RENDER ──────────────────────────────────
async function loadReviews(stateId, placeId) {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  container.innerHTML = '<div class="review-loading">Loading reviews…</div>';

  try {
    const res  = await fetch(`${REVIEWS_API}?stateId=${stateId}&placeId=${placeId}`);
    const data = await res.json();

    if (!data.success || !data.data.length) {
      container.innerHTML = '<p class="review-empty">No reviews yet — be the first to share your experience!</p>';
      updateRatingSummary(null, 0);
      return;
    }

    updateRatingSummary(data.averageRating, data.count);
    container.innerHTML = data.data.map(r => renderReviewCard(r)).join('');
  } catch {
    container.innerHTML = '<p class="review-empty">Could not load reviews.</p>';
  }
}

function renderReviewCard(r) {
  const stars   = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
  const date    = new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const initial = r.name.charAt(0).toUpperCase();
  return `
    <div class="review-card" id="review-${r._id}">
      <div class="review-top">
        <div class="reviewer-avatar">${initial}</div>
        <div class="reviewer-info">
          <div class="reviewer-name">${escapeHtml(r.name)}</div>
          <div class="reviewer-date">${date}</div>
        </div>
        <div class="review-stars" title="${r.rating}/5">${stars}</div>
      </div>
      <p class="review-comment">${escapeHtml(r.comment)}</p>
      <div class="review-actions">
        <button class="helpful-btn" onclick="markHelpful('${r._id}', this)">
          👍 Helpful ${r.helpful > 0 ? `(${r.helpful})` : ''}
        </button>
      </div>
    </div>`;
}

function updateRatingSummary(avg, count) {
  const el = document.getElementById('rating-summary');
  if (!el) return;
  if (!avg) {
    el.innerHTML = '<span class="no-rating">Not rated yet</span>';
    return;
  }
  const stars = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
  el.innerHTML = `
    <span class="avg-score">${avg}</span>
    <span class="avg-stars">${stars}</span>
    <span class="avg-count">(${count} review${count !== 1 ? 's' : ''})</span>
  `;
}

// ── REVIEWS — SUBMIT ──────────────────────────────────────────
async function submitReview(e) {
  e.preventDefault();
  const btn     = document.getElementById('review-submit-btn');
  const place   = window.__modalPlace;
  const state   = window.__currentState;
  if (!place || !state) return;

  const name    = document.getElementById('review-name').value.trim();
  const rating  = document.querySelector('input[name="review-rating"]:checked')?.value;
  const comment = document.getElementById('review-comment').value.trim();

  if (!name || !rating || !comment) {
    showReviewToast('Please fill all fields and select a rating.', true);
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Submitting…';

  try {
    const res  = await fetch(REVIEWS_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId:   place.id,
        stateId:   state.id,
        placeName: place.name,
        stateName: state.name,
        name, rating: Number(rating), comment,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    showReviewToast('✅ Review submitted — thank you!');
    document.getElementById('review-form').reset();
    document.querySelectorAll('.star-label').forEach(l => l.classList.remove('selected'));
    await loadReviews(state.id, place.id);
  } catch (err) {
    showReviewToast(err.message || 'Could not submit review.', true);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Submit Review';
  }
}

async function markHelpful(reviewId, btn) {
  btn.disabled = true;
  try {
    const res  = await fetch(`${REVIEWS_API}/${reviewId}/helpful`, { method: 'PATCH' });
    const data = await res.json();
    if (data.success) {
      btn.textContent = `👍 Helpful (${data.helpful})`;
      // Persist voted IDs so user can't spam
      const voted = JSON.parse(localStorage.getItem('tb_voted') || '[]');
      voted.push(reviewId);
      localStorage.setItem('tb_voted', JSON.stringify(voted));
    }
  } catch {
    btn.disabled = false;
  }
}

// Disable helpful button if already voted
function applyVotedState() {
  const voted = JSON.parse(localStorage.getItem('tb_voted') || '[]');
  voted.forEach(id => {
    const btn = document.querySelector(`#review-${id} .helpful-btn`);
    if (btn) btn.disabled = true;
  });
}

// ── STAR RATING WIDGET ────────────────────────────────────────
function initStarRating() {
  document.querySelectorAll('.star-label').forEach(label => {
    label.addEventListener('click', () => {
      const val = label.dataset.value;
      document.querySelectorAll('.star-label').forEach(l => {
        l.classList.toggle('selected', Number(l.dataset.value) <= Number(val));
      });
    });
  });
}

// ── WISHLIST UI ───────────────────────────────────────────────
function updateWishlistBtn(place, stateName) {
  const btn = document.getElementById('wishlist-btn');
  if (!btn) return;
  const saved = Wishlist.has(place.id);
  btn.innerHTML  = saved ? '❤️ Saved' : '🤍 Save';
  btn.className  = saved ? 'wishlist-btn saved' : 'wishlist-btn';
  btn.onclick    = () => {
    const now = Wishlist.toggle(place, stateName);
    btn.innerHTML = now ? '❤️ Saved' : '🤍 Save';
    btn.className = now ? 'wishlist-btn saved' : 'wishlist-btn';
    showReviewToast(now ? '❤️ Added to wishlist!' : 'Removed from wishlist');
    updateWishlistBadge();
  };
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (!badge) return;
  const count = Wishlist.count();
  badge.textContent = count;
  badge.style.display = count ? 'flex' : 'none';
}

// ── WISHLIST PANEL ────────────────────────────────────────────
function renderWishlistPanel() {
  const panel = document.getElementById('wishlist-panel');
  if (!panel) return;
  const list = Wishlist.get();
  if (!list.length) {
    panel.innerHTML = '<p class="wishlist-empty">Your wishlist is empty.<br/>Save places using the 🤍 button.</p>';
    return;
  }
  panel.innerHTML = list.map(p => `
    <div class="wishlist-item">
      <img src="${p.image}" alt="${p.name}" onerror="this.style.background='#EDE0D0'"/>
      <div class="wishlist-item-info">
        <div class="wishlist-item-name">${p.name}</div>
        <div class="wishlist-item-state">📍 ${p.city}, ${p.stateName}</div>
        <a href="state.html?state=${p.stateId}&place=${p.id}" class="wishlist-item-link">View →</a>
      </div>
      <button class="wishlist-remove" onclick="removeFromWishlist('${p.id}')">✕</button>
    </div>`).join('');
}

function removeFromWishlist(id) {
  let list = Wishlist.get().filter(p => p.id !== id);
  Wishlist.save(list);
  renderWishlistPanel();
  updateWishlistBadge();
}

function toggleWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  if (isOpen) renderWishlistPanel();
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// ── TOAST ─────────────────────────────────────────────────────
let _toastTimer;
function showReviewToast(msg, isError = false) {
  clearTimeout(_toastTimer);
  let toast = document.getElementById('review-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'review-toast';
    document.body.appendChild(toast);
  }
  toast.textContent  = msg;
  toast.className    = isError ? 'review-toast error show' : 'review-toast show';
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── UTILS ─────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── HOOK INTO openModal ───────────────────────────────────────
// Extends the existing openModal from app.js
const _originalOpenModal = window.openModal;

window.openModal = function(place, stateName) {
  // Call original first
  if (_originalOpenModal) _originalOpenModal(place, stateName);

  const p = typeof place === 'string' ? JSON.parse(place) : place;
  window.__modalPlace = p;

  // Inject social + review section into modal body if not already there
  const modalBody = document.querySelector('#place-modal .modal-body');
  if (modalBody && !modalBody.querySelector('.social-review-section')) {
    modalBody.insertAdjacentHTML('beforeend', buildSocialReviewHTML());
    document.getElementById('review-form')?.addEventListener('submit', submitReview);
    initStarRating();
  }

  // Update wishlist button
  updateWishlistBtn(p, stateName);

  // Update share buttons
  document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
    btn.onclick = () => sharePlace(p, stateName, btn.dataset.platform);
  });

  // Load reviews
  const state = window.__currentState;
  if (state) loadReviews(state.id, p.id);

  setTimeout(applyVotedState, 500);
};

function buildSocialReviewHTML() {
  return `
  <div class="social-review-section">

    <!-- SOCIAL SHARE -->
    <div class="share-section">
      <div class="modal-section-title">Share This Place</div>
      <div class="share-buttons">
        <button class="share-btn whatsapp" data-platform="whatsapp" title="Share on WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </button>
        <button class="share-btn twitter" data-platform="twitter" title="Share on Twitter">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter
        </button>
        <button class="share-btn facebook" data-platform="facebook" title="Share on Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
        <button class="share-btn copy" data-platform="copy" title="Copy link">
          🔗 Copy Link
        </button>
      </div>
    </div>

    <!-- DIVIDER -->
    <div class="section-divider"></div>

    <!-- RATING SUMMARY -->
    <div class="rating-summary-row">
      <div class="modal-section-title" style="margin-bottom:0">Traveller Reviews</div>
      <div id="rating-summary" class="rating-summary"></div>
    </div>

    <!-- REVIEWS LIST -->
    <div id="reviews-container" class="reviews-container"></div>

    <!-- DIVIDER -->
    <div class="section-divider"></div>

    <!-- REVIEW FORM -->
    <div class="review-form-section">
      <div class="modal-section-title">Write a Review</div>
      <form id="review-form" onsubmit="submitReview(event)" novalidate>

        <div class="form-row">
          <div class="form-field-rev">
            <label>Your Name</label>
            <input type="text" id="review-name" placeholder="e.g. Priya Sharma" maxlength="60" required/>
          </div>
        </div>

        <div class="form-field-rev">
          <label>Rating</label>
          <div class="star-rating-widget">
            ${[1,2,3,4,5].map(n => `
              <input type="radio" name="review-rating" id="star-${n}" value="${n}" class="star-radio"/>
              <label for="star-${n}" class="star-label" data-value="${n}" title="${n} star${n>1?'s':''}">★</label>
            `).join('')}
          </div>
        </div>

        <div class="form-field-rev">
          <label>Your Experience</label>
          <textarea id="review-comment" placeholder="Tell others about your visit — what did you love? Any tips?" maxlength="500" rows="3" required></textarea>
          <div class="char-count"><span id="char-count">0</span>/500</div>
        </div>

        <button type="submit" id="review-submit-btn" class="btn-submit-review">Submit Review</button>
      </form>
    </div>

  </div>`;
}

// ── CHAR COUNTER ─────────────────────────────────────────────
document.addEventListener('input', function(e) {
  if (e.target.id === 'review-comment') {
    const el = document.getElementById('char-count');
    if (el) el.textContent = e.target.value.length;
  }
});

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateWishlistBadge();
});