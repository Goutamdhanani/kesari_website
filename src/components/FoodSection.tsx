import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UtensilsCrossed,
  Coffee,
  Plus,
  Minus,
  Check,
  MessageSquare,
  Trash2,
  Send,
  AlertCircle,
  Receipt,
  User,
  Phone,
  MapPin,
} from 'lucide-react';

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
}

const MENU_CATEGORIES: Array<{
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

export const ALL_ITEMS: MenuItem[] = [
  // 1. Mains / Signatures
  { id: 'm1', name: 'Mac n Cheese Macaroni', category: 'Mains', categoryId: 'mains', price: 220, badge: 'Popular' },
  { id: 'm2', name: 'Mac n Cheese Macaroni with Vegetable', category: 'Mains', categoryId: 'mains', price: 240 },
  { id: 'm3', name: 'White Sauce Pasta with Mushroom', category: 'Mains', categoryId: 'mains', price: 240 },
  { id: 'm4', name: 'Red Sauce Pasta', category: 'Mains', categoryId: 'mains', price: 220 },
  { id: 'm5', name: 'Loaded Nachos', category: 'Mains', categoryId: 'mains', price: 220 },
  { id: 'm6', name: 'Onion Toast Sandwich', category: 'Mains', categoryId: 'mains', price: 120 },
  { id: 'm7', name: 'Grilled Colossal Sandwich (Set of 2)', category: 'Mains', categoryId: 'mains', price: 180 },
  { id: 'm8', name: 'Plain Colossal Sandwich (Set of 2)', category: 'Mains', categoryId: 'mains', price: 140 },
  { id: 'm9', name: 'Bombay Style Cheese Sandwich', category: 'Mains', categoryId: 'mains', price: 100 },
  { id: 'm10', name: 'Veg Grilled Sandwich Double', category: 'Mains', categoryId: 'mains', price: 220 },
  { id: 'm11', name: 'Pav Bhaji', category: 'Mains', categoryId: 'mains', price: 220, badge: 'Chef Special' },
  { id: 'm12', name: 'Extra Bread (2 pcs)', category: 'Mains', categoryId: 'mains', price: 60 },

  // 2. Appetizers & Quick Bites
  { id: 'a1', name: 'Maska Bun / Jam', category: 'Quick Bites', categoryId: 'bites', price: 80 },
  { id: 'a2', name: 'Nutrella Toast', category: 'Quick Bites', categoryId: 'bites', price: 100 },
  { id: 'a3', name: 'French Fries (Salted)', category: 'Quick Bites', categoryId: 'bites', price: 145 },
  { id: 'a4', name: 'French Fries (Peri Peri)', category: 'Quick Bites', categoryId: 'bites', price: 170, badge: 'Popular' },
  { id: 'a5', name: 'Potato Bites', category: 'Quick Bites', categoryId: 'bites', price: 120 },
  { id: 'a6', name: 'Maggi Plain', category: 'Quick Bites', categoryId: 'bites', price: 120 },
  { id: 'a7', name: 'Cheese Maggi', category: 'Quick Bites', categoryId: 'bites', price: 150 },
  { id: 'a8', name: 'Atta Maggi Noodles', category: 'Quick Bites', categoryId: 'bites', price: 120 },
  { id: 'a9', name: 'Cheese Nachos', category: 'Quick Bites', categoryId: 'bites', price: 150 },
  { id: 'a10', name: 'Classic Nachos with Dip', category: 'Quick Bites', categoryId: 'bites', price: 150 },
  { id: 'a11', name: 'Kurkure Chaat', category: 'Quick Bites', categoryId: 'bites', price: 120 },
  { id: 'a12', name: 'Corn Pizza Toast', category: 'Quick Bites', categoryId: 'bites', price: 180 },
  { id: 'a13', name: 'Paneer Pizza Toast', category: 'Quick Bites', categoryId: 'bites', price: 180 },
  { id: 'a14', name: 'Popcorn', category: 'Quick Bites', categoryId: 'bites', price: 80 },
  { id: 'a15', name: 'Corn Palak Buns', category: 'Quick Bites', categoryId: 'bites', price: 180 },

  // 3. Hot Beverages
  { id: 'hb1', name: 'Masala Tea with Parle G', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80, badge: 'Classic' },
  { id: 'hb2', name: 'Pudina Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80 },
  { id: 'hb3', name: 'Adrak Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80 },
  { id: 'hb4', name: 'Lemon Honey Tea', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80 },
  { id: 'hb5', name: 'Hot Coffee', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80 },
  { id: 'hb6', name: 'Classic Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140 },
  { id: 'hb7', name: 'Vanilla Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140 },
  { id: 'hb8', name: 'Butterscotch Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 140 },
  { id: 'hb9', name: 'Hazelnut Latte', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 160, badge: 'Signature' },
  { id: 'hb10', name: 'Boost with Parle G', category: 'Hot Beverages', categoryId: 'hot-beverages', price: 80 },

  // 4. Cold Beverages & Energy Drinks
  { id: 'cb1', name: 'Glass Soft Drink (200 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 15 },
  { id: 'cb2', name: 'Plastic Soft Drink (250 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 20 },
  { id: 'cb3', name: 'Diet Coke Can (300 ml)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40 },
  { id: 'cb4', name: 'Thumbs Up Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40 },
  { id: 'cb5', name: 'Coca-Cola Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40 },
  { id: 'cb6', name: 'Fanta Can', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 40 },
  { id: 'cb7', name: 'Monster (Green)', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 125 },
  { id: 'cb8', name: 'Schweppes', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 60 },
  { id: 'cb9', name: 'Predator', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 60 },
  { id: 'cb10', name: 'Masala Thumbs Up', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 100 },
  { id: 'cb11', name: 'Coke Float', category: 'Cold Beverages', categoryId: 'cold-beverages', price: 140, badge: 'Best Seller' },

  // 5. South Indian
  { id: 'si1', name: 'Plain Dosa', category: 'South Indian', categoryId: 'south-indian', price: 100 },
  { id: 'si2', name: 'Masala Dosa with Chutney', category: 'South Indian', categoryId: 'south-indian', price: 120, badge: 'Popular' },
  { id: 'si3', name: 'Pudi Masala Dosa', category: 'South Indian', categoryId: 'south-indian', price: 140 },
  { id: 'si4', name: 'Podi Onion Masala Dosa', category: 'South Indian', categoryId: 'south-indian', price: 150 },

  // 6. Indian & Rice Specials
  { id: 'rs1', name: 'Italian Rice with Paneer Gravy', category: 'Rice Specials', categoryId: 'rice-specials', price: 255, badge: 'Chef Special' },
  { id: 'rs2', name: 'Puliogere Rice', category: 'Rice Specials', categoryId: 'rice-specials', price: 180 },

  // 7. Healthy / Protein Options
  { id: 'h1', name: 'Protein Paneer Chilla (Set of 2)', category: 'Healthy', categoryId: 'healthy', price: 200, badge: 'High Protein' },
  { id: 'h2', name: 'Besan Chilla (Set of 2)', category: 'Healthy', categoryId: 'healthy', price: 180 },
  { id: 'h3', name: 'Ragi Chilla with Beetroot Raita', category: 'Healthy', categoryId: 'healthy', price: 225 },
  { id: 'h4', name: 'Aloo Paratha', category: 'Healthy', categoryId: 'healthy', price: 100 },

  // 8. Soups
  { id: 's1', name: 'Tomato Soup', category: 'Soups', categoryId: 'soups', price: 80 },
  { id: 's2', name: 'Sweet Corn Soup', category: 'Soups', categoryId: 'soups', price: 100 },
  { id: 's3', name: 'Hot & Sour Soup', category: 'Soups', categoryId: 'soups', price: 100 },
];

export const CAFE_MENU_ITEMS = ALL_ITEMS;
const CAFE_WHATSAPP_NUMBER = '917795777263'; // Target: 77957 77263

type MenuFilter = 'all' | MenuCategoryId;

interface FoodSectionProps {
  initialSeatingLocation?: string;
  compact?: boolean;
  onViewFullMenu?: () => void;
}

const COMPACT_SNACK_IDS = ['m1', 'm5', 'm11', 'a4', 'a7', 'si2'];
const COMPACT_BEVERAGE_IDS = ['hb1', 'hb5', 'hb9', 'hb6', 'cb11', 'cb7'];

export const FoodSection: React.FC<FoodSectionProps> = ({
  initialSeatingLocation = '',
  compact = false,
  onViewFullMenu,
}) => {
  const [filter, setFilter] = useState<MenuFilter>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [seatingLocation, setSeatingLocation] = useState(initialSeatingLocation);
  const [specialNote, setSpecialNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const orderSectionId = useId();

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const clearCart = () => {
    setCart({});
    setFormError(null);
    setOrderSent(false);
  };

  // Cart summary calculations
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const item = ALL_ITEMS.find((it) => it.id === id);
      return item ? { ...item, qty, itemTotal: item.price * qty } : null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const totalItemsCount = cartEntries.reduce((sum, it) => sum + it.qty, 0);
  const totalAmount = cartEntries.reduce((sum, it) => sum + it.itemTotal, 0);

  const buildWhatsAppMessage = () => {
    const itemsListText = cartEntries
      .map((item) => `• ${item.qty}x ${item.name} - ₹${item.itemTotal}`)
      .join('\n');

    return [
      `*KESARI CAFE ORDER*`,
      customerName.trim() ? `*Name:* ${customerName.trim()}` : null,
      customerPhone.trim() ? `*Phone:* ${customerPhone.trim()}` : null,
      seatingLocation.trim() ? `*Table / Seating:* ${seatingLocation.trim()}` : null,
      `---------------------------------`,
      itemsListText,
      `---------------------------------`,
      `*Total:* ₹${totalAmount}`,
      specialNote.trim() ? `*Note:* ${specialNote.trim()}` : null,
      `Please confirm my order.`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const whatsappUrl =
    cartEntries.length > 0
      ? `https://wa.me/${CAFE_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`
      : '';

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartEntries.length === 0) {
      setFormError('Please add at least one item to order.');
      return;
    }

    setFormError(null);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setOrderSent(true);
  };

  const renderCard = (item: MenuItem, index: number) => {
    const qty = cart[item.id] || 0;
    const isBeverage =
      item.categoryId === 'hot-beverages' || item.categoryId === 'cold-beverages';

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02, duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        className={`shrink-0 w-[190px] sm:w-[210px] h-[155px] snap-start rounded-[22px] sm:rounded-[26px] bg-[#0A0B10]/80 border backdrop-blur-md p-4 flex flex-col justify-between group transition-all relative overflow-hidden ${
          qty > 0 ? 'border-[#22C55E]/50 bg-[#0C120E]/90' : 'border-white/8 hover:border-white/20'
        }`}
      >
        {/* Apple-style atmospheric backlight */}
        <div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none blur-xl opacity-30 group-hover:opacity-60 transition-opacity"
          style={{
            background: isBeverage ? 'rgba(56, 189, 248, 0.35)' : 'rgba(251, 191, 36, 0.35)',
          }}
        />

        {/* Top: Category badge & item tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                isBeverage
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              }`}
            >
              {isBeverage ? <Coffee className="w-3 h-3" /> : <UtensilsCrossed className="w-3 h-3" />}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-white/45">
              {item.category}
            </span>
          </div>

          {item.badge && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/6 text-white/70 border border-white/10">
              {item.badge}
            </span>
          )}
        </div>

        {/* Middle: Clean Item Name */}
        <div className="relative z-10 my-1">
          <h3 className="text-xs sm:text-[13.5px] font-bold text-white group-hover:text-white transition-colors leading-snug line-clamp-2">
            {item.name}
          </h3>
        </div>

        {/* Bottom: Price & Add / Quantity Controls */}
        <div className="relative z-10 pt-2 border-t border-white/6 flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-white/50 font-normal">₹</span>
            <span className="text-sm sm:text-base font-bold text-white tabular-nums tracking-tight">
              {item.price}
            </span>
          </div>

          {qty === 0 ? (
            <button
              type="button"
              onClick={() => updateQuantity(item.id, 1)}
              aria-label={`Add ${item.name} to order`}
              className="h-8 px-3 rounded-full flex items-center gap-1 text-[11px] font-semibold bg-white/8 hover:bg-white/16 text-white/90 hover:text-white border border-white/10 active:scale-95 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          ) : (
            <div className="h-8 px-2 rounded-full flex items-center gap-2 bg-[#22C55E]/15 border border-[#22C55E]/50 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 text-[#22C55E] active:scale-90 transition-transform"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
              </button>
              <span className="text-xs font-bold tabular-nums min-w-[12px] text-center text-white">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 text-[#22C55E] active:scale-90 transition-transform"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="kesari-cafe-section" aria-label="Cafe & Bites" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-amber-400" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Cafe &amp; Bites</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
              WhatsApp Order Active
            </span>
          </div>
          <p className="text-xs text-white/50 pl-6">
            Fresh kitchen bites &amp; brewed beverages • Instant WhatsApp order to 77957 77263
          </p>
        </div>

        {/* Filter Pills or Compact Full-Menu CTA */}
        {compact ? (
          onViewFullMenu && (
            <button
              type="button"
              onClick={onViewFullMenu}
              className="self-start sm:self-auto ml-6 sm:ml-0 px-3.5 py-1.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors"
            >
              Full Menu ({ALL_ITEMS.length}) &rarr;
            </button>
          )
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pl-6 sm:pl-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`shrink-0 min-h-[34px] px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/6 text-white/60 hover:text-white border border-white/8'
              }`}
            >
              All ({ALL_ITEMS.length})
            </button>
            {MENU_CATEGORIES.map((cat) => {
              const count = ALL_ITEMS.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={`shrink-0 min-h-[34px] px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === cat.id
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/6 text-white/60 hover:text-white border border-white/8'
                  }`}
                >
                  {cat.shortLabel} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact Home View (1 Snacks row + 1 Beverages row) OR Full 8-Category Menu */}
      {compact ? (
        <>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-white/80">Snacks &amp; Signatures</span>
              <span className="text-[11px] text-white/40">{COMPACT_SNACK_IDS.length} Picks</span>
            </div>
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
              {ALL_ITEMS.filter((i) => COMPACT_SNACK_IDS.includes(i.id)).map((item, index) =>
                renderCard(item, index)
              )}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-white/80">Beverages &amp; Coffee</span>
              <span className="text-[11px] text-white/40">{COMPACT_BEVERAGE_IDS.length} Picks</span>
            </div>
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
              {ALL_ITEMS.filter((i) => COMPACT_BEVERAGE_IDS.includes(i.id)).map((item, index) =>
                renderCard(item, index)
              )}
            </div>
          </div>
        </>
      ) : (
        MENU_CATEGORIES.filter((cat) => filter === 'all' || filter === cat.id).map((cat) => {
          const items = ALL_ITEMS.filter((i) => i.categoryId === cat.id);
          return (
            <div key={cat.id} className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-white/80">{cat.label}</span>
                <span className="text-[11px] text-white/40">{items.length} Items</span>
              </div>

              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                {items.map((item, index) => renderCard(item, index))}
              </div>
            </div>
          );
        })
      )}

      {/* WhatsApp Order Details & Checkout Card */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            id={orderSectionId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="rounded-[26px] bg-[#0A0D12] border border-[#22C55E]/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4"
          >
            {/* Header with items count and Clear button */}
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#22C55E]" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Your Cafe Order ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                </h3>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-white/50 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>

            {/* Selected Items Breakdown */}
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {cartEntries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/4 border border-white/6 text-xs text-white"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-white/40 ml-2">₹{item.price} each</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-[#D8FF48] tabular-nums">
                      ₹{item.itemTotal}
                    </span>

                    <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-1.5 py-0.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-white/60 hover:text-white p-0.5"
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold min-w-[14px] text-center text-white">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-white/60 hover:text-white p-0.5"
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total calculation row */}
            <div className="p-3 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between text-sm sm:text-base font-bold text-white">
              <span>Total Payable</span>
              <span className="text-lg font-extrabold text-[#D8FF48] tabular-nums">
                ₹{totalAmount}
              </span>
            </div>

            {/* Customer Details Form for WhatsApp message */}
            <form onSubmit={handleSendWhatsAppOrder} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <User size={12} className="text-white/40" />
                    <span>Your Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <Phone size={12} className="text-white/40" />
                    <span>Phone Number (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <MapPin size={12} className="text-white/40" />
                    <span>Table / Seating Location (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 3, Main Hall, Lounge"
                    value={seatingLocation}
                    onChange={(e) => setSeatingLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-white/40" />
                    <span>Special Instructions (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Less spicy, hot coffee"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#22C55E] hover:bg-[#1ea850] active:scale-[0.98] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(34,197,94,0.35)] cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-black stroke-none" />
                <span>Order via WhatsApp to 77957 77263</span>
                <Send className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[11px] text-center text-white/50">
                Opens WhatsApp with your items (e.g. 2x Coffee) and total (₹{totalAmount}) pre-filled — just tap Send.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky 1-Tap Cart & WhatsApp Bar */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl rounded-2xl bg-[#0D1310]/95 backdrop-blur-xl border border-[#22C55E]/40 px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.75)] flex items-center justify-between gap-3"
          >
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(orderSectionId)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
              className="text-left min-w-0 flex-1"
            >
              <div className="text-xs font-bold text-white truncate">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} ·{' '}
                <span className="text-[#D8FF48]">₹{totalAmount}</span>
              </div>
              <div className="text-[11px] text-white/60 truncate">
                {cartEntries.map((i) => `${i.qty}x ${i.name}`).join(', ')}
              </div>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 h-10 px-4 rounded-xl bg-[#22C55E] hover:bg-[#1ea850] text-black text-xs font-bold inline-flex items-center gap-1.5 shadow-[0_0_16px_rgba(34,197,94,0.35)] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send on WhatsApp</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
