// src/data/menuData.js
// Official Menu Data & Fallback Catalog for Kesari - The Memory Studio, Koramangala
// Strictly 100% PURE VEGETARIAN and SOFT DRINKS ONLY. Absolutely no meat, poultry, fish, egg, or alcohol.

// Category normalizer helper
export function normalizeCategoryName(cat) {
  if (!cat) return 'All';
  const c = String(cat).trim().toLowerCase();
  if (c.includes('starter') || c.includes('appetizer')) return 'Starters';
  if (c.includes('main') || c.includes('curry') || c.includes('biryani')) return 'Mains';
  if (c.includes('beverage') || c.includes('drink') || c.includes('coffee') || c.includes('tea') || c.includes('cooler')) return 'Beverages';
  if (c.includes('dessert') || c.includes('sweet')) return 'Desserts';
  if (c.includes('special') || c.includes('chef')) return 'Chef Specials';
  return cat;
}

export const MENU_CATEGORIES = [
  'All',
  'Starters',
  'Mains',
  'Beverages',
  'Desserts',
  'Chef Specials'
];

export const DEFAULT_MENU_ITEMS = [
  // --- STARTERS (Pure Veg) ---
  {
    id: 'starter-1',
    name: 'Truffle Herb Hand-Cut Fries',
    image: '/assets/food/fries.jpg',
    description: 'White truffle oil, rosemary sea salt, roasted garlic dip.',
    category: 'Starters',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 1,
    tags: []
  },
  {
    id: 'starter-2',
    name: 'Paneer Ghee Roast Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Kundapur spiced paneer on sourdough with curry leaf ghee.',
    category: 'Starters',
    price: 310,
    isVeg: true,
    isAvailable: true,
    sortOrder: 2,
    tags: []
  },
  {
    id: 'starter-3',
    name: 'Crispy Corn & Edamame Croquettes',
    image: '/assets/food/croquettes.jpg',
    description: 'Sweet corn, young edamame, and gouda cheese panko croquettes.',
    category: 'Starters',
    price: 280,
    isVeg: true,
    isAvailable: true,
    sortOrder: 3,
    tags: []
  },
  {
    id: 'starter-4',
    name: 'Wild Mushroom & Truffle Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Sautéed shiitake mushrooms and white truffle glaze on sourdough.',
    category: 'Starters',
    price: 290,
    isVeg: true,
    isAvailable: true,
    sortOrder: 4,
    tags: []
  },
  {
    id: 'starter-5',
    name: 'Crispy Lotus Stem Chips',
    image: '/assets/food/croquettes.jpg',
    description: 'Thinly sliced lotus root, roasted peri-peri, kaffir lime zest.',
    category: 'Starters',
    price: 240,
    isVeg: true,
    isAvailable: true,
    sortOrder: 5,
    tags: []
  },

  // --- MAINS (Pure Veg) ---
  {
    id: 'main-1',
    name: 'Wild Mushroom & Truffle Risotto',
    image: '/assets/food/risotto.jpg',
    description: 'Carnaroli rice, wild porcini, cultured butter, white truffle.',
    category: 'Mains',
    price: 440,
    isVeg: true,
    isAvailable: true,
    sortOrder: 6,
    tags: []
  },
  {
    id: 'main-2',
    name: 'Kesari Dal Makhani Pot',
    image: '/assets/food/dal_makhani.jpg',
    description: 'Overnight slow-cooked black lentils, churned butter, jeera rice.',
    category: 'Mains',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 7,
    tags: []
  },
  {
    id: 'main-3',
    name: 'Paneer Lababdar with Malabar Parotta',
    image: '/assets/food/paneer.jpg',
    description: 'Charred paneer in spiced tomato-cashew gravy with flaky parottas.',
    category: 'Mains',
    price: 340,
    isVeg: true,
    isAvailable: true,
    sortOrder: 8,
    tags: []
  },
  {
    id: 'main-4',
    name: 'Biryani Pot - Dum Subz',
    image: '/assets/food/biryani.jpg',
    description: 'Aged basmati rice, seasonal vegetables, saffron, crispy onions.',
    category: 'Mains',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 9,
    tags: []
  },
  {
    id: 'main-5',
    name: 'Sourdough Burrata Margherita Pizza',
    image: '/assets/food/pizza.jpg',
    description: 'Cold-fermented crust, San Marzano sugo, burrata globe, sweet basil.',
    category: 'Mains',
    price: 480,
    isVeg: true,
    isAvailable: true,
    sortOrder: 10,
    tags: []
  },
  {
    id: 'main-6',
    name: 'Smoked Tofu & Basil Pad Thai',
    image: '/assets/food/noodles.jpg',
    description: 'Rice noodles, wok-charred tofu, roasted peanuts, bean sprouts.',
    category: 'Mains',
    price: 390,
    isVeg: true,
    isAvailable: true,
    sortOrder: 11,
    tags: []
  },

  // --- BEVERAGES (100% Pure Veg Artisanal Soft Drinks) ---
  {
    id: 'bev-1',
    name: 'Kashmiri Saffron Filter Kaapi',
    image: '/assets/food/cold_brew.jpg',
    description: 'South Indian chicory coffee with saffron foam and cardamom dust.',
    category: 'Beverages',
    price: 140,
    isVeg: true,
    isAvailable: true,
    sortOrder: 12,
    tags: []
  },
  {
    id: 'bev-2',
    name: 'Chikmagalur Single Origin Cold Brew',
    image: '/assets/food/cold_brew.jpg',
    description: '18-hour cold-steeped Arabica coffee with elderflower tonic.',
    category: 'Beverages',
    price: 210,
    isVeg: true,
    isAvailable: true,
    sortOrder: 13,
    tags: []
  },
  {
    id: 'bev-3',
    name: 'Spiced Jamun Cooler',
    image: '/assets/food/mocktail.jpg',
    description: 'Wild jamun extract, black salt, garden mint, and chilled soda.',
    category: 'Beverages',
    price: 160,
    isVeg: true,
    isAvailable: true,
    sortOrder: 14,
    tags: []
  },
  {
    id: 'bev-4',
    name: 'Hibiscus Berry Raw Kombucha',
    image: '/assets/food/mocktail.jpg',
    description: 'Probiotic sparkling fermented tea with hibiscus petals and blueberries.',
    category: 'Beverages',
    price: 195,
    isVeg: true,
    isAvailable: true,
    sortOrder: 15,
    tags: []
  },
  {
    id: 'bev-5',
    name: 'Ceremonial Matcha Pistachio Frappe',
    image: '/assets/food/matcha.jpg',
    description: 'Uji ceremonial matcha blended with pistachio cream and almond milk.',
    category: 'Beverages',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 16,
    tags: []
  },
  {
    id: 'bev-6',
    name: 'Passionfruit & Chili Iced Tea',
    image: '/assets/food/mocktail.jpg',
    description: 'Darjeeling black tea, passionfruit purée, and a hint of bird\'s eye chili.',
    category: 'Beverages',
    price: 190,
    isVeg: true,
    isAvailable: true,
    sortOrder: 17,
    tags: []
  },
  {
    id: 'bev-7',
    name: 'Kesari Masala Cutting Chai',
    image: '/assets/food/cold_brew.jpg',
    description: 'Assam tea simmered with fresh ginger, cardamom, and lemongrass.',
    category: 'Beverages',
    price: 80,
    isVeg: true,
    isAvailable: true,
    sortOrder: 18,
    tags: []
  },

  // --- DESSERTS (Pure Veg) ---
  {
    id: 'des-1',
    name: 'Kesari Shrikhand Cheesecake',
    image: '/assets/food/cheesecake.jpg',
    description: 'Baked saffron & cardamom hung curd on spiced biscuit crust.',
    category: 'Desserts',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 19,
    tags: []
  },
  {
    id: 'des-2',
    name: 'Warm 70% Dark Chocolate Fondant',
    image: '/assets/food/tiramisu.jpg',
    description: 'Belgian dark chocolate cake with molten core, vanilla bean gelato.',
    category: 'Desserts',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 20,
    tags: []
  },
  {
    id: 'des-3',
    name: 'Saffron & Roasted Pistachio Tres Leches',
    image: '/assets/food/cheesecake.jpg',
    description: 'Sponge cake steeped in saffron milk, whipped vanilla cream, gold dust.',
    category: 'Desserts',
    price: 295,
    isVeg: true,
    isAvailable: true,
    sortOrder: 21,
    tags: []
  },
  {
    id: 'des-4',
    name: 'Hot Gulab Jamun Sundae',
    image: '/assets/food/tiramisu.jpg',
    description: 'Warm saffron gulab jamuns, malai kulfi, toasted pistachio slivers.',
    category: 'Desserts',
    price: 190,
    isVeg: true,
    isAvailable: true,
    sortOrder: 22,
    tags: []
  },

  // --- CHEF SPECIALS (Pure Veg) ---
  {
    id: 'spec-1',
    name: 'Charcoal Truffle Paneer Tikka Steak',
    image: '/assets/food/paneer.jpg',
    description: 'Woodfire charred paneer steak, black garlic, white truffle ghee.',
    category: 'Chef Specials',
    price: 495,
    isVeg: true,
    isAvailable: true,
    sortOrder: 23,
    tags: []
  },
  {
    id: 'spec-2',
    name: 'Truffle Mushroom Kulcha Platter',
    image: '/assets/food/pizza.jpg',
    description: 'Amritsari kulcha with porcini & shiitake, slow-cooked Pindi chole.',
    category: 'Chef Specials',
    price: 360,
    isVeg: true,
    isAvailable: true,
    sortOrder: 24,
    tags: []
  },
  {
    id: 'spec-3',
    name: 'Memory Studio Artisanal Cheese Grazing Platter',
    image: '/assets/food/bruschetta.jpg',
    description: 'Artisanal smoked cheeses, black olive tapenade, walnut sourdough, grapes.',
    category: 'Chef Specials',
    price: 580,
    isVeg: true,
    isAvailable: true,
    sortOrder: 25,
    tags: []
  },
  {
    id: 'spec-4',
    name: 'Kesari Royal Pure Veg Feast (Limited)',
    image: '/assets/food/biryani.jpg',
    description: 'Saffron pulao, paneer lababdar, dal makhani, artisanal breads, shrikhand.',
    category: 'Chef Specials',
    price: 550,
    isVeg: true,
    isAvailable: false,
    sortOrder: 26,
    tags: []
  }
];

/**
 * Fetch live menu from /api/menu with resilient offline / mock fallback.
 * Strictly 100% Pure Vegetarian and Soft Drinks only.
 * @returns {Promise<{ categories: string[], items: Array, source: string }>}
 */
export async function loadLiveMenu() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/menu', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();

    // Support both { categories, items } object and direct items array
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const rawCats = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories.map(c => typeof c === 'string' ? c : (c.name || c.id))
        : MENU_CATEGORIES;
      const categories = rawCats.includes('All') ? rawCats : ['All', ...rawCats];
      return { categories, items: data.items, source: 'live' };
    }

    if (Array.isArray(data) && data.length > 0) {
      const uniqueCats = ['All', ...new Set(data.map(i => i.category).filter(Boolean))];
      return { categories: uniqueCats, items: data, source: 'live' };
    }

    // If server returned an empty array or missing items, fallback cleanly
    return { categories: MENU_CATEGORIES, items: DEFAULT_MENU_ITEMS, source: 'fallback' };
  } catch (err) {
    // Network error, server down, or offline: use fallback gracefully
    return { categories: MENU_CATEGORIES, items: DEFAULT_MENU_ITEMS, source: 'fallback', error: err.message };
  }
}
