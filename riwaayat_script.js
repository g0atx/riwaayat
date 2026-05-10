/* ============================================================
   RIWAAYAT — script.js
   ============================================================ */

'use strict';

// ── WHATSAPP NUMBER ────────────────────────────────────────
const WA_NUMBER = '919478933000'; // Replace with real number

// ── CART STATE ─────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('riwaayat_cart') || '[]');

// ── PRODUCTS DATA ──────────────────────────────────────────
const products = [
  { id: 1, name: 'Crochet Rose Bouquet',   price: 599, emoji: '🌹🌹🌷', category: 'bouquet' },
  { id: 2, name: 'Lavender Tulip Set',      price: 449, emoji: '🌷💜🌷', category: 'crochet' },
  { id: 3, name: 'Woven Heart Keychain',    price: 199, emoji: '🔑💗🧶', category: 'keychain' },
  { id: 4, name: 'Handmade Daisy Flower',   price: 279, emoji: '🌼🌼🌼', category: 'crochet' },
  { id: 5, name: 'Embroidered Mini Hoop',   price: 349, emoji: '🪡✨🌸', category: 'embroidery' },
  { id: 6, name: 'Mixed Blossom Bouquet',   price: 749, emoji: '💐🌸🌹', category: 'bouquet' },
];

// ── LOADER ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('#hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 1400);
});

// ── SCROLL PROGRESS ────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}, { passive: true });

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER MENU ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
});
// Close on nav link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// ── THEME TOGGLE ───────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle?.querySelector('.theme-icon');
let isDark = localStorage.getItem('riwaayat_theme') === 'dark';

function applyTheme() {
  document.body.classList.toggle('dark-mode', isDark);
  if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☽';
}
applyTheme();
themeToggle?.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('riwaayat_theme', isDark ? 'dark' : 'light');
  applyTheme();
});

// ── SEARCH ─────────────────────────────────────────────────
const searchBtn     = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchClose   = document.getElementById('search-close');
const searchResults = document.getElementById('search-results');

searchBtn?.addEventListener('click', () => {
  searchOverlay?.classList.add('open');
  setTimeout(() => searchInput?.focus(), 100);
});
searchClose?.addEventListener('click', closeSearch);
searchOverlay?.addEventListener('click', e => {
  if (e.target === searchOverlay) closeSearch();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearch();
    closeLightbox();
  }
});

function closeSearch() {
  searchOverlay?.classList.remove('open');
  if (searchInput) { searchInput.value = ''; }
  if (searchResults) searchResults.innerHTML = '';
}

searchInput?.addEventListener('input', e => {
  const query = e.target.value.trim().toLowerCase();
  if (!searchResults) return;
  if (!query) { searchResults.innerHTML = ''; return; }
  const matches = products.filter(p =>
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );
  if (matches.length === 0) {
    searchResults.innerHTML = `<p style="color:var(--text-light);text-align:center;font-family:var(--font-accent);">No products found for "${query}"</p>`;
    return;
  }
  searchResults.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="handleSearchResultClick(${p.id})">
      <div class="search-result-emoji">${p.emoji.split('').slice(0,1).join('')}</div>
      <div class="search-result-info">
        <div class="search-result-name">${p.name}</div>
        <div class="search-result-price">₹${p.price}</div>
      </div>
    </div>
  `).join('');
});

window.handleSearchResultClick = (id) => {
  closeSearch();
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.outline = '2px solid var(--rose)';
    setTimeout(() => { el.style.outline = ''; }, 2000);
  }
};

// ── CART ───────────────────────────────────────────────────
const cartBtn     = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose   = document.getElementById('cart-close');
const cartItems   = document.getElementById('cart-items');
const cartFooter  = document.getElementById('cart-footer');
const cartCount   = document.getElementById('cart-count');
const cartTotal   = document.getElementById('cart-total-price');

function openCart()  {
  cartSidebar?.classList.add('open');
  cartOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

function saveCart() {
  localStorage.setItem('riwaayat_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // count badge
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.classList.toggle('visible', count > 0);
  }

  // total
  if (cartTotal) cartTotal.textContent = `₹${total}`;

  // footer
  if (cartFooter) cartFooter.style.display = cart.length ? 'block' : 'none';

  // items
  if (!cartItems) return;
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🌷</div>
        <p>Your basket is empty</p>
        <span>Add something beautiful!</span>
      </div>`;
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} each</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function getProductEmoji(id) {
  const p = products.find(p => p.id === id);
  return p ? p.emoji.split('').slice(0, 1).join('') : '🌸';
}

window.addToCart = (id, name, price) => {
  const existing = cart.find(i => i.id === id);
  const emoji = getProductEmoji(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1, emoji });
  }
  saveCart();
  updateCartUI();
  showToast(`🌸 "${name}" added to basket!`);
  openCart();
};

window.changeQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
};

window.changeQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
};

// ── BUY NOW ────────────────────────────────────────────────
window.buyNow = (id, name, price) => {
  const text = `Hi Riwaayat! 🌸%0AI'd like to order:%0A%0A• ${encodeURIComponent(name)} — ₹${price} (x1)%0A%0ATotal: ₹${price}%0A%0APlease let me know the payment and delivery details. Thank you! 💗`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
};

// ── CHECKOUT ───────────────────────────────────────────────
document.getElementById('checkout-btn')?.addEventListener('click', () => {
  if (cart.length === 0) return;
  const itemList = cart.map(i => `• ${i.name} — ₹${i.price} x${i.qty}`).join('%0A');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const text = `Hi Riwaayat! 🌸%0AI'd like to place an order:%0A%0A${itemList}%0A%0ATotal: ₹${total}%0A%0APlease share payment and delivery details. Thank you! 💗`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
});

// ── PRODUCT FILTERS ────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      }
    });
  });
});

// ── WISHLIST TOGGLE ────────────────────────────────────────
document.querySelectorAll('.product-wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// ── INSTAGRAM GALLERY LIGHTBOX ─────────────────────────────
const galleryEmojis = ['🌹', '🌷', '🧶', '🌼', '💮', '🌸'];
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
let currentGalleryIdx = 0;

window.openGallery = (idx) => {
  currentGalleryIdx = idx;
  updateLightboxContent();
  lightbox?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function updateLightboxContent() {
  if (lightboxContent) lightboxContent.textContent = galleryEmojis[currentGalleryIdx] || '🌸';
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev')?.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx - 1 + galleryEmojis.length) % galleryEmojis.length;
  updateLightboxContent();
});
document.getElementById('lightbox-next')?.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx + 1) % galleryEmojis.length;
  updateLightboxContent();
});
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// ── TOAST ──────────────────────────────────────────────────
function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── INTERSECTION OBSERVER (ANIMATIONS) ─────────────────────
const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        setTimeout(() => entry.target.classList.add('visible'),
          parseFloat(delay) * 1000);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
animatedEls.forEach(el => observer.observe(el));

// ── SMOOTH ACTIVE NAV ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── INIT ───────────────────────────────────────────────────
updateCartUI();
