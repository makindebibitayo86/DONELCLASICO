/* ==========================================================
   DON ELCLASICO — Atelier for Men | script.js
   Supabase (records + image storage) + Formspree (email alerts)
   ========================================================== */

'use strict';

// ── SUPABASE INIT ─────────────────────────────────────────
const SUPABASE_URL  = 'https://pavyadalbmcpedgspqqp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhdnlhZGFsYm1jcGVkZ3NwcXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODMzNjQsImV4cCI6MjA5Mjk1OTM2NH0.pJydDWJUjjf2fSIlQPB6bonlvqhoGEEqPKxloQhHNiA';
const STORAGE_BUCKET   = 'fabric-images';
const DB_TABLE = 'don_elclasico_measurements';
const CATALOGUE_BUCKET = 'catalogue-images';
const CATALOGUE_TABLE  = 'don_elclasico_catalogue';

// ── FORMSPREE ─────────────────────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzlnjea';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── CATALOGUE DATA (Supabase-powered) ────────────────────
// Products are now loaded from Supabase at runtime.
// The owner uploads images to the 'catalogue-images' bucket,
// copies the public URL, and populates rows in the 'catalogue' table.
let PRODUCTS = [];

// ── STATE ─────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('de_cart') || '[]');
let currentProduct = null;

// ── LOADER ────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initReveal();
  }, 2400);
});

// ── CUSTOM CURSOR ─────────────────────────────────────────
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (dot && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const hoverTargets = 'a,button,.product-card,.contact-card,.filter-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
  (function animateCursor() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();
}

// ── NAVBAR ────────────────────────────────────────────────
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ── THEME TOGGLE ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('de_theme');
if (savedTheme === 'light') document.body.classList.add('light');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('de_theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// ── SCROLL REVEAL ─────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── CATALOGUE ─────────────────────────────────────────────
function formatPrice(n) { return '₦' + n.toLocaleString('en-NG'); }

const CATEGORY_LABELS = { suit: 'Suits', agbada: 'Agbada', casual: 'Smart Casual', native: 'Native Wear', accessories: 'Accessories' };

let activeFilter = 'all';

function renderProducts(filter = 'all') {
  activeFilter = filter;
  const grid     = document.getElementById('catalogueGrid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:3rem;grid-column:1/-1;">No items in this category yet.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card" data-id="${p.id}" style="animation-delay:${i * 0.07}s">
      <div class="card-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
        <div class="card-overlay"></div>
        <div class="card-overlay-actions">
          <button class="card-btn-view" onclick="openProduct(${p.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View
          </button>
          <button class="card-btn-add" onclick="addToCartById(${p.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
            Select
          </button>
        </div>
      </div>
      <div class="card-info">
        <p class="card-category">${CATEGORY_LABELS[p.category] || p.category}</p>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-price">${formatPrice(p.price)}</p>
      </div>
    </div>
  `).join('');
}

function showCatalogueLoading() {
  const grid = document.getElementById('catalogueGrid');
  grid.innerHTML = `
    <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:1rem;color:var(--text-muted);">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="animation:spin 1s linear infinite;">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span>Loading collection…</span>
    </div>
  `;
}

function showCatalogueError() {
  const grid = document.getElementById('catalogueGrid');
  grid.innerHTML = `
    <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:0.75rem;color:var(--text-muted);">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Could not load catalogue. Please refresh the page.</span>
    </div>
  `;
}

/**
 * Fetch all active products from Supabase and populate PRODUCTS.
 * Rows in the 'catalogue' table are mapped to the same shape
 * the rest of the app expects (id, name, category, price, badge,
 * image, description, features[]).
 */
async function loadCatalogue() {
  showCatalogueLoading();

  try {
    const { data, error } = await db
      .from(CATALOGUE_TABLE)
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map Supabase rows → internal product shape
    PRODUCTS = (data || []).map(row => ({
      id:          row.id,
      name:        row.name,
      category:    row.category,
      price:       row.price,
      badge:       row.badge   || null,
      image:       row.image_url,
      description: row.description || '',
      features:    Array.isArray(row.features) ? row.features : (row.features ? row.features.split('\n').filter(Boolean) : [])
    }));

    renderProducts(activeFilter);
  } catch (err) {
    console.error('Catalogue load error:', err.message);
    showCatalogueError();
  }
}

// Kick off catalogue load once DOM is ready
loadCatalogue();

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// ── PRODUCT MODAL ─────────────────────────────────────────
const productModal = document.getElementById('productModal');
const modalClose   = document.getElementById('modalClose');

window.openProduct = function(id) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  if (!currentProduct) return;
  document.getElementById('modalImg').src        = currentProduct.image;
  document.getElementById('modalImg').alt        = currentProduct.name;
  document.getElementById('modalCategory').textContent = (CATEGORY_LABELS[currentProduct.category] || currentProduct.category).toUpperCase();
  document.getElementById('modalName').textContent     = currentProduct.name;
  document.getElementById('modalPrice').textContent    = formatPrice(currentProduct.price);
  document.getElementById('modalDesc').textContent     = currentProduct.description;
  document.getElementById('modalFeatures').innerHTML   = currentProduct.features.map(f => `<div class="modal-feat">${f}</div>`).join('');
  document.getElementById('modalInstructions').value   = '';
  document.getElementById('fabricPreview').innerHTML   = '';
  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

modalClose.addEventListener('click', closeProductModal);
productModal.addEventListener('click', e => { if (e.target === productModal) closeProductModal(); });

function closeProductModal() {
  productModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('fabricUpload').addEventListener('change', function() {
  const prev = document.getElementById('fabricPreview');
  prev.innerHTML = '';
  [...this.files].slice(0, 4).forEach(f => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    prev.appendChild(img);
  });
});

document.getElementById('modalAddCart').addEventListener('click', () => {
  if (!currentProduct) return;
  addToCartById(currentProduct.id);
  closeProductModal();
});

// ── CART ──────────────────────────────────────────────────
function saveCart() { localStorage.setItem('de_cart', JSON.stringify(cart)); }

window.addToCartById = function(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { cart.push({ ...product, qty: 1 }); }
  saveCart(); updateCartUI();
  showToast(`${product.name} added to commission`);
};

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartUI(); renderCartItems();
}
window.removeFromCart = removeFromCart;

function cartTotal() { return cart.reduce((t, i) => t + i.price * (i.qty || 1), 0); }

function updateCartUI() {
  const count = cart.reduce((t, i) => t + (i.qty || 1), 0);
  document.getElementById('cartCount').textContent = count;
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const empty     = document.getElementById('cartEmpty');
  const footer    = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');

  if (cart.length === 0) {
    empty.style.display = 'flex';
    container.querySelectorAll('.cart-item').forEach(el => el.remove());
    footer.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  footer.style.display = 'block';
  totalEl.textContent  = formatPrice(cartTotal());
  container.querySelectorAll('.cart-item').forEach(el => el.remove());

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price)} × ${item.qty || 1}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    container.appendChild(el);
  });
}

updateCartUI();

const cartBtn     = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer  = document.getElementById('cartDrawer');
const cartClose   = document.getElementById('cartClose');

function openCart()  { cartOverlay.classList.add('open'); cartDrawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); document.body.style.overflow = ''; }

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ── CHECKOUT ──────────────────────────────────────────────
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutBtn   = document.getElementById('checkoutBtn');

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  closeCart();
  renderCheckoutSummary();
  checkoutModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function renderCheckoutSummary() {
  document.getElementById('coItems').innerHTML = cart.map(item => `
    <div class="co-item">
      <span class="co-item-name">${item.name} × ${item.qty || 1}</span>
      <span class="co-item-price">${formatPrice(item.price * (item.qty || 1))}</span>
    </div>
  `).join('');
  document.getElementById('coTotal').textContent = formatPrice(cartTotal());
}

checkoutClose.addEventListener('click', () => { checkoutModal.classList.remove('open'); document.body.style.overflow = ''; });
checkoutModal.addEventListener('click', e => {
  if (e.target === checkoutModal) { checkoutModal.classList.remove('open'); document.body.style.overflow = ''; }
});

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name  = document.getElementById('coName').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  if (!name || !email || !phone) { showToast('Please fill all required fields'); return; }
  if (!isValidEmail(email)) { showToast('Please enter a valid email address'); return; }
  simulatePayment();
});

function simulatePayment() {
  const btn  = document.querySelector('.pay-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Processing...</span>';
  btn.disabled  = true;
  setTimeout(() => {
    checkoutModal.classList.remove('open');
    document.getElementById('successModal').classList.add('open');
    cart = []; saveCart(); updateCartUI();
    btn.innerHTML = orig; btn.disabled = false;
    document.getElementById('checkoutForm').reset();
  }, 2000);
}

document.getElementById('successClose').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
});

// ═══════════════════════════════════════════════════════════
//   MEASUREMENT FORM — SUPABASE INTEGRATION
// ═══════════════════════════════════════════════════════════

const measurementForm = document.getElementById('measurementForm');

// Preview images on file select
document.getElementById('inspirationUpload').addEventListener('change', function() {
  const prev = document.getElementById('uploadPreview');
  prev.innerHTML = '';
  [...this.files].slice(0, 6).forEach(f => {
    const img = document.createElement('img');
    img.className = 'preview-thumb';
    img.src = URL.createObjectURL(f);
    prev.appendChild(img);
  });
});

// Drag & drop support
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--accent)'; });
uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.style.borderColor = '';
  const files = e.dataTransfer.files;
  const input = document.getElementById('inspirationUpload');
  const dt = new DataTransfer();
  [...files].forEach(f => dt.items.add(f));
  input.files = dt.files;
  input.dispatchEvent(new Event('change'));
});

/**
 * Upload a single file to Supabase Storage.
 * Returns the public URL string, or null on failure.
 */
async function uploadImageToSupabase(file) {
  const ext      = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `uploads/${filename}`;

  const { error } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Storage upload error:', error.message);
    return null;
  }

  const { data } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
}

/**
 * Upload all selected images and return array of public URLs.
 * Updates the progress bar as files are uploaded.
 */
async function uploadAllImages(files) {
  if (!files || files.length === 0) return [];

  const progressWrap  = document.getElementById('uploadProgress');
  const progressFill  = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');

  progressWrap.style.display = 'flex';
  progressFill.style.width   = '0%';

  const urls = [];
  for (let i = 0; i < files.length; i++) {
    progressLabel.textContent = `Uploading image ${i + 1} of ${files.length}…`;
    const url = await uploadImageToSupabase(files[i]);
    if (url) urls.push(url);
    progressFill.style.width = `${Math.round(((i + 1) / files.length) * 100)}%`;
  }

  progressLabel.textContent = 'Upload complete.';
  return urls;
}

/**
 * Insert measurement record into Supabase database.
 */
async function saveMeasurementsToSupabase(payload) {
  const { data, error } = await db.from(DB_TABLE).insert([payload]);
  if (error) throw new Error(error.message);
  return data;
}

// ── FORM SUBMIT (Supabase + Formspree) ───────────────────
measurementForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Clear previous errors
  clearErrors();

  const fullName = document.getElementById('fullName').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const email    = document.getElementById('email').value.trim();

  let valid = true;

  if (!fullName) {
    setError('nameError', 'fullName', 'Full name is required.');
    valid = false;
  }
  if (!phone || !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
    setError('phoneError', 'phone', 'Enter a valid phone number.');
    valid = false;
  }
  if (email && !isValidEmail(email)) {
    setError('emailError', 'email', 'Enter a valid email address.');
    valid = false;
  }

  if (!valid) return;

  // Set loading state
  setSubmitLoading(true);

  try {
    // Step 1 — upload images to Supabase Storage
    const fileInput  = document.getElementById('inspirationUpload');
    const files      = fileInput.files ? [...fileInput.files] : [];
    const image_urls = await uploadAllImages(files);

    // Hide progress bar after upload
    document.getElementById('uploadProgress').style.display = 'none';

    // Step 2 — build Supabase payload (full record including image URLs)
    const supabasePayload = {
      full_name:          fullName,
      phone_number:       phone,
      email:              email || null,
      chest:              parseOptionalNum('chest'),
      waist:              parseOptionalNum('waist'),
      seat:               parseOptionalNum('hips'),
      height:             parseOptionalNum('height'),
      inseam_length:      parseOptionalNum('inseam'),
      shoulder_width:     parseOptionalNum('shoulder'),
      sleeve_length:      parseOptionalNum('sleeve'),
      neck_circumference: parseOptionalNum('neck'),
      thigh:              parseOptionalNum('thigh'),
      additional_details: document.getElementById('instructions').value.trim() || null,
      image_urls:         image_urls.length > 0 ? image_urls : null
    };

    // Step 3 — build Formspree payload (text fields + image URLs as plain links)
    const formspreePayload = {
      'Full Name':            fullName,
      'Phone':                phone,
      'Email':                email || '(not provided)',
      'Chest (inches)':       document.getElementById('chest').value     || '—',
      'Waist (inches)':       document.getElementById('waist').value     || '—',
      'Seat (inches)':        document.getElementById('hips').value      || '—',
      'Height (inches)':      document.getElementById('height').value    || '—',
      'Inseam Length':        document.getElementById('inseam').value    || '—',
      'Shoulder Width':       document.getElementById('shoulder').value  || '—',
      'Sleeve Length':        document.getElementById('sleeve').value    || '—',
      'Neck Circumference':   document.getElementById('neck').value      || '—',
      'Thigh':                document.getElementById('thigh').value     || '—',
      'Special Instructions': document.getElementById('instructions').value.trim() || '(none)',
      'Inspiration Images':   image_urls.length > 0
                                ? image_urls.join('\n')
                                : '(none uploaded)',
    };

    // Step 4 — fire Supabase and Formspree in parallel
    const [supabaseResult, formspreeResult] = await Promise.allSettled([
      saveMeasurementsToSupabase(supabasePayload),
      fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(formspreePayload),
      }),
    ]);

    // Step 5 — result handling
    // Supabase is the source of truth — if it fails, surface the error
    if (supabaseResult.status === 'rejected') {
      throw new Error('Database save failed: ' + supabaseResult.reason);
    }

    // Formspree is a notification layer — log silently if it fails, don't block the user
    if (formspreeResult.status === 'rejected' || !formspreeResult.value?.ok) {
      console.warn('Formspree notification failed — record still saved to Supabase.');
    }

    // Step 6 — success feedback
    setSubmitLoading(false);
    showFormSuccess();
    measurementForm.reset();
    document.getElementById('uploadPreview').innerHTML = '';

  } catch (err) {
    console.error('Submission error:', err);
    setSubmitLoading(false);
    showToast('Submission failed. Please try again.');
  }
});

// ── FORM HELPERS ──────────────────────────────────────────
function parseOptionalNum(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) ? null : val;
}

function setError(errorId, inputId, message) {
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.closest('.form-group')?.classList.add('has-error');
}

function clearErrors() {
  ['nameError', 'phoneError', 'emailError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
}

function setSubmitLoading(loading) {
  const btn     = document.getElementById('submitBtn');
  const label   = document.getElementById('submitLabel');
  const arrow   = document.getElementById('submitArrow');
  const spinner = document.getElementById('submitSpinner');

  btn.disabled      = loading;
  label.textContent = loading ? 'Submitting…' : 'Submit My Measurements';
  arrow.style.display   = loading ? 'none' : 'block';
  spinner.style.display = loading ? 'block' : 'none';
}

function showFormSuccess() {
  const successEl = document.getElementById('formSuccess');
  if (!successEl) return;
  successEl.style.display = 'flex';
  setTimeout(() => { successEl.style.display = 'none'; }, 6000);
}

// ── TOAST ─────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── UTILITY ───────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
