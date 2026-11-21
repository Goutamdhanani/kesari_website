import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Calendar,
  Sparkles,
  Volume2,
  Mic,
  Image,
  Utensils,
  Phone,
  ArrowRight,
  Compass,
  Building2,
  Music
} from 'lucide-react';
import './MainNavbar.css';

export const NAV_ITEMS = [
  { path: '/', label: 'Home', shortLabel: 'Home', icon: Compass },
  { path: '/events', label: 'Upcoming Events', shortLabel: 'Events', icon: Calendar },
  { path: '/host-event', label: 'Host an Event', shortLabel: 'Host', icon: Sparkles },
  { path: '/audio-rental', label: 'Audio Rental', shortLabel: 'Audio Rental', icon: Volume2 },
  { path: '/artists', label: 'Book an Artist', shortLabel: 'Artists', icon: Mic },
  { path: '/venue-gallery', label: 'Venue Gallery', shortLabel: 'Venues', icon: Building2 },
  { path: '/event-gallery', label: 'Event Gallery', shortLabel: 'Gallery', icon: Image },
  { path: '/order-food', label: 'Order Food', shortLabel: 'Food', icon: Utensils },
  { path: '/contact', label: 'Contact Us', shortLabel: 'Contact', icon: Phone },
];

export default function MainNavbar({ currentPath: propPath, onNavigate }) {
  const [internalPath, setInternalPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p && p !== '/') return p;
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash.startsWith('/')) return hash;
    }
    return '/';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  // Sync with propPath if provided
  const activePath = propPath || internalPath;

  useEffect(() => {
    const handleLocationChange = () => {
      let p = window.location.pathname;
      if (!p || p === '/') {
        const hash = window.location.hash.replace(/^#/, '');
        if (hash && hash.startsWith('/')) p = hash;
      }
      setInternalPath(p || '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (path, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setInternalPath(path);

    if (onNavigate) {
      onNavigate(path);
    } else {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const isCurrentActive = (itemPath) => {
    if (itemPath === '/' && (activePath === '/' || activePath === '')) return true;
    if (itemPath !== '/' && activePath.startsWith(itemPath)) return true;
    return false;
  };

  return (
    <>
      <header className={`kesari-main-header ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="kesari-navbar-container" aria-label="Main Navigation">
          {/* Brand Logo & Name */}
          <a
            href="/"
            className="kesari-brand-link"
            onClick={(e) => handleNavClick('/', e)}
            aria-label="Kesari The Memory Studio Home"
          >
            <div className="kesari-brand-logo-wrap">
              <img
                src="/assets/kesari-logo.png"
                alt="Kesari Logo"
                className="kesari-brand-logo"
                width="36"
                height="36"
                loading="eager"
              />
            </div>
            <div className="kesari-brand-titles">
              <span className="kesari-brand-title">KESARI</span>
              <span className="kesari-brand-tagline">THE MEMORY STUDIO</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="kesari-desktop-nav-links" role="menubar">
            {NAV_ITEMS.map((item) => {
              const isActive = isCurrentActive(item.path);
              return (
                <li key={item.path} role="none" className="kesari-nav-li">
                  <a
                    href={item.path}
                    role="menuitem"
                    className={`kesari-nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={(e) => handleNavClick(item.path, e)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.shortLabel}</span>
                    {isActive && <span className="kesari-active-dot" aria-hidden="true" />}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Primary CTA Button (Book Us) & Hamburger */}
          <div className="kesari-nav-right-actions">
            <a
              href="/book"
              className={`kesari-primary-cta-btn ${isCurrentActive('/book') ? 'is-active-cta' : ''}`}
              onClick={(e) => handleNavClick('/book', e)}
              aria-label="Book Us - Reserve Studio Hall or Lounge"
            >
              <Sparkles size={16} className="cta-icon" aria-hidden="true" />
              <span>Book Us</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="kesari-hamburger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="kesari-mobile-drawer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop & Panel */}
      <div
        className={`kesari-drawer-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <aside
          id="kesari-mobile-drawer"
          ref={drawerRef}
          className={`kesari-drawer-panel ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile Menu"
        >
          {/* Drawer Header */}
          <div className="kesari-drawer-header">
            <div className="drawer-brand">
              <img
                src="/assets/kesari-logo.png"
                alt="Kesari Logo"
                className="drawer-logo"
                width="32"
                height="32"
              />
              <div className="drawer-title-group">
                <span className="drawer-title">KESARI</span>
                <span className="drawer-subtitle">Creative Sanctuary</span>
              </div>
            </div>
            <button
              type="button"
              className="kesari-drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Prominent CTA in Drawer */}
          <div className="drawer-primary-cta-wrap">
            <a
              href="/book"
              className="drawer-primary-cta"
              onClick={(e) => handleNavClick('/book', e)}
            >
              <div className="drawer-cta-content">
                <span className="drawer-cta-title">Book Us</span>
                <span className="drawer-cta-desc">Halls, Stage & Studio Spaces</span>
              </div>
              <ArrowRight size={18} className="drawer-cta-arrow" />
            </a>
          </div>

          {/* Drawer Menu Links */}
          <nav className="drawer-nav-list" aria-label="Mobile Navigation Links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentActive(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`drawer-nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => handleNavClick(item.path, e)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="drawer-item-left">
                    <span className="drawer-item-icon-box">
                      <Icon size={18} />
                    </span>
                    <span className="drawer-item-label">{item.label}</span>
                  </div>
                  {isActive ? (
                    <span className="drawer-active-badge">Active</span>
                  ) : (
                    <ArrowRight size={14} className="drawer-item-chevron" />
                  )}
                </a>
              );
            })}

            {/* Quick Live Menu Link */}
            <a
              href="/menu"
              className={`drawer-nav-item ${isCurrentActive('/menu') ? 'is-active' : ''}`}
              onClick={(e) => handleNavClick('/menu', e)}
            >
              <div className="drawer-item-left">
                <span className="drawer-item-icon-box">
                  <Utensils size={18} />
                </span>
                <span className="drawer-item-label">Café Menu (Live QR)</span>
              </div>
              <span className="drawer-qr-pill">QR</span>
            </a>
          </nav>

          {/* Drawer Footer Contact Strip */}
          <div className="drawer-footer-strip">
            <div className="drawer-contact-info">
              <span className="drawer-location-text">Koramangala 4th Block, Bangalore</span>
              <a href="tel:+917760539955" className="drawer-phone-link">
                +91 77605 39955
              </a>
            </div>
            <div className="drawer-quick-actions">
              <a
                href="https://wa.me/917760539955?text=Hi%20Kesari%20Team%2C%20I%20am%20interested%20in%20visiting%20or%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-wa-btn"
                aria-label="Chat with Kesari on WhatsApp"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
