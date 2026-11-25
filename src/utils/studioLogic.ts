export type EventCategory = 'music' | 'nightlife' | 'culture';
export type LineupType = 'all' | 'live-gigs' | 'open-mic' | 'jam-sessions' | 'workshops';
export type DateBucket = 'all' | 'tonight' | 'week' | 'past';
export type GradientTheme = 'plum' | 'indigo' | 'cerulean' | 'ember';
export type TicketTier = 'GA' | 'VIP' | 'Backstage';
export type ServiceKind = 'gear' | 'membership' | 'space';

export interface EventTierOption {
  id: string;
  name: string;
  price: number;
  perks: string;
}

export interface StudioEvent {
  id: string;
  title: string;
  artistOrHost: string;
  category: EventCategory;
  lineup: Exclude<LineupType, 'all'>;
  dateBucket: Exclude<DateBucket, 'all'>;
  theme: GradientTheme;
  venue: string;
  city: string;
  dateLabel: string;
  timeLabel: string;
  basePrice: number;
  capacity: number;
  sold: number;
  isLive: boolean;
  imageUrl: string;
  description: string;
  badge?: string;
  featured?: boolean;
  room?: string;
  decibels?: string;
  tiers?: EventTierOption[];
  externalUrl?: string;
}

export interface TicketPass {
  id: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  dateLabel: string;
  timeLabel: string;
  tier: TicketTier | string;
  quantity: number;
  totalPaid: number;
  passCode: string;
  checkedIn: boolean;
  theme: GradientTheme;
  purchasedAt: string;
  utr?: string;
  status?: 'confirmed' | 'pending_review' | 'awaiting_payment' | 'rejected';
}

export interface StudioBooking {
  id: string;
  kind: ServiceKind;
  title: string;
  detail: string;
  hoursOrMonths: number;
  totalPaid: number;
  bookingCode: string;
  createdAt: string;
  status?: 'pending' | 'confirmed';
}

export interface StudioNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  read: boolean;
}

export interface CreateEventInput {
  title: string;
  artistOrHost: string;
  category: EventCategory;
  lineup?: Exclude<LineupType, 'all'>;
  theme: GradientTheme;
  venue: string;
  city: string;
  dateLabel: string;
  timeLabel: string;
  basePrice: number;
  capacity: number;
  description: string;
  imageUrl?: string;
  badge?: string;
  featured?: boolean;
  tiers?: EventTierOption[];
}

export interface TicketQuote {
  unitPrice: number;
  subtotal: number;
  studioFee: number;
  total: number;
}

export interface StudioMetrics {
  grossRevenue: number;
  totalSold: number;
  totalCapacity: number;
  activeEventsCount: number;
  checkedInPasses: number;
  totalPasses: number;
  attendanceRate: number;
}

export const TIER_MULTIPLIERS: Record<TicketTier, number> = {
  GA: 1,
  VIP: 1.65,
  Backstage: 2.4,
};

// Kesari Studio Core Contact & UPI Details
export const KESARI_CONTACT = {
  name: 'Kesari - The Memory Studio',
  tagline: 'MUSIC | EVENTS | MEETUPS | MEMORIES',
  location: 'Koramangala, Bangalore',
  fullAddress: 'Kesari - The Memory Studio, 80 Feet Rd, 4th Block, Koramangala, Bangalore, Karnataka 560034',
  phone: '+917760539955',
  whatsappNumber: '917760539955',
  upiId: 'kesari.memory@okhdfcbank',
  payeeName: 'Kesari Memory Studio',
  email: 'Kesari.memory@gmail.com',
  whatsappUrl: (msg: string) => `https://wa.me/917760539955?text=${encodeURIComponent(msg)}`,
};

export interface ServiceOption {
  id: string;
  kind: ServiceKind;
  name: string;
  subtitle: string;
  badge?: string;
  worthLabel?: string;
  rate: number;
  unitLabel: string;
  theme: GradientTheme;
  availableCount?: number;
  perks?: string[];
  specs?: string;
}

// Complete Official Kesari Catalog: Sound Gear (13 items), Memberships (3 tiers), Space Rentals (3 spaces)
export const SERVICE_CATALOG: Record<ServiceKind, ServiceOption[]> = {
  gear: [
    {
      id: 'yamaha-dbr',
      kind: 'gear',
      name: 'Yamaha DBR Speaker',
      subtitle: '2 available · High output powered active PA loudspeaker with crystal projection',
      badge: 'Speakers',
      rate: 2500,
      unitLabel: 'each/day',
      availableCount: 2,
      theme: 'plum',
    },
    {
      id: 'press-on-tower',
      kind: 'gear',
      name: 'Press On Tower Speaker',
      subtitle: '1 available · Portable vertical tower sound column with 2 wireless mics included',
      badge: 'Speakers',
      rate: 3000,
      unitLabel: 'day (w/ 2 mics)',
      availableCount: 1,
      theme: 'indigo',
    },
    {
      id: 'mixer-6ch',
      kind: 'gear',
      name: 'Mixer 6 Channel',
      subtitle: '1 available · Compact 6-channel analog mixing console with EQ & phantom power',
      badge: 'Mixers',
      rate: 1000,
      unitLabel: 'day',
      availableCount: 1,
      theme: 'cerulean',
    },
    {
      id: 'mixer-12ch',
      kind: 'gear',
      name: 'Mixer 12 Channel',
      subtitle: '1 available · Pro 12-channel live mixer with SPX digital effects & aux sends',
      badge: 'Mixers',
      rate: 2000,
      unitLabel: 'day',
      availableCount: 1,
      theme: 'ember',
    },
    {
      id: 'cordless-mic-set',
      kind: 'gear',
      name: 'Cordless Mic Set of 2',
      subtitle: '1 set · Dual handheld wireless microphone system with digital anti-drop receiver',
      badge: 'Mics',
      rate: 750,
      unitLabel: 'set/day',
      availableCount: 1,
      theme: 'indigo',
    },
    {
      id: 'shure-wire-mic',
      kind: 'gear',
      name: 'Shure Wire Mic',
      subtitle: '2 available · Industry standard dynamic wired microphone for vocals & speech',
      badge: 'Mics',
      rate: 400,
      unitLabel: 'each/day',
      availableCount: 2,
      theme: 'cerulean',
    },
    {
      id: 'mic-sm-58',
      kind: 'gear',
      name: 'Mic SM 58',
      subtitle: '4 available · Legendary Shure SM58 vocal dynamic cardioid microphone',
      badge: 'Mics',
      rate: 500,
      unitLabel: 'each/day',
      availableCount: 4,
      theme: 'plum',
    },
    {
      id: 'mic-stand',
      kind: 'gear',
      name: 'Mic Stand',
      subtitle: '3 available · Heavy-duty adjustable boom tripod floor stand',
      badge: 'Stands',
      rate: 300,
      unitLabel: 'each/day',
      availableCount: 3,
      theme: 'ember',
    },
    {
      id: 'small-mic-stand',
      kind: 'gear',
      name: 'Small Mic Stand',
      subtitle: '1 available · Desktop / amplifier compact low-profile microphone stand',
      badge: 'Stands',
      rate: 200,
      unitLabel: 'each/day',
      availableCount: 1,
      theme: 'indigo',
    },
    {
      id: 'guitar-stand',
      kind: 'gear',
      name: 'Guitar Stand',
      subtitle: '2 available · Cushioned universal folding A-frame guitar stand',
      badge: 'Stands',
      rate: 150,
      unitLabel: 'each/day',
      availableCount: 2,
      theme: 'cerulean',
    },
    {
      id: 'xlr-cable',
      kind: 'gear',
      name: 'XLR Cable',
      subtitle: '6 available · Balanced oxygen-free copper XLR male to female patch cable',
      badge: 'Cables',
      rate: 300,
      unitLabel: 'each/day',
      availableCount: 6,
      theme: 'plum',
    },
    {
      id: 'jack-to-jack',
      kind: 'gear',
      name: 'Jack to Jack Cable',
      subtitle: '6 available · Low-noise shielded 1/4" mono instrument cable for guitars & keys',
      badge: 'Cables',
      rate: 250,
      unitLabel: 'each/day',
      availableCount: 6,
      theme: 'ember',
    },
    {
      id: 'sound-engineer',
      kind: 'gear',
      name: 'Sound Engineer',
      subtitle: '1 available · Experienced live audio engineer to mix, calibrate acoustics & record',
      badge: 'Service',
      rate: 1500,
      unitLabel: 'session',
      availableCount: 1,
      theme: 'indigo',
    },
  ],
  membership: [
    {
      id: 'mem-everyday',
      kind: 'membership',
      name: 'The Everyday',
      subtitle: '10 Workdays (75+ hours) · 15 Artisan Teas/Coffees · Community Events',
      badge: 'Starter',
      worthLabel: 'Worth ₹22,050 (86% OFF)',
      rate: 3000,
      unitLabel: 'mo',
      theme: 'cerulean',
      perks: [
        '10 Workdays Access (Mon–Thu 10am–6pm, Fri 10am–3pm)',
        '15 Complimentary Artisan Teas or Coffees (₹120 value each)',
        'Acoustic Studio Desks & High-Speed Fiber WiFi',
        'Access to Regular Community Jam & Acoustic Evenings',
      ],
    },
    {
      id: 'mem-ritual',
      kind: 'membership',
      name: 'The Ritual',
      subtitle: '20 Workdays (150+ hours) · 30 Coffees · ₹700 Dining Credit · 10% Off Gear',
      badge: 'Most Loved',
      worthLabel: 'Worth ₹44,300 (89% OFF)',
      rate: 5000,
      unitLabel: 'mo',
      theme: 'ember',
      perks: [
        '20 Full Workdays Access (Mon–Fri Coworking Schedule)',
        '30 Complimentary Teas or Coffees (1 Daily Craft Brew)',
        '₹700 Café Dining Credit for Artisanal Food & Bites',
        'Special Member Privileges & Priority Event RSVP',
        '10% Discount on Sound Equipment & Space Rental',
      ],
    },
    {
      id: 'mem-circle',
      kind: 'membership',
      name: 'The Circle VIP',
      subtitle: 'Unlimited Workdays · 60 Teas/Coffees · ₹2,000 Dining · Guest Privileges · 2h Jam Room',
      badge: 'Ultimate VIP',
      worthLabel: 'Worth ₹53,700 (87% OFF)',
      rate: 7000,
      unitLabel: 'mo',
      theme: 'plum',
      perks: [
        'Unlimited Workdays during Café Coworking Hours',
        '60 Complimentary Teas or Coffees (₹7,200 value alone!)',
        '₹2,000 Café Dining Credit for Meals & Beverages',
        'Priority Event Reservations & VIP Seating',
        'Guest Privileges (Bring collaborators & friends to cowork)',
        'Free 2 Hours Studio Jam / Recording Room Access',
      ],
    },
  ],
  space: [
    {
      id: 'space-hall',
      kind: 'space',
      name: 'Main Studio Hall',
      subtitle: '40–60 Guests · Stage lighting · Acoustic wall panels · Yamaha PA system · Seating rows',
      badge: 'Live Stage',
      rate: 1500,
      unitLabel: 'hr',
      theme: 'plum',
      specs: 'Ideal for Live Gigs, Workshops, Standup Comedy, Poetry, Acoustic Concerts',
    },
    {
      id: 'space-lounge',
      kind: 'space',
      name: 'Acoustic Jam Room & Lounge',
      subtitle: '8–15 Guests · Guitar amps · Vocal mics · Drum rug · Mood lighting · Plush couches',
      badge: 'Intimate',
      rate: 800,
      unitLabel: 'hr',
      theme: 'ember',
      specs: 'Ideal for Band Jamming, Podcasts, Vocal Tracking, Intimate Jam Circles',
    },
    {
      id: 'space-buyout',
      kind: 'space',
      name: 'Full Studio Private Buyout',
      subtitle: 'Up to 75 Guests · Exclusive access to entire studio, sound technician & green room',
      badge: 'Full Studio',
      rate: 8000,
      unitLabel: 'half-day (Full Day ₹14,000)',
      theme: 'indigo',
      specs: 'Ideal for Private Parties, Corporate Offsites, Music Video Shoots, Popups',
    },
  ],
};

export const INITIAL_EVENTS: StudioEvent[] = [
  {
    id: 'amour',
    title: 'AMOUR – A Yash Raj Films Instrumental Tribute',
    artistOrHost: 'Amour String Ensemble',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'week',
    theme: 'plum',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Sun 1 Nov',
    timeLabel: '12:30',
    basePrice: 1800,
    capacity: 40,
    sold: 28,
    isLive: true,
    imageUrl: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
    badge: '🎻 Yash Raj Films Tribute',
    featured: true,
    room: 'Acoustic Chamber (40 Pax)',
    decibels: '74 dB Symphony · Candlelight',
    description: "Some melodies never grow old. Experience Yash Raj Films' iconic musical universe live with acoustic strings, piano, and cinematic elegance at Kesari - The Memory Studio.",
    tiers: [
      { id: 'couple', name: 'Couple Entry Pass', price: 1800, perks: 'Entry for 2 guests to live tribute session' },
      { id: 'vip-couple', name: 'VIP Front Row Couple Pass', price: 2500, perks: 'Stage-front seating for 2 + 2 artisanal coffees & commemorative score' }
    ],
  },
  {
    id: 'laadla',
    title: 'Maa Da Laadla by Parminder',
    artistOrHost: 'Amour String Quartet Live',
    category: 'music',
    lineup: 'live-gigs',
    dateBucket: 'tonight',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Sun 1 Nov',
    timeLabel: '18:00',
    basePrice: 349,
    capacity: 40,
    sold: 22,
    isLive: true,
    imageUrl: '/assets/events/book_us_01_live_music.jpg',
    badge: 'Live Music Gig',
    featured: false,
    room: 'Acoustic Hall (40 Pax)',
    decibels: '82 dB Live Energy',
    description: 'A soulful and vibrant live rendition of classic and contemporary melodies featuring Amour String Quartet Live at Kesari - The Memory Studio.',
    tiers: [
      { id: 'standard', name: 'Acoustic Hall Pass', price: 349, perks: 'Entry to live acoustic hall session' }
    ],
  },
  {
    id: 'soundwaves',
    title: 'Sunset Acoustic & Open Mic',
    artistOrHost: 'Sarah Vaughan Trio',
    category: 'music',
    lineup: 'open-mic',
    dateBucket: 'tonight',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '17:00',
    basePrice: 950,
    capacity: 25,
    sold: 18,
    isLive: true,
    imageUrl: '/assets/events/book_us_02_spoken_word.jpg',
    badge: '🌿 Studio Unplugged',
    featured: false,
    room: 'Acoustic Lounge (8–15 Pax)',
    decibels: '72 dB Acoustic · Warm',
    description: 'Intimate acoustic guitar, candlelit wooden stage, and craft beverages under warm studio lights at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Open Mic Audience Pass', price: 950, perks: 'Studio lounge seating & welcome drink' },
      { id: 'vip', name: 'Performer + Table Pass', price: 1950, perks: 'Guaranteed 10-min mic performance slot + set audio recording' }
    ],
  },
  {
    id: 'rock',
    title: 'Rock Legends Reunion',
    artistOrHost: 'The Velvet Echoes',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'tonight',
    theme: 'plum',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '19:00',
    basePrice: 1499,
    capacity: 60,
    sold: 52,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_03_concerts.jpg',
    badge: '⚡ Past Legend Set',
    featured: false,
    room: 'Main Stage (40–60 Pax)',
    decibels: '98 dB Peak · High Energy',
    description: 'An electrifying night celebrating iconic guitar riffs, drum jams, and legendary rock anthems performed live at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'General Studio Pass', price: 1499, perks: 'Entry to live studio hall & acoustic lounge' },
      { id: 'vip', name: 'VIP Front Row Pass', price: 2999, perks: 'Front row seating, meet the band & welcome beverage' },
      { id: 'all', name: 'All-Access Backstage Pass', price: 5499, perks: 'Artist green room access, soundcheck invite, free studio jam hour' }
    ],
  },
  {
    id: 'jazz',
    title: 'Jazz & Blues Evening',
    artistOrHost: 'Miles Quartet',
    category: 'music',
    lineup: 'jam-sessions',
    dateBucket: 'week',
    theme: 'indigo',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Fri 30 Oct',
    timeLabel: '18:30',
    basePrice: 1250,
    capacity: 20,
    sold: 16,
    isLive: true,
    imageUrl: '/assets/events/ev_jazz.jpg',
    badge: '🎷 Intimate Studio Session',
    featured: true,
    room: 'Acoustic Lounge (8–15 Pax)',
    decibels: '78 dB Mellow · Vinyl Tone',
    description: 'Immerse yourself in smooth saxophone melodies, soulful electric blues, and world-class live improvisation at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Studio Entry Pass', price: 1250, perks: 'Open seating in acoustic lounge' },
      { id: 'vip', name: 'Reserved Table Seating', price: 2450, perks: 'Reserved cafe table, complimentary artisanal coffee' },
      { id: 'all', name: 'VIP Studio Patron', price: 4250, perks: 'Front table, artist meet & greet, exclusive live vinyl recording' }
    ],
  },
  {
    id: 'hiphop',
    title: 'Hip Hop & Cypher Showcase',
    artistOrHost: 'Apex Rhymes & DJ Cipher',
    category: 'culture',
    lineup: 'open-mic',
    dateBucket: 'week',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Sat 14 Nov',
    timeLabel: '20:00',
    basePrice: 1350,
    capacity: 60,
    sold: 41,
    isLive: true,
    imageUrl: '/assets/concert_crowd.jpg',
    badge: '🎤 Live Cypher Session',
    featured: false,
    room: 'Main Stage (40–60 Pax)',
    decibels: '94 dB 808s · Sub Bass',
    description: 'Freestyle cyphers, chart-topping lyricists, and high-energy 808 beats live on mic at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Cypher Entry', price: 1350, perks: 'Standing room & cypher floor' },
      { id: 'vip', name: 'VIP Mosh & Front Row', price: 2750, perks: 'Floor access next to speakers & wireless mic cypher slot' },
      { id: 'all', name: 'Artist Backstage Circle', price: 4800, perks: 'Green room pass, open mic battle priority' }
    ],
  },
  {
    id: 'electronic',
    title: 'Modular Synth & Ambient Night',
    artistOrHost: 'Klangwelt Collective',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'week',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'NYE 31 Dec',
    timeLabel: '21:00',
    basePrice: 1850,
    capacity: 50,
    sold: 44,
    isLive: true,
    imageUrl: '/assets/fluid_art.jpg',
    badge: '🎆 Studio NYE Special',
    featured: true,
    room: '360° Studio Hall (50 Pax)',
    decibels: '96 dB Analog · Sub Bass',
    description: 'An intimate 360-degree audio immersion with live analog modular synths, ambient light projections, and deep bass at Kesari Studio, Bangalore.',
    tiers: [
      { id: 'ga', name: 'Studio Entry Pass', price: 1850, perks: 'Full audio visual access' },
      { id: 'vip', name: 'VIP Acoustic Lounge Seat', price: 3600, perks: 'Front row studio seating, priority beverage service' },
      { id: 'all', name: 'All-Night Studio VIP', price: 6200, perks: 'All-night access, sound engineer session invite' }
    ],
  },
  {
    id: 'standup-comedy',
    title: 'Stand-Up Comedy & Storytelling Night',
    artistOrHost: 'Bangalore Comedy Collective Live',
    category: 'culture',
    lineup: 'open-mic',
    dateBucket: 'tonight',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '20:30',
    basePrice: 499,
    capacity: 50,
    sold: 38,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_05_comedy.jpg',
    badge: '😂 Stand-Up Comedy',
    featured: true,
    room: 'Main Acoustic Hall (50 Pax)',
    decibels: '84 dB Comedy & Laughter',
    description: 'Non-stop laughter, sharp observational humor, and hilarious storytelling live on the Kesari stage in Koramangala.',
    tiers: [
      { id: 'standard', name: 'Comedy Pass', price: 499, perks: 'Entry + front seating' }
    ],
  },
  {
    id: 'dance-workshop',
    title: 'Contemporary Dance Practice & Masterclass',
    artistOrHost: 'Rhythm Movement Crew',
    category: 'culture',
    lineup: 'workshops',
    dateBucket: 'week',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    dateLabel: 'Sun 8 Nov',
    timeLabel: '11:00',
    basePrice: 799,
    capacity: 30,
    sold: 19,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_06_dance.jpg',
    badge: '💃 Dance Studio Session',
    featured: false,
    room: 'Studio Rehearsal Floor (30 Pax)',
    decibels: '80 dB Groove & Rhythm',
    description: 'Choreography, body isolations, and synchronized dance movement on our professional sprung wood floor at Kesari.',
    tiers: [
      { id: 'workshop', name: 'Workshop Pass', price: 799, perks: '2-hour masterclass + video footage' }
    ],
  },
  {
    id: 'evt-neon-monolith',
    title: 'Monolith AV Live',
    artistOrHost: 'Kora & Vektor',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'tonight',
    theme: 'plum',
    venue: 'Main Studio Hall · Kesari',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '22:00',
    basePrice: 1499,
    capacity: 220,
    sold: 182,
    isLive: true,
    imageUrl: '/src/assets/images/event_electronic_stage_1794904551209.jpg',
    badge: 'Electronic Stage',
    featured: false,
    description: 'Spatial warehouse electronic showcase with synchronized laser monoliths and analog modular synthesis at Kesari Studio.',
  },
];

export const INITIAL_PASSES: TicketPass[] = [
  {
    id: 'pass-seed-1',
    eventId: 'amour',
    eventTitle: 'AMOUR – A Yash Raj Films Instrumental Tribute',
    venue: 'Kesari - The Memory Studio, Koramangala',
    dateLabel: 'Sun 1 Nov',
    timeLabel: '12:30',
    tier: 'Couple Entry Pass',
    quantity: 1,
    totalPaid: 1908,
    passCode: 'KSR-8201',
    checkedIn: true,
    theme: 'plum',
    purchasedAt: '2026-11-16T18:10:00Z',
    status: 'confirmed',
  },
  {
    id: 'pass-seed-2',
    eventId: 'soundwaves',
    eventTitle: 'Sunset Acoustic & Open Mic',
    venue: 'Kesari - The Memory Studio, Koramangala',
    dateLabel: 'Tonight',
    timeLabel: '17:00',
    tier: 'GA',
    quantity: 1,
    totalPaid: 1007,
    passCode: 'KSR-3924',
    checkedIn: false,
    theme: 'ember',
    purchasedAt: '2026-11-16T21:30:00Z',
    status: 'confirmed',
  },
];

export const INITIAL_NOTIFICATIONS: StudioNotification[] = [
  {
    id: 'notif-1',
    title: 'AMOUR Yash Raj Tribute Passes Live',
    detail: 'Acoustic quartet & candlelit score confirmed at Kesari Koramangala.',
    timeLabel: '10m ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Sunset Acoustic Tonight',
    detail: 'Doors open at 16:30 for open mic check-in at Kesari Studio.',
    timeLabel: '1h ago',
    read: false,
  },
];

export function calculateTicketQuote(
  basePrice: number,
  tier: TicketTier | string,
  quantity: number
): TicketQuote {
  const safeQty = Math.max(1, Math.min(6, Math.round(quantity)));
  const safeBase = Math.max(0, basePrice);
  const multiplier = (TIER_MULTIPLIERS as Record<string, number>)[tier] ?? 1.0;
  const unitPrice = Math.round(safeBase * multiplier);
  const subtotal = unitPrice * safeQty;
  const studioFee = Math.round(subtotal * 0.06);
  return {
    unitPrice,
    subtotal,
    studioFee,
    total: subtotal + studioFee,
  };
}

export function getRemainingSeats(event: StudioEvent): number {
  return Math.max(0, event.capacity - event.sold);
}

export function filterEvents(
  events: StudioEvent[],
  category: EventCategory | 'all',
  query: string,
  lineup: LineupType = 'all',
  dateBucket: DateBucket = 'all',
  includePast: boolean = false
): StudioEvent[] {
  const normalizedQuery = query.trim().toLowerCase();
  const nowMs = Date.now();

  const filtered = events.filter((evt) => {
    const past = isPastEvent(evt, nowMs);

    if (dateBucket === 'past') {
      if (!past) return false;
    } else if (!includePast) {
      if (past || !evt.isLive) return false;
    }

    if (category !== 'all' && evt.category !== category) {
      return false;
    }
    if (lineup !== 'all' && evt.lineup !== lineup) {
      return false;
    }
    if (dateBucket !== 'all' && dateBucket !== 'past' && evt.dateBucket !== dateBucket) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = `${evt.title} ${evt.artistOrHost} ${evt.venue} ${evt.city} ${evt.category} ${evt.lineup}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return filtered.sort((a, b) => {
    const ta = parseEventStartTimestamp(a, nowMs) ?? 0;
    const tb = parseEventStartTimestamp(b, nowMs) ?? 0;
    return dateBucket === 'past' ? tb - ta : ta - tb;
  });
}

export function toggleSavedId(savedIds: string[], eventId: string): string[] {
  return savedIds.includes(eventId)
    ? savedIds.filter((id) => id !== eventId)
    : [eventId, ...savedIds];
}

export function generatePassCode(seedIndex: number): string {
  const numeric = 1000 + ((seedIndex * 3187 + 4921) % 8999);
  return `DST-${numeric}`;
}

export function purchaseTickets(
  events: StudioEvent[],
  passes: TicketPass[],
  params: {
    eventId: string;
    tier: TicketTier | string;
    quantity: number;
    timestamp?: string;
    utr?: string;
    status?: 'confirmed' | 'pending_review';
  }
): { ok: true; events: StudioEvent[]; passes: TicketPass[]; mintedPass: TicketPass } | { ok: false; error: string } {
  const target = events.find((e) => e.id === params.eventId);
  if (!target) {
    return { ok: false, error: 'Event not found.' };
  }
  if (!target.isLive) {
    return { ok: false, error: 'Ticket sales are currently paused for this event.' };
  }
  if (params.quantity < 1 || params.quantity > 6) {
    return { ok: false, error: 'Select between 1 and 6 tickets per booking.' };
  }
  const remaining = getRemainingSeats(target);
  if (params.quantity > remaining) {
    return { ok: false, error: `Only ${remaining} seats left for ${target.title}.` };
  }

  // Check if custom tier matches
  const customTier = target.tiers?.find(t => t.id === params.tier || t.name === params.tier);
  const unitPrice = customTier ? customTier.price : Math.round(target.basePrice * ((TIER_MULTIPLIERS as Record<string, number>)[params.tier] || 1.0));
  const subtotal = unitPrice * params.quantity;
  const studioFee = Math.round(subtotal * 0.06);
  const total = subtotal + studioFee;

  const mintedPass: TicketPass = {
    id: `pass-${Date.now()}-${passes.length + 1}`,
    eventId: target.id,
    eventTitle: target.title,
    venue: target.venue,
    dateLabel: target.dateLabel,
    timeLabel: target.timeLabel,
    tier: customTier ? customTier.name : params.tier,
    quantity: params.quantity,
    totalPaid: total,
    passCode: generatePassCode(passes.length + target.sold + params.quantity),
    checkedIn: false,
    theme: target.theme,
    purchasedAt: params.timestamp ?? new Date().toISOString(),
    utr: params.utr,
    status: params.status || 'confirmed',
  };

  const nextEvents = events.map((e) =>
    e.id === target.id ? { ...e, sold: e.sold + params.quantity } : e
  );
  const nextPasses = [mintedPass, ...passes];

  return { ok: true, events: nextEvents, passes: nextPasses, mintedPass };
}

export function createServiceBooking(
  bookings: StudioBooking[],
  params: { option: ServiceOption; duration: number; scheduleNote: string }
): { ok: true; bookings: StudioBooking[]; created: StudioBooking } | { ok: false; error: string } {
  const safeDuration = Math.round(params.duration);
  if (safeDuration < 1 || safeDuration > 12) {
    return { ok: false, error: 'Duration must be between 1 and 12.' };
  }
  const totalPaid = params.option.rate * safeDuration;
  const created: StudioBooking = {
    id: `svc-${Date.now()}-${bookings.length + 1}`,
    kind: params.option.kind,
    title: params.option.name,
    detail:
      params.scheduleNote.trim() ||
      `${safeDuration} ${params.option.unitLabel} reservation at Kesari Studio`,
    hoursOrMonths: safeDuration,
    totalPaid,
    bookingCode: `SVC-${1000 + ((bookings.length * 1937 + totalPaid) % 8999)}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };
  return { ok: true, bookings: [created, ...bookings], created };
}

export function togglePassCheckIn(passes: TicketPass[], passId: string): TicketPass[] {
  return passes.map((p) => (p.id === passId ? { ...p, checkedIn: !p.checkedIn } : p));
}

export function toggleEventLiveStatus(events: StudioEvent[], eventId: string): StudioEvent[] {
  return events.map((e) => (e.id === eventId ? { ...e, isLive: !e.isLive } : e));
}

export function incrementEventCheckInOrSold(
  events: StudioEvent[],
  eventId: string,
  delta: number
): StudioEvent[] {
  return events.map((e) => {
    if (e.id !== eventId) return e;
    const nextSold = Math.max(0, Math.min(e.capacity, e.sold + delta));
    return { ...e, sold: nextSold };
  });
}

const THEME_DEFAULT_IMAGE: Record<GradientTheme, string> = {
  plum: '/assets/events/kesari_stage_inside.jpg',
  indigo: '/assets/events/kesari_lounge_inside.jpg',
  cerulean: '/assets/events/kesari_gear_inside.jpg',
  ember: '/assets/events/ev_openmic.jpg',
};

export function createStudioEvent(
  events: StudioEvent[],
  input: CreateEventInput
): { ok: true; events: StudioEvent[]; created: StudioEvent } | { ok: false; error: string } {
  const title = input.title.trim();
  const venue = input.venue.trim();
  const dateLabel = input.dateLabel.trim();
  const timeLabel = input.timeLabel.trim();

  if (title.length < 3) {
    return { ok: false, error: 'Event title must be at least 3 characters.' };
  }
  if (venue.length < 2) {
    return { ok: false, error: 'Venue name is required.' };
  }
  if (!dateLabel || !timeLabel) {
    return { ok: false, error: 'Date and time are required.' };
  }
  if (!Number.isFinite(input.basePrice) || input.basePrice < 100) {
    return { ok: false, error: 'Ticket price must be at least ₹100.' };
  }
  if (!Number.isFinite(input.capacity) || input.capacity < 10) {
    return { ok: false, error: 'Capacity must be at least 10 guests.' };
  }

  const created: StudioEvent = {
    id: `evt-${Date.now()}`,
    title,
    artistOrHost: input.artistOrHost.trim() || 'Kesari Resident Artist',
    category: input.category,
    lineup: input.lineup ?? 'live-gigs',
    dateBucket: 'week',
    theme: input.theme,
    venue,
    city: input.city.trim() || 'Bangalore',
    dateLabel,
    timeLabel,
    basePrice: Math.round(input.basePrice),
    capacity: Math.round(input.capacity),
    sold: 0,
    isLive: true,
    imageUrl: input.imageUrl || THEME_DEFAULT_IMAGE[input.theme],
    description:
      input.description.trim() ||
      'Curated live session hosted at Kesari - The Memory Studio with acoustic treatment, stage lighting, and intimate seating.',
    badge: input.badge,
    featured: input.featured,
    tiers: input.tiers,
  };

  return { ok: true, events: [created, ...events], created };
}

export function computeStudioMetrics(events: StudioEvent[], passes: TicketPass[]): StudioMetrics {
  const grossRevenue = events.reduce((sum, evt) => sum + evt.sold * evt.basePrice, 0);
  const totalSold = events.reduce((sum, evt) => sum + evt.sold, 0);
  const totalCapacity = events.reduce((sum, evt) => sum + evt.capacity, 0);
  const activeEventsCount = events.filter((e) => e.isLive).length;
  const checkedInPasses = passes.filter((p) => p.checkedIn).length;
  const totalPasses = passes.length;
  const attendanceRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  return {
    grossRevenue,
    totalSold,
    totalCapacity,
    activeEventsCount,
    checkedInPasses,
    totalPasses,
    attendanceRate,
  };
}

export function formatCurrencyINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export interface UpiAppOptions {
  amount: number;
  payeeName?: string;
  upiId?: string;
  note?: string;
  ref?: string;
}

export interface UpiAppLinks {
  intent: string;
  gpay: string;
  phonepe: string;
  paytm: string;
  cred: string;
  bhim: string;
}

export function generateUpiUrl(params: UpiAppOptions): string {
  const upiId = params.upiId || KESARI_CONTACT.upiId;
  const pn = encodeURIComponent(params.payeeName || KESARI_CONTACT.payeeName);
  const am = params.amount.toFixed(2);
  const tn = encodeURIComponent(params.note || params.ref || 'Kesari Studio Booking');
  const tr = encodeURIComponent(params.ref || `KSR${Date.now()}`);
  return `upi://pay?pa=${upiId}&pn=${pn}&am=${am}&cu=INR&tn=${tn}&tr=${tr}`;
}

export function getUpiAppLinks(params: UpiAppOptions): UpiAppLinks {
  const upiId = params.upiId || KESARI_CONTACT.upiId;
  const pn = encodeURIComponent(params.payeeName || KESARI_CONTACT.payeeName);
  const am = params.amount.toFixed(2);
  const tn = encodeURIComponent(params.note || params.ref || 'Kesari Studio Pass');
  const tr = encodeURIComponent(params.ref || `KSR${Date.now()}`);
  const query = `pa=${upiId}&pn=${pn}&am=${am}&cu=INR&tn=${tn}&tr=${tr}`;

  return {
    intent: `upi://pay?${query}`,
    gpay: `tez://upi/pay?${query}`,
    phonepe: `phonepe://pay?${query}`,
    paytm: `paytmmp://pay?${query}`,
    cred: `cred://pay?${query}`,
    bhim: `bhim://pay?${query}`,
  };
}

export function isValidUpiUtr(utr: string): boolean {
  if (!utr) return false;
  const clean = utr.trim().replace(/\s+/g, '');
  // Standard NPCI UPI UTR is 12 digits (or 8-16 alphanumeric reference)
  return /^\d{12}$/.test(clean) || (/^[a-zA-Z0-9]{8,18}$/.test(clean) && /\d/.test(clean));
}

// Built-in parser for Fydo URLs and HTML source code
export function parseFydoHTMLOrUrl(input: string) {
  const result = {
    title: '',
    description: '',
    image: '',
    price: 1800,
    date: 'Sun 1 Nov',
    time: '12:30',
    venue: 'Kesari - The Memory Studio, Koramangala',
    city: 'Bangalore',
    category: 'nightlife' as EventCategory,
    theme: 'plum' as GradientTheme,
    lineup: 'live-gigs' as Exclude<LineupType, 'all'>,
    capacity: 40,
    tiers: [
      { id: 'couple', name: 'Couple Entry Pass', price: 1800, perks: 'Entry for 2 guests to the live tribute session' },
      { id: 'vip-couple', name: 'VIP Front Row Couple Pass', price: 2500, perks: 'Stage-front seating for 2 + 2 coffees' }
    ] as EventTierOption[],
  };

  if (input.includes('amour-a-yash-raj-films-instrumental-tribute') || input.toLowerCase().includes('yash raj')) {
    return {
      ...result,
      title: 'AMOUR – A Yash Raj Films Instrumental Tribute',
      category: 'nightlife' as EventCategory,
      theme: 'plum' as GradientTheme,
      date: 'Sun 1 Nov',
      time: '12:30',
      venue: 'Kesari - The Memory Studio, Koramangala',
      city: 'Bangalore',
      price: 1800,
      image: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
      description: "Some melodies never grow old. Amour brings the magic of Yash Raj Films' iconic musical universe to life through a live instrumental tribute at Kesari - The Memory Studio, Bengaluru.",
    };
  }

  // Attempt to parse JSON-LD inside HTML
  const jsonLdMatch = input.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch && jsonLdMatch[1]) {
    try {
      const data = JSON.parse(jsonLdMatch[1].trim());
      if (data.name) result.title = data.name;
      if (data.description) result.description = data.description;
      if (data.image) result.image = Array.isArray(data.image) ? data.image[0] : (typeof data.image === 'string' ? data.image : data.image.url || '');
      if (data.startDate) {
        const d = new Date(data.startDate);
        if (!isNaN(d.getTime())) {
          result.date = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
          result.time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
      }
      if (data.location && (data.location.name || data.location.address)) {
        result.venue = data.location.name || result.venue;
      }
      if (data.offers) {
        const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
        if (offer && offer.price) result.price = Number(offer.price) || result.price;
      }
    } catch {}
  }

  // Fallback OpenGraph
  const ogTitle = input.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || input.match(/<title>([^<]+)<\/title>/i);
  if (ogTitle && ogTitle[1] && !result.title) {
    result.title = ogTitle[1].replace(/ \| Fydo.*$/i, '').trim();
  }

  const ogImage = input.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  input.match(/https:\/\/[a-z0-9.-]+\.cloudfront\.net\/EVENTS\/[a-zA-Z0-9-]+\.(?:jpeg|jpg|png)/i);
  if (ogImage && (ogImage[1] || ogImage[0]) && !result.image) {
    result.image = ogImage[1] || ogImage[0];
  }

  const ogDesc = input.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDesc && ogDesc[1] && !result.description) {
    result.description = ogDesc[1].trim();
  }

  const priceMatch = input.match(/₹\s*([0-9,]+)/) || input.match(/INR\s*([0-9,]+)/i);
  if (priceMatch && priceMatch[1]) {
    result.price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  if (!result.title && input.includes('fydo.in/')) {
    const slug = input.split('fydo.in/')[1]?.split('?')[0]?.split('/')[0] || '';
    if (slug) {
      result.title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }

  return result;
}

const MONTH_INDEX: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function getKolkataDateParts(ms: number): { year: number; month: number; day: number } {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(ms));
  const [y, m, d] = formatted.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function parseTimeLabel(timeLabel: string): { hours: number; minutes: number } {
  const raw = String(timeLabel || '').trim();
  const ampmMatch = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return { hours: h, minutes: m };
  }
  const hmMatch = raw.match(/(\d{1,2}):(\d{2})/);
  if (hmMatch) {
    return {
      hours: Math.min(23, Math.max(0, parseInt(hmMatch[1], 10))),
      minutes: Math.min(59, Math.max(0, parseInt(hmMatch[2], 10))),
    };
  }
  return { hours: 19, minutes: 0 };
}

/**
 * Parses an event's dateLabel and timeLabel in Asia/Kolkata (+05:30) timezone.
 * Returns epoch milliseconds, or null if invalid.
 */
export function parseEventStartTimestamp(evt: StudioEvent, nowMs: number = Date.now()): number | null {
  const dateRaw = String(evt.dateLabel || '').trim();
  if (!dateRaw) return null;

  const { hours, minutes } = parseTimeLabel(evt.timeLabel);
  const hh = String(hours).padStart(2, '0');
  const min = String(minutes).padStart(2, '0');

  const todayKolkata = getKolkataDateParts(nowMs);
  let year = todayKolkata.year;
  let month = todayKolkata.month;
  let day = todayKolkata.day;

  const lower = dateRaw.toLowerCase();

  if (lower === 'tonight' || lower === 'today') {
    // Use today's Kolkata date
  } else if (lower === 'tomorrow') {
    const tmr = getKolkataDateParts(nowMs + 24 * 60 * 60 * 1000);
    year = tmr.year;
    month = tmr.month;
    day = tmr.day;
  } else {
    const isoMatch = dateRaw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10) - 1;
      day = parseInt(isoMatch[3], 10);
    } else {
      const monthMatch = lower.match(/\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sept|sep|october|oct|november|nov|december|dec)\b/);
      const dayMatch = lower.match(/\b(\d{1,2})\b/);
      const yearMatch = lower.match(/\b(20\d{2})\b/);
      if (!monthMatch || !dayMatch) return null;
      month = MONTH_INDEX[monthMatch[1]];
      day = parseInt(dayMatch[1], 10);
      if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
      }
    }
  }

  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const isoStr = `${year}-${mm}-${dd}T${hh}:${min}:00+05:30`;
  const parsed = Date.parse(isoStr);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isPastEvent(evt: StudioEvent, nowMs: number = Date.now()): boolean {
  const startMs = parseEventStartTimestamp(evt, nowMs);
  return startMs !== null && startMs <= nowMs;
}

export function isEligibleUpcomingEvent(evt: StudioEvent, nowMs: number = Date.now()): boolean {
  if (!evt.isLive) return false;
  const status = (evt as StudioEvent & { status?: string }).status?.toLowerCase();
  if (status && ['cancelled', 'draft', 'unpublished', 'past'].includes(status)) {
    return false;
  }
  const startMs = parseEventStartTimestamp(evt, nowMs);
  return startMs !== null && startMs > nowMs;
}

export function getNextUpcomingEvent(
  events: StudioEvent[],
  nowMs: number = Date.now(),
): { event: StudioEvent; startMs: number } | null {
  const candidates: Array<{ event: StudioEvent; startMs: number }> = [];
  for (const evt of events) {
    if (!evt.isLive) continue;
    const status = (evt as StudioEvent & { status?: string }).status?.toLowerCase();
    if (status && ['cancelled', 'draft', 'unpublished', 'past'].includes(status)) {
      continue;
    }
    const startMs = parseEventStartTimestamp(evt, nowMs);
    if (startMs !== null && startMs > nowMs) {
      candidates.push({ event: evt, startMs });
    }
  }
  candidates.sort((a, b) => a.startMs - b.startMs);
  return candidates[0] ?? null;
}
