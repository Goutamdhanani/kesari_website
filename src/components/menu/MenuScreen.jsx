import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Utensils, 
  Printer, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import { MENU_CATEGORIES, DEFAULT_MENU_ITEMS, loadLiveMenu, normalizeCategoryName } from '../../data/menuData';
import '../mobile/HomeScreen.css';
import './MenuScreen.css';

const PERMANENT_MENU_URL = 'https://kesari.studio/menu';

/**
 * Standard Indian FSSAI Pure Vegetarian badge
 */
export function FoodTypeBadge({ isVeg = true, size = 14, className = '' }) {
  return (
    <div 
      className={`food-diet-badge ${isVeg ? 'diet-veg' : 'diet-nonveg'} ${className}`}
      title={isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Pure Vegetarian' : 'Non-vegetarian'}
      style={{ width: size, height: size }}
    >
      <span className="food-diet-dot" />
    </div>
  );
}

export const PureVegBadge = FoodTypeBadge;

/**
 * Permanent QR Code Modal
 */
function MenuQRModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [pngDataUrl, setPngDataUrl] = useState('');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsGenerating(true);

    const generateQRs = async () => {
      try {
        const pngUrl = await QRCode.toDataURL(PERMANENT_MENU_URL, {
          width: 1024,
          margin: 3,
          errorCorrectionLevel: 'H',
          color: { dark: '#080808', light: '#FFFFFF' }
        });

        const svgStr = await QRCode.toString(PERMANENT_MENU_URL, {
          type: 'svg',
          margin: 3,
          errorCorrectionLevel: 'H',
          color: { dark: '#080808', light: '#FFFFFF' }
        });

        if (mounted) {
          setPngDataUrl(pngUrl);
          setSvgMarkup(svgStr);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Failed to generate client QR:', err);
        if (mounted) setIsGenerating(false);
      }
    };

    generateQRs();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      mounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(PERMANENT_MENU_URL);
      } else {
        const input = document.createElement('input');
        input.value = PERMANENT_MENU_URL;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleDownloadPNG = useCallback(() => {
    const link = document.createElement('a');
    link.href = pngDataUrl || '/menu-qr-highres.png';
    link.download = 'kesari-table-menu-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pngDataUrl]);

  const handleDownloadSVG = useCallback(() => {
    if (svgMarkup) {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kesari-table-menu-qr.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = '/menu-qr.svg';
      link.download = 'kesari-table-menu-qr.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [svgMarkup]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('/menu-qr-print.html', '_blank');
    if (!printWindow) window.print();
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="menu-qr-modal-overlay" onClick={onClose} role="presentation">
        <motion.div 
          className="menu-qr-modal-dialog" 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
        >
          <div className="menu-qr-modal-header">
            <div>
              <h2 className="menu-qr-title">Table Menu QR</h2>
              <p className="menu-qr-modal-desc">Permanent QR code for café tables & dining counters.</p>
            </div>
            <button type="button" className="menu-qr-close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="menu-qr-code-canvas-box">
            {pngDataUrl ? (
              <img src={pngDataUrl} alt="Table Menu QR" className="menu-qr-image" />
            ) : (
              <div className="menu-qr-skeleton">
                <QrCode size={64} className="text-secondary animate-pulse" />
              </div>
            )}
            <span className="menu-qr-url-pill">kesari.studio/menu</span>
          </div>

          <div className="menu-qr-link-row">
            <span className="menu-qr-link-text">{PERMANENT_MENU_URL}</span>
            <button type="button" className={`menu-qr-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="menu-qr-actions-grid">
            <button type="button" className="menu-qr-download-btn primary" onClick={handleDownloadPNG}>
              <Download size={14} />
              <span>Download PNG (1024px)</span>
            </button>
            <button type="button" className="menu-qr-download-btn secondary" onClick={handleDownloadSVG}>
              <Download size={14} />
              <span>Download SVG</span>
            </button>
            <button type="button" className="menu-qr-download-btn tertiary" onClick={handlePrint}>
              <Printer size={14} />
              <span>Print Table Stand</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Mobile-First Table QR Menu Screen
 */
export default function MenuScreen({ 
  onNavigateToBulk,
  onNavigate,
  onBack,
  tableNumber = null
}) {
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [categories, setCategories] = useState(MENU_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const searchInputRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const fetchMenu = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const result = await loadLiveMenu();
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        setMenuItems(result.items);
        if (Array.isArray(result.categories) && result.categories.length > 0) {
          const cleanCats = result.categories.map(c => typeof c === 'object' ? (c.name || c.id) : String(c));
          const unique = Array.from(new Set(['All', ...cleanCats]));
          setCategories(unique);
        }
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
    } catch {
      setMenuItems(DEFAULT_MENU_ITEMS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleBulkOrderClick = () => {
    if (typeof onNavigateToBulk === 'function') {
      onNavigateToBulk();
    } else if (typeof onNavigate === 'function') {
      onNavigate('order-food');
    } else {
      window.history.pushState({}, '', '/order-food');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: menuItems.length };
    menuItems.forEach((item) => {
      const cat = normalizeCategoryName(item.category) || 'Mains';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const itemCat = normalizeCategoryName(item.category);
      if (activeCategory !== 'All' && itemCat !== activeCategory) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = String(item.name || '').toLowerCase().includes(query);
        const descMatch = String(item.description || '').toLowerCase().includes(query);
        const catMatch = itemCat.toLowerCase().includes(query);
        return nameMatch || descMatch || catMatch;
      }
      return true;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <div className="mobile-explore-screen-root menu-screen-root-layout">
      <div className="mobile-explore-screen menu-screen-scroll-container">
        
        {/* 1. Curved Dome Header */}
        <header className="home-curved-dome-header menu-dome-curved-header">
          <AuroraFluidCanvas />

          <div className="dome-top-nav menu-dome-top-nav">
            <div className="dome-brand-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {onBack && (
                <button 
                  type="button"
                  className="explore-dome-back-btn menu-back-dome-btn" 
                  onClick={onBack} 
                  aria-label="Back"
                >
                  <ChevronLeft size={17} color="#FFFFFF" strokeWidth={2.4} />
                </button>
              )}
              <div className="menu-brand-identity">
                <img
                  src="/assets/kesari-logo.png"
                  alt="Kesari"
                  className="dome-kesari-brand-logo menu-brand-logo"
                />
              </div>
            </div>

            <div className="dome-nav-actions menu-dome-nav-actions">
              <div className="menu-pure-veg-tag-row">
                <span className="menu-veg-dot" />
                <span className="menu-pure-veg-pill-text">100% PURE VEG</span>
              </div>

              <motion.button 
                type="button"
                className="dome-glass-btn menu-qr-pill-trigger" 
                onClick={() => setShowQRModal(true)}
                whileTap={{ scale: 0.96 }}
                aria-label="Table QR"
              >
                <QrCode size={13} color="#DAFB71" strokeWidth={2.2} />
                <span className="menu-qr-btn-text">QR</span>
              </motion.button>

              <motion.button
                type="button"
                className={`dome-glass-btn menu-refresh-icon-btn ${isRefreshing ? 'is-spinning' : ''}`}
                onClick={() => fetchMenu(true)}
                disabled={isRefreshing}
                whileTap={{ scale: 0.96 }}
                aria-label="Refresh"
              >
                <RefreshCw size={12} color="#FFFFFF" strokeWidth={2.2} />
              </motion.button>
            </div>
          </div>

          {/* Minimal Hero Title */}
          <div className="menu-minimal-hero">
            <h1 className="menu-minimal-title">Café Menu</h1>
            <p className="menu-minimal-desc">100% Pure Veg • Koramangala 4th Block</p>
          </div>

          {/* Search Bar */}
          <div className="menu-search-wrapper">
            <Search size={14} className="menu-search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes & beverages..."
              className="menu-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="menu-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </header>

        {/* 2. Single Category Strip */}
        <section className="menu-category-section">
          <div className="menu-category-scroll">
            {categories.map((cat, idx) => {
              const catName = normalizeCategoryName(cat);
              const count = categoryCounts[catName] || 0;
              const isActive = activeCategory === catName;
              return (
                <button
                  key={`cat-${catName}-${idx}`}
                  type="button"
                  className={`menu-cat-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(catName)}
                >
                  <span>{catName}</span>
                  {count > 0 && <span className="menu-cat-count">{count}</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Clean Dish Cards Grid */}
        <main className="menu-cards-container">
          {isLoading && menuItems.length === 0 ? (
            <div className="menu-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="menu-dish-skeleton" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="menu-empty-view">
              <Utensils size={32} className="text-lime" />
              <p>{searchQuery ? `No dishes found for "${searchQuery}".` : 'Menu is being updated, please ask our staff.'}</p>
              <button type="button" className="menu-empty-reset-btn" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredItems.map((item) => {
                const isAvailable = item.isAvailable !== false;

                return (
                  <motion.div 
                    key={item.id} 
                    className={`menu-dish-card ${!isAvailable ? 'sold-out' : ''}`}
                    whileHover={reduceMotion || !isAvailable ? undefined : { y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="menu-dish-img-wrap">
                      <img
                        src={item.image || '/assets/food/bruschetta.jpg'}
                        alt={item.name}
                        className="menu-dish-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/food/bruschetta.jpg';
                        }}
                      />
                    </div>

                    <div className="menu-dish-info">
                      <div className="menu-dish-top">
                        <div className="menu-dish-title-wrap">
                          <FoodTypeBadge isVeg={true} size={13} />
                          <h3 className="menu-dish-title">{item.name}</h3>
                        </div>
                        <span className="menu-dish-price">₹{item.price}</span>
                      </div>

                      <p className="menu-dish-desc">{item.description}</p>

                      {!isAvailable && (
                        <div className="menu-dish-meta-bottom">
                          <span className="menu-dish-sold-pill">Sold Out</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 4. Compact 1-Line Bulk Catering Strip */}
          <div className="menu-catering-compact-strip" onClick={handleBulkOrderClick} role="button" tabIndex={0}>
            <div className="catering-strip-left">
              <Sparkles size={14} className="text-lime" />
              <span className="catering-strip-title">Host an event or studio jam?</span>
              <span className="catering-strip-sub">Order bulk pure-veg catering trays</span>
            </div>
            <button type="button" className="catering-strip-btn">
              <span>Order in Bulk for Events &rsaquo;</span>
            </button>
          </div>

          {/* 5. Minimal QR Footer Link */}
          <div className="menu-table-qr-footer">
            <button type="button" className="menu-footer-qr-trigger" onClick={() => setShowQRModal(true)}>
              <QrCode size={15} color="#DAFB71" />
              <span>Download Permanent Table QR Code & Signage</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </main>
      </div>

      {/* QR Code Modal */}
      <MenuQRModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
}
