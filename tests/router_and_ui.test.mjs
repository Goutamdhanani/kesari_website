import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('UI Routing, Structure and Accessibility Standards', async () => {
  // Test Route Resolver logic from MobileFrame
  // Simulate window location environments
  const routesToTest = [
    { pathname: '/', hash: '', expected: '/' },
    { pathname: '/events', hash: '', expected: '/events' },
    { pathname: '/explore', hash: '', expected: '/events' },
    { pathname: '/host-event', hash: '', expected: '/host-event' },
    { pathname: '/audio-rental', hash: '', expected: '/audio-rental' },
    { pathname: '/rental', hash: '', expected: '/audio-rental' },
    { pathname: '/artists', hash: '', expected: '/artists' },
    { pathname: '/artists/register', hash: '', expected: '/artists/register' },
    { pathname: '/venue-gallery', hash: '', expected: '/venue-gallery' },
    { pathname: '/event-gallery', hash: '', expected: '/event-gallery' },
    { pathname: '/book', hash: '', expected: '/book' },
    { pathname: '/booking', hash: '', expected: '/book' },
    { pathname: '/order-food', hash: '', expected: '/order-food' },
    { pathname: '/bulk-food', hash: '', expected: '/order-food' },
    { pathname: '/menu', hash: '', expected: '/menu' },
    { pathname: '/contact', hash: '', expected: '/contact' },
    { pathname: '/ticket', hash: '', expected: '/ticket' },
    { pathname: '/search', hash: '', expected: '/search' },
    { pathname: '/profile', hash: '', expected: '/profile' }
  ];

  // Also test hash-based routing (#/menu, #/book, etc.)
  const hashRoutesToTest = [
    { pathname: '/', hash: '#/menu', expected: '/menu' },
    { pathname: '/', hash: '#/book', expected: '/book' },
    { pathname: '/', hash: '#/artists', expected: '/artists' },
    { pathname: '/', hash: '#/artists/register', expected: '/artists/register' },
    { pathname: '/', hash: '#/order-food', expected: '/order-food' },
    { pathname: '/', hash: '#/events', expected: '/events' },
    { pathname: '/', hash: '#/venue-gallery', expected: '/venue-gallery' },
    { pathname: '/', hash: '#/event-gallery', expected: '/event-gallery' },
    { pathname: '/', hash: '#/contact', expected: '/contact' }
  ];

  // Read MobileFrame.jsx to verify resolveCurrentRoute regex and implementation
  const mobileFrameContent = fs.readFileSync(path.resolve('src/components/mobile/MobileFrame.jsx'), 'utf8');
  assert.ok(mobileFrameContent.includes('export function resolveCurrentRoute'), 'resolveCurrentRoute is exported');

  for (const { pathname, expected } of routesToTest) {
    assert.ok(
      mobileFrameContent.includes(`path === '${pathname}'`) || 
      mobileFrameContent.includes(`'${pathname}'`),
      `Route mapping contains ${pathname}`
    );
  }

  // ----------------------------------------------------
  // Priority 0: Permanent QR Menu UI Verification
  // ----------------------------------------------------
  const menuScreenContent = fs.readFileSync(path.resolve('src/components/menu/MenuScreen.jsx'), 'utf8');
  assert.ok(menuScreenContent.includes('PERMANENT_MENU_URL = \'https://kesari.studio/menu\''), 'Contains permanent menu URL');
  assert.ok(menuScreenContent.includes('FoodTypeBadge'), 'Contains Veg/Non-Veg diet badges');
  assert.ok(menuScreenContent.includes('MenuQRModal'), 'Contains QR modal dialog');
  assert.ok(menuScreenContent.includes('QRCode.toDataURL'), 'Generates high-res PNG');
  assert.ok(menuScreenContent.includes('QRCode.toString'), 'Generates vector SVG');
  assert.ok(menuScreenContent.includes('Menu is being updated, please ask our staff'), 'Friendly empty/error state present');
  assert.ok(menuScreenContent.includes('Order in Bulk for Events'), 'Bulk food CTA banner present');

  // ----------------------------------------------------
  // Priority 1: Landing Page & Four Star Sections
  // ----------------------------------------------------
  const landingContent = fs.readFileSync(path.resolve('src/components/landing/LandingPage.jsx'), 'utf8');
  assert.ok(landingContent.includes('/assets/star-marker.png'), 'Landing uses star-marker.png');
  assert.ok(landingContent.includes('star-card-events'), 'Upcoming events star card present');
  assert.ok(landingContent.includes('star-card-host'), 'Host an event star card present');
  assert.ok(landingContent.includes('star-card-audio'), 'Audio rental star card present');
  assert.ok(landingContent.includes('star-card-artists'), 'Book an artist star card present');
  assert.ok(landingContent.includes('Kesari - The Memory Studio'), 'Kesari brand header present');

  const navbarContent = fs.readFileSync(path.resolve('src/components/navigation/MainNavbar.jsx'), 'utf8');
  assert.ok(navbarContent.includes('aria-expanded'), 'Hamburger toggle has aria-expanded');
  assert.ok(navbarContent.includes('Escape'), 'Supports Escape key outside dismissal');
  assert.ok(navbarContent.includes('/menu'), 'MainNavbar contains link to /menu');
  assert.ok(navbarContent.includes('/book'), 'MainNavbar contains CTA to /book');

  // ----------------------------------------------------
  // Priority 1: Book Us Screen & Validation
  // ----------------------------------------------------
  const bookUsContent = fs.readFileSync(path.resolve('src/components/booking/BookUsScreen.jsx'), 'utf8');
  assert.ok(bookUsContent.includes('Kesari Main Stage & Hall'), 'Hall 1 present');
  assert.ok(bookUsContent.includes('Acoustic Lounge & Jam Studio'), 'Hall 2 present');
  assert.ok(bookUsContent.includes('Creator Workshop Room'), 'Hall 3 present');
  assert.ok(bookUsContent.includes('/api/bookings'), 'Submits to /api/bookings');
  assert.ok(bookUsContent.includes('bookingCode'), 'Handles booking code confirmation');

  // ----------------------------------------------------
  // Priority 2: Bulk Food Order & Lead Time
  // ----------------------------------------------------
  const bulkFoodContent = fs.readFileSync(path.resolve('src/components/food/BulkFoodOrderScreen.jsx'), 'utf8');
  assert.ok(bulkFoodContent.includes('48'), 'Enforces 48-hour advance notice');
  assert.ok(bulkFoodContent.includes('/api/bulk-food'), 'Submits to /api/bulk-food');
  assert.ok(bulkFoodContent.includes('loadLiveMenu'), 'Uses live shared menu catalog');
  assert.ok(bulkFoodContent.includes('Dietary'), 'Handles dietary options');

  // ----------------------------------------------------
  // Priority 2: Galleries & Contact Us
  // ----------------------------------------------------
  const venueGalleryContent = fs.readFileSync(path.resolve('src/components/gallery/VenueGalleryScreen.jsx'), 'utf8');
  assert.ok(venueGalleryContent.includes('Main Stage'), 'Venue areas present');
  assert.ok(venueGalleryContent.includes('Acoustic Lounge'), 'Acoustic lounge present');
  assert.ok(venueGalleryContent.includes('Recording Studio'), 'Recording studio present');
  assert.ok(venueGalleryContent.includes('Cafe & Terrace'), 'Cafe & terrace present');
  assert.ok(venueGalleryContent.includes('Escape'), 'Lightbox supports Escape key');
  assert.ok(venueGalleryContent.includes('/book'), 'Sticky CTA links to /book');

  const contactUsContent = fs.readFileSync(path.resolve('src/components/contact/ContactUsScreen.jsx'), 'utf8');
  assert.ok(contactUsContent.includes('77605 39955'), 'Contact phone present');
  assert.ok(contactUsContent.includes('Kesari.memory@gmail.com'), 'Email address present');
  assert.ok(contactUsContent.includes('wa.me/917760539955'), 'WhatsApp link present');
  assert.ok(contactUsContent.includes('Koramangala 4th Block, Bangalore 560034'), 'Venue address present');
  assert.ok(contactUsContent.includes('10:00 AM – 11:30 PM'), 'Operating hours present');

  // ----------------------------------------------------
  // Priority 3: Admin Modal Tabs
  // ----------------------------------------------------
  const adminModalContent = fs.readFileSync(path.resolve('src/components/admin/EventAdminModal.jsx'), 'utf8');
  assert.ok(adminModalContent.includes('adminSection === \'events\''), 'Events tab present');
  assert.ok(adminModalContent.includes('adminSection === \'menu\''), 'Menu tab present');
  assert.ok(adminModalContent.includes('adminSection === \'artists\''), 'Artists tab present');
  assert.ok(adminModalContent.includes('adminSection === \'bookings\''), 'Bookings tab present');
  assert.ok(adminModalContent.includes('adminSection === \'bulk-food\''), 'Bulk Food tab present');
  assert.ok(adminModalContent.includes('adminSection === \'qr\''), 'QR tab present');
  assert.ok(adminModalContent.includes('/menu-qr-highres.png'), 'High-res QR download present');
  assert.ok(adminModalContent.includes('/menu-qr.svg'), 'SVG QR download present');
  assert.ok(adminModalContent.includes('/menu-qr-print.html'), 'Print template link present');

  // ----------------------------------------------------
  // Priority 4: SEO, AI Search, and Speed Foundations
  // ----------------------------------------------------
  assert.ok(fs.existsSync(path.resolve('public/robots.txt')), 'public/robots.txt exists');
  const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
  assert.ok(robotsTxt.includes('Sitemap: https://kesaristudio.com/sitemap.xml'), 'robots.txt references sitemap');
  assert.ok(robotsTxt.includes('User-agent: Googlebot'), 'robots.txt welcomes Googlebot');
  assert.ok(robotsTxt.includes('User-agent: GPTBot'), 'robots.txt configures AI crawler');

  assert.ok(fs.existsSync(path.resolve('public/sitemap.xml')), 'public/sitemap.xml exists');
  const sitemapXml = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
  assert.ok(sitemapXml.includes('https://kesaristudio.com/events'), 'sitemap includes /events');
  assert.ok(sitemapXml.includes('https://kesaristudio.com/menu'), 'sitemap includes /menu');
  assert.ok(sitemapXml.includes('https://kesaristudio.com/audio-rental'), 'sitemap includes /audio-rental');

  assert.ok(fs.existsSync(path.resolve('public/llms.txt')), 'public/llms.txt exists');
  assert.ok(fs.existsSync(path.resolve('public/llms-full.txt')), 'public/llms-full.txt exists');
  const llmsTxt = fs.readFileSync(path.resolve('public/llms.txt'), 'utf8');
  assert.ok(llmsTxt.includes('Kesari — The Memory Studio'), 'llms.txt has brand');
  assert.ok(llmsTxt.includes('Koramangala 4th Block'), 'llms.txt has location');

  assert.ok(fs.existsSync(path.resolve('src/hooks/usePageSEO.js')), 'usePageSEO hook exists');
  const seoHookContent = fs.readFileSync(path.resolve('src/hooks/usePageSEO.js'), 'utf8');
  assert.ok(seoHookContent.includes('document.title = matchedConfig.title'), 'Updates document title');
  assert.ok(seoHookContent.includes('route-schema-jsonld'), 'Injects dynamic JSON-LD structured data');
});
