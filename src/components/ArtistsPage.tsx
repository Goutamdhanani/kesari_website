import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Mic2,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KESARI_CONTACT, formatCurrencyINR } from '../utils/studioLogic';

export interface StudioArtist {
  id: string;
  name: string;
  genre: string;
  city: string;
  photoUrl?: string;
  videoUrl?: string;
  instagram?: string;
  channel?: string;
  previousEvents?: string;
  achievements?: string;
  costPerEvent: number;
  openMic: boolean;
  extraDetails?: string;
  createdAt?: string;
}

interface ArtistsPageProps {
  artists: StudioArtist[];
  loading?: boolean;
  initialMode?: 'directory' | 'register';
  onArtistAdded: (artist: StudioArtist) => void;
  onBack: () => void;
}

const FILTER_CATEGORIES = [
  { id: 'All', label: 'All Artists' },
  { id: 'Vocalists', label: 'Vocalists', match: ['Singer / Vocalist', 'Singer', 'Vocalist'] },
  { id: 'Bands', label: 'Bands', match: ['Live Band', 'Band'] },
  { id: 'DJs', label: 'DJs', match: ['DJ / Electronic', 'DJ / Electronic Producer', 'DJ'] },
  { id: 'Stand-up', label: 'Stand-up', match: ['Stand-up Comedian', 'Stand-up', 'Comedy'] },
  {
    id: 'Instrumental',
    label: 'Instrumental',
    match: ['Instrumentalist', 'Instrumentalist (Guitar / Violin / Flute / Percussion)'],
  },
  { id: 'Poet', label: 'Poets & Writers', match: ['Poet / Spoken Word', 'Poet'] },
];

const GENRE_OPTIONS = [
  'Singer / Vocalist',
  'Live Band',
  'Stand-up Comedian',
  'DJ / Electronic Producer',
  'Instrumentalist (Guitar / Violin / Flute / Percussion)',
  'Poet / Spoken Word',
  'Rapper / Hip-Hop Artist',
  'Folk & Classical Fusion',
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
  'Other',
];

export function getArtistDisplayName(artistOrName: StudioArtist | string): string {
  if (!artistOrName) return '';
  const name = typeof artistOrName === 'string' ? artistOrName : artistOrName.name || '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  const genre = typeof artistOrName === 'object' ? (artistOrName.genre || '').toLowerCase() : '';
  const lower = trimmed.toLowerCase();

  if (
    genre.includes('band') ||
    lower.startsWith('the ') ||
    lower.includes('collective') ||
    lower.includes('project')
  ) {
    return trimmed;
  }
  if (lower.startsWith('dj ')) {
    const parts = trimmed.split(/\s+/);
    return `${parts[0]} ${parts[1] || ''}`.trim();
  }
  return trimmed.split(/\s+/)[0];
}

function getEmbedVideoUrl(url?: string): string | null {
  if (!url) return null;
  try {
    if (url.includes('youtube.com/watch')) {
      const m = url.match(/[?&]v=([^&]+)/);
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const m = url.match(/youtu\.be\/([^?]+)/);
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
    }
  } catch {}
  return null;
}

function validateIndianPhone(raw: string): string | null {
  if (!raw) return null;
  const cleaned = String(raw).replace(/[\s\-()+]/g, '');
  let digits = cleaned;
  if (cleaned.startsWith('91') && cleaned.length === 12) digits = cleaned.slice(2);
  else if (cleaned.startsWith('0') && cleaned.length === 11) digits = cleaned.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const ArtistsPage: React.FC<ArtistsPageProps> = ({
  artists,
  loading = false,
  initialMode = 'directory',
  onArtistAdded,
  onBack,
}) => {
  const [mode, setMode] = useState<'directory' | 'register'>(initialMode);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMicOnly, setOpenMicOnly] = useState(false);

  // Directory modals
  const [activeVideoArtist, setActiveVideoArtist] = useState<StudioArtist | null>(null);
  const [enquiryArtist, setEnquiryArtist] = useState<StudioArtist | null>(null);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    eventType: 'Concert / Live Gig',
    venue: '',
    notes: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({});

  // Register form state
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
    b_website: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedArtist, setSubmittedArtist] = useState<StudioArtist | null>(null);
  const [generalError, setGeneralError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      if (activeFilter !== 'All') {
        const cat = FILTER_CATEGORIES.find((c) => c.id === activeFilter);
        if (cat?.match) {
          const matched = cat.match.some((m) =>
            artist.genre?.toLowerCase().includes(m.toLowerCase()),
          );
          if (!matched) return false;
        }
      }
      if (openMicOnly && !artist.openMic) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          artist.name?.toLowerCase().includes(q) ||
          artist.genre?.toLowerCase().includes(q) ||
          artist.city?.toLowerCase().includes(q) ||
          (artist.previousEvents || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [artists, activeFilter, openMicOnly, searchQuery]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        photo: 'Photo exceeds 5MB limit. Please choose a smaller image.',
      }));
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({
        ...prev,
        photo: 'Please upload a valid JPEG, PNG, or WebP image.',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setPreviewUrl(result);
      setFormData((prev) => ({ ...prev, photoUrl: result }));
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.photo;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.b_website.trim()) return;

    const errs: Record<string, string> = {};
    if (formData.name.trim().length < 2) errs.name = 'Stage or full name is required (min 2 chars).';
    if (!validateIndianPhone(formData.phone)) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    if (formData.previousEvents.trim().length < 10) {
      errs.previousEvents = 'Describe past shows or venues (at least 10 characters).';
    }
    const cost = Number(formData.costPerEvent);
    if (!formData.costPerEvent || Number.isNaN(cost) || cost < 0) {
      errs.costPerEvent = 'Enter standard performance fee in ₹ INR.';
    }
    if (!formData.consent) {
      errs.consent = 'Please agree to Kesari displaying your artist profile.';
    }
    if (formData.videoUrl.trim()) {
      try {
        const u = new URL(formData.videoUrl.trim());
        if (!['http:', 'https:'].includes(u.protocol)) errs.videoUrl = 'URL must start with https://';
      } catch {
        errs.videoUrl = 'Enter a valid YouTube or video URL.';
      }
    }
    if (formData.channel.trim()) {
      try {
        const u = new URL(formData.channel.trim());
        if (!['http:', 'https:'].includes(u.protocol)) errs.channel = 'URL must start with https://';
      } catch {
        errs.channel = 'Enter a valid Spotify / YouTube / Website URL.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    setGeneralError('');

    const payload = {
      name: formData.name.trim(),
      genre: formData.genre,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city,
      photoUrl: formData.photoUrl,
      videoUrl: formData.videoUrl.trim(),
      instagram: formData.instagram.trim(),
      channel: formData.channel.trim(),
      previousEvents: formData.previousEvents.trim(),
      achievements: formData.achievements.trim(),
      costPerEvent: Number(formData.costPerEvent),
      openMic: formData.openMic,
      extraDetails: formData.extraDetails.trim(),
    };

    try {
      const res = await fetch('/api/artists/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setGeneralError(data.error || 'Failed to register artist.');
        setSubmitting(false);
        return;
      }
      const created: StudioArtist = data.artist;
      onArtistAdded(created);
      setSubmittedArtist(created);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } catch {
      // Offline fallback so user can still add artist locally
      const fallback: StudioArtist = {
        id: `ART-${Date.now().toString(36).toUpperCase()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      onArtistAdded(fallback);
      setSubmittedArtist(fallback);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!enquiryData.name.trim()) errs.name = 'Enter your name.';
    if (!validateIndianPhone(enquiryData.phone)) errs.phone = 'Enter valid 10-digit phone.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryData.email.trim())) {
      errs.email = 'Enter valid email.';
    }
    if (!enquiryData.date) errs.date = 'Select target date.';
    if (Object.keys(errs).length > 0) {
      setEnquiryErrors(errs);
      return;
    }
    setEnquiryErrors({});
    setEnquirySubmitted(true);
  };

  const openWhatsAppBooking = () => {
    if (!enquiryArtist) return;
    const displayName = getArtistDisplayName(enquiryArtist);
    const msg = `Hi Kesari Studio! I would like to enquire about booking *${displayName}* (${enquiryArtist.genre}) for an upcoming event.\n• Date: ${enquiryData.date || 'TBD'}\n• Event Type: ${enquiryData.eventType}\n• Venue / City: ${enquiryData.venue || 'Bangalore'}\n• Name: ${enquiryData.name}\n• Phone: ${enquiryData.phone}`;
    window.open(KESARI_CONTACT.whatsappUrl(msg), '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Header Bar with Back Button + Add Artist CTA */}
      <div className="rounded-[28px] bg-[#0B0B0F] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (mode === 'register') {
                setMode('directory');
                setSubmittedArtist(null);
              } else {
                onBack();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white/85 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{mode === 'register' ? 'Back to Artists' : 'Back'}</span>
          </button>

          {mode === 'directory' && (
            <button
              type="button"
              onClick={() => {
                setSubmittedArtist(null);
                setMode('register');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#07070A] font-semibold text-xs hover:bg-white/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Register Artist</span>
            </button>
          )}
        </div>

        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {mode === 'register' ? 'ARTIST APPLICATION' : 'KESARI TALENT ROSTER'}
          </p>
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mt-1">
            {mode === 'register' ? 'Join the Kesari Roster.' : 'Artists & Performers'}
          </h2>
          <p className="text-xs sm:text-sm text-white/55 mt-1">
            {mode === 'register'
              ? 'Submit your profile, reel, and performance fee. Approved artists appear in our directory & search.'
              : 'Browse vocalists, live bands, DJs, stand-up comics, and poets available for showcases & bookings.'}
          </p>
        </div>

        {/* Search & Filters in Directory Mode */}
        {mode === 'directory' && (
          <div className="space-y-3 pt-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-white/45 absolute left-4 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artists by name, genre, city, or past gigs..."
                className="w-full h-11 pl-11 pr-10 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/35"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear artist search"
                  className="absolute right-2.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {FILTER_CATEGORIES.map((cat) => {
                const active = activeFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-white text-[#07070A] font-semibold'
                        : 'bg-white/[0.05] text-white/65 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setOpenMicOnly((v) => !v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  openMicOnly
                    ? 'bg-[#D8FF48] text-[#07070A] border-[#D8FF48] font-semibold'
                    : 'bg-white/[0.03] text-white/65 border-white/10 hover:text-white'
                }`}
              >
                Open Mic Ready
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DIRECTORY VIEW */}
      {mode === 'directory' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-56 rounded-[24px] bg-white/[0.03] border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="rounded-[26px] bg-[#0B0B0F] border border-white/10 p-8 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60">
                <Mic2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {artists.length === 0 ? 'No Artists Added Yet' : 'No Matching Artists'}
                </h3>
                <p className="text-xs text-white/55 mt-1 max-w-sm mx-auto">
                  {artists.length === 0
                    ? 'Add your first artist to the Kesari Talent Roster with their reel, genres, and booking rate.'
                    : 'Try clearing filters or searching another genre or city.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-[#07070A] font-semibold text-xs hover:bg-white/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Artist</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredArtists.map((artist) => {
                const displayName = getArtistDisplayName(artist);
                const embedUrl = getEmbedVideoUrl(artist.videoUrl);
                return (
                  <article
                    key={artist.id}
                    className="rounded-[24px] bg-[#0B0B0F] border border-white/10 hover:border-white/25 p-4 flex flex-col justify-between gap-3.5 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        {artist.photoUrl ? (
                          <img
                            src={artist.photoUrl}
                            alt={displayName}
                            className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-base font-bold text-white shrink-0">
                            {displayName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-semibold text-white truncate">
                              {displayName}
                            </h3>
                            {artist.openMic && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#D8FF48]/15 text-[#D8FF48] border border-[#D8FF48]/25 shrink-0">
                                Open Mic
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/60 truncate">{artist.genre}</p>
                          <p className="text-[11px] text-white/45 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{artist.city}</span>
                            {artist.costPerEvent > 0 && (
                              <>
                                <span>·</span>
                                <span className="text-white/80 font-medium">
                                  {formatCurrencyINR(artist.costPerEvent)}/gig
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {artist.previousEvents && (
                        <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                          {artist.previousEvents}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2">
                      {artist.videoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (embedUrl) {
                              setActiveVideoArtist(artist);
                            } else {
                              window.open(artist.videoUrl, '_blank');
                            }
                          }}
                          className="h-9 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Reel</span>
                        </button>
                      )}
                      {artist.instagram && (
                        <a
                          href={
                            artist.instagram.startsWith('http')
                              ? artist.instagram
                              : `https://instagram.com/${artist.instagram.replace(/^@/, '')}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${displayName} Instagram`}
                          className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white/75 hover:text-white transition-colors"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEnquiryArtist(artist);
                          setEnquirySubmitted(false);
                          setEnquiryErrors({});
                        }}
                        className="flex-1 h-9 rounded-full bg-white text-[#07070A] font-semibold text-xs hover:bg-white/90 transition-colors"
                      >
                        Enquire / Book
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* REGISTER / ADD ARTIST VIEW */}
      {mode === 'register' && (
        <div className="rounded-[28px] bg-[#0B0B0F] border border-white/10 p-5 sm:p-6">
          {submittedArtist ? (
            <div className="py-8 text-center space-y-4 max-w-md mx-auto">
              <div className="mx-auto w-14 h-14 rounded-full bg-white text-[#07070A] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Artist Added to Roster!</h3>
                <p className="text-xs text-white/60 mt-1">
                  {submittedArtist.name} ({submittedArtist.genre}) is now live in the Kesari Artist Directory and Search.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedArtist(null);
                  setMode('directory');
                }}
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                View Artist Directory
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                name="b_website"
                value={formData.b_website}
                onChange={(e) => setFormData((p) => ({ ...p, b_website: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Photo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-white/40" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium text-white transition-colors"
                    >
                      {previewUrl ? 'Change Photo' : 'Upload Artist Photo'}
                    </button>
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl('');
                          setFormData((p) => ({ ...p, photoUrl: '' }));
                        }}
                        className="text-xs text-white/50 hover:text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-white/45">JPEG, PNG or WebP (max 5MB)</p>
                  {formErrors.photo && <p className="text-xs text-rose-300">{formErrors.photo}</p>}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Stage / Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Aarav / The Velvet Echoes"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-300 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Primary Genre *
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData((p) => ({ ...p, genre: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#0D0E13] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  >
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Mobile / WhatsApp (Private) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-300 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Email Address (Private) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="artist@example.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-300 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Base City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#0D0E13] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Standard Performance Fee (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.costPerEvent}
                    onChange={(e) => setFormData((p) => ({ ...p, costPerEvent: e.target.value }))}
                    placeholder="e.g. 8000"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                  {formErrors.costPerEvent && (
                    <p className="text-[11px] text-rose-300 mt-1">{formErrors.costPerEvent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Performance Video Link (YouTube/Vimeo)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                  {formErrors.videoUrl && (
                    <p className="text-[11px] text-rose-300 mt-1">{formErrors.videoUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData((p) => ({ ...p, instagram: e.target.value }))}
                    placeholder="@yourhandle"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                  Spotify / Channel / Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.channel}
                  onChange={(e) => setFormData((p) => ({ ...p, channel: e.target.value }))}
                  placeholder="https://open.spotify.com/artist/..."
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                />
                {formErrors.channel && <p className="text-[11px] text-rose-300 mt-1">{formErrors.channel}</p>}
              </div>

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                  Past Shows, Venues &amp; Bio *
                </label>
                <textarea
                  rows={3}
                  value={formData.previousEvents}
                  onChange={(e) => setFormData((p) => ({ ...p, previousEvents: e.target.value }))}
                  placeholder="Tell us about venues you have performed at, acoustic style, or audience highlights..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                />
                {formErrors.previousEvents && (
                  <p className="text-[11px] text-rose-300 mt-1">{formErrors.previousEvents}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Achievements &amp; Highlights
                  </label>
                  <input
                    type="text"
                    value={formData.achievements}
                    onChange={(e) => setFormData((p) => ({ ...p, achievements: e.target.value }))}
                    placeholder="Awards, featured festivals, releases..."
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-white/50 mb-1">
                    Tech Rider / Extra Notes
                  </label>
                  <input
                    type="text"
                    value={formData.extraDetails}
                    onChange={(e) => setFormData((p) => ({ ...p, extraDetails: e.target.value }))}
                    placeholder="e.g. 2 vocal mics + guitar DI"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-white/35"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.openMic}
                  onChange={(e) => setFormData((p) => ({ ...p, openMic: e.target.checked }))}
                  className="rounded border-white/20 accent-[#D8FF48]"
                />
                <span>Available for Open Mic &amp; Intimate Studio Showcases</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-white/75 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                  className="mt-0.5 rounded border-white/20 accent-white"
                />
                <span>
                  I agree to Kesari displaying my stage profile publicly (keeping phone &amp; email private) and contacting me for bookings.
                </span>
              </label>
              {formErrors.consent && <p className="text-[11px] text-rose-300">{formErrors.consent}</p>}

              {generalError && <p className="text-xs text-rose-300">{generalError}</p>}

              <div className="pt-2 flex items-center gap-2 text-[11px] text-white/50">
                <ShieldCheck className="w-4 h-4 text-white/60 shrink-0" />
                <span>Phone and email are kept strictly confidential for Kesari booking team only.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Adding Artist...' : 'Submit & Add Artist to Roster'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* VIDEO REEL MODAL */}
      {activeVideoArtist && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl rounded-[28px] bg-[#0B0B0F] border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveVideoArtist(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] text-xs text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-sm font-semibold text-white">
                {getArtistDisplayName(activeVideoArtist)} · Reel
              </span>
              <a
                href={activeVideoArtist.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/65 hover:text-white inline-flex items-center gap-1"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={getEmbedVideoUrl(activeVideoArtist.videoUrl) || ''}
                title={activeVideoArtist.name}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ARTIST BOOKING ENQUIRY MODAL */}
      {enquiryArtist && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto"
        >
          <div className="w-full sm:max-w-[440px] rounded-t-[30px] sm:rounded-[30px] bg-[#0B0B0F] border border-white/10 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEnquiryArtist(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] text-xs text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setEnquiryArtist(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                BOOK ARTIST
              </p>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Enquire for {getArtistDisplayName(enquiryArtist)}
              </h3>
              <p className="text-xs text-white/55">{enquiryArtist.genre}</p>
            </div>

            {enquirySubmitted ? (
              <div className="py-4 text-center space-y-3">
                <p className="text-sm font-medium text-white">
                  Enquiry ready! Send directly to Kesari booking desk on WhatsApp:
                </p>
                <button
                  type="button"
                  onClick={openWhatsAppBooking}
                  className="w-full h-11 rounded-full bg-[#25D366] text-[#07070A] font-bold text-xs inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Booking Enquiry on WhatsApp</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={enquiryData.name}
                  onChange={(e) => setEnquiryData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
                {enquiryErrors.name && <p className="text-[11px] text-rose-300">{enquiryErrors.name}</p>}

                <input
                  type="tel"
                  placeholder="10-digit Phone *"
                  value={enquiryData.phone}
                  onChange={(e) => setEnquiryData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
                {enquiryErrors.phone && <p className="text-[11px] text-rose-300">{enquiryErrors.phone}</p>}

                <input
                  type="email"
                  placeholder="Email *"
                  value={enquiryData.email}
                  onChange={(e) => setEnquiryData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
                {enquiryErrors.email && <p className="text-[11px] text-rose-300">{enquiryErrors.email}</p>}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={enquiryData.date}
                    onChange={(e) => setEnquiryData((p) => ({ ...p, date: e.target.value }))}
                    className="h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="City / Venue"
                    value={enquiryData.venue}
                    onChange={(e) => setEnquiryData((p) => ({ ...p, venue: e.target.value }))}
                    className="h-10 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                {enquiryErrors.date && <p className="text-[11px] text-rose-300">{enquiryErrors.date}</p>}

                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-white text-[#07070A] font-semibold text-xs hover:bg-white/90 transition-colors"
                >
                  Continue to WhatsApp Confirmation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
