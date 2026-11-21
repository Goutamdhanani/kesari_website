// Kesari - The Memory Studio, Koramangala Data
// Official Equipment Rental Catalog, Space Rentals, Monthly Passes, and Contact Details

export const KESARI_CONTACT = {
  name: 'Kesari - The Memory Studio',
  tagline: 'MUSIC | EVENTS | MEETUPS | MEMORIES',
  location: 'Bangalore',
  fullAddress: 'Kesari - The Memory Studio, Bangalore',
  phone: '7760539955',
  whatsappNumber: '917760539955',
  whatsappUrl: (msg) => `https://wa.me/917760539955?text=${encodeURIComponent(msg)}`
};

// 1. Official Sound System & Audio Equipment Available for Rent (From Kesari Poster)
export const RENTAL_EQUIPMENT = [
  {
    id: 'yamaha-dbr',
    name: 'Yamaha DBR Speaker',
    category: 'speakers',
    price: 2500,
    priceUnit: 'each / day',
    available: 2,
    badge: '2 available',
    desc: 'High output powered active PA loudspeaker with crystal clear live acoustic projection',
    specs: ['1000W Class-D amplifier', '12" Woofer + 1.4" Driver', '131dB Max SPL', 'XLR / TRS inputs with D-CONTOUR DSP'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'speaker'
  },
  {
    id: 'press-on-tower',
    name: 'Press On Tower Speaker',
    category: 'speakers',
    price: 3000,
    priceUnit: 'with 2 mics / day',
    available: 1,
    badge: 'Includes 2 mics',
    desc: 'High-power portable vertical tower sound column with 2 wireless mics included',
    specs: ['All-in-one column PA system', 'Built-in bluetooth & USB playback', 'Includes 2 cordless UHF handheld mics', 'Wide 140° acoustic dispersion'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'speaker'
  },
  {
    id: 'line-array-pa',
    name: 'Line Array PA Speaker System',
    category: 'speakers',
    price: 6500,
    priceUnit: 'pair / day',
    available: 2,
    badge: 'Concert Grade',
    desc: 'Professional high-throw line array sound system engineered for concerts, live auditoriums and open-air gigs',
    specs: ['2000W Bi-amped continuous output', 'Dual 8" Neodymium drivers + 3" titanium compression', '135dB Peak SPL', 'Precision rigging hardware & fly-bars'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'speaker'
  },
  {
    id: 'stage-monitor-wedge',
    name: 'Pro Stage Monitor Wedge 12"',
    category: 'speakers',
    price: 1800,
    priceUnit: 'each / day',
    available: 4,
    badge: '4 available',
    desc: 'Low-profile floor wedge stage monitor delivering uncolored, feedback-resistant foldback audio to performers',
    specs: ['1100W Peak Class-D power', '12" Coaxial driver with 1" HF compression', 'Dual 43° / 55° wedge angles', 'Feedback-notch filter & DSP voicing presets'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'speaker'
  },
  {
    id: 'powered-subwoofer',
    name: 'Yamaha 18" Powered Subwoofer',
    category: 'subwoofers',
    price: 4000,
    priceUnit: 'each / day',
    available: 2,
    badge: 'Heavy Bass',
    desc: 'Touring-grade active subwoofer delivering thunderous low-end down to 30Hz for electronic and live band setups',
    specs: ['1600W Class-D amplifier', '18" Long-excursion Ferrite woofer', '136dB Max SPL', 'Cardioid bass steering mode & D-XSUB processing'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'speaker'
  },
  {
    id: 'mixer-6ch',
    name: 'Mixer 6 Channel',
    category: 'mixers',
    price: 1000,
    priceUnit: 'per day',
    available: 1,
    badge: 'Compact 6CH',
    desc: 'Professional 6-channel analog mixing console with EQ & phantom power for acoustic sets',
    specs: ['2 XLR Mic preamps with 48V phantom power', '2 Stereo line inputs', '3-Band British EQ per channel', 'Gold-plated balanced XLR outputs'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'sliders'
  },
  {
    id: 'mixer-12ch',
    name: 'Mixer 12 Channel',
    category: 'mixers',
    price: 2000,
    priceUnit: 'per day',
    available: 1,
    badge: 'Pro 12CH',
    desc: 'Full-featured 12-channel live mixer with on-board SPX digital effects and multiple aux sends',
    specs: ['6 XLR Mic inputs with 1-knob compressors', '24 High-resolution SPX digital effect programs', '2 Aux sends + 1 stereo subgroup', 'USB 2.0 24-bit/192kHz interface'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'sliders'
  },
  {
    id: 'digital-mixer-x32',
    name: 'Digital Mixing Console 32-Channel',
    category: 'mixers',
    price: 5500,
    priceUnit: 'per day',
    available: 1,
    badge: 'Studio Digital',
    desc: 'Industry-standard 40-input, 25-bus digital mixing console with motorized faders and full iPad remote mix control',
    specs: ['16 Fully programmable MIDAS microphone preamps', '17 Motorized 100mm faders', '8 Stereo FX engines (reverb, delay, dynamic EQ)', '32x32 USB multitrack recording capability'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'sliders'
  },
  {
    id: 'dj-controller',
    name: 'Pioneer 4-Channel DJ Controller',
    category: 'dj',
    price: 3500,
    priceUnit: 'per day',
    available: 1,
    badge: 'Pro DJ Console',
    desc: 'Professional 4-channel DJ performance controller with full-size jog wheels, track position display and Merge FX',
    specs: ['Full-size 206mm touch-capacitive jog wheels', 'Plug-and-play with Rekordbox & Serato DJ Pro', 'Jog Cutter scratch assistant & Sample Scratch', 'Dual USB ports for instant DJ handovers'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'sliders'
  },
  {
    id: 'cordless-mic-set',
    name: 'Cordless Mic Set of 2',
    category: 'mics',
    price: 750,
    priceUnit: '1 set / day',
    available: 1,
    badge: '1 set available',
    desc: 'Dual handheld wireless microphone system with digital receiver and anti-drop frequency',
    specs: ['UHF dual-channel true diversity receiver', 'Cardioid dynamic capsule with pop filter', 'Operating range: up to 80m line-of-sight', 'Up to 10 hours runtime on AA batteries'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'mic'
  },
  {
    id: 'shure-wire-mic',
    name: 'Shure Wire Mic',
    category: 'mics',
    price: 400,
    priceUnit: 'each / day',
    available: 2,
    badge: '2 available',
    desc: 'Industry standard dynamic wired microphone for vocals, instruments, and speech',
    specs: ['Unidirectional cardioid pickup pattern', 'Tailored frequency response: 50Hz to 15,000Hz', 'Internal shock mount minimizes handling noise', 'Includes 6m heavy duty XLR cable'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'mic'
  },
  {
    id: 'mic-sm-58',
    name: 'Mic SM 58',
    category: 'mics',
    price: 500,
    priceUnit: 'each / day',
    available: 4,
    badge: '4 available',
    desc: 'Legendary Shure SM58 vocal dynamic cardioid microphone for live performances',
    specs: ['The world standard live vocal microphone', 'Uniform cardioid pickup isolates main sound source', 'Built-in spherical wind and pop filter', 'Durable steel mesh grille and enamel-painted metal body'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'mic'
  },
  {
    id: 'shure-beta-58a',
    name: 'Shure Beta 58A Vocal Mic',
    category: 'mics',
    price: 700,
    priceUnit: 'each / day',
    available: 2,
    badge: 'Lead Vocalist Spec',
    desc: 'High-output supercardioid dynamic vocal mic tailored for warm vocals and maximum feedback rejection',
    specs: ['Supercardioid pattern for high gain before feedback', 'Neodymium magnet for high signal-to-noise ratio', 'Pneumatic shock mount system', 'Frequency response: 50Hz to 16,000Hz'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'mic'
  },
  {
    id: 'mic-stand',
    name: 'Boom Mic Stand',
    category: 'stands',
    price: 300,
    priceUnit: 'each / day',
    available: 3,
    badge: '3 available',
    desc: 'Heavy-duty adjustable boom microphone floor stand with stable tripod base',
    specs: ['Die-cast zinc base with rubber vibration dampening feet', 'Height adjustable: 900mm to 1600mm', 'Telescopic boom arm: 430mm to 740mm', 'Universal 5/8"-27 threading with 3/8" adapter'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'disc'
  },
  {
    id: 'small-mic-stand',
    name: 'Small Mic Stand / Amp Stand',
    category: 'stands',
    price: 200,
    priceUnit: 'each / day',
    available: 1,
    badge: '1 available',
    desc: 'Desktop / amplifier compact low-profile microphone stand',
    specs: ['Low profile heavy cast iron round base', 'Ideal for kick drums, guitar amp miking, desktop podcasts', 'Height adjustable: 280mm to 430mm', 'Anti-vibration rubber bottom rim'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'disc'
  },
  {
    id: 'guitar-stand',
    name: 'Guitar Stand',
    category: 'stands',
    price: 150,
    priceUnit: 'each / day',
    available: 2,
    badge: 'Universal A-frame',
    desc: 'Cushioned universal folding A-frame stand for acoustic, electric, and bass guitars',
    specs: ['Soft neoprene rubber padding protects guitar finish', 'Fold-flat design for rapid transit', 'Stepped base cradle fits wide acoustic and thin electric guitars', 'Non-slip rubber feet'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'music'
  },
  {
    id: 'xlr-cable',
    name: 'XLR Cable (10m Balanced)',
    category: 'cables',
    price: 300,
    priceUnit: 'each / day',
    available: 6,
    badge: 'Pro balanced',
    desc: 'Balanced oxygen-free copper XLR male to female audio patch cable',
    specs: ['100% Oxygen-Free Copper (OFC) conductors', 'Heavy-duty Neutrik-style metal connectors', 'Braided shielding blocks RF and EMI interference', 'Flexible tangle-free matte PVC jacket'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'zap'
  },
  {
    id: 'jack-to-jack',
    name: 'Jack to Jack Cable (6m TS)',
    category: 'cables',
    price: 250,
    priceUnit: 'each / day',
    available: 6,
    badge: '1/4" Instrument',
    desc: 'Low-noise shielded 1/4" mono instrument cable for guitars and keyboards',
    specs: ['6.35mm (1/4") Gold-tipped TS connectors', '20 AWG Ultra-low capacitance copper core', 'Dual shielding against hum and ground loops', 'Strain relief collar prevents cable fatigue'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'zap'
  },
  {
    id: 'sound-engineer',
    name: 'Sound Engineer & Acoustic Mix',
    category: 'service',
    price: 1500,
    priceUnit: 'event session',
    available: 1,
    badge: 'Live Pro Mixing',
    desc: 'Experienced live audio sound engineer to set up, calibrate acoustics, and mix your live gig',
    specs: ['Full venue sound check & EQ calibration', 'Live dynamic vocal and instrumental balance', 'On-stage monitor mix adjustment for performers', '4 to 6 hours live session coverage'],
    image: '/assets/venue/IMG20260727002410.jpg',
    icon: 'user'
  }
];

// 2. KESARI MEMBERSHIPS — Come for a coffee. Find your place.
// Space rate: ₹250/hr • Tea/Coffee: ₹120 each • Mon-Thu: 10am-6pm (8h), Fri: 10am-3pm (5h) = 37 hrs/week
export const KESARI_MEMBERSHIP_META = {
  headline: 'Come for a coffee. Find your place.',
  intro: "Some days you need somewhere to focus. Some days you need good food, meaningful conversations, or just a change of scene. At Kesari, you don't have to choose.",
  motto: 'Work here. Eat here. Meet here. Belong here.',
  hoursNote: 'Coworking Hours: Mon–Thu 10:00 AM – 6:00 PM · Fri 10:00 AM – 3:00 PM (37h/week)',
  spaceRatePerHour: 250,
  teaRateEach: 120,
  footerNote: 'Three ways to belong. One place to call yours.',
  terms: 'Monthly memberships. Personal beverage redemptions only. Regular Kesari-hosted community events included subject to RSVP and availability. Terms apply.'
};

export const MONTHLY_PASSES = [
  {
    id: 'pass-everyday',
    name: 'THE EVERYDAY',
    headline: 'A little more Kesari in your everyday life.',
    price: 3000,
    billing: '₹3,000 / month',
    tierTag: 'ESSENTIAL',
    popular: false,
    theme: 'everyday',
    workdays: '10 Workdays / month',
    workHoursTotal: '75+ Space Hours',
    spaceValue: 18750, // 75 hrs * ₹250
    teaCount: '15 Complimentary Teas / Coffees',
    teaValue: 1800, // 15 * ₹120
    diningCredit: '—',
    diningValue: 0,
    communityValue: 1500,
    totalValue: 22050,
    savingsText: 'Save ₹19,050 · 86% OFF',
    highlight: '10 workdays · 15 artisan teas/coffees · community events',
    perks: [
      '10 Workdays Access (Mon–Thu 10am–6pm, Fri 10am–3pm)',
      '15 Complimentary Artisan Teas or Coffees (₹120 value each)',
      'Acoustic Studio Desks & High-Speed Fiber WiFi',
      'Access to Regular Community Jam & Acoustic Evenings'
    ],
    valueBreakdown: [
      { label: 'Coworking Space (75 hrs @ ₹250/hr)', value: '₹18,750' },
      { label: '15 Teas / Specialty Coffees (@ ₹120 each)', value: '₹1,800' },
      { label: 'Community Events & Experiences', value: '₹1,500' }
    ]
  },
  {
    id: 'pass-ritual',
    name: 'THE RITUAL',
    headline: 'Make Kesari part of your routine.',
    price: 5000,
    billing: '₹5,000 / month',
    tierTag: 'MOST POPULAR',
    popular: true,
    theme: 'ritual',
    workdays: '20 Workdays / month (Full Month)',
    workHoursTotal: '150+ Space Hours',
    spaceValue: 37500, // 150 hrs * ₹250
    teaCount: '30 Complimentary Teas / Coffees (Daily)',
    teaValue: 3600, // 30 * ₹120
    diningCredit: '₹700 Café Dining Credit',
    diningValue: 700,
    communityValue: 2500,
    totalValue: 44300,
    savingsText: 'Save ₹39,300 · 89% OFF',
    highlight: '20 workdays · 30 teas/coffees · ₹700 dining credit · member privileges',
    perks: [
      '20 Full Workdays Access (Mon–Fri Coworking Schedule)',
      '30 Complimentary Teas or Coffees (1 Daily Craft Brew)',
      '₹700 Café Dining Credit for Artisanal Food & Bites',
      'Special Member Privileges & Priority Community Event RSVP',
      '10% Discount on Sound Equipment & Space Rental'
    ],
    valueBreakdown: [
      { label: 'Coworking Space (150 hrs @ ₹250/hr)', value: '₹37,500' },
      { label: '30 Teas / Specialty Coffees (@ ₹120 each)', value: '₹3,600' },
      { label: 'Café Food & Dining Credit', value: '₹700' },
      { label: 'Member Privileges & Community Access', value: '₹2,500' }
    ]
  },
  {
    id: 'pass-circle',
    name: 'THE CIRCLE',
    headline: 'For those who want Kesari to feel like their second home.',
    price: 7000,
    billing: '₹7,000 / month',
    tierTag: 'ULTIMATE VIP',
    popular: false,
    theme: 'circle',
    workdays: 'Unlimited Workdays (All Month)',
    workHoursTotal: '160+ Space Hours',
    spaceValue: 40000, // 160 hrs * ₹250
    teaCount: '60 Complimentary Teas / Coffees (2 Daily!)',
    teaValue: 7200, // 60 * ₹120 — tea alone exceeds ₹7,000!
    diningCredit: '₹2,000 Café Dining Credit',
    diningValue: 2000,
    communityValue: 4500,
    totalValue: 53700,
    savingsText: 'Save ₹46,700 · 87% OFF',
    highlight: 'Unlimited workdays · 60 teas/coffees · ₹2,000 dining credit · VIP guest access',
    perks: [
      'Unlimited Workdays during Café Coworking Hours',
      '60 Complimentary Teas or Coffees (₹7,200 value alone!)',
      '₹2,000 Café Dining Credit for Meals & Beverages',
      'Priority Event Reservations & VIP Seating',
      'Guest Privileges (Bring collaborators & friends to cowork)',
      'Free 2 Hours Studio Jam / Recording Room Access'
    ],
    valueBreakdown: [
      { label: 'Unlimited Coworking Space (160+ hrs @ ₹250/hr)', value: '₹40,000' },
      { label: '60 Teas / Specialty Coffees (@ ₹120 each)', value: '₹7,200' },
      { label: 'Café Food & Dining Credit', value: '₹2,000' },
      { label: 'Guest Privileges & VIP Studio Access', value: '₹4,500' }
    ]
  }
];

// 3. Space Rental Options at Kesari The Memory Studio, Koramangala
export const SPACE_RENTALS = [
  {
    id: 'main-studio-hall',
    title: 'Main Studio Hall',
    capacity: '40 - 60 Guests',
    hourlyRate: '₹1,500 / hr',
    idealFor: 'Live Gigs, Workshops, Standup Comedy, Poetry, Acoustic Concerts',
    amenities: 'Stage lighting, acoustic wall panels, Yamaha PA system, seating rows',
    image: '/assets/events/kesari_stage_inside.jpg'
  },
  {
    id: 'acoustic-jam-lounge',
    title: 'Acoustic Jam Room & Lounge',
    capacity: '8 - 15 Guests',
    hourlyRate: '₹800 / hr',
    idealFor: 'Band Jamming, Podcasts, Vocal Tracking, Intimate Jam Circles',
    amenities: 'Guitar amps, vocal mics, drum rug, mood lighting, plush couches',
    image: '/assets/venue/IMG20260718173645.jpg'
  },
  {
    id: 'full-studio-buyout',
    title: 'Full Studio Private Buyout',
    capacity: 'Up to 75 Guests',
    hourlyRate: 'Half Day: ₹8,000 • Full Day: ₹14,000',
    idealFor: 'Private Parties, Corporate Offsites, Music Video Shoots, Popups',
    amenities: 'Exclusive access to entire studio, sound technician, lounge & green room',
    image: '/assets/events/kesari_stage_inside.jpg'
  }
];

// 4. Organise Event Categories
export const EVENT_ORGANISER_CATEGORIES = [
  { id: 'music', label: 'Music Event / Gig', icon: '🎸' },
  { id: 'workshop', label: 'Workshop & Meetup', icon: '🎨' },
  { id: 'standup', label: 'Standup & Open Mic', icon: '🎤' },
  { id: 'private', label: 'Private Gathering / Party', icon: '🎉' },
  { id: 'jam', label: 'Jam Session / Rehearsal', icon: '🥁' }
];
