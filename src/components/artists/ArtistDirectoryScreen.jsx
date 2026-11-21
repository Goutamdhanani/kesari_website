import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Play,
  X,
  ShieldCheck,
  MapPin,
  MessageCircle,
  ExternalLink,
  Instagram,
  CheckCircle2,
  Mic2,
  Music,
  Radio,
  ChevronLeft
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import AppIcon from '../common/AppIcon';
import { KESARI_CONTACT } from '../../data/kesariStudioData';
import '../mobile/HomeScreen.css';
import './ArtistDirectoryScreen.css';

// Helper to display strictly first name for individual artists while preserving band names
export const getArtistDisplayName = (artistOrName) => {
  if (!artistOrName) return '';
  const name = typeof artistOrName === 'string' ? artistOrName : artistOrName.name || '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  const genre = typeof artistOrName === 'object' ? (artistOrName.genre || '').toLowerCase() : '';
  const lowerName = trimmed.toLowerCase();

  // Bands, collectives, projects retain their group name
  if (
    genre.includes('band') ||
    lowerName.startsWith('the ') ||
    lowerName.includes('collective') ||
    lowerName.includes('project')
  ) {
    return trimmed;
  }

  // DJ acts
  if (lowerName.startsWith('dj ')) {
    const parts = trimmed.split(/\s+/);
    return `${parts[0]} ${parts[1] || ''}`.trim();
  }

  // Individual person: show ONLY first name
  const words = trimmed.split(/\s+/);
  return words[0];
};

const FILTER_CATEGORIES = [
  { id: 'All', label: 'All Artists' },
  { id: 'Vocalists', label: 'Vocalists', match: ['Singer / Vocalist', 'Singer', 'Vocalist'] },
  { id: 'Bands', label: 'Bands', match: ['Live Band', 'Band'] },
  { id: 'DJs', label: 'DJs', match: ['DJ / Electronic', 'DJ / Electronic Producer', 'DJ'] },
  { id: 'Stand-up', label: 'Stand-up', match: ['Stand-up Comedian', 'Stand-up', 'Comedy'] },
  { id: 'Instrumental', label: 'Instrumental', match: ['Instrumentalist', 'Instrumentalist (Guitar / Violin / Flute / Percussion)'] },
  { id: 'Poet', label: 'Poets & Writers', match: ['Poet / Spoken Word', 'Poet'] }
];

export default function ArtistDirectoryScreen({ onNavigate, onBack }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMicOnly, setOpenMicOnly] = useState(false);

  // Modals
  const [activeVideoArtist, setActiveVideoArtist] = useState(null);
  const [enquiryArtist, setEnquiryArtist] = useState(null);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    eventType: 'Concert / Live Gig',
    venue: '',
    notes: ''
  });
  const [enquiryErrors, setEnquiryErrors] = useState({});

  const handleGoToRegister = () => {
    if (typeof onNavigate === 'function') {
      onNavigate('artists/register');
    } else {
      window.history.pushState({}, '', '/artists/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else if (typeof onNavigate === 'function') {
      onNavigate('events');
    } else {
      window.history.back();
    }
  };

  // Fetch live approved artists
  useEffect(() => {
    let isMounted = true;
    const fetchArtists = async () => {
      try {
        const res = await fetch('/api/artists');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.artists || [];
          if (isMounted) {
            // Privacy guarantee: strip any phone or email from state
            const sanitized = list.map(a => {
              const { phone, email, ...safe } = a;
              return safe;
            });
            setArtists(sanitized);
          }
        } else {
          if (isMounted) setArtists([]);
        }
      } catch (err) {
        console.warn('Failed to fetch artists:', err);
        if (isMounted) setArtists([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArtists();
    return () => {
      isMounted = false;
    };
  }, []);

  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const match = url.match(/[?&]v=([^&]+)/);
        if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      } else if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?]+)/);
        if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    } catch {}
    return null;
  };

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      if (activeFilter !== 'All') {
        const cat = FILTER_CATEGORIES.find((c) => c.id === activeFilter);
        if (cat?.match) {
          const matched = cat.match.some((m) =>
            artist.genre?.toLowerCase().includes(m.toLowerCase())
          );
          if (!matched) return false;
        } else if (!artist.genre?.toLowerCase().includes(activeFilter.toLowerCase())) {
          return false;
        }
      }

      if (openMicOnly && !artist.openMic) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = artist.name?.toLowerCase().includes(query);
        const matchesGenre = artist.genre?.toLowerCase().includes(query);
        const matchesBio = (artist.bio || artist.previousEvents || '').toLowerCase().includes(query);
        const matchesCity = artist.city?.toLowerCase().includes(query);
        if (!matchesName && !matchesGenre && !matchesBio && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [artists, activeFilter, openMicOnly, searchQuery]);

  const validatePhone = (raw) => {
    const cleaned = String(raw).replace(/[\s\-\(\)\+]/g, '');
    let digits = cleaned;
    if (cleaned.startsWith('91') && cleaned.length === 12) digits = cleaned.slice(2);
    else if (cleaned.startsWith('0') && cleaned.length === 11) digits = cleaned.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  };

  const handleOpenEnquiry = (artist) => {
    setEnquiryArtist(artist);
    setEnquirySubmitted(false);
    setEnquiryErrors({});
    setEnquiryData({
      name: '',
      phone: '',
      email: '',
      date: '',
      eventType: 'Concert / Live Set',
      venue: '',
      notes: ''
    });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!enquiryData.name.trim()) errors.name = 'Please enter your full name.';
    if (!validatePhone(enquiryData.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!enquiryData.date) errors.date = 'Please select your target event date.';

    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      return;
    }

    setEnquiryErrors({});
    setEnquirySubmitted(true);

    try {
      const existing = JSON.parse(localStorage.getItem('kesari_artist_enquiries') || '[]');
      existing.push({
        artistId: enquiryArtist.id,
        artistName: enquiryArtist.name,
        ...enquiryData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('kesari_artist_enquiries', JSON.stringify(existing));
    } catch {}
  };

  const generateWhatsAppEnquiryLink = () => {
    if (!enquiryArtist) return KESARI_CONTACT.whatsappUrl('Hi Kesari Studio, I want to query about booking an artist.');
    const displayName = getArtistDisplayName(enquiryArtist);
    const text = `Hi Kesari Studio! 🎵
I would like to enquire about booking *${displayName}* (${enquiryArtist.genre}) for an upcoming event.
• Date: ${enquiryData.date || 'TBD'}
• Event Type: ${enquiryData.eventType}
• Venue / City: ${enquiryData.venue || 'Bangalore'}
• My Name: ${enquiryData.name || 'Event Host'}
• Contact: ${enquiryData.phone || ''}

Please share artist availability and technical rider!`;
    return KESARI_CONTACT.whatsappUrl(text);
  };

  return (
    <div className="artist-directory-page">
      {/* ── 1. The Obsidian Curved Stage Dome Header (Matches ExploreEventsScreen) ── */}
      <header className="home-curved-dome-header artist-directory-dome">
        <AuroraFluidCanvas />

        {/* Top Nav inside Dome */}
        <div className="dome-top-nav">
          <div className="dome-brand-group">
            <button
              type="button"
              className="explore-dome-back-btn"
              onClick={handleBack}
              aria-label="Back"
            >
              <ChevronLeft size={18} color="#FFFFFF" />
            </button>
            <div className="dome-brand-trigger">
              <img
                src="/assets/kesari-logo.png"
                alt="Kesari Studio"
                className="dome-kesari-brand-logo"
              />
            </div>
            <div className="dome-venue-capsule">
              <span className="dome-live-beacon" />
              <span className="dome-venue-name">Koramangala 4th Block</span>
            </div>
          </div>

          <div className="dome-nav-actions">
            <button
              type="button"
              className="dome-register-cta-btn"
              onClick={handleGoToRegister}
            >
              <Sparkles size={13} />
              <span>Artist Call</span>
            </button>
          </div>
        </div>

        {/* Dome Hero Spotlight */}
        <div className="dome-hero-spotlight artist-spotlight-card">
          <div className="dome-eyebrow-row">
            <div className="dome-live-pill">
              <span className="live-pulse-dot" />
              <span className="dome-live-tag">KESARI TALENT ROSTER • CURATED ROSTER</span>
            </div>
            <div className="dome-soundwave-bars" aria-label="Audio wave">
              <span className="wave-bar bar-1" />
              <span className="wave-bar bar-2" />
              <span className="wave-bar bar-3" />
              <span className="wave-bar bar-4" />
              <span className="wave-bar bar-5" />
            </div>
          </div>

          <div className="dome-headline-row">
            <h1 className="dome-act-title">Book Indie Artists in Bangalore</h1>
          </div>

          <p className="artist-dome-description">
            Discover verified indie singers, live bands, stand-up comedians &amp; DJs from Bangalore. Direct studio bookings for concerts and private events.
          </p>

          {/* Top Registration Callout Pill */}
          <div
            className="artist-dome-register-pill"
            onClick={handleGoToRegister}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleGoToRegister()}
          >
            <div className="pill-left">
              <span className="pill-sparkle">★</span>
              <span className="pill-bold">Are you a performing artist?</span>
              <span className="pill-sub">Register for upcoming Kesari gigs ›</span>
            </div>
            <span className="pill-action-arrow">
              <ArrowRight size={14} />
            </span>
          </div>

          <div className="dome-privacy-banner">
            <ShieldCheck size={14} />
            <span>Artist personal phone & email are strictly confidential. Bookings curated through studio.</span>
          </div>
        </div>
      </header>

      {/* ── 2. Content Body ── */}
      <main className="artist-content-sheet">
        {/* Search & Genre Filters */}
        <section className="artist-controls-bar">
          <div className="artist-search-capsule">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              className="artist-search-field"
              placeholder="Search by artist name, genre, city, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search artists"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="artist-filter-pills-row" role="tablist">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeFilter === cat.id}
                className={`artist-pill ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`artist-pill open-mic-filter ${openMicOnly ? 'active' : ''}`}
              onClick={() => setOpenMicOnly(!openMicOnly)}
            >
              <Mic2 size={12} />
              <span>Open Mic Ready</span>
            </button>
          </div>
        </section>

        {/* Results Metadata */}
        <div className="artist-results-meta">
          <span className="meta-count">
            Showing <strong>{filteredArtists.length}</strong> {filteredArtists.length === 1 ? 'artist' : 'artists'}
          </span>
          <span className="meta-studio-tag">100% Studio Vetted</span>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <div className="empty-artists-state">
            <Music size={44} className="empty-icon" />
            <h3>No Artists Registered Yet</h3>
            <p>The Kesari stage roster is open. Are you a musician, singer, band, or comedian? Register to be featured on our stage.</p>
            <button
              type="button"
              className="reset-filters-btn"
              style={{ background: '#DAFB71', color: '#08080A', fontWeight: 800, marginTop: '12px' }}
              onClick={handleGoToRegister}
            >
              <Mic2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Register as an Artist
            </button>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="empty-artists-state">
            <Music size={44} className="empty-icon" />
            <h3>No artists matched your filters</h3>
            <p>Try resetting the search or category filters.</p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
                setOpenMicOnly(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="artist-cards-grid">
            {filteredArtists.map((artist) => {
              const displayName = getArtistDisplayName(artist);

              return (
                <article key={artist.id} className="artist-editorial-card">
                  {/* Photo / Media Box */}
                  <div className="card-media-wrapper">
                    <img
                      src={artist.photoUrl || '/assets/events/real_kesari/kesari_ev_03.jpg'}
                      alt={displayName}
                      className="card-artist-photo"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/events/hero.webp';
                      }}
                    />
                    <div className="card-photo-gradient" />

                    {/* Genre Badge */}
                    <span className="card-genre-pill">{artist.genre}</span>

                    {/* City Pill */}
                    <span className="card-city-pill">
                      <MapPin size={11} />
                      <span>{artist.city || 'Bangalore'}</span>
                    </span>

                    {/* Video sample trigger */}
                    {artist.videoUrl && (
                      <button
                        type="button"
                        className="card-video-sample-btn"
                        onClick={() => setActiveVideoArtist(artist)}
                        aria-label={`Watch performance sample of ${displayName}`}
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Watch Sample</span>
                      </button>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="card-content-wrapper">
                    <div className="card-title-row">
                      <h2 className="card-artist-name">{displayName}</h2>
                      {artist.openMic && (
                        <span className="card-openmic-badge" title="Open for Kesari open mics">
                          <Radio size={10} /> Open Mic
                        </span>
                      )}
                    </div>

                    <p className="card-bio-text">{artist.bio || artist.previousEvents}</p>

                    {artist.achievements && (
                      <div className="card-achievement-strip">
                        <Sparkles size={12} className="strip-sparkle" />
                        <span>{artist.achievements}</span>
                      </div>
                    )}

                    {/* Contact or Query Button directly to Kesari Studio (No price, no contact number) */}
                    <div className="card-action-row">
                      <button
                        type="button"
                        className="btn-enquire-primary"
                        onClick={() => handleOpenEnquiry(artist)}
                        aria-label={`Query Kesari Studio about ${displayName}`}
                      >
                        <MessageCircle size={15} />
                        <span>Query / Contact Us</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ── 3. Video Sample Lightbox Modal ── */}
      {activeVideoArtist && (
        <div
          className="modal-backdrop-dark"
          onClick={() => setActiveVideoArtist(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="video-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div>
                <span className="lightbox-genre">{activeVideoArtist.genre}</span>
                <h3 className="lightbox-name">{getArtistDisplayName(activeVideoArtist)} • Live Performance</h3>
              </div>
              <button
                type="button"
                className="modal-x-close"
                onClick={() => setActiveVideoArtist(null)}
                aria-label="Close video"
              >
                <X size={18} />
              </button>
            </div>

            <div className="lightbox-video-frame">
              {getEmbedVideoUrl(activeVideoArtist.videoUrl) ? (
                <iframe
                  src={getEmbedVideoUrl(activeVideoArtist.videoUrl)}
                  title={`${getArtistDisplayName(activeVideoArtist)} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="embedded-player"
                />
              ) : (
                <div className="external-video-box">
                  <Play size={44} />
                  <p>Performance video hosted externally.</p>
                  <a
                    href={activeVideoArtist.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ext-link"
                  >
                    <span>Open Performance Link</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            <div className="lightbox-footer">
              <span className="lightbox-note">
                Book <strong>{getArtistDisplayName(activeVideoArtist)}</strong> for live sets & private sessions.
              </span>
              <button
                type="button"
                className="btn-book-from-modal"
                onClick={() => {
                  const target = activeVideoArtist;
                  setActiveVideoArtist(null);
                  handleOpenEnquiry(target);
                }}
              >
                Query About This Artist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Booking & Enquiry Modal ── */}
      {enquiryArtist && (
        <div
          className="modal-backdrop-dark"
          onClick={() => setEnquiryArtist(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="enquiry-card-shell" onClick={(e) => e.stopPropagation()}>
            <div className="enquiry-shell-header">
              <div className="enquiry-artist-meta">
                <img
                  src={enquiryArtist.photoUrl || '/assets/events/real_kesari/kesari_ev_03.jpg'}
                  alt={getArtistDisplayName(enquiryArtist)}
                  className="enquiry-mini-avatar"
                />
                <div>
                  <span className="enquiry-mini-genre">{enquiryArtist.genre}</span>
                  <h3 className="enquiry-mini-title">Query About {getArtistDisplayName(enquiryArtist)}</h3>
                </div>
              </div>
              <button
                type="button"
                className="modal-x-close"
                onClick={() => setEnquiryArtist(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {!enquirySubmitted ? (
              <form onSubmit={handleEnquirySubmit} className="enquiry-form-body">
                <div className="enquiry-confidential-note">
                  <ShieldCheck size={15} />
                  <span>
                    Kesari Studio handles rider specs, sound equipment, and artist schedule coordination.
                  </span>
                </div>

                <div className="form-row-duo">
                  <div className={`form-field-unit ${enquiryErrors.name ? 'has-error' : ''}`}>
                    <label className="unit-label">Your Name <span className="req">*</span></label>
                    <input
                      type="text"
                      className="unit-input"
                      placeholder="e.g. Priya Nair"
                      value={enquiryData.name}
                      onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                      required
                    />
                    {enquiryErrors.name && <span className="err-msg">{enquiryErrors.name}</span>}
                  </div>

                  <div className={`form-field-unit ${enquiryErrors.phone ? 'has-error' : ''}`}>
                    <label className="unit-label">Phone (WhatsApp) <span className="req">*</span></label>
                    <input
                      type="tel"
                      className="unit-input"
                      placeholder="10-digit mobile number"
                      value={enquiryData.phone}
                      onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                      required
                    />
                    {enquiryErrors.phone && <span className="err-msg">{enquiryErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-row-duo">
                  <div className={`form-field-unit ${enquiryErrors.email ? 'has-error' : ''}`}>
                    <label className="unit-label">Email Address <span className="req">*</span></label>
                    <input
                      type="email"
                      className="unit-input"
                      placeholder="you@domain.com"
                      value={enquiryData.email}
                      onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                      required
                    />
                    {enquiryErrors.email && <span className="err-msg">{enquiryErrors.email}</span>}
                  </div>

                  <div className={`form-field-unit ${enquiryErrors.date ? 'has-error' : ''}`}>
                    <label className="unit-label">Target Date <span className="req">*</span></label>
                    <input
                      type="date"
                      className="unit-input"
                      value={enquiryData.date}
                      onChange={(e) => setEnquiryData({ ...enquiryData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {enquiryErrors.date && <span className="err-msg">{enquiryErrors.date}</span>}
                  </div>
                </div>

                <div className="form-row-duo">
                  <div className="form-field-unit">
                    <label className="unit-label">Event Type</label>
                    <select
                      className="unit-select"
                      value={enquiryData.eventType}
                      onChange={(e) => setEnquiryData({ ...enquiryData, eventType: e.target.value })}
                    >
                      <option value="Concert / Live Set">Concert / Live Set</option>
                      <option value="Private Party / Birthday">Private Party / Birthday</option>
                      <option value="Corporate Offsite / Mixer">Corporate Offsite / Mixer</option>
                      <option value="Wedding / Sangeet">Wedding / Sangeet</option>
                      <option value="College Festival">College Festival</option>
                      <option value="Cafe / Club Residency">Cafe / Club Residency</option>
                      <option value="Other">Other Custom Format</option>
                    </select>
                  </div>

                  <div className="form-field-unit">
                    <label className="unit-label">Venue / City</label>
                    <input
                      type="text"
                      className="unit-input"
                      placeholder="e.g. Bangalore"
                      value={enquiryData.venue}
                      onChange={(e) => setEnquiryData({ ...enquiryData, venue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field-unit">
                  <label className="unit-label">Message / Rider Notes</label>
                  <textarea
                    rows="2"
                    className="unit-textarea"
                    placeholder="Guest count, desired set length (e.g. 60 mins), sound gear needed..."
                    value={enquiryData.notes}
                    onChange={(e) => setEnquiryData({ ...enquiryData, notes: e.target.value })}
                  />
                </div>

                <div className="enquiry-actions-duo">
                  <button type="submit" className="btn-submit-booking">
                    Submit Query to Studio
                  </button>

                  <a
                    href={generateWhatsAppEnquiryLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-chat"
                  >
                    <MessageCircle size={16} />
                    <span>Query Studio on WhatsApp</span>
                  </a>
                </div>
              </form>
            ) : (
              /* Success confirmation view */
              <div className="enquiry-confirmed-box">
                <CheckCircle2 size={50} className="check-icon-large" />
                <h4>Query Received!</h4>
                <p>
                  Thank you, <strong>{enquiryData.name}</strong>. We have received your query regarding{' '}
                  <strong>{getArtistDisplayName(enquiryArtist)}</strong>. Kesari Studio will coordinate
                  availability, schedule, and technical rider confirmation with you directly.
                </p>

                <div className="confirmed-summary-pill">
                  <div><strong>Artist:</strong> {getArtistDisplayName(enquiryArtist)}</div>
                  <div><strong>Target Date:</strong> {enquiryData.date}</div>
                  <div><strong>Event:</strong> {enquiryData.eventType}</div>
                </div>

                <div className="confirmed-action-group">
                  <a
                    href={generateWhatsAppEnquiryLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-chat"
                  >
                    <MessageCircle size={16} />
                    <span>Direct WhatsApp Chat</span>
                  </a>
                  <button
                    type="button"
                    className="btn-done-modal"
                    onClick={() => setEnquiryArtist(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
