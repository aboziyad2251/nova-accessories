// ─── Nova Accessories — Store Logic (Bilingual) ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── State ────────────────────────────────────────────────────────────────
  let state = {
    activeCat:    'all',
    activeSubcat: 'all',
    search:       '',
    wishlist:     JSON.parse(localStorage.getItem('nova_wishlist') || '[]'),
  };

  // ── Elements ─────────────────────────────────────────────────────────────
  const productGrid    = document.getElementById('productsGrid');
  const filterBar      = document.getElementById('filterBar');
  const subcatBar      = document.getElementById('subcatBar');
  const cartBtn        = document.getElementById('cartBtn');
  const cartCount      = document.getElementById('cartCount');
  const cartDrawer     = document.getElementById('cartDrawer');
  const cartOverlay    = document.getElementById('cartOverlay');
  const cartClose      = document.getElementById('cartClose');
  const cartItemsEl    = document.getElementById('cartItems');
  const cartTotal      = document.getElementById('cartTotal');
  const searchInput    = document.getElementById('searchInput');
  const productCount   = document.getElementById('productCount');
  const modalOverlay   = document.getElementById('modalOverlay');
  const toastContainer = document.getElementById('toastContainer');

  // ── Init ─────────────────────────────────────────────────────────────────
  renderCategoryFilters();
  renderProducts();
  updateCartUI();
  animateOnScroll();

  // Re-render everything when language changes
  document.addEventListener('nova:langchange', () => {
    renderCategoryFilters();
    renderProducts();
    updateCartUI();
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const t    = key => I18N.t(key);
  const lang = () => I18N.currentLang;

  function getBadgeLabel(badgeType) {
    if (!badgeType) return '';
    return t('badge.' + badgeType) || badgeType;
  }

  // ── Category Filters ─────────────────────────────────────────────────────
  function renderCategoryFilters() {
    const cats = Store.getCategories();
    filterBar.innerHTML = `
      <span class="filter-label">${t('filter.label')}</span>
      <button class="filter-chip${state.activeCat === 'all' ? ' active' : ''}" data-cat="all">
        <span class="chip-icon">🛍️</span> ${t('filter.all')}
      </button>
      ${cats.map(c => `
        <button class="filter-chip${state.activeCat === c.id ? ' active' : ''}" data-cat="${c.id}">
          <span class="chip-icon">${c.icon}</span> ${Store.getCategoryName(c, lang())}
        </button>
      `).join('')}
    `;
    filterBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCat    = btn.dataset.cat;
        state.activeSubcat = 'all';
        filterBar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSubcatBar();
        renderProducts();
      });
    });
  }

  function renderSubcatBar() {
    if (state.activeCat === 'all') {
      subcatBar.innerHTML = ''; subcatBar.style.display = 'none'; return;
    }
    const cats = Store.getCategories();
    const cat  = cats.find(c => c.id === state.activeCat);
    if (!cat || !cat.subcategories?.length) {
      subcatBar.innerHTML = ''; subcatBar.style.display = 'none'; return;
    }
    subcatBar.style.display = 'flex';
    subcatBar.innerHTML = `
      <button class="subcat-chip${state.activeSubcat === 'all' ? ' active' : ''}" data-sub="all">
        ${t('filter.all')} ${Store.getCategoryName(cat, lang())}
      </button>
      ${cat.subcategories.map(s => `
        <button class="subcat-chip${state.activeSubcat === s.id ? ' active' : ''}" data-sub="${s.id}">
          ${Store.getSubcatName(s, lang())}
        </button>
      `).join('')}
    `;
    subcatBar.querySelectorAll('.subcat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeSubcat = btn.dataset.sub;
        subcatBar.querySelectorAll('.subcat-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
    });
  }

  // ── Products ──────────────────────────────────────────────────────────────
  function getFilteredProducts() {
    let products = Store.getProducts();
    if (state.activeCat    !== 'all') products = products.filter(p => p.category    === state.activeCat);
    if (state.activeSubcat !== 'all') products = products.filter(p => p.subcategory === state.activeSubcat);
    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      products = products.filter(p => {
        const name = Store.getProductName(p, lang()).toLowerCase();
        const desc = Store.getProductDesc(p, lang()).toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    return products;
  }

  function renderProducts() {
    const products = getFilteredProducts();
    const cats     = Store.getCategories();
    const isAr     = lang() === 'ar';

    if (productCount) {
      const n   = products.length;
      const lbl = isAr
        ? `${n} ${t('product.count.single') || 'منتج'}`
        : `${n} ${n !== 1 ? 'products' : 'product'}`;
      productCount.textContent = lbl;
    }

    if (!products.length) {
      productGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--text3);">
          <div style="font-size:56px;margin-bottom:16px;">🔍</div>
          <p style="font-size:18px;font-weight:600;color:var(--text2);">${t('prod.no.found')}</p>
          <p style="margin-top:8px;">${t('prod.no.found.sub')}</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = products.map(p => {
      const cat     = cats.find(c => c.id === p.category);
      const subcat  = cat?.subcategories?.find(s => s.id === p.subcategory);
      const name    = Store.getProductName(p, lang());
      const catName = cat ? Store.getCategoryName(cat, lang()) : '';
      const subName = subcat ? Store.getSubcatName(subcat, lang()) : '';
      const inWL    = state.wishlist.includes(p.id);
      const disc    = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
      const badge   = getBadgeLabel(p.badgeType);

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${name}" loading="lazy">
            ${badge ? `
              <div class="product-badge">
                <span class="badge badge-${p.badgeType}">${badge}${p.badgeType === 'sale' && disc ? ` ${isAr ? '' : '-'}${disc}%` : ''}</span>
              </div>` : ''}
            <div class="product-actions">
              <button class="product-action-btn wishlist-btn ${inWL ? 'wishlist-active' : ''}" data-id="${p.id}" title="${t('wish.added')}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWL ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button class="product-action-btn quickview-btn" data-id="${p.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="product-body">
            <div class="product-cat">${cat ? `${cat.icon} ${catName}${subcat ? ' · ' + subName : ''}` : ''}</div>
            <h3 class="product-name">
              <a href="#" class="quickview-link" data-id="${p.id}">${name}</a>
            </h3>
            <div class="product-rating">
              <div class="stars">${renderStars(p.rating)}</div>
              <span class="rating-count">${p.rating} (${p.reviews})</span>
            </div>
            <div class="product-footer">
              <div class="product-price">
                <span class="price-current${p.originalPrice ? ' sale' : ''}">$${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <button class="add-cart-btn" data-id="${p.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                ${t('prod.add')}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind events
    productGrid.querySelectorAll('.add-cart-btn').forEach(btn =>
      btn.addEventListener('click', () => addToCartHandler(btn.dataset.id)));
    productGrid.querySelectorAll('.wishlist-btn').forEach(btn =>
      btn.addEventListener('click', () => toggleWishlist(btn.dataset.id)));
    productGrid.querySelectorAll('.quickview-btn, .quickview-link').forEach(btn =>
      btn.addEventListener('click', e => { e.preventDefault(); openModal(btn.dataset.id); }));

    // Animate in
    requestAnimationFrame(() => {
      productGrid.querySelectorAll('.product-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'none';
        }, i * 50);
      });
    });
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full)            html += `<span class="star">★</span>`;
      else if (i === full && half) html += `<span class="star half">★</span>`;
      else                     html += `<span class="star" style="opacity:.25">★</span>`;
    }
    return html;
  }

  // ── Cart ──────────────────────────────────────────────────────────────────
  function addToCartHandler(productId) {
    Store.addToCart(productId);
    updateCartUI();
    const p    = Store.getProducts().find(p => p.id === productId);
    const name = p ? Store.getProductName(p, lang()) : '';
    showToast('✅', `<strong>${name}</strong> ${t('cart.added')}`);
    cartBtn.style.transform = 'scale(1.25)';
    setTimeout(() => { cartBtn.style.transform = ''; }, 200);
  }

  function updateCartUI() {
    const cart  = Store.getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total;
    cartCount.classList.toggle('visible', total > 0);
    renderCartDrawer();
  }

  function renderCartDrawer() {
    const cart     = Store.getCart();
    const products = Store.getProducts();

    if (!cart.length) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>${t('cart.empty')}</p>
          <p style="margin-top:8px;font-size:13px;">${t('cart.empty.sub')}</p>
        </div>
      `;
      cartTotal.textContent = '$0.00';
      return;
    }

    cartItemsEl.innerHTML = cart.map(item => {
      const p = products.find(p => p.id === item.id);
      if (!p) return '';
      const name = Store.getProductName(p, lang());
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item-img"><img src="${p.image}" alt="${name}"></div>
          <div style="flex:1">
            <div class="cart-item-name">${name}</div>
            <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
              <button class="cart-item-remove" data-id="${p.id}">${t('cart.remove')}</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartTotal.textContent = `$${Store.getCartTotal().toFixed(2)}`;

    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = Store.getCart();
        const item = cart.find(i => i.id === btn.dataset.id);
        if (!item) return;
        if (btn.dataset.action === 'dec' && item.qty <= 1) Store.removeFromCart(btn.dataset.id);
        else Store.updateCartQty(btn.dataset.id, item.qty + (btn.dataset.action === 'inc' ? 1 : -1));
        updateCartUI();
      });
    });
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => { Store.removeFromCart(btn.dataset.id); updateCartUI(); });
    });
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  function openCart()  { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  // ── Wishlist ──────────────────────────────────────────────────────────────
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx === -1) { state.wishlist.push(productId);    showToast('❤️', t('wish.added')); }
    else            { state.wishlist.splice(idx, 1);     showToast('🤍', t('wish.removed')); }
    localStorage.setItem('nova_wishlist', JSON.stringify(state.wishlist));
    renderProducts();
  }

  // ── Quick View Modal ──────────────────────────────────────────────────────
  function openModal(productId) {
    const p    = Store.getProducts().find(p => p.id === productId);
    if (!p) return;
    const cats   = Store.getCategories();
    const cat    = cats.find(c => c.id === p.category);
    const subcat = cat?.subcategories?.find(s => s.id === p.subcategory);
    const inWL   = state.wishlist.includes(p.id);
    const disc   = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const name   = Store.getProductName(p, lang());
    const desc   = Store.getProductDesc(p, lang());
    const catName  = cat    ? Store.getCategoryName(cat, lang())    : '';
    const subcatName = subcat ? Store.getSubcatName(subcat, lang()) : '';

    modalOverlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-img">
          <img src="${p.image}" alt="${name}">
        </div>
        <div class="modal-body">
          <div class="modal-cat">${cat ? `${cat.icon} ${catName}${subcat ? ' › ' + subcatName : ''}` : ''}</div>
          <h2 class="modal-name">${name}</h2>
          <div class="product-rating" style="margin-bottom:16px;">
            <div class="stars">${renderStars(p.rating)}</div>
            <span class="rating-count">${p.rating} · ${p.reviews} ${t('modal.reviews')}</span>
          </div>
          <p class="modal-desc">${desc}</p>
          <div class="modal-price-row">
            <span class="modal-price${p.originalPrice ? ' sale' : ''}">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `
              <span class="modal-price-orig">$${p.originalPrice.toFixed(2)}</span>
              <span class="badge badge-sale">${getBadgeLabel('sale')} -${disc}%</span>
            ` : ''}
          </div>
          <div class="modal-actions">
            <button class="modal-add-cart" data-id="${p.id}">
              ${t('prod.qty.add.cart')} $${p.price.toFixed(2)}
            </button>
            <button class="modal-wishlist${inWL ? ' active' : ''}" data-id="${p.id}">
              ${inWL ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
        <button class="modal-close" id="modalClose">✕</button>
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    modalOverlay.querySelector('.modal-add-cart').addEventListener('click', () => { addToCartHandler(p.id); closeModal(); });
    modalOverlay.querySelector('.modal-wishlist').addEventListener('click', () => { toggleWishlist(p.id); closeModal(); });
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalOverlay.innerHTML = ''; }, 300);
  }

  // ── Search ────────────────────────────────────────────────────────────────
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.search = searchInput.value; renderProducts(); }, 250);
    });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(icon, message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3000);
  }

  // ── Scroll Animations ─────────────────────────────────────────────────────
  function animateOnScroll() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.cat-card, .testimonial-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ── Category cards click → scroll to shop & filter ───────────────────────
  document.addEventListener('click', e => {
    const card = e.target.closest('.cat-card[data-cat]');
    if (!card) return;
    const catId = card.dataset.cat;
    state.activeCat    = catId;
    state.activeSubcat = 'all';
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      filterBar.querySelectorAll('.filter-chip').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === catId));
      renderSubcatBar();
      renderProducts();
    }, 400);
  });

  // ── Checkout placeholder ──────────────────────────────────────────────────
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!Store.getCart().length) return;
    showToast('🎉', t('cart.checkout.soon'));
  });

  // ── Keyboard ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeModal(); }
  });

});
