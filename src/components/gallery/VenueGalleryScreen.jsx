import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Building2, Sparkles, MessageCircle, Maximize2
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import './gallery.css';

export const VENUE_PHOTOS = [
  {
    id: 'v1',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Main Stage & Hall',
    image: '/assets/venue/IMG20260409211806.jpg'
  },
  {
    id: 'v2',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Main Stage Backline & Diffusers',
    image: '/assets/venue/IMG-20260209-WA0041.jpg'
  },
  {
    id: 'v3',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Main Stage Sound Rig & Lights',
    image: '/assets/events/kesari_stage_inside.jpg'
  },
  {
    id: 'v4',
    area: 'cafe',
    areaLabel: 'Cafe & Terrace',
    title: 'Cafe & Terrace Dining Space',
    image: '/assets/venue/IMG20260117212705.jpg'
  },
  {
    id: 'v5',
    area: 'cafe',
    areaLabel: 'Cafe & Terrace',
    title: 'Cafe & Terrace Open Courtyard',
    image: '/assets/events/cafe.webp'
  },
  {
    id: 'v6',
    area: 'lounge',
    areaLabel: 'Acoustic Lounge',
    title: 'Acoustic Lounge & Sofas',
    image: '/assets/venue/IMG20260116215909(1).jpg'
  },
  {
    id: 'v7',
    area: 'lounge',
    areaLabel: 'Acoustic Lounge',
    title: 'Acoustic Lounge Armchairs & Mics',
    image: '/assets/venue/IMG20260219184115.jpg'
  },
  {
    id: 'v8',
    area: 'lounge',
    areaLabel: 'Acoustic Lounge',
    title: 'Acoustic Lounge Timber Den',
    image: '/assets/events/kesari_lounge_inside.jpg'
  },
  {
    id: 'v9',
    area: 'studio',
    areaLabel: 'Recording Studio',
    title: 'Recording Studio & Rehearsal Floor',
    image: '/assets/venue/IMG20260115200347.jpg'
  },
  {
    id: 'v10',
    area: 'studio',
    areaLabel: 'Recording Studio',
    title: 'Recording Studio Sound Console',
    image: '/assets/events/kesari_gear_inside.jpg'
  },
  {
    id: 'v11',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Floor Chamber & Meditation Setup',
    image: '/assets/venue/IMG20260718173334.jpg'
  },
  {
    id: 'v12',
    area: 'cafe',
    areaLabel: 'Cafe & Terrace',
    title: 'Studio Entrance & Foyer',
    image: '/assets/venue/IMG20260811154834.jpg'
  },
  {
    id: 'v13',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Audience Seating & Stage View',
    image: '/assets/venue/IMG20260727002158.jpg'
  },
  {
    id: 'v14',
    area: 'lounge',
    areaLabel: 'Acoustic Lounge',
    title: 'Sunlit Acoustic Reading Den',
    image: '/assets/venue/IMG20260219175938.jpg'
  },
  {
    id: 'v15',
    area: 'stage',
    areaLabel: 'Main Stage',
    title: 'Main Stage Concert Floor',
    image: '/assets/events/hall.webp'
  },
  {
    id: 'v16',
    area: 'studio',
    areaLabel: 'Recording Studio',
    title: 'Recording Studio Workshop Room',
    image: '/assets/events/workshop.webp'
  }
];

export const VENUE_AREAS_META = {
  all: { id: 'all', name: 'All Areas' },
  stage: { id: 'stage', name: 'Main Stage' },
  lounge: { id: 'lounge', name: 'Acoustic Lounge' },
  studio: { id: 'studio', name: 'Recording Studio' },
  cafe: { id: 'cafe', name: 'Cafe & Terrace' }
};

export default function VenueGalleryScreen({ onNavigate, onBack }) {
  const [activeArea, setActiveArea] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const filteredPhotos = activeArea === 'all'
    ? VENUE_PHOTOS
    : VENUE_PHOTOS.filter(p => p.area === activeArea);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') {
      setLightboxIndex(null);
    } else if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  }, [lightboxIndex, filteredPhotos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="gallery-page-wrapper">
      <AuroraFluidCanvas />

      <div className="gallery-content-container">
        
        {/* Top Breadcrumb & Dual Switcher */}
        <div className="gallery-top-controls">
          <button 
            type="button" 
            className="gallery-back-breadcrumb" 
            onClick={() => (onBack ? onBack() : navigateTo('/'))}
            aria-label="Back to Home"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>

          {/* Segmented Switcher: Venue vs Event */}
          <div className="gallery-mode-segment-bar" role="tablist" aria-label="Gallery Collections">
            <button
              type="button"
              role="tab"
              aria-selected="true"
              className="mode-segment-btn is-active"
              onClick={() => navigateTo('/venue-gallery')}
            >
              <Building2 size={14} />
              <span>Venue</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="false"
              className="mode-segment-btn"
              onClick={() => navigateTo('/event-gallery')}
            >
              <Sparkles size={14} />
              <span>Events</span>
            </button>
          </div>
        </div>

        {/* Gallery Title Block */}
        <div className="clean-gallery-header">
          <h1 className="clean-gallery-title">Venue Gallery</h1>
          <p className="clean-gallery-subtitle">
            Explore our stage, acoustic lounge, recording rooms, and pure veg cafe in Koramangala.
          </p>
        </div>

        {/* Area Filter Pills */}
        <div className="clean-filter-pills-bar" role="group" aria-label="Filter Venue Areas">
          <button
            type="button"
            className={`clean-filter-pill ${activeArea === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveArea('all')}
          >
            <span>All Spaces</span>
            <span className="pill-count">{VENUE_PHOTOS.length}</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeArea === 'stage' ? 'is-active' : ''}`}
            onClick={() => setActiveArea('stage')}
          >
            <span>Main Stage</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeArea === 'lounge' ? 'is-active' : ''}`}
            onClick={() => setActiveArea('lounge')}
          >
            <span>Acoustic Lounge</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeArea === 'studio' ? 'is-active' : ''}`}
            onClick={() => setActiveArea('studio')}
          >
            <span>Recording Studio</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeArea === 'cafe' ? 'is-active' : ''}`}
            onClick={() => setActiveArea('cafe')}
          >
            <span>Cafe &amp; Terrace</span>
          </button>
        </div>

        {/* Pure Photo Gallery Grid (No text clutter, pure visual craft) */}
        <div className="clean-photo-masonry-grid" role="region" aria-label="Venue Photos">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="clean-photo-card"
              onClick={() => setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLightboxIndex(index)}
              aria-label={`View ${photo.title}`}
            >
              <img 
                src={photo.image} 
                alt={photo.title} 
                className="clean-grid-img" 
                loading="lazy"
                decoding="async"
              />
              <div className="photo-card-hover-overlay">
                <span className="photo-title-pill">{photo.title}</span>
                <span className="photo-zoom-icon">
                  <Maximize2 size={15} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking CTA Strip */}
        <div className="gallery-bottom-cta-strip">
          <div className="cta-strip-text">
            <h3>Want to host your show or private gathering here?</h3>
            <p>Concerts, jam circles, standup specials, and creator workshops.</p>
          </div>
          <div className="cta-strip-actions">
            <button 
              type="button" 
              className="btn-gallery-book"
              onClick={() => navigateTo('/book')}
            >
              <span>Book a Space</span>
              <ArrowRight size={14} />
            </button>
            <a 
              href="https://wa.me/917760539955?text=Hello%20Kesari%20Studio%2C%20I%20saw%20your%20venue%20gallery%20and%20want%20to%20enquire%20about%20booking%20a%20space."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gallery-whatsapp"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Studio</span>
            </a>
          </div>
        </div>

      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && activePhoto && (
        <div 
          className="gallery-lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
        >
          {/* Top Bar with Title, Counter and Close Button */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-photo-title">{activePhoto.title}</span>
            <div className="lightbox-counter-group">
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <button
                type="button"
                className="btn-lightbox-close"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox (Escape)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Photo Area */}
          <div className="lightbox-image-stage" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)}
              aria-label="Previous Photo"
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="lightbox-full-img"
            />

            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length)}
              aria-label="Next Photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
