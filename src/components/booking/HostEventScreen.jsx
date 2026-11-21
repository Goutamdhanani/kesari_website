import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Users, 
  Volume2, 
  Coffee, 
  ShieldCheck, 
  MessageCircle, 
  ChevronDown, 
  Check, 
  Sliders,
  Calendar,
  Sparkles
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import './HostEventScreen.css';

export const STUDIO_HALLS = [
  {
    id: 'main-stage',
    name: 'Concert Hall & Stage',
    shortName: 'Concert Hall',
    tag: 'MAIN STAGE',
    capacity: 'Up to 200 Guests',
    guestCount: 200,
    price: 'From ₹15,000',
    priceVal: 15000,
    image: '/assets/venue/kesari_main_stage_live.png',
    idealFor: 'Concerts, indie gigs, album launches & large gatherings',
    features: ['Line Array PA Rig', 'DMX Stage Lighting', 'Artist Green Room', 'Sound Engineer on Duty'],
    bookingUrl: '/book?hall=main-stage'
  },
  {
    id: 'acoustic-lounge',
    name: 'Acoustic Lounge & Jam Room',
    shortName: 'Acoustic Lounge',
    tag: 'INTIMATE LOUNGE',
    capacity: 'Up to 60 Guests',
    guestCount: 60,
    price: 'From ₹6,000',
    priceVal: 6000,
    image: '/assets/venue/IMG20260718173645.jpg',
    idealFor: 'Acoustic sessions, open mics, comedy, birthdays & listening circles',
    features: ['Soundproofed Timber', 'Shure Vocal Mics', 'Velvet Club Sofas', 'Artisanal Café Access'],
    bookingUrl: '/book?hall=acoustic-lounge'
  },
  {
    id: 'creator-room',
    name: 'Creator Workshop Space',
    shortName: 'Workshop Space',
    tag: 'CREATIVE ROOM',
    capacity: 'Up to 40 Guests',
    guestCount: 40,
    price: 'From ₹5,000',
    priceVal: 5000,
    image: '/assets/events/workshop.webp',
    idealFor: 'Masterclasses, design sprints, creative offsites & hackathons',
    features: ['4K Laser Projector', 'Gigabit Wi-Fi', 'Modular Tables', 'Craft Brew Hospitality'],
    bookingUrl: '/book?hall=creator-room'
  }
];

export const INCLUDED_PERKS = [
  {
    icon: Volume2,
    title: 'Studio Acoustics & PA',
    desc: 'Line array PA, Shure mics & digital mixing console.'
  },
  {
    icon: Sliders,
    title: 'DMX Stage Lighting',
    desc: 'Concert spots, warm wash & laser projection.'
  },
  {
    icon: ShieldCheck,
    title: 'Sound Engineer on Duty',
    desc: 'On-site audio engineer for setup & live mixing.'
  },
  {
    icon: Coffee,
    title: '100% Pure Veg Café',
    desc: 'Single-origin brews, mocktails & pure veg catering.'
  }
];

export const HOSTING_STEPS = [
  {
    number: '01',
    title: 'Pick Space & Date',
    desc: 'Choose Hall, Lounge, or Workshop Room for your desired date.'
  },
  {
    number: '02',
    title: 'Calibrate Sound & Setup',
    desc: 'Our sound producer configures stage mics, lighting, and seating.'
  },
  {
    number: '03',
    title: 'Sound Check & Showtime',
    desc: 'Arrive 1h early for sound check. Our technical crew runs the show.'
  }
];

export const HOST_FAQS = [
  {
    q: 'Can we bring outside catering or alcohol?',
    a: 'Kesari is strictly 100% Pure Vegetarian and Alcohol-Free. Our in-house café provides gourmet pure vegetarian catering (Jain/Satvik available) and craft soft beverages (cold brews, teas, mocktails). Outside alcohol and non-veg food are strictly not permitted.'
  },
  {
    q: 'What is the venue sound curfew?',
    a: 'Amplified live bands can perform until 10:30 PM. Acoustic sets, comedy, and café gatherings comfortably extend until 11:30 PM.'
  },
  {
    q: 'What is the rescheduling policy?',
    a: 'You can reschedule your reservation with zero penalty up to 7 days before your event date.'
  }
];

// Backwards-compatible aliases for external imports
export const HOSTABLE_EXPERIENCES = STUDIO_HALLS;
export const INCLUDED_PILLARS = INCLUDED_PERKS;

export default function HostEventScreen({ 
  onNavigate = null, 
  onBack = null 
}) {
  const [activeHallId, setActiveHallId] = useState('main-stage');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const activeHall = STUDIO_HALLS.find(h => h.id === activeHallId) || STUDIO_HALLS[0];

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleWhatsApp = (hallName) => {
    const text = encodeURIComponent(`Hello Kesari Studio, I want to enquire about hosting an event in the ${hallName || activeHall.name}.`);
    window.open(`https://wa.me/917760539955?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="host-event-page-root">
      
      {/* ── 1. Compact Hero Header (Zero Slop, Zero Duplicate Nav) ── */}
      <header className="host-compact-hero-section">
        <AuroraFluidCanvas />

        <div className="host-container">
          {/* Breadcrumb row */}
          <div className="host-breadcrumb-row">
            <button 
              type="button" 
              className="host-back-breadcrumb" 
              onClick={() => (onBack ? onBack() : navigateTo('/'))}
              aria-label="Back to Home"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>

            <span className="host-eyebrow-pill">
              <span className="host-pulse-dot" />
              <span>KORAMANGALA • 3 ACOUSTIC SPACES</span>
            </span>
          </div>

          {/* Hero Headline & Summary */}
          <div className="host-hero-content-block">
            <h1 className="host-main-title">Event Space &amp; Studio Hall Rental in Koramangala</h1>
            <p className="host-main-subtitle">
              Acoustically calibrated venue for live concerts, jam sessions, comedy, workshops &amp; private gatherings in Bangalore.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="host-quick-meta-strip">
              <span className="meta-badge highlight">Up to 200 Guests</span>
              <span className="meta-sep">•</span>
              <span className="meta-badge">Sound Crew &amp; Rig Included</span>
              <span className="meta-sep">•</span>
              <span className="meta-badge highlight">From ₹5,000</span>
              <span className="meta-sep">•</span>
              <span className="meta-badge">100% Pure Veg</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. The Interactive Space Showcase ── */}
      <main className="host-main-content">
        <section className="host-space-selector-section" aria-labelledby="space-select-heading">
          <div className="host-container">

            {/* Interactive Segmented Switcher */}
            <div className="host-segmented-wrapper">
              <span className="section-label-eyebrow" id="space-select-heading">STEP 1: SELECT YOUR SPACE</span>
              <div className="host-segment-bar" role="tablist" aria-label="Choose venue space">
                {STUDIO_HALLS.map((hall) => {
                  const isActive = activeHallId === hall.id;
                  return (
                    <button
                      key={hall.id}
                      type="button"
                      role="tab"
                      id={`tab-${hall.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${hall.id}`}
                      className={`host-segment-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveHallId(hall.id)}
                    >
                      <span className="tab-hall-name">{hall.shortName}</span>
                      <span className="tab-hall-cap">{hall.capacity.replace('Up to ', '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Spotlight Card */}
            <div 
              id={`panel-${activeHall.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeHall.id}`}
              className="active-spotlight-card"
            >
              {/* Image Banner */}
              <div className="spotlight-image-wrap">
                <img 
                  src={activeHall.image} 
                  alt={activeHall.name} 
                  className="spotlight-image"
                  loading="lazy"
                  decoding="async"
                />
                <div className="spotlight-gradient-scrim" />
                
                {/* Floating Tags */}
                <div className="spotlight-tags-row">
                  <span className="spotlight-pill-tag">{activeHall.tag}</span>
                  <span className="spotlight-price-tag">{activeHall.price}</span>
                </div>

                <div className="spotlight-cap-tag">
                  <Users size={13} />
                  <span>{activeHall.capacity}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="spotlight-body-content">
                <div className="spotlight-title-row">
                  <h2 className="spotlight-hall-title">{activeHall.name}</h2>
                  <span className="spotlight-price-highlight">{activeHall.price}</span>
                </div>

                <p className="spotlight-hall-ideal">{activeHall.idealFor}</p>

                {/* Equipment Pills */}
                <div className="spotlight-feature-pills">
                  {activeHall.features.map((feat, fIdx) => (
                    <span key={fIdx} className="feature-pill-chip">
                      <Check size={12} className="feat-check-icon" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="spotlight-action-row">
                  <button 
                    type="button" 
                    className="btn-spotlight-book"
                    onClick={() => navigateTo('/book')}
                  >
                    <span>Book {activeHall.shortName} • {activeHall.price}</span>
                    <ArrowRight size={15} />
                  </button>

                  <button 
                    type="button" 
                    className="btn-spotlight-whatsapp"
                    onClick={() => handleWhatsApp(activeHall.name)}
                    aria-label={`Enquire on WhatsApp about ${activeHall.name}`}
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 3-Space Compare Cards */}
            <div className="host-all-spaces-strip">
              <span className="compare-strip-title">Compare All 3 Spaces</span>
              <div className="compare-cards-grid">
                {STUDIO_HALLS.map((hall) => {
                  const isCurrent = hall.id === activeHallId;
                  return (
                    <div 
                      key={hall.id}
                      className={`compare-space-card ${isCurrent ? 'is-selected' : ''}`}
                      onClick={() => setActiveHallId(hall.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveHallId(hall.id)}
                    >
                      <div className="compare-card-thumb">
                        <img src={hall.image} alt={hall.name} loading="lazy" decoding="async" />
                        {isCurrent && <span className="current-badge">Active</span>}
                      </div>
                      <div className="compare-card-info">
                        <h3 className="compare-name">{hall.shortName}</h3>
                        <div className="compare-meta">
                          <span className="compare-cap">{hall.capacity}</span>
                          <span className="compare-price">{hall.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. Included in Every Booking (Compact 2x2 Bento Grid) ── */}
        <section className="host-included-bento-section" aria-labelledby="included-heading">
          <div className="host-container">
            <div className="bento-section-header">
              <span className="section-label-eyebrow" id="included-heading">ALL-INCLUSIVE STANDARD</span>
              <h2 className="bento-main-heading">Included with Every Booking</h2>
              <p className="bento-sub-heading">Zero surprise charges. Production-grade sound, lights, and support are baked in.</p>
            </div>

            <div className="host-bento-2x2-grid">
              {INCLUDED_PERKS.map((perk, pIdx) => {
                const IconComp = perk.icon;
                return (
                  <div key={pIdx} className="bento-perk-pill">
                    <div className="bento-icon-box">
                      <IconComp size={18} />
                    </div>
                    <div className="bento-perk-text">
                      <h3 className="bento-perk-title">{perk.title}</h3>
                      <p className="bento-perk-desc">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. How Booking Works (Inline 3-Step Flow) ── */}
        <section className="host-timeline-steps-section" aria-labelledby="steps-heading">
          <div className="host-container">
            <div className="bento-section-header">
              <span className="section-label-eyebrow" id="steps-heading">HOW IT WORKS</span>
              <h2 className="bento-main-heading">3 Simple Steps to Showtime</h2>
            </div>

            <div className="host-inline-stepper">
              {HOSTING_STEPS.map((st, sIdx) => (
                <div key={sIdx} className="inline-step-item">
                  <div className="inline-step-num-badge">{st.number}</div>
                  <div className="inline-step-body">
                    <h3 className="inline-step-title">{st.title}</h3>
                    <p className="inline-step-desc">{st.desc}</p>
                  </div>
                  {sIdx < HOSTING_STEPS.length - 1 && (
                    <div className="inline-step-arrow" aria-hidden="true">&rarr;</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FAQs (Compact Accordion) ── */}
        <section className="host-faq-section" aria-labelledby="faq-heading">
          <div className="host-container">
            <div className="bento-section-header">
              <span className="section-label-eyebrow" id="faq-heading">QUICK ANSWERS</span>
              <h2 className="bento-main-heading">Frequently Asked Questions</h2>
            </div>

            <div className="host-faq-accordion-wrap">
              {HOST_FAQS.map((faq, fIdx) => {
                const isExpanded = expandedFaq === fIdx;
                return (
                  <div 
                    key={fIdx} 
                    className={`faq-accordion-card ${isExpanded ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-accordion-trigger"
                      onClick={() => setExpandedFaq(isExpanded ? null : fIdx)}
                      aria-expanded={isExpanded}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={16} className="faq-chevron-icon" />
                    </button>

                    {isExpanded && (
                      <div className="faq-accordion-content">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. Bottom Conversion Strip ── */}
        <section className="host-bottom-cta-section">
          <div className="host-container">
            <div className="host-cta-box">
              <div className="host-cta-text-col">
                <h3 className="cta-box-title">Ready to Host Your Event?</h3>
                <p className="cta-box-desc">
                  Select your space online in 2 minutes, or speak directly with our studio producer on WhatsApp.
                </p>
              </div>

              <div className="host-cta-action-col">
                <button
                  type="button"
                  className="btn-cta-primary-pill"
                  onClick={() => navigateTo('/book')}
                >
                  <span>Go to Booking Form</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  className="btn-cta-whatsapp-pill"
                  onClick={() => handleWhatsApp()}
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Producer</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── 7. Mobile Sticky Quick Action Bar ── */}
      <aside className="host-mobile-sticky-bar" aria-label="Quick booking bar">
        <div className="sticky-bar-info">
          <span className="sticky-hall-name">{activeHall.shortName}</span>
          <span className="sticky-hall-price">{activeHall.price}</span>
        </div>
        <div className="sticky-bar-actions">
          <button 
            type="button"
            className="btn-sticky-book"
            onClick={() => navigateTo('/book')}
          >
            <span>Book Space</span>
            <ArrowRight size={13} />
          </button>
          <button 
            type="button"
            className="btn-sticky-whatsapp"
            onClick={() => handleWhatsApp()}
            aria-label="WhatsApp Studio"
          >
            <MessageCircle size={14} />
          </button>
        </div>
      </aside>

    </div>
  );
}
