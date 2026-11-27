import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Bell, X } from 'lucide-react';
import {
  CreateEventInput,
  DateBucket,
  EventCategory,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PASSES,
  LineupType,
  ServiceKind,
  ServiceOption,
  StudioBooking,
  StudioEvent,
  StudioNotification,
  TicketPass,
  TicketTier,
  computeStudioMetrics,
  createServiceBooking,
  createStudioEvent,
  filterEvents,
  incrementEventCheckInOrSold,
  purchaseTickets,
  toggleEventLiveStatus,
  togglePassCheckIn,
  toggleSavedId,
} from './utils/studioLogic';
import { CategoryOrbs } from './components/CategoryOrbs';
import { HeroCarousel } from './components/HeroCarousel';
import { BentoMetricsRow } from './components/BentoMetricsRow';
import { StudioLineupBar } from './components/StudioLineupBar';
import { PassesAndShowsRow } from './components/PassesAndShowsRow';
import { StudioServicesSection } from './components/StudioServicesSection';
import { GallerySection } from './components/GallerySection';
import { EventGallerySection } from './components/EventGallerySection';
import { VenueAccommodationsSection } from './components/VenueAccommodationsSection';
import { FoodSection } from './components/FoodSection';
import { MenuItem } from './data/cafeMenu';
import { ContactSection } from './components/ContactSection';
import { MinimalMenuBar } from './components/MinimalMenuBar';
import { StudioPagesView, MainSectionKey } from './components/StudioPagesView';
import { updatePageSeo } from './utils/seo';
import {
  initSmoothScroll,
  refreshScrollAnimations,
  resetScrollPosition,
  setSmoothScrollPaused,
} from './utils/smoothScroll';
import { TicketCalibrationModal } from './components/TicketCalibrationModal';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { OrganiseEventModal } from './components/OrganiseEventModal';
import { PassesWalletView } from './components/PassesWalletView';
import { ScheduleView } from './components/ScheduleView';
import { SearchEventsView } from './components/SearchEventsView';
import { ArtistsPage, StudioArtist } from './components/ArtistsPage';
import { CheckInPage } from './components/CheckInPage';
import { LiquidPrismNav, NavTab } from './components/LiquidPrismNav';
import {
  HomeSkeleton,
  PassesSkeleton,
  ScheduleSkeleton,
  SearchSkeleton,
} from './components/SkeletonScreen';

const EVENTS_STORAGE_KEY = 'district_studio_events_v1';
const PASSES_STORAGE_KEY = 'district_studio_passes_v1';
const BOOKINGS_STORAGE_KEY = 'district_studio_bookings_v1';
const SAVED_STORAGE_KEY = 'district_studio_saved_v1';
const PREFS_STORAGE_KEY = 'district_studio_prefs_v1';

function loadStoredArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function loadStoredPrefs(): { gateReminders: boolean; dropAlerts: boolean } {
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return { gateReminders: true, dropAlerts: true };
    const parsed = JSON.parse(raw) as Partial<{
      gateReminders: boolean;
      dropAlerts: boolean;
    }>;
    return {
      gateReminders: parsed.gateReminders ?? true,
      dropAlerts: parsed.dropAlerts ?? true,
    };
  } catch {
    return { gateReminders: true, dropAlerts: true };
  }
}

function parsePathToNav(pathname: string): { tab: NavTab; subPage?: string } {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean || clean === 'explore' || clean === 'home') return { tab: 'explore' };
  if (clean === 'search') return { tab: 'search' };
  if (clean === 'schedule') return { tab: 'schedule' };
  if (clean === 'passes') return { tab: 'passes' };
  if (clean === 'menu' || clean === 'cafe' || clean === 'qr' || clean === 'qr/cafe') {
    return { tab: 'menu' };
  }
  if (clean === 'qr/events') return { tab: 'schedule' };
  if (clean === 'qr/artists') return { tab: 'artists' };
  if (clean === 'checkin' || clean === 'check-in' || clean === 'qr/checkin') {
    return { tab: 'checkin' };
  }
  if (clean === 'artists' || clean.startsWith('artists/')) {
    const parts = clean.split('/');
    return { tab: 'artists', subPage: parts[1] };
  }

  const parts = clean.split('/');
  if (parts[0] === 'about') {
    return { tab: 'about', subPage: parts[1] || 'our-story' };
  }
  if (parts[0] === 'connect') {
    return { tab: 'connect', subPage: parts[1] || 'contact-us' };
  }
  if (parts[0] === 'help') {
    return { tab: 'help', subPage: parts[1] || 'faq' };
  }

  return { tab: 'explore' };
}

const LEGACY_EVENT_IMAGE_MAP: Record<string, string> = {
  '/assets/events/book_us_01_live_music.jpg': '/assets/events/ev_sukoon.jpg',
  '/assets/events/book_us_02_spoken_word.jpg': '/assets/events/ev_openmic.jpg',
  '/assets/book-us/book_us_03_concerts.jpg': '/assets/events/ev_rock.jpg',
  '/assets/book-us/book_us_05_comedy.jpg': '/assets/events/ev_comedy_kesari.jpg',
  '/assets/book-us/book_us_06_dance.jpg': '/assets/events/ev_dance_kesari.jpg',
};

function sanitizeEvents(list: StudioEvent[]): StudioEvent[] {
  return list.map((evt) => {
    const mapped = LEGACY_EVENT_IMAGE_MAP[evt.imageUrl];
    if (mapped) return { ...evt, imageUrl: mapped };
    if (evt.imageUrl && evt.imageUrl.includes('book_us_')) {
      return { ...evt, imageUrl: '/assets/events/kesari_stage_inside.jpg' };
    }
    return evt;
  });
}

export default function App() {
  const [initialNav] = useState(() =>
    parsePathToNav(typeof window !== 'undefined' ? window.location.pathname : '')
  );
  const [events, setEvents] = useState<StudioEvent[]>(() =>
    sanitizeEvents(loadStoredArray(EVENTS_STORAGE_KEY, []))
  );
  const [artists, setArtists] = useState<StudioArtist[]>(() =>
    loadStoredArray('kesari_artists_v1', [])
  );
  const [artistsLoading, setArtistsLoading] = useState<boolean>(true);
  const [artistInitialMode, setArtistInitialMode] = useState<'directory' | 'register'>(
    initialNav.subPage === 'register' ? 'register' : 'directory'
  );
  const [passes, setPasses] = useState<TicketPass[]>(() =>
    loadStoredArray(PASSES_STORAGE_KEY, [])
  );
  const [bookings, setBookings] = useState<StudioBooking[]>(() =>
    loadStoredArray(BOOKINGS_STORAGE_KEY, [])
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadStoredArray(SAVED_STORAGE_KEY, [])
  );
  const [prefs, setPrefs] = useState<{ gateReminders: boolean; dropAlerts: boolean }>(
    () => loadStoredPrefs()
  );
  const [notifications, setNotifications] = useState<StudioNotification[]>([]);
  const [cafeMenu, setCafeMenu] = useState<MenuItem[] | undefined>(undefined);

  useEffect(() => {
    // Sync with backend API if running
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.events)) {
          setEvents(sanitizeEvents(data.events));
        }
        if (Array.isArray(data?.cafeMenu) && data.cafeMenu.length > 0) {
          setCafeMenu(data.cafeMenu);
        } else if (data?.settings?.cafeMenu && Array.isArray(data.settings.cafeMenu) && data.settings.cafeMenu.length > 0) {
          setCafeMenu(data.settings.cafeMenu);
        }
      })
      .catch(() => {});
  }, []);

  const [activeTab, setActiveTab] = useState<NavTab>(initialNav.tab);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedLineup, setSelectedLineup] = useState<LineupType>('all');
  const [selectedDateBucket, setSelectedDateBucket] = useState<DateBucket>('all');
  const [liveOnlyFilter, setLiveOnlyFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkoutEventId, setCheckoutEventId] = useState<string | null>(null);
  const [activeServiceKind, setActiveServiceKind] = useState<ServiceKind | null>(null);
  const [organiseOpen, setOrganiseOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStudioMenu, setShowStudioMenu] = useState(false);
  const [activeStudioSubPage, setActiveStudioSubPage] = useState<string>(
    initialNav.subPage || 'our-story'
  );

  // Ultra-smooth Lenis + GSAP ScrollTrigger lifecycle
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  useEffect(() => {
    const hasOverlayOpen = Boolean(
      checkoutEventId || activeServiceKind || organiseOpen || showStudioMenu || showNotifications
    );
    setSmoothScrollPaused(hasOverlayOpen);
  }, [checkoutEventId, activeServiceKind, organiseOpen, showStudioMenu, showNotifications]);

  useEffect(() => {
    if (isInitialLoading || isTabLoading) return;
    resetScrollPosition();
    const timer = window.setTimeout(() => {
      refreshScrollAnimations();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [activeTab, isInitialLoading, isTabLoading]);

  // Sync browser URL & Dynamic SEO on tab/subpage changes
  useEffect(() => {
    let url = '/';
    if (activeTab === 'about' || activeTab === 'connect' || activeTab === 'help') {
      url = `/${activeTab}/${activeStudioSubPage}`;
    } else if (activeTab === 'menu') {
      url = '/cafe';
    } else if (activeTab !== 'explore') {
      url = `/${activeTab}`;
    }

    if (typeof window !== 'undefined' && window.location.pathname !== url) {
      const search = activeTab === 'menu' ? window.location.search : '';
      window.history.pushState(null, '', `${url}${search}`);
    }
    updatePageSeo({
      section: activeTab,
      subPage:
        activeTab === 'about' || activeTab === 'connect' || activeTab === 'help'
          ? activeStudioSubPage
          : undefined,
    });
  }, [activeTab, activeStudioSubPage]);

  // Support Browser Native Back & Forward Buttons (and mobile swipe back)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathToNav(window.location.pathname);
      setActiveTab(parsed.tab);
      if (parsed.subPage) {
        setActiveStudioSubPage(parsed.subPage);
      }
      updatePageSeo({ section: parsed.tab, subPage: parsed.subPage });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateStudio = (section: MainSectionKey, subPage: string) => {
    setActiveStudioSubPage(subPage);
    handleSelectTab(section as NavTab);
  };

  // Fetch live artists from /api/artists on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/artists')
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data?.ok && Array.isArray(data.artists)) {
          setArtists(data.artists);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setArtistsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('kesari_artists_v1', JSON.stringify(artists));
    } catch {}
  }, [artists]);

  // Smooth initial hydration load (shows skeleton shimmer briefly on mount)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Silky smooth tab switching with skeleton transition
  const handleSelectTab = (newTab: NavTab) => {
    if (newTab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 220);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Ignore storage quota issues
    }
  }, [events]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(passes));
    } catch {
      // Ignore storage quota issues
    }
  }, [passes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage quota issues
    }
  }, [bookings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota issues
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage quota issues
    }
  }, [prefs]);

  const metrics = useMemo(
    () => computeStudioMetrics(events, passes),
    [events, passes]
  );

  const exploreEvents = useMemo(() => {
    const filtered = filterEvents(events, selectedCategory, '', selectedLineup);
    return liveOnlyFilter ? filtered.filter((e) => e.isLive) : filtered;
  }, [events, selectedCategory, selectedLineup, liveOnlyFilter]);

  const searchResults = useMemo(
    () => filterEvents(events, selectedCategory, searchQuery, selectedLineup),
    [events, selectedCategory, searchQuery, selectedLineup]
  );

  const activeCheckoutEvent = useMemo(
    () => events.find((e) => e.id === checkoutEventId) ?? null,
    [events, checkoutEventId]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleSave = (eventId: string) => {
    setSavedIds((prev) => toggleSavedId(prev, eventId));
  };

  const handleConfirmPurchase = (params: {
    eventId: string;
    tier: TicketTier | string;
    quantity: number;
    utr?: string;
    status?: 'confirmed' | 'pending_review';
  }): { ok: true; mintedPass: TicketPass } | { ok: false; error: string } => {
    const res = purchaseTickets(events, passes, params);
    if (res.ok === false) {
      return { ok: false, error: res.error };
    }
    setEvents(res.events);
    setPasses(res.passes);
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: res.mintedPass.eventId,
        eventTitle: res.mintedPass.eventTitle,
        tier: res.mintedPass.tier,
        quantity: res.mintedPass.quantity,
        totalAmount: res.mintedPass.totalPaid,
        utr: params.utr,
        status: params.status || 'confirmed',
      }),
    }).catch(() => {});
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title:
          params.status === 'pending_review'
            ? 'Order Submitted for UTR Review'
            : `Pass ${res.mintedPass.passCode} Minted`,
        detail: `${res.mintedPass.quantity}× ${res.mintedPass.tier} for ${res.mintedPass.eventTitle}`,
        timeLabel: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    return { ok: true, mintedPass: res.mintedPass };
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleReviewOrder = (passId: string, status: 'confirmed' | 'rejected') => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status,
              checkedIn: status === 'confirmed' ? p.checkedIn : false,
            }
          : p
      )
    );
    fetch(`/api/admin/orders/${passId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const handleConfirmServiceBooking = (params: {
    option: ServiceOption;
    duration: number;
    scheduleNote: string;
  }): { ok: true; created: StudioBooking } | { ok: false; error: string } => {
    const res = createServiceBooking(bookings, params);
    if (res.ok === false) {
      return { ok: false, error: res.error };
    }
    setBookings(res.bookings);
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res.created),
    }).catch(() => {});
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Studio ${res.created.bookingCode} Confirmed`,
        detail: `${res.created.title} · ${res.created.detail}`,
        timeLabel: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    return { ok: true, created: res.created };
  };

  const handleSubmitOrganiseInquiry = (params: {
    format: string;
    capacityRange: string;
    venueRoom: string;
    dateAndConcept: string;
  }): StudioBooking => {
    const created: StudioBooking = {
      id: `org-${Date.now()}`,
      kind: 'space',
      title: `${params.format} · ${params.venueRoom}`,
      detail: `${params.dateAndConcept} (${params.capacityRange} guests)`,
      hoursOrMonths: 4,
      totalPaid: 3200,
      bookingCode: `ORG-${1000 + ((bookings.length * 1493 + params.format.length * 97) % 8999)}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [created, ...prev]);
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'organise_event',
        title: created.title,
        detail: created.detail,
        bookingCode: created.bookingCode,
      }),
    }).catch(() => {});
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Event Inquiry ${created.bookingCode}`,
        detail: `${created.title} · ${created.detail}`,
        timeLabel: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    return created;
  };

  const handleTogglePassCheckIn = (passId: string) => {
    setPasses((prev) => togglePassCheckIn(prev, passId));
  };

  const handleToggleEventLive = (eventId: string) => {
    setEvents((prev) => toggleEventLiveStatus(prev, eventId));
  };

  const handleDoorSale = (eventId: string) => {
    setEvents((prev) => incrementEventCheckInOrSold(prev, eventId, 1));
  };

  const handleCreateEvent = (
    input: CreateEventInput
  ): { ok: true; created: StudioEvent } | { ok: false; error: string } => {
    const res = createStudioEvent(events, input);
    if (res.ok === false) {
      return { ok: false, error: res.error };
    }
    setEvents(res.events);
    return { ok: true, created: res.created };
  };

  const pageTitles: Record<NavTab, string> = {
    explore: 'Kesari Studio',
    search: 'Search Drops',
    schedule: 'Live Schedule',
    passes: 'Pass Wallet',
    artists: 'Artists Roster',
    menu: 'Café Menu & Order',
    checkin: 'Guest Check-In',
    about: 'About Kesari',
    connect: 'Connect With Us',
    help: 'Help & Information',
  };

  return (
    <div className="min-h-screen obsidian-dot-canvas text-[#F4F5F8] pb-28 w-full max-w-[100vw] overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 w-full min-w-0">
        {/* Top Bar: Greeting / Brand + 5-Link Desktop Nav + Bell & Profile Avatar Halo */}
        <header className="relative flex items-center justify-between gap-3 mb-4 sm:mb-7 w-full min-w-0">
          {activeTab === 'explore' ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="sr-only">Kesari – The Memory Studio | Music, Events &amp; Meetups in Koramangala Bengaluru</h1>
                <img
                  src="/assets/kesari-logo-colour-long.png"
                  alt="Kesari - The Memory Studio"
                  className="h-8 sm:h-12 w-auto max-w-[170px] sm:max-w-none object-contain drop-shadow-[0_2px_14px_rgba(249,115,22,0.35)] shrink-0"
                />
              </div>

              <nav
                aria-label="Desktop navigation"
                className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/70"
              >
                <button
                  type="button"
                  onClick={() => handleSelectTab('explore')}
                  className="text-white whitespace-nowrap"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('search')}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('schedule')}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('passes')}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Passes ({passes.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('artists')}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Artists
                </button>
                <a
                  href="/about/our-story"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigateStudio('about', 'our-story');
                  }}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  About
                </a>
                <a
                  href="/connect/contact-us"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigateStudio('connect', 'contact-us');
                  }}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Connect
                </a>
                <a
                  href="/help/faq"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigateStudio('help', 'faq');
                  }}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  Help
                </a>
                <button
                  type="button"
                  onClick={() => setShowStudioMenu((v) => !v)}
                  className="hover:text-white transition-colors whitespace-nowrap text-[#D8FF48] font-semibold"
                >
                  Menu
                </button>
              </nav>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowNotifications((v) => !v)}
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
                  className="relative w-11 h-11 rounded-full bg-[#131318] hover:bg-[#1B1C24] border border-white/10 flex items-center justify-center text-white transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E052A6]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowStudioMenu(true)}
                  aria-label="Open studio menu"
                  title="Studio Menu & Profile (AR)"
                  className="w-11 h-11 rounded-full p-[2px] liquid-prism-ring hover:scale-105 transition-transform shrink-0"
                >
                  <span className="w-full h-full rounded-full liquid-prism-inner flex items-center justify-center text-xs font-bold text-white">
                    AR
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTab('explore');
                }}
                aria-label="Back to Home"
                className="w-11 h-11 rounded-full bg-[#131318] hover:bg-[#1B1C24] border border-white/10 flex items-center justify-center text-white transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </a>

              <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
                {pageTitles[activeTab]}
              </h1>

              <button
                type="button"
                onClick={() => setShowStudioMenu(true)}
                aria-label="Open studio menu"
                title="Studio Menu & Profile (AR)"
                className="w-11 h-11 rounded-full p-[2px] liquid-prism-ring hover:scale-105 transition-transform shrink-0"
              >
                <span className="w-full h-full rounded-full liquid-prism-inner flex items-center justify-center text-xs font-bold text-white">
                  AR
                </span>
              </button>
            </>
          )}

          {/* Interactive Notifications Popover */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="surface-charcoal absolute right-0 top-14 z-40 w-[300px] sm:w-[340px] rounded-[26px] p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white">Updates</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          )
                        }
                        className="text-[11px] font-medium text-[#D8FF48] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-2xl p-3 border ${
                        n.read
                          ? 'bg-black/25 border-white/5 opacity-70'
                          : 'bg-white/[0.06] border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-white/45 shrink-0">
                          {n.timeLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-white/65 leading-snug">
                        {n.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {isInitialLoading ? (
              <motion.div
                key="initial-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HomeSkeleton />
              </motion.div>
            ) : isTabLoading ? (
              <motion.div
                key={`tab-skeleton-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {activeTab === 'explore' && <HomeSkeleton />}
                {activeTab === 'search' && <SearchSkeleton />}
                {activeTab === 'schedule' && <ScheduleSkeleton />}
                {activeTab === 'passes' && <PassesSkeleton />}
                {activeTab === 'profile' && <ProfileSkeleton />}
              </motion.div>
            ) : (
              <motion.div
                key={`view-${activeTab}`}
                initial={{ opacity: 0, y: 10, scale: 0.996 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.996 }}
                transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              >
                {activeTab === 'explore' && (
                  <div className="space-y-7 sm:space-y-8">
                    {/* Responsive Hero + Orbs + Bento Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start w-full min-w-0">
                      <div className="lg:col-span-5 space-y-4 sm:space-y-5 w-full min-w-0">
                        <CategoryOrbs
                          selectedCategory={selectedCategory}
                          onSelectCategory={setSelectedCategory}
                          onOpenOrganise={() => setOrganiseOpen(true)}
                          onOpenAccessories={() => handleSelectTab('artists')}
                          onOpenArtist={() => handleSelectTab('artists')}
                          onOpenEvents={() => {
                            setSelectedCategory('all');
                            const el = document.getElementById('studio-lineup-strip');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        />

                        <div className="hidden lg:block">
                          <BentoMetricsRow
                            bookings={bookings}
                            artistsCount={artists.length}
                            onOpenMembership={() => setActiveServiceKind('membership')}
                            onOpenArtistRegister={() => {
                              setArtistInitialMode('register');
                              handleSelectTab('artists');
                            }}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-7 w-full min-w-0">
                    <HeroCarousel
                      events={exploreEvents}
                      savedIds={savedIds}
                      onToggleSave={handleToggleSave}
                      onSelectEvent={(evt) => setCheckoutEventId(evt.id)}
                    />
                  </div>
                </div>

                {/* Mobile Bento Position */}
                <div className="lg:hidden">
                  <BentoMetricsRow
                    bookings={bookings}
                    artistsCount={artists.length}
                    onOpenMembership={() => setActiveServiceKind('membership')}
                    onOpenArtistRegister={() => {
                      setArtistInitialMode('register');
                      handleSelectTab('artists');
                    }}
                  />
                </div>

                {/* Studio Lineup Filter Strip */}
                <div id="studio-lineup-strip">
                  <StudioLineupBar
                    selectedLineup={selectedLineup}
                    onSelectLineup={setSelectedLineup}
                  />
                </div>

                {/* Passes & Shows Horizontal Photo-Gradient Gallery */}
                <PassesAndShowsRow
                  events={exploreEvents}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onSelectEvent={(evt) => setCheckoutEventId(evt.id)}
                  onViewAll={() => handleSelectTab('schedule')}
                  onBookUs={() => setOrganiseOpen(true)}
                />

                {/* Studio Services + Organise Your Event Bento */}
                <div data-reveal className="will-animate">
                  <StudioServicesSection
                    bookingsCount={bookings.length}
                    onOpenService={(kind) => setActiveServiceKind(kind)}
                    onPlanEvent={() => setOrganiseOpen(true)}
                  />
                </div>

                {/* Venue Accommodations & Amenities */}
                <div data-reveal className="will-animate">
                  <VenueAccommodationsSection />
                </div>

                {/* Venue Gallery ("The KESARI Experience") */}
                <div data-reveal className="will-animate">
                  <GallerySection />
                </div>

                {/* Event Gallery ("Memories are made here") */}
                <div data-reveal className="will-animate">
                  <EventGallerySection />
                </div>

                {/* Food & Extras placeholder */}
                <div data-reveal className="will-animate">
                  <FoodSection
                    compact
                    menuItems={cafeMenu}
                    events={events}
                    onViewFullMenu={() => handleSelectTab('menu')}
                  />
                </div>

                {/* Contact Us */}
                <div data-reveal className="will-animate">
                  <ContactSection />
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <SearchEventsView
                query={searchQuery}
                onQueryChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                results={searchResults}
                allEvents={events}
                artists={artists}
                cafeMenu={cafeMenu}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
                onSelectEvent={(evt) => setCheckoutEventId(evt.id)}
                onOpenService={(kind) => setActiveServiceKind(kind)}
                onOpenArtists={() => handleSelectTab('artists')}
                onOpenCafe={() => handleSelectTab('menu')}
              />
            )}

            {activeTab === 'artists' && (
              <ArtistsPage
                artists={artists}
                loading={artistsLoading}
                initialMode={artistInitialMode}
                onArtistAdded={(artist) => setArtists((prev) => [artist, ...prev])}
                onBack={() => handleSelectTab('explore')}
              />
            )}

            {activeTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectTab('explore')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Studio</span>
                  </button>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D8FF48]">
                    Kesari Café · Koramangala
                  </span>
                </div>
                <FoodSection
                  menuItems={cafeMenu}
                  events={events}
                  initialSeatingLocation={
                    typeof window !== 'undefined'
                      ? new URLSearchParams(window.location.search).get('table') || ''
                      : ''
                  }
                />
              </div>
            )}

            {activeTab === 'checkin' && (
              <CheckInPage
                onBack={() => handleSelectTab('explore')}
                onOrderFood={() => handleSelectTab('menu')}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                events={events}
                selectedDateBucket={selectedDateBucket}
                onSelectDateBucket={setSelectedDateBucket}
                selectedLineup={selectedLineup}
                onSelectLineup={setSelectedLineup}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
                onSelectEvent={(evt) => setCheckoutEventId(evt.id)}
              />
            )}

            {activeTab === 'passes' && (
              <PassesWalletView
                passes={passes}
                onToggleCheckIn={handleTogglePassCheckIn}
                onExploreEvents={() => handleSelectTab('explore')}
              />
            )}

            {(activeTab === 'about' || activeTab === 'connect' || activeTab === 'help') && (
              <StudioPagesView
                section={activeTab}
                subPage={activeStudioSubPage}
                onSelectSubPage={setActiveStudioSubPage}
                onSelectSection={(sec) => handleSelectTab(sec as NavTab)}
                onBackToHome={() => handleSelectTab('explore')}
              />
            )}
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-8 pb-6 text-center">
            <p className="text-[11px] tracking-wide text-white/25">
              managed by{' '}
              <a
                href="https://www.oddwebs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/15 underline-offset-4 hover:text-white/60 hover:decoration-white/40 transition-colors"
              >
                www.oddwebs.com
              </a>
            </p>
          </footer>
        </main>
      </div>

      {/* Reference 4 Floating Liquid Glass Prismatic 5-Tab Bottom Nav Dock */}
      <LiquidPrismNav
        activeTab={activeTab}
        passesCount={passes.length}
        onSelectTab={handleSelectTab}
      />

      {/* Reference 1 Right & Ref 2 Ticket Calibration Checkout Modal */}
      {activeCheckoutEvent && (
        <TicketCalibrationModal
          event={activeCheckoutEvent}
          onClose={() => setCheckoutEventId(null)}
          onConfirmPurchase={handleConfirmPurchase}
          onViewPasses={() => {
            setCheckoutEventId(null);
            handleSelectTab('passes');
          }}
        />
      )}

      {/* Studio Services Booking Modal */}
      {activeServiceKind && (
        <ServiceBookingModal
          kind={activeServiceKind}
          onClose={() => setActiveServiceKind(null)}
          onConfirmBooking={handleConfirmServiceBooking}
        />
      )}

      {/* Organise Your Event Modal */}
      {organiseOpen && (
        <OrganiseEventModal
          onClose={() => setOrganiseOpen(false)}
          onSubmitInquiry={handleSubmitOrganiseInquiry}
        />
      )}

      {/* Minimal Studio Menu Bar */}
      <MinimalMenuBar
        isOpen={showStudioMenu}
        onClose={() => setShowStudioMenu(false)}
        onNavigate={handleNavigateStudio}
        onSelectTab={(tab) => handleSelectTab(tab as NavTab)}
      />
    </div>
  );
}
