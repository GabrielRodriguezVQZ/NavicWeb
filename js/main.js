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
let currentCardEl = null;

function openModal(product, isJeans, cardEl) {
  currentProduct = product;
  currentCardEl = cardEl;
  selectedSize   = null;
  selectedColor  = isJeans ? 'Único' : null;

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

  // Colores (se omite para jeans)
  const colorSection = modalColors.closest('.modal-section');
  const colorLabel = colorSection.querySelector('.modal-label');
  if (isJeans) {
    colorSection.style.display = '';
    colorLabel.textContent = 'Único color';
    modalColors.innerHTML = '';
  } else {
    colorSection.style.display = '';
    colorLabel.textContent = 'Color';
    modalColors.innerHTML = '';
    product.colors.forEach((color, i) => {
      const btn = document.createElement('button');
      btn.className   = 'color-btn';
      btn.title       = color.name;
      btn.style.background = color.hex;
      if (color.hex === '#f5f0e8' || color.hex === '#FAF8F5') btn.style.border = '2px solid #ccc';
      btn.addEventListener('click', () => {
        modalColors.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = color.name;
        if (currentCardEl && currentCardEl.dataset.images) {
          const images = JSON.parse(currentCardEl.dataset.images);
          if (images[i]) {
            const img = currentCardEl.querySelector('.product-image img');
            if (img) img.src = images[i];
          }
        }
        checkModalReady();
      });
      modalColors.appendChild(btn);
    });
  }

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
    const isJeans = card.dataset.type === 'jeans';
    const product = {
      name:   card.dataset.name,
      price:  card.dataset.price,
      sizes:  card.dataset.sizes.split(','),
      colors: JSON.parse(card.dataset.colors)
    };
    openModal(product, isJeans, card);
  });
});

// ── CATALOG FILTERS ──
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    productCards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      }
    });
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
  el.dataset.delay = i * 80;
  observer.observe(el);
});

document.querySelectorAll('.fade-up:not(.product-card)').forEach((el, i) => {
  el.dataset.delay = i * 100;
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



// ── PRODUCT CARD: ARROWS + QUICK ADD ──
document.querySelectorAll('.product-card').forEach(card => {
  const imagesData = card.dataset.images;
  const imgContainer = card.querySelector('.product-image');
  if (!imagesData || !imgContainer) return;

  const images = JSON.parse(imagesData);
  const imgEl = imgContainer.querySelector('img');
  if (!imgEl) return;

  imgEl.decoding = 'async';

  // Preload
  images.forEach(src => { const p = new Image(); p.src = src; });

  if (images.length > 1) {
    // Add arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'card-arrow card-arrow-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Imagen anterior');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'card-arrow card-arrow-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Siguiente imagen');

    imgContainer.appendChild(prevBtn);
    imgContainer.appendChild(nextBtn);

    // Add dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'product-dots';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'product-dot' + (i === 0 ? ' active' : '');
      dotsContainer.appendChild(dot);
    });
    imgContainer.appendChild(dotsContainer);

    let currentIdx = 0;

    function goToImage(idx) {
      const dots = dotsContainer.querySelectorAll('.product-dot');
      dots[currentIdx].classList.remove('active');
      currentIdx = idx;
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = images[currentIdx];
        imgEl.style.opacity = '1';
        dots[currentIdx].classList.add('active');
      }, 150);
    }

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToImage((currentIdx - 1 + images.length) % images.length);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToImage((currentIdx + 1) % images.length);
    });

    // Swipe gesture for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 40;

    imgContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    imgContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          goToImage((currentIdx + 1) % images.length);
        } else {
          goToImage((currentIdx - 1 + images.length) % images.length);
        }
      }
    }, { passive: true });
  }

  // Add quick-add button
  const quickAdd = document.createElement('button');
  quickAdd.className = 'quick-add-btn';
  quickAdd.textContent = '+ Agregar al carrito';
  quickAdd.addEventListener('click', (e) => {
    e.stopPropagation();
    const isJeans = card.dataset.type === 'jeans';
    const product = {
      name:   card.dataset.name,
      price:  card.dataset.price,
      sizes:  card.dataset.sizes.split(','),
      colors: JSON.parse(card.dataset.colors)
    };
    openModal(product, isJeans, card);
  });
  imgContainer.appendChild(quickAdd);
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer  = btn.nextElementSibling;
    const isOpen  = btn.getAttribute('aria-expanded') === 'true';

    // Cierra todos los demás
    document.querySelectorAll('.faq-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    // Abre o cierra el actual
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

