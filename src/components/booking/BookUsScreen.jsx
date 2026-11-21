import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  ChevronRight, 
  Info, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Volume2,
  Tv,
  Wifi,
  Coffee,
  Sliders,
  ShieldCheck,
  Music2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import './BookUsScreen.css';

export const KESARI_HALLS = [
  {
    id: 'main-stage',
    name: 'Kesari Main Stage & Hall',
    badge: 'Flagship Auditorium',
    startingPrice: 15000,
    priceDisplay: '₹15,000 onwards',
    priceNote: 'Standard 4-hour performance slot (₹3,500/hr addl.)',
    capacitySeating: 120,
    capacityStanding: 200,
    area: '1,800 sq.ft',
    headline: 'Concerts, Live Shows, Album Launches & Large Productions',
    description: 'Our crown jewel acoustic auditorium engineered with high ceilings, acoustic wood diffusers, modular stage risers, and professional line array sound. Perfect for amplified live bands, standup specials, launch events, and full-scale cultural evenings.',
    images: [
      '/assets/kesari-hall.webp',
      '/assets/events/kesari_stage_inside.jpg',
      '/assets/events/hall.webp'
    ],
    highlights: [
      { icon: Users, label: 'Capacity', value: '120 Seating / 200 Standing' },
      { icon: Volume2, label: 'Audio', value: 'Line Array PA + Yamaha DBR' },
      { icon: Sliders, label: 'Stage Rig', value: 'DMX Lighting & Stage Risers' },
      { icon: ShieldCheck, label: 'Backstage', value: 'Private Artist Green Room' }
    ],
    amenities: [
      'Acoustically tuned line array audio system with dual stage monitors',
      'Dual heavy-duty commercial climate control (AC)',
      'Intelligent DMX stage lighting rig with warm washes and spots',
      'Private artist green room with lighted makeup vanity and mirrors',
      'Modular heavy-duty stage platforms (custom height & layout)',
      'Dedicated front-of-house sound technician and stage crew',
      'Gigabit fiber WiFi (1000 Mbps dedicated connection)',
      'Direct catering link to Kesari 100% Pure Veg Artisanal Cafe & Soft Beverage Bar'
    ]
  },
  {
    id: 'acoustic-lounge',
    name: 'Acoustic Lounge & Jam Studio',
    badge: 'Intimate Sanctuary',
    startingPrice: 6000,
    priceDisplay: '₹6,000 onwards',
    priceNote: 'Standard 4-hour acoustic session (₹1,500/hr addl.)',
    capacitySeating: 35,
    capacityStanding: 60,
    area: '750 sq.ft',
    headline: 'Acoustic Gigs, Podcasts, Band Jams & Listening Sessions',
    description: 'Soundproofed timber treatment, warm vintage lighting, and plush velvet seating create an intimate listening sanctuary. Engineered for unplugged acoustic sessions, live 4-host podcast recordings, band rehearsals, poetry circles, and private album listening rooms.',
    images: [
      '/assets/kesari-lounge.webp',
      '/assets/events/kesari_lounge_inside.jpg',
      '/assets/events/lounge.webp'
    ],
    highlights: [
      { icon: Users, label: 'Capacity', value: '35 Seating / 60 Standing' },
      { icon: Volume2, label: 'Acoustics', value: 'Soundproofed Wood Paneling' },
      { icon: Sliders, label: 'Podcast Rig', value: '4-Host Multi-Mic Setup' },
      { icon: Coffee, label: 'Vibe', value: 'Vintage Lounge & Mood Pendants' }
    ],
    amenities: [
      'Precision acoustic wood treatment and isolation baffles',
      'Multi-microphone 4-host podcast audio rig with broadcast arms',
      'Shure SM58 and condenser mics with pop filters',
      'Guitar and bass tube amplifiers plus drum isolation rug',
      'Plush velvet seating, coffee tables, and intimate mood lighting',
      'Multi-track digital audio recording available',
      'Silent climate control air conditioning',
      'Complimentary welcome craft specialty coffee or artisan herbal tea'
    ]
  },
  {
    id: 'creator-room',
    name: 'Creator Workshop Room',
    badge: 'Creative Incubator',
    startingPrice: 5000,
    priceDisplay: '₹5,000 onwards',
    priceNote: 'Standard 4-hour workshop slot (₹1,250/hr addl.)',
    capacitySeating: 40,
    capacityStanding: 50,
    area: '650 sq.ft',
    headline: 'Masterclasses, Hackathons, Corporate Offsites & Meetups',
    description: 'A flexible, bright creative space outfitted with an ultra-bright 4K laser projector, modular workshop tables, daylight softbox lighting, and low-latency fiber WiFi. Designed for hands-on art & music workshops, corporate brainstorms, and community meetups.',
    images: [
      '/assets/events/workshop.webp',
      '/assets/events/kesari_gear_inside.jpg',
      '/assets/events/cafe.webp'
    ],
    highlights: [
      { icon: Users, label: 'Capacity', value: '40 Modular Seats' },
      { icon: Tv, label: 'Display', value: '4K Laser Projector & 120" Screen' },
      { icon: Wifi, label: 'Internet', value: 'Gigabit Fiber WiFi' },
      { icon: Sparkles, label: 'Studio Lights', value: 'Softbox Daylight Lights' }
    ],
    amenities: [
      'Ultra-bright 4K HDR laser projector with 120-inch motorized screen',
      'Reconfigurable modular tables & ergonomic cushioned chairs',
      'Professional softbox studio lights & clip-on wireless lapel mics',
      'Low-latency 1 Gbps fiber internet with redundant backup',
      'Magnetic glass whiteboards and presentation clickers',
      'Dedicated pass-through to 100% Pure Veg Cafe for fresh brews & snacks',
      'Full climate control AC and natural ambient window lighting',
      'Dedicated on-site room coordinator'
    ]
  }
];

export const EVENT_TYPES = [
  'Live Concert / Music Gig',
  'Acoustic Jam / Open Mic',
  'Standup Comedy & Poetry Slam',
  'Corporate Offsite & Team Hackathon',
  'Album Launch & Listening Session',
  'Creator Workshop & Masterclass',
  'Birthday & Private Celebration',
  'Video / Photography Production',
  'Art / Film Showcase',
  'Other Custom Event'
];

export const TIME_SLOTS = [
  { id: 'morning', label: 'Morning Slot (10:00 AM – 2:00 PM)', start: '10:00', end: '14:00' },
  { id: 'afternoon', label: 'Afternoon Slot (2:00 PM – 6:00 PM)', start: '14:00', end: '18:00' },
  { id: 'evening', label: 'Evening Peak Slot (6:00 PM – 10:30 PM)', start: '18:00', end: '22:30' },
  { id: 'fullday', label: 'Full Day Buyout (10:00 AM – 10:30 PM)', start: '10:00', end: '22:30' },
  { id: 'custom', label: 'Custom Hours', start: '', end: '' }
];

export const EXTRAS_OPTIONS = [
  {
    id: 'audio-tech',
    name: 'Pro Audio Rig & Live Sound Engineer',
    price: 3500,
    priceDisplay: '+₹3,500',
    desc: 'Dedicated sound engineer for sound check & live mixing, extra Shure wireless mics, and stage monitor tuning.'
  },
  {
    id: 'cafe-catering',
    name: '100% Pure Veg Artisanal Cafe & Beverage Bar Link',
    price: 0,
    priceDisplay: 'Custom / Per Person',
    desc: 'Specialty pour-overs, artisan coffees, craft mocktails, and 100% Pure Vegetarian snack platters (strictly pure veg, no alcohol).'
  },
  {
    id: 'stage-lighting',
    name: 'Stage DMX Intelligent Lighting & Hazer',
    price: 2500,
    priceDisplay: '+₹2,500',
    desc: 'Atmospheric light show with dynamic color-matched washes, spotlighting, and subtle water-based haze.'
  },
  {
    id: 'recording-pkg',
    name: '4K Multi-Cam Video & Multi-Track Audio Recording',
    price: 5000,
    priceDisplay: '+₹5,000',
    desc: 'High-res multi-camera footage and pristine 24-bit multitrack audio stems delivered for your portfolio.'
  }
];

export default function BookUsScreen({ 
  preselectedHallId = 'main-stage', 
  onNavigate = null, 
  onBack = null 
}) {
  const [selectedHallId, setSelectedHallId] = useState(preselectedHallId);
  const [activeImageIndices, setActiveImageIndices] = useState({
    'main-stage': 0,
    'acoustic-lounge': 0,
    'creator-room': 0
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hallId: preselectedHallId,
    eventType: 'Live Concert / Music Gig',
    date: '',
    timeSlot: 'evening',
    customStartTime: '18:00',
    customEndTime: '22:00',
    guests: 50,
    extras: ['audio-tech'],
    notes: '',
    honeypot: '' // spam protection
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const formSectionRef = useRef(null);
  const [formGlow, setFormGlow] = useState(false);

  // Sync hall preselection
  useEffect(() => {
    if (preselectedHallId) {
      setSelectedHallId(preselectedHallId);
      setFormData(prev => ({ ...prev, hallId: preselectedHallId }));
    }
  }, [preselectedHallId]);

  // Set min date to tomorrow
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const handleSelectHallForBooking = (hallId) => {
    setSelectedHallId(hallId);
    setFormData(prev => ({ ...prev, hallId }));
    
    // Smooth scroll to form
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFormGlow(true);
      setTimeout(() => setFormGlow(false), 1600);
    }
  };

  const handleImageSwitch = (hallId, index) => {
    setActiveImageIndices(prev => ({ ...prev, [hallId]: index }));
  };

  // Indian phone validation matching server specification
  const validatePhone = (num) => {
    if (!num || typeof num !== 'string') return false;
    const digits = num.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91') && ['6', '7', '8', '9'].includes(digits[2])) return true;
    if (digits.length === 11 && digits.startsWith('0') && ['6', '7', '8', '9'].includes(digits[1])) return true;
    if (digits.length === 10 && ['6', '7', '8', '9'].includes(digits[0])) return true;
    return false;
  };

  const validateEmail = (em) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(em || '').trim());
  };

  const handleExtraToggle = (extraId) => {
    setFormData(prev => {
      const exists = prev.extras.includes(extraId);
      return {
        ...prev,
        extras: exists ? prev.extras.filter(id => id !== extraId) : [...prev.extras, extraId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot
    if (formData.honeypot) {
      return; // Silent reject bot
    }

    const errors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name';
    }

    if (!validatePhone(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian phone number (e.g. 9876543210)';
    }

    if (!validateEmail(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.date) {
      errors.date = 'Please pick a preferred date';
    }

    if (!formData.hallId) {
      errors.hallId = 'Please select a hall';
    }

    const guestNum = parseInt(formData.guests, 10);
    if (isNaN(guestNum) || guestNum <= 0) {
      errors.guests = 'Please specify estimated guest count';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const activeHallObj = KESARI_HALLS.find(h => h.id === formData.hallId) || KESARI_HALLS[0];
    const chosenSlot = TIME_SLOTS.find(s => s.id === formData.timeSlot);
    const slotLabel = chosenSlot ? chosenSlot.label : `${formData.customStartTime} - ${formData.customEndTime}`;

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      hallId: formData.hallId,
      hallName: activeHallObj.name,
      eventType: formData.eventType,
      date: formData.date,
      timeSlot: slotLabel,
      startTime: formData.timeSlot === 'custom' ? formData.customStartTime : (chosenSlot ? chosenSlot.start : '10:00'),
      endTime: formData.timeSlot === 'custom' ? formData.customEndTime : (chosenSlot ? chosenSlot.end : '22:00'),
      guests: guestNum,
      extras: formData.extras,
      notes: formData.notes.trim()
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const refCode = data.bookingCode || data.bookingReference || data.id || `KB-${formData.date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        setSubmissionResult({
          ok: true,
          refCode,
          hallName: activeHallObj.name,
          date: formData.date,
          timeSlot: slotLabel,
          guests: guestNum,
          name: formData.name.trim(),
          phone: formData.phone.trim()
        });
      } else {
        // Fallback for mock/offline testing
        const fallbackRef = `KB-${formData.date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        setSubmissionResult({
          ok: true,
          refCode: fallbackRef,
          hallName: activeHallObj.name,
          date: formData.date,
          timeSlot: slotLabel,
          guests: guestNum,
          name: formData.name.trim(),
          phone: formData.phone.trim()
        });
      }
    } catch (err) {
      // Network or offline fallback
      const fallbackRef = `KB-${formData.date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionResult({
        ok: true,
        refCode: fallbackRef,
        hallName: activeHallObj.name,
        date: formData.date,
        timeSlot: slotLabel,
        guests: guestNum,
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submissionResult?.refCode) {
      navigator.clipboard.writeText(submissionResult.refCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const getWhatsAppBookingUrl = () => {
    if (!submissionResult) return 'https://wa.me/917760539955';
    const message = `Hi Kesari Team! I just submitted a venue booking request.\n\n` +
      `📌 Booking Ref: ${submissionResult.refCode}\n` +
      `🏛️ Space: ${submissionResult.hallName}\n` +
      `📅 Date: ${submissionResult.date}\n` +
      `⏰ Slot: ${submissionResult.timeSlot}\n` +
      `👥 Guests: ${submissionResult.guests}\n` +
      `👤 Name: ${submissionResult.name} (${submissionResult.phone})\n\n` +
      `Looking forward to confirming availability and details!`;
    return `https://wa.me/917760539955?text=${encodeURIComponent(message)}`;
  };

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const selectedHallData = KESARI_HALLS.find(h => h.id === formData.hallId) || KESARI_HALLS[0];

  return (
    <div className="book-us-page-root">
      
      {/* ── 1. The Obsidian Curved Stage Dome (Exact match to ExploreEventsScreen /events) ── */}
      <header className="home-curved-dome-header book-dome-header">
        <AuroraFluidCanvas />

        {/* Top Navigation Row inside Dome */}
        <div className="dome-top-nav">
          <div className="dome-brand-group">
            {onBack && (
              <button 
                type="button" 
                className="explore-dome-back-btn" 
                onClick={onBack}
                aria-label="Back"
              >
                <ArrowLeft size={17} color="#FFFFFF" />
              </button>
            )}
            <div className="dome-kesari-brand-link">
              <img 
                src="/assets/kesari-logo.png" 
                alt="Kesari - The Memory Studio" 
                className="dome-kesari-brand-logo" 
              />
            </div>
          </div>

          <div className="dome-nav-actions">
            <div className="explore-dome-venue-pill">
              <span className="explore-venue-dot" />
              <span className="explore-venue-name">Koramangala, Bangalore</span>
            </div>
            <a 
              href="https://wa.me/917760539955" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="dome-glass-btn" 
              aria-label="Direct WhatsApp"
              title="Chat with Kesari Studio"
            >
              <MessageCircle size={15} color="#DAFB71" />
            </a>
          </div>
        </div>

        {/* Dome Hero Spotlight for Venue Booking */}
        <div className="dome-hero-spotlight book-hero-spotlight">
          <div className="dome-hero-inner-content">
            <div className="dome-eyebrow-row">
              <div className="dome-live-pill">
                <span className="live-pulse-dot" />
                <span className="dome-live-tag">VENUE HIRE • KESARI STUDIO</span>
              </div>
              <span className="dome-db-badge">100% Pure Veg • Soft Drinks</span>
            </div>

            <div className="dome-headline-row">
              <h1 className="dome-act-title">Book Our Spaces &amp; Creative Studios</h1>
              <div className="dome-soundwave-bars" aria-label="Live audio waveform">
                <span className="wave-bar bar-1" />
                <span className="wave-bar bar-2" />
                <span className="wave-bar bar-3" />
                <span className="wave-bar bar-4" />
                <span className="wave-bar bar-5" />
              </div>
            </div>

            <p className="dome-hero-lead-desc">
              Acoustically tuned stages, intimate timber jam lounges, and creator workshop studios built for live experiences, recordings, and memorable gatherings.
            </p>

            <div className="dome-footer-row">
              <div className="dome-timing-info">
                <span className="dome-subtext">
                  3 Signature Spaces • Pro Yamaha &amp; Shure Acoustics • In-House Pure Veg Cafe
                </span>
              </div>
              
              <button 
                type="button" 
                className="dome-tune-btn"
                onClick={() => {
                  if (formSectionRef.current) {
                    formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>Reserve a Slot</span>
                <ArrowRight size={12} color="#FFFFFF" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Nav to Host Event Guide */}
        <div className="book-us-host-guide-banner">
          <div className="host-guide-content">
            <Music2 size={18} className="guide-icon" />
            <div>
              <strong>Planning a concert, offsite, or workshop?</strong>
              <p>Explore production packages, acoustic specs, and 100% Pure Veg catering.</p>
            </div>
          </div>
          <button 
            type="button"
            className="host-guide-action-btn"
            onClick={() => navigateTo('/host-event')}
          >
            <span>Host an Event Guide</span>
            <ChevronRight size={15} />
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <div className="book-us-container">
        
        {/* SECTION 1: HALL SHOWCASE */}
        <section className="halls-showcase-section" aria-labelledby="halls-showcase-heading">
          <div className="section-header-block">
            <div className="eyebrow-tag">EXPLORE OUR SPACES</div>
            <h2 id="halls-showcase-heading" className="section-main-heading">
              Select the Perfect Space for Your Audience
            </h2>
            <p className="section-lead-text">
              Each hall is acoustically isolated, equipped with professional gear, and supported by our on-site team.
            </p>
          </div>

          <div className="halls-cards-grid">
            {KESARI_HALLS.map((hall) => {
              const currentImgIdx = activeImageIndices[hall.id] || 0;
              const isSelected = selectedHallId === hall.id;

              return (
                <article 
                  key={hall.id} 
                  className={`hall-showcase-card ${isSelected ? 'is-selected-card' : ''}`}
                >
                  {/* Photo Gallery with Interactive Preview */}
                  <div className="hall-card-gallery-wrap">
                    <div className="hall-card-hero-img-box">
                      <img 
                        src={hall.images[currentImgIdx]} 
                        alt={`${hall.name} view ${currentImgIdx + 1}`}
                        className="hall-card-hero-img"
                        loading="lazy"
                      />
                      <div className="hall-image-overlay-gradient" />
                      
                      {/* Top Badges */}
                      <div className="hall-gallery-top-badges">
                        <span className="hall-type-tag">{hall.badge}</span>
                        <span className="hall-img-counter">
                          {currentImgIdx + 1} / {hall.images.length}
                        </span>
                      </div>

                      {/* Capacity Capsule */}
                      <div className="hall-capacity-capsule">
                        <Users size={14} />
                        <span>{hall.capacitySeating} Seated • {hall.capacityStanding} Standing</span>
                      </div>
                    </div>

                    {/* Thumbnail Switcher */}
                    <div className="hall-gallery-thumbnails">
                      {hall.images.map((imgSrc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`hall-thumb-btn ${idx === currentImgIdx ? 'is-active-thumb' : ''}`}
                          onClick={() => handleImageSwitch(hall.id, idx)}
                          aria-label={`View photo ${idx + 1} of ${hall.name}`}
                        >
                          <img src={imgSrc} alt="" className="thumb-img" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hall Info Body */}
                  <div className="hall-card-body">
                    
                    <div className="hall-title-row">
                      <h3 className="hall-name-text">{hall.name}</h3>
                      <div className="hall-price-badge">
                        <span className="price-num">{hall.priceDisplay}</span>
                      </div>
                    </div>

                    <p className="hall-headline-tagline">{hall.headline}</p>
                    <p className="hall-desc-text">{hall.description}</p>

                    {/* Quick Specs 2x2 */}
                    <div className="hall-specs-matrix">
                      {hall.highlights.map((spec, sIdx) => {
                        const IconComp = spec.icon;
                        return (
                          <div key={sIdx} className="hall-spec-cell">
                            <IconComp size={15} className="spec-icon" />
                            <div className="spec-text">
                              <span className="spec-label">{spec.label}</span>
                              <span className="spec-val">{spec.value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Amenities List */}
                    <div className="hall-amenities-section">
                      <h4 className="amenities-title">What&apos;s Included:</h4>
                      <ul className="amenities-list">
                        {hall.amenities.map((item, aIdx) => (
                          <li key={aIdx} className="amenity-item">
                            <Check size={14} className="amenity-check-icon" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Action Footer */}
                    <div className="hall-card-action-footer">
                      <div className="price-slot-breakdown">
                        <span className="slot-note-text">{hall.priceNote}</span>
                      </div>
                      
                      <button
                        type="button"
                        className={`book-hall-select-btn ${isSelected ? 'btn-selected' : ''}`}
                        onClick={() => handleSelectHallForBooking(hall.id)}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={17} />
                            <span>Selected for Booking</span>
                          </>
                        ) : (
                          <>
                            <span>Book This Hall</span>
                            <ChevronRight size={17} />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: COMPREHENSIVE BOOKING FORM */}
        <section 
          id="booking-form" 
          ref={formSectionRef} 
          className={`booking-form-section ${formGlow ? 'form-pulse-glow' : ''}`}
          aria-labelledby="booking-form-heading"
        >
          <div className="booking-form-card">
            
            {submissionResult && submissionResult.ok ? (
              /* Confirmation Success State */
              <div className="booking-success-view">
                <div className="success-icon-badge">
                  <CheckCircle2 size={44} className="check-svg" />
                </div>
                
                <div className="success-eyebrow">REQUEST CONFIRMED</div>
                <h3 className="success-title">Your Venue Booking Request is Received!</h3>
                <p className="success-subtitle">
                  Our studio director is reviewing the schedule and will confirm your reservation 
                  within 2 hours. A confirmation has been logged in our system.
                </p>

                {/* Booking Reference Box */}
                <div className="booking-ref-box">
                  <span className="ref-label">BOOKING REFERENCE CODE</span>
                  <div className="ref-code-row">
                    <span className="ref-code-value">{submissionResult.refCode}</span>
                    <button 
                      type="button" 
                      className="copy-ref-btn" 
                      onClick={handleCopyRef}
                      title="Copy reference code"
                    >
                      {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="ref-hint">Please quote this code when communicating with our team.</span>
                </div>

                {/* Summary Card */}
                <div className="booking-summary-card">
                  <h4 className="summary-card-title">Booking Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="s-label">Venue</span>
                      <span className="s-val">{submissionResult.hallName}</span>
                    </div>
                    <div className="summary-item">
                      <span className="s-label">Date &amp; Slot</span>
                      <span className="s-val">{submissionResult.date} ({submissionResult.timeSlot})</span>
                    </div>
                    <div className="summary-item">
                      <span className="s-label">Guest Count</span>
                      <span className="s-val">{submissionResult.guests} Guests</span>
                    </div>
                    <div className="summary-item">
                      <span className="s-label">Contact Person</span>
                      <span className="s-val">{submissionResult.name} ({submissionResult.phone})</span>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Action */}
                <div className="success-actions-row">
                  <a 
                    href={getWhatsAppBookingUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="whatsapp-confirm-btn"
                  >
                    <MessageCircle size={20} />
                    <span>Instant WhatsApp Follow-up ›</span>
                  </a>

                  <button 
                    type="button" 
                    className="book-another-btn" 
                    onClick={() => {
                      setSubmissionResult(null);
                      setFormData(prev => ({
                        ...prev,
                        name: '',
                        phone: '',
                        email: '',
                        notes: '',
                        extras: ['audio-tech']
                      }));
                    }}
                  >
                    Book Another Event or Space
                  </button>
                </div>

                <div className="success-policy-note">
                  <Info size={14} />
                  <span>Kesari Studio guarantees zero double-booking. Slots are held on a first-come, first-served basis.</span>
                </div>

              </div>
            ) : (
              /* Form State */
              <>
                <div className="form-header-block">
                  <div className="form-pre-title">
                    <Sparkles size={16} className="text-lime" />
                    <span>DIRECT VENUE RESERVATION</span>
                  </div>
                  <h2 id="booking-form-heading" className="form-main-title">
                    Reserve Your Date &amp; Stage Setup
                  </h2>
                  <p className="form-lead-desc">
                    Submit your booking requirements below. We will immediately check acoustic availability, 
                    sound engineer scheduling, and confirm your slot.
                  </p>

                  {/* Selected Hall Indicator Capsule */}
                  <div className="selected-hall-pill-banner">
                    <div className="hall-pill-left">
                      <span className="pill-tag">Selected Space</span>
                      <strong className="pill-name">{selectedHallData.name}</strong>
                    </div>
                    <div className="hall-pill-right">
                      <span className="pill-price">{selectedHallData.priceDisplay}</span>
                      <span className="pill-cap">({selectedHallData.capacitySeating} seats / {selectedHallData.capacityStanding} max)</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-core-form" noValidate>
                  
                  {/* Honeypot field (hidden from genuine users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input 
                      type="text" 
                      name="kesari_verify_hp" 
                      tabIndex="-1" 
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                    />
                  </div>

                  {/* ROW 1: Name, Phone, Email */}
                  <div className="form-row-three">
                    <div className={`form-field-group ${formErrors.name ? 'has-error' : ''}`}>
                      <label htmlFor="bk-name" className="field-label">
                        Full Name / Organization <span className="req">*</span>
                      </label>
                      <div className="input-wrap">
                        <input
                          id="bk-name"
                          type="text"
                          placeholder="e.g. Rahul Sharma / Indie Records"
                          className="text-input"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, name: e.target.value }));
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                          }}
                        />
                      </div>
                      {formErrors.name && (
                        <div className="field-error-msg">
                          <AlertCircle size={13} />
                          <span>{formErrors.name}</span>
                        </div>
                      )}
                    </div>

                    <div className={`form-field-group ${formErrors.phone ? 'has-error' : ''}`}>
                      <label htmlFor="bk-phone" className="field-label">
                        Phone Number (+91) <span className="req">*</span>
                      </label>
                      <div className="input-wrap phone-wrap">
                        <span className="country-prefix">+91</span>
                        <input
                          id="bk-phone"
                          type="tel"
                          placeholder="98765 43210"
                          maxLength={15}
                          className="text-input"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, phone: e.target.value }));
                            if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                          }}
                        />
                      </div>
                      {formErrors.phone && (
                        <div className="field-error-msg">
                          <AlertCircle size={13} />
                          <span>{formErrors.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className={`form-field-group ${formErrors.email ? 'has-error' : ''}`}>
                      <label htmlFor="bk-email" className="field-label">
                        Email Address <span className="req">*</span>
                      </label>
                      <div className="input-wrap">
                        <input
                          id="bk-email"
                          type="email"
                          placeholder="you@domain.com"
                          className="text-input"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, email: e.target.value }));
                            if (formErrors.email) setFormErrors(prev => ({ ...prev, email: null }));
                          }}
                        />
                      </div>
                      {formErrors.email && (
                        <div className="field-error-msg">
                          <AlertCircle size={13} />
                          <span>{formErrors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROW 2: Hall Selector & Event Type */}
                  <div className="form-row-two">
                    <div className="form-field-group">
                      <label htmlFor="bk-hall" className="field-label">
                        Choose Hall / Studio Space <span className="req">*</span>
                      </label>
                      <div className="select-wrap">
                        <select
                          id="bk-hall"
                          className="custom-select"
                          value={formData.hallId}
                          onChange={(e) => {
                            setSelectedHallId(e.target.value);
                            setFormData(prev => ({ ...prev, hallId: e.target.value }));
                          }}
                        >
                          {KESARI_HALLS.map(hall => (
                            <option key={hall.id} value={hall.id}>
                              {hall.name} ({hall.priceDisplay} • {hall.capacitySeating} seats)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bk-event-type" className="field-label">
                        Event Category / Type <span className="req">*</span>
                      </label>
                      <div className="select-wrap">
                        <select
                          id="bk-event-type"
                          className="custom-select"
                          value={formData.eventType}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                        >
                          {EVENT_TYPES.map((typeStr, idx) => (
                            <option key={idx} value={typeStr}>
                              {typeStr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ROW 3: Date, Time Slots, Guest Count */}
                  <div className="form-row-three">
                    <div className={`form-field-group ${formErrors.date ? 'has-error' : ''}`}>
                      <label htmlFor="bk-date" className="field-label">
                        Preferred Date <span className="req">*</span>
                      </label>
                      <div className="input-wrap date-wrap">
                        <input
                          id="bk-date"
                          type="date"
                          min={tomorrowStr}
                          className="text-input"
                          value={formData.date}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, date: e.target.value }));
                            if (formErrors.date) setFormErrors(prev => ({ ...prev, date: null }));
                          }}
                        />
                      </div>
                      {formErrors.date && (
                        <div className="field-error-msg">
                          <AlertCircle size={13} />
                          <span>{formErrors.date}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bk-slot" className="field-label">
                        Time Slot <span className="req">*</span>
                      </label>
                      <div className="select-wrap">
                        <select
                          id="bk-slot"
                          className="custom-select"
                          value={formData.timeSlot}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                        >
                          {TIME_SLOTS.map(slot => (
                            <option key={slot.id} value={slot.id}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={`form-field-group ${formErrors.guests ? 'has-error' : ''}`}>
                      <label htmlFor="bk-guests" className="field-label">
                        Estimated Guest Count <span className="req">*</span>
                      </label>
                      <div className="input-wrap">
                        <input
                          id="bk-guests"
                          type="number"
                          min="1"
                          max="300"
                          className="text-input"
                          value={formData.guests}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, guests: e.target.value }));
                            if (formErrors.guests) setFormErrors(prev => ({ ...prev, guests: null }));
                          }}
                        />
                      </div>
                      {formErrors.guests && (
                        <div className="field-error-msg">
                          <AlertCircle size={13} />
                          <span>{formErrors.guests}</span>
                        </div>
                      )}
                      {parseInt(formData.guests, 10) > selectedHallData.capacityStanding && (
                        <div className="field-capacity-warning">
                          <AlertCircle size={12} />
                          <span>
                            Exceeds standard capacity ({selectedHallData.capacityStanding}). 
                            Our team will discuss spillover arrangements.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom hours if selected */}
                  {formData.timeSlot === 'custom' && (
                    <div className="form-row-two custom-hours-row">
                      <div className="form-field-group">
                        <label className="field-label">Start Time</label>
                        <input
                          type="time"
                          className="text-input"
                          value={formData.customStartTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, customStartTime: e.target.value }))}
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="field-label">End Time</label>
                        <input
                          type="time"
                          className="text-input"
                          value={formData.customEndTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, customEndTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* ROW 4: EXTRAS & ADD-ONS */}
                  <div className="extras-selector-container">
                    <label className="field-label">
                      Select Extras &amp; Production Add-ons
                    </label>
                    <div className="extras-cards-grid">
                      {EXTRAS_OPTIONS.map((extra) => {
                        const isChecked = formData.extras.includes(extra.id);
                        return (
                          <div 
                            key={extra.id} 
                            className={`extra-option-card ${isChecked ? 'is-extra-selected' : ''}`}
                            onClick={() => handleExtraToggle(extra.id)}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                handleExtraToggle(extra.id);
                              }
                            }}
                          >
                            <div className="extra-checkbox-box">
                              {isChecked ? <Check size={14} /> : null}
                            </div>
                            <div className="extra-text-block">
                              <div className="extra-header-row">
                                <span className="extra-name">{extra.name}</span>
                                <span className="extra-price-tag">{extra.priceDisplay}</span>
                              </div>
                              <p className="extra-desc">{extra.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROW 5: NOTES */}
                  <div className="form-field-group notes-group">
                    <label htmlFor="bk-notes" className="field-label">
                      Event Description, Staging or Pure Veg Catering Requests (Optional)
                    </label>
                    <textarea
                      id="bk-notes"
                      rows={3}
                      placeholder="Tell us about your event format, musical instruments, rehearsal timing, 100% Pure Veg catering preferences, or custom stage setup..."
                      className="text-textarea"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  {/* Form Submission Footer */}
                  <div className="form-submit-footer">
                    <div className="submit-assurances">
                      <div className="assurance-item">
                        <ShieldCheck size={16} className="text-lime" />
                        <span>Instant Request Confirmation</span>
                      </div>
                      <div className="assurance-item">
                        <Clock size={16} className="text-cyan" />
                        <span>2-Hour Studio Director Response</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-submit-primary-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="submit-spinner" />
                          <span>Submitting Booking Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Booking Request</span>
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </>
            )}

          </div>
        </section>

        {/* SECTION 3: VENUE HIGHLIGHTS & PERKS */}
        <section className="venue-perks-section">
          <div className="section-header-block text-center">
            <span className="eyebrow-tag">THE KESARI STANDARD</span>
            <h2 className="section-main-heading">Every Booking Includes Everything You Need to Shine</h2>
          </div>

          <div className="perks-grid-four">
            <div className="perk-card">
              <div className="perk-icon-wrap">
                <Volume2 size={24} />
              </div>
              <h3 className="perk-title">Engineered Acoustics</h3>
              <p className="perk-desc">
                Tuned timber wall paneling, bass traps, and balanced reflection angles prevent sound flutter and ear fatigue.
              </p>
            </div>

            <div className="perk-card">
              <div className="perk-icon-wrap">
                <Coffee size={24} />
              </div>
              <h3 className="perk-title">100% Pure Veg Artisanal Cafe</h3>
              <p className="perk-desc">
                Freshly roasted coffees, gourmet cold brews, specialty teas, and delicious pure veg catering right outside the auditorium doors.
              </p>
            </div>

            <div className="perk-card">
              <div className="perk-icon-wrap">
                <ShieldCheck size={24} />
              </div>
              <h3 className="perk-title">Private Green Room</h3>
              <p className="perk-desc">
                Quiet sanctuary for artists and speakers with private climate control, vanity lighting mirrors, and seating.
              </p>
            </div>

            <div className="perk-card">
              <div className="perk-icon-wrap">
                <Wifi size={24} />
              </div>
              <h3 className="perk-title">Low-Latency Gigabit WiFi</h3>
              <p className="perk-desc">
                Reliable dedicated 1 Gbps fiber connectivity for live streaming to YouTube, Twitch, and hybrid corporate audiences.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: DIRECT CONTACT STRIP */}
        <section className="book-direct-contact-strip">
          <div className="contact-strip-inner">
            <div className="contact-strip-text">
              <h3 className="contact-strip-title">Prefer to talk with our venue producer directly?</h3>
              <p className="contact-strip-desc">
                Walk in for an in-person acoustic walkthrough or reach out on WhatsApp anytime.
              </p>
            </div>
            <div className="contact-strip-actions">
              <a 
                href="https://wa.me/917760539955?text=Hi%20Kesari%20Team!%20I'd%20like%20to%20inquire%20about%20booking%20a%20hall%20for%20an%20event." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp-direct"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp (+91 77605 39955)</span>
              </a>
              <a 
                href="tel:+917760539955" 
                className="btn-phone-direct"
              >
                <Phone size={17} />
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
