import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageSquare, Mail, MapPin, Clock, Send, 
  CheckCircle2, AlertCircle, Copy, Check, ExternalLink, 
  Instagram, Youtube, Twitter, Sparkles, Navigation, 
  Car, Shield, Music, HeartHandshake, ArrowRight
} from 'lucide-react';
import AppIcon from '../common/AppIcon';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import './ContactUsScreen.css';

export function ContactUsScreen({ onNavigate, onBack }) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'Hall / Space Booking',
    message: '',
    honeypot: '' // Anti-bot honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [copiedType, setCopiedType] = useState(null); // 'phone' | 'email' | 'address'

  // Operating Hours Logic: 10:00 AM to 11:30 PM IST daily
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const checkOperatingStatus = () => {
      // Calculate current IST time (UTC+5:30)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utcTime + (3600000 * 5.5));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      // 10:00 AM is 600 mins, 11:30 PM is 1410 mins
      const open = timeInMinutes >= 600 && timeInMinutes <= 1410;
      setIsOpenNow(open);
    };

    checkOperatingStatus();
    const interval = setInterval(checkOperatingStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Copy to clipboard helper
  const handleCopy = (text, type) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {}
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (min 2 characters).';
    }

    // Indian 10-digit phone validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const phoneValid = cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);
    if (!phoneValid) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 8) {
      newErrors.message = 'Please share a brief message (min 8 characters).';
    }

    return newErrors;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot for spam bots
    if (formData.honeypot) {
      setSubmittedRef('KSR-' + Math.floor(1000 + Math.random() * 9000));
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate reference code
      const refCode = `KSR-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

      const newEnquiry = {
        refCode,
        ...formData,
        timestamp: new Date().toISOString()
      };

      // Store in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('kesari_contact_enquiries') || '[]');
        existing.unshift(newEnquiry);
        localStorage.setItem('kesari_contact_enquiries', JSON.stringify(existing));
      } catch {}

      // Simulate network request
      await new Promise(r => setTimeout(r, 650));

      setSubmittedRef(refCode);
    } catch {
      setErrors({ form: 'An error occurred. Please call or WhatsApp us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      enquiryType: 'Hall / Space Booking',
      message: '',
      honeypot: ''
    });
    setErrors({});
    setSubmittedRef(null);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '#/';
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* ── 1. The Obsidian Curved Stage Dome (Standard from /events) ── */}
      <header className="home-curved-dome-header">
        <AuroraFluidCanvas />

        {/* Top Navigation Row */}
        <div className="dome-top-nav">
          <div className="dome-brand-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              className="explore-dome-back-btn" 
              onClick={handleBackClick} 
              aria-label="Back"
            >
              <AppIcon name="chevron-left" size={17} color="#FFFFFF" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              className="dome-brand-trigger"
              aria-label="Kesari Studio Home"
              onClick={handleBackClick}
            >
              <img
                src="/assets/kesari-logo.png"
                alt="Kesari"
                className="dome-kesari-brand-logo"
              />
            </button>
            <span className="gallery-badge" style={{ margin: 0, padding: '4px 10px', fontSize: '0.74rem' }}>
              <span className="badge-dot" /> Koramangala 4th Block
            </span>
          </div>

          <div className="dome-nav-actions">
            <a 
              href="https://wa.me/917760539955"
              target="_blank"
              rel="noopener noreferrer"
              className="dome-glass-btn" 
              title="Chat on WhatsApp"
              aria-label="WhatsApp"
              style={{ color: '#25D366' }}
            >
              <MessageSquare size={14} />
            </a>
            <a 
              href="tel:+917760539955"
              className="dome-glass-btn" 
              title="Direct Call"
              aria-label="Call"
            >
              <Phone size={14} color="#FFFFFF" />
            </a>
          </div>
        </div>

        {/* Hero Spotlight Display */}
        <div className="dome-hero-spotlight">
          <div className="dome-hero-inner-content">
            <div className="dome-eyebrow-row">
              <div className="dome-live-pill">
                <span className="live-pulse-dot" style={{ backgroundColor: isOpenNow ? '#DAFB71' : '#EE3D5A' }} />
                <span className="dome-live-tag">
                  {isOpenNow ? 'OPEN TODAY • 10:00 AM – 11:30 PM DAILY' : 'OPENS AT 10:00 AM DAILY'}
                </span>
              </div>
              <span className="dome-db-badge">Direct Line</span>
            </div>

            <div className="dome-headline-row">
              <h1 className="dome-act-title">Visit Kesari Studio in Koramangala</h1>
              <div className="dome-soundwave-bars" aria-label="Audio pulse">
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
                  Hall bookings, audio gear rentals, gig hosting, and cafe visits
                </span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a 
                  href="tel:+917760539955"
                  className="dome-tune-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={13} color="#12131A" />
                  <span>Call +91 77605 39955</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="contact-content-container">
        {/* Quick Communication Action Cards */}
        <section className="contact-action-cards" aria-label="Direct Communication Channels">
          {/* Direct Call Button */}
          <article className="contact-action-card">
            <div className="action-card-icon-box">
              <Phone size={22} />
            </div>
            <div className="action-card-label">Direct Phone Call</div>
            <div className="action-card-val">+91 77605 39955</div>
            <p className="action-card-desc">
              Immediate assistance for hall reservations, gig setups, sound checks, and studio walkthroughs.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a 
                href="tel:+917760539955" 
                className="action-card-button"
                style={{ flex: 1 }}
              >
                <Phone size={14} /> Call Now
              </a>
              <button 
                type="button"
                onClick={() => handleCopy('+917760539955', 'phone')}
                className="action-card-button"
                style={{ width: 44, padding: 0 }}
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedType === 'phone' ? <Check size={14} color="#DAFB71" /> : <Copy size={14} />}
              </button>
            </div>
          </article>

          {/* Direct WhatsApp Button */}
          <article className="contact-action-card whatsapp">
            <div className="action-card-icon-box">
              <MessageSquare size={22} />
            </div>
            <div className="action-card-label">Instant WhatsApp</div>
            <div className="action-card-val">WhatsApp Us</div>
            <p className="action-card-desc">
              Chat with our studio coordinator. Share riders, get instant quotes, and confirm dates.
            </p>
            <a 
              href="https://wa.me/917760539955?text=Hello%20Kesari%20Team%2C%20I%20would%20like%20to%20enquire%20about%20booking%20and%20events%20at%20The%20Memory%20Studio."
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-card-button"
            >
              <MessageSquare size={14} /> Chat on WhatsApp
            </a>
          </article>

          {/* Direct Email Button */}
          <article className="contact-action-card">
            <div className="action-card-icon-box">
              <Mail size={22} />
            </div>
            <div className="action-card-label">Official Email</div>
            <div className="action-card-val" style={{ fontSize: '0.98rem' }}>Kesari.memory@gmail.com</div>
            <p className="action-card-desc">
              For corporate offsites, brand collaborations, artist press kits, and formal proposals.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a 
                href="mailto:Kesari.memory@gmail.com?subject=Enquiry%20-%20Kesari%20The%20Memory%20Studio" 
                className="action-card-button"
                style={{ flex: 1 }}
              >
                <Mail size={14} /> Send Email
              </a>
              <button 
                type="button"
                onClick={() => handleCopy('Kesari.memory@gmail.com', 'email')}
                className="action-card-button"
                style={{ width: 44, padding: 0 }}
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedType === 'email' ? <Check size={14} color="#DAFB71" /> : <Copy size={14} />}
              </button>
            </div>
          </article>

          {/* Studio Address */}
          <article className="contact-action-card">
            <div className="action-card-icon-box">
              <MapPin size={22} />
            </div>
            <div className="action-card-label">Studio Address</div>
            <div className="action-card-val" style={{ fontSize: '0.95rem' }}>Koramangala 4th Block</div>
            <p className="action-card-desc">
              Kesari - The Memory Studio, Koramangala 4th Block, Bangalore 560034.
            </p>
            <a 
              href="https://maps.google.com/?q=Kesari+The+Memory+Studio+Koramangala+Bangalore"
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-card-button"
            >
              <Navigation size={14} /> Get Directions
            </a>
          </article>
        </section>

        {/* Main Split Grid: Enquiry Form + Interactive Map */}
        <div className="contact-main-grid">
          {/* Left Column: Contact Enquiry Form */}
          <section className="contact-form-card" aria-labelledby="enquiry-form-title">
            <header className="form-card-header">
              <h2 id="enquiry-form-title" className="form-card-title">Send Us an Enquiry</h2>
              <p className="form-card-desc">
                Fill in your event or booking details and our studio team will get back to you within 2 hours.
              </p>
            </header>

            {submittedRef ? (
              <div className="enquiry-success-box" role="status" aria-live="polite">
                <div className="success-check-circle">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="success-title">Message Received!</h3>
                <p className="success-msg">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry has been received by the Kesari team. We will call you back at <strong>+91 {formData.phone}</strong> shortly.
                </p>
                <div className="success-ref-pill">
                  Enquiry Reference: {submittedRef}
                </div>
                <div className="success-actions">
                  <a 
                    href={`https://wa.me/917760539955?text=Hello%20Kesari%20Team%2C%20following%20up%20on%20my%20enquiry%20(${submittedRef})%20for%20${encodeURIComponent(formData.enquiryType)}.`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="submit-button"
                    style={{ textDecoration: 'none' }}
                  >
                    <MessageSquare size={16} /> Continue on WhatsApp
                  </a>
                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="action-card-button"
                    style={{ width: 'auto', padding: '12px 24px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot hidden input */}
                <input 
                  type="text" 
                  name="honeypot" 
                  value={formData.honeypot} 
                  onChange={handleChange}
                  tabIndex={-1} 
                  autoComplete="off" 
                  className="visually-hidden-honeypot" 
                />

                {/* Name & Phone */}
                <div className="form-row-2">
                  <div className="form-field-group">
                    <label htmlFor="name" className="form-field-label">
                      Full Name <span className="required-asterisk">*</span>
                    </label>
                    <input 
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Arjun Mehta"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      required
                    />
                    {errors.name && (
                      <span id="name-error" className="field-error-msg">
                        <AlertCircle size={12} /> {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="phone" className="form-field-label">
                      Phone Number (10 digits) <span className="required-asterisk">*</span>
                    </label>
                    <input 
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      required
                    />
                    {errors.phone && (
                      <span id="phone-error" className="field-error-msg">
                        <AlertCircle size={12} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email & Enquiry Type */}
                <div className="form-row-2">
                  <div className="form-field-group">
                    <label htmlFor="email" className="form-field-label">
                      Email Address <span className="required-asterisk">*</span>
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. arjun@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                    {errors.email && (
                      <span id="email-error" className="field-error-msg">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="enquiryType" className="form-field-label">
                      Enquiry Purpose
                    </label>
                    <select 
                      id="enquiryType"
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Hall / Space Booking">Hall / Space Booking</option>
                      <option value="Gig / Band Performance">Gig / Band Performance</option>
                      <option value="Acoustic Lounge / Rehearsal">Acoustic Lounge / Rehearsal</option>
                      <option value="Sound Equipment Rental">Sound Equipment Rental</option>
                      <option value="Bulk Pure Veg Food Catering">Bulk Pure Veg Food Catering</option>
                      <option value="Workshop & Community Meetup">Workshop & Community Meetup</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-field-group">
                  <label htmlFor="message" className="form-field-label">
                    Your Message / Event Date & Details <span className="required-asterisk">*</span>
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    placeholder="Tell us about your event, expected date, guest count, or any sound/pure veg catering needs..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    required
                  />
                  {errors.message && (
                    <span id="message-error" className="field-error-msg">
                      <AlertCircle size={12} /> {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending Enquiry...</>
                  ) : (
                    <>
                      <Send size={18} /> Submit Enquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Right Column: Embedded Responsive Map & Transit Guide */}
          <section className="contact-map-card" aria-labelledby="map-section-title">
            <header className="map-card-header">
              <h2 id="map-section-title" className="map-card-title">Find Our Studio</h2>
              <p className="map-card-address">
                <MapPin size={16} style={{ color: 'var(--color-electric-lime)', flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Kesari - The Memory Studio</strong><br />
                  Koramangala 4th Block, Bangalore 560034, Karnataka, India
                </span>
              </p>
            </header>

            {/* Embedded Responsive Interactive Map */}
            <div className="map-frame-container">
              <iframe
                title="Kesari The Memory Studio Location Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.6200%2C12.9280%2C77.6380%2C12.9420&layer=mapnik&marker=12.9345%2C77.6290"
                className="map-iframe"
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* Transit and Parking Highlights */}
            <div className="transit-highlights-grid">
              <div className="transit-item">
                <Navigation size={18} className="transit-icon" />
                <div>
                  <div className="transit-label">Prime Location</div>
                  <div className="transit-desc">
                    5 mins from Sony World Junction & Maharaja Signal in 4th Block.
                  </div>
                </div>
              </div>

              <div className="transit-item">
                <Car size={18} className="transit-icon" />
                <div>
                  <div className="transit-label">Parking Available</div>
                  <div className="transit-desc">
                    Dedicated 2-wheeler spots & easy 4-wheeler valet access.
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Link */}
            <a 
              href="https://maps.google.com/?q=Kesari+The+Memory+Studio+Koramangala+Bangalore"
              target="_blank" 
              rel="noopener noreferrer" 
              className="directions-btn"
            >
              <ExternalLink size={16} /> Open in Google Maps Navigation
            </a>
          </section>
        </div>

        {/* Social Community Section */}
        <section className="contact-socials-section" aria-labelledby="socials-heading">
          <h2 id="socials-heading" className="socials-title">Join Our Creative Community</h2>
          <p className="socials-subtitle">
            Follow our live sessions, backstage rehearsals, artist takeovers, and upcoming gigs across social channels.
          </p>

          <div className="socials-buttons-grid">
            <a 
              href="https://instagram.com/kesari.thememorystudio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button instagram"
              aria-label="Instagram profile"
            >
              <Instagram size={18} /> Instagram @kesari.thememorystudio
            </a>

            <a 
              href="https://youtube.com/@kesaristudio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button youtube"
              aria-label="YouTube channel"
            >
              <Youtube size={18} /> YouTube Live Sessions
            </a>

            <a 
              href="https://x.com/kesaristudio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
              aria-label="X Twitter account"
            >
              <Twitter size={18} /> X (Twitter) @kesaristudio
            </a>

            <a 
              href="https://wa.me/917760539955" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
              style={{ color: '#25D366' }}
              aria-label="WhatsApp channel"
            >
              <MessageSquare size={18} /> Official WhatsApp Broadcast
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactUsScreen;
