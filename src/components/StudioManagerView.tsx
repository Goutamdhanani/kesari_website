import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Database,
  DownloadCloud,
  FileText,
  Key,
  Layers,
  Lock,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Unlock,
  UserPlus,
  X,
} from 'lucide-react';
import {
  CreateEventInput,
  EventCategory,
  GradientTheme,
  KESARI_CONTACT,
  StudioBooking,
  StudioEvent,
  StudioMetrics,
  TicketPass,
  formatCurrencyINR,
  isPastEvent,
  parseFydoHTMLOrUrl,
} from '../utils/studioLogic';
import { StudioArtist } from './ArtistsPage';
import { QrStudioTab } from './QrStudioTab';
import { CafeAdminTab } from './CafeAdminTab';

type AdminTab = 'events' | 'cafe' | 'artists' | 'orders' | 'enquiries' | 'qr' | 'settings';

interface StudioManagerViewProps {
  events: StudioEvent[];
  metrics: StudioMetrics;
  passes?: TicketPass[];
  bookings?: StudioBooking[];
  enquiries?: Array<{
    id: string;
    type?: string;
    title?: string;
    detail?: string;
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    bookingCode?: string;
    createdAt?: string;
  }>;
  initialSettings?: Record<string, any>;
  artists?: Array<StudioArtist & { status?: string; phone?: string; email?: string }>;
  openCreateOnMount?: boolean;
  onConsumeOpenCreate?: () => void;
  onToggleLive: (eventId: string) => void;
  onDoorSale: (eventId: string) => void;
  onCreateEvent: (
    input: CreateEventInput
  ) => { ok: true; created: StudioEvent } | { ok: false; error: string };
  onDeleteEvent?: (eventId: string) => void;
  onReviewOrder?: (passId: string, status: 'confirmed' | 'rejected') => void;
  onReviewArtist?: (artistId: string, status: 'approved' | 'rejected') => void;
  onDeleteArtist?: (artistId: string) => void;
}

const GRADIENT_OPTIONS: Array<{ id: GradientTheme; label: string; previewClass: string }> = [
  { id: 'plum', label: 'Magenta Plum', previewClass: 'surface-plum' },
  { id: 'indigo', label: 'Indigo Electric', previewClass: 'surface-indigo' },
  { id: 'cerulean', label: 'Cerulean Ocean', previewClass: 'surface-cerulean' },
  { id: 'ember', label: 'Crimson Ember', previewClass: 'surface-ember' },
];

export const StudioManagerView: React.FC<StudioManagerViewProps> = ({
  events,
  metrics,
  passes = [],
  bookings = [],
  enquiries = [],
  initialSettings,
  artists = [],
  openCreateOnMount,
  onConsumeOpenCreate,
  onToggleLive,
  onDoorSale,
  onCreateEvent,
  onDeleteEvent,
  onReviewOrder,
  onReviewArtist,
  onDeleteArtist,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(Boolean(openCreateOnMount));
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [artistOrHost, setArtistOrHost] = useState('');
  const [venue, setVenue] = useState('Kesari - The Memory Studio, Koramangala');
  const [city, setCity] = useState('Bangalore');
  const [dateLabel, setDateLabel] = useState('Sat 6 Dec');
  const [timeLabel, setTimeLabel] = useState('21:00');
  const [basePrice, setBasePrice] = useState('1499');
  const [capacity, setCapacity] = useState('40');
  const [category, setCategory] = useState<EventCategory>('nightlife');
  const [theme, setTheme] = useState<GradientTheme>('plum');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('✨ Live Gig');

  // Fydo Importer State
  const [fydoInput, setFydoInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Studio Settings State
  const [upiId, setUpiId] = useState(KESARI_CONTACT.upiId);
  const [payeeName, setPayeeName] = useState(KESARI_CONTACT.payeeName);
  const [phone, setPhone] = useState(KESARI_CONTACT.phone);
  const [email, setEmail] = useState(KESARI_CONTACT.email);
  const [address, setAddress] = useState(KESARI_CONTACT.fullAddress);
  const [checkinWebhookUrl, setCheckinWebhookUrl] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!initialSettings) return;
    if (initialSettings.upiId) setUpiId(initialSettings.upiId);
    if (initialSettings.payeeName) setPayeeName(initialSettings.payeeName);
    if (initialSettings.phone) setPhone(initialSettings.phone);
    if (initialSettings.email) setEmail(initialSettings.email);
    if (initialSettings.address) setAddress(initialSettings.address);
    if (typeof initialSettings.checkinWebhookUrl === 'string') {
      setCheckinWebhookUrl(initialSettings.checkinWebhookUrl);
    }
  }, [initialSettings]);

  // Backend / MongoDB Atlas Health state
  const [dbHealth, setDbHealth] = useState<{
    engine: string;
    connected: boolean;
    uriConfigured: boolean;
    database: string;
  }>({
    engine: 'MongoDB Atlas / Local Persistence Engine',
    connected: false,
    uriConfigured: false,
    database: 'kesari_studio',
  });

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.health) {
          setDbHealth(data.health);
        }
      })
      .catch(() => {
        // Running client-first
      });
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setShowCreateModal(true);
      onConsumeOpenCreate?.();
    }
  }, [openCreateOnMount, onConsumeOpenCreate]);

  // Handle 1-Click Fydo URL / HTML auto-parser
  const handleFydoImport = async () => {
    if (!fydoInput.trim()) {
      setImportNotice('Please paste a Fydo URL or HTML code');
      return;
    }
    setIsImporting(true);
    setImportNotice('Parsing Fydo event details...');

    try {
      // 1. Try server-side parser
      let parsed = null;
      try {
        const token = window.sessionStorage.getItem('kesari_admin_token');
        const res = await fetch('/api/admin/fydo-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ input: fydoInput.trim() }),
        });
        if (res.ok) {
          const body = await res.json();
          if (body.parsed) parsed = body.parsed;
        }
      } catch {}

      // 2. Fallback to client-side parser
      if (!parsed || !parsed.title) {
        parsed = parseFydoHTMLOrUrl(fydoInput.trim());
      }

      if (parsed.title) {
        setTitle(parsed.title);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.image) setImageUrl(parsed.image);
        if (parsed.price) setBasePrice(String(parsed.price));
        if (parsed.date) setDateLabel(parsed.date);
        if (parsed.time) setTimeLabel(parsed.time);
        if (parsed.venue) setVenue(parsed.venue);
        if (parsed.city) setCity(parsed.city || 'Bangalore');
        if (parsed.category) setCategory(parsed.category);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.capacity) setCapacity(String(parsed.capacity));
        setImportNotice(`Auto-populated from Fydo: "${parsed.title}"!`);
      } else {
        setImportNotice('Could not find event fields. Check the link or HTML.');
      }
    } catch (err) {
      setImportNotice('Error parsing Fydo input. You can enter details manually.');
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportNotice(null), 4000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const token = window.sessionStorage.getItem('kesari_admin_token');
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ upiId, payeeName, phone, email, address, checkinWebhookUrl }),
    }).catch(() => {});
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onCreateEvent({
      title,
      artistOrHost,
      venue,
      city,
      dateLabel,
      timeLabel,
      basePrice: Number(basePrice),
      capacity: Number(capacity),
      category,
      theme,
      description,
      imageUrl: imageUrl.trim() || undefined,
      badge: badge.trim() || undefined,
    });
    if (res.ok === false) {
      setFormError(res.error);
      return;
    }
    setFormError(null);
    setTitle('');
    setArtistOrHost('');
    setDescription('');
    setImageUrl('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Studio KPI Strip */}
      <section
        aria-label="Kesari Studio revenue and operations metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <div className="surface-plum rounded-[28px] p-5">
          <p className="text-xs font-medium text-white/80">Gross Revenue</p>
          <div className="font-dot text-3xl text-white mt-2 inline-flex items-start">
            <span className="font-display text-base font-medium text-white/75 mr-1 mt-0.5">
              ₹
            </span>
            <span>{Math.round(metrics.grossRevenue).toLocaleString('en-IN')}</span>
          </div>
          <p className="mt-1 text-xs text-white/65 tabular-nums">
            Across {events.length} live drops at Koramangala
          </p>
        </div>

        <div className="surface-indigo rounded-[28px] p-5">
          <span className="text-xs font-medium text-white/80">Tickets Sold</span>
          <div className="font-dot text-3xl text-white mt-2">{metrics.totalSold}</div>
          <p className="mt-1 text-xs text-white/65 tabular-nums">
            {metrics.attendanceRate}% of {metrics.totalCapacity} capacity
          </p>
        </div>

        <div className="surface-ember rounded-[28px] p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-white/80">Active Drops</span>
            <div className="font-dot text-3xl text-white mt-2">
              {String(metrics.activeEventsCount).padStart(2, '0')}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-3 h-10 px-4 rounded-full bg-white text-[#07070A] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Event</span>
          </button>
        </div>
      </section>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'events'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Events ({events.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cafe')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'cafe'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <span>Café Menu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('artists')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'artists'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Artists Roster ({artists.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>UPI Orders &amp; Passes ({passes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Bookings &amp; Inquiries ({bookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'qr'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Menu &amp; Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Studio &amp; MongoDB Settings</span>
        </button>
      </div>

      {/* TAB 1: Events Inventory */}
      {activeTab === 'events' && (
        <section aria-label="Manage your events" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-white">Event Inventory</h3>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="min-h-[40px] px-4 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Drop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {events.map((evt) => {
              const pct = evt.capacity > 0 ? Math.round((evt.sold / evt.capacity) * 100) : 0;
              const past = isPastEvent(evt);
              return (
                <article
                  key={evt.id}
                  className="surface-charcoal rounded-[26px] p-4 sm:p-5 flex flex-col gap-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[11px] text-white/55">
                          {evt.dateLabel} · {evt.timeLabel} · {evt.venue}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            past
                              ? 'bg-white/5 text-white/45 border-white/10'
                              : evt.isLive
                                ? 'bg-[#D8FF48]/15 text-[#D8FF48] border-[#D8FF48]/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {past ? 'Past Event' : evt.isLive ? 'Live Upcoming' : 'Paused'}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-semibold text-white truncate mt-0.5">
                        {evt.title}
                      </h4>
                      {evt.room && (
                        <p className="text-[11px] text-[#D8FF48] mt-0.5">{evt.room}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-white/70">
                        {evt.isLive ? 'Live' : 'Paused'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={evt.isLive}
                        aria-label={`Toggle live sales for ${evt.title}`}
                        onClick={() => onToggleLive(evt.id)}
                        className={`relative w-11 h-6 rounded-full p-0.5 transition-colors ${
                          evt.isLive ? 'bg-[#6F78E8]' : 'bg-white/15'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                            evt.isLive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/65 tabular-nums mb-1.5">
                      <span>
                        {evt.sold} / {evt.capacity} sold ({pct}%)
                      </span>
                      <span>{formatCurrencyINR(evt.sold * evt.basePrice)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#D8FF48] transition-all duration-300"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-white/55 tabular-nums">
                      Base {formatCurrencyINR(evt.basePrice)}
                    </span>
                    <div className="flex items-center gap-2">
                      {onDeleteEvent && (
                        <button
                          type="button"
                          onClick={() => onDeleteEvent(evt.id)}
                          aria-label={`Delete event ${evt.title}`}
                          className="w-9 h-9 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDoorSale(evt.id)}
                        disabled={evt.sold >= evt.capacity}
                        className="min-h-[38px] px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+1 Door Sale</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 1.5: Artists Roster Management */}
      {activeTab === 'artists' && (
        <section aria-label="Manage registered artists" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-white">Artists Roster &amp; Applications</h3>
            <a
              href="/artists/register"
              className="min-h-[36px] px-4 rounded-full bg-white text-[#07070A] text-xs font-semibold flex items-center gap-1.5 hover:bg-white/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Artist</span>
            </a>
          </div>

          {artists.length === 0 ? (
            <div className="surface-charcoal rounded-[24px] p-8 text-center text-sm text-white/60">
              No artists registered yet. Artists added on <code className="text-white">/artists</code> will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {artists.map((artist) => {
                const isApproved = !artist.status || artist.status === 'approved';
                return (
                  <article
                    key={artist.id}
                    className="surface-charcoal rounded-[24px] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {artist.photoUrl ? (
                          <img
                            src={artist.photoUrl}
                            alt={artist.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {artist.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">{artist.name}</h4>
                          <p className="text-xs text-white/60 truncate">
                            {artist.genre} · {artist.city}
                          </p>
                          <p className="text-[11px] text-white/45 truncate">
                            {artist.phone || 'No phone'} · {artist.email || 'No email'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {artist.status || 'approved'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-white/75 font-mono">
                        Fee: {formatCurrencyINR(artist.costPerEvent || 0)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {onReviewArtist && !isApproved && (
                          <button
                            type="button"
                            onClick={() => onReviewArtist(artist.id, 'approved')}
                            className="px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {onReviewArtist && isApproved && (
                          <button
                            type="button"
                            onClick={() => onReviewArtist(artist.id, 'rejected')}
                            className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 text-[11px] font-semibold"
                          >
                            Hide
                          </button>
                        )}
                        {onDeleteArtist && (
                          <button
                            type="button"
                            onClick={() => onDeleteArtist(artist.id)}
                            aria-label={`Delete ${artist.name}`}
                            className="w-7 h-7 rounded-full bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'cafe' && <CafeAdminTab />}

      {activeTab === 'qr' && <QrStudioTab />}

      {/* TAB 2: UPI Orders & Verification */}
      {activeTab === 'orders' && (
        <section aria-label="Customer Orders" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-semibold text-white">UPI Orders &amp; Gate Passes</h3>
              <p className="text-xs text-white/60">
                Review guest transaction references (UTRs) and confirm entry tickets.
              </p>
            </div>
          </div>

          {passes.length === 0 ? (
            <div className="surface-charcoal rounded-[26px] p-8 text-center text-white/60 text-xs">
              No orders logged yet. Guest ticket purchases will show up here.
            </div>
          ) : (
            <div className="space-y-2.5">
              {passes.map((p) => (
                <div
                  key={p.id}
                  className="surface-charcoal rounded-[22px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-dot text-lg text-white">{p.passCode}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.status === 'pending_review'
                            ? 'bg-[#D8FF48]/15 text-[#D8FF48]'
                            : p.status === 'confirmed' || p.checkedIn
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {p.status === 'pending_review'
                          ? 'Awaiting UTR Review'
                          : p.checkedIn
                          ? 'Checked In'
                          : 'Confirmed'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white">{p.eventTitle}</p>
                    <p className="text-[11px] text-white/60">
                      {p.quantity}× {p.tier} · {formatCurrencyINR(p.totalPaid)} · {p.dateLabel}
                    </p>
                    {p.utr && (
                      <p className="text-[11px] text-[#D8FF48] font-mono">
                        UTR: <span className="select-all">{p.utr}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === 'pending_review' && onReviewOrder && (
                      <>
                        <button
                          type="button"
                          onClick={() => onReviewOrder(p.id, 'confirmed')}
                          className="h-9 px-3.5 rounded-full bg-[#D8FF48] text-black text-xs font-bold hover:bg-[#C8EE38] transition-colors"
                        >
                          Confirm &amp; Mint
                        </button>
                        <button
                          type="button"
                          onClick={() => onReviewOrder(p.id, 'rejected')}
                          className="h-9 px-3 rounded-full bg-white/10 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: Enquiries & Service Bookings */}
      {activeTab === 'enquiries' && (
        <section aria-label="Bookings and Enquiries" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-white">
              Studio Service &amp; Space Inquiries
            </h3>
          </div>

          {bookings.length === 0 && enquiries.length === 0 ? (
            <div className="surface-charcoal rounded-[26px] p-8 text-center text-white/60 text-xs">
              No service or space inquiries yet. Inquiries from the website will appear here.
            </div>
          ) : (
            <div className="space-y-2.5">
              {enquiries.map((eq) => (
                <div
                  key={eq.id}
                  className="surface-charcoal rounded-[22px] p-4 flex items-center justify-between gap-3 border border-[#D8FF48]/20"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#D8FF48] tracking-wider block">
                      {eq.type || 'Event Enquiry'}
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate">
                      {eq.title || eq.name || 'Studio Enquiry'}
                    </h4>
                    <p className="text-xs text-white/65 mt-0.5">
                      {eq.detail || eq.message || ''}
                    </p>
                    <span className="text-[11px] font-mono text-white/45 mt-1 block">
                      {[eq.bookingCode, eq.phone, eq.email].filter(Boolean).join(' · ') || eq.createdAt}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#D8FF48] px-2.5 py-1 rounded-full bg-[#D8FF48]/10 shrink-0">
                    Enquiry
                  </span>
                </div>
              ))}
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="surface-charcoal rounded-[22px] p-4 flex items-center justify-between gap-3 border border-white/10"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#D8FF48] tracking-wider block">
                      {b.kind}
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate">{b.title}</h4>
                    <p className="text-xs text-white/65 mt-0.5">{b.detail}</p>
                    <span className="text-[11px] font-mono text-white/45 mt-1 block">
                      Code: {b.bookingCode} · Total {formatCurrencyINR(b.totalPaid)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white/80 px-2.5 py-1 rounded-full bg-white/10 shrink-0">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: Studio Settings & MongoDB Atlas Status */}
      {activeTab === 'settings' && (
        <section aria-label="Studio Settings" className="space-y-4">
          {/* MongoDB Atlas Status Card */}
          <div className="surface-indigo rounded-[28px] p-5 space-y-3 border border-white/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#D8FF48]" />
                <h4 className="text-sm font-bold text-white">Database &amp; Storage Engine</h4>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  dbHealth.connected
                    ? 'bg-emerald-500/25 text-emerald-300'
                    : 'bg-[#D8FF48]/20 text-[#D8FF48]'
                }`}
              >
                {dbHealth.connected ? 'Atlas Connected' : 'Local Persistence Engine'}
              </span>
            </div>

            <p className="text-xs text-white/75 leading-relaxed">
              Your studio is currently running on the{' '}
              <strong className="text-white">{dbHealth.engine}</strong> ({dbHealth.database}).
              Data persists across all sessions.
            </p>

            <div className="rounded-2xl bg-black/40 border border-white/10 p-3 text-xs text-white/70 space-y-1">
              <span className="font-semibold text-white block">
                Connect your MongoDB Atlas Free Tier Cluster:
              </span>
              <p className="text-[11px] text-white/60">
                1. Open <code className="text-[#D8FF48]">x:\district\.env</code>
              </p>
              <p className="text-[11px] text-white/60">
                2. Set{' '}
                <code className="text-[#D8FF48]">
                  MONGODB_URI="mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&amp;w=majority"
                </code>
              </p>
              <p className="text-[11px] text-white/60">
                3. The server automatically connects and syncs records seamlessly!
              </p>
            </div>
          </div>

          {/* Studio Contact & UPI Settings Form */}
          <form
            onSubmit={handleSaveSettings}
            className="surface-charcoal rounded-[28px] p-5 sm:p-6 space-y-4"
          >
            <h4 className="text-base font-semibold text-white">Studio Contact &amp; UPI Setup</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-white/70 block mb-1">Official UPI ID:</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#D8FF48]"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">UPI Payee Name:</label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Official Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Official Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-white/70 block mb-1">Studio Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-white/70 block mb-1">
                  Check-In Google Apps Script Webhook URL (same sheet as qr-checkin):
                </label>
                <input
                  type="url"
                  value={checkinWebhookUrl}
                  onChange={(e) => setCheckinWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec (or set GOOGLE_SHEET_WEBHOOK_URL in Hostinger)"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#D8FF48]"
                />
              </div>
            </div>

            {settingsSaved && (
              <p className="text-xs text-[#D8FF48] font-semibold">Settings saved successfully!</p>
            )}

            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 transition-colors"
            >
              Save Studio Settings
            </button>
          </form>
        </section>
      )}

      {/* Create New Event Modal with Fydo 1-Click Auto-Importer */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create new event"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto"
        >
          <div className="surface-charcoal w-full sm:max-w-[560px] rounded-t-[34px] sm:rounded-[34px] p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#D8FF48] uppercase tracking-wider">
                  Kesari Studio
                </span>
                <h3 className="text-lg font-semibold text-white">Launch New Event Drop</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close create event dialog"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fydo 1-Click Auto-Importer Header */}
            <div className="rounded-2xl bg-black/40 border border-white/15 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4 text-[#D8FF48]" />
                  <span>1-Click Import from Fydo (URL or HTML)</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://greet.fydo.in/... or paste HTML"
                  value={fydoInput}
                  onChange={(e) => setFydoInput(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                />
                <button
                  type="button"
                  onClick={handleFydoImport}
                  disabled={isImporting}
                  className="h-9 px-3.5 rounded-xl bg-[#D8FF48] text-black font-bold text-xs hover:bg-[#C8EE38] transition-colors shrink-0 disabled:opacity-50"
                >
                  {isImporting ? 'Parsing...' : 'Auto-Fill'}
                </button>
              </div>
              {importNotice && (
                <p className="text-[11px] text-[#D8FF48] font-medium">{importNotice}</p>
              )}
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/70 block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AMOUR – Yash Raj Films Live Tribute"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Artist or Host</label>
                  <input
                    type="text"
                    value={artistOrHost}
                    onChange={(e) => setArtistOrHost(e.target.value)}
                    placeholder="e.g. Amour String Ensemble"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. 🎻 Yash Raj Tribute"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Venue Room</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Date Label *</label>
                  <input
                    type="text"
                    required
                    value={dateLabel}
                    onChange={(e) => setDateLabel(e.target.value)}
                    placeholder="e.g. Sun 1 Nov"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Time Label *</label>
                  <input
                    type="text"
                    required
                    value={timeLabel}
                    onChange={(e) => setTimeLabel(e.target.value)}
                    placeholder="e.g. 18:00"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Guest Capacity *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-white/70 block mb-1">
                    Event Image URL (CloudFront, Unsplash, or local /assets/)
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /assets/events/ev_rock.jpg"
                    className="w-full h-10 px-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-white/70 block mb-1">Event Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A soulful live acoustic session featuring..."
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]"
                  />
                </div>
              </div>

              {/* Gradient Theme selector */}
              <div>
                <label className="text-xs text-white/70 block mb-1.5">Atmosphere Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GRADIENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTheme(opt.id)}
                      className={`h-9 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                        theme === opt.id
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/10 bg-black/25 text-white/60 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && <p className="text-xs text-rose-300 font-medium">{formError}</p>}

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#D8FF48] text-[#07070A] font-bold text-xs hover:bg-[#C8EE38] transition-colors"
              >
                Publish Live Drop
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
