// ─── Nova Accessories — Admin Panel Logic (Bilingual) ───────────────────────

document.addEventListener('DOMContentLoaded', () => {

  const t    = key => I18N.t(key);
  const lang = ()  => I18N.currentLang;

  // ── Navigation ───────────────────────────────────────────────────────────
  const pages    = document.querySelectorAll('.admin-page');
  const navLinks = document.querySelectorAll('.sidebar-link[data-page]');

  function showPage(pageId) {
    pages.forEach(p => p.classList.toggle('active', p.id === pageId));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === pageId));
    const titles = {
      'page-dashboard': ['adm.dashboard', 'adm.sub.dash'],
      'page-products':  ['adm.products',  'adm.sub.prods'],
      'page-categories':['adm.categories','adm.sub.cats'],
    };
    const [titleKey, subKey] = titles[pageId] || ['adm.dashboard', ''];
    document.getElementById('topbarTitle').textContent = t(titleKey);
    document.getElementById('topbarSub').textContent   = subKey ? t(subKey) : '';
    if (pageId === 'page-dashboard')  renderDashboard();
    if (pageId === 'page-products')   renderProducts();
    if (pageId === 'page-categories') renderCategories();
  }

  navLinks.forEach(link => link.addEventListener('click', () => showPage(link.dataset.page)));
  showPage('page-dashboard');

  // Re-render on language change
  document.addEventListener('nova:langchange', () => {
    // Update topbar
    const activePage = document.querySelector('.admin-page.active');
    if (activePage) showPage(activePage.id);
  });

  // ── Dashboard ────────────────────────────────────────────────────────────
  function renderDashboard() {
    const products    = Store.getProducts();
    const cats        = Store.getCategories();
    const totalSubs   = cats.reduce((s, c) => s + (c.subcategories?.length || 0), 0);

    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statCats').textContent     = cats.length;
    document.getElementById('statSubcats').textContent  = totalSubs;
    document.getElementById('statFeatured').textContent = products.filter(p => p.featured).length;

    const recent = [...products].slice(-5).reverse();
    document.getElementById('recentProducts').innerHTML = recent.map(p => {
      const cat  = cats.find(c => c.id === p.category);
      const name = Store.getProductName(p, lang());
      const catN = cat ? Store.getCategoryName(cat, lang()) : '—';
      const bdg  = p.badgeType ? `<span class="badge badge-${p.badgeType}">${getBadgeLabel(p.badgeType)}</span>`
                               : `<span class="badge badge-none">${t('adm.f.none')}</span>`;
      const stk  = p.inStock   ? `<span class="badge badge-instock">${t('adm.instock')}</span>`
                               : `<span class="badge badge-none">${t('adm.outstock')}</span>`;
      return `<tr>
        <td><div class="prod-info">
          <div class="prod-thumb"><img src="${p.image}" alt="${name}" loading="lazy"></div>
          <div><div class="prod-name">${name}</div><div class="prod-desc">${catN}</div></div>
        </div></td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${bdg}</td>
        <td>${stk}</td>
      </tr>`;
    }).join('');
  }

  // ── Products ──────────────────────────────────────────────────────────────
  let productSearch = '';

  function renderProducts() {
    const allProds = Store.getProducts();
    const cats     = Store.getCategories();
    const q        = productSearch.toLowerCase();
    const products = q
      ? allProds.filter(p => Store.getProductName(p, lang()).toLowerCase().includes(q)
                          || Store.getProductDesc(p, lang()).toLowerCase().includes(q))
      : allProds;

    document.getElementById('productCountBadge').textContent = allProds.length;

    const tbody = document.getElementById('productsTableBody');
    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="6">
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>${t('adm.no.products')}</h3>
          <p>${t('adm.no.products.sub')}</p>
        </div>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => {
      const cat    = cats.find(c => c.id === p.category);
      const subcat = cat?.subcategories?.find(s => s.id === p.subcategory);
      const name   = Store.getProductName(p, lang());
      const catN   = cat    ? `${cat.icon} ${Store.getCategoryName(cat, lang())}` : '—';
      const subN   = subcat ? Store.getSubcatName(subcat, lang()) : '';
      const bdg    = p.badgeType ? `<span class="badge badge-${p.badgeType}">${getBadgeLabel(p.badgeType)}</span>`
                                 : `<span class="badge badge-none">${t('adm.f.none')}</span>`;
      const stk    = p.inStock   ? `<span class="badge badge-instock">${t('adm.instock')}</span>`
                                 : `<span class="badge badge-none">${t('adm.outstock')}</span>`;
      return `<tr data-id="${p.id}">
        <td><div class="prod-info">
          <div class="prod-thumb"><img src="${p.image}" alt="${name}" loading="lazy"></div>
          <div>
            <div class="prod-name">${name}</div>
            <div class="prod-desc">${Store.getProductDesc(p, lang())}</div>
          </div>
        </div></td>
        <td>
          <div style="font-weight:700">$${p.price.toFixed(2)}</div>
          ${p.originalPrice ? `<div style="font-size:12px;color:var(--text3);text-decoration:line-through">$${p.originalPrice.toFixed(2)}</div>` : ''}
        </td>
        <td>${catN}${subN ? `<br><span style="font-size:12px;color:var(--text3)">${subN}</span>` : ''}</td>
        <td>${bdg}</td>
        <td>${stk}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline edit-product-btn" data-id="${p.id}">${t('adm.edit.btn')}</button>
            <button class="btn btn-sm btn-danger delete-product-btn" data-id="${p.id}">${t('adm.delete.btn')}</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.edit-product-btn').forEach(btn =>
      btn.addEventListener('click', () => openProductForm(btn.dataset.id)));
    tbody.querySelectorAll('.delete-product-btn').forEach(btn =>
      btn.addEventListener('click', () => confirmDelete('product', btn.dataset.id)));
  }

  function getBadgeLabel(type) {
    const map = { sale: t('badge.sale'), new: t('badge.new'), trending: t('badge.trending') };
    return map[type] || type || t('adm.f.none');
  }

  document.getElementById('productSearchInput').addEventListener('input', e => {
    productSearch = e.target.value; renderProducts();
  });
  document.getElementById('addProductBtn').addEventListener('click', () => openProductForm(null));

  // ── Product Form ──────────────────────────────────────────────────────────
  const productFormOverlay = document.getElementById('productFormOverlay');

  function openProductForm(productId) {
    const cats = Store.getCategories();
    const p    = productId ? Store.getProducts().find(x => x.id === productId) : null;

    const catOptions = cats.map(c =>
      `<option value="${c.id}" ${p?.category === c.id ? 'selected' : ''}>
        ${c.icon} ${Store.getCategoryName(c, lang())}
      </option>`
    ).join('');

    let subcatOptions = `<option value="">${t('adm.f.sel.subcat')}</option>`;
    if (p?.category) {
      const cat = cats.find(c => c.id === p.category);
      if (cat?.subcategories?.length) {
        subcatOptions = `<option value="">${t('adm.f.sel.subcat')}</option>` +
          cat.subcategories.map(s =>
            `<option value="${s.id}" ${p?.subcategory === s.id ? 'selected' : ''}>${Store.getSubcatName(s, lang())}</option>`
          ).join('');
      }
    }

    const badgeOptions = [
      `<option value="" ${!p?.badgeType ? 'selected':''}>${t('adm.f.none')}</option>`,
      `<option value="sale" ${p?.badgeType==='sale'?'selected':''}>${t('badge.sale')}</option>`,
      `<option value="new"  ${p?.badgeType==='new'?'selected':''}>${t('badge.new')}</option>`,
      `<option value="trending" ${p?.badgeType==='trending'?'selected':''}>${t('badge.trending')}</option>`,
    ].join('');

    productFormOverlay.innerHTML = `
      <div class="form-modal">
        <div class="form-header">
          <h2 class="form-title">${p ? t('adm.edit.product') : t('adm.add.new.product')}</h2>
          <button class="form-close" id="pfClose">✕</button>
        </div>
        <div class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.f.name')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="pf_name"
                placeholder="${t('adm.f.name.ph')}" value="${p?.name || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.f.name.ar')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="pf_name_ar" dir="rtl"
                placeholder="${t('adm.f.name.ar.ph')}" value="${p?.name_ar || ''}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('adm.f.desc')}</label>
            <textarea class="form-textarea" id="pf_desc" dir="ltr"
              placeholder="${t('adm.f.desc.ph')}">${p?.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">${t('adm.f.desc.ar')}</label>
            <textarea class="form-textarea" id="pf_desc_ar" dir="rtl"
              placeholder="${t('adm.f.desc.ar.ph')}">${p?.description_ar || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.f.price')} <span class="required">*</span></label>
              <input type="number" class="form-input" id="pf_price"
                placeholder="0.00" min="0" step="0.01" value="${p?.price || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">
                ${t('adm.f.orig.price')}
                <span style="color:var(--text3);font-weight:400;font-size:11px;">${t('adm.f.orig.note')}</span>
              </label>
              <input type="number" class="form-input" id="pf_origprice"
                placeholder="0.00" min="0" step="0.01" value="${p?.originalPrice || ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.f.category')} <span class="required">*</span></label>
              <select class="form-select" id="pf_cat">
                <option value="">${t('adm.f.sel.cat')}</option>
                ${catOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.f.subcategory')}</label>
              <select class="form-select" id="pf_subcat">${subcatOptions}</select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('adm.f.image')} <span class="required">*</span></label>
            <input type="url" class="form-input" id="pf_img" dir="ltr"
              placeholder="${t('adm.f.image.ph')}" value="${p?.image || ''}">
            <p class="form-hint">${t('adm.f.image.hint')}</p>
          </div>
          <div class="form-group">
            <label class="form-label">${t('adm.f.preview')}</label>
            <div class="form-img-preview" id="pf_imgPreview">
              ${p?.image ? `<img src="${p.image}" alt="preview">` : `<span>${t('adm.f.preview.ph')}</span>`}
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.f.badge')}</label>
              <select class="form-select" id="pf_badge">${badgeOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.f.rating')}</label>
              <input type="number" class="form-input" id="pf_rating"
                min="0" max="5" step="0.1" value="${p?.rating || 4.5}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.f.reviews')}</label>
              <input type="number" class="form-input" id="pf_reviews" min="0" value="${p?.reviews || 0}">
            </div>
            <div class="form-group">
              <label class="form-label" style="margin-bottom:12px;">Toggles</label>
              <div style="display:flex;flex-direction:column;gap:12px;">
                <div class="toggle-wrap">
                  <label class="toggle">
                    <input type="checkbox" id="pf_instock" ${p?.inStock !== false ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">${t('adm.f.instock')}</span>
                </div>
                <div class="toggle-wrap">
                  <label class="toggle">
                    <input type="checkbox" id="pf_featured" ${p?.featured ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">${t('adm.f.featured')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer">
          <button class="btn btn-outline" id="pfCancel">${t('adm.cancel')}</button>
          <button class="btn btn-primary" id="pfSave">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            ${p ? t('adm.save') : t('adm.add.product')}
          </button>
        </div>
      </div>
    `;

    productFormOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Image preview
    const imgInput   = document.getElementById('pf_img');
    const imgPreview = document.getElementById('pf_imgPreview');
    imgInput.addEventListener('input', () => {
      const url = imgInput.value.trim();
      imgPreview.innerHTML = url
        ? `<img src="${url}" alt="preview" onerror="this.parentElement.innerHTML='<span>${t('adm.toast.invalid.url')}</span>'">`
        : `<span>${t('adm.f.preview.ph')}</span>`;
    });

    // Category → subcategory options
    const catSel    = document.getElementById('pf_cat');
    const subcatSel = document.getElementById('pf_subcat');
    catSel.addEventListener('change', () => {
      const cats = Store.getCategories();
      const cat  = cats.find(c => c.id === catSel.value);
      if (cat?.subcategories?.length) {
        subcatSel.innerHTML = `<option value="">${t('adm.f.sel.subcat')}</option>` +
          cat.subcategories.map(s =>
            `<option value="${s.id}">${Store.getSubcatName(s, lang())}</option>`
          ).join('');
      } else {
        subcatSel.innerHTML = `<option value="">${t('adm.f.no.subcat')}</option>`;
      }
    });

    document.getElementById('pfClose').addEventListener('click', closePF);
    document.getElementById('pfCancel').addEventListener('click', closePF);
    productFormOverlay.addEventListener('click', e => { if (e.target === productFormOverlay) closePF(); });

    document.getElementById('pfSave').addEventListener('click', () => {
      const name     = document.getElementById('pf_name').value.trim();
      const name_ar  = document.getElementById('pf_name_ar').value.trim();
      const price    = parseFloat(document.getElementById('pf_price').value);
      const origPrice= parseFloat(document.getElementById('pf_origprice').value) || null;
      const cat      = document.getElementById('pf_cat').value;
      const subcat   = document.getElementById('pf_subcat').value;
      const img      = document.getElementById('pf_img').value.trim();
      const badgeType= document.getElementById('pf_badge').value;
      const rating   = parseFloat(document.getElementById('pf_rating').value) || 4.5;
      const reviews  = parseInt(document.getElementById('pf_reviews').value) || 0;
      const inStock  = document.getElementById('pf_instock').checked;
      const featured = document.getElementById('pf_featured').checked;
      const desc     = document.getElementById('pf_desc').value.trim();
      const desc_ar  = document.getElementById('pf_desc_ar').value.trim();

      if (!name || !price || !cat || !img) {
        showToast('error', t('adm.toast.required')); return;
      }

      const badgeMap = { sale: 'Sale', new: 'New', trending: 'Trending' };
      const products = Store.getProducts();

      if (p) {
        const idx = products.findIndex(x => x.id === p.id);
        products[idx] = {
          ...products[idx],
          name, name_ar, price, originalPrice: origPrice,
          category: cat, subcategory: subcat,
          image: img,
          badge: badgeMap[badgeType] || null, badgeType: badgeType || null,
          rating, reviews, inStock, featured,
          description: desc, description_ar: desc_ar,
        };
        showToast('success', `✅ "${name_ar || name}" — ${t('adm.toast.prod.updated')}`);
      } else {
        products.push({
          id: 'prod_' + Date.now(),
          name, name_ar, price, originalPrice: origPrice,
          category: cat, subcategory: subcat,
          image: img,
          badge: badgeMap[badgeType] || null, badgeType: badgeType || null,
          rating, reviews, inStock, featured,
          description: desc, description_ar: desc_ar,
        });
        showToast('success', `✅ "${name_ar || name}" — ${t('adm.toast.prod.added')}`);
      }

      Store.saveProducts(products);
      closePF();
      renderProducts();
      renderDashboard();
    });
  }

  function closePF() {
    productFormOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { productFormOverlay.innerHTML = ''; }, 300);
  }

  // ── Categories ────────────────────────────────────────────────────────────
  let selectedCatId = null;

  function renderCategories() {
    const cats     = Store.getCategories();
    const products = Store.getProducts();
    const catList  = document.getElementById('catList');

    catList.innerHTML = cats.map(c => {
      const count = products.filter(p => p.category === c.id).length;
      const name  = Store.getCategoryName(c, lang());
      return `
        <div class="cat-item${selectedCatId === c.id ? ' active' : ''}" data-cat="${c.id}">
          <span class="cat-item-icon">${c.icon}</span>
          <span class="cat-item-name">${name}</span>
          <span class="cat-item-count">${count}</span>
          <div class="cat-item-actions">
            <button class="cat-action-btn edit edit-cat-btn" data-id="${c.id}" title="${t('adm.edit.btn')}">✏️</button>
            <button class="cat-action-btn delete delete-cat-btn" data-id="${c.id}" title="${t('adm.delete.btn')}">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    renderSubcatList(selectedCatId);

    catList.querySelectorAll('.cat-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.cat-item-actions')) return;
        selectedCatId = item.dataset.cat;
        renderCategories();
      });
    });
    catList.querySelectorAll('.edit-cat-btn').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); openCatForm(btn.dataset.id); }));
    catList.querySelectorAll('.delete-cat-btn').forEach(btn =>
      btn.addEventListener('click', e => { e.stopPropagation(); confirmDelete('category', btn.dataset.id); }));
  }

  function renderSubcatList(catId) {
    const cats    = Store.getCategories();
    const cat     = cats.find(c => c.id === catId);
    const panel   = document.getElementById('subcatPanel');
    const title   = document.getElementById('subcatPanelTitle');
    const addBtn  = document.getElementById('addSubcatBtn');
    const list    = panel.querySelector('.subcat-list');

    if (!cat) {
      title.textContent   = t('adm.subcats.title');
      addBtn.style.display = 'none';
      list.innerHTML = `
        <div class="empty-state" style="padding:40px 20px">
          <div class="empty-icon" style="font-size:40px">${lang() === 'ar' ? '👈' : '👈'}</div>
          <p style="font-size:14px">${t('adm.sel.subcat.hint')}</p>
        </div>`;
      return;
    }

    addBtn.style.display = '';
    title.textContent = `${cat.icon} ${Store.getCategoryName(cat, lang())}`;

    if (!cat.subcategories?.length) {
      list.innerHTML = `
        <div class="empty-state" style="padding:32px 20px">
          <div class="empty-icon" style="font-size:40px">📂</div>
          <p style="font-size:14px">${lang() === 'ar' ? 'لا توجد فئات فرعية. أضف واحدة!' : 'No subcategories yet. Add one!'}</p>
        </div>`;
      return;
    }

    list.innerHTML = cat.subcategories.map(s => `
      <div class="subcat-item" data-subcat="${s.id}">
        <span class="subcat-dot"></span>
        <span>${Store.getSubcatName(s, lang())}</span>
        <div class="subcat-item-actions">
          <button class="cat-action-btn edit edit-subcat-btn" data-catid="${cat.id}" data-id="${s.id}">✏️</button>
          <button class="cat-action-btn delete delete-subcat-btn" data-catid="${cat.id}" data-id="${s.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.edit-subcat-btn').forEach(btn =>
      btn.addEventListener('click', () => openSubcatForm(btn.dataset.catid, btn.dataset.id)));
    list.querySelectorAll('.delete-subcat-btn').forEach(btn =>
      btn.addEventListener('click', () => confirmDelete('subcategory', btn.dataset.id, btn.dataset.catid)));
  }

  document.getElementById('addCatBtn').addEventListener('click', () => openCatForm(null));
  document.getElementById('addSubcatBtn').addEventListener('click', () => openSubcatForm(selectedCatId, null));

  // ── Category Form ─────────────────────────────────────────────────────────
  const catFormOverlay = document.getElementById('catFormOverlay');

  function openCatForm(catId) {
    const cats = Store.getCategories();
    const cat  = catId ? cats.find(c => c.id === catId) : null;

    catFormOverlay.innerHTML = `
      <div class="form-modal" style="max-width:520px">
        <div class="form-header">
          <h2 class="form-title">${cat ? t('adm.edit.cat.title') : t('adm.add.cat.title')}</h2>
          <button class="form-close" id="cfClose">✕</button>
        </div>
        <div class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.cat.name')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="cf_name" dir="ltr"
                placeholder="${t('adm.cat.name.ph')}" value="${cat?.name || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.cat.name.ar')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="cf_name_ar" dir="rtl"
                placeholder="${t('adm.cat.name.ar.ph')}" value="${cat?.name_ar || ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.cat.icon')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="cf_icon"
                placeholder="💎" value="${cat?.icon || ''}" maxlength="4">
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.cat.slug')}</label>
              <input type="text" class="form-input" id="cf_slug" dir="ltr"
                placeholder="auto" value="${cat?.slug || ''}">
            </div>
          </div>
        </div>
        <div class="form-footer">
          <button class="btn btn-outline" id="cfCancel">${t('adm.cancel')}</button>
          <button class="btn btn-primary" id="cfSave">${cat ? t('adm.save') : t('adm.add.cat.title').replace('➕ ','')}</button>
        </div>
      </div>
    `;

    catFormOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const nameInput = document.getElementById('cf_name');
    const slugInput = document.getElementById('cf_slug');
    nameInput.addEventListener('input', () => {
      if (!slugInput.value || slugInput.dataset.autoset === 'true') {
        slugInput.value = nameInput.value.toLowerCase().replace(/\s+/g, '-');
        slugInput.dataset.autoset = 'true';
      }
    });

    document.getElementById('cfClose').addEventListener('click', closeCF);
    document.getElementById('cfCancel').addEventListener('click', closeCF);
    catFormOverlay.addEventListener('click', e => { if (e.target === catFormOverlay) closeCF(); });

    document.getElementById('cfSave').addEventListener('click', () => {
      const name    = document.getElementById('cf_name').value.trim();
      const name_ar = document.getElementById('cf_name_ar').value.trim();
      const icon    = document.getElementById('cf_icon').value.trim();
      const slug    = document.getElementById('cf_slug').value.trim() || name.toLowerCase().replace(/\s+/g, '-');
      if (!name || !icon) { showToast('error', t('adm.toast.required')); return; }

      const cats = Store.getCategories();
      if (cat) {
        const idx = cats.findIndex(c => c.id === cat.id);
        cats[idx] = { ...cats[idx], name, name_ar, icon, slug };
        showToast('success', t('adm.toast.cat.updated'));
      } else {
        cats.push({ id: 'cat_' + Date.now(), name, name_ar, icon, slug, subcategories: [] });
        showToast('success', t('adm.toast.cat.added'));
      }
      Store.saveCategories(cats);
      closeCF(); renderCategories();
    });
  }

  function closeCF() {
    catFormOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { catFormOverlay.innerHTML = ''; }, 300);
  }

  // ── Subcategory Form ──────────────────────────────────────────────────────
  function openSubcatForm(catId, subcatId) {
    const cats   = Store.getCategories();
    const cat    = cats.find(c => c.id === catId);
    const subcat = subcatId ? cat?.subcategories?.find(s => s.id === subcatId) : null;

    catFormOverlay.innerHTML = `
      <div class="form-modal" style="max-width:520px">
        <div class="form-header">
          <h2 class="form-title">${subcat ? t('adm.edit.subcat.title') : t('adm.add.subcat.title')}</h2>
          <button class="form-close" id="scfClose">✕</button>
        </div>
        <div class="form-body">
          <div class="form-group">
            <label class="form-label">${t('adm.parent.cat')}</label>
            <input type="text" class="form-input"
              value="${cat ? cat.icon + ' ' + Store.getCategoryName(cat, lang()) : ''}" disabled style="opacity:0.6">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('adm.subcat.name')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="scf_name" dir="ltr"
                placeholder="${t('adm.subcat.name.ph')}" value="${subcat?.name || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">${t('adm.subcat.name.ar')} <span class="required">*</span></label>
              <input type="text" class="form-input" id="scf_name_ar" dir="rtl"
                placeholder="${t('adm.subcat.name.ph')}" value="${subcat?.name_ar || ''}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('adm.cat.slug')}</label>
            <input type="text" class="form-input" id="scf_slug" dir="ltr"
              placeholder="auto" value="${subcat?.slug || ''}">
          </div>
        </div>
        <div class="form-footer">
          <button class="btn btn-outline" id="scfCancel">${t('adm.cancel')}</button>
          <button class="btn btn-primary" id="scfSave">${subcat ? t('adm.save') : t('adm.add.subcat.title').replace('➕ ','')}</button>
        </div>
      </div>
    `;

    catFormOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const nameInput = document.getElementById('scf_name');
    const slugInput = document.getElementById('scf_slug');
    nameInput.addEventListener('input', () => {
      if (!slugInput.value || slugInput.dataset.autoset === 'true') {
        slugInput.value = nameInput.value.toLowerCase().replace(/\s+/g, '-');
        slugInput.dataset.autoset = 'true';
      }
    });

    document.getElementById('scfClose').addEventListener('click', closeCF);
    document.getElementById('scfCancel').addEventListener('click', closeCF);
    catFormOverlay.addEventListener('click', e => { if (e.target === catFormOverlay) closeCF(); });

    document.getElementById('scfSave').addEventListener('click', () => {
      const name    = document.getElementById('scf_name').value.trim();
      const name_ar = document.getElementById('scf_name_ar').value.trim();
      const slug    = document.getElementById('scf_slug').value.trim() || name.toLowerCase().replace(/\s+/g, '-');
      if (!name) { showToast('error', t('adm.toast.required')); return; }

      const cats   = Store.getCategories();
      const catIdx = cats.findIndex(c => c.id === catId);
      if (subcat) {
        const subIdx = cats[catIdx].subcategories.findIndex(s => s.id === subcatId);
        cats[catIdx].subcategories[subIdx] = { ...cats[catIdx].subcategories[subIdx], name, name_ar, slug };
        showToast('success', t('adm.toast.sub.updated'));
      } else {
        cats[catIdx].subcategories.push({ id: 'sub_' + Date.now(), name, name_ar, slug });
        showToast('success', t('adm.toast.sub.added'));
      }
      Store.saveCategories(cats);
      closeCF(); renderCategories();
    });
  }

  // ── Confirm Delete ────────────────────────────────────────────────────────
  const confirmOverlay = document.getElementById('confirmOverlay');
  let pendingDelete = null;

  function confirmDelete(type, id, parentId = null) {
    const msgKeys = {
      product:     'adm.del.product.msg',
      category:    'adm.del.cat.msg',
      subcategory: 'adm.del.subcat.msg',
    };
    pendingDelete = { type, id, parentId };
    document.getElementById('confirmTitle').textContent   = t('adm.del.title');
    document.getElementById('confirmMessage').textContent = t(msgKeys[type]);
    document.getElementById('confirmNo').textContent      = t('adm.del.no');
    document.getElementById('confirmYes').textContent     = t('adm.del.yes');
    confirmOverlay.classList.add('open');
  }

  document.getElementById('confirmNo').addEventListener('click', () => {
    confirmOverlay.classList.remove('open'); pendingDelete = null;
  });

  document.getElementById('confirmYes').addEventListener('click', () => {
    if (!pendingDelete) return;
    const { type, id, parentId } = pendingDelete;

    if (type === 'product') {
      Store.saveProducts(Store.getProducts().filter(p => p.id !== id));
      renderProducts(); renderDashboard();
      showToast('success', t('adm.toast.prod.deleted'));
    } else if (type === 'category') {
      Store.saveCategories(Store.getCategories().filter(c => c.id !== id));
      if (selectedCatId === id) selectedCatId = null;
      renderCategories();
      showToast('success', t('adm.toast.cat.deleted'));
    } else if (type === 'subcategory') {
      const cats   = Store.getCategories();
      const catIdx = cats.findIndex(c => c.id === parentId);
      cats[catIdx].subcategories = cats[catIdx].subcategories.filter(s => s.id !== id);
      Store.saveCategories(cats);
      renderCategories();
      showToast('success', t('adm.toast.sub.deleted'));
    }

    confirmOverlay.classList.remove('open');
    pendingDelete = null;
  });

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3500);
  }

  // ── Keyboard ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePF(); closeCF();
      confirmOverlay.classList.remove('open');
    }
  });

  // ══════════════════════════════════════════════════════════════════
  // NEW FEATURES — Phase 3
  // ══════════════════════════════════════════════════════════════════

  // ── Extend navigation to new pages ───────────────────────────────
  const pageExtras = {
    'page-promotions' : ['adm.promotions', 'adm.tools'],
    'page-activity'   : ['adm.activity',   'adm.tools'],
    'page-settings'   : ['adm.settings',   'adm.tools'],
  };
  Object.assign(
    // Monkey-patch showPage to handle new pages
    {}, // no-op placeholder — we wire event listeners below
  );
  document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    const pid = link.dataset.page;
    if (pageExtras[pid]) {
      link.addEventListener('click', () => {
        document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.sidebar-link[data-page]').forEach(l => l.classList.remove('active'));
        const el = document.getElementById(pid);
        if (el) el.classList.add('active');
        link.classList.add('active');
        const [tk, sk] = pageExtras[pid];
        document.getElementById('topbarTitle').textContent = t(tk);
        document.getElementById('topbarSub').textContent   = t(sk);
        if (pid === 'page-promotions') renderPromotionsPage();
        if (pid === 'page-activity')   renderActivityPage();
        if (pid === 'page-settings')   renderSettingsPage();
      });
    }
  });

  // ── Activity Log ─────────────────────────────────────────────────
  function logActivity(type, message) {
    const log = JSON.parse(localStorage.getItem('nova_activity_log') || '[]');
    log.unshift({ type, message, time: Date.now() });
    localStorage.setItem('nova_activity_log', JSON.stringify(log.slice(0, 50)));
  }

  function renderActivityPage() {
    const log = JSON.parse(localStorage.getItem('nova_activity_log') || '[]');
    const el  = document.getElementById('activityLog');
    if (!el) return;
    if (!log.length) { el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text3);">📋 ${lang()==='ar'?'لا يوجد نشاط بعد':'No activity yet'}</div>`; return; }
    el.innerHTML = log.map(entry => {
      const dot  = entry.type === 'delete' ? 'del' : (entry.type === 'edit' ? 'edit' : '');
      const time = new Date(entry.time).toLocaleString(lang() === 'ar' ? 'ar-SA' : 'en-US');
      return `<div class="activity-entry">
        <div class="activity-dot ${dot}"></div>
        <div class="activity-text">${entry.message}</div>
        <div class="activity-time">${time}</div>
      </div>`;
    }).join('');
  }

  document.getElementById('clearActivityBtn')?.addEventListener('click', () => {
    localStorage.removeItem('nova_activity_log');
    renderActivityPage();
  });

  // Patch showToast to also log activity
  const _origShowToast = showToast;
  // We just call logActivity at key action points instead

  // ── Promotions Page ──────────────────────────────────────────────
  function renderPromotionsPage() {
    // Flash sale
    const fs = JSON.parse(localStorage.getItem('nova_flash_sale') || '{}');
    const fsEnd  = document.getElementById('flashSaleEnd');
    const fsAct  = document.getElementById('flashSaleActive');
    if (fsEnd && fs.endTime) fsEnd.value = new Date(fs.endTime).toISOString().slice(0,16);
    if (fsAct) fsAct.checked = !!fs.active;

    // Promo codes
    renderPromoCodes();
  }

  document.getElementById('saveFlashSaleBtn')?.addEventListener('click', () => {
    const endVal = document.getElementById('flashSaleEnd')?.value;
    const active = document.getElementById('flashSaleActive')?.checked;
    const data   = { active, endTime: endVal ? new Date(endVal).toISOString() : null };
    localStorage.setItem('nova_flash_sale', JSON.stringify(data));
    // Dispatch storage event manually for same-tab
    window.dispatchEvent(new StorageEvent('storage', { key: 'nova_flash_sale' }));
    logActivity('edit', lang()==='ar' ? 'تم تحديث إعدادات الفلاش سيل' : 'Flash sale settings updated');
    showToast('success', lang()==='ar' ? '✅ تم حفظ إعدادات الفلاش سيل' : '✅ Flash sale settings saved');
  });

  function renderPromoCodes() {
    const codes  = JSON.parse(localStorage.getItem('nova_promo_codes') || '[{"code":"NOVA10","discount":10,"active":true}]');
    const list   = document.getElementById('promoList');
    if (!list) return;
    list.innerHTML = codes.map((c, i) => `
      <div class="promo-item">
        <span class="promo-code">${c.code}</span>
        <span class="promo-disc">-${c.discount}%</span>
        <button class="btn-icon" style="background:rgba(239,68,68,0.1);color:var(--red);" onclick="deletePromoCode(${i})">🗑️</button>
      </div>`).join('');
    if (!codes.length) list.innerHTML = `<p style="color:var(--text3);font-size:13px;text-align:center;padding:20px;">${lang()==='ar'?'لا توجد أكواد':'No codes yet'}</p>`;
  }

  window.deletePromoCode = function(idx) {
    const codes = JSON.parse(localStorage.getItem('nova_promo_codes') || '[]');
    codes.splice(idx, 1);
    localStorage.setItem('nova_promo_codes', JSON.stringify(codes));
    renderPromoCodes();
  };

  document.getElementById('addPromoBtn')?.addEventListener('click', () => {
    const code = document.getElementById('promoCode')?.value.trim().toUpperCase();
    const disc = parseInt(document.getElementById('promoDiscount')?.value, 10);
    if (!code || !disc || disc < 1 || disc > 100) {
      showToast('error', t('adm.toast.required'));
      return;
    }
    const codes = JSON.parse(localStorage.getItem('nova_promo_codes') || '[]');
    if (codes.find(c => c.code === code)) {
      showToast('error', lang()==='ar' ? '⚠️ الكود موجود بالفعل' : '⚠️ Code already exists');
      return;
    }
    codes.push({ code, discount: disc, active: true });
    localStorage.setItem('nova_promo_codes', JSON.stringify(codes));
    document.getElementById('promoCode').value = '';
    document.getElementById('promoDiscount').value = '';
    renderPromoCodes();
    logActivity('add', lang()==='ar' ? `تمت إضافة كود الخصم: ${code}` : `Promo code added: ${code}`);
    showToast('success', lang()==='ar' ? `✅ تمت إضافة الكود: ${code}` : `✅ Code added: ${code}`);
  });

  // ── Settings Page ─────────────────────────────────────────────────
  function renderSettingsPage() {
    const ms = Auth.getMaintenanceState();
    const ft = JSON.parse(localStorage.getItem('nova_features') || '{}');

    const maintToggle = document.getElementById('settingsMaintToggle');
    const maintMsgEn  = document.getElementById('maintMsgEn');
    const maintMsgAr  = document.getElementById('maintMsgAr');
    const maintBackBy = document.getElementById('maintBackBy');

    if (maintToggle) maintToggle.checked = ms.active;
    if (maintMsgEn)  maintMsgEn.value    = ms.messageEn || '';
    if (maintMsgAr)  maintMsgAr.value    = ms.messageAr || '';
    if (maintBackBy && ms.backBy) maintBackBy.value = new Date(ms.backBy).toISOString().slice(0,16);

    if (document.getElementById('toggleSocialProof')) document.getElementById('toggleSocialProof').checked = ft.social !== false;
    if (document.getElementById('togglePromoPopup'))  document.getElementById('togglePromoPopup').checked  = ft.promo  !== false;
    if (document.getElementById('toggleBundles'))     document.getElementById('toggleBundles').checked     = ft.bundles !== false;

    // Update maintenance badge
    syncMaintBadge();
  }

  function syncMaintBadge() {
    const badge = document.getElementById('maintenanceBadge');
    if (badge) badge.style.display = Auth.isMaintenanceActive() ? 'inline-flex' : 'none';
  }

  // Save maintenance settings
  document.getElementById('saveMaintBtn')?.addEventListener('click', () => {
    const active  = document.getElementById('settingsMaintToggle')?.checked;
    const msgEn   = document.getElementById('maintMsgEn')?.value || 'We\'ll be back soon ✨';
    const msgAr   = document.getElementById('maintMsgAr')?.value || 'نعود قريباً ✨';
    const backBy  = document.getElementById('maintBackBy')?.value;
    Auth.setMaintenanceState({ active, messageEn: msgEn, messageAr: msgAr, backBy: backBy ? new Date(backBy).toISOString() : '' });
    syncMaintBadge();
    logActivity('edit', lang()==='ar' ? `وضع الصيانة: ${active?'مفعّل':'معطّل'}` : `Maintenance mode: ${active?'ON':'OFF'}`);
    showToast('success', lang()==='ar' ? '✅ تم حفظ إعدادات الصيانة' : '✅ Maintenance settings saved');
  });

  // Toggle maintenance on sidebar (maintenance badge click)
  document.getElementById('maintenanceBadge')?.addEventListener('click', () => {
    const isNow = Auth.toggleMaintenance();
    syncMaintBadge();
    showToast('success', isNow
      ? (lang()==='ar' ? '🔴 وضع الصيانة مفعّل' : '🔴 Maintenance ON')
      : (lang()==='ar' ? '🟢 وضع الصيانة أُلغي' : '🟢 Maintenance OFF'));
  });
  syncMaintBadge();

  // Save features toggles
  document.getElementById('saveFeaturesBtn')?.addEventListener('click', () => {
    const ft = {
      social : document.getElementById('toggleSocialProof')?.checked,
      promo  : document.getElementById('togglePromoPopup')?.checked,
      bundles: document.getElementById('toggleBundles')?.checked,
    };
    localStorage.setItem('nova_features', JSON.stringify(ft));
    logActivity('edit', lang()==='ar' ? 'تم تحديث إعدادات الميزات' : 'Feature settings updated');
    showToast('success', lang()==='ar' ? '✅ تم حفظ الإعدادات' : '✅ Settings saved');
  });

  // Change password
  document.getElementById('changePwBtn')?.addEventListener('click', async () => {
    const cur  = document.getElementById('pwCurrent')?.value;
    const nw   = document.getElementById('pwNew')?.value;
    const conf = document.getElementById('pwConfirm')?.value;
    if (!cur || !nw || !conf) { showToast('error', t('adm.toast.required')); return; }
    if (nw !== conf) { showToast('error', lang()==='ar' ? '⚠️ كلمتا المرور لا تتطابقان' : '⚠️ Passwords do not match'); return; }
    if (nw.length < 6) { showToast('error', lang()==='ar' ? '⚠️ كلمة المرور قصيرة جداً (6 أحرف على الأقل)' : '⚠️ Password too short (min 6 chars)'); return; }
    const ok = await Auth.changePassword(cur, nw);
    if (ok) {
      ['pwCurrent','pwNew','pwConfirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      logActivity('edit', lang()==='ar' ? 'تم تغيير كلمة المرور' : 'Password changed');
      showToast('success', lang()==='ar' ? '✅ تم تغيير كلمة المرور' : '✅ Password changed');
    } else {
      showToast('error', lang()==='ar' ? '❌ كلمة المرور الحالية خاطئة' : '❌ Current password is wrong');
    }
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    Auth.endSession();
    location.reload();
  });

  // ── Bulk Operations (product table) ──────────────────────────────
  // We add a checkbox column to the products table when it's rendered.
  // The renderProducts() function already exists — we patch the body.
  // Bulk action bar appears when any checkbox is selected.

  let bulkSelected = new Set();

  // We extend the existing renderProducts to include checkboxes
  const _origRenderProducts = renderProducts; // save ref

  function renderProductsWithBulk() {
    _origRenderProducts();
    // Insert checkbox column into existing table
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const idAttr = row.querySelector('[data-id]');
      const pid    = idAttr?.dataset.id;
      if (!pid) return;
      const td = document.createElement('td');
      td.innerHTML = `<input type="checkbox" class="bulk-cb" data-id="${pid}" ${bulkSelected.has(pid)?'checked':''}>`;
      row.insertBefore(td, row.firstChild);
    });

    // Add header checkbox
    const thead = tbody.closest('table')?.querySelector('thead tr');
    if (thead && !thead.querySelector('.bulk-th')) {
      const th = document.createElement('th');
      th.className = 'bulk-th';
      th.innerHTML = `<input type="checkbox" id="selectAllCb">`;
      thead.insertBefore(th, thead.firstChild);
      document.getElementById('selectAllCb')?.addEventListener('change', e => {
        tbody.querySelectorAll('.bulk-cb').forEach(cb => {
          cb.checked = e.target.checked;
          if (e.target.checked) bulkSelected.add(cb.dataset.id);
          else bulkSelected.delete(cb.dataset.id);
        });
        updateBulkBar();
      });
    }

    tbody.querySelectorAll('.bulk-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) bulkSelected.add(cb.dataset.id);
        else            bulkSelected.delete(cb.dataset.id);
        updateBulkBar();
      });
    });
  }

  function updateBulkBar() {
    let bar = document.getElementById('bulkBar');
    if (bulkSelected.size === 0) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'bulkBar';
      bar.className = 'bulk-bar';
      document.getElementById('page-products')?.prepend(bar);
    }
    const n = bulkSelected.size;
    bar.innerHTML = `
      <span style="font-size:14px;font-weight:600;">${lang()==='ar'?`${n} محدد`:`${n} selected`}</span>
      <button class="btn btn-sm btn-danger" id="bulkDeleteBtn">${lang()==='ar'?'🗑️ حذف المحدد':'🗑️ Delete Selected'}</button>
      <button class="btn btn-sm btn-outline" id="bulkFeaturedBtn">${lang()==='ar'?'⭐ تبديل المميز':'⭐ Toggle Featured'}</button>
      <button class="btn btn-sm btn-outline" id="bulkClearBtn">${lang()==='ar'?'إلغاء':'Clear'}</button>
    `;
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
      const prods = Store.getProducts().filter(p => !bulkSelected.has(p.id));
      Store.saveProducts(prods);
      logActivity('delete', lang()==='ar' ? `تم حذف ${bulkSelected.size} منتج` : `Deleted ${bulkSelected.size} products`);
      bulkSelected.clear();
      renderProductsWithBulk();
      updateBulkBar();
      showToast('success', lang()==='ar' ? '🗑️ تم حذف المنتجات المحددة' : '🗑️ Selected products deleted');
    });
    document.getElementById('bulkFeaturedBtn')?.addEventListener('click', () => {
      const prods = Store.getProducts().map(p => {
        if (bulkSelected.has(p.id)) p.featured = !p.featured;
        return p;
      });
      Store.saveProducts(prods);
      logActivity('edit', lang()==='ar' ? `تم تبديل المميز لـ ${bulkSelected.size} منتج` : `Toggled featured for ${bulkSelected.size} products`);
      bulkSelected.clear();
      renderProductsWithBulk();
      updateBulkBar();
      showToast('success', lang()==='ar' ? '✅ تم تحديث المنتجات' : '✅ Products updated');
    });
    document.getElementById('bulkClearBtn')?.addEventListener('click', () => {
      bulkSelected.clear();
      renderProductsWithBulk();
      updateBulkBar();
    });
  }

  // Override renderProducts call to include bulk
  // (called after DOMContentLoaded setup, we re-render with bulk)
  setTimeout(() => {
    const activeEl = document.querySelector('.admin-page.active');
    if (activeEl?.id === 'page-products') renderProductsWithBulk();
  }, 100);

});

