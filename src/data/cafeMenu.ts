export type MenuCategoryId =
  | 'mains'
  | 'bites'
  | 'hot-beverages'
  | 'cold-beverages'
  | 'south-indian'
  | 'rice-specials'
  | 'healthy'
  | 'soups';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryId: MenuCategoryId;
  price: number;
  badge?: string;
  isVeg?: boolean;
  available?: boolean;
}

export const MENU_CATEGORIES: Array<{
  id: MenuCategoryId;
  label: string;
  shortLabel: string;
  isBeverage?: boolean;
}> = [
  { id: 'mains', label: 'Mains / Signatures', shortLabel: 'Mains' },
  { id: 'bites', label: 'Appetizers & Quick Bites', shortLabel: 'Quick Bites' },
  { id: 'hot-beverages', label: 'Hot Beverages', shortLabel: 'Hot Brews', isBeverage: true },
  { id: 'cold-beverages', label: 'Cold Beverages & Drinks', shortLabel: 'Cold Drinks', isBeverage: true },
  { id: 'south-indian', label: 'South Indian', shortLabel: 'South Indian' },
  { id: 'rice-specials', label: 'Indian & Rice Specials', shortLabel: 'Rice Specials' },
  { id: 'healthy', label: 'Healthy / Protein Options', shortLabel: 'Healthy' },
  { id: 'soups', label: 'Soups', shortLabel: 'Soups' },
];

export const DEFAULT_CAFE_MENU: MenuItem[] = [
  // 1. Mains / Signatures
  { id: 'm1', name: 'Mac n Cheese Macaroni', category: 'Mains', categoryId: 'mains', price: 220, badge: 'Popular', isVeg: true, available: true },
  { id: 'm2', name: 'Mac n Cheese Macaroni with Vegetable', category: 'Mains', categoryId: 'mains', price: 240, isVeg: true, available: true },
  { id: 'm3', name: 'White Sauce Pasta with Mushroom', category: 'Mains', categoryId: 'mains', price: 240, isVeg: true, available: true },
  { id: 'm4', name: 'Red Sauce Pasta', category: 'Mains', categoryId: 'mains', price: 220, isVeg: true, available: true },
  { id: 'm5', name: 'Loaded Nachos', category: 'Mains', categoryId: 'mains', price: 220, isVeg: true, available: true },
  { id: 'm6', name: 'Onion Toast Sandwich', category: 'Mains', categoryId: 'mains', price: 120, isVeg: true, available: true },
  { id: 'm7', name: 'Grilled Colossal Sandwich (Set of 2)', category: 'Mains', categoryId: 'mains', price: 180, isVeg: true, available: true },
  { id: 'm8', name: 'Plain Colossal Sandwich (Set of 2)', category: 'Mains', categoryId: 'mains', price: 140, isVeg: true, available: true },
  { id: 'm9', name: 'Bombay Style Cheese Sandwich', category: 'Mains', categoryId: 'mains', price: 100, isVeg: true, available: true },
  { id: 'm10', name: 'Veg Grilled Sandwich Double', category: 'Mains', categoryId: 'mains', price: 220, isVeg: true, available: true },
  { id: 'm11', name: 'Pav Bhaji', category: 'Mains', categoryId: 'mains', price: 220, badge: 'Chef Special', isVeg: true, available: true },
  { id: 'm12', name: 'Extra Bread (2 pcs)', category: 'Mains', categoryId: 'mains', price: 60, isVeg: true, available: true },

  // 2. Appetizers & Quick Bites
  { id: 'a1', name: 'Maska Bun / Jam', category: 'Quick Bites', categoryId: 'bites', price: 80, isVeg: true, available: true },
  { id: 'a2', name: 'Nutrella Toast', category: 'Quick Bites', categoryId: 'bites', price: 100, isVeg: true, available: true },
  { id: 'a3', name: 'French Fries (Salted)', category: 'Quick Bites', categoryId: 'bites', price: 145, isVeg: true, available: true },
  { id: 'a4', name: 'French Fries (Peri Peri)', category: 'Quick Bites', categoryId: 'bites', price: 170, badge: 'Popular', isVeg: true, available: true },
  { id: 'a5', name: 'Potato Bites', category: 'Quick Bites', categoryId: 'bites', price: 120, isVeg: true, available: true },
  { id: 'a6', name: 'Maggi Plain', category: 'Quick Bites', categoryId: 'bites', price: 120, isVeg: true, available: true },
  { id: 'a7', name: 'Cheese Maggi', category: 'Quick Bites', categoryId: 'bites', price: 150, isVeg: true, available: true },
  { id: 'a8', name: 'Atta Maggi Noodles', category: 'Quick Bites', categoryId: 'bites', price: 120, isVeg: true, available: true },
  { id: 'a9', name: 'Cheese Nachos', category: 'Quick Bites', categoryId: 'bites', price: 150, isVeg: true, available: true },
  { id: 'a10', name: 'Classic Nachos with Dip', category: 'Quick Bites', categoryId: 'bites', price: 150, isVeg: true, available: true },
  { id: 'a11', name: 'Kurkure Chaat', category: 'Quick Bites', categoryId: 'bites', price: 120, isVeg: true, available: true },
  { id: 'a12', name: 'Corn Pizza Toast', category: 'Quick Bites', categoryId: 'bites', price: 180, isVeg: true, available: true },
  { id: 'a13', name: 'Paneer Pizza Toast', category: 'Quick Bites', categoryId: 'bites', price: 180, isVeg: true, available: true },
  { id: 'a14', name: 'Popcorn', category: 'Quick Bites', categoryId: 'bites', price: 80, isVeg: true, available: true },
  { id: 'a15', name: 'Corn Palak Buns', category: 'Quick Bites', categoryId: 'bites', price: 180, isVeg: true, available: true },

  // 3. Hot Beverages
  { id: 'hb1', name: 'Masala Tea with Parle G', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, badge: 'Classic', isVeg: true, available: true },
  { id: 'hb2', name: 'Pudina Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, isVeg: true, available: true },
  { id: 'hb3', name: 'Adrak Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, isVeg: true, available: true },
  { id: 'hb4', name: 'Lemon Honey Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, isVeg: true, available: true },
  { id: 'hb5', name: 'Hot Coffee', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, isVeg: true, available: true },
  { id: 'hb6', name: 'Classic Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140, isVeg: true, available: true },
  { id: 'hb7', name: 'Vanilla Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140, isVeg: true, available: true },
  { id: 'hb8', name: 'Butterscotch Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140, isVeg: true, available: true },
  { id: 'hb9', name: 'Hazelnut Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 160, badge: 'Signature', isVeg: true, available: true },
  { id: 'hb10', name: 'Boost with Parle G', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, isVeg: true, available: true },

  // 4. Cold Beverages & Energy Drinks
  { id: 'cb1', name: 'Glass Soft Drink (200 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 15, isVeg: true, available: true },
  { id: 'cb2', name: 'Plastic Soft Drink (250 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 20, isVeg: true, available: true },
  { id: 'cb3', name: 'Diet Coke Can (300 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40, isVeg: true, available: true },
  { id: 'cb4', name: 'Thumbs Up Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40, isVeg: true, available: true },
  { id: 'cb5', name: 'Coca-Cola Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40, isVeg: true, available: true },
  { id: 'cb6', name: 'Fanta Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40, isVeg: true, available: true },
  { id: 'cb7', name: 'Monster (Green)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 125, isVeg: true, available: true },
  { id: 'cb8', name: 'Schweppes', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 60, isVeg: true, available: true },
  { id: 'cb9', name: 'Predator', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 60, isVeg: true, available: true },
  { id: 'cb10', name: 'Masala Thumbs Up', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 100, isVeg: true, available: true },
  { id: 'cb11', name: 'Coke Float', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 140, badge: 'Best Seller', isVeg: true, available: true },

  // 5. South Indian
  { id: 'si1', name: 'Plain Dosa', category: 'South Indian', categoryId: 'south-indian', price: 100, isVeg: true, available: true },
  { id: 'si2', name: 'Masala Dosa with Chutney', category: 'South Indian', categoryId: 'south-indian', price: 120, badge: 'Popular', isVeg: true, available: true },
  { id: 'si3', name: 'Pudi Masala Dosa', category: 'South Indian', categoryId: 'south-indian', price: 140, isVeg: true, available: true },
  { id: 'si4', name: 'Podi Onion Masala Dosa', category: 'South Indian', categoryId: 'south-indian', price: 150, isVeg: true, available: true },

  // 6. Indian & Rice Specials
  { id: 'rs1', name: 'Italian Rice with Paneer Gravy', category: 'Rice Specials', categoryId: 'rice-specials', price: 255, badge: 'Chef Special', isVeg: true, available: true },
  { id: 'rs2', name: 'Puliogere Rice', category: 'Rice Specials', categoryId: 'rice-specials', price: 180, isVeg: true, available: true },

  // 7. Healthy / Protein Options
  { id: 'h1', name: 'Protein Paneer Chilla (Set of 2)', category: 'Healthy', categoryId: 'healthy', price: 200, badge: 'High Protein', isVeg: true, available: true },
  { id: 'h2', name: 'Besan Chilla (Set of 2)', category: 'Healthy', categoryId: 'healthy', price: 180, isVeg: true, available: true },
  { id: 'h3', name: 'Ragi Chilla with Beetroot Raita', category: 'Healthy', categoryId: 'healthy', price: 225, isVeg: true, available: true },
  { id: 'h4', name: 'Aloo Paratha', category: 'Healthy', categoryId: 'healthy', price: 100, isVeg: true, available: true },

  // 8. Soups
  { id: 's1', name: 'Tomato Soup', category: 'Soups', categoryId: 'soups', price: 80, isVeg: true, available: true },
  { id: 's2', name: 'Sweet Corn Soup', category: 'Soups', categoryId: 'soups', price: 100, isVeg: true, available: true },
  { id: 's3', name: 'Hot & Sour Soup', category: 'Soups', categoryId: 'soups', price: 100, isVeg: true, available: true },
];
