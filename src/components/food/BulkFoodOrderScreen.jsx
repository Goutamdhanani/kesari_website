import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '../common/AppIcon';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import { loadLiveMenu, normalizeCategoryName } from '../../data/menuData';
import '../mobile/HomeScreen.css';
import '../mobile/ExploreEventsScreen.css';
import './BulkFoodOrderScreen.css';

// Minimal fallback catalog (Strictly 100% Pure Vegetarian)
const PURE_VEG_FALLBACK_MENU = [
  {
    id: 'starter-1',
    name: 'Truffle Herb Hand-Cut Fries',
    image: '/assets/food/fries.jpg',
    description: 'White truffle oil, rosemary sea salt, garlic aioli.',
    category: 'Starters',
    price: 260,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'starter-2',
    name: 'Paneer Ghee Roast Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Kundapur spiced paneer on sourdough, curry leaf ghee.',
    category: 'Starters',
    price: 310,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'starter-3',
    name: 'Crispy Corn & Edamame Croquettes',
    image: '/assets/food/croquettes.jpg',
    description: 'Sweet corn, young edamame, and gouda cheese panko.',
    category: 'Starters',
    price: 280,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'starter-4',
    name: 'Wild Mushroom Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Toasted sourdough with sautéed shiitake & truffle glaze.',
    category: 'Starters',
    price: 290,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'starter-5',
    name: 'Charcoal Malai Paneer Skewers',
    image: '/assets/food/paneer.jpg',
    description: 'Woodfire charred paneer, black garlic, white truffle ghee.',
    category: 'Starters',
    price: 290,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-1',
    name: 'Wild Mushroom & Truffle Risotto',
    image: '/assets/food/risotto.jpg',
    description: 'Carnaroli rice, wild porcini, cultured butter, white truffle.',
    category: 'Mains',
    price: 440,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-2',
    name: 'Sourdough Burrata Margherita Pizza',
    image: '/assets/food/pizza.jpg',
    description: 'San Marzano sugo, burrata globe, sweet basil oil.',
    category: 'Mains',
    price: 480,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-3',
    name: 'Kesari Dal Makhani Pot',
    image: '/assets/food/dal_makhani.jpg',
    description: 'Overnight slow-cooked black lentils, churned butter, jeera rice.',
    category: 'Mains',
    price: 260,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-4',
    name: 'Paneer Butter Masala Royale',
    image: '/assets/food/paneer.jpg',
    description: 'Malai paneer, spiced tomato-cashew gravy, layered parotta.',
    category: 'Mains',
    price: 310,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-5',
    name: 'Kesari Subz Dum Biryani',
    image: '/assets/food/biryani.jpg',
    description: 'Aged basmati, seasonal vegetables, saffron, crispy onions.',
    category: 'Mains',
    price: 280,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'main-6',
    name: 'Artisanal Naan & Roti Basket',
    image: '/assets/food/pizza.jpg',
    description: 'Fresh butter naan, garlic naan & tandoori rotis.',
    category: 'Mains',
    price: 200,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'bev-1',
    name: 'Chikmagalur Cold Brew (18h)',
    image: '/assets/food/cold_brew.jpg',
    description: 'Single-origin estate coffee, elderflower tonic.',
    category: 'Beverages',
    price: 230,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'bev-2',
    name: 'Ceremonial Matcha Pistachio Frappe',
    image: '/assets/food/matcha.jpg',
    description: 'Uji ceremonial matcha, pistachio cream, almond milk.',
    category: 'Beverages',
    price: 260,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'bev-3',
    name: 'Hibiscus Berry Raw Kombucha',
    image: '/assets/food/mocktail.jpg',
    description: 'Sparkling fermented tea, hibiscus petals, wild berries.',
    category: 'Beverages',
    price: 195,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'bev-4',
    name: 'Kesari Masala Chai Flask (10 Cups)',
    image: '/assets/food/cold_brew.jpg',
    description: 'Kadak Assam tea, ginger, green cardamom, lemongrass.',
    category: 'Beverages',
    price: 350,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'des-1',
    name: 'Warm 70% Belgian Chocolate Fondant',
    image: '/assets/food/tiramisu.jpg',
    description: 'Molten dark chocolate cake, vanilla bean gelato.',
    category: 'Desserts',
    price: 320,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'des-2',
    name: 'Saffron & Pistachio Tres Leches',
    image: '/assets/food/cheesecake.jpg',
    description: 'Sponge cake steeped in saffron milk with whipped cream.',
    category: 'Desserts',
    price: 295,
    isVeg: true,
    isAvailable: true
  }
];

export default function BulkFoodOrderScreen({ onBack = () => {} }) {
  const [menuItems, setMenuItems] = useState(PURE_VEG_FALLBACK_MENU);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery' | 'Pickup'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('13:00');
  const [guestCount, setGuestCount] = useState(25);
  // Dietary options: Pure Vegetarian or Jain (Satvik)
  const [dietaryPreference, setDietaryPreference] = useState('Pure Vegetarian');
  const [specialNotes, setSpecialNotes] = useState('');

  // Status
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // 48-hour minimum lead time calculation
  const minLeadDateTime = useMemo(() => {
    const d = new Date(Date.now() + 48 * 60 * 60 * 1000);
    return d;
  }, []);

  const minDateStr = useMemo(() => {
    return minLeadDateTime.toISOString().split('T')[0];
  }, [minLeadDateTime]);

  // Load menu from live catalog
  useEffect(() => {
    let isMounted = true;
    async function fetchMenu() {
      try {
        const res = await loadLiveMenu();
        if (isMounted && res && Array.isArray(res.items) && res.items.length > 0) {
          const vegOnly = res.items.filter(item => item.isVeg !== false);
          if (vegOnly.length > 0) setMenuItems(vegOnly);
        }
      } catch {
        // Fallback already active
      }
    }
    fetchMenu();
    return () => { isMounted = false; };
  }, []);

  // Categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    menuItems.forEach(i => {
      const c = normalizeCategoryName(i.category);
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [menuItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const cat = normalizeCategoryName(item.category);
      const matchCat = selectedCategory === 'All' || cat === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Quantity handlers
  const handleUpdateQty = (itemId, delta) => {
    setSelectedQuantities(prev => {
      const curr = prev[itemId] || 0;
      const next = Math.max(0, curr + delta);
      if (next === 0) {
        const clone = { ...prev };
        delete clone[itemId];
        return clone;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Selected items list
  const selectedItemsList = useMemo(() => {
    return Object.entries(selectedQuantities).map(([id, qty]) => {
      const item = menuItems.find(m => String(m.id) === String(id));
      return {
        id,
        name: item ? item.name : 'Dish',
        price: item ? item.price : 0,
        isVeg: true,
        category: item ? item.category : '',
        quantity: qty,
        lineTotal: (item ? item.price : 0) * qty
      };
    });
  }, [selectedQuantities, menuItems]);

  const foodSubtotal = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [selectedItemsList]);

  const totalItemCount = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItemsList]);

  // Lead time validation
  const checkLeadTimeValid = (dateStr, timeStr) => {
    if (!dateStr) return false;
    const selected = new Date(`${dateStr}T${timeStr || '12:00'}:00`);
    const diffHours = (selected.getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours >= 47.9; // 48-hour requirement
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Name required';
    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '').replace(/^0/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) errors.phone = 'Valid 10-digit number required';
    if (orderType === 'Delivery' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 5)) {
      errors.deliveryAddress = 'Delivery address required';
    }
    if (!eventDate) {
      errors.eventDate = 'Event date required (min. 48 hours)';
    } else if (!checkLeadTimeValid(eventDate, eventTime)) {
      errors.eventDate = 'Minimum 48 hours advance notice required';
    }
    if (!guestCount || Number(guestCount) < 5) errors.guestCount = 'Min. 5 guests';
    if (selectedItemsList.length === 0) errors.items = 'Select at least 1 dish';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const clientRefCode = `KBF-${Date.now().toString(36).toUpperCase()}`;

    const orderPayload = {
      name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      orderType,
      address: orderType === 'Delivery' ? deliveryAddress.trim() : `Kesari Studio Pickup (${orderType})`,
      date: eventDate,
      timeNeeded: eventTime,
      guests: Number(guestCount),
      items: selectedItemsList,
      dietary: dietaryPreference, // Handles Dietary options
      notes: specialNotes.trim(),
      estimatedTotal: foodSubtotal,
      status: 'received'
    };

    try {
      const response = await fetch('/api/bulk-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const result = response.ok ? await response.json() : null;
      setOrderSuccess({
        ...orderPayload,
        id: result?.id || clientRefCode,
        reference: result?.reference || result?.id || clientRefCode
      });
      setShowCheckout(false);
    } catch {
      setOrderSuccess({
        ...orderPayload,
        id: clientRefCode,
        reference: clientRefCode
      });
      setShowCheckout(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = (order) => {
    const dishes = (order.items || []).map(i => `${i.name} x${i.quantity}`).join(', ');
    const msg = encodeURIComponent(
      `Hi Kesari Studio! Catering Order Ref: ${order.reference || order.id}\nName: ${order.name}\nDate: ${order.date} ${order.timeNeeded}\nGuests: ${order.guests}\nItems: ${dishes}\nTotal: ₹${order.estimatedTotal}`
    );
    return `https://wa.me/917760539955?text=${msg}`;
  };

  return (
    <div className="mobile-explore-screen-root bulk-food-screen-root">
      
      {/* 1. Curved Dome Header */}
      <header className="home-curved-dome-header">
        <AuroraFluidCanvas />

        <div className="dome-top-nav">
          <div className="dome-brand-group">
            <button className="explore-dome-back-btn" onClick={onBack} aria-label="Back">
              <AppIcon name="chevron-left" size={17} color="#FFFFFF" strokeWidth={2.4} />
            </button>
            <div className="dome-brand-trigger">
              <img src="/assets/kesari-logo.png" alt="Kesari" className="dome-kesari-brand-logo" />
            </div>
          </div>

          <div className="dome-nav-actions">
            <div className="food-minimal-badge">
              <span className="food-veg-dot" />
              <span>100% PURE VEG</span>
            </div>
          </div>
        </div>

        {/* Minimal Hero Header */}
        <div className="food-minimal-hero">
          <div className="food-hero-meta-row">
            <span className="food-lead-pill">48h advance notice</span>
            <span className="food-meta-dot">•</span>
            <span className="food-lead-sub">Koramangala Kitchen</span>
          </div>
          <h1 className="food-minimal-title">Order Food & Catering</h1>
          <p className="food-minimal-desc">Freshly prepared pure-veg trays for studio gatherings, events & parties.</p>
        </div>
      </header>

      {/* 2. Main Food Stage */}
      <main className="food-main-catalog-container">
        
        {/* Success View */}
        <AnimatePresence>
          {orderSuccess && (
            <motion.div 
              className="food-success-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="food-success-check">✓</div>
              <h2 className="food-success-heading">Order Received</h2>
              <p className="food-success-sub">Order #{orderSuccess.reference || orderSuccess.id}</p>
              <p className="food-success-info">
                {orderSuccess.guests} Guests • {orderSuccess.date} • ₹{orderSuccess.estimatedTotal?.toLocaleString()}
              </p>
              
              <div className="food-success-actions">
                <a 
                  href={getWhatsAppLink(orderSuccess)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="food-btn-primary"
                >
                  Confirm on WhatsApp ↗
                </a>
                <button 
                  type="button" 
                  className="food-btn-ghost" 
                  onClick={() => { setOrderSuccess(null); setSelectedQuantities({}); }}
                >
                  Order More
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories & Search */}
        <div className="food-controls-bar">
          <div className="food-category-chips">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`food-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="food-search-wrapper">
            <AppIcon name="search" size={13} color="#9BA1C0" strokeWidth={2.2} />
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="food-search-input"
            />
            {searchQuery && (
              <button type="button" className="food-search-clear" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Minimal Dish Grid */}
        <div className="food-dish-grid">
          {filteredItems.map(item => {
            const qty = selectedQuantities[item.id] || 0;
            return (
              <div key={item.id} className={`food-dish-card ${qty > 0 ? 'selected' : ''}`}>
                <div className="food-dish-thumb-wrap">
                  <img
                    src={item.image || '/assets/food/bruschetta.jpg'}
                    alt={item.name}
                    className="food-dish-thumb"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/food/bruschetta.jpg';
                    }}
                  />
                </div>

                <div className="food-dish-body">
                  <div className="food-dish-header">
                    <div className="food-dish-title-group">
                      <span className="food-dish-veg-symbol" />
                      <h3 className="food-dish-name">{item.name}</h3>
                    </div>
                    <span className="food-dish-price">₹{item.price}</span>
                  </div>

                  <p className="food-dish-desc">{item.description}</p>

                  <div className="food-dish-footer">
                    <span className="food-dish-portion">Tray ~ 3-4 pax</span>

                    {qty === 0 ? (
                      <button 
                        type="button" 
                        className="food-add-btn"
                        onClick={() => handleUpdateQty(item.id, 1)}
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="food-qty-stepper">
                        <button type="button" onClick={() => handleUpdateQty(item.id, -1)} aria-label="Decrease">−</button>
                        <span className="food-qty-num">{qty}</span>
                        <button type="button" onClick={() => handleUpdateQty(item.id, 1)} aria-label="Increase">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="food-empty-search">
            <p>No dishes found for "{searchQuery}".</p>
          </div>
        )}
      </main>

      {/* 3. Sticky Bottom Cart Dock */}
      {totalItemCount > 0 && !showCheckout && !orderSuccess && (
        <motion.div 
          className="food-bottom-dock"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          <div className="food-dock-inner">
            <div className="food-dock-summary">
              <span className="food-dock-count">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
              <span className="food-dock-total">₹{foodSubtotal.toLocaleString()}</span>
            </div>
            <button 
              type="button" 
              className="food-dock-checkout-btn"
              onClick={() => setShowCheckout(true)}
            >
              <span>Continue</span>
              <AppIcon name="arrow-right" size={13} color="#080808" strokeWidth={2.4} />
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Streamlined Minimal Checkout Sheet */}
      <AnimatePresence>
        {showCheckout && (
          <div className="food-modal-backdrop" onClick={() => setShowCheckout(false)}>
            <motion.div 
              className="food-checkout-sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            >
              <div className="food-sheet-header">
                <div>
                  <h2 className="food-sheet-title">Event Logistics</h2>
                  <p className="food-sheet-sub">₹{foodSubtotal.toLocaleString()} • {totalItemCount} items</p>
                </div>
                <button type="button" className="food-sheet-close" onClick={() => setShowCheckout(false)}>×</button>
              </div>

              <form onSubmit={handleSubmitOrder} className="food-sheet-form">
                
                {/* Name & Phone */}
                <div className="food-form-row">
                  <div className="food-input-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="Rohith Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    {formErrors.fullName && <span className="food-field-err">{formErrors.fullName}</span>}
                  </div>

                  <div className="food-input-group">
                    <label>Phone Number *</label>
                    <div className="food-phone-wrap">
                      <span className="food-country-code">+91</span>
                      <input 
                        type="tel" 
                        placeholder="98765 43210"
                        maxLength={12}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    {formErrors.phone && <span className="food-field-err">{formErrors.phone}</span>}
                  </div>
                </div>

                {/* Date & Guests */}
                <div className="food-form-row">
                  <div className="food-input-group">
                    <label>Date * (Min. 48h notice)</label>
                    <input 
                      type="date" 
                      min={minDateStr}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                    {formErrors.eventDate && <span className="food-field-err">{formErrors.eventDate}</span>}
                  </div>

                  <div className="food-input-group">
                    <label>Guests *</label>
                    <input 
                      type="number" 
                      min="5" 
                      max="300"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(5, Number(e.target.value)))}
                      required
                    />
                  </div>
                </div>

                {/* Order Type & Address */}
                <div className="food-input-group">
                  <label>Order Type</label>
                  <div className="food-segmented-ctrl">
                    <button 
                      type="button" 
                      className={orderType === 'Delivery' ? 'active' : ''}
                      onClick={() => setOrderType('Delivery')}
                    >
                      Delivery to Venue / Home
                    </button>
                    <button 
                      type="button" 
                      className={orderType === 'Pickup' ? 'active' : ''}
                      onClick={() => setOrderType('Pickup')}
                    >
                      Studio Pickup
                    </button>
                  </div>
                </div>

                {orderType === 'Delivery' && (
                  <div className="food-input-group">
                    <label>Delivery Address & Landmark *</label>
                    <input 
                      type="text" 
                      placeholder="Flat, Building, Street, Koramangala / Bangalore"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                    {formErrors.deliveryAddress && <span className="food-field-err">{formErrors.deliveryAddress}</span>}
                  </div>
                )}

                {/* Dietary Choice (Handles Dietary option) */}
                <div className="food-input-group">
                  <label>Dietary Requirement</label>
                  <div className="food-segmented-ctrl">
                    <button 
                      type="button" 
                      className={dietaryPreference === 'Pure Vegetarian' ? 'active' : ''}
                      onClick={() => setDietaryPreference('Pure Vegetarian')}
                    >
                      100% Pure Veg
                    </button>
                    <button 
                      type="button" 
                      className={dietaryPreference === 'Jain (Satvik)' ? 'active' : ''}
                      onClick={() => setDietaryPreference('Jain (Satvik)')}
                    >
                      Jain (No Onion / Garlic)
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="food-input-group">
                  <label>Notes (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Spice level, serving preferences, etc."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="food-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm Order (₹${foodSubtotal.toLocaleString()})`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
