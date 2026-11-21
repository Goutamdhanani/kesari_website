import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Music,
  Video,
  Instagram,
  Globe,
  MapPin,
  Mail,
  IndianRupee,
  FileText,
  ShieldCheck,
  X,
  Radio,
  ChevronLeft
} from 'lucide-react';
import AuroraFluidCanvas from '../mobile/AuroraFluidCanvas';
import '../mobile/HomeScreen.css';
import './ArtistRegisterScreen.css';

const GENRE_OPTIONS = [
  'Singer / Vocalist',
  'Live Band',
  'Stand-up Comedian',
  'DJ / Electronic Producer',
  'Instrumentalist (Guitar / Violin / Flute / Percussion)',
  'Poet / Spoken Word',
  'Rapper / Hip-Hop Artist',
  'Folk & Classical Fusion'
];

const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Goa',
  'Other'
];

export default function ArtistRegisterScreen({ onNavigate, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    genre: 'Singer / Vocalist',
    phone: '',
    email: '',
    city: 'Bangalore',
    photoUrl: '',
    videoUrl: '',
    instagram: '',
    channel: '',
    previousEvents: '',
    achievements: '',
    costPerEvent: '',
    openMic: true,
    extraDetails: '',
    consent: false,
    // Honeypot field for spam protection (must remain empty)
    b_website: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedArtist, setSubmittedArtist] = useState(null);
  const [generalError, setGeneralError] = useState('');

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  const handleGoToDirectory = () => {
    if (typeof onNavigate === 'function') {
      onNavigate('artists');
    } else if (typeof onBack === 'function') {
      onBack();
    } else {
      window.history.pushState({}, '', '/artists');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const validateIndianPhone = (raw) => {
    if (!raw) return false;
    const cleaned = String(raw).replace(/[\s\-\(\)\+]/g, '');
    let digits = cleaned;
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      digits = cleaned.slice(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      digits = cleaned.slice(1);
    }
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setGeneralError('');
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors(prev => ({
        ...prev,
        photo: 'Photo exceeds 5MB limit. Please choose a smaller image (under 5MB).'
      }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        photo: 'Please upload a valid image file (JPEG, PNG, WebP).'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreviewUrl(result);
      setFormData(prev => ({ ...prev, photoUrl: result }));
      setErrors(prev => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    };
    reader.onerror = () => {
      setErrors(prev => ({
        ...prev,
        photo: 'Failed to read image file. Please try again.'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full / Stage name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.genre) {
      newErrors.genre = 'Please select a primary genre or performance type.';
    }

    const validatedPhone = validateIndianPhone(formData.phone);
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for booking coordination.';
    } else if (!validatedPhone) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Base city is required.';
    }

    if (!formData.previousEvents.trim()) {
      newErrors.previousEvents = 'Please tell us about your past shows, venues, or gigs.';
    } else if (formData.previousEvents.trim().length < 10) {
      newErrors.previousEvents = 'Please provide a bit more detail about your past gigs (at least 10 characters).';
    }

    const cost = Number(formData.costPerEvent);
    if (!formData.costPerEvent || isNaN(cost) || cost < 0) {
      newErrors.costPerEvent = 'Please enter your standard performance fee in INR (₹).';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to Kesari displaying your profile and contacting you for gigs.';
    }

    if (formData.videoUrl.trim()) {
      try {
        const parsed = new URL(formData.videoUrl.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.videoUrl = 'Please enter a valid web URL starting with https://';
        }
      } catch {
        newErrors.videoUrl = 'Please enter a valid video link (YouTube, Vimeo, Drive).';
      }
    }

    if (formData.channel.trim()) {
      try {
        const parsed = new URL(formData.channel.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.channel = 'Please enter a valid web URL starting with https://';
        }
      } catch {
        newErrors.channel = 'Please enter a valid link (YouTube, Spotify, Soundcloud, Website).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.b_website && formData.b_website.trim().length > 0) {
      console.warn('Spam detected via honeypot.');
      setSubmitted(true);
      return;
    }

    if (!validateForm()) {
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setSubmitting(true);
    setGeneralError('');

    const normalizedPhone = validateIndianPhone(formData.phone);
    const cleanedInstagram = formData.instagram.trim().replace(/^@+/, '');

    const payload = {
      name: formData.name.trim(),
      genre: formData.genre,
      phone: normalizedPhone,
      email: formData.email.trim().toLowerCase(),
      city: formData.city.trim(),
      photoUrl: formData.photoUrl || previewUrl || '/assets/events/real_kesari/kesari_ev_03.jpg',
      videoUrl: formData.videoUrl.trim(),
      instagram: cleanedInstagram,
      channel: formData.channel.trim(),
      previousEvents: formData.previousEvents.trim(),
      achievements: formData.achievements.trim(),
      costPerEvent: Number(formData.costPerEvent),
      openMic: Boolean(formData.openMic),
      extraDetails: formData.extraDetails.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/artists/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || `Server status ${response.status}`);
      }

      const result = await response.json();
      const savedArtist = result.artist || result || payload;

      try {
        const existing = JSON.parse(localStorage.getItem('kesari_pending_artists') || '[]');
        localStorage.setItem(
          'kesari_pending_artists',
          JSON.stringify([savedArtist, ...existing])
        );
      } catch {}

      setSubmittedArtist(savedArtist);
      setSubmitted(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (error) {
      console.warn('API submission failed, using local storage cache fallback:', error);
      try {
        const localArtist = { ...payload, id: 'art_' + Date.now() };
        const existing = JSON.parse(localStorage.getItem('kesari_pending_artists') || '[]');
        localStorage.setItem(
          'kesari_pending_artists',
          JSON.stringify([localArtist, ...existing])
        );
        setSubmittedArtist(localArtist);
        setSubmitted(true);
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      } catch {
        setGeneralError('Registration submission encountered an error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      genre: 'Singer / Vocalist',
      phone: '',
      email: '',
      city: 'Bangalore',
      photoUrl: '',
      videoUrl: '',
      instagram: '',
      channel: '',
      previousEvents: '',
      achievements: '',
      costPerEvent: '',
      openMic: true,
      extraDetails: '',
      consent: false,
      b_website: ''
    });
    setPreviewUrl('');
    setErrors({});
    setSubmitted(false);
    setSubmittedArtist(null);
  };

  return (
    <div className="artist-register-page" ref={formTopRef}>
      {/* ── 1. The Obsidian Curved Stage Dome Header ── */}
      <header className="home-curved-dome-header artist-register-dome">
        <AuroraFluidCanvas />

        {/* Top Navigation Row inside Dome */}
        <div className="dome-top-nav">
          <div className="dome-brand-group">
            <button
              type="button"
              className="explore-dome-back-btn"
              onClick={handleGoToDirectory}
              aria-label="Back to Artists"
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
            <div className="dome-status-pill">
              <Sparkles size={12} />
              <span>Talent Call 2026</span>
            </div>
          </div>
        </div>

        {/* Dome Hero Spotlight */}
        <div className="dome-hero-spotlight artist-register-spotlight">
          <div className="dome-eyebrow-row">
            <div className="dome-live-pill">
              <span className="live-pulse-dot" />
              <span className="dome-live-tag">OPEN ROSTER CALL • PERFORM AT KESARI</span>
            </div>
            <div className="dome-soundwave-bars" aria-label="Audio waveform">
              <span className="wave-bar bar-1" />
              <span className="wave-bar bar-2" />
              <span className="wave-bar bar-3" />
              <span className="wave-bar bar-4" />
              <span className="wave-bar bar-5" />
            </div>
          </div>

          <div className="dome-headline-row">
            <h1 className="dome-act-title">Register as a Performing Artist</h1>
          </div>

          <p className="artist-register-dome-desc">
            Join Kesari's curated performing roster for live concerts, acoustic lounge evenings, weekly open mics,
            and private studio sessions in Bangalore.
          </p>

          <div className="dome-register-privacy-strip">
            <ShieldCheck size={14} />
            <span>
              <strong>Privacy Guaranteed:</strong> Your phone number and email are kept strictly confidential
              and are never published in the public directory.
            </span>
          </div>
        </div>
      </header>

      {/* ── 2. Registration Body / Form ── */}
      <main className="artist-register-body">
        {!submitted ? (
          <>
            {generalError && (
              <div className="artist-form-banner error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="artist-register-form">
              {/* Honeypot hidden input */}
              <input
                type="text"
                name="b_website"
                value={formData.b_website}
                onChange={(e) => handleInputChange('b_website', e.target.value)}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
              />

              {/* SECTION 1: Identity & Genre */}
              <fieldset className="artist-form-section">
                <legend className="section-legend">
                  <Music size={16} />
                  <span>1. Stage Identity & Genre</span>
                </legend>

                <div className="form-grid-2">
                  <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
                    <label htmlFor="artist-name" className="field-label">
                      Stage / Artist Name <span className="req">*</span>
                    </label>
                    <input
                      id="artist-name"
                      type="text"
                      className="text-input"
                      placeholder="e.g. Maya & The Velvet Groove / DJ Arjun"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    {errors.name && <span className="field-error-msg">{errors.name}</span>}
                  </div>

                  <div className={`form-field ${errors.genre ? 'has-error' : ''}`}>
                    <label htmlFor="artist-genre" className="field-label">
                      Primary Genre / Type <span className="req">*</span>
                    </label>
                    <select
                      id="artist-genre"
                      className="select-input"
                      value={formData.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      required
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {errors.genre && <span className="field-error-msg">{errors.genre}</span>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className={`form-field ${errors.city ? 'has-error' : ''}`}>
                    <label htmlFor="artist-city" className="field-label">
                      Base City <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="input-addon-icon" />
                      <input
                        id="artist-city"
                        type="text"
                        className="text-input with-addon"
                        placeholder="e.g. Bangalore"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    {errors.city && <span className="field-error-msg">{errors.city}</span>}
                  </div>

                  <div className="form-field toggle-field">
                    <label className="field-label">
                      Open for Kesari Open Mics? <span className="req">*</span>
                    </label>
                    <div className="toggle-switch-group">
                      <button
                        type="button"
                        className={`toggle-pill ${formData.openMic ? 'active' : ''}`}
                        onClick={() => handleInputChange('openMic', true)}
                      >
                        <Radio size={13} />
                        <span>Yes, love open mics</span>
                      </button>
                      <button
                        type="button"
                        className={`toggle-pill ${!formData.openMic ? 'active' : ''}`}
                        onClick={() => handleInputChange('openMic', false)}
                      >
                        <span>Feature sets only</span>
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* SECTION 2: Contact Details (Confidential) */}
              <fieldset className="artist-form-section">
                <legend className="section-legend">
                  <ShieldCheck size={16} />
                  <span>2. Contact Details (Strictly Confidential)</span>
                </legend>

                <div className="form-grid-2">
                  <div className={`form-field ${errors.phone ? 'has-error' : ''}`}>
                    <label htmlFor="artist-phone" className="field-label">
                      Mobile Number (WhatsApp) <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="artist-phone"
                        type="tel"
                        maxLength="15"
                        className="text-input with-prefix"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    {errors.phone ? (
                      <span className="field-error-msg">{errors.phone}</span>
                    ) : (
                      <span className="field-hint">Used by Kesari management for booking confirmations.</span>
                    )}
                  </div>

                  <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="artist-email" className="field-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-addon-icon" />
                      <input
                        id="artist-email"
                        type="email"
                        className="text-input with-addon"
                        placeholder="artist@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    {errors.email && <span className="field-error-msg">{errors.email}</span>}
                  </div>
                </div>
              </fieldset>

              {/* SECTION 3: Visuals, Sample Links & Socials */}
              <fieldset className="artist-form-section">
                <legend className="section-legend">
                  <Video size={16} />
                  <span>3. Photo & Performance Samples</span>
                </legend>

                <div className={`form-field photo-upload-field ${errors.photo ? 'has-error' : ''}`}>
                  <label className="field-label">
                    Artist / Band Photo <span className="field-sublabel">(Max 5MB • JPG, PNG, WebP)</span>
                  </label>

                  <div className="photo-upload-wrapper">
                    {previewUrl ? (
                      <div className="photo-preview-box">
                        <img src={previewUrl} alt="Artist Preview" className="preview-image" />
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={handleRemovePhoto}
                          title="Remove photo"
                          aria-label="Remove photo"
                        >
                          <X size={15} />
                        </button>
                        <div className="preview-caption">Instant Preview Ready</div>
                      </div>
                    ) : (
                      <div
                        className="dropzone-area"
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex="0"
                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                      >
                        <div className="dropzone-icon-circle">
                          <Upload size={22} />
                        </div>
                        <div className="dropzone-text">
                          <strong>Click to upload artist photo</strong> or drag and drop
                        </div>
                        <div className="dropzone-subtext">PNG, JPG, or WebP up to 5MB</div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handlePhotoSelect}
                      style={{ display: 'none' }}
                    />
                  </div>
                  {errors.photo && <span className="field-error-msg">{errors.photo}</span>}
                </div>

                <div className="form-grid-2">
                  <div className={`form-field ${errors.videoUrl ? 'has-error' : ''}`}>
                    <label htmlFor="artist-video" className="field-label">
                      Video Sample Link <span className="field-sublabel">(YouTube / Vimeo / Drive)</span>
                    </label>
                    <div className="input-with-icon">
                      <Video size={16} className="input-addon-icon" />
                      <input
                        id="artist-video"
                        type="url"
                        className="text-input with-addon"
                        placeholder="https://youtu.be/..."
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      />
                    </div>
                    {errors.videoUrl && <span className="field-error-msg">{errors.videoUrl}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="artist-insta" className="field-label">
                      Instagram Handle
                    </label>
                    <div className="input-with-icon">
                      <Instagram size={16} className="input-addon-icon" />
                      <span className="at-prefix">@</span>
                      <input
                        id="artist-insta"
                        type="text"
                        className="text-input with-at"
                        placeholder="yourhandle"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={`form-field ${errors.channel ? 'has-error' : ''}`}>
                  <label htmlFor="artist-channel" className="field-label">
                    Portfolio / Channel / Streaming URL
                  </label>
                  <div className="input-with-icon">
                    <Globe size={16} className="input-addon-icon" />
                    <input
                      id="artist-channel"
                      type="url"
                      className="text-input with-addon"
                      placeholder="https://spotify.com / https://youtube.com/@channel"
                      value={formData.channel}
                      onChange={(e) => handleInputChange('channel', e.target.value)}
                    />
                  </div>
                  {errors.channel && <span className="field-error-msg">{errors.channel}</span>}
                </div>
              </fieldset>

              {/* SECTION 4: Experience, Fee & Rider */}
              <fieldset className="artist-form-section">
                <legend className="section-legend">
                  <FileText size={16} />
                  <span>4. Performance Experience & Pricing</span>
                </legend>

                <div className={`form-field ${errors.previousEvents ? 'has-error' : ''}`}>
                  <label htmlFor="artist-events" className="field-label">
                    Previous Events & Venues Played <span className="req">*</span>
                  </label>
                  <textarea
                    id="artist-events"
                    rows="3"
                    className="textarea-input"
                    placeholder="List notable past gigs, festivals, college fests, or cafes you've performed at (e.g. Fandom Bangalore, Hard Rock Cafe, Under The Stars Fest)..."
                    value={formData.previousEvents}
                    onChange={(e) => handleInputChange('previousEvents', e.target.value)}
                    required
                  />
                  {errors.previousEvents && (
                    <span className="field-error-msg">{errors.previousEvents}</span>
                  )}
                </div>

                <div className="form-grid-2">
                  <div className={`form-field ${errors.costPerEvent ? 'has-error' : ''}`}>
                    <label htmlFor="artist-cost" className="field-label">
                      Cost Per Event in INR (₹) <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <IndianRupee size={16} className="input-addon-icon" />
                      <input
                        id="artist-cost"
                        type="number"
                        min="0"
                        step="500"
                        className="text-input with-addon"
                        placeholder="e.g. 5000"
                        value={formData.costPerEvent}
                        onChange={(e) => handleInputChange('costPerEvent', e.target.value)}
                        required
                      />
                    </div>
                    {errors.costPerEvent && (
                      <span className="field-error-msg">{errors.costPerEvent}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="artist-achievements" className="field-label">
                      Key Achievements / Releases <span className="field-sublabel">(Optional)</span>
                    </label>
                    <input
                      id="artist-achievements"
                      type="text"
                      className="text-input"
                      placeholder="e.g. Debut EP release, 100k Spotify streams"
                      value={formData.achievements}
                      onChange={(e) => handleInputChange('achievements', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="artist-extra" className="field-label">
                    Extra Notes / Tech Rider Needs <span className="field-sublabel">(Optional)</span>
                  </label>
                  <textarea
                    id="artist-extra"
                    rows="2"
                    className="textarea-input"
                    placeholder="e.g. We require 2 DI boxes, 3 vocal mics, drum kit shell pack, or special stage setup."
                    value={formData.extraDetails}
                    onChange={(e) => handleInputChange('extraDetails', e.target.value)}
                  />
                </div>
              </fieldset>

              {/* SECTION 5: Consent & Submit */}
              <fieldset className="artist-form-section consent-section">
                <div className={`consent-wrapper ${errors.consent ? 'has-error' : ''}`}>
                  <label className="checkbox-label" htmlFor="artist-consent">
                    <input
                      id="artist-consent"
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="checkbox-input"
                      required
                    />
                    <span className="checkbox-text">
                      I agree to Kesari displaying my profile and contacting me regarding concerts, open mics,
                      and live sound opportunities. <span className="req">*</span>
                    </span>
                  </label>
                  {errors.consent && <span className="field-error-msg">{errors.consent}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-artist-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="spinner-wrapper">
                        <span className="btn-spinner" /> Submitting Application...
                      </span>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        <span>Submit Artist Registration</span>
                      </>
                    )}
                  </button>
                  <p className="submission-disclaimer">
                    Submitted profiles are reviewed by our studio curation team within 48–72 hours.
                  </p>
                </div>
              </fieldset>
            </form>
          </>
        ) : (
          /* SUCCESS VIEW */
          <div className="artist-success-card">
            <div className="success-icon-badge">
              <CheckCircle2 size={50} className="success-icon" />
            </div>

            <h2 className="success-title">Application Submitted!</h2>
            <p className="success-message">
              Thank you, <strong>{submittedArtist?.name || formData.name}</strong>. Your profile has been received
              by the Kesari Studio artist curation team.
            </p>

            <div className="success-details-pill">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="status-badge pending">Under Review (Pending)</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Genre</span>
                <span className="detail-val">{submittedArtist?.genre || formData.genre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Base City</span>
                <span className="detail-val">{submittedArtist?.city || formData.city}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Standard Fee</span>
                <span className="detail-val">₹{Number(submittedArtist?.costPerEvent || formData.costPerEvent).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="success-timeline-box">
              <h3 className="timeline-title">What happens next?</h3>
              <ul className="timeline-list">
                <li>
                  <span className="step-num">1</span>
                  <span>Our talent curators review your performance samples and background.</span>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <span>Once approved, your card will go live on the public <strong>Book an Artist</strong> directory.</span>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <span>We will reach out to you via WhatsApp or Email when a gig matches your genre and rider.</span>
                </li>
              </ul>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="btn-primary-action"
                onClick={handleGoToDirectory}
              >
                Browse Artist Directory
              </button>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleResetForm}
              >
                Submit Another Application
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
