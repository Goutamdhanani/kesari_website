import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import AppIcon from '../common/AppIcon';
import AuroraFluidCanvas from './AuroraFluidCanvas';
import ExploreSkeletonScreen from './ExploreSkeletonScreen';
import './HomeScreen.css';
import './ExploreEventsScreen.css';

const DATE_TABS = [
  { id: 'all', label: 'All Shows' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'upcoming', label: 'Upcoming' }
];

const VIBE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'rock', label: 'Live Gigs' },
  { id: 'acoustic', label: 'Acoustic' },
  { id: 'hiphop', label: 'Cyphers' },
  { id: 'electronic', label: 'Synth' }
];

export default function ExploreEventsScreen({
  events = [],
  selectedCity = 'Bangalore',
  onSelectEvent = () => {},
  onBack = () => {},
  onOpenCitySelector = () => {},
  onOpenProfile = () => {},
  onOpenNotifications = () => {},
  unreadCount = 0
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateTab, setSelectedDateTab] = useState('all');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 380);
    return () => clearTimeout(timer);
  }, []);

  const featuredEvent = useMemo(() => {
    const publicList = (events && events.length > 0 ? events : []).filter(e => e.isPublic !== false);
    return publicList.find(e => e.featured) || publicList[0] || {};
  }, [events]);

  const filteredEvents = useMemo(() => {
    return (events || []).filter(e => {
      if (e.isPublic === false) return false;

      // Date filter
      if (selectedDateTab === 'tonight' && e.dateFilter !== 'tonight') return false;
      if (selectedDateTab === 'weekend' && e.dateFilter !== 'weekend') return false;
      if (selectedDateTab === 'upcoming' && (e.dateFilter === 'tonight' || e.dateFilter === 'weekend')) return false;

      // Vibe filter
      if (selectedVibe !== 'all') {
        const matchesGenre = e.genre?.toLowerCase() === selectedVibe.toLowerCase();
        const matchesCategory = e.category?.toLowerCase().includes(selectedVibe.toLowerCase());
        if (!matchesGenre && !matchesCategory) return false;
      }

      return true;
    });
  }, [events, selectedDateTab, selectedVibe]);

  return (
    <div className="mobile-explore-screen-root" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <ExploreSkeletonScreen key="skeleton" />
        ) : (
          <motion.div 
            key="content"
            className="mobile-explore-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* ── 1. The Obsidian Curved Stage Dome (Exact Match to Screenshot) ── */}
            <header className="home-curved-dome-header">
              <AuroraFluidCanvas />

              {/* Top Navigation Row: Back Button + Kesari Logo & Actions */}
              <div className="dome-top-nav">
                <div className="dome-brand-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button 
                    className="explore-dome-back-btn" 
                    onClick={onBack} 
                    aria-label="Back to Home"
                  >
                    <AppIcon name="chevron-left" size={17} color="#FFFFFF" strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    className="dome-brand-trigger"
                    aria-label="View studio information"
                    onClick={onOpenCitySelector}
                  >
                    <img
                      src="/assets/kesari-logo.png"
                      alt=""
                      className="dome-kesari-brand-logo"
                    />
                  </button>
                </div>

                <div className="dome-nav-actions">
                  <motion.button 
                    className="dome-glass-btn" 
                    onClick={onOpenNotifications}
                    whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                    whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
                    aria-label="Notifications"
                  >
                    <AppIcon name="bell" size={13} color="#FFFFFF" strokeWidth={2.2} />
                    {unreadCount > 0 && <span className="dome-bell-dot" />}
                  </motion.button>

                  <motion.button
                    type="button"
                    className="dome-avatar-halo" 
                    onClick={onOpenProfile}
                    whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                    whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
                    aria-label="Open profile"
                    title="Profile"
                  >
                    <span className="dome-halo-ring" />
                    <img src="/assets/gregory_face.png" alt="Gregory" className="dome-avatar-img" />
                  </motion.button>
                </div>
              </div>

              {/* Main Stage Live Feature Display with Transparent Glass (Dynamic Featured Event) */}
              <motion.div 
                className="dome-hero-spotlight"
                onClick={() => onSelectEvent(featuredEvent.id || 'amour')}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
              >
                <div className="dome-hero-inner-content">
                  <div className="dome-eyebrow-row">
                    <div className="dome-live-pill">
                      <span className="live-pulse-dot" />
                      <span className="dome-live-tag">
                        {featuredEvent.badge ? featuredEvent.badge.toUpperCase() : 'FEATURED SHOW • KESARI STUDIO'}
                      </span>
                    </div>
                    <span className="dome-db-badge">{featuredEvent.decibels || 'Acoustic Symphony'}</span>
                  </div>

                  <div className="dome-headline-row">
                    <h1 className="dome-act-title">{featuredEvent.title || 'Studio Special Experience'}</h1>
                    <div className="dome-soundwave-bars" aria-label="Live audio waveform">
                      <span className="wave-bar bar-1" />
                      <span className="wave-bar bar-2" />
                      <span className="wave-bar bar-3" />
                      <span className="wave-bar bar-4" />
                      <span className="wave-bar bar-5" />
                    </div>
                  </div>

                  <div className="dome-footer-row">
                    <div className="dome-timing-info">
                      <span className="dome-subtext">
                        {featuredEvent.date} • {featuredEvent.room?.split('(')[0]?.trim() || featuredEvent.venueShort || 'Kesari Studio'}
                      </span>
                    </div>
                    
                    <motion.button 
                      className="dome-tune-btn"
                      type="button"
                      data-surface-light="control"
                      aria-label={`View passes for ${featuredEvent.title || 'Studio Special Experience'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(featuredEvent.id || 'amour');
                      }}
                      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                      whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
                    >
                      <span>Pass {featuredEvent.priceLabel || `₹${featuredEvent.price?.toLocaleString() || 1800}`}</span>
                      <AppIcon name="arrow-up-right" size={11} color="#FFFFFF" strokeWidth={2.6} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </header>

      {/* ── 2. The Warm Alabaster Sheet (Matches Home Screen) ── */}
      <main className="explore-warm-sheet">
        {/* Shows Count Subtitle (Matches Screenshot) */}
        <div className="section-title-row" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="section-label" style={{ fontFamily: 'var(--font-family-display)', fontSize: '13.5px', fontWeight: 700, color: '#12131A', letterSpacing: '-0.015em' }}>Studio Lineup</span>
          <span className="section-meta" style={{ fontSize: '10.5px', fontWeight: 600, color: '#8E92A0' }}>Live This Week</span>
        </div>

        {/* Minimal Vibe Pills */}
        <div className="explore-vibe-pills-row">
          {VIBE_FILTERS.map(vibe => {
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                className={`vibe-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedVibe(vibe.id)}
                type="button"
                aria-pressed={isSelected}
              >
                <span className="vibe-chip-label">{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Minimal Event Cards Stream (Matches Home Screen Poster Pass Language) */}
        <div className="explore-cards-stream">
          {filteredEvents.map((event, index) => {
            const mainArtist = event.lineup?.[0]?.name || '';

            return (
              <motion.article
                key={event.id}
                className="explore-poster-card"
                onClick={() => onSelectEvent(event.id)}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
                whileTap={reduceMotion ? { opacity: 0.94 } : { scale: 0.98 }}
              >
                {/* Background Photography Layer */}
                <div 
                  className="explore-card-bg-img"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="explore-card-vignette" />

                {/* Top Floating Badge Row */}
                <div className="explore-card-top-row">
                  <span className="explore-stage-badge">
                    {event.room?.split('(')[0]?.trim() || event.category || 'Live Studio'}
                  </span>

                  <div className="explore-arrow-circle">
                    <AppIcon name="arrow-up-right" size={12} color="#FFFFFF" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Bottom Frosted Info Drawer */}
                <div className="explore-card-drawer">
                  <div className="explore-timing-row">
                    <span className="explore-timing-dot" />
                    <span className="explore-timing-text">{event.date} • {event.time?.split('-')[0]?.trim()}</span>
                  </div>

                  <h2 className="explore-card-title">{event.title}</h2>
                  {mainArtist && (
                    <p className="explore-card-artist">{mainArtist}</p>
                  )}

                  <div className="explore-card-footer">
                    <span className="explore-price-val">{event.priceLabel || `₹${event.price}`}</span>
                    <button 
                      className="explore-claim-btn"
                      type="button"
                      data-surface-light="control"
                      aria-label={`View passes for ${event.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event.id);
                      }}
                    >
                      <span>Pass</span>
                      <AppIcon name="chevron-right" size={10} color="#FFFFFF" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="explore-empty-box">
              <p>No shows scheduled for this filter.</p>
              <button 
                className="explore-empty-reset"
                onClick={() => {
                  setSelectedDateTab('all');
                  setSelectedVibe('all');
                }}
              >
                View all shows
              </button>
            </div>
          )}
        </div>

        {/* Space for Bottom Navigation */}
        <div className="explore-bottom-spacer" />
      </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
