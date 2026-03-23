// ─── Nova Accessories — Store Logic (Bilingual + Full Feature Set) ─────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── State ────────────────────────────────────────────────────────────────
  let state = {
    activeCat    : 'all',
    activeSubcat : 'all',
    sort         : 'default',
    search       : '',
    wishlist     : JSON.parse(localStorage.getItem('nova_wishlist') || '[]'),
    recentlyViewed: JSON.parse(localStorage.getItem('nova_recently_viewed') || '[]'),
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
  const sortSelect     = document.getElementById('sortSelect');
  const activeFilters  = document.getElementById('activeFilters');

  // ── Init ─────────────────────────────────────────────────────────────────
  renderCategoryFilters();
  renderProducts();
  updateCartUI();
  updateWishlistNavCount();
  animateOnScroll();
  initScrollProgress();
  initBackToTop();
  initMaintenanceMode();
  initFlashSale();
  initFomoPopup();
  initPromoPopup();
  initBundles();
  initMobileNav();
  initCountUpStats();

  // Re-render on language change
  document.addEventListener('nova:langchange', () => {
    renderCategoryFilters();
    renderProducts();
    updateCartUI();
    renderRecentlyViewed();
    renderBundles();
    updateSortSelectLabels();
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const t    = key => I18N.t(key);
  const lang = () => I18N.currentLang;

  function getBadgeLabel(badgeType) {
    if (!badgeType) return '';
    return t('badge.' + badgeType) || badgeType;
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if      (i < full)             html += `<span class="star">★</span>`;
      else if (i === full && half)   html += `<span class="star half">★</span>`;
      else                           html += `<span class="star" style="opacity:.25">★</span>`;
    }
    return html;
  }

  // ── Category Filters ─────────────────────────────────────────────────────
  function renderCategoryFilters() {
    const cats = Store.getCategories();
    filterBar.innerHTML = `
      <span class="filter-label">${t('filter.label')}</span>
      <button class="filter-chip${state.activeCat === 'all' ? ' active' : ''}" data-cat="all">
        <span class="chip-icon">🛍️</span>${t('filter.all')}
      </button>
      ${cats.map(c => `
        <button class="filter-chip${state.activeCat === c.id ? ' active' : ''}" data-cat="${c.id}">
          <span class="chip-icon">${c.icon}</span>${Store.getCategoryName(c, lang())}
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
        updateActiveFilters();
      });
    });
  }

  function renderSubcatBar() {
    if (state.activeCat === 'all') { subcatBar.innerHTML = ''; subcatBar.style.display = 'none'; return; }
    const cats = Store.getCategories();
    const cat  = cats.find(c => c.id === state.activeCat);
    if (!cat?.subcategories?.length) { subcatBar.innerHTML = ''; subcatBar.style.display = 'none'; return; }
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
        updateActiveFilters();
      });
    });
  }

  function updateActiveFilters() {
    if (!activeFilters) return;
    const chips = [];
    if (state.activeCat !== 'all') {
      const cat = Store.getCategories().find(c => c.id === state.activeCat);
      if (cat) chips.push({ label: `${cat.icon} ${Store.getCategoryName(cat, lang())}`, action: () => { state.activeCat = 'all'; state.activeSubcat = 'all'; renderCategoryFilters(); renderSubcatBar(); renderProducts(); updateActiveFilters(); } });
    }
    if (state.activeSubcat !== 'all') {
      const cat    = Store.getCategories().find(c => c.id === state.activeCat);
      const subcat = cat?.subcategories?.find(s => s.id === state.activeSubcat);
      if (subcat) chips.push({ label: Store.getSubcatName(subcat, lang()), action: () => { state.activeSubcat = 'all'; renderSubcatBar(); renderProducts(); updateActiveFilters(); } });
    }
    activeFilters.innerHTML = chips.map((c, i) =>
      `<span class="active-chip" data-idx="${i}">${c.label} <button class="chip-remove">×</button></span>`
    ).join('');
    activeFilters.querySelectorAll('.chip-remove').forEach((btn, i) => {
      btn.addEventListener('click', () => chips[i].action());
    });
  }

  // ── Sorting ───────────────────────────────────────────────────────────────
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      renderProducts();
    });
  }

  function updateSortSelectLabels() {
    if (!sortSelect) return;
    sortSelect.querySelectorAll('option').forEach(opt => {
      const key = opt.dataset.i18n;
      if (key) opt.textContent = t(key);
    });
  }

  function applySorting(products) {
    const list = [...products];
    switch (state.sort) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating':     return list.sort((a, b) => b.rating - a.rating);
      default:           return list;
    }
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
    return applySorting(products);
  }

  function renderProducts() {
    const products   = getFilteredProducts();
    const allProducts = Store.getProducts();
    const cats        = Store.getCategories();
    const isAr        = lang() === 'ar';

    if (productCount) {
      const n    = products.length;
      const total = allProducts.length;
      if (state.activeCat !== 'all' || state.activeSubcat !== 'all' || state.search.trim()) {
        productCount.textContent = isAr
          ? `${t('filter.showing')} ${n} ${t('filter.of')} ${total} ${t('filter.items')}`
          : `${t('filter.showing')} ${n} ${t('filter.of')} ${total} ${t('filter.items')}`;
      } else {
        productCount.textContent = isAr ? `${n} ${t('filter.items')}` : `${n} ${t('filter.items')}`;
      }
    }

    if (!products.length) {
      productGrid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p class="no-results-title">${t('prod.no.found')}</p>
          <p class="no-results-sub">${t('prod.no.found.sub')}</p>
        </div>
      `;
      return;
    }

    // Skeleton pulse then real render
    productGrid.innerHTML = products.map(() => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line" style="width:60%;margin-top:12px;"></div>
        <div class="skeleton skeleton-line" style="width:40%;margin-top:8px;"></div>
      </div>`).join('');

    setTimeout(() => {
      productGrid.innerHTML = products.map(p => {
        const cat     = cats.find(c => c.id === p.category);
        const subcat  = cat?.subcategories?.find(s => s.id === p.subcategory);
        const name    = Store.getProductName(p, lang());
        const catName = cat    ? Store.getCategoryName(cat, lang())    : '';
        const subName = subcat ? Store.getSubcatName(subcat, lang())   : '';
        const inWL    = state.wishlist.includes(p.id);
        const disc    = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        const badge   = getBadgeLabel(p.badgeType);
        const stockClass = !p.inStock ? 'out-of-stock' : '';

        return `
          <article class="product-card ${stockClass}" data-id="${p.id}">
            <div class="product-img-wrap">
              <img src="${p.image}" alt="${name}" loading="lazy">
              ${badge ? `<div class="product-badge"><span class="badge badge-${p.badgeType}">${badge}${disc ? ' −'+disc+'%' : ''}</span></div>` : ''}
              ${!p.inStock ? `<div class="product-sold-out-overlay"><span>نفد المخزون</span></div>` : ''}
              <div class="product-actions">
                <button class="product-action-btn wishlist-btn${inWL ? ' wishlist-active' : ''}" data-id="${p.id}" title="${t('wish.added')}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWL?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button class="product-action-btn quickview-btn" data-id="${p.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              ${p.reviews > 100 ? `<div class="sold-count-badge">🔥 ${p.reviews}+ ${isAr?'مبيعاً':'sold'}</div>` : ''}
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
                <button class="add-cart-btn" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
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

      // Stagger fade in
      requestAnimationFrame(() => {
        productGrid.querySelectorAll('.product-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'none';
          }, i * 40);
        });
      });
    }, 300);
  }

  // ── Cart ──────────────────────────────────────────────────────────────────
  function addToCartHandler(productId, qty = 1) {
    Store.addToCart(productId, qty);
    updateCartUI();
    const p    = Store.getProducts().find(p => p.id === productId);
    const name = p ? Store.getProductName(p, lang()) : '';
    showToast('✅', `<strong>${name}</strong> ${t('cart.added')}`);
    // Shake cart icon
    cartBtn.classList.add('cart-shake');
    setTimeout(() => cartBtn.classList.remove('cart-shake'), 500);
    // Update mobile nav badge
    const mbnBadge = document.getElementById('mbnCartCount');
    if (mbnBadge) {
      const total = Store.getCart().reduce((s, i) => s + i.qty, 0);
      mbnBadge.textContent = total;
      mbnBadge.style.display = total > 0 ? 'flex' : 'none';
    }
  }

  function updateCartUI() {
    const cart  = Store.getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total;
    cartCount.classList.toggle('visible', total > 0);
    const mbnBadge = document.getElementById('mbnCartCount');
    if (mbnBadge) { mbnBadge.textContent = total; mbnBadge.style.display = total > 0 ? 'flex' : 'none'; }
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
        </div>`;
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
        </div>`;
    }).join('');
    cartTotal.textContent = `$${Store.getCartTotal().toFixed(2)}`;
    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = Store.getCart().find(i => i.id === btn.dataset.id);
        if (!c) return;
        if (btn.dataset.action === 'dec' && c.qty <= 1) Store.removeFromCart(btn.dataset.id);
        else Store.updateCartQty(btn.dataset.id, c.qty + (btn.dataset.action === 'inc' ? 1 : -1));
        updateCartUI();
      });
    });
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn =>
      btn.addEventListener('click', () => { Store.removeFromCart(btn.dataset.id); updateCartUI(); }));
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  function openCart()  { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  // ── Wishlist ──────────────────────────────────────────────────────────────
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx === -1) { state.wishlist.push(productId);  showToast('❤️', t('wish.added')); }
    else            { state.wishlist.splice(idx, 1);   showToast('🤍', t('wish.removed')); }
    localStorage.setItem('nova_wishlist', JSON.stringify(state.wishlist));
    updateWishlistNavCount();
    renderProducts();
  }

  function updateWishlistNavCount() {
    const wl  = JSON.parse(localStorage.getItem('nova_wishlist') || '[]');
    const cnt = document.getElementById('wishlistNavCount');
    if (cnt) { cnt.textContent = wl.length; cnt.style.display = wl.length > 0 ? 'flex' : 'none'; }
  }

  // ── Quick View Modal (enhanced) ───────────────────────────────────────────
  function openModal(productId) {
    const p    = Store.getProducts().find(p => p.id === productId);
    if (!p) return;

    // Track as recently viewed
    trackRecentlyViewed(productId);

    const cats       = Store.getCategories();
    const cat        = cats.find(c => c.id === p.category);
    const subcat     = cat?.subcategories?.find(s => s.id === p.subcategory);
    const inWL       = state.wishlist.includes(p.id);
    const disc       = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const name       = Store.getProductName(p, lang());
    const desc       = Store.getProductDesc(p, lang());
    const catName    = cat    ? Store.getCategoryName(cat, lang())    : '';
    const subcatName = subcat ? Store.getSubcatName(subcat, lang())   : '';
    const isAr       = lang() === 'ar';

    // Related products (same category, exclude current)
    const related = Store.getProducts()
      .filter(r => r.category === p.category && r.id !== p.id)
      .slice(0, 3);

    const stockHtml = p.inStock
      ? `<span class="stock-in">🟢 ${isAr ? 'متوفر' : 'In Stock'}</span>`
      : `<span class="stock-out">🔴 ${isAr ? 'نفد المخزون' : 'Out of Stock'}</span>`;

    modalOverlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-img zoom-wrap">
          <img src="${p.image}" alt="${name}" id="modalMainImg" class="zoom-img">
        </div>
        <div class="modal-body">
          <div class="modal-cat">${cat ? `${cat.icon} ${catName}${subcat ? ' › ' + subcatName : ''}` : ''}</div>
          <h2 class="modal-name">${name}</h2>
          <div class="product-rating" style="margin-bottom:10px;">
            <div class="stars">${renderStars(p.rating)}</div>
            <span class="rating-count">${p.rating} · ${p.reviews} ${t('modal.reviews')}</span>
          </div>
          ${stockHtml}
          <p class="modal-desc" style="margin-top:12px;">${desc}</p>
          <div class="modal-price-row">
            <span class="modal-price${p.originalPrice ? ' sale' : ''}">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="modal-price-orig">$${p.originalPrice.toFixed(2)}</span><span class="badge badge-sale">${getBadgeLabel('sale')} −${disc}%</span>` : ''}
          </div>

          <!-- Quantity picker -->
          <div class="modal-qty-row">
            <button class="qty-btn modal-qty-dec" id="modalQtyDec">−</button>
            <span class="qty-val" id="modalQtyVal">1</span>
            <button class="qty-btn modal-qty-inc" id="modalQtyInc">+</button>
          </div>

          <div class="modal-actions">
            <button class="modal-add-cart" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''}>
              ${t('prod.qty.add.cart')} $${p.price.toFixed(2)}
            </button>
            <button class="modal-wishlist${inWL ? ' active' : ''}" data-id="${p.id}">${inWL ? '❤️' : '🤍'}</button>
            <button class="modal-share" data-id="${p.id}" title="${isAr?'مشاركة':'Share'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

          ${related.length ? `
          <div class="modal-related">
            <div class="modal-related-title">${isAr ? 'منتجات مشابهة' : 'Related Products'}</div>
            <div class="modal-related-grid">
              ${related.map(r => `
                <div class="modal-related-card quickview-btn" data-id="${r.id}" style="cursor:pointer;">
                  <img src="${r.image}" alt="${Store.getProductName(r, lang())}" loading="lazy">
                  <div class="modal-related-name">${Store.getProductName(r, lang())}</div>
                  <div class="modal-related-price">$${r.price.toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}
        </div>
        <button class="modal-close" id="modalClose">✕</button>
      </div>
    `;

    // Qty picker logic
    let qty = 1;
    const qtyVal = document.getElementById('modalQtyVal');
    const addBtn = modalOverlay.querySelector('.modal-add-cart');
    document.getElementById('modalQtyDec').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyVal.textContent = qty; updateModalAddBtn(); });
    document.getElementById('modalQtyInc').addEventListener('click', () => { qty = Math.min(99, qty + 1); qtyVal.textContent = qty; updateModalAddBtn(); });
    function updateModalAddBtn() {
      addBtn.textContent = `${t('prod.qty.add.cart')} $${(p.price * qty).toFixed(2)}`;
    }

    // Image zoom
    const zoomImg = document.getElementById('modalMainImg');
    if (zoomImg) {
      zoomImg.addEventListener('mouseenter', () => { zoomImg.style.transform = 'scale(1.08)'; zoomImg.style.cursor = 'zoom-in'; });
      zoomImg.addEventListener('mouseleave', () => { zoomImg.style.transform = ''; zoomImg.style.cursor = ''; });
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    addBtn.addEventListener('click', () => { addToCartHandler(p.id, qty); closeModal(); });
    modalOverlay.querySelector('.modal-wishlist').addEventListener('click', () => { toggleWishlist(p.id); closeModal(); });
    modalOverlay.querySelector('.modal-share').addEventListener('click', () => shareProduct(p));

    // Related product click
    modalOverlay.querySelectorAll('.modal-related-card').forEach(card =>
      card.addEventListener('click', () => { closeModal(); setTimeout(() => openModal(card.dataset.id), 320); }));
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalOverlay.innerHTML = ''; }, 300);
  }

  // Share product
  function shareProduct(p) {
    const name = Store.getProductName(p, lang());
    if (navigator.share) {
      navigator.share({ title: name, text: `$${p.price.toFixed(2)}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() =>
        showToast('🔗', lang() === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!'));
    }
  }

  // ── Search ────────────────────────────────────────────────────────────────
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.search = searchInput.value; renderProducts(); }, 250);
    });
  }

  // ── Recently Viewed ───────────────────────────────────────────────────────
  function trackRecentlyViewed(productId) {
    const rv = state.recentlyViewed.filter(id => id !== productId);
    rv.unshift(productId);
    state.recentlyViewed = rv.slice(0, 6);
    localStorage.setItem('nova_recently_viewed', JSON.stringify(state.recentlyViewed));
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    const section = document.getElementById('recentlyViewedSection');
    const track   = document.getElementById('rvTrack');
    if (!section || !track) return;
    const products = Store.getProducts();
    const items    = state.recentlyViewed
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
    if (!items.length) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    track.innerHTML = items.map(p => {
      const name = Store.getProductName(p, lang());
      return `
        <div class="rv-card quickview-btn" data-id="${p.id}" style="cursor:pointer;">
          <div class="rv-img"><img src="${p.image}" alt="${name}" loading="lazy"></div>
          <div class="rv-name">${name}</div>
          <div class="rv-price">$${p.price.toFixed(2)}</div>
        </div>`;
    }).join('');
    track.querySelectorAll('.rv-card').forEach(card =>
      card.addEventListener('click', () => openModal(card.dataset.id)));
  }

  // ── Bundle Deals ──────────────────────────────────────────────────────────
  const DEFAULT_BUNDLES = [
    {
      id: 'bundle_001',
      nameEn: 'Jewelry Starter Set',
      nameAr: 'طقم المجوهرات المبتدئ',
      products: ['prod_001', 'prod_004'],
      discountPct: 15,
      emoji: '💎',
    },
    {
      id: 'bundle_002',
      nameEn: 'Watch & Shades Duo',
      nameAr: 'ساعة وظلة مميزة',
      products: ['prod_003', 'prod_005'],
      discountPct: 20,
      emoji: '⌚',
    },
    {
      id: 'bundle_003',
      nameEn: 'Gift Lover Pack',
      nameAr: 'باقة عشاق الهدايا',
      products: ['prod_006', 'prod_011'],
      discountPct: 18,
      emoji: '🎁',
    },
  ];

  function initBundles() {
    const settings = JSON.parse(localStorage.getItem('nova_features') || '{}');
    if (settings.bundles === false) {
      document.getElementById('bundles').style.display = 'none';
      return;
    }
    renderBundles();
  }

  function renderBundles() {
    const grid = document.getElementById('bundlesGrid');
    if (!grid) return;
    const allProducts = Store.getProducts();
    const isAr = lang() === 'ar';
    const bundles = JSON.parse(localStorage.getItem('nova_bundles') || JSON.stringify(DEFAULT_BUNDLES));
    grid.innerHTML = bundles.map(b => {
      const prods   = b.products.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
      const total   = prods.reduce((s, p) => s + p.price, 0);
      const saved   = total * (b.discountPct / 100);
      const final   = total - saved;
      const bName   = isAr ? b.nameAr : b.nameEn;
      return `
        <div class="bundle-card">
          <div class="bundle-emoji">${b.emoji}</div>
          <div class="bundle-name">${bName}</div>
          <div class="bundle-products">
            ${prods.map(p => `<img src="${p.image}" alt="${Store.getProductName(p, lang())}" class="bundle-thumb" title="${Store.getProductName(p, lang())}">`).join('')}
          </div>
          <div class="bundle-pricing">
            <span class="bundle-orig">$${total.toFixed(2)}</span>
            <span class="bundle-final">$${final.toFixed(2)}</span>
            <span class="bundle-save-badge">${t('bundle.save')} $${saved.toFixed(2)}</span>
          </div>
          <button class="btn btn-primary bundle-add-btn" data-ids="${b.products.join(',')}">
            ${t('bundle.add')}
          </button>
        </div>`;
    }).join('');
    grid.querySelectorAll('.bundle-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.dataset.ids.split(',').forEach(id => Store.addToCart(id));
        updateCartUI();
        showToast('🎁', isAr ? 'تمت إضافة الباقة!' : 'Bundle added to cart!');
      });
    });
  }

  // ── Flash Sale Countdown ──────────────────────────────────────────────────
  function initFlashSale() {
    const banner  = document.getElementById('flashBanner');
    const dismiss = document.getElementById('flashDismiss');
    if (!banner) return;
    dismiss?.addEventListener('click', () => {
      banner.style.display = 'none';
      sessionStorage.setItem('nova_flash_dismissed', '1');
    });
    if (sessionStorage.getItem('nova_flash_dismissed')) return;

    function tick() {
      const config = JSON.parse(localStorage.getItem('nova_flash_sale') || '{}');
      if (!config.active || !config.endTime) { banner.style.display = 'none'; return; }
      const diff = new Date(config.endTime) - Date.now();
      if (diff <= 0) { banner.style.display = 'none'; return; }
      banner.style.display = 'block';
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('ftHours').textContent = String(h).padStart(2, '0');
      document.getElementById('ftMins').textContent  = String(m).padStart(2, '0');
      document.getElementById('ftSecs').textContent  = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);

    // Listen for storage changes (admin updates flash sale)
    window.addEventListener('storage', e => { if (e.key === 'nova_flash_sale') tick(); });
  }

  // ── FOMO Social Proof ─────────────────────────────────────────────────────
  function initFomoPopup() {
    const settings = JSON.parse(localStorage.getItem('nova_features') || '{}');
    if (settings.social === false) return;

    const names_ar = ['رانيا', 'أحمد', 'سارة', 'خالد', 'نورا', 'يوسف', 'مريم', 'عمر'];
    const names_en = ['Sophia', 'James', 'Amara', 'Lucas', 'Zara', 'Noah', 'Layla', 'Aiden'];
    const cities_ar = ['الرياض', 'دبي', 'القاهرة', 'بيروت', 'عمّان', 'الدوحة', 'الكويت', 'أبوظبي'];
    const cities_en = ['Dubai', 'London', 'Cairo', 'Beirut', 'NYC', 'Paris', 'Riyadh', 'Toronto'];
    const fomoEl   = document.getElementById('fomoPopup');
    const fomoText = document.getElementById('fomoText');
    const dismiss  = document.getElementById('fomoDismiss');
    if (!fomoEl || !fomoText) return;
    dismiss?.addEventListener('click', () => { fomoEl.style.display = 'none'; });

    function showFomo() {
      const products = Store.getProducts();
      if (!products.length) return;
      const isAr = lang() === 'ar';
      const names  = isAr ? names_ar : names_en;
      const cities = isAr ? cities_ar : cities_en;
      const p      = products[Math.floor(Math.random() * products.length)];
      const name   = names[Math.floor(Math.random() * names.length)];
      const city   = cities[Math.floor(Math.random() * cities.length)];
      const pName  = Store.getProductName(p, lang());
      fomoText.innerHTML = isAr
        ? `🛍️ <strong>${name}</strong> من ${city} ${t('fomo.bought')} <em>${pName}</em>`
        : `🛍️ <strong>${name}</strong> from ${city} ${t('fomo.bought')} <em>${pName}</em>`;
      fomoEl.style.display = 'flex';
      fomoEl.classList.add('fomo-in');
      setTimeout(() => { fomoEl.classList.remove('fomo-in'); fomoEl.style.display = 'none'; }, 5000);
    }

    // First show after 8s, then every 35-55s
    setTimeout(() => {
      showFomo();
      setInterval(showFomo, 35000 + Math.random() * 20000);
    }, 8000);
  }

  // ── Promo Popup ───────────────────────────────────────────────────────────
  function initPromoPopup() {
    const settings = JSON.parse(localStorage.getItem('nova_features') || '{}');
    if (settings.promo === false) return;
    if (localStorage.getItem('nova_welcomed')) return;

    const overlay  = document.getElementById('promoOverlay');
    const closeBtn = document.getElementById('promoClose');
    const skipBtn  = document.getElementById('promoSkip');
    const copyBtn  = document.getElementById('promoCopy');
    if (!overlay) return;

    // Show after 4 seconds
    setTimeout(() => {
      overlay.style.display = 'flex';
      requestAnimationFrame(() => overlay.classList.add('promo-visible'));
      launchConfetti();
    }, 4000);

    function dismiss() {
      overlay.classList.remove('promo-visible');
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
      localStorage.setItem('nova_welcomed', '1');
    }

    closeBtn?.addEventListener('click', dismiss);
    skipBtn?.addEventListener('click', dismiss);

    // Get active promo code
    const promoCodes = JSON.parse(localStorage.getItem('nova_promo_codes') || '[]');
    const activeCode = promoCodes.find(c => c.active) || { code: 'NOVA10' };
    const codeEl = document.getElementById('promoCodeText');
    if (codeEl) codeEl.textContent = activeCode.code;

    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(activeCode.code).then(() => {
        const span = copyBtn.querySelector('[data-i18n]');
        if (span) { span.textContent = t('promo.copied'); setTimeout(() => { span.textContent = t('promo.copy'); }, 2000); }
      });
    });
  }

  function launchConfetti() {
    const container = document.getElementById('promoConfetti');
    if (!container) return;
    const colors = ['#8B5CF6','#EC4899','#06B6D4','#F59E0B','#10B981'];
    container.innerHTML = Array.from({ length: 30 }, (_, i) => {
      const color = colors[i % colors.length];
      const x = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const size  = 6 + Math.random() * 6;
      return `<div class="confetti-piece" style="left:${x}%;animation-delay:${delay}s;width:${size}px;height:${size}px;background:${color};"></div>`;
    }).join('');
  }

  // ── Maintenance Mode ──────────────────────────────────────────────────────
  function initMaintenanceMode() {
    applyMaintenanceState();

    // Ctrl+A to open pin pad
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key.toLowerCase() === 'a' && !e.target.matches('input,textarea,select')) {
        e.preventDefault();
        openPinPad();
      }
    });

    // Storage event: sync across tabs
    window.addEventListener('storage', e => {
      if (e.key === 'nova_maintenance') applyMaintenanceState();
    });

    // Pin pad logic
    const pinOverlay = document.getElementById('pinOverlay');
    const pinInput   = document.getElementById('pinInput');
    const pinSubmit  = document.getElementById('pinSubmit');
    const pinCancel  = document.getElementById('pinCancel');
    const pinMsg     = document.getElementById('pinMsg');

    pinCancel?.addEventListener('click', closePinPad);
    pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') submitPin(); if (e.key === 'Escape') closePinPad(); });
    pinSubmit?.addEventListener('click', submitPin);

    async function submitPin() {
      const ok = await Auth.verify(pinInput.value.trim());
      if (ok) {
        const isNow = Auth.toggleMaintenance();
        closePinPad();
        applyMaintenanceState();
        showToast('🔧', isNow
          ? (lang()==='ar' ? '🔴 وضع الصيانة مفعّل' : '🔴 Maintenance ON')
          : (lang()==='ar' ? '🟢 وضع الصيانة أُلغي' : '🟢 Maintenance OFF'));
      } else {
        pinMsg.textContent = lang() === 'ar' ? '❌ كلمة مرور خاطئة' : '❌ Wrong password';
        pinInput.value = '';
      }
    }

    function openPinPad() {
      if (!pinOverlay) return;
      pinOverlay.style.display = 'flex';
      requestAnimationFrame(() => pinOverlay.classList.add('pin-visible'));
      pinInput.value = '';
      if (pinMsg) pinMsg.textContent = '';
      setTimeout(() => pinInput.focus(), 100);
    }

    function closePinPad() {
      if (!pinOverlay) return;
      pinOverlay.classList.remove('pin-visible');
      setTimeout(() => { pinOverlay.style.display = 'none'; }, 250);
    }
  }

  function applyMaintenanceState() {
    const overlay = document.getElementById('maintenanceOverlay');
    if (!overlay) return;
    const state   = Auth.getMaintenanceState();
    if (state.active) {
      overlay.style.display = 'flex';
      const titleEl = document.getElementById('maintTitle');
      const subEl   = document.getElementById('maintSub');
      if (titleEl) titleEl.textContent = lang() === 'ar' ? state.messageAr : state.messageEn;
      if (subEl)   subEl.textContent   = lang() === 'ar' ? 'نحن نقوم ببعض التحسينات. شكراً لصبرك!' : 'We\'re making some improvements. Thank you for your patience!';
      if (state.backBy) {
        const backByDisplay = document.getElementById('maintBackByDisplay');
        const backByTime    = document.getElementById('maintBackByTime');
        if (backByDisplay && backByTime) {
          backByDisplay.style.display = 'flex';
          backByTime.textContent = new Date(state.backBy).toLocaleString(lang() === 'ar' ? 'ar-SA' : 'en-US');
        }
      }
      document.body.style.overflow = 'hidden';
    } else {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // ── Scroll Progress ───────────────────────────────────────────────────────
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const doc  = document.documentElement;
      const pct  = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── Back to Top ───────────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 400;
      btn.style.opacity = show ? '1' : '0';
      btn.style.pointerEvents = show ? 'auto' : 'none';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Mobile Nav ────────────────────────────────────────────────────────────
  function initMobileNav() {
    document.getElementById('mbnCartBtn')?.addEventListener('click', openCart);
    document.getElementById('mbnSearchBtn')?.addEventListener('click', () => {
      const si = document.getElementById('searchInput');
      if (si) { si.focus(); si.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }

  // ── Count-up Hero Stats ───────────────────────────────────────────────────
  function initCountUpStats() {
    const targets = document.querySelectorAll('.hero-stat-num');
    if (!targets.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = el.textContent.replace(/[^0-9.]/g,'');
        const suffix = el.textContent.replace(/[0-9.]/g,'');
        if (!end || isNaN(parseFloat(end))) return;
        const final   = parseFloat(end);
        const dur     = 1200;
        const start   = Date.now();
        function step() {
          const progress = Math.min(1, (Date.now()-start)/dur);
          const ease     = 1 - Math.pow(1-progress, 3);
          el.textContent = (final < 10 ? (final * ease).toFixed(1) : Math.floor(final * ease)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    targets.forEach(el => observer.observe(el));
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
    document.querySelectorAll('.cat-card, .testimonial-card, .bundle-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ── Category cards → scroll + filter ─────────────────────────────────────
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
      updateActiveFilters();
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

  // ── Admin panel link in admin.js saves activity log ───────────────────────
  // Also init render of recently viewed and render categories
  renderRecentlyViewed();

});
