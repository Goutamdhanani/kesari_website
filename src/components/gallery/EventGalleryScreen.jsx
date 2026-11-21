import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Building2, Sparkles, MessageCircle, Maximize2
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import './gallery.css';

export const EVENT_PHOTOS = [
  {
    id: 'e1',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 1',
    image: '/assets/events/real_kesari/kesari_ev_01.jpg'
  },
  {
    id: 'e2',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 2',
    image: '/assets/events/real_kesari/kesari_ev_02.jpg'
  },
  {
    id: 'e3',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 3',
    image: '/assets/events/real_kesari/kesari_ev_03.jpg'
  },
  {
    id: 'e4',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 4',
    image: '/assets/events/real_kesari/kesari_ev_04.jpg'
  },
  {
    id: 'e5',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 5',
    image: '/assets/events/real_kesari/kesari_ev_05.jpg'
  },
  {
    id: 'e6',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 6',
    image: '/assets/events/real_kesari/kesari_ev_06.jpg'
  },
  {
    id: 'e7',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 7',
    image: '/assets/events/real_kesari/kesari_ev_07.jpg'
  },
  {
    id: 'e8',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 8',
    image: '/assets/events/real_kesari/kesari_ev_08.jpg'
  },
  {
    id: 'e9',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 9',
    image: '/assets/events/real_kesari/kesari_ev_09.jpg'
  },
  {
    id: 'e10',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 10',
    image: '/assets/events/real_kesari/kesari_ev_10.jpg'
  },
  {
    id: 'e11',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 11',
    image: '/assets/events/real_kesari/kesari_ev_11.jpg'
  },
  {
    id: 'e12',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 12',
    image: '/assets/events/real_kesari/kesari_ev_12.jpg'
  },
  {
    id: 'e13',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 13',
    image: '/assets/events/real_kesari/kesari_ev_13.jpg'
  },
  {
    id: 'e14',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 14',
    image: '/assets/events/real_kesari/kesari_ev_14.jpg'
  },
  {
    id: 'e15',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 15',
    image: '/assets/events/real_kesari/kesari_ev_15.jpg'
  },
  {
    id: 'e16',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 16',
    image: '/assets/events/real_kesari/kesari_ev_16.jpg'
  },
  {
    id: 'e17',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 17',
    image: '/assets/events/real_kesari/kesari_ev_17.jpg'
  },
  {
    id: 'e18',
    category: 'openmic',
    categoryLabel: 'Open Mic',
    title: 'Qala Open Mic & Poetry • Session 18',
    image: '/assets/events/real_kesari/kesari_ev_18.jpg'
  },
  {
    id: 'e19',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 19',
    image: '/assets/events/real_kesari/kesari_ev_19.jpg'
  },
  {
    id: 'e20',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 20',
    image: '/assets/events/real_kesari/kesari_ev_20.jpg'
  },
  {
    id: 'e21',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 21',
    image: '/assets/events/real_kesari/kesari_ev_21.jpg'
  },
  {
    id: 'e22',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 22',
    image: '/assets/events/real_kesari/kesari_ev_22.jpg'
  },
  {
    id: 'e23',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 23',
    image: '/assets/events/real_kesari/kesari_ev_23.jpg'
  },
  {
    id: 'e24',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 24',
    image: '/assets/events/real_kesari/kesari_ev_24.jpg'
  },
  {
    id: 'e25',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 25',
    image: '/assets/events/real_kesari/kesari_ev_25.jpg'
  },
  {
    id: 'e26',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 26',
    image: '/assets/events/real_kesari/kesari_ev_26.jpg'
  },
  {
    id: 'e27',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 27',
    image: '/assets/events/real_kesari/kesari_ev_27.jpg'
  },
  {
    id: 'e28',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 28',
    image: '/assets/events/real_kesari/kesari_ev_28.jpg'
  },
  {
    id: 'e29',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 29',
    image: '/assets/events/real_kesari/kesari_ev_29.jpg'
  },
  {
    id: 'e30',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 30',
    image: '/assets/events/real_kesari/kesari_ev_30.jpg'
  },
  {
    id: 'e31',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 31',
    image: '/assets/events/real_kesari/kesari_ev_31.jpg'
  },
  {
    id: 'e32',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 32',
    image: '/assets/events/real_kesari/kesari_ev_32.jpg'
  },
  {
    id: 'e33',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Sukoon Acoustic Jam • Session 33',
    image: '/assets/events/real_kesari/kesari_ev_33.jpg'
  },
  {
    id: 'e34',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Flash Jam Community Night • Session 34',
    image: '/assets/events/real_kesari/kesari_ev_34.jpg'
  },
  {
    id: 'e35',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Flash Jam Community Night • Session 35',
    image: '/assets/events/real_kesari/kesari_ev_35.jpg'
  },
  {
    id: 'e36',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Flash Jam Community Night • Session 36',
    image: '/assets/events/real_kesari/kesari_ev_36.jpg'
  },
  {
    id: 'e37',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Flash Jam Community Night • Session 37',
    image: '/assets/events/real_kesari/kesari_ev_37.jpg'
  },
  {
    id: 'e38',
    category: 'jams',
    categoryLabel: 'Acoustic Jam',
    title: 'Flash Jam Community Night • Session 38',
    image: '/assets/events/real_kesari/kesari_ev_38.jpg'
  },
  {
    id: 'e39',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 39',
    image: '/assets/events/real_kesari/kesari_ev_39.jpg'
  },
  {
    id: 'e40',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 40',
    image: '/assets/events/real_kesari/kesari_ev_40.jpg'
  },
  {
    id: 'e41',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 41',
    image: '/assets/events/real_kesari/kesari_ev_41.jpg'
  },
  {
    id: 'e42',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 42',
    image: '/assets/events/real_kesari/kesari_ev_42.jpg'
  },
  {
    id: 'e43',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 43',
    image: '/assets/events/real_kesari/kesari_ev_43.jpg'
  },
  {
    id: 'e44',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 44',
    image: '/assets/events/real_kesari/kesari_ev_44.jpg'
  },
  {
    id: 'e45',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 45',
    image: '/assets/events/real_kesari/kesari_ev_45.jpg'
  },
  {
    id: 'e46',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 46',
    image: '/assets/events/real_kesari/kesari_ev_46.jpg'
  },
  {
    id: 'e47',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 47',
    image: '/assets/events/real_kesari/kesari_ev_47.jpg'
  },
  {
    id: 'e48',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 48',
    image: '/assets/events/real_kesari/kesari_ev_48.jpg'
  },
  {
    id: 'e49',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 49',
    image: '/assets/events/real_kesari/kesari_ev_49.jpg'
  },
  {
    id: 'e50',
    category: 'workshops',
    categoryLabel: 'Workshop',
    title: 'Community Drum Circle • Session 50',
    image: '/assets/events/real_kesari/kesari_ev_50.jpg'
  },
  {
    id: 'e51',
    category: 'concerts',
    categoryLabel: 'Concert',
    title: 'Mehfil-e-Kesari Acoustic • Session 51',
    image: '/assets/events/real_kesari/kesari_ev_51.jpg'
  },
  {
    id: 'e52',
    category: 'concerts',
    categoryLabel: 'Concert',
    title: 'Mehfil-e-Kesari Acoustic • Session 52',
    image: '/assets/events/real_kesari/kesari_ev_52.jpg'
  },
  {
    id: 'e53',
    category: 'concerts',
    categoryLabel: 'Concert',
    title: 'Mehfil-e-Kesari Acoustic • Session 53',
    image: '/assets/events/real_kesari/kesari_ev_53.jpg'
  },
  {
    id: 'e54',
    category: 'concerts',
    categoryLabel: 'Concert',
    title: 'Mehfil-e-Kesari Acoustic • Session 54',
    image: '/assets/events/real_kesari/kesari_ev_54.jpg'
  },
  {
    id: 'e55',
    category: 'concerts',
    categoryLabel: 'Concert',
    title: 'Mehfil-e-Kesari Acoustic • Session 55',
    image: '/assets/events/real_kesari/kesari_ev_55.jpg'
  },
];

export const EVENT_HIGHLIGHTS = EVENT_PHOTOS;

export default function EventGalleryScreen({ onNavigate, onBack }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const filteredPhotos = activeCategory === 'all'
    ? EVENT_PHOTOS
    : EVENT_PHOTOS.filter(p => p.category === activeCategory);

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
              aria-selected="false"
              className="mode-segment-btn"
              onClick={() => navigateTo('/venue-gallery')}
            >
              <Building2 size={14} />
              <span>Venue</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="true"
              className="mode-segment-btn is-active"
              onClick={() => navigateTo('/event-gallery')}
            >
              <Sparkles size={14} />
              <span>Events</span>
            </button>
          </div>
        </div>

        {/* Gallery Title Block */}
        <div className="clean-gallery-header">
          <h1 className="clean-gallery-title">Event Highlights</h1>
          <p className="clean-gallery-subtitle">
            Concerts, indie gigs, candlelight jams, and open mics live at Kesari.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="clean-filter-pills-bar" role="group" aria-label="Filter Event Categories">
          <button
            type="button"
            className={`clean-filter-pill ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>All Shows</span>
            <span className="pill-count">{EVENT_PHOTOS.length}</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeCategory === 'concerts' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('concerts')}
          >
            <span>Concerts</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeCategory === 'jams' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('jams')}
          >
            <span>Acoustic Jams</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeCategory === 'openmic' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('openmic')}
          >
            <span>Open Mics</span>
          </button>
          <button
            type="button"
            className={`clean-filter-pill ${activeCategory === 'workshops' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('workshops')}
          >
            <span>Workshops</span>
          </button>
        </div>

        {/* Pure Photo Gallery Grid (Clean, un-cluttered, pure visual focus) */}
        <div className="clean-photo-masonry-grid" role="region" aria-label="Event Highlights Photos">
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
            <h3>Looking for upcoming live shows in Bangalore?</h3>
            <p>Explore this week's concerts, indie gigs, and acoustic evenings.</p>
          </div>
          <div className="cta-strip-actions">
            <button 
              type="button" 
              className="btn-gallery-book"
              onClick={() => navigateTo('/events')}
            >
              <span>Explore Shows</span>
              <ArrowRight size={14} />
            </button>
            <a 
              href="https://wa.me/917760539955?text=Hello%20Kesari%20Studio%2C%20I%20want%20to%20know%20about%20upcoming%20shows%20and%20passes."
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
