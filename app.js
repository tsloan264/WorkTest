/* ═══════════════════════════════════════════════════════
   DEAN'S PETALS & PRODUCE — App Logic
═══════════════════════════════════════════════════════ */

'use strict';

/* ── State keys ─────────────────────────────────────── */
const KEYS = {
  STATUS:   'dpp_status',
  HOURS:    'dpp_hours',
  NOTE:     'dpp_note',
  ADDRESS:  'dpp_address',
  A_HOURS:  'dpp_about_hours',
  IG_URL:   'dpp_social_instagram',
  FB_URL:   'dpp_social_facebook',
};

/* ── DOM refs ────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════════════
   STATUS MANAGEMENT
═══════════════════════════════════════════════════════ */
function loadStatus() {
  const open    = localStorage.getItem(KEYS.STATUS) !== 'closed';
  const hours   = localStorage.getItem(KEYS.HOURS)   || 'Today · 9am – 5pm';
  const note    = localStorage.getItem(KEYS.NOTE)    || 'Come on by — we\'d love to see you!';
  applyStatus(open, hours, note);
}

function applyStatus(open, hours, note) {
  const card   = $('#status-card');
  const main   = $('#status-main');
  const hoursEl = $('#status-hours-display');
  const noteEl  = $('#status-note-display');
  const symbol  = $('#status-symbol');

  if (open) {
    card.classList.remove('is-closed');
    main.textContent    = "We're Open!";
    symbol.textContent  = '✿';
  } else {
    card.classList.add('is-closed');
    main.textContent    = "We're Closed";
    symbol.textContent  = '✕';
  }
  hoursEl.textContent = hours;
  noteEl.textContent  = note;
}

/* ═══════════════════════════════════════════════════════
   HEADER — scroll shadow
═══════════════════════════════════════════════════════ */
function initHeader() {
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV — highlight current section
═══════════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link[data-section]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ═══════════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════════ */
function initMobileNav() {
  const burger   = $('#hamburger');
  const drawer   = $('#mobile-drawer');
  const backdrop = $('#drawer-backdrop');
  const closeBtn = $('#drawer-close');

  const open = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  $$('.drawer-link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}

/* ═══════════════════════════════════════════════════════
   SMOOTH SCROLL — offset for sticky header
═══════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL — sections fade in on scroll
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  $$('.reveal-section').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════
   CATALOG — load catalog.json and render
═══════════════════════════════════════════════════════ */
async function initCatalog() {
  let data;
  try {
    const res = await fetch('catalog.json');
    data = await res.json();
  } catch {
    data = getFallbackCatalog();
  }

  renderFilters(data.categories, data.items);
  renderItems(data.items, 'All');
}

function renderFilters(categories, items) {
  const row = $('#filter-row');
  row.innerHTML = '';

  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className  = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderItems(items, cat);
    });
    row.appendChild(btn);
  });
}

function renderItems(items, filter) {
  const grid  = $('#catalog-grid');
  const empty = $('#catalog-empty');
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = filtered.map(item => {
    const badgeClass = getBadgeClass(item.badge, item.available);
    const badgeHTML  = (item.badge || !item.available)
      ? `<span class="product-badge ${badgeClass}">${item.badge || 'Sold Out'}</span>`
      : '';

    return `
      <article class="product-card${item.available ? '' : ' unavailable'}" role="listitem">
        <div class="product-emoji-wrap" aria-hidden="true">
          <span>${item.emoji}</span>
          ${badgeHTML}
        </div>
        <div class="product-body">
          <p class="product-category">${item.category}</p>
          <h3 class="product-name">${escapeHTML(item.name)}</h3>
          <p class="product-desc">${escapeHTML(item.description)}</p>
          <div class="product-footer">
            <span class="product-price">${escapeHTML(item.price)}</span>
            <span class="product-availability ${item.available ? 'avail-yes' : 'avail-no'}">
              ${item.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </article>`;
  }).join('');
}

function getBadgeClass(badge, available) {
  if (!available) return 'badge-unavailable';
  const map = {
    'Bestseller': 'badge-bestseller',
    'New':        'badge-new',
    'Seasonal':   'badge-seasonal',
    'Coming Soon':'badge-soon',
  };
  return map[badge] || 'badge-soon';
}

function getFallbackCatalog() {
  return {
    categories: ['All', 'Wreaths', 'Dried Flowers', 'Produce', 'Gifts'],
    items: [
      { id:1, name:'Lavender Dream Wreath', category:'Wreaths', price:'$32',
        description:'Handcrafted from freshly dried lavender, wrapped in rustic twine.',
        emoji:'🌿', available:true, featured:true, badge:'Bestseller' },
      { id:2, name:'Mixed Herb Bouquet', category:'Dried Flowers', price:'$15',
        description:'Dried rosemary, thyme, sage and wildflowers — perfect for kitchen or gift.',
        emoji:'🌾', available:true, featured:false, badge:'' },
      { id:3, name:'Lavender Sachet Set', category:'Gifts', price:'$14',
        description:'Set of 3 hand-sewn linen sachets filled with dried lavender.',
        emoji:'🎀', available:true, featured:false, badge:'' },
    ]
  };
}

/* ═══════════════════════════════════════════════════════
   GALLERY — load gallery.json and render
═══════════════════════════════════════════════════════ */
async function initGallery() {
  let items;
  try {
    const res = await fetch('gallery.json');
    items = (await res.json()).items;
  } catch {
    items = getFallbackGallery();
  }
  renderGallery(items);
}

function renderGallery(items) {
  const grid = $('#gallery-grid');
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <figure class="gallery-item" role="listitem">
      <div class="gallery-photo-frame">
        <div class="photo-placeholder-inner">
          <span class="photo-icon" aria-hidden="true">${item.emoji}</span>
          <p>Photo coming soon</p>
        </div>
      </div>
      <figcaption>${escapeHTML(item.caption)}</figcaption>
    </figure>`).join('');
}

function getFallbackGallery() {
  return [
    { id: 1, caption: 'Fresh wreaths ready for market', emoji: '🌿' },
    { id: 2, caption: 'Custom order in progress', emoji: '💐' },
    { id: 3, caption: 'Market day setup', emoji: '🧺' },
  ];
}

/* ═══════════════════════════════════════════════════════
   SOCIAL LINKS — load saved URLs from localStorage
═══════════════════════════════════════════════════════ */
function loadSocial() {
  applySocialLink('#social-instagram', localStorage.getItem(KEYS.IG_URL));
  applySocialLink('#social-facebook', localStorage.getItem(KEYS.FB_URL));
}

function applySocialLink(selector, url) {
  const el = $(selector);
  if (!el || !url) return;
  el.href = url;
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  const again   = $('#form-again');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = validateForm(form);
    if (!valid) return;

    form.hidden = true;
    success.hidden = false;

    /* Replace this with your actual form submission endpoint */
    /* e.g. fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) }) */
  });

  again.addEventListener('click', () => {
    form.reset();
    $$('.field-group.has-error').forEach(fg => fg.classList.remove('has-error'));
    success.hidden = true;
    form.hidden = false;
  });
}

function validateForm(form) {
  let valid = true;

  const nameField = $('#f-name');
  const nameGroup = nameField.closest('.field-group');
  if (!nameField.value.trim()) {
    nameGroup.classList.add('has-error');
    valid = false;
  } else {
    nameGroup.classList.remove('has-error');
  }

  const emailField = $('#f-email');
  const emailGroup = emailField.closest('.field-group');
  const emailOk    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
  if (!emailOk) {
    emailGroup.classList.add('has-error');
    valid = false;
  } else {
    emailGroup.classList.remove('has-error');
  }

  const msgField = $('#f-message');
  const msgGroup = msgField.closest('.field-group');
  if (!msgField.value.trim()) {
    msgGroup.classList.add('has-error');
    valid = false;
  } else {
    msgGroup.classList.remove('has-error');
  }

  return valid;
}

/* ═══════════════════════════════════════════════════════
   ABOUT — load saved info from localStorage
═══════════════════════════════════════════════════════ */
function loadAboutInfo() {
  const address = localStorage.getItem(KEYS.ADDRESS);
  const hours   = localStorage.getItem(KEYS.A_HOURS);
  if (address) {
    const el = $('#about-address');
    if (el) el.textContent = address;
  }
  if (hours) {
    const el = $('#about-hours');
    if (el) el.innerHTML = hours;
  }
}

/* ═══════════════════════════════════════════════════════
   ADMIN PANEL
   Access: triple-click the ⚙ gear icon in the footer
═══════════════════════════════════════════════════════ */
function initAdmin() {
  const gear    = $('#admin-gear');
  const panel   = $('#admin-panel');
  const overlay = $('#admin-overlay');
  const closeBtn = $('#admin-close');
  let clickCount = 0;
  let clickTimer = null;

  const openPanel = () => {
    panel.hidden   = false;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    const hoursEl     = $('#adm-hours');
    const noteEl      = $('#adm-note');
    const addressEl   = $('#adm-address');
    const aHoursEl    = $('#adm-about-hours');
    const igEl        = $('#adm-instagram');
    const fbEl         = $('#adm-facebook');

    if (hoursEl)   hoursEl.value   = localStorage.getItem(KEYS.HOURS)   || '';
    if (noteEl)    noteEl.value    = localStorage.getItem(KEYS.NOTE)    || '';
    if (addressEl) addressEl.value = localStorage.getItem(KEYS.ADDRESS) || '';
    if (aHoursEl)  aHoursEl.value  = localStorage.getItem(KEYS.A_HOURS) || '';
    if (igEl)      igEl.value      = localStorage.getItem(KEYS.IG_URL)  || '';
    if (fbEl)      fbEl.value      = localStorage.getItem(KEYS.FB_URL)  || '';
  };

  const closePanel = () => {
    panel.hidden   = true;
    overlay.hidden = true;
    document.body.style.overflow = '';
  };

  gear.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 800);
    if (clickCount >= 3) {
      clickCount = 0;
      openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  /* Status save */
  $('#btn-set-open')?.addEventListener('click', () => {
    localStorage.setItem(KEYS.STATUS, 'open');
    applyStatus(true,
      localStorage.getItem(KEYS.HOURS) || 'Today · 9am – 5pm',
      localStorage.getItem(KEYS.NOTE)  || "Come on by — we'd love to see you!"
    );
  });

  $('#btn-set-closed')?.addEventListener('click', () => {
    localStorage.setItem(KEYS.STATUS, 'closed');
    applyStatus(false,
      localStorage.getItem(KEYS.HOURS) || 'Closed today',
      localStorage.getItem(KEYS.NOTE)  || 'See you next time!'
    );
  });

  $('#adm-save-status')?.addEventListener('click', () => {
    const hours = $('#adm-hours')?.value.trim();
    const note  = $('#adm-note')?.value.trim();
    if (hours) localStorage.setItem(KEYS.HOURS, hours);
    if (note)  localStorage.setItem(KEYS.NOTE, note);
    const isOpen = localStorage.getItem(KEYS.STATUS) !== 'closed';
    applyStatus(isOpen,
      hours || localStorage.getItem(KEYS.HOURS) || 'Today · 9am – 5pm',
      note  || localStorage.getItem(KEYS.NOTE)  || "Come on by!"
    );
    showFeedback('#status-saved');
  });

  /* About save */
  $('#adm-save-about')?.addEventListener('click', () => {
    const addr   = $('#adm-address')?.value.trim();
    const aHours = $('#adm-about-hours')?.value.trim();
    if (addr) {
      localStorage.setItem(KEYS.ADDRESS, addr);
      const el = $('#about-address');
      if (el) el.textContent = addr;
    }
    if (aHours) {
      localStorage.setItem(KEYS.A_HOURS, aHours);
      const el = $('#about-hours');
      if (el) el.innerHTML = aHours;
    }
    showFeedback('#about-saved');
  });

  /* Social links save */
  $('#adm-save-social')?.addEventListener('click', () => {
    const ig = $('#adm-instagram')?.value.trim();
    const fb = $('#adm-facebook')?.value.trim();
    if (ig) {
      localStorage.setItem(KEYS.IG_URL, ig);
      applySocialLink('#social-instagram', ig);
    }
    if (fb) {
      localStorage.setItem(KEYS.FB_URL, fb);
      applySocialLink('#social-facebook', fb);
    }
    showFeedback('#social-saved');
  });
}

function showFeedback(selector) {
  const el = $(selector);
  if (!el) return;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 2500);
}

/* ═══════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ═══════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadStatus();
  loadAboutInfo();
  loadSocial();
  initHeader();
  initActiveNav();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initCatalog();
  initGallery();
  initContactForm();
  initAdmin();
});
