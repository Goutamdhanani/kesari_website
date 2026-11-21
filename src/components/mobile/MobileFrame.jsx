import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Main Navigation
import MainNavbar from '../navigation/MainNavbar';

// Brand New Website Screens
import LandingPage from '../landing/LandingPage';
import ExploreEventsScreen from './ExploreEventsScreen';
import HostEventScreen from '../booking/HostEventScreen';
import AudioRentalScreen from '../audio/AudioRentalScreen';
import ArtistDirectoryScreen from '../artists/ArtistDirectoryScreen';
import ArtistRegisterScreen from '../artists/ArtistRegisterScreen';
import VenueGalleryScreen from '../gallery/VenueGalleryScreen';
import EventGalleryScreen from '../gallery/EventGalleryScreen';
import BookUsScreen from '../booking/BookUsScreen';
import BulkFoodOrderScreen from '../food/BulkFoodOrderScreen';
import MenuScreen from '../menu/MenuScreen';
import ContactUsScreen from '../contact/ContactUsScreen';

// Preserved Existing App Screens
import HomeScreen from './HomeScreen';
import OnboardingScreen from './OnboardingScreen';
import TicketScreen from './TicketScreen';
import EventDetailScreen from './EventDetailScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';
import NotificationsSheet from './NotificationsSheet';
import CitySelectorSheet from './CitySelectorSheet';
import QRModal from './QRModal';
import EventAdminModal from '../admin/EventAdminModal';
import { FloatingBottomNav } from '../common/ControlWidgets';
import { MOCK_EVENTS, INITIAL_TICKETS } from '../../data/mockEvents';
import usePageSEO from '../../hooks/usePageSEO';
import './MobileFrame.css';

const screenVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.16, ease: [0.19, 1, 0.22, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
};

/**
 * Route Resolver: Normalizes pathname, hash, and query params
 */
export function resolveCurrentRoute() {
  if (typeof window === 'undefined') {
    return { route: '/', eventId: null, isAdmin: false };
  }

  const hash = window.location.hash.replace(/^#/, '');
  const search = window.location.search;
  const pathname = window.location.pathname || '/';

  // Check admin trigger
  const isAdmin = 
    window.location.hash === '#admin' || 
    window.location.hash === '#/admin' || 
    pathname === '/admin' || 
    search.includes('admin=true');

  // Determine path: hash takes priority if starting with '/'
  let path = '/';
  if (hash.startsWith('/')) {
    path = hash;
  } else if (pathname && pathname !== '/') {
    path = pathname;
  }

  // Normalize: remove trailing slash
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  // Route mapping
  if (path === '/' || path === '/home') return { route: '/', eventId: null, isAdmin };
  if (path === '/events' || path === '/explore') return { route: '/events', eventId: null, isAdmin };
  if (path.startsWith('/events/')) {
    const id = path.slice('/events/'.length);
    return { route: '/events/:id', eventId: id, isAdmin };
  }
  if (path === '/host-event') return { route: '/host-event', eventId: null, isAdmin };
  if (path === '/audio-rental' || path === '/rental') return { route: '/audio-rental', eventId: null, isAdmin };
  if (path === '/artists/register') return { route: '/artists/register', eventId: null, isAdmin };
  if (path === '/artists') return { route: '/artists', eventId: null, isAdmin };
  if (path === '/venue-gallery') return { route: '/venue-gallery', eventId: null, isAdmin };
  if (path === '/event-gallery') return { route: '/event-gallery', eventId: null, isAdmin };
  if (path === '/book' || path === '/booking') return { route: '/book', eventId: null, isAdmin };
  if (path === '/order-food' || path === '/bulk-food') return { route: '/order-food', eventId: null, isAdmin };
  if (path === '/menu') return { route: '/menu', eventId: null, isAdmin };
  if (path === '/contact') return { route: '/contact', eventId: null, isAdmin };
  if (path === '/ticket' || path === '/tickets') return { route: '/ticket', eventId: null, isAdmin };
  if (path === '/search') return { route: '/search', eventId: null, isAdmin };
  if (path === '/profile') return { route: '/profile', eventId: null, isAdmin };
  if (path === '/onboarding') return { route: '/onboarding', eventId: null, isAdmin };
  if (path === '/admin') return { route: '/', eventId: null, isAdmin: true };

  return { route: '/', eventId: null, isAdmin };
}

export default function MobileFrame({ 
  initialScreen = null,
  initialEventId = 'amour',
  onEventSelected = () => {}
}) {
  // Resolve initial route from URL
  const initialResolved = resolveCurrentRoute();
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (initialScreen && initialScreen !== 'home') return `/${initialScreen}`;
    return initialResolved.route;
  });

  // Dynamic SEO & Structured Data updater per route
  usePageSEO(currentRoute);

  const [selectedEventId, setSelectedEventId] = useState(() => {
    return initialResolved.eventId || initialEventId;
  });

  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeQRTicket, setActiveQRTicket] = useState(null);

  // Sheets & Modals
  const [showAdminModal, setShowAdminModal] = useState(initialResolved.isAdmin);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  // Global Events Catalog with LocalStorage persistence
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('kesari_events_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasAmour = parsed.some(e => e.id === 'amour');
          if (hasAmour) {
            return parsed.map(e => e.id === 'amour' ? { ...e, featured: true } : e);
          }
          return [MOCK_EVENTS[0], ...parsed];
        }
      }
    } catch {}
    return MOCK_EVENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kesari_events_catalog', JSON.stringify(events));
    } catch {}
  }, [events]);

  // Unified Navigation Handler (Synchronizes URL, History, popstate & State)
  const handleNavigate = useCallback((targetPath) => {
    if (!targetPath) return;

    // Handle Admin Route
    if (targetPath === '/admin' || targetPath === '#admin' || targetPath === '?admin=true') {
      setShowAdminModal(true);
      return;
    }

    let cleanTarget = targetPath;
    if (cleanTarget.startsWith('#/')) {
      cleanTarget = cleanTarget.slice(1);
    } else if (cleanTarget.startsWith('#')) {
      cleanTarget = '/' + cleanTarget.slice(1);
    } else if (!cleanTarget.startsWith('/')) {
      cleanTarget = '/' + cleanTarget;
    }

    // Event detail route
    if (cleanTarget.startsWith('/events/') && cleanTarget !== '/events') {
      const id = cleanTarget.slice('/events/'.length);
      setSelectedEventId(id);
      setCurrentRoute('/events/:id');
    } else {
      setCurrentRoute(cleanTarget);
    }

    // Update Browser URL seamlessly
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== cleanTarget) {
        window.history.pushState({}, '', cleanTarget);
      }
    }

    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  // Listen to popstate and hashchange events for Browser Back/Forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const resolved = resolveCurrentRoute();
      setCurrentRoute(resolved.route);
      if (resolved.eventId) setSelectedEventId(resolved.eventId);
      if (resolved.isAdmin) setShowAdminModal(true);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Event Catalog CRUD Handlers
  const handleAddEvent = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    showToast(`Published "${newEvent.title}"! 🎉`);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    showToast(`Updated "${updatedEvent.title}"! 🚀`);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Event removed from catalog 🗑️');
  };

  // In-app Notification list
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      icon: '🎟️',
      title: 'Pass Ready for Gate Check-in',
      message: 'Your Jazz & Blues Studio pass is verified for Kesari - The Memory Studio, Bangalore.',
      time: '12m ago'
    },
    {
      id: 'n2',
      icon: '⚡',
      title: 'Rock Legends Selling Fast',
      message: 'Over 92% of passes claimed for the October 20 concert.',
      time: '1h ago'
    },
    {
      id: 'n3',
      icon: '🎷',
      title: 'Miles Quartet Added',
      message: 'Acoustic Lounge lineup updated with special studio session.',
      time: 'Yesterday'
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  // In-app Toast Feedback Banner
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    handleNavigate(`/events/${id}`);
    onEventSelected(id);
  };

  const handleBookSuccess = (newTicket) => {
    if (newTicket) {
      setTickets(prev => [newTicket, ...prev]);
      setActiveQRTicket(newTicket);
      showToast(`Pass confirmed for ${newTicket.eventTitle}! 🎟️`);
    }
    handleNavigate('/ticket');
  };

  const handleOpenQR = (ticket) => {
    setActiveQRTicket(ticket || tickets[0]);
    setShowQRModal(true);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    showToast('All notifications cleared 🧹');
  };

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setUnreadCount(0);
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    showToast(`Location set to ${city} 📍`);
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') handleNavigate('/');
    else if (tab === 'search') handleNavigate('/search');
    else if (tab === 'calendar' || tab === 'explore') handleNavigate('/events');
    else if (tab === 'ticket') handleNavigate('/ticket');
    else if (tab === 'profile') handleNavigate('/profile');
  };

  return (
    <div className="eventjam-web-app-viewport">
      {/* Central Application Stage (Full-width responsive container) */}
      <main className="eventjam-app-stage" role="main" aria-label="Kesari The Memory Studio">

        {/* Global Responsive Main Navigation Bar (Mounted at the top of the app) */}
        <MainNavbar 
          currentPath={currentRoute === '/events/:id' ? '/events' : currentRoute}
          onNavigate={handleNavigate}
        />

        {/* In-App Feedback Micro Toast Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              className="in-app-toast-pill"
              initial={{ opacity: 0, y: -20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.92 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen Viewport Container */}
        <div className="eventjam-screen-viewport">
          <AnimatePresence mode="wait">

            {/* 1. Brand New Landing Page ('/') */}
            {currentRoute === '/' && (
              <motion.div
                key="landing"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <LandingPage onNavigate={handleNavigate} />
              </motion.div>
            )}

            {/* 2. Upcoming Events Catalog ('/events') */}
            {currentRoute === '/events' && (
              <motion.div
                key="events"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <ExploreEventsScreen 
                  events={events}
                  selectedCity={selectedCity}
                  onSelectEvent={handleSelectEvent}
                  onBack={() => handleNavigate('/')}
                  onTabChange={handleTabChange}
                  onOpenCitySelector={() => setShowCitySelector(true)}
                  onOpenProfile={() => handleNavigate('/profile')}
                  onOpenNotifications={handleOpenNotifications}
                  unreadCount={unreadCount}
                />
              </motion.div>
            )}

            {/* 3. Event Detail & Booking Screen ('/events/:id' or 'details') */}
            {currentRoute === '/events/:id' && (
              <motion.div
                key={`details-${selectedEventId}`}
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <EventDetailScreen 
                  eventId={selectedEventId}
                  events={events}
                  onBack={() => handleNavigate('/events')}
                  onBookSuccess={handleBookSuccess}
                />
              </motion.div>
            )}

            {/* 4. Host an Event Informational Screen ('/host-event') */}
            {currentRoute === '/host-event' && (
              <motion.div
                key="host-event"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <HostEventScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 5. Professional Audio Rental Screen ('/audio-rental') */}
            {currentRoute === '/audio-rental' && (
              <motion.div
                key="audio-rental"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <AudioRentalScreen 
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 6. Book an Artist Directory ('/artists') */}
            {currentRoute === '/artists' && (
              <motion.div
                key="artists-directory"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <ArtistDirectoryScreen 
                  onNavigate={handleNavigate}
                />
              </motion.div>
            )}

            {/* 7. Artist Registration Form ('/artists/register') */}
            {currentRoute === '/artists/register' && (
              <motion.div
                key="artists-register"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <ArtistRegisterScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/artists')}
                />
              </motion.div>
            )}

            {/* 8. Venue Gallery Screen ('/venue-gallery') */}
            {currentRoute === '/venue-gallery' && (
              <motion.div
                key="venue-gallery"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <VenueGalleryScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 9. Event Gallery Screen ('/event-gallery') */}
            {currentRoute === '/event-gallery' && (
              <motion.div
                key="event-gallery"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <EventGalleryScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 10. Book Us Hall Showcase & Form ('/book') */}
            {currentRoute === '/book' && (
              <motion.div
                key="book-us"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <BookUsScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 11. Bulk Food Catering Order ('/order-food') */}
            {currentRoute === '/order-food' && (
              <motion.div
                key="order-food"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <BulkFoodOrderScreen 
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 12. Permanent QR Menu System ('/menu' - PERMANENT P0 ROUTE) */}
            {currentRoute === '/menu' && (
              <motion.div
                key="menu-screen"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <MenuScreen 
                  onNavigateToBulk={() => handleNavigate('/order-food')}
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 13. Contact Us Screen ('/contact') */}
            {currentRoute === '/contact' && (
              <motion.div
                key="contact-us"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <ContactUsScreen 
                  onNavigate={handleNavigate}
                  onBack={() => handleNavigate('/')}
                />
              </motion.div>
            )}

            {/* 14. Passes & Tickets Screen ('/ticket') */}
            {currentRoute === '/ticket' && (
              <motion.div
                key="ticket"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <TicketScreen 
                  tickets={tickets}
                  onBack={() => handleNavigate('/')} 
                  onOpenQR={handleOpenQR}
                  onShowToast={showToast}
                />
              </motion.div>
            )}

            {/* 15. Search Screen ('/search') */}
            {currentRoute === '/search' && (
              <motion.div
                key="search"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <SearchScreen 
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  onBack={() => handleNavigate('/')}
                  onTabChange={handleTabChange}
                />
              </motion.div>
            )}

            {/* 16. Profile & Wallet Screen ('/profile') */}
            {currentRoute === '/profile' && (
              <motion.div
                key="profile"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <ProfileScreen 
                  tickets={tickets}
                  onBack={() => handleNavigate('/')}
                  onOpenTickets={() => handleNavigate('/ticket')}
                  onSelectEvent={handleSelectEvent}
                  onOpenAdmin={() => setShowAdminModal(true)}
                />
              </motion.div>
            )}

            {/* 17. Onboarding Screen ('/onboarding') */}
            {currentRoute === '/onboarding' && (
              <motion.div
                key="onboarding"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <OnboardingScreen onFinish={() => handleNavigate('/')} />
              </motion.div>
            )}

          </AnimatePresence>

          {/* Persistent Floating Bottom Nav (For Mobile Quick Jumps on App Tabs) */}
          {['/search', '/ticket', '/profile'].includes(currentRoute) && (
            <div className="mobile-fixed-bottom-nav-root">
              <FloatingBottomNav 
                activeTab={
                  currentRoute === '/search' ? 'search' :
                  currentRoute === '/ticket' ? 'ticket' :
                  currentRoute === '/profile' ? 'profile' : 'home'
                }
                onTabChange={handleTabChange}
              />
            </div>
          )}

          {/* Studio CMS & Operations Admin Modal (6 Tabs) */}
          <EventAdminModal 
            isOpen={showAdminModal}
            onClose={() => {
              setShowAdminModal(false);
              if (typeof window !== 'undefined' && (window.location.hash === '#admin' || window.location.hash === '#/admin')) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }}
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onSelectEvent={handleSelectEvent}
          />

          {/* Gate Check-in QR Modal */}
          <QRModal 
            isOpen={showQRModal} 
            onClose={() => setShowQRModal(false)}
            ticket={activeQRTicket || tickets[0]}
          />

          {/* Notifications Drawer Sheet */}
          <NotificationsSheet 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onClearAll={handleClearNotifications}
            onSelectNotification={(item) => {
              if (item.title.includes('Pass Ready')) handleNavigate('/ticket');
              else if (item.title.includes('Rock Legends')) handleSelectEvent('rock');
              else if (item.title.includes('Miles Quartet')) handleSelectEvent('jazz');
            }}
          />

          {/* City Selector Sheet */}
          <CitySelectorSheet 
            isOpen={showCitySelector}
            onClose={() => setShowCitySelector(false)}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
          />
        </div>
      </main>
    </div>
  );
}
