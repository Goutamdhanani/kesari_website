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
  Search,
  Calendar,
  Clock,
  Ticket,
  User,
  Phone,
  MapPin,
} from 'lucide-react';
import { StudioEvent } from '../utils/studioLogic';

import {
  DEFAULT_CAFE_MENU,
  MENU_CATEGORIES,
  MenuCategoryId,
  MenuItem,
} from '../data/cafeMenu';

export type { MenuCategoryId, MenuItem };
export const ALL_ITEMS = DEFAULT_CAFE_MENU;
export const CAFE_MENU_ITEMS = DEFAULT_CAFE_MENU;
const CAFE_WHATSAPP_NUMBER = '917795777263'; // Target: 77957 77263

type MenuFilter = 'all' | MenuCategoryId;

interface FoodSectionProps {
  initialSeatingLocation?: string;
  compact?: boolean;
  onViewFullMenu?: () => void;
  menuItems?: MenuItem[];
  events?: StudioEvent[];
}

const COMPACT_SNACK_IDS = ['m1', 'm5', 'm11', 'a4', 'a7', 'si2'];
const COMPACT_BEVERAGE_IDS = ['hb1', 'hb5', 'hb9', 'hb6', 'cb11', 'cb7'];

export const FoodSection: React.FC<FoodSectionProps> = ({
  initialSeatingLocation = '',
  compact = false,
  onViewFullMenu,
  menuItems,
  events = [],
}) => {
  const activeItems = menuItems && menuItems.length > 0 ? menuItems : ALL_ITEMS;
  const [filter, setFilter] = useState<MenuFilter>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [seatingLocation, setSeatingLocation] = useState(initialSeatingLocation);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [customEventName, setCustomEventName] = useState('');
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
      const item = activeItems.find((it) => it.id === id);
      return item ? { ...item, qty, itemTotal: item.price * qty } : null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const totalItemsCount = cartEntries.reduce((sum, it) => sum + it.qty, 0);
  const totalAmount = cartEntries.reduce((sum, it) => sum + it.itemTotal, 0);

  const buildWhatsAppMessage = () => {
    const itemsListText = cartEntries
      .map((item) => `• ${item.qty}x ${item.name} - ₹${item.itemTotal}`)
      .join('\n');

    const pickedEvent = events.find((ev) => ev.id === selectedEventId);
    const resolvedEvent =
      selectedEventId === '__custom__'
        ? customEventName.trim()
        : pickedEvent
          ? `${pickedEvent.title} (${pickedEvent.dateLabel} · ${pickedEvent.timeLabel})`
          : customEventName.trim();

    return [
      `*KESARI CAFE PICKUP / ORDER*`,
      customerName.trim() ? `*Name:* ${customerName.trim()}` : null,
      customerPhone.trim() ? `*Phone:* ${customerPhone.trim()}` : null,
      seatingLocation.trim() ? `*Table / Seating:* ${seatingLocation.trim()}` : null,
      pickupDate.trim() || pickupTime.trim()
        ? `*Pickup Date & Time:* ${[pickupDate.trim(), pickupTime.trim()].filter(Boolean).join(' · ')}`
        : null,
      resolvedEvent ? `*Event:* ${resolvedEvent}` : null,
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

  const renderCard = (item: MenuItem, index: number, gridMode = false) => {
    const qty = cart[item.id] || 0;
    const isBeverage =
      item.categoryId === 'hot-beverages' || item.categoryId === 'cold-beverages';

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
        className={`${
          gridMode
            ? 'w-full min-h-[140px]'
            : 'shrink-0 w-[190px] sm:w-[210px] h-[155px] snap-start'
        } rounded-[22px] sm:rounded-[26px] bg-[#0A0B10]/80 border backdrop-blur-md p-4 flex flex-col justify-between group transition-all relative overflow-hidden ${
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
              Full Menu ({activeItems.length}) &rarr;
            </button>
          )
        ) : (
          <div className="space-y-3 w-full">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="search"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search coffee, dosa, pasta, soup..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-white/6 border border-white/12 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D8FF48]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`shrink-0 min-h-[34px] px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/6 text-white/60 hover:text-white border border-white/8'
                }`}
              >
                All ({activeItems.length})
              </button>
              {MENU_CATEGORIES.map((cat) => {
                const count = activeItems.filter((i) => i.categoryId === cat.id).length;
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
          </div>
        )}
      </div>

      {/* Compact Home View (1 Snacks row + 1 Beverages row) OR Full 8-Category Menu Grid */}
      {compact ? (
        <>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-white/80">Snacks &amp; Signatures</span>
              <span className="text-[11px] text-white/40">{COMPACT_SNACK_IDS.length} Picks</span>
            </div>
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
              {activeItems.filter((i) => COMPACT_SNACK_IDS.includes(i.id)).map((item, index) =>
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
              {activeItems.filter((i) => COMPACT_BEVERAGE_IDS.includes(i.id)).map((item, index) =>
                renderCard(item, index)
              )}
            </div>
          </div>
        </>
      ) : (
        MENU_CATEGORIES.filter((cat) => filter === 'all' || filter === cat.id).map((cat) => {
          const q = menuSearch.trim().toLowerCase();
          const items = activeItems.filter((i) => {
            if (i.categoryId !== cat.id) return false;
            if (!q) return true;
            return (
              i.name.toLowerCase().includes(q) ||
              i.category.toLowerCase().includes(q) ||
              (i.badge && i.badge.toLowerCase().includes(q))
            );
          });
          if (items.length === 0) return null;
          return (
            <div key={cat.id} className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1 border-b border-white/8 pb-2">
                <span className="text-sm font-bold text-white">{cat.label}</span>
                <span className="text-[11px] text-white/45 font-mono">{items.length} Items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item, index) => renderCard(item, index, true))}
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
              {/* Simple 2-Column Pickup Schedule: Date & Time + Event */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#D8FF48]" />
                    <span>Pickup Date &amp; Time (Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/12 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                    />
                    <div className="relative">
                      <Clock size={12} className="text-white/40 absolute left-2.5 top-3 pointer-events-none" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/12 rounded-xl pl-7 pr-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70 flex items-center gap-1.5">
                    <Ticket size={12} className="text-[#D8FF48]" />
                    <span>Event (Choose or Type)</span>
                  </label>
                  {events.length > 0 ? (
                    <div className="space-y-2">
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-[#12151C] border border-white/12 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                      >
                        <option value="">Casual Visit / Pickup Now</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.dateLabel} · {ev.timeLabel})
                          </option>
                        ))}
                        <option value="__custom__">Other Event (Enter name)</option>
                      </select>
                      {selectedEventId === '__custom__' && (
                        <input
                          type="text"
                          placeholder="Enter event name"
                          value={customEventName}
                          onChange={(e) => setCustomEventName(e.target.value)}
                          className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E]"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Event name or Casual Pickup"
                      value={customEventName}
                      onChange={(e) => setCustomEventName(e.target.value)}
                      className="w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#22C55E] transition-colors"
                    />
                  )}
                </div>
              </div>

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
