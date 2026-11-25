/**
 * SEO & Structured Data Engine for Kesari - The Memory Studio
 * Handles dynamic titles, meta descriptions, OpenGraph, Canonical URLs, and JSON-LD schemas.
 */

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'place';
  faqSchema?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; path: string }[];
}

export const SEO_METADATA: Record<string, { title: string; description: string; keywords: string[] }> = {
  // Main
  explore: {
    title: 'Kesari – The Memory Studio | Music, Events & Meetups in Koramangala Bengaluru',
    description:
      'Kesari – The Memory Studio in Koramangala, Bengaluru (#33, 60 Feet Road, 5th Block). Acoustic gigs, open mics, live events & recording. Call: 77605 39955.',
    keywords: [
      'Kesari studio',
      'The Memory Studio',
      'Koramangala live music venue',
      'Bangalore acoustic gigs',
      'open mic Bangalore',
      'jam room Koramangala',
      'studio booking Bengaluru',
    ],
  },
  schedule: {
    title: 'Live Event Schedule & Tickets | Kesari – The Memory Studio Bengaluru',
    description:
      'Upcoming live shows, acoustic sessions, stand-up comedy, and creative workshops at Kesari Studio, Koramangala 5th Block, Bengaluru. Reserve your pass online.',
    keywords: ['Kesari events', 'live music Koramangala', 'Bangalore gigs this weekend', 'comedy open mic Koramangala'],
  },
  passes: {
    title: 'Pass Wallet & Bookings | Kesari – The Memory Studio',
    description: 'Access your verified admission passes, studio slot bookings, and event entries at Kesari - The Memory Studio in Koramangala, Bengaluru.',
    keywords: ['Kesari pass wallet', 'event tickets Bangalore', 'studio passes'],
  },
  search: {
    title: 'Search Live Shows & Sound Stages | Kesari – The Memory Studio',
    description: 'Search curated music gigs, poetry slams, workshops, and acoustic showcases in Koramangala, Bengaluru.',
    keywords: ['search events Bangalore', 'Koramangala music shows', 'find gigs'],
  },

  // Page 1: ABOUT KESARI
  'our-story': {
    title: 'Our Story — Kesari The Memory Studio | Koramangala, Bangalore',
    description:
      'The story behind Kesari – The Memory Studio. An intimate sanctuary in Koramangala, Bengaluru created for acoustic honesty, live music, and lasting memories.',
    keywords: ['Kesari story', 'about Kesari studio', 'Koramangala acoustic sanctuary', 'intimate live music Bangalore'],
  },
  'meet-the-founder': {
    title: 'Meet the Founder — Kesari The Memory Studio | Bengaluru',
    description:
      'Meet the creative curators and sound engineers behind Kesari – The Memory Studio in Koramangala, Bengaluru. Built for acoustic craft and artist dignity.',
    keywords: ['Kesari founder', 'who started Kesari studio', 'sound stage Bangalore curators'],
  },
  'our-journey': {
    title: 'Our Journey & Milestones — 500+ Live Shows | Kesari Studio Bangalore',
    description:
      'Explore milestones of Kesari Studio: 500+ independent artist shows, 4K multi-cam AV capture, and 10,000+ patrons in Koramangala 5th Block, Bengaluru.',
    keywords: ['Kesari milestones', 'live gigs history Koramangala', 'independent artist venue Bangalore'],
  },
  'our-community': {
    title: 'Creator Community & Artists — Kesari The Memory Studio',
    description:
      'Join over 1,200 indie musicians, poets, comedians, and storytellers who call Kesari home. Weekly open mics and creator salons in Koramangala, Bengaluru.',
    keywords: ['Kesari artist community', 'Bangalore creative collective', 'indie musicians Koramangala', 'poets Bangalore'],
  },
  'why-kesari': {
    title: 'Why Kesari? — Bengaluru’s Premier Intimate Stage & Acoustic Room',
    description:
      'Why Kesari: purpose-built acoustics, Allen & Heath mixer, boutique 60–100 capacity, green room, cafe, and 4K recording in Koramangala 5th Block.',
    keywords: ['why Kesari', 'best acoustic venue Koramangala', 'intimate gig room Bangalore', 'venue with lift Koramangala'],
  },

  // Page 2: CONNECT WITH US
  'contact-us': {
    title: 'Come say hello! — Contact Kesari The Memory Studio | Koramangala Bangalore',
    description:
      'Come say hello at Kesari – The Memory Studio. #33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095. Call / WhatsApp: 77605 39955.',
    keywords: [
      'Kesari contact',
      'Kesari address Koramangala',
      '#33 60 Feet Road KHB Colony',
      'Kesari phone number',
      '77605 39955',
      'Kesari memory gmail',
    ],
  },
  collaborate: {
    title: 'Collaborate With Us — Co-Curate Shows & Festivals | Kesari Studio',
    description:
      'Collaborate with Kesari to produce listening parties, acoustic festival series, poetry showcases, and indie record launches in Koramangala, Bengaluru.',
    keywords: ['collaborate with Kesari', 'curate event Bangalore', 'album listening party Koramangala'],
  },
  partner: {
    title: 'Partner With Kesari — Brand & Gear Partnerships | Bangalore',
    description:
      'Partner with Bangalore’s favorite intimate sound stage for brand activations, instrument showcases, beverage sampling, and media sponsorships.',
    keywords: ['Kesari brand partnerships', 'sponsor music event Bangalore', 'audio gear showcase Koramangala'],
  },
  'join-artists': {
    title: 'Join Our Artist Community — Perform & Tour at Kesari Bengaluru',
    description:
      'Touring artists, singer-songwriters, comedians, and poets: apply to perform at Kesari. Transparent ticket splits, pro sound engineer, and green room.',
    keywords: ['perform at Kesari', 'gig slot Bangalore', 'touring artist Bengaluru venue', 'artist registration Kesari'],
  },
  corporate: {
    title: 'Corporate Enquiries & Private Buyouts — Kesari Studio Koramangala',
    description:
      'Host company offsites, team celebrations, town halls, and private milestone parties at Kesari Studio. Projector, wireless mics & full venue privacy.',
    keywords: ['corporate venue booking Koramangala', 'team offsite venue Bangalore', 'private party hall 5th Block Koramangala'],
  },

  // Page 3: HELP & INFORMATION
  faq: {
    title: 'Frequently Asked Questions (FAQ) — Kesari The Memory Studio',
    description:
      'Clear answers on venue capacity (60–120 pax), provided sound gear, parking on 60 Feet Road, elevator accessibility, outside catering, and booking slots.',
    keywords: ['Kesari FAQ', 'Kesari capacity', 'parking near Kesari Koramangala', 'sound equipment Kesari'],
  },
  'booking-payment': {
    title: 'Booking & Payment Information — Slots & GST | Kesari Studio',
    description:
      'Transparent booking terms: slot timings (morning, afternoon, prime evening, full day), 50% deposit policy, UPI/card payment, and official GST invoices.',
    keywords: ['Kesari booking information', 'studio slot pricing Koramangala', 'venue payment terms Bangalore'],
  },
  'cancellation-refund': {
    title: 'Cancellation & Refund Policy — Kesari The Memory Studio',
    description:
      'Fair, transparent cancellation policy: 100% refund 7+ days prior, 50% refund or full reschedule credit 3–6 days prior, and date-change guidelines.',
    keywords: ['Kesari cancellation policy', 'refund policy Kesari studio', 'reschedule venue booking Bangalore'],
  },
  terms: {
    title: 'Terms & Conditions — Studio Safety & Code of Conduct | Kesari',
    description:
      'Kesari Studio venue regulations, safe space policy, equipment care responsibilities, and civic sound decibel compliance past 10:30 PM.',
    keywords: ['Kesari terms and conditions', 'studio rules Koramangala', 'venue safety norms'],
  },
  privacy: {
    title: 'Privacy Policy — DPDP Act Compliance | Kesari The Memory Studio',
    description:
      'How Kesari protects patron contact details, payment tokens, and ticket barcodes under India’s Digital Personal Data Protection Act. Zero third-party ad sharing.',
    keywords: ['Kesari privacy policy', 'data safety Kesari', 'DPDP compliance Bangalore'],
  },
};

/**
 * Update head elements dynamically for SEO
 */
export function updatePageSeo(target: { section: string; subPage?: string }) {
  if (typeof document === 'undefined') return;

  const key = target.subPage || target.section || 'explore';
  const meta = SEO_METADATA[key] || SEO_METADATA.explore;
  const baseUrl = 'https://kesaristudio.com';
  const currentPath = target.subPage
    ? `/${target.section}/${target.subPage}`
    : target.section === 'explore'
      ? '/'
      : `/${target.section}`;
  const canonicalUrl = `${baseUrl}${currentPath}`;
  const previewImage = `${baseUrl}/assets/landing-surreal.jpg`;

  // 1. Update Title
  document.title = meta.title;

  // 2. Helper to set/create meta tag
  const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Set standard SEO meta
  setMeta('description', meta.description);
  setMeta('keywords', meta.keywords.join(', '));
  setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  setMeta('theme-color', '#050507');
  setMeta('geo.region', 'IN-KA');
  setMeta('geo.placename', 'Bengaluru');
  setMeta('geo.position', '12.9345;77.6290');
  setMeta('ICBM', '12.9345, 77.6290');

  // 4. OpenGraph tags
  setMeta('og:title', meta.title, 'property');
  setMeta('og:description', meta.description, 'property');
  setMeta('og:url', canonicalUrl, 'property');
  setMeta('og:type', target.subPage ? 'article' : 'website', 'property');
  setMeta('og:site_name', 'Kesari – The Memory Studio', 'property');
  setMeta('og:locale', 'en_IN', 'property');
  setMeta('og:image', previewImage, 'property');
  setMeta('og:image:secure_url', previewImage, 'property');
  setMeta('og:image:width', '1200', 'property');
  setMeta('og:image:height', '630', 'property');
  setMeta('og:image:alt', meta.title, 'property');

  // 5. Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', meta.title);
  setMeta('twitter:description', meta.description);
  setMeta('twitter:image', previewImage);

  // 6. Canonical link
  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // 7. Dynamic JSON-LD Structured Data
  let jsonLdScript = document.getElementById('kesari-jsonld-schema') as HTMLScriptElement | null;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'kesari-jsonld-schema';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }

  // Base LocalBusiness Schema
  const businessSchema = {
    '@type': ['LocalBusiness', 'EntertainmentBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: 'Kesari – The Memory Studio',
    alternateName: 'Kesari Studio Koramangala',
    description:
      'Intimate acoustic live performance room, sound stage, and creator sanctuary in Koramangala 5th Block, Bengaluru.',
    url: baseUrl,
    telephone: '+917760539955',
    email: 'Kesari.memory@gmail.com',
    priceRange: '₹₹',
    image: previewImage,
    logo: `${baseUrl}/assets/kesari-logo-colour-long.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560095',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9345,
      longitude: 77.629,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '23:30',
      },
    ],
    sameAs: [
      'https://www.instagram.com/kesari_thememorystudio/',
      'https://www.youtube.com/@kesarithememorystudio',
      'https://www.facebook.com/p/Kesari-61586699187811/',
      'https://share.google/1gcic7zhVrOJJYs4O',
    ],
  };

  // Breadcrumbs Schema
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...(target.section && target.section !== 'explore'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: target.section.toUpperCase(),
              item: `${baseUrl}/${target.section}`,
            },
          ]
        : []),
      ...(target.subPage
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: meta.title.split('—')[0].trim(),
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  // Combine schemas under @graph
  const schemas: any[] = [businessSchema, breadcrumbSchema];

  // Specific FAQ schema for FAQ subpage
  if (target.subPage === 'faq') {
    schemas.push({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the guest capacity at Kesari Studio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kesari comfortably seats 60–80 guests theater-style, and accommodates up to 100–120 in informal standing or networking formats.',
          },
        },
        {
          '@type': 'Question',
          name: 'What audio gear is included with venue booking?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Allen & Heath digital mixer, Shure wireless and vocal microphones, stage monitors, DIs, acoustic guitars, and keyboard.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is Kesari Studio located in Bangalore?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is parking available at Kesari Studio Koramangala?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ample street parking is available along 60 Feet Road and in adjacent KHB Colony parking bays.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are elevator and changing room facilities available at Kesari?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our building features elevator/lift access, dedicated changing rooms, and separate clean washrooms.',
          },
        },
      ],
    });
  }

  jsonLdScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}
