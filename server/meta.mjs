/**
 * Server-Side Route SEO Metadata & JSON-LD Pre-rendering
 * Injects route-specific tags into HTML before serving to bots & crawlers.
 */

export const ROUTE_META_MAP = {
  '/': {
    title: 'Kesari — The Memory Studio | Acoustic Stage, Events & Pure Veg Cafe',
    description: 'Intimate candlelight concerts, acoustic stage, studio hall hosting, pro audio gear rentals, and 100% pure veg cafe in Koramangala, Bangalore.',
    canonical: 'https://thekesari.com/',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/events': {
    title: 'Live Concerts & Indie Gigs in Bangalore | Kesari Events',
    description: 'Explore upcoming live shows, candlelight concerts, indie music gigs, and acoustic open mics in Koramangala, Bangalore. Book verified passes online.',
    canonical: 'https://thekesari.com/events',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/events/amour': {
    title: 'Amour — Yash Raj Films Instrumental Tribute | Kesari Studio',
    description: 'Live candlelight strings and grand piano tribute in an intimate 40-seat acoustic chamber in Koramangala, Bangalore. Couple pass ₹1,800.',
    canonical: 'https://thekesari.com/events/amour',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'music.song'
  },
  '/host-event': {
    title: 'Event Space & Studio Hall Rental in Koramangala | Kesari Bangalore',
    description: 'Rent acoustically treated studio halls for concerts, jams, comedy, workshops, and private listening sessions. Capacities up to 200 guests with on-site sound engineer.',
    canonical: 'https://thekesari.com/host-event',
    ogImage: 'https://thekesari.com/assets/events/kesari_stage_inside.jpg',
    ogType: 'website'
  },
  '/book': {
    title: 'Reserve Studio Space & Halls | Kesari — The Memory Studio',
    description: 'Book the Main Concert Stage (200 pax), Acoustic Lounge (60 pax), or Creator Workshop Room (40 pax) in Koramangala. Transparent hourly packages.',
    canonical: 'https://thekesari.com/book',
    ogImage: 'https://thekesari.com/assets/events/kesari_stage_inside.jpg',
    ogType: 'website'
  },
  '/audio-rental': {
    title: 'Audio Equipment & PA System Rental in Bangalore | Yamaha PAs & Mixers',
    description: 'Rent Yamaha DBR active speakers, Soundcraft mixers, Shure microphones, subwoofers, and hire certified live sound engineers in Koramangala, Bangalore.',
    canonical: 'https://thekesari.com/audio-rental',
    ogImage: 'https://thekesari.com/assets/events/kesari_stage_inside.jpg',
    ogType: 'website'
  },
  '/artists': {
    title: 'Book Indie Artists in Bangalore | Kesari Talent Roster',
    description: 'Connect with verified Bangalore indie vocalists, bands, DJs, and stand-up comics for live shows, corporate sessions, and private showcases.',
    canonical: 'https://thekesari.com/artists',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/artists/register': {
    title: 'Artist Registration & Showcase Application | Kesari Studio',
    description: 'Apply to join Kesari Studio roster of performers in Koramangala, Bangalore. Open mics, stage showcases, and gig opportunities.',
    canonical: 'https://thekesari.com/artists/register',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/menu': {
    title: '100% Pure Veg Cafe Menu | Kesari Studio Koramangala',
    description: 'Live digital QR menu: stone-fired pizzas, slow-simmered dal makhani, wild mushroom risotto, and artisanal coffees in Koramangala 4th Block.',
    canonical: 'https://thekesari.com/menu',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/order-food': {
    title: 'Bulk Food Catering for Events | Pure Veg | Kesari Studio',
    description: 'Order gourmet pure vegetarian food in bulk for studio events, parties, and offsites in Koramangala. 48-hour advance booking, Jain options available.',
    canonical: 'https://thekesari.com/order-food',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/venue-gallery': {
    title: 'Studio Venue Gallery | Kesari — The Memory Studio Bangalore',
    description: 'Photo tour of the 200-seat Concert Hall, Acoustic Lounge, timber jam room, and artisanal cafe in Koramangala 4th Block.',
    canonical: 'https://thekesari.com/venue-gallery',
    ogImage: 'https://thekesari.com/assets/events/kesari_stage_inside.jpg',
    ogType: 'website'
  },
  '/event-gallery': {
    title: 'Event Highlights Gallery | Live Gigs at Kesari Studio Bangalore',
    description: 'Photos and crowd energy from live concerts, candlelight acoustic nights, comedy jams, and indie showcases at Kesari Studio.',
    canonical: 'https://thekesari.com/event-gallery',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  },
  '/contact': {
    title: 'Visit Kesari Studio in Koramangala | Contact & Directions',
    description: 'Visit us in Koramangala 4th Block, Bangalore. Phone: +91 77605 39955. Direct WhatsApp inquiries, parking assistance, and studio tours.',
    canonical: 'https://thekesari.com/contact',
    ogImage: 'https://thekesari.com/assets/events/real_kesari/kesari_ev_01.jpg',
    ogType: 'website'
  }
};

/**
 * Injects route-specific SEO tags into HTML before delivery to bots & scrapers
 */
export function injectRouteSEO(html, routePath = '/') {
  let cleanPath = routePath.split('?')[0].split('#')[0];
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Find matching config or fallback to root
  const config = ROUTE_META_MAP[cleanPath] || ROUTE_META_MAP['/'];

  let updated = html;

  // Replace <title>
  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${config.title}</title>`);

  // Replace <meta name="description">
  updated = updated.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${config.description}" />`
  );

  // Replace canonical link
  updated = updated.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${config.canonical}" />`
  );

  // Replace og:title & og:description
  updated = updated.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${config.title}" />`
  );
  updated = updated.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${config.description}" />`
  );
  updated = updated.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${config.canonical}" />`
  );
  if (config.ogImage) {
    updated = updated.replace(
      /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image" content="${config.ogImage}" />`
    );
    updated = updated.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image" content="${config.ogImage}" />`
    );
  }

  // Replace twitter:title & twitter:description
  updated = updated.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${config.title}" />`
  );
  updated = updated.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${config.description}" />`
  );

  return updated;
}
