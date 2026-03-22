// ─── Nova Accessories — Shared Data Layer (Bilingual) ───────────────────────

const STORAGE_KEYS = {
  CATEGORIES: 'nova_categories',
  PRODUCTS:   'nova_products',
  CART:       'nova_cart',
};

const DEFAULT_CATEGORIES = [
  {
    id: 'cat_jewelry',
    name: 'Jewelry',       name_ar: 'مجوهرات',
    slug: 'jewelry',       icon: '💎',
    subcategories: [
      { id: 'sub_necklaces', name: 'Necklaces',  name_ar: 'قلائد',          slug: 'necklaces' },
      { id: 'sub_bracelets', name: 'Bracelets',  name_ar: 'أساور',          slug: 'bracelets' },
      { id: 'sub_earrings',  name: 'Earrings',   name_ar: 'أقراط',          slug: 'earrings'  },
      { id: 'sub_rings',     name: 'Rings',      name_ar: 'خواتم',          slug: 'rings'     },
    ],
  },
  {
    id: 'cat_bags',
    name: 'Bags',           name_ar: 'حقائب',
    slug: 'bags',           icon: '👜',
    subcategories: [
      { id: 'sub_handbags',  name: 'Handbags',   name_ar: 'حقائب يد',       slug: 'handbags'  },
      { id: 'sub_backpacks', name: 'Backpacks',  name_ar: 'حقائب ظهر',      slug: 'backpacks' },
      { id: 'sub_clutches',  name: 'Clutches',   name_ar: 'حقائب صغيرة',    slug: 'clutches'  },
      { id: 'sub_wallets',   name: 'Wallets',    name_ar: 'محافظ',          slug: 'wallets'   },
    ],
  },
  {
    id: 'cat_watches',
    name: 'Watches',        name_ar: 'ساعات',
    slug: 'watches',        icon: '⌚',
    subcategories: [
      { id: 'sub_luxury',    name: 'Luxury',     name_ar: 'فاخرة',          slug: 'luxury'    },
      { id: 'sub_smart',     name: 'Smart',      name_ar: 'ذكية',           slug: 'smart'     },
      { id: 'sub_casual',    name: 'Casual',     name_ar: 'كاجوال',         slug: 'casual'    },
    ],
  },
  {
    id: 'cat_sunglasses',
    name: 'Sunglasses',     name_ar: 'نظارات شمسية',
    slug: 'sunglasses',     icon: '🕶️',
    subcategories: [
      { id: 'sub_aviator',   name: 'Aviator',    name_ar: 'أفياتور',        slug: 'aviator'   },
      { id: 'sub_round',     name: 'Round',      name_ar: 'دائرية',         slug: 'round'     },
      { id: 'sub_wayfarer',  name: 'Wayfarer',   name_ar: 'وايفيرر',        slug: 'wayfarer'  },
    ],
  },
  {
    id: 'cat_gifts',
    name: 'Gifts',          name_ar: 'هدايا',
    slug: 'gifts',          icon: '🎁',
    subcategories: [
      { id: 'sub_giftsets',    name: 'Gift Sets',    name_ar: 'طقم هدايا',   slug: 'gift-sets'    },
      { id: 'sub_personalized',name: 'Personalized', name_ar: 'مخصصة',      slug: 'personalized' },
      { id: 'sub_seasonal',    name: 'Seasonal',     name_ar: 'موسمية',      slug: 'seasonal'     },
    ],
  },
  {
    id: 'cat_hats',
    name: 'Hats & Caps',    name_ar: 'قبعات وكاب',
    slug: 'hats',           icon: '🧢',
    subcategories: [
      { id: 'sub_caps',      name: 'Caps',       name_ar: 'كاب',            slug: 'caps'      },
      { id: 'sub_beanies',   name: 'Beanies',    name_ar: 'قبعات صوف',      slug: 'beanies'   },
      { id: 'sub_fedoras',   name: 'Fedoras',    name_ar: 'فيدورا',         slug: 'fedoras'   },
    ],
  },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_001',
    name:        'Aurora Crystal Necklace',
    name_ar:     'قلادة أورورا الكريستالية',
    price:        89.99,
    originalPrice: 129.99,
    category:    'cat_jewelry',
    subcategory: 'sub_necklaces',
    description: 'Handcrafted with Swarovski crystals, this necklace catches the light beautifully.',
    description_ar: 'مصنوعة يدوياً بكريستالات سواروفسكي، تعكس هذه القلادة الضوء بأسلوب رائع.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    badge: 'Sale', badgeType: 'sale', rating: 4.8, reviews: 124, inStock: true, featured: true,
  },
  {
    id: 'prod_002',
    name:        'Midnight Leather Backpack',
    name_ar:     'حقيبة ظهر جلدية ميدنايت',
    price:        149.99,
    originalPrice: null,
    category:    'cat_bags',
    subcategory: 'sub_backpacks',
    description: 'Premium Italian leather backpack with anti-theft hidden pockets.',
    description_ar: 'حقيبة ظهر من الجلد الإيطالي الفاخر مع جيوب خفية مضادة للسرقة.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    badge: 'New', badgeType: 'new', rating: 4.9, reviews: 87, inStock: true, featured: true,
  },
  {
    id: 'prod_003',
    name:        'Noir Chronograph Watch',
    name_ar:     'ساعة نوار الكرونوغراف',
    price:        299.99,
    originalPrice: 399.99,
    category:    'cat_watches',
    subcategory: 'sub_luxury',
    description: 'Swiss movement, sapphire crystal glass, water resistant to 100m.',
    description_ar: 'حركة سويسرية، زجاج ياقوت، مقاومة للماء حتى 100 متر.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    badge: 'Sale', badgeType: 'sale', rating: 4.7, reviews: 203, inStock: true, featured: true,
  },
  {
    id: 'prod_004',
    name:        'Rose Gold Stud Earrings',
    name_ar:     'أقراط روز غولد',
    price:        54.99,
    originalPrice: null,
    category:    'cat_jewelry',
    subcategory: 'sub_earrings',
    description: '18k rose gold plated with cubic zirconia stones.',
    description_ar: 'مطلية بالذهب الوردي عيار 18 قيراط مع حجارة زركونيا مكعبة.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    badge: null, badgeType: null, rating: 4.6, reviews: 56, inStock: true, featured: false,
  },
  {
    id: 'prod_005',
    name:        'Retro Aviator Sunglasses',
    name_ar:     'نظارة أفياتور ريترو',
    price:        79.99,
    originalPrice: null,
    category:    'cat_sunglasses',
    subcategory: 'sub_aviator',
    description: 'UV400 polarized lenses in a classic gold metal frame.',
    description_ar: 'عدسات مستقطبة UV400 في إطار معدني ذهبي كلاسيكي.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    badge: 'Trending', badgeType: 'trending', rating: 4.5, reviews: 143, inStock: true, featured: true,
  },
  {
    id: 'prod_006',
    name:        'Velvet Gift Box Set',
    name_ar:     'طقم هدايا مخملي فاخر',
    price:        119.99,
    originalPrice: 159.99,
    category:    'cat_gifts',
    subcategory: 'sub_giftsets',
    description: 'Curated set including bracelet, earrings and necklace in a luxury velvet box.',
    description_ar: 'طقم مختار يتضمن سوار وأقراط وقلادة في علبة مخملية فاخرة.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    badge: 'Sale', badgeType: 'sale', rating: 4.9, reviews: 312, inStock: true, featured: true,
  },
  {
    id: 'prod_007',
    name:        'Vintage Leather Handbag',
    name_ar:     'حقيبة يد جلدية عتيقة',
    price:        189.99,
    originalPrice: null,
    category:    'cat_bags',
    subcategory: 'sub_handbags',
    description: 'Hand-stitched genuine leather with brass hardware.',
    description_ar: 'مخيطة يدوياً من الجلد الطبيعي مع إطار نحاسي.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    badge: 'New', badgeType: 'new', rating: 4.8, reviews: 78, inStock: true, featured: false,
  },
  {
    id: 'prod_008',
    name:        'Diamond Tennis Bracelet',
    name_ar:     'سوار تنس الماسي',
    price:        249.99,
    originalPrice: 349.99,
    category:    'cat_jewelry',
    subcategory: 'sub_bracelets',
    description: 'Sterling silver with lab-grown diamond accents.',
    description_ar: 'فضة إسترلينية مع تفاصيل ألماس مزروعة في المختبر.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    badge: 'Sale', badgeType: 'sale', rating: 4.9, reviews: 165, inStock: true, featured: true,
  },
  {
    id: 'prod_009',
    name:        'Urban Snapback Cap',
    name_ar:     'قبعة سناب باك عصرية',
    price:        39.99,
    originalPrice: null,
    category:    'cat_hats',
    subcategory: 'sub_caps',
    description: 'Embroidered logo, adjustable snapback closure. 100% cotton.',
    description_ar: 'شعار مطرز، إغلاق سناب باك قابل للتعديل. قطن 100%.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    badge: 'Trending', badgeType: 'trending', rating: 4.4, reviews: 92, inStock: true, featured: false,
  },
  {
    id: 'prod_010',
    name:        'Smart Fitness Watch',
    name_ar:     'ساعة ذكية للياقة البدنية',
    price:        199.99,
    originalPrice: 249.99,
    category:    'cat_watches',
    subcategory: 'sub_smart',
    description: 'Health tracking, GPS, AMOLED display, 7-day battery life.',
    description_ar: 'تتبع الصحة، GPS، شاشة AMOLED، بطارية تدوم 7 أيام.',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=80',
    badge: 'Sale', badgeType: 'sale', rating: 4.7, reviews: 438, inStock: true, featured: true,
  },
  {
    id: 'prod_011',
    name:        'Personalized Name Ring',
    name_ar:     'خاتم باسم مخصص',
    price:        69.99,
    originalPrice: null,
    category:    'cat_gifts',
    subcategory: 'sub_personalized',
    description: 'Custom engraved name or message in sterling silver.',
    description_ar: 'نقش مخصص باسم أو رسالة من الفضة الإسترلينية.',
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&q=80',
    badge: 'New', badgeType: 'new', rating: 4.8, reviews: 221, inStock: true, featured: true,
  },
  {
    id: 'prod_012',
    name:        'Round Tortoise Sunglasses',
    name_ar:     'نظارة دائرية بإطار السلحفاة',
    price:        64.99,
    originalPrice: null,
    category:    'cat_sunglasses',
    subcategory: 'sub_round',
    description: 'Acetate frames with gradient lenses. Timeless style.',
    description_ar: 'إطارات أسيتات مع عدسات متدرجة. أسلوب خالد الجمال.',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    badge: null, badgeType: null, rating: 4.5, reviews: 67, inStock: true, featured: false,
  },
];

// ─── Storage helpers ─────────────────────────────────────────────────────────
const Store = {
  getCategories() {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  },
  saveCategories(cats) { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats)); },

  getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
  },
  saveProducts(prods) { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods)); },

  getCart() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  },
  saveCart(cart) { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); },

  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.qty += qty; else cart.push({ id: productId, qty });
    this.saveCart(cart);
    return cart;
  },
  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart); return cart;
  },
  updateCartQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) item.qty = Math.max(1, qty);
    this.saveCart(cart); return cart;
  },
  getCartTotal() {
    const products = this.getProducts();
    return this.getCart().reduce((sum, item) => {
      const p = products.find(p => p.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  // Helpers for bilingual display
  getProductName(p, lang)  { return (lang === 'ar' && p.name_ar)  ? p.name_ar  : p.name; },
  getProductDesc(p, lang)  { return (lang === 'ar' && p.description_ar) ? p.description_ar : p.description; },
  getCategoryName(c, lang) { return (lang === 'ar' && c.name_ar)  ? c.name_ar  : c.name; },
  getSubcatName(s, lang)   { return (lang === 'ar' && s.name_ar)  ? s.name_ar  : s.name; },

  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) this.saveCategories(DEFAULT_CATEGORIES);
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS))   this.saveProducts(DEFAULT_PRODUCTS);
  },
};

Store.initDefaults();
