// ── CART STATE ──
let cart = [];

// ── DRAWER MENU ──
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', () => {
  closeDrawer();
  closeCart();
});

drawer.querySelectorAll('.drawer-nav a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeDrawer(); closeCart(); }
});

// ── CART ──
const cartPanel      = document.getElementById('cartPanel');
const cartOverlay    = document.getElementById('cartOverlay');
const cartClose      = document.getElementById('cartClose');
const cartItemsEl    = document.getElementById('cartItems');
const cartEmptyEl    = document.getElementById('cartEmpty');
const cartFooterEl   = document.getElementById('cartFooter');
const cartCountEls   = document.querySelectorAll('.cart-count');
const cartBadgeEls   = document.querySelectorAll('.cart-badge');

function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.querySelectorAll('.cart-btn-open').forEach(btn => {
  btn.addEventListener('click', openCart);
});

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEls.forEach(el => el.textContent = total);
  cartBadgeEls.forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyEl.style.display = 'flex';
    cartFooterEl.style.display = 'none';
    return;
  }

  cartEmptyEl.style.display = 'none';
  cartFooterEl.style.display = 'flex';

  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Talla: ${item.size} · Color: ${item.color}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" data-idx="${idx}" data-delta="-1">−</button>
        <span class="cart-qty-num">${item.qty}</span>
        <button class="cart-qty-btn" data-idx="${idx}" data-delta="1">+</button>
        <button class="cart-remove" data-idx="${idx}" aria-label="Eliminar">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  // Total
  cartItemsEl.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx   = +btn.dataset.idx;
      const delta = +btn.dataset.delta;
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      updateCartCount();
      renderCart();
    });
  });

  cartItemsEl.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(+btn.dataset.idx, 1);
      updateCartCount();
      renderCart();
    });
  });
}

// Botón enviar por WhatsApp
document.getElementById('cartWhatsapp').addEventListener('click', () => {
  if (cart.length === 0) return;
  let msg = 'Hola NAVIC! 🦐 Quiero hacer el siguiente pedido:\n\n';
  cart.forEach(item => {
    msg += `• ${item.name}\n  Talla: ${item.size} | Color: ${item.color} | Cantidad: ${item.qty}\n\n`;
  });
  msg += 'Por favor confirmarme disponibilidad y precio de envío. ¡Gracias!';
  window.open(`https://wa.me/573147789579?text=${encodeURIComponent(msg)}`, '_blank');
});

// ── MODAL DE PRODUCTO ──
const modal          = document.getElementById('productModal');
const modalClose     = document.getElementById('modalClose');
const modalName      = document.getElementById('modalName');
const modalPrice     = document.getElementById('modalPrice');
const modalSizes     = document.getElementById('modalSizes');
const modalColors    = document.getElementById('modalColors');
const modalAddBtn    = document.getElementById('modalAddBtn');

let selectedSize  = null;
let selectedColor = null;
let currentProduct = null;

function openModal(product) {
  currentProduct = product;
  selectedSize   = null;
  selectedColor  = null;

  modalName.textContent  = product.name;
  modalPrice.textContent = product.price;

  // Tallas
  modalSizes.innerHTML = '';
  product.sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.className    = 'size-btn';
    btn.textContent  = size;
    btn.addEventListener('click', () => {
      modalSizes.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = size;
      checkModalReady();
    });
    modalSizes.appendChild(btn);
  });

  // Colores
  modalColors.innerHTML = '';
  product.colors.forEach(color => {
    const btn = document.createElement('button');
    btn.className   = 'color-btn';
    btn.title       = color.name;
    btn.style.background = color.hex;
    if (color.hex === '#f5f0e8' || color.hex === '#FAF8F5') btn.style.border = '2px solid #ccc';
    btn.addEventListener('click', () => {
      modalColors.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedColor = color.name;
      checkModalReady();
    });
    modalColors.appendChild(btn);
  });

  modalAddBtn.disabled = true;
  modal.classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function checkModalReady() {
  modalAddBtn.disabled = !(selectedSize && selectedColor);
}

modalClose.addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', closeModal);

modalAddBtn.addEventListener('click', () => {
  if (!selectedSize || !selectedColor) return;

  const existing = cart.find(i =>
    i.name === currentProduct.name &&
    i.size === selectedSize &&
    i.color === selectedColor
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      name:  currentProduct.name,
      price: currentProduct.price,
      size:  selectedSize,
      color: selectedColor,
      qty:   1
    });
  }

  updateCartCount();
  closeModal();

  // Feedback visual
  const feedback = document.getElementById('cartFeedback');
  feedback.classList.add('show');
  setTimeout(() => feedback.classList.remove('show'), 2200);
});

// Abrir modal desde cards
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.product-card');
    const product = {
      name:   card.dataset.name,
      price:  card.dataset.price,
      sizes:  card.dataset.sizes.split(','),
      colors: JSON.parse(card.dataset.colors)
    };
    openModal(product);
  });
});

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card.fade-up').forEach((el, i) => {
  el.dataset.delay = i * 70;
  observer.observe(el);
});

document.querySelectorAll('.fade-up:not(.product-card)').forEach(el => {
  observer.observe(el);
});

// ── NAV SHADOW ON SCROLL ──
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.style.boxShadow = window.scrollY > 10
    ? '0 2px 16px rgba(0,0,0,0.07)'
    : 'none';
}, { passive: true });

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.querySelector('nav').offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});