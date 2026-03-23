// ─── Nova Accessories — Wishlist Page Logic ──────────────────────────────────

(function () {

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const t    = key => I18N.t(key);
  const lang = ()  => I18N.currentLang;

  function getWishlist()        { return JSON.parse(localStorage.getItem('nova_wishlist') || '[]'); }
  function saveWishlist(ids)    { localStorage.setItem('nova_wishlist', JSON.stringify(ids)); }

  function getCart()            { return JSON.parse(localStorage.getItem('nova_cart') || '[]'); }
  function saveCart(cart)       { localStorage.setItem('nova_cart', JSON.stringify(cart)); }

  function getProducts()        { return Store.getProducts(); }

  function showToast(msg) {
    const el = document.getElementById('wlToast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  function updateCartCount() {
    const cart  = getCart();
    const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
    const el    = document.getElementById('cartCount');
    if (el) el.textContent = total;
  }

  function discountPct(p) {
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  /* ── Render ──────────────────────────────────────────────────────────── */
  function render() {
    const ids      = getWishlist();
    const products = getProducts();
    const items    = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

    const countEl  = document.getElementById('wlCount');
    if (countEl) countEl.textContent = items.length;

    const clearBtn = document.getElementById('wlClearBtn');
    if (clearBtn) clearBtn.style.display = items.length ? '' : 'none';

    const content = document.getElementById('wlContent');
    if (!content) return;

    if (items.length === 0) {
      content.innerHTML = `
        <div class="wl-empty">
          <div class="wl-empty-icon">🤍</div>
          <h2 class="wl-empty-title">${t('wl.empty.title')}</h2>
          <p  class="wl-empty-sub">${t('wl.empty.sub')}</p>
          <a href="index.html#shop" class="wl-empty-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            ${t('wl.empty.cta')}
          </a>
        </div>`;
      return;
    }

    content.innerHTML = `<div class="wl-grid" id="wlGrid">${items.map(cardHTML).join('')}</div>`;
    attachCardEvents();
  }

  function cardHTML(p) {
    const pct      = discountPct(p);
    const name     = Store.getProductName(p, lang());
    const cats     = Store.getCategories();
    const catObj   = cats.find(c => c.id === p.category);
    const catName  = catObj ? Store.getCategoryName(catObj, lang()) : '';
    const badgeMap = { sale: 'sale', new: 'new', trending: 'trend' };
    const badgeCls = p.badgeType ? badgeMap[p.badgeType] || '' : '';
    const badgeKey = p.badgeType === 'sale'     ? 'badge.sale'
                   : p.badgeType === 'new'      ? 'badge.new'
                   : p.badgeType === 'trending' ? 'badge.trending' : '';

    return `
    <div class="wl-card" data-id="${p.id}">
      <div class="wl-card-img-wrap">
        <img src="${p.image}" alt="${name}" class="wl-card-img" loading="lazy">
        ${badgeKey ? `<span class="wl-card-badge ${badgeCls}">${t(badgeKey)}</span>` : ''}
        <button class="wl-remove-btn" data-remove="${p.id}" title="${t('wl.toast.removed')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="wl-card-body">
        <div class="wl-card-name"><a href="index.html">${name}</a></div>
        ${catName ? `<div class="wl-card-cat">${catName}</div>` : ''}
        <div class="wl-card-price-row">
          <span class="wl-price">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="wl-price-orig">$${p.originalPrice.toFixed(2)}</span>` : ''}
          ${pct > 0 ? `<span class="wl-price-save">-${pct}%</span>` : ''}
        </div>
        ${!p.inStock ? `<p class="wl-stock-out">❌ ${t('wl.out.stock')}</p>` : ''}
        <div class="wl-card-actions">
          <button class="wl-add-cart" data-add="${p.id}" ${!p.inStock ? 'disabled' : ''}>${t('wl.move.cart')}</button>
        </div>
      </div>
    </div>`;
  }

  function attachCardEvents() {
    // Remove from wishlist
    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.dataset.remove;
        const ids  = getWishlist().filter(x => x !== id);
        saveWishlist(ids);
        // Animate card out
        const card = btn.closest('.wl-card');
        if (card) {
          card.style.transition = 'all .3s';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(.9)';
          setTimeout(render, 320);
        }
        showToast('🤍 ' + t('wl.toast.removed'));
      });
    });

    // Add to cart
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.dataset.add;
        const cart = getCart();
        const idx  = cart.findIndex(i => i.id === id);
        if (idx > -1) { cart[idx].qty = (cart[idx].qty || 1) + 1; }
        else          { cart.push({ id, qty: 1 }); }
        saveCart(cart);
        updateCartCount();
        showToast('🛍️ ' + t('wl.toast.added'));

        // Visual feedback on button
        btn.textContent = '✓';
        btn.style.background = 'linear-gradient(135deg,#10b981,#06b6d4)';
        setTimeout(() => {
          btn.textContent = t('wl.move.cart');
          btn.style.background = '';
        }, 1800);
      });
    });
  }

  /* ── Clear All ───────────────────────────────────────────────────────── */
  document.getElementById('wlClearBtn')?.addEventListener('click', () => {
    if (!confirm(t('wl.confirm.clear'))) return;
    saveWishlist([]);
    showToast('🗑️ ' + t('wl.toast.cleared'));
    render();
  });

  /* ── Language Toggle ─────────────────────────────────────────────────── */
  document.addEventListener('nova:langchange', () => {
    // Sync toggle buttons
    const arBtn = document.getElementById('langAr');
    const enBtn = document.getElementById('langEn');
    if (arBtn && enBtn) {
      const isAr = lang() === 'ar';
      arBtn.classList.toggle('active', isAr);
      enBtn.classList.toggle('active', !isAr);
    }
    render();
  });

  /* ── Init ────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Sync language toggle state
    const isAr = lang() === 'ar';
    document.getElementById('langAr')?.classList.toggle('active', isAr);
    document.getElementById('langEn')?.classList.toggle('active', !isAr);

    updateCartCount();
    render();

    // Listen to storage changes (wishlist modified from main store tab)
    window.addEventListener('storage', e => {
      if (e.key === 'nova_wishlist') render();
      if (e.key === 'nova_cart')     updateCartCount();
    });
  });

})();
