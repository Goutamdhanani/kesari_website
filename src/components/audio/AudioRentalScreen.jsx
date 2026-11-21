import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, 
  Volume2, 
  Activity, 
  Sliders, 
  Disc, 
  Mic, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpRight, 
  Search, 
  X, 
  Phone, 
  Calendar, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import AccessibleDialog from '../common/AccessibleDialog';
import { RENTAL_EQUIPMENT, KESARI_CONTACT } from '../../data/kesariStudioData';
import './AudioRentalScreen.css';

const CATEGORY_MAP = {
  speakers: { label: 'PA & LINE ARRAY', Icon: Volume2 },
  subwoofers: { label: 'SUBWOOFER', Icon: Activity },
  mixers: { label: 'MIXING CONSOLE', Icon: Sliders },
  dj: { label: 'DJ CONTROLLER', Icon: Disc },
  mics: { label: 'MICROPHONE', Icon: Mic },
  stands: { label: 'STAND & MOUNT', Icon: Compass },
  cables: { label: 'CABLE & PATCH', Icon: Zap },
  service: { label: 'PRO AUDIO CREW', Icon: ShieldCheck }
};

export default function AudioRentalScreen({ onBack = null, onNavigate = null }) {
  // Category tabs
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart / selected equipment: { [itemId]: quantity }
  const [selectedGear, setSelectedGear] = useState({});

  // Enquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEnquiryItem, setActiveEnquiryItem] = useState(null);

  // Form Fields inside Modal
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [venueLocation, setVenueLocation] = useState('');
  const [needSoundEngineer, setNeedSoundEngineer] = useState(false);
  const [notes, setNotes] = useState('');

  // Form validation & submission state
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (onBack) {
      onBack();
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Category list definition with Lucide icons
  const categories = [
    { id: 'all', label: 'All Equipment', Icon: SlidersHorizontal },
    { id: 'speakers', label: 'PA & Line Arrays', Icon: Volume2 },
    { id: 'subwoofers', label: 'Subwoofers', Icon: Activity },
    { id: 'mixers', label: 'Mixers (Analog & Digital)', Icon: Sliders },
    { id: 'dj', label: 'DJ Decks', Icon: Disc },
    { id: 'mics', label: 'Microphones', Icon: Mic },
    { id: 'stands', label: 'Stands', Icon: Compass },
    { id: 'cables', label: 'Cabling & Patch', Icon: Zap },
    { id: 'service', label: 'Sound Engineer', Icon: ShieldCheck }
  ];

  // Min date for rental (today onwards)
  const minDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Filtered gear catalog
  const filteredGear = useMemo(() => {
    return RENTAL_EQUIPMENT.filter(item => {
      const matchCat = selectedCategory === 'all' 
        ? true 
        : item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.specs && item.specs.some(s => s.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quantity updates
  const handleUpdateQty = (itemId, delta, maxAvailable = 99) => {
    setSelectedGear(prev => {
      const curr = prev[itemId] || 0;
      const next = Math.max(0, Math.min(maxAvailable, curr + delta));
      if (next === 0) {
        const clone = { ...prev };
        delete clone[itemId];
        return clone;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Selected items summary list
  const selectedItemsList = useMemo(() => {
    return Object.entries(selectedGear).map(([id, qty]) => {
      const item = RENTAL_EQUIPMENT.find(g => g.id === id);
      return {
        id,
        name: item ? item.name : id,
        price: item ? item.price : 0,
        priceUnit: item ? item.priceUnit : 'per day',
        quantity: qty,
        lineTotal: (item ? item.price : 0) * qty
      };
    });
  }, [selectedGear]);

  // Total daily rate of selected gear
  const dailyTotal = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [selectedItemsList]);

  const totalItemCount = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItemsList]);

  // Grand Total in Modal
  const grandTotal = useMemo(() => {
    const engineerCost = needSoundEngineer ? 1500 * rentalDays : 0;
    return (dailyTotal * rentalDays) + engineerCost;
  }, [dailyTotal, rentalDays, needSoundEngineer]);

  // Open Enquiry Modal
  const handleOpenModal = (specificItem = null) => {
    if (specificItem) {
      setActiveEnquiryItem(specificItem);
      if (!selectedGear[specificItem.id]) {
        setSelectedGear(prev => ({ ...prev, [specificItem.id]: 1 }));
      }
    } else {
      setActiveEnquiryItem(null);
    }
    setFormErrors({});
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  // Validate Enquiry Form
  const validateEnquiry = () => {
    const errors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your name.';
    }

    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '').replace(/^0/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!eventDate) {
      errors.eventDate = 'Please select your event date.';
    }

    if (!venueLocation.trim()) {
      errors.venueLocation = 'Please provide the event venue or pickup area.';
    }

    if (selectedItemsList.length === 0) {
      errors.gear = 'Please select at least 1 piece of equipment to rent.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate WhatsApp message string
  const generateWhatsAppMessage = () => {
    const gearListText = selectedItemsList.length > 0
      ? selectedItemsList
          .map(item => `• ${item.name} x ${item.quantity} (₹${item.lineTotal.toLocaleString()}/day)`)
          .join('\n')
      : '• (Requesting full rental catalog & sound engineer consultation)';

    return (
      `Hi Kesari - The Memory Studio!\n` +
      `I want to rent pro audio equipment for my event:\n\n` +
      (enquiryRef ? `*Enquiry Ref:* ${enquiryRef}\n` : '') +
      `*Name:* ${fullName || 'Client'}\n` +
      `*Phone:* ${phone || 'Via WhatsApp'}\n` +
      `*Event Date:* ${eventDate || 'Upcoming'}\n` +
      `*Duration:* ${rentalDays} Day(s)\n` +
      `*Venue / Area:* ${venueLocation || 'Koramangala / Bangalore'}\n` +
      (needSoundEngineer ? `*Sound Engineer:* Yes (+₹${(1500 * rentalDays).toLocaleString()})\n` : '') +
      `\n*Equipment Requested:*\n${gearListText}\n\n` +
      `*Estimated Total: ₹${grandTotal.toLocaleString()}*\n` +
      (notes ? `*Notes:* ${notes}\n\n` : '\n') +
      `Please confirm availability and pickup/delivery logistics!`
    );
  };

  // Handle Form Submit
  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    if (!validateEnquiry()) return;

    const refCode = `KAR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setEnquiryRef(refCode);

    const payload = {
      reference: refCode,
      name: fullName.trim(),
      phone: phone.trim(),
      eventDate,
      durationDays: rentalDays,
      venue: venueLocation.trim(),
      needEngineer: needSoundEngineer,
      items: selectedItemsList,
      estimatedTotal: grandTotal,
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Graceful offline fallback
    }

    setIsSubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    window.open(KESARI_CONTACT.whatsappUrl(msg), '_blank');
  };

  return (
    <div className="audio-rental-screen-root">
      
      {/* ── 1. Compact Editorial Hero Header (Zero Slop, Zero Duplicate Nav) ── */}
      <header className="audio-compact-hero-section">
        <AuroraFluidCanvas />

        <div className="audio-header-container">
          {/* Breadcrumb row */}
          <div className="audio-breadcrumb-row">
            <button 
              type="button" 
              className="audio-back-breadcrumb" 
              onClick={() => navigateTo('/')}
              aria-label="Back to Home"
            >
              <ArrowLeft size={14} strokeWidth={2.4} />
              <span>Back to Home</span>
            </button>

            <span className="audio-eyebrow-pill">
              <span className="audio-pulse-dot" />
              <span>KORAMANGALA • STUDIO AUDIO FLEET</span>
            </span>
          </div>

          {/* Hero Headline & Summary */}
          <div className="audio-hero-content-block">
            <h1 className="audio-main-title">Audio Equipment &amp; PA System Rental in Bangalore</h1>
            <p className="audio-main-subtitle">
              Tour-grade Yamaha DBR active speakers, digital mixing consoles, Shure vocal microphones, and certified live sound engineers in Koramangala.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="audio-quick-meta-strip">
              <span className="audio-meta-badge highlight">19 Units in Stock</span>
              <span className="audio-meta-sep">•</span>
              <span className="audio-meta-badge">Yamaha &amp; Shure Fleet</span>
              <span className="audio-meta-sep">•</span>
              <span className="audio-meta-badge highlight">From ₹150 / day</span>
              <span className="audio-meta-sep">•</span>
              <span className="audio-meta-badge">Sound Crew On Call</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Main Gear Catalog ── */}
      <main className="audio-main-content">
        <div className="audio-catalog-container">
          
          {/* Controls: Search and Counter */}
          <div className="audio-controls-row">
            <div className="audio-search-box">
              <Search size={16} strokeWidth={2.2} className="search-icon" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Yamaha, Shure, Mixers, Line Array, Cables..."
                aria-label="Search audio gear"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="catalog-count-badge">
              <span className="count-num">{filteredGear.length}</span> items available
            </div>
          </div>

          {/* Category Filter Pills (Event Jam standard, zero emojis) */}
          <div className="audio-cat-pills-bar" role="tablist">
            {categories.map(cat => {
              const TabIcon = cat.Icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`audio-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <TabIcon size={14} strokeWidth={2.2} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Gear Cards Grid (Precision Hardware Spec Design - Zero Image Clones) */}
          <div className="gear-cards-grid">
            {filteredGear.map(item => {
              const qty = selectedGear[item.id] || 0;
              const catMeta = CATEGORY_MAP[item.category] || { label: 'STUDIO GEAR', Icon: SlidersHorizontal };
              const ItemCategoryIcon = catMeta.Icon;
              const leadSpec = item.specs && item.specs[0] ? item.specs[0] : item.badge;

              return (
                <div key={item.id} className={`gear-card ${qty > 0 ? 'in-cart' : ''}`}>
                  
                  {/* Hardware Header Plate */}
                  <div className="gear-card-header">
                    <div className="gear-category-row">
                      <div className="gear-cat-badge">
                        <ItemCategoryIcon size={12} strokeWidth={2.4} />
                        <span>{catMeta.label}</span>
                      </div>
                      <div className="gear-stock-pill">
                        <span className="stock-pulse-dot" />
                        <span>{item.available} in studio</span>
                      </div>
                    </div>

                    {/* Technical telemetry display bar */}
                    <div className="gear-telemetry-plate">
                      <div className="primary-spec">
                        <span className="telemetry-label">TECH SPEC</span>
                        <span className="telemetry-val">{leadSpec}</span>
                      </div>
                      <div className="telemetry-badge-tag">{item.badge}</div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="gear-card-body">
                    <div className="gear-price-row">
                      <div className="gear-price-wrap">
                        <span className="gear-currency">₹</span>
                        <span className="gear-price-val">{item.price.toLocaleString()}</span>
                        <span className="gear-price-unit">/ {item.priceUnit}</span>
                      </div>
                    </div>

                    <h3 className="gear-item-title">{item.name}</h3>
                    <p className="gear-item-desc">{item.desc}</p>

                    {/* Specs chips list */}
                    {item.specs && item.specs.length > 0 && (
                      <div className="gear-specs-list">
                        {item.specs.map((spec, idx) => (
                          <span key={idx} className="spec-pill">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="gear-card-footer">
                      {qty === 0 ? (
                        <button 
                          type="button"
                          className="gear-rent-btn"
                          onClick={() => handleUpdateQty(item.id, 1, item.available)}
                          aria-label={`Add ${item.name} to gear list`}
                        >
                          <Plus size={14} strokeWidth={2.4} />
                          <span>Add to Gear List</span>
                        </button>
                      ) : (
                        <div className="audio-qty-stepper">
                          <button 
                            type="button" 
                            className="stepper-ctrl-btn minus"
                            onClick={() => handleUpdateQty(item.id, -1, item.available)}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={13} strokeWidth={2.6} />
                          </button>
                          <span className="stepper-count-val">{qty} in list</span>
                          <button 
                            type="button" 
                            className="stepper-ctrl-btn plus"
                            onClick={() => handleUpdateQty(item.id, 1, item.available)}
                            disabled={qty >= item.available}
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={13} strokeWidth={2.6} />
                          </button>
                        </div>
                      )}

                      <button 
                        type="button"
                        className="gear-enquire-link"
                        onClick={() => handleOpenModal(item)}
                        aria-label={`Direct enquiry for ${item.name}`}
                      >
                        <span>Quote</span>
                        <ArrowUpRight size={12} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredGear.length === 0 && (
              <div className="gear-empty-state">
                <SlidersHorizontal size={36} color="#DAFB71" strokeWidth={1.8} />
                <h3>No Audio Equipment Found</h3>
                <p>Try searching different keywords or select "All Equipment".</p>
                <button 
                  type="button" 
                  className="reset-filter-btn"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                >
                  Reset Catalog Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Dock Bar (Selected Gear Summary) */}
        <AnimatePresence>
          {totalItemCount > 0 && (
            <motion.div 
              className="audio-sticky-dock-bar"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            >
              <div className="dock-content-wrap">
                <div className="dock-info">
                  <span className="dock-count-pill">
                    <span className="dock-pulse" />
                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'} Selected
                  </span>
                  <div className="dock-rates">
                    <span className="dock-rate-val">₹{dailyTotal.toLocaleString()}</span>
                    <span className="dock-rate-unit">/ day (estimated)</span>
                  </div>
                </div>

                <div className="dock-actions">
                  <button 
                    type="button"
                    className="dock-wa-btn"
                    onClick={handleDirectWhatsApp}
                    aria-label="Book selected gear on WhatsApp"
                  >
                    <MessageCircle size={15} strokeWidth={2.4} />
                    <span>WhatsApp Booking</span>
                  </button>

                  <button 
                    type="button"
                    className="dock-quote-btn"
                    onClick={() => handleOpenModal()}
                    aria-label="Review detailed quote"
                  >
                    <span>Review Quote</span>
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rent Equipment Enquiry Modal */}
        <AccessibleDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {({ dialogProps, titleId }) => (
            <div className="audio-modal-backdrop" onClick={() => setIsModalOpen(false)}>
              <div 
                {...dialogProps}
                className="audio-modal-drawer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-top-bar">
                  <div className="modal-title-group">
                    <span className="modal-pretitle">AUDIO GEAR RESERVATION</span>
                    <h2 id={titleId} className="modal-heading">Rent Studio Audio Equipment</h2>
                  </div>
                  <button 
                    className="modal-close-btn"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close enquiry modal"
                    data-dialog-initial-focus
                  >
                    <X size={16} />
                  </button>
                </div>

                {isSubmitted ? (
                  /* Success View */
                  <div className="modal-success-view">
                    <div className="success-icon-badge">
                      <Check size={36} color="#DAFB71" strokeWidth={3} />
                    </div>

                    <h3 className="success-title">Rental Request Registered!</h3>
                    <p className="success-desc">
                      Reference Code: <strong className="ref-highlight">{enquiryRef}</strong><br />
                      We have noted your equipment list. Please open WhatsApp below to verify availability 
                      with our sound technician immediately.
                    </p>

                    <div className="modal-success-actions">
                      <button 
                        type="button" 
                        className="wa-launch-btn"
                        onClick={handleDirectWhatsApp}
                      >
                        <MessageCircle size={16} strokeWidth={2.4} />
                        <span>Open WhatsApp with Pre-filled Details</span>
                      </button>
                      <button 
                        type="button" 
                        className="modal-done-btn"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Enquiry Form */
                  <form className="audio-enquiry-form" onSubmit={handleSubmitEnquiry} noValidate>
                    
                    {/* Selected Gear Review */}
                    <div className="modal-gear-summary-box">
                      <div className="summary-box-header">
                        <span>Selected Equipment ({selectedItemsList.length})</span>
                        <span className="box-day-rate">₹{dailyTotal.toLocaleString()} / day</span>
                      </div>

                      {selectedItemsList.length === 0 ? (
                        <p className="no-gear-warning">No equipment selected yet. Pick items from the catalog.</p>
                      ) : (
                        <div className="modal-gear-list">
                          {selectedItemsList.map(item => (
                            <div key={item.id} className="modal-gear-item">
                              <span className="gear-item-name">{item.name}</span>
                              <div className="gear-item-ctrls">
                                <div className="mini-stepper">
                                  <button type="button" onClick={() => handleUpdateQty(item.id, -1)} aria-label={`Decrease ${item.name}`}>-</button>
                                  <span>{item.quantity}</span>
                                  <button type="button" onClick={() => handleUpdateQty(item.id, 1)} aria-label={`Increase ${item.name}`}>+</button>
                                </div>
                                <span className="gear-item-amt">₹{item.lineTotal.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {formErrors.gear && <div className="form-error-banner">{formErrors.gear}</div>}

                    {/* Inputs */}
                    <div className="modal-inputs-grid">
                      <div className={`modal-field ${formErrors.fullName ? 'has-error' : ''}`}>
                        <label htmlFor="enquiryName">Full Name *</label>
                        <input 
                          type="text" 
                          id="enquiryName"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: null }));
                          }}
                          placeholder="e.g. Arun Kumar"
                          required
                        />
                        {formErrors.fullName && <span className="err-msg">{formErrors.fullName}</span>}
                      </div>

                      <div className={`modal-field ${formErrors.phone ? 'has-error' : ''}`}>
                        <label htmlFor="enquiryPhone">Phone (10-Digit) *</label>
                        <div className="phone-prefix-wrap">
                          <span className="prefix">+91</span>
                          <input 
                            type="tel" 
                            id="enquiryPhone"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                            }}
                            placeholder="98765 43210"
                            maxLength={12}
                            required
                          />
                        </div>
                        {formErrors.phone && <span className="err-msg">{formErrors.phone}</span>}
                      </div>

                      <div className={`modal-field ${formErrors.eventDate ? 'has-error' : ''}`}>
                        <label htmlFor="enquiryDate">Event Date *</label>
                        <input 
                          type="date" 
                          id="enquiryDate"
                          min={minDate}
                          value={eventDate}
                          onChange={(e) => {
                            setEventDate(e.target.value);
                            if (formErrors.eventDate) setFormErrors(prev => ({ ...prev, eventDate: null }));
                          }}
                          required
                        />
                        {formErrors.eventDate && <span className="err-msg">{formErrors.eventDate}</span>}
                      </div>

                      <div className="modal-field">
                        <label htmlFor="rentalDays">Rental Duration (Days)</label>
                        <div className="days-stepper-wrap">
                          <button 
                            type="button" 
                            className="day-btn"
                            onClick={() => setRentalDays(prev => Math.max(1, prev - 1))}
                            aria-label="Decrease rental days"
                          >
                            -
                          </button>
                          <span className="day-count">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
                          <button 
                            type="button" 
                            className="day-btn"
                            onClick={() => setRentalDays(prev => Math.min(14, prev + 1))}
                            aria-label="Increase rental days"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className={`modal-field full-col ${formErrors.venueLocation ? 'has-error' : ''}`}>
                        <label htmlFor="enquiryVenue">Event Venue / Area in Bangalore *</label>
                        <input 
                          type="text" 
                          id="enquiryVenue"
                          value={venueLocation}
                          onChange={(e) => {
                            setVenueLocation(e.target.value);
                            if (formErrors.venueLocation) setFormErrors(prev => ({ ...prev, venueLocation: null }));
                          }}
                          placeholder="e.g. Koramangala Studio Pickup, Indiranagar Rooftop, Whitefield Hotel..."
                          required
                        />
                        {formErrors.venueLocation && <span className="err-msg">{formErrors.venueLocation}</span>}
                      </div>

                      <div className="modal-field full-col sound-engineer-toggle-box">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={needSoundEngineer}
                            onChange={(e) => setNeedSoundEngineer(e.target.checked)}
                          />
                          <div className="toggle-label-content">
                            <span className="toggle-headline">Add Live Audio Sound Engineer (+₹1,500/day)</span>
                            <span className="toggle-desc">Includes sound check, EQ calibration, live stage mix, and tear-down.</span>
                          </div>
                        </label>
                      </div>

                      <div className="modal-field full-col">
                        <label htmlFor="enquiryNotes">Special Setup / Rigging / Cables Notes</label>
                        <textarea 
                          id="enquiryNotes"
                          rows="2"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Extra long XLR cables, wireless mic batteries, generator power specs..."
                        />
                      </div>
                    </div>

                    <div className="modal-grand-total-row">
                      <div className="calc-breakdown">
                        <span className="breakdown-headline">Estimated Total Rental</span>
                        <span className="breakdown-sub">{rentalDays} Day(s) {needSoundEngineer ? '• With Sound Engineer' : ''}</span>
                      </div>
                      <div className="total-figure">
                        ₹{grandTotal.toLocaleString()}
                      </div>
                    </div>

                    <div className="modal-submit-row">
                      <button 
                        type="button"
                        className="whatsapp-instant-btn"
                        onClick={handleDirectWhatsApp}
                      >
                        <MessageCircle size={16} strokeWidth={2.4} />
                        <span>Enquire on WhatsApp</span>
                      </button>

                      <button 
                        type="submit"
                        className="submit-request-btn"
                      >
                        Submit Reservation Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </AccessibleDialog>
      </main>
    </div>
  );
}
