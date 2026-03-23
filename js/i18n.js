// ─── Nova Accessories — Internationalization (AR default / EN toggle) ────────

// Apply language IMMEDIATELY before DOM loads to prevent layout flash
;(function () {
  const saved = localStorage.getItem('nova_lang') || 'ar';
  const html  = document.documentElement;
  html.lang = saved;
  html.dir  = saved === 'ar' ? 'rtl' : 'ltr';
  html.setAttribute('data-lang', saved);
})();

// ── Translation Dictionary ────────────────────────────────────────────────────
const TRANSLATIONS = {

  /* ═══════════════════════════════════════════════════ ARABIC ═══ */
  ar: {
    // ── Header / Nav
    'nav.home'              : 'الرئيسية',
    'nav.categories'        : 'الفئات',
    'nav.shop'              : 'المتجر',
    'nav.featured'          : 'المميز',
    'nav.admin'             : '⚙️ الإدارة',
    'search.placeholder'    : 'ابحث عن منتجات...',
    'cart.aria'             : 'فتح السلة',

    // ── Hero
    'hero.eyebrow'          : 'مجموعة جديدة 2025',
    'hero.title1'           : 'ارتقِ بأسلوبك',
    'hero.title2'           : 'وقصّتك',
    'hero.desc'             : 'اكتشف إكسسوارات وهدايا مختارة بعناية تتحدث بلغتك. جودة عالية وتصميم عصري — مصنوعة للجريئين والجميلين.',
    'hero.btn.shop'         : 'تسوّق الآن',
    'hero.btn.explore'      : 'استكشف الفئات',
    'hero.stat.products'    : 'منتج',
    'hero.stat.customers'   : 'عميل سعيد',
    'hero.stat.rating'      : 'متوسط التقييم',
    'hero.badge.best'       : '✨ الأكثر مبيعاً',
    'hero.card.name'        : 'قلادة أورورا الكريستالية',
    'hero.card.price'       : '89.99$',

    // ── Marquee
    'mq.quality'            : 'جودة عالية',
    'mq.shipping'           : 'شحن مجاني فوق 75$',
    'mq.returns'            : 'إرجاع خلال 30 يوم',
    'mq.secure'             : 'دفع آمن',
    'mq.customers'          : '+50,000 عميل سعيد',
    'mq.gift'               : 'تغليف هدايا متاح',
    'mq.arrivals'           : 'وصول جديد أسبوعياً',
    'mq.curated'            : 'مجموعات مختارة بعناية',

    // ── Sections
    'sec.explore'           : 'استكشف',
    'sec.cats.title'        : 'تسوّق حسب',
    'sec.cats.highlight'    : 'الفئة',
    'sec.cats.desc'         : 'اعثر على ما تبحث عنه في مجموعاتنا المختارة بعناية',
    'sec.collection'        : 'مجموعتنا',
    'sec.prods.title'       : 'جميع',
    'sec.prods.highlight'   : 'المنتجات',
    'sec.prods.desc'        : 'تصفح مجموعتنا الكاملة من الإكسسوارات والهدايا',
    'sec.reviews'           : 'آراء العملاء',
    'sec.reviews.title'     : 'ماذا يقول',
    'sec.reviews.highlight' : 'عملاؤنا',

    // ── Filter / Shop
    'filter.label'          : 'تصفح:',
    'filter.all'            : 'الكل',
    'btn.manage'            : 'إدارة المنتجات',
    'prod.no.found'         : 'لا توجد منتجات',
    'prod.no.found.sub'     : 'حاول تعديل الفلاتر أو مصطلح البحث',

    // ── Badges
    'badge.sale'            : 'تخفيض',
    'badge.new'             : 'جديد',
    'badge.trending'        : 'رائج',

    // ── Featured Banner
    'feat.title'            : 'أهدِ ما هو استثنائي',
    'feat.desc'             : 'طقم هدايا مختار لكل مناسبة. من أعياد الميلاد إلى الذكرى السنوية — اجعل كل لحظة لا تُنسى.',
    'feat.btn'              : 'تسوّق طقم الهدايا',

    // ── Testimonials
    'rev1.text'             : 'قلادة أورورا الكريستالية رائعة للغاية. الجودة مذهلة مقارنة بالسعر. تلقيت الكثير من الإطراء!',
    'rev1.role'             : 'مشترٍ موثّق ⭐⭐⭐⭐⭐',
    'rev2.text'             : 'شحن سريع وتغليف جميل. حقيبة الظهر الجلدية مطابقة تماماً للوصف — متينة وأنيقة. سأطلب مجدداً!',
    'rev2.role'             : 'مشترٍ موثّق ⭐⭐⭐⭐⭐',
    'rev3.text'             : 'اشتريت طقم الهدايا المخملي لعيد ميلاد صديقتي. كانت مبهورة تماماً. التقديم وحده كان يستحق كل شيء!',
    'rev3.role'             : 'مشترٍ موثّق ⭐⭐⭐⭐⭐',

    // ── Newsletter
    'nl.title'              : 'ابقَ على',
    'nl.highlight'          : 'اطّلاع',
    'nl.desc'               : 'احصل على أول وصول للمنتجات الجديدة والعروض الحصرية ونصائح الستايل.',
    'nl.placeholder'        : 'بريدك الإلكتروني',
    'nl.btn'                : 'اشترك',
    'nl.success'            : '✅ تم الاشتراك!',

    // ── Footer
    'ft.brand.desc'         : 'إكسسوارات وهدايا عالية الجودة للجيل الحديث. مصنوعة باهتمام، مُسلَّمة بحب.',
    'ft.shop'               : 'المتجر',
    'ft.shop.all'           : 'جميع المنتجات',
    'ft.shop.new'           : 'الوصول الجديد',
    'ft.shop.best'          : 'الأكثر مبيعاً',
    'ft.shop.sale'          : 'التخفيضات',
    'ft.shop.gift'          : 'بطاقات الهدايا',
    'ft.help'               : 'المساعدة',
    'ft.help.ship'          : 'معلومات الشحن',
    'ft.help.ret'           : 'الإرجاع',
    'ft.help.order'         : 'حالة الطلب',
    'ft.help.faq'           : 'الأسئلة الشائعة',
    'ft.help.contact'       : 'اتصل بنا',
    'ft.about'              : 'عن نوفا',
    'ft.about.story'        : 'قصتنا',
    'ft.about.sus'          : 'الاستدامة',
    'ft.about.careers'      : 'الوظائف',
    'ft.about.admin'        : 'لوحة الإدارة',
    'ft.about.press'        : 'الصحافة',
    'ft.copy'               : '© 2025 نوفا للإكسسوارات. صُنع بـ ♥ لعشاق الأناقة.',
    'ft.privacy'            : 'الخصوصية',
    'ft.terms'              : 'الشروط',

    // ── Cart
    'cart.title'            : '🛒 سلة التسوق',
    'cart.empty'            : 'سلتك فارغة',
    'cart.empty.sub'        : 'أضف بعض القطع الجميلة!',
    'cart.total'            : 'الإجمالي',
    'cart.checkout'         : 'إتمام الشراء',
    'cart.checkout.soon'    : '🎉 الدفع قريباً! شكراً لتسوّقك مع نوفا.',
    'cart.remove'          : 'حذف',
    'cart.added'            : 'أُضيف للسلة!',

    // ── Product actions
    'prod.add'              : 'أضف',
    'prod.add.cart'         : 'أضف للسلة',
    'prod.qty.add.cart'     : 'أضف للسلة —',

    // ── Wishlist
    'wish.added'            : 'أُضيف للمفضلة!',
    'wish.removed'          : 'أُزيل من المفضلة',

    // ── Modal
    'modal.reviews'         : 'مراجعة',

    // ── Admin — Sidebar
    'adm.main'              : 'الرئيسية',
    'adm.dashboard'         : 'لوحة التحكم',
    'adm.products'          : 'المنتجات',
    'adm.categories'        : 'الفئات',
    'adm.store'             : 'المتجر',
    'adm.view.store'        : 'عرض المتجر',
    'adm.back.store'        : '→ العودة للمتجر',
    'adm.open.store'        : 'فتح المتجر',

    // ── Admin — Topbar subtitles
    'adm.sub.dash'          : 'نظرة عامة على متجرك',
    'adm.sub.prods'         : 'إضافة أو تعديل أو حذف المنتجات',
    'adm.sub.cats'          : 'إدارة الفئات والفئات الفرعية',

    // ── Admin — Stats
    'adm.stat.products'     : 'إجمالي المنتجات',
    'adm.stat.cats'         : 'الفئات',
    'adm.stat.subcats'      : 'الفئات الفرعية',
    'adm.stat.featured'     : 'المنتجات المميزة',
    'adm.stat.active'       : '↑ نشط في المتجر',

    // ── Admin — Dashboard
    'adm.recent'            : 'أحدث المنتجات',
    'adm.view.all'          : 'عرض الكل',
    'adm.quick.add'         : 'إضافة منتج',
    'adm.quick.add.sub'     : 'أدرج منتجاً جديداً في المتجر',
    'adm.quick.cats'        : 'إدارة الفئات',
    'adm.quick.cats.sub'    : 'إضافة أو تعديل الفئات',
    'adm.quick.store'       : 'عرض المتجر',
    'adm.quick.store.sub'   : 'رؤية واجهة المتجر المباشرة',

    // ── Admin — Table headers
    'adm.th.product'        : 'المنتج',
    'adm.th.price'          : 'السعر',
    'adm.th.category'       : 'الفئة',
    'adm.th.badge'          : 'الشارة',
    'adm.th.stock'          : 'المخزون',
    'adm.th.actions'        : 'الإجراءات',

    // ── Admin — Products page
    'adm.search.prod'       : 'بحث عن منتج...',
    'adm.add.product'       : 'إضافة منتج',
    'adm.edit.product'      : '✏️ تعديل المنتج',
    'adm.add.new.product'   : '➕ إضافة منتج جديد',
    'adm.no.products'       : 'لا توجد منتجات',
    'adm.no.products.sub'   : 'أضف أول منتج باستخدام الزر أعلاه.',

    // ── Admin — Product Form labels
    'adm.f.name'            : 'اسم المنتج',
    'adm.f.name.ph'         : 'مثل: قلادة أورورا الكريستالية',
    'adm.f.name.ar'         : 'الاسم بالعربية',
    'adm.f.name.ar.ph'      : 'الاسم بالعربية',
    'adm.f.desc'            : 'الوصف (إنجليزي)',
    'adm.f.desc.ph'         : 'وصف مختصر للمنتج بالإنجليزية...',
    'adm.f.desc.ar'         : 'الوصف (عربي)',
    'adm.f.desc.ar.ph'      : 'وصف مختصر للمنتج بالعربية...',
    'adm.f.price'           : 'السعر ($)',
    'adm.f.orig.price'      : 'السعر الأصلي ($)',
    'adm.f.orig.note'       : '(اختياري — يُظهر التخفيض)',
    'adm.f.category'        : 'الفئة',
    'adm.f.subcategory'     : 'الفئة الفرعية',
    'adm.f.image'           : 'رابط الصورة',
    'adm.f.image.ph'        : 'https://images.unsplash.com/...',
    'adm.f.image.hint'      : 'الصق أي رابط صورة (Unsplash، CDN، إلخ)',
    'adm.f.preview'         : 'معاينة الصورة',
    'adm.f.preview.ph'      : 'ستظهر معاينة الصورة هنا',
    'adm.f.badge'           : 'الشارة',
    'adm.f.rating'          : 'التقييم (0–5)',
    'adm.f.reviews'         : 'عدد المراجعات',
    'adm.f.instock'         : 'متوفر في المخزون',
    'adm.f.featured'        : 'مميز',
    'adm.f.required'        : 'مطلوب',
    'adm.f.none'            : 'لا شيء',
    'adm.f.sel.cat'         : '— اختر فئة —',
    'adm.f.sel.subcat'      : '— اختر فئة فرعية —',
    'adm.f.no.subcat'       : '— لا توجد فئات فرعية —',

    // ── Admin — Categories
    'adm.cats.title'        : '🗂️ الفئات',
    'adm.subcats.title'     : 'الفئات الفرعية',
    'adm.add.cat'           : 'إضافة',
    'adm.edit.cat.title'    : '✏️ تعديل الفئة',
    'adm.add.cat.title'     : '➕ إضافة فئة',
    'adm.cat.name'          : 'اسم الفئة',
    'adm.cat.name.ph'       : 'مثل: مجوهرات',
    'adm.cat.name.ar'       : 'الاسم بالعربية',
    'adm.cat.name.ar.ph'    : 'الاسم بالعربية',
    'adm.cat.icon'          : 'الأيقونة (إيموجي)',
    'adm.cat.slug'          : 'المعرف (Slug)',
    'adm.sel.subcat.hint'   : 'اختر فئة لإدارة فئاتها الفرعية',
    'adm.add.subcat.title'  : '➕ إضافة فئة فرعية',
    'adm.edit.subcat.title' : '✏️ تعديل الفئة الفرعية',
    'adm.parent.cat'        : 'الفئة الأم',
    'adm.subcat.name'       : 'اسم الفئة الفرعية',
    'adm.subcat.name.ph'    : 'مثل: قلائد',
    'adm.subcat.name.ar'    : 'الاسم بالعربية',

    // ── Admin — Buttons
    'adm.save'              : 'حفظ التغييرات',
    'adm.cancel'            : 'إلغاء',
    'adm.edit.btn'          : '✏️ تعديل',
    'adm.delete.btn'        : '🗑️',

    // ── Admin — Stock
    'adm.instock'           : '✓ متوفر',
    'adm.outstock'          : '✗ نفد',

    // ── Admin — Confirm delete
    'adm.del.title'         : 'هل أنت متأكد؟',
    'adm.del.product.msg'   : 'سيتم حذف هذا المنتج نهائياً من المتجر.',
    'adm.del.cat.msg'       : 'سيتم حذف الفئة. ستبقى المنتجات المرتبطة بها لكنها ستفقد فئتها.',
    'adm.del.subcat.msg'    : 'سيتم حذف هذه الفئة الفرعية من الفئة.',
    'adm.del.no'            : 'إلغاء',
    'adm.del.yes'           : 'حذف',

    // ── Admin — Toast
    'adm.toast.prod.added'  : 'تمت إضافة المنتج بنجاح!',
    'adm.toast.prod.updated': 'تم تحديث المنتج بنجاح!',
    'adm.toast.prod.deleted': '🗑️ تم حذف المنتج.',
    'adm.toast.cat.added'   : 'تمت إضافة الفئة بنجاح!',
    'adm.toast.cat.updated' : 'تم تحديث الفئة بنجاح!',
    'adm.toast.cat.deleted' : '🗑️ تم حذف الفئة.',
    'adm.toast.sub.added'   : 'تمت إضافة الفئة الفرعية بنجاح!',
    'adm.toast.sub.updated' : 'تم تحديث الفئة الفرعية بنجاح!',
    'adm.toast.sub.deleted' : '🗑️ تم حذف الفئة الفرعية.',
    'adm.toast.required'    : '⚠️ يرجى ملء جميع الحقول المطلوبة.',
    'adm.toast.invalid.url' : 'رابط غير صالح',

    // ── Lock screen
    'lock.title'            : 'أدخل كلمة المرور',
    'lock.sub'              : 'للوصول إلى لوحة التحكم',
    'lock.enter'            : 'دخول',
    'lock.hint'             : 'كلمة المرور الافتراضية: admin123',

    // ── Admin new sections
    'adm.tools'             : 'الأدوات',
    'adm.promotions'        : 'العروض والأكواد',
    'adm.activity'          : 'سجل النشاط',
    'adm.settings'          : 'الإعدادات',
    'adm.maint.on'          : 'وضع الصيانة مفعّل',
    'adm.maint.title'       : 'وضع الصيانة',
    'adm.maint.toggle'      : 'تفعيل وضع الصيانة',
    'adm.maint.msg.en'      : 'رسالة الصيانة (إنجليزي)',
    'adm.maint.msg.ar'      : 'رسالة الصيانة (عربي)',
    'adm.maint.backby'      : 'وقت العودة (اختياري)',
    'adm.flashsale'         : 'فلاش سيل',
    'adm.flashsale.active'  : 'تفعيل الفلاش سيل',
    'adm.f.sale.end'        : 'تاريخ ووقت انتهاء العرض',
    'adm.promocodes'        : 'أكواد الخصم',
    'adm.f.code'            : 'الكود',
    'adm.f.discount'        : 'الخصم %',
    'adm.add.code'          : 'إضافة كود',
    'adm.features'          : 'الميزات',
    'adm.toggle.social'     : 'الإشعارات الاجتماعية (FOMO)',
    'adm.toggle.promo'      : 'بوب آب الترحيب والخصم',
    'adm.toggle.bundles'    : 'قسم الباقات',
    'adm.change.pw'         : 'تغيير كلمة المرور',
    'adm.pw.current'        : 'كلمة المرور الحالية',
    'adm.pw.new'            : 'كلمة المرور الجديدة',
    'adm.pw.confirm'        : 'تأكيد كلمة المرور',
    'adm.pw.save'           : 'تحديث كلمة المرور',
    'adm.logout'            : 'تسجيل الخروج',
    'adm.logout.sub'        : 'إنهاء الجلسة والعودة لشاشة القفل',
    'adm.logout.btn'        : 'تسجيل الخروج',
    'adm.clear.log'         : 'مسح السجل',

    // ── Flash sale banner
    'flash.ends'            : '⚡ العرض ينتهي خلال:',
    'flash.expired'         : '⚡ انتهى العرض',

    // ── Maintenance overlay (on store)
    'maint.title'           : 'نعود قريباً ✨',
    'maint.sub'             : 'نحن نقوم ببعض التحسينات. شكراً لصبرك!',
    'maint.backby'          : 'نعود في:',
    'maint.pin.title'       : 'وضع الصيانة',
    'maint.pin.placeholder' : 'كلمة المرور',
    'maint.pin.btn'         : 'تفعيل / إلغاء',

    // ── Promo popup
    'promo.title'           : 'مرحباً بك في نوفا! 🎉',
    'promo.desc'            : 'احصل على خصم 10% على أول طلب',
    'promo.copy'            : 'نسخ الكود',
    'promo.copied'          : '✅ تم النسخ!',
    'promo.skip'            : 'لا شكراً',
    'promo.valid'           : 'صالح لطلبك الأول فقط',

    // ── FOMO social proof
    'fomo.time'             : 'منذ قليل',
    'fomo.bought'           : 'اشترى للتو',
    'fomo.viewed'           : 'يشاهد الآن',

    // ── Recently viewed
    'rv.title'              : 'شاهدته مؤخراً',

    // ── Bundle deals
    'bundle.eyebrow'        : 'وفّر أكثر',
    'bundle.title'          : 'باقات',
    'bundle.title2'         : 'وخصومات',
    'bundle.save'           : 'وفّر',
    'bundle.add'            : 'أضف الباقة للسلة',

    // ── Sorting
    'sort.label'            : 'ترتيب:',
    'sort.default'          : 'افتراضي',
    'sort.price.asc'        : 'السعر: الأقل أولاً',
    'sort.price.desc'       : 'السعر: الأعلى أولاً',
    'sort.rating'           : 'الأعلى تقييماً',
    'sort.newest'           : 'الأحدث',

    // ── Filter count
    'filter.showing'        : 'يعرض',
    'filter.of'             : 'من',
    'filter.items'          : 'منتج',

    // ── Nav / wishlist
    'nav.wishlist'          : 'المفضلة',
    'nav.search'            : 'بحث',
    'nav.cart'              : 'السلة',

    // ── Wishlist Page
    'wl.title'              : 'المفضلة',
    'wl.clear'              : 'مسح الكل',
    'wl.move.cart'          : 'أضف للسلة',
    'wl.empty.title'        : 'قائمتك فارغة',
    'wl.empty.sub'          : 'لم تضف أي منتج إلى مفضلتك بعد. تصفح مجموعتنا واضغط على القلب!',
    'wl.empty.cta'          : 'تصفح المنتجات',
    'wl.out.stock'          : 'غير متوفر',
    'wl.toast.added'        : 'تمت إضافته إلى السلة',
    'wl.toast.removed'      : 'تمت إزالته من المفضلة',
    'wl.toast.cleared'      : 'تم مسح المفضلة',
    'wl.confirm.clear'      : 'هل تريد مسح جميع المفضلات؟',
    'footer.rights'         : 'جميع الحقوق محفوظة',
  },

  /* ═══════════════════════════════════════════════════ ENGLISH ═══ */
  en: {
    // ── Header / Nav
    'nav.home'              : 'Home',
    'nav.categories'        : 'Categories',
    'nav.shop'              : 'Shop',
    'nav.featured'          : 'Featured',
    'nav.admin'             : '⚙️ Admin',
    'search.placeholder'    : 'Search products…',
    'cart.aria'             : 'Open cart',

    // ── Hero
    'hero.eyebrow'          : 'New Collection 2025',
    'hero.title1'           : 'Elevate Your',
    'hero.title2'           : 'Style & Story',
    'hero.desc'             : 'Discover handpicked accessories and gifts that speak your language. Premium quality, modern design — crafted for the bold and beautiful.',
    'hero.btn.shop'         : 'Shop Now',
    'hero.btn.explore'      : 'Explore Categories',
    'hero.stat.products'    : 'Products',
    'hero.stat.customers'   : 'Happy Customers',
    'hero.stat.rating'      : 'Average Rating',
    'hero.badge.best'       : '✨ Bestseller',
    'hero.card.name'        : 'Aurora Crystal Necklace',
    'hero.card.price'       : '$89.99',

    // ── Marquee
    'mq.quality'            : 'Premium Quality',
    'mq.shipping'           : 'Free Shipping Over $75',
    'mq.returns'            : '30-Day Returns',
    'mq.secure'             : 'Secure Payments',
    'mq.customers'          : '50,000+ Happy Customers',
    'mq.gift'               : 'Gift Wrapping Available',
    'mq.arrivals'           : 'New Arrivals Weekly',
    'mq.curated'            : 'Handpicked Collections',

    // ── Sections
    'sec.explore'           : 'Explore',
    'sec.cats.title'        : 'Shop by',
    'sec.cats.highlight'    : 'Category',
    'sec.cats.desc'         : 'Find exactly what you\'re looking for across our curated collections',
    'sec.collection'        : 'Collection',
    'sec.prods.title'       : 'All',
    'sec.prods.highlight'   : 'Products',
    'sec.prods.desc'        : 'Browse our full collection of accessories and gifts',
    'sec.reviews'           : 'Reviews',
    'sec.reviews.title'     : 'What Our',
    'sec.reviews.highlight' : 'Customers Say',

    // ── Filter / Shop
    'filter.label'          : 'Browse:',
    'filter.all'            : 'All',
    'btn.manage'            : 'Manage Products',
    'prod.no.found'         : 'No products found',
    'prod.no.found.sub'     : 'Try adjusting your filters or search term',

    // ── Badges
    'badge.sale'            : 'Sale',
    'badge.new'             : 'New',
    'badge.trending'        : 'Trending',

    // ── Featured Banner
    'feat.title'            : 'Gift the Extraordinary',
    'feat.desc'             : 'Handpicked gift sets for every occasion. From birthdays to anniversaries — make every moment unforgettable.',
    'feat.btn'              : 'Shop Gift Sets',

    // ── Testimonials
    'rev1.text'             : 'The Aurora Crystal Necklace is absolutely stunning. The quality is incredible for the price. I\'ve received so many compliments!',
    'rev1.role'             : 'Verified Buyer ⭐⭐⭐⭐⭐',
    'rev2.text'             : 'Fast shipping, beautiful packaging. The Midnight Leather Backpack is exactly as described — sturdy and stylish. Will order again!',
    'rev2.role'             : 'Verified Buyer ⭐⭐⭐⭐⭐',
    'rev3.text'             : 'Got the Velvet Gift Box Set for my girlfriend\'s birthday. She was blown away. The presentation alone was worth it. 10/10!',
    'rev3.role'             : 'Verified Buyer ⭐⭐⭐⭐⭐',

    // ── Newsletter
    'nl.title'              : 'Stay in the',
    'nl.highlight'          : 'Loop',
    'nl.desc'               : 'Get first access to new arrivals, exclusive deals, and style tips.',
    'nl.placeholder'        : 'Your email address',
    'nl.btn'                : 'Subscribe',
    'nl.success'            : '✅ Subscribed!',

    // ── Footer
    'ft.brand.desc'         : 'Premium accessories and gifts for the modern generation. Crafted with care, delivered with love.',
    'ft.shop'               : 'Shop',
    'ft.shop.all'           : 'All Products',
    'ft.shop.new'           : 'New Arrivals',
    'ft.shop.best'          : 'Best Sellers',
    'ft.shop.sale'          : 'Sale',
    'ft.shop.gift'          : 'Gift Cards',
    'ft.help'               : 'Help',
    'ft.help.ship'          : 'Shipping Info',
    'ft.help.ret'           : 'Returns',
    'ft.help.order'         : 'Order Status',
    'ft.help.faq'           : 'FAQ',
    'ft.help.contact'       : 'Contact Us',
    'ft.about'              : 'About',
    'ft.about.story'        : 'Our Story',
    'ft.about.sus'          : 'Sustainability',
    'ft.about.careers'      : 'Careers',
    'ft.about.admin'        : 'Admin Panel',
    'ft.about.press'        : 'Press',
    'ft.copy'               : '© 2025 Nova Accessories. Made with ♥ for style lovers.',
    'ft.privacy'            : 'Privacy',
    'ft.terms'              : 'Terms',

    // ── Cart
    'cart.title'            : '🛒 Your Cart',
    'cart.empty'            : 'Your cart is empty',
    'cart.empty.sub'        : 'Add some beautiful items!',
    'cart.total'            : 'Total',
    'cart.checkout'         : 'Proceed to Checkout',
    'cart.checkout.soon'    : '🎉 Checkout coming soon! Thank you for shopping with Nova.',
    'cart.remove'           : 'Remove',
    'cart.added'            : 'added to cart!',

    // ── Product actions
    'prod.add'              : 'Add',
    'prod.add.cart'         : 'Add to Cart',
    'prod.qty.add.cart'     : 'Add to Cart —',

    // ── Wishlist
    'wish.added'            : 'Added to wishlist!',
    'wish.removed'          : 'Removed from wishlist',

    // ── Modal
    'modal.reviews'         : 'reviews',

    // ── Admin — Sidebar
    'adm.main'              : 'Main',
    'adm.dashboard'         : 'Dashboard',
    'adm.products'          : 'Products',
    'adm.categories'        : 'Categories',
    'adm.store'             : 'Store',
    'adm.view.store'        : 'View Store',
    'adm.back.store'        : '← Back to Store',
    'adm.open.store'        : 'Open Store',

    // ── Admin — Topbar subtitles
    'adm.sub.dash'          : 'Overview of your store',
    'adm.sub.prods'         : 'Add, edit or remove products',
    'adm.sub.cats'          : 'Manage categories & subcategories',

    // ── Admin — Stats
    'adm.stat.products'     : 'Total Products',
    'adm.stat.cats'         : 'Categories',
    'adm.stat.subcats'      : 'Subcategories',
    'adm.stat.featured'     : 'Featured Products',
    'adm.stat.active'       : '↑ Active in store',

    // ── Admin — Dashboard
    'adm.recent'            : 'Recent Products',
    'adm.view.all'          : 'View All',
    'adm.quick.add'         : 'Add Product',
    'adm.quick.add.sub'     : 'List a new item in the store',
    'adm.quick.cats'        : 'Manage Categories',
    'adm.quick.cats.sub'    : 'Add or edit categories',
    'adm.quick.store'       : 'View Store',
    'adm.quick.store.sub'   : 'See the live storefront',

    // ── Admin — Table headers
    'adm.th.product'        : 'Product',
    'adm.th.price'          : 'Price',
    'adm.th.category'       : 'Category',
    'adm.th.badge'          : 'Badge',
    'adm.th.stock'          : 'Stock',
    'adm.th.actions'        : 'Actions',

    // ── Admin — Products page
    'adm.search.prod'       : 'Search products…',
    'adm.add.product'       : 'Add Product',
    'adm.edit.product'      : '✏️ Edit Product',
    'adm.add.new.product'   : '➕ Add New Product',
    'adm.no.products'       : 'No products found',
    'adm.no.products.sub'   : 'Add your first product using the button above.',

    // ── Admin — Product Form labels
    'adm.f.name'            : 'Product Name',
    'adm.f.name.ph'         : 'e.g. Aurora Crystal Necklace',
    'adm.f.name.ar'         : 'Arabic Name',
    'adm.f.name.ar.ph'      : 'Name in Arabic',
    'adm.f.desc'            : 'Description (English)',
    'adm.f.desc.ph'         : 'Brief product description…',
    'adm.f.desc.ar'         : 'Description (Arabic)',
    'adm.f.desc.ar.ph'      : 'Description in Arabic…',
    'adm.f.price'           : 'Price ($)',
    'adm.f.orig.price'      : 'Original Price ($)',
    'adm.f.orig.note'       : '(optional — shows sale)',
    'adm.f.category'        : 'Category',
    'adm.f.subcategory'     : 'Subcategory',
    'adm.f.image'           : 'Image URL',
    'adm.f.image.ph'        : 'https://images.unsplash.com/…',
    'adm.f.image.hint'      : 'Paste any image URL (Unsplash, CDN, etc.)',
    'adm.f.preview'         : 'Preview',
    'adm.f.preview.ph'      : 'Image preview will appear here',
    'adm.f.badge'           : 'Badge',
    'adm.f.rating'          : 'Rating (0–5)',
    'adm.f.reviews'         : 'Review Count',
    'adm.f.instock'         : 'In Stock',
    'adm.f.featured'        : 'Featured',
    'adm.f.required'        : 'required',
    'adm.f.none'            : 'None',
    'adm.f.sel.cat'         : '— Select category —',
    'adm.f.sel.subcat'      : '— Select subcategory —',
    'adm.f.no.subcat'       : '— No subcategories —',

    // ── Admin — Categories
    'adm.cats.title'        : '🗂️ Categories',
    'adm.subcats.title'     : 'Subcategories',
    'adm.add.cat'           : 'Add',
    'adm.edit.cat.title'    : '✏️ Edit Category',
    'adm.add.cat.title'     : '➕ Add Category',
    'adm.cat.name'          : 'Category Name',
    'adm.cat.name.ph'       : 'e.g. Jewelry',
    'adm.cat.name.ar'       : 'Arabic Name',
    'adm.cat.name.ar.ph'    : 'Name in Arabic',
    'adm.cat.icon'          : 'Icon (Emoji)',
    'adm.cat.slug'          : 'Slug (URL identifier)',
    'adm.sel.subcat.hint'   : 'Select a category to manage its subcategories',
    'adm.add.subcat.title'  : '➕ Add Subcategory',
    'adm.edit.subcat.title' : '✏️ Edit Subcategory',
    'adm.parent.cat'        : 'Parent Category',
    'adm.subcat.name'       : 'Subcategory Name',
    'adm.subcat.name.ph'    : 'e.g. Necklaces',
    'adm.subcat.name.ar'    : 'Arabic Name',

    // ── Admin — Buttons
    'adm.save'              : 'Save Changes',
    'adm.cancel'            : 'Cancel',
    'adm.edit.btn'          : '✏️ Edit',
    'adm.delete.btn'        : '🗑️',

    // ── Admin — Stock
    'adm.instock'           : '✓ In Stock',
    'adm.outstock'          : '✗ Out',

    // ── Admin — Confirm delete
    'adm.del.title'         : 'Are you sure?',
    'adm.del.product.msg'   : 'This product will be permanently removed from the store.',
    'adm.del.cat.msg'       : 'This will delete the category. Products assigned to it will remain but lose their category.',
    'adm.del.subcat.msg'    : 'This subcategory will be removed from the category.',
    'adm.del.no'            : 'Cancel',
    'adm.del.yes'           : 'Delete',

    // ── Admin — Toast
    'adm.toast.prod.added'  : '✅ Product added successfully!',
    'adm.toast.prod.updated': '✅ Product updated successfully!',
    'adm.toast.prod.deleted': '🗑️ Product deleted.',
    'adm.toast.cat.added'   : '✅ Category added!',
    'adm.toast.cat.updated' : '✅ Category updated!',
    'adm.toast.cat.deleted' : '🗑️ Category deleted.',
    'adm.toast.sub.added'   : '✅ Subcategory added!',
    'adm.toast.sub.updated' : '✅ Subcategory updated!',
    'adm.toast.sub.deleted' : '🗑️ Subcategory deleted.',
    'adm.toast.required'    : '⚠️ Please fill in all required fields.',
    'adm.toast.invalid.url' : 'Invalid URL',

    // ── Lock screen
    'lock.title'            : 'Enter Password',
    'lock.sub'              : 'To access the admin panel',
    'lock.enter'            : 'Enter',
    'lock.hint'             : 'Default password: admin123',

    // ── Admin new sections
    'adm.tools'             : 'Tools',
    'adm.promotions'        : 'Promotions & Codes',
    'adm.activity'          : 'Activity Log',
    'adm.settings'          : 'Settings',
    'adm.maint.on'          : 'Maintenance Mode ON',
    'adm.maint.title'       : 'Maintenance Mode',
    'adm.maint.toggle'      : 'Enable Maintenance Mode',
    'adm.maint.msg.en'      : 'Maintenance Message (English)',
    'adm.maint.msg.ar'      : 'Maintenance Message (Arabic)',
    'adm.maint.backby'      : 'Back by (optional)',
    'adm.flashsale'         : 'Flash Sale',
    'adm.flashsale.active'  : 'Enable Flash Sale',
    'adm.f.sale.end'        : 'Sale End Date & Time',
    'adm.promocodes'        : 'Promo Codes',
    'adm.f.code'            : 'Code',
    'adm.f.discount'        : 'Discount %',
    'adm.add.code'          : 'Add Code',
    'adm.features'          : 'Features',
    'adm.toggle.social'     : 'Social Proof Notifications (FOMO)',
    'adm.toggle.promo'      : 'Welcome Discount Popup',
    'adm.toggle.bundles'    : 'Bundle Deals Section',
    'adm.change.pw'         : 'Change Password',
    'adm.pw.current'        : 'Current Password',
    'adm.pw.new'            : 'New Password',
    'adm.pw.confirm'        : 'Confirm Password',
    'adm.pw.save'           : 'Update Password',
    'adm.logout'            : 'Sign Out',
    'adm.logout.sub'        : 'End session and return to lock screen',
    'adm.logout.btn'        : 'Sign Out',
    'adm.clear.log'         : 'Clear Log',

    // ── Flash sale banner
    'flash.ends'            : '⚡ Sale ends in:',
    'flash.expired'         : '⚡ Sale ended',

    // ── Maintenance overlay (on store)
    'maint.title'           : 'We\'ll be back soon ✨',
    'maint.sub'             : 'We\'re making some improvements. Thank you for your patience!',
    'maint.backby'          : 'Back by:',
    'maint.pin.title'       : 'Maintenance Mode',
    'maint.pin.placeholder' : 'Password',
    'maint.pin.btn'         : 'Toggle Maintenance',

    // ── Promo popup
    'promo.title'           : 'Welcome to Nova! 🎉',
    'promo.desc'            : 'Get 10% off your first order',
    'promo.copy'            : 'Copy Code',
    'promo.copied'          : '✅ Copied!',
    'promo.skip'            : 'No thanks',
    'promo.valid'           : 'Valid for your first order only',

    // ── FOMO social proof
    'fomo.time'             : 'just now',
    'fomo.bought'           : 'just bought',
    'fomo.viewed'           : 'is viewing',

    // ── Recently viewed
    'rv.title'              : 'Recently Viewed',

    // ── Bundle deals
    'bundle.eyebrow'        : 'Save More',
    'bundle.title'          : 'Bundle',
    'bundle.title2'         : '& Save',
    'bundle.save'           : 'Save',
    'bundle.add'            : 'Add Bundle to Cart',

    // ── Sorting
    'sort.label'            : 'Sort:',
    'sort.default'          : 'Default',
    'sort.price.asc'        : 'Price: Low to High',
    'sort.price.desc'       : 'Price: High to Low',
    'sort.rating'           : 'Top Rated',
    'sort.newest'           : 'Newest',

    // ── Filter count
    'filter.showing'        : 'Showing',
    'filter.of'             : 'of',
    'filter.items'          : 'products',

    // ── Nav / wishlist
    'nav.wishlist'          : 'Wishlist',
    'nav.search'            : 'Search',
    'nav.cart'              : 'Cart',

    // ── Wishlist Page
    'wl.title'              : 'Wishlist',
    'wl.clear'              : 'Clear All',
    'wl.move.cart'          : 'Add to Cart',
    'wl.empty.title'        : 'Your wishlist is empty',
    'wl.empty.sub'          : "You haven't saved any items yet. Browse our collection and tap the heart!",
    'wl.empty.cta'          : 'Browse Products',
    'wl.out.stock'          : 'Out of Stock',
    'wl.toast.added'        : 'Added to cart',
    'wl.toast.removed'      : 'Removed from wishlist',
    'wl.toast.cleared'      : 'Wishlist cleared',
    'wl.confirm.clear'      : 'Clear all wishlist items?',
    'footer.rights'         : 'All rights reserved',
  },
};

// ── I18N Engine ───────────────────────────────────────────────────────────────
const I18N = {
  currentLang: localStorage.getItem('nova_lang') || 'ar',

  t(key) {
    return TRANSLATIONS[this.currentLang]?.[key]
        ?? TRANSLATIONS['en']?.[key]
        ?? key;
  },

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('nova_lang', lang);
    const html = document.documentElement;
    html.lang = lang;
    html.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    html.setAttribute('data-lang', lang);
    this._applyStatic();
    this._syncToggle();
    document.dispatchEvent(new CustomEvent('nova:langchange', { detail: { lang } }));
  },

  _applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.dataset.i18nTitle);
    });
  },

  _syncToggle() {
    const ar = document.getElementById('langAr');
    const en = document.getElementById('langEn');
    if (ar) ar.classList.toggle('active', this.currentLang === 'ar');
    if (en) en.classList.toggle('active', this.currentLang === 'en');
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this._applyStatic();
      this._syncToggle();
    });
  },
};

I18N.init();
