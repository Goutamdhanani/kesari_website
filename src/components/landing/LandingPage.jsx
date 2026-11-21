import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import AppIcon from '../common/AppIcon';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import '../mobile/HomeScreen.css';
import '../mobile/ExploreEventsScreen.css';
import './LandingPage.css';

export default function LandingPage({ onNavigate }) {
  const reduceMotion = useReducedMotion();

  const handleNav = (path, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <div className="landing-screen-root">
      {/* ========================================================
          1. THE OBSIDIAN CURVED STAGE DOME HEADER
          ======================================================== */}
      <header className="home-curved-dome-header landing-dome-header">
        <AuroraFluidCanvas />

        {/* Top Dome Navigation Row (Fallback for standalone render) */}
        <div className="dome-top-nav">
          <div className="dome-brand-group">
            <button
              type="button"
              className="dome-brand-trigger"
              aria-label="Kesari The Memory Studio Home"
              onClick={(e) => handleNav('/', e)}
            >
              <img
                src="/assets/kesari-logo.png"
                alt="Kesari"
                className="dome-kesari-brand-logo"
              />
            </button>
            <div
              className="dome-venue-capsule"
              onClick={(e) => handleNav('/contact', e)}
              role="button"
              tabIndex={0}
              aria-label="Location: Koramangala, Bangalore"
            >
              <span className="dome-live-beacon" />
              <span className="dome-venue-name">Koramangala, Bangalore</span>
            </div>
          </div>

          <div className="dome-nav-actions">
            <motion.button
              type="button"
              className="dome-glass-btn"
              onClick={(e) => handleNav('/events', e)}
              title="Upcoming Shows"
              aria-label="Upcoming Shows"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.95 }}
            >
              <AppIcon name="calendar" size={13} color="#FFFFFF" strokeWidth={2.2} />
            </motion.button>

            <motion.button
              type="button"
              className="dome-glass-btn"
              onClick={(e) => handleNav('/menu', e)}
              title="Live Pure Veg Cafe Menu"
              aria-label="Live Pure Veg Cafe Menu"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.95 }}
            >
              <AppIcon name="utensils" size={13} color="#DAFB71" strokeWidth={2.2} />
            </motion.button>

            <motion.button
              type="button"
              className="dome-avatar-halo"
              onClick={(e) => handleNav('/contact', e)}
              title="Contact Studio"
              aria-label="Contact Studio"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.95 }}
            >
              <span className="dome-halo-ring" />
              <img src="/assets/gregory_face.png" alt="Kesari Studio" className="dome-avatar-img" />
            </motion.button>
          </div>
        </div>

        {/* ========================================================
            HERO CARD: AMOUR (TRANSLUCENT GLASS WITH MOVING LIGHT BEHIND)
            ======================================================== */}
        <div className="landing-hero-wrapper">
          {/* Moving Light Behind Hero Card */}
          <div className="hero-ambient-lights" aria-hidden="true">
            <div className="hero-light-blob blob-purple" />
            <div className="hero-light-blob blob-amber" />
            <div className="hero-light-blob blob-rose" />
          </div>

          <motion.div
            className="dome-hero-spotlight landing-hero-card-clean"
            onClick={(e) => handleNav('/events/amour', e)}
            whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.985 }}
            role="button"
            tabIndex={0}
            aria-label="Kesari Events Spotlight: Amour"
          >
            <div className="dome-hero-inner-content">
              {/* Eyebrow Row */}
              <div className="dome-eyebrow-row">
                <div className="dome-live-pill">
                  <span className="live-pulse-dot" />
                  <span className="dome-live-tag">KESARI EVENTS • FLAGSHIP SPOTLIGHT</span>
                </div>
                <span className="dome-db-badge">Acoustic Chamber • Strictly 40 Pax</span>
              </div>

              {/* Title & Soundwave Row */}
              <div className="amour-title-row">
                <h1 className="landing-act-title-clean amour-serif-title">AMOUR</h1>
                <div className="dome-soundwave-bars amour-soundwave-bars" aria-label="Live audio waveform">
                  <span className="wave-bar bar-1" />
                  <span className="wave-bar bar-2" />
                  <span className="wave-bar bar-3" />
                  <span className="wave-bar bar-4" />
                  <span className="wave-bar bar-5" />
                </div>
              </div>

              <div className="landing-hero-subtagline">
                A Yash Raj Films Instrumental Tribute • Kesari - The Memory Studio
              </div>

              {/* Narrative description */}
              <p className="landing-poetic-narrative">
                Live candlelight strings and grand piano tribute in an intimate 40-seat acoustic chamber.
              </p>

              {/* Hairline Divider */}
              <div className="hero-card-hairline-sep" />

              {/* Footer Row: Meta & Actions */}
              <div className="dome-footer-row landing-footer-row">
                <div className="landing-hero-meta-compact">
                  <span className="hero-compact-chip">🗓 Sun, Nov 1 • 12:30 PM</span>
                  <span className="hero-compact-sep">•</span>
                  <span className="hero-compact-chip highlight">🎫 Couple Pass ₹1,800</span>
                  <span className="hero-compact-sep">•</span>
                  <span className="hero-compact-chip">🍃 100% Pure Veg Cafe</span>
                </div>

                <div className="landing-hero-btn-group">
                  <motion.button
                    className="dome-tune-btn landing-primary-book-btn"
                    type="button"
                    aria-label="Book Passes for Amour"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNav('/events/amour', e);
                    }}
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.96 }}
                  >
                    <span>Book Passes</span>
                    <AppIcon name="arrow-up-right" size={11} color="#080808" strokeWidth={2.6} />
                  </motion.button>

                  <motion.button
                    className="landing-secondary-shows-btn"
                    type="button"
                    aria-label="View All Upcoming Shows"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNav('/events', e);
                    }}
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.96 }}
                  >
                    <span>All Shows</span>
                    <span className="landing-btn-arrow">&rsaquo;</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT SHEET
          ======================================================== */}
      <main className="landing-content-sheet">

        {/* ========================================================
            ★ THE FOUR MAIN HIGHLIGHTED PILLARS (2x2 GRID WITH MOVING LIGHTS BEHIND)
            UPCOMING EVENTS • HOST A EVENT • AUDIO RENTALS • BOOK A ARTIST
            ======================================================== */}
        <section className="landing-four-stars-section" aria-labelledby="four-stars-heading">
          <div className="section-title-row">
            <span className="section-label" id="four-stars-heading">Core Experiences</span>
            <span className="section-meta">FOUR PILLARS</span>
          </div>

          <div className="landing-four-stars-grid">
            
            {/* 1. UPCOMING EVENTS */}
            <div className="pillar-card-wrapper">
              <div className="pillar-ambient-light light-events" aria-hidden="true" />
              
              <motion.div
                className="clean-star-card star-card-events main-highlighted-card"
                onClick={(e) => handleNav('/events', e)}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNav('/events', e)}
                aria-label="Upcoming Events"
              >
                <div className="clean-card-top-row">
                  <div className="landing-star-badge-row">
                    <img
                      src="/assets/star-marker.png"
                      alt=""
                      className="landing-star-marker-icon star-marker-img"
                    />
                    <span className="poster-stage-badge">LIVE STAGE</span>
                  </div>

                  <div className="clean-card-top-right">
                    <span className="card-top-glyph" aria-hidden="true">🎫</span>
                    <div className="poster-arrow-circle">
                      <AppIcon name="arrow-up-right" size={10} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  </div>
                </div>

                <div className="clean-card-body">
                  <div className="poster-timing-row">
                    <span className="poster-timing-pulse" />
                    <span className="poster-timing-text">Weekly Live Lineup</span>
                  </div>
                  <h3 className="poster-event-title highlighted-pillar-title">UPCOMING EVENTS</h3>
                  <p className="poster-artist-name">Concerts, indie gigs, acoustic evenings & open mics</p>
                </div>

                <div className="poster-card-footer">
                  <span className="poster-price-val">Explore Gigs</span>
                  <span className="poster-tag-chip">Passes &rsaquo;</span>
                </div>
              </motion.div>
            </div>

            {/* 2. HOST A EVENT */}
            <div className="pillar-card-wrapper">
              <div className="pillar-ambient-light light-host" aria-hidden="true" />

              <motion.div
                className="clean-star-card star-card-host main-highlighted-card"
                onClick={(e) => handleNav('/host-event', e)}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNav('/host-event', e)}
                aria-label="Host a Event"
              >
                <div className="clean-card-top-row">
                  <div className="landing-star-badge-row">
                    <img
                      src="/assets/star-marker.png"
                      alt=""
                      className="landing-star-marker-icon star-marker-img"
                    />
                    <span className="poster-stage-badge">VENUE & STAGE</span>
                  </div>

                  <div className="clean-card-top-right">
                    <span className="card-top-glyph" aria-hidden="true">🏛️</span>
                    <div className="poster-arrow-circle">
                      <AppIcon name="arrow-up-right" size={10} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  </div>
                </div>

                <div className="clean-card-body">
                  <div className="poster-timing-row">
                    <span className="poster-timing-pulse" />
                    <span className="poster-timing-text">Halls & Lounges • Up to 200 Guests</span>
                  </div>
                  <h3 className="poster-event-title highlighted-pillar-title title-amber">HOST A EVENT</h3>
                  <p className="poster-artist-name">Private gigs, album launches, standup & workshops</p>
                </div>

                <div className="poster-card-footer">
                  <span className="poster-price-val">Plan Event</span>
                  <span className="poster-tag-chip">From ₹5,000 &rsaquo;</span>
                </div>
              </motion.div>
            </div>

            {/* 3. AUDIO RENTALS */}
            <div className="pillar-card-wrapper">
              <div className="pillar-ambient-light light-audio" aria-hidden="true" />

              <motion.div
                className="clean-star-card star-card-audio main-highlighted-card"
                onClick={(e) => handleNav('/audio-rental', e)}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNav('/audio-rental', e)}
                aria-label="Audio Rentals"
              >
                <div className="clean-card-top-row">
                  <div className="landing-star-badge-row">
                    <img
                      src="/assets/star-marker.png"
                      alt=""
                      className="landing-star-marker-icon star-marker-img"
                    />
                    <span className="poster-stage-badge">PRO SOUND</span>
                  </div>

                  <div className="clean-card-top-right">
                    <span className="card-top-glyph" aria-hidden="true">🔊</span>
                    <div className="poster-arrow-circle">
                      <AppIcon name="arrow-up-right" size={10} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  </div>
                </div>

                <div className="clean-card-body">
                  <div className="poster-timing-row">
                    <span className="poster-timing-pulse" />
                    <span className="poster-timing-text">Yamaha DBR, Mixers & Mics</span>
                  </div>
                  <h3 className="poster-event-title highlighted-pillar-title title-amber">AUDIO RENTALS</h3>
                  <p className="poster-artist-name">13 gear items + live sound engineer booking</p>
                </div>

                <div className="poster-card-footer">
                  <span className="poster-price-val">Rent Gear</span>
                  <span className="poster-tag-chip">Catalog &rsaquo;</span>
                </div>
              </motion.div>
            </div>

            {/* 4. BOOK A ARTIST */}
            <div className="pillar-card-wrapper">
              <div className="pillar-ambient-light light-artists" aria-hidden="true" />

              <motion.div
                className="clean-star-card star-card-artists main-highlighted-card"
                onClick={(e) => handleNav('/artists', e)}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNav('/artists', e)}
                aria-label="Book a Artist"
              >
                <div className="clean-card-top-row">
                  <div className="landing-star-badge-row">
                    <img
                      src="/assets/star-marker.png"
                      alt=""
                      className="landing-star-marker-icon star-marker-img"
                    />
                    <span className="poster-stage-badge">CURATED TALENT</span>
                  </div>

                  <div className="clean-card-top-right">
                    <span className="card-top-glyph" aria-hidden="true">🎤</span>
                    <div className="poster-arrow-circle">
                      <AppIcon name="arrow-up-right" size={10} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  </div>
                </div>

                <div className="clean-card-body">
                  <div className="poster-timing-row">
                    <span className="poster-timing-pulse" />
                    <span className="poster-timing-text">Verified Bangalore Performers</span>
                  </div>
                  <h3 className="poster-event-title highlighted-pillar-title title-gold">BOOK A ARTIST</h3>
                  <p className="poster-artist-name">Vocalists, bands, DJs, instrumentalists & comics</p>
                </div>

                <div className="poster-card-footer">
                  <span className="poster-price-val">View Roster</span>
                  <span className="poster-tag-chip">Enquire &rsaquo;</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CAFÉ & PERMANENT QR MENU COMPACT STRIP
            ======================================================== */}
        <section className="landing-cafe-strip-section" aria-labelledby="cafe-strip-heading">
          <div
            className="landing-cafe-card"
            onClick={(e) => handleNav('/menu', e)}
            role="button"
            tabIndex={0}
          >
            <div className="cafe-card-left">
              <span className="cafe-pill-tag">100% PURE VEG CAFÉ</span>
              <h3 className="cafe-strip-title" id="cafe-strip-heading">Studio Café & QR Menu</h3>
              <p className="cafe-strip-desc">
                Single-origin cold brews, sourdough & 100% pure-veg dining.
              </p>
            </div>
            <button
              type="button"
              className="cafe-strip-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNav('/menu', e);
              }}
            >
              <span>View Menu</span>
              <AppIcon name="arrow-up-right" size={11} color="#080808" strokeWidth={2.6} />
            </button>
          </div>
        </section>

        {/* ========================================================
            CONTACT STRIP & LOCATION
            ======================================================== */}
        <section className="landing-contact-card-section" aria-labelledby="contact-heading">
          <div className="landing-contact-banner">
            <div className="landing-contact-info-block">
              <span className="contact-eyebrow">VISIT OR CONTACT US</span>
              <h3 className="contact-title" id="contact-heading">Kesari — The Memory Studio</h3>
              <p className="contact-address-text">
                4th Block, Koramangala, Bengaluru, Karnataka 560034
              </p>
              <p className="contact-timing-text">
                Open Daily: 10:00 AM – 11:30 PM • 100% Pure Veg
              </p>

              <div className="contact-action-pills-row">
                <a
                  href="tel:+917760539955"
                  className="contact-pill-btn"
                  aria-label="Call Kesari studio"
                >
                  <AppIcon name="phone" size={12} color="#FFFFFF" strokeWidth={2.4} />
                  <span>+91 77605 39955</span>
                </a>

                <a
                  href="https://wa.me/917760539955?text=Hello%20Kesari%20Studio%2C%20I%20would%20like%20to%20enquire%20about%20your%20events%20and%20spaces."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-pill-btn whatsapp-pill"
                  aria-label="Chat with Kesari on WhatsApp"
                >
                  <span>WhatsApp Us</span>
                  <AppIcon name="arrow-up-right" size={11} color="#0c1204" strokeWidth={2.4} />
                </a>

                <button
                  type="button"
                  className="contact-pill-btn"
                  onClick={(e) => handleNav('/contact', e)}
                >
                  <span>Directions & Details &rsaquo;</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FOOTER
            ======================================================== */}
        <footer className="landing-footer">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <img src="/assets/kesari-logo.png" alt="Kesari" className="footer-logo" />
              <p className="footer-tagline">
                Kesari — The Memory Studio. An acoustic and creative sanctuary in Koramangala, Bangalore.
              </p>
              <span className="footer-veg-badge">100% Pure Vegetarian & Soft Bar</span>
            </div>

            <div className="footer-nav-columns">
              <div className="footer-nav-col">
                <span className="footer-nav-heading">Experiences</span>
                <button type="button" onClick={(e) => handleNav('/events/amour', e)}>Amour (Flagship)</button>
                <button type="button" onClick={(e) => handleNav('/events', e)}>All Upcoming Shows</button>
                <button type="button" onClick={(e) => handleNav('/host-event', e)}>Host an Event</button>
                <button type="button" onClick={(e) => handleNav('/artists', e)}>Book an Artist</button>
              </div>

              <div className="footer-nav-col">
                <span className="footer-nav-heading">Facilities</span>
                <button type="button" onClick={(e) => handleNav('/book', e)}>Book Our Halls</button>
                <button type="button" onClick={(e) => handleNav('/audio-rental', e)}>Audio Gear Rental</button>
                <button type="button" onClick={(e) => handleNav('/menu', e)}>Café Menu (QR)</button>
                <button type="button" onClick={(e) => handleNav('/order-food', e)}>Bulk Catering</button>
              </div>

              <div className="footer-nav-col">
                <span className="footer-nav-heading">Media & Connect</span>
                <button type="button" onClick={(e) => handleNav('/venue-gallery', e)}>Venue Gallery</button>
                <button type="button" onClick={(e) => handleNav('/event-gallery', e)}>Event Highlights</button>
                <button type="button" onClick={(e) => handleNav('/artists/register', e)}>Artist Registration</button>
                <button type="button" onClick={(e) => handleNav('/contact', e)}>Contact & Location</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="footer-copy">© 2026 Kesari - The Memory Studio. All rights reserved.</p>
            <div className="footer-legal-links">
              <span>Permanent QR: kesari.studio/menu</span>
              <span>•</span>
              <span>Koramangala 4th Block, Bengaluru</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
