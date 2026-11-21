import { useEffect } from 'react';

/**
 * Route-Specific SEO Metadata & JSON-LD Config
 */
const ROUTE_SEO_CONFIG = {
  '/': {
    title: 'Kesari — The Memory Studio | Acoustic Stage, Events & Pure Veg Cafe',
    description: 'Intimate candlelight concerts, acoustic stage, studio hall hosting, pro audio gear rentals, and 100% pure veg cafe in Koramangala, Bangalore.',
    canonical: 'https://kesaristudio.com/',
    ogImage: '/assets/events/real_kesari/kesari_ev_01.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': ['EventVenue', 'PerformingArtsTheater', 'LocalBusiness'],
      name: 'Kesari — The Memory Studio',
      description: 'Premier acoustic chamber, live performance stage, studio hall rental, audio equipment hiring, and 100% pure veg cafe in Koramangala, Bangalore.',
      url: 'https://kesaristudio.com',
      telephone: '+917760539955',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Koramangala 4th Block',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560034',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '12.9352',
        longitude: '77.6245'
      },
      servesCuisine: '100% Pure Vegetarian Cafe',
      maximumAttendeeCapacity: 200,
      currenciesAccepted: 'INR',
      paymentAccepted: 'UPI, Cash, Credit Card'
    }
  },
  '/events': {
    title: 'Live Concerts & Indie Gigs in Bangalore | Kesari Events',
    description: 'Explore upcoming live shows, candlelight concerts, indie music gigs, and acoustic open mics in Koramangala, Bangalore. Book verified passes online.',
    canonical: 'https://kesaristudio.com/events',
    ogImage: '/assets/events/real_kesari/kesari_ev_01.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Upcoming Live Events & Shows at Kesari Studio',
      description: 'Live acoustic concerts, tribute nights, comedy sets, and indie showcases in Koramangala, Bangalore.',
      url: 'https://kesaristudio.com/events'
    }
  },
  '/events/:id': {
    title: 'Amour — Yash Raj Films Instrumental Tribute | Kesari Studio',
    description: 'Live candlelight strings and grand piano tribute in an intimate 40-seat acoustic chamber in Koramangala, Bangalore. Couple pass ₹1,800.',
    canonical: 'https://kesaristudio.com/events/amour',
    ogImage: '/assets/events/real_kesari/kesari_ev_01.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: 'AMOUR: Yash Raj Films Instrumental Tribute',
      startDate: '2026-11-01T12:30:00+05:30',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Kesari — The Memory Studio',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koramangala 4th Block',
          addressLocality: 'Bangalore',
          postalCode: '560034',
          addressCountry: 'IN'
        }
      },
      image: ['https://kesaristudio.com/assets/events/real_kesari/kesari_ev_01.jpg'],
      description: 'Live candlelight strings and grand piano tribute in an intimate 40-seat acoustic chamber.',
      offers: {
        '@type': 'Offer',
        url: 'https://kesaristudio.com/events/amour',
        price: '1800',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-10-01T00:00:00+05:30'
      },
      performer: {
        '@type': 'PerformingGroup',
        name: 'Kesari Chamber Ensemble'
      }
    }
  },
  '/host-event': {
    title: 'Host an Event & Concert Hall Rental | Koramangala, Bangalore | Kesari',
    description: 'Rent acoustically treated studio halls for concerts, jams, comedy, workshops, and private listening sessions. Capacities up to 200 guests with on-site sound engineer.',
    canonical: 'https://kesaristudio.com/host-event',
    ogImage: '/assets/venue/kesari_main_stage_live.png',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Event Hall & Studio Space Rental',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Kesari — The Memory Studio'
      },
      areaServed: 'Bangalore',
      description: 'Acoustically calibrated spaces for concerts, jams, comedy, and private celebrations with line array PA and sound engineer.',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '5000',
        highPrice: '15000',
        priceCurrency: 'INR'
      }
    }
  },
  '/book': {
    title: 'Reserve Studio Space & Halls | Kesari — The Memory Studio',
    description: 'Book the Main Concert Stage (200 pax), Acoustic Lounge (60 pax), or Creator Workshop Room (40 pax) in Koramangala. Transparent hourly packages.',
    canonical: 'https://kesaristudio.com/book',
    ogImage: '/assets/venue/kesari_main_stage_live.png'
  },
  '/audio-rental': {
    title: 'Professional Audio Equipment Rental in Bangalore | Yamaha PAs & Mixers',
    description: 'Rent Yamaha DBR active speakers, Soundcraft mixers, Shure microphones, subwoofers, and hire certified live sound engineers in Koramangala, Bangalore.',
    canonical: 'https://kesaristudio.com/audio-rental',
    ogImage: '/assets/venue/kesari_main_stage_live.png',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Professional Audio Equipment Rental & Sound Crew',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Kesari — The Memory Studio',
        telephone: '+917760539955'
      },
      areaServed: 'Bangalore',
      description: 'Yamaha DBR active PAs, digital mixing consoles, Shure vocal microphones, subwoofers, and sound engineers for gigs and private events.'
    }
  },
  '/artists': {
    title: 'Book Verified Indie Artists in Bangalore | Kesari Talent Roster',
    description: 'Connect with verified Bangalore indie vocalists, bands, DJs, and stand-up comics for live shows, corporate sessions, and private showcases.',
    canonical: 'https://kesaristudio.com/artists',
    ogImage: '/assets/events/real_kesari/kesari_ev_01.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Curated Bangalore Indie Artists Roster',
      description: 'Studio-vetted vocalists, bands, and performers in Bangalore.'
    }
  },
  '/artists/register': {
    title: 'Artist Registration & Showcase Application | Kesari Studio',
    description: 'Apply to join Kesari Studio roster of performers in Koramangala, Bangalore. Open mics, stage showcases, and gig opportunities.',
    canonical: 'https://kesaristudio.com/artists/register'
  },
  '/menu': {
    title: '100% Pure Veg Cafe Menu | Kesari Studio Koramangala',
    description: 'Live digital QR menu: stone-fired pizzas, slow-simmered dal makhani, wild mushroom risotto, and artisanal coffees in Koramangala 4th Block.',
    canonical: 'https://kesaristudio.com/menu',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: 'Kesari Studio Cafe Menu',
      description: '100% Pure Vegetarian artisanal cafe menu in Koramangala, Bangalore.',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Starters',
          description: 'Gourmet pure vegetarian small plates & bruschettas'
        },
        {
          '@type': 'MenuSection',
          name: 'Mains',
          description: 'Stone-fired sourdough pizzas, artisanal risottos & Indian heritage pots'
        },
        {
          '@type': 'MenuSection',
          name: 'Artisan Beverages',
          description: 'Single-origin espresso, slow cold brews & refreshing herbal mocktails'
        }
      ]
    }
  },
  '/order-food': {
    title: 'Bulk Food Catering for Events | Pure Veg | Kesari Studio',
    description: 'Order gourmet pure vegetarian food in bulk for studio events, parties, and offsites in Koramangala. 48-hour advance booking, Jain options available.',
    canonical: 'https://kesaristudio.com/order-food'
  },
  '/venue-gallery': {
    title: 'Studio Venue Gallery | Kesari — The Memory Studio Bangalore',
    description: 'Photo tour of the 200-seat Concert Hall, Acoustic Lounge, timber jam room, and artisanal cafe in Koramangala 4th Block.',
    canonical: 'https://kesaristudio.com/venue-gallery',
    ogImage: '/assets/venue/kesari_main_stage_live.png'
  },
  '/event-gallery': {
    title: 'Event Highlights Gallery | Live Gigs at Kesari Studio Bangalore',
    description: 'Photos and crowd energy from live concerts, candlelight acoustic nights, comedy jams, and indie showcases at Kesari Studio.',
    canonical: 'https://kesaristudio.com/event-gallery',
    ogImage: '/assets/events/real_kesari/kesari_ev_01.jpg'
  },
  '/contact': {
    title: 'Contact & Directions | Kesari — The Memory Studio Koramangala',
    description: 'Visit us in Koramangala 4th Block, Bangalore. Phone: +91 77605 39955. Direct WhatsApp inquiries, parking assistance, and studio tours.',
    canonical: 'https://kesaristudio.com/contact',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Kesari — The Memory Studio',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: 'Kesari — The Memory Studio',
        telephone: '+917760539955',
        email: 'booking@kesaristudio.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koramangala 4th Block',
          addressLocality: 'Bangalore',
          postalCode: '560034',
          addressCountry: 'IN'
        }
      }
    }
  }
};

/**
 * usePageSEO: Updates document title, meta description, canonical link,
 * and dynamically injects route-specific JSON-LD structured data into <head>.
 */
export default function usePageSEO(route) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const matchedConfig = ROUTE_SEO_CONFIG[route] || ROUTE_SEO_CONFIG['/'];

    // 1. Update Document Title
    document.title = matchedConfig.title;

    // 2. Update Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', matchedConfig.description);

    // 3. Update Canonical Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', matchedConfig.canonical);

    // 4. Update Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', matchedConfig.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', matchedConfig.description);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', matchedConfig.canonical);
    if (matchedConfig.ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', matchedConfig.ogImage);
    }

    // 5. Dynamic JSON-LD Route Structured Data
    let schemaScript = document.getElementById('route-schema-jsonld');
    if (matchedConfig.schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'route-schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(matchedConfig.schema, null, 2);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [route]);
}
