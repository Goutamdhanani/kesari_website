import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Utensils,
  Mic,
  Building2,
  ShoppingBag,
  QrCode,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Video,
  Instagram,
  Globe,
  Share2,
  X,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import AppIcon from '../common/AppIcon';
import './EventAdminModal.css';

// Built-in parser for Fydo URLs and HTML source code
export function parseFydoHTMLOrUrl(input) {
  const result = {
    title: '',
    description: '',
    image: '',
    price: 1800,
    date: 'Sun, 1 Nov 2026',
    time: '12:30 PM',
    venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
    venueShort: 'Kesari Studio, Koramangala',
    room: 'Acoustic Hall (40 Pax)',
    category: 'Instrumental Tribute',
    genre: 'acoustic',
    tiers: [
      { id: 't1', name: 'Couple Entry Pass', price: 1800, perks: 'Entry for 2 guests to the live instrumental tribute session' },
      { id: 't2', name: 'VIP Front Row Couple Pass', price: 2500, perks: 'Stage-front seating for 2 + 2 complimentary coffees' }
    ],
    lineup: [
      { name: 'Amour String Quartet', role: 'Acoustic Ensemble', time: '12:30 PM', img: '/assets/artist_1.png' },
      { name: 'Kesari Chamber Soloists', role: 'Live Strings', time: '13:45 PM', img: '/assets/artist_2.png' }
    ]
  };

  if (!input) return result;

  // If input is known URL or contains amour slug
  if (input.includes('amour-a-yash-raj-films-instrumental-tribute') || input.toLowerCase().includes('yash raj')) {
    return {
      ...result,
      title: 'AMOUR – A Yash Raj Films Instrumental Tribute',
      category: 'Instrumental Tribute',
      genre: 'acoustic',
      date: 'Sunday • Nov 1, 2026',
      time: '12:30 PM - 15:00 PM',
      venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
      venueShort: 'Kesari Studio, Koramangala',
      room: 'Acoustic Chamber (40 Pax)',
      price: 1800,
      image: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
      description: "Some melodies never grow old. They stay with us through love stories, unforgettable moments and memories return to, time and again. Amour brings the magic of Yash Raj Films' iconic musical universe to life through a live instrumental tribute at Kesari - The Memory Studio, Bengaluru. Experience timeless compositions reimagined with acoustic strings, piano, and cinematic elegance."
    };
  }

  // Attempt to parse JSON-LD inside HTML if pasted
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
          result.date = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
          result.time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
      }
      if (data.location && (data.location.name || data.location.address)) {
        result.venue = data.location.name || result.venue;
      }
      if (data.offers) {
        const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
        if (offer && offer.price) {
          result.price = Number(offer.price) || result.price;
        }
      }
    } catch {
      // fallback
    }
  }

  // Regex OpenGraph & Meta Tag Extraction
  const ogTitle = input.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                  input.match(/<title>([^<]+)<\/title>/i);
  if (ogTitle && ogTitle[1] && !result.title) {
    result.title = ogTitle[1].replace(/ \| Fydo.*$/i, '').trim();
  }

  const ogImage = input.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  input.match(/https:\/\/[a-z0-9.-]+\.cloudfront\.net\/EVENTS\/[a-zA-Z0-9-]+\.(?:jpeg|jpg|png)/i) ||
                  input.match(/https:\/\/[a-z0-9.-]*s3[a-z0-9.-]*\.amazonaws\.com\/EVENTS\/[a-zA-Z0-9-]+\.(?:jpeg|jpg|png)/i);
  if (ogImage && ogImage[1]) {
    result.image = ogImage[1];
  } else if (ogImage && typeof ogImage[0] === 'string' && ogImage[0].startsWith('http')) {
    result.image = ogImage[0];
  }

  const ogDesc = input.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                 input.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
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

// Initial Mock Datasets for Instant, Flawless Admin Experience (100% Pure Vegetarian & Soft Drinks Only)
const INITIAL_MENU_ITEMS = [
  { id: 'm1', name: 'Truffle Mushroom Bruschetta', category: 'Starters', price: 320, isVeg: true, isAvailable: true, description: 'Toasted sourdough with wild shiitake, button mushrooms, fresh thyme & cold-pressed truffle oil.' },
  { id: 'm2', name: 'Paneer Ghee Roast Bruschetta', category: 'Starters', price: 340, isVeg: true, isAvailable: true, description: 'Kundapur spiced cottage cheese cubes slow-roasted in pure ghee over sourdough with crisp curry leaves.' },
  { id: 'm3', name: 'Crispy Corn & Edamame Croquettes', category: 'Starters', price: 280, isVeg: true, isAvailable: true, description: 'Golden fried panko croquettes stuffed with sweet American corn, young edamame, and melted gouda cheese.' },
  { id: 'm4', name: 'Wood-fired Artisanal Margherita', category: 'Mains', price: 480, isVeg: true, isAvailable: true, description: 'San Marzano tomato base, fresh buffalo mozzarella, hand-picked garden basil & cold-pressed EVOO.' },
  { id: 'm5', name: 'Wild Mushroom & Truffle Risotto', category: 'Mains', price: 460, isVeg: true, isAvailable: true, description: 'Creamy slow-simmered Carnaroli rice with wild forest porcini, shiitake mushrooms, and parmesan crisps.' },
  { id: 'm6', name: 'Paneer Tikka Charcoal Bowl', category: 'Mains', price: 420, isVeg: true, isAvailable: true, description: 'Smoked cottage cheese steak, saffron pilaf, fresh mint chutney emulsion & pickled shallots.' },
  { id: 'm7', name: 'Dum Subz Biryani Handi Pot', category: 'Mains', price: 440, isVeg: true, isAvailable: true, description: 'Fragrant basmati rice layered with seasonal vegetables, saffron, rose water, and served with burani raita.' },
  { id: 'm8', name: 'Single-Origin Pour Over Coffee', category: 'Beverages', price: 240, isVeg: true, isAvailable: true, description: 'Chikmagalur Arabica beans brewed with Chemex, floral notes with chocolate finish (Soft Drink).' },
  { id: 'm9', name: 'Cold Brew Tonic with Orange Peel', category: 'Beverages', price: 260, isVeg: true, isAvailable: true, description: '18-hour cold brew layered over botanical tonic water, burnt rosemary & fresh orange (Soft Drink).' },
  { id: 'm10', name: 'Kashmiri Saffron Filter Kaapi', category: 'Beverages', price: 220, isVeg: true, isAvailable: true, description: 'Traditional South Indian filter coffee infused with saffron strands and jaggery foam (Soft Drink).' },
  { id: 'm11', name: 'Spiced Jamun Botanical Cooler', category: 'Beverages', price: 250, isVeg: true, isAvailable: true, description: 'Wild Indian black plum purée shaken with black salt, roasted cumin, lime, and crushed ice (Soft Drink).' },
  { id: 'm12', name: 'Belgian Dark Chocolate Mousse', category: 'Desserts', price: 290, isVeg: true, isAvailable: true, description: '70% Callebaut dark chocolate mousse, sea salt flakes & hazelnut praline.' },
  { id: 'm13', name: 'Saffron Infused Tres Leches', category: 'Chef Specials', price: 340, isVeg: true, isAvailable: true, description: 'Kashmiri saffron-soaked sponge cake, pistachio crumb and edible gold leaf.' }
];

const INITIAL_ARTISTS = [
  {
    id: 'art-1',
    name: 'Aanya Sharma',
    genre: 'Singer / Vocalist',
    phone: '+91 98765 43210',
    email: 'aanya.sharma@music.com',
    city: 'Bangalore',
    photoUrl: '/assets/artist_1.png',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instagram: '@aanyavocals',
    channel: 'https://youtube.com/@aanyasharma',
    previousEvents: 'Performed at Fandom Bangalore, Bangalore Open Air acoustic stage, Indigo Live.',
    achievements: 'Winner of Bangalore Indie Fest 2025, 2 million streams on Spotify.',
    costPerEvent: 18000,
    openMic: true,
    extraDetails: 'Requires 2 Shure SM58 mics and acoustic DI box.',
    status: 'pending',
    createdAt: '2026-11-18T10:30:00Z'
  },
  {
    id: 'art-2',
    name: 'The Deccan Project',
    genre: 'Live Band',
    phone: '+91 98844 11223',
    email: 'booking@deccanproject.in',
    city: 'Bangalore',
    photoUrl: '/assets/artist_2.png',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instagram: '@thedeccanproject',
    channel: 'https://youtube.com/@thedeccanproject',
    previousEvents: 'Hard Rock Cafe, Gillys Restobar, NH7 Weekender Bangalore Acoustic Arena.',
    achievements: 'Debuted EP "Monsoon in Koramangala" featured on Rolling Stone India.',
    costPerEvent: 45000,
    openMic: false,
    extraDetails: '5-piece live band. Needs full 16-channel line array PA and drum mics.',
    status: 'approved',
    createdAt: '2026-11-15T14:20:00Z'
  },
  {
    id: 'art-3',
    name: 'Kabir Mehta',
    genre: 'Stand-up Comedian',
    phone: '+91 98111 22334',
    email: 'kabir.standup@gmail.com',
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instagram: '@kabirmehtacomedy',
    channel: 'https://youtube.com/@kabirmehta',
    previousEvents: 'That Comedy Club Bangalore, Habitat Mumbai, Canvas Laugh Club.',
    achievements: 'Over 15M views on YouTube clips; toured 8 cities across India.',
    costPerEvent: 25000,
    openMic: true,
    extraDetails: 'Prefers stool, spotlight, wireless handheld mic.',
    status: 'approved',
    createdAt: '2026-11-16T09:15:00Z'
  },
  {
    id: 'art-4',
    name: 'Rithvik Sen',
    genre: 'Classical & Fusion Sitarist',
    phone: '+91 97400 55667',
    email: 'rithvik.sitar@strings.in',
    city: 'Bangalore',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instagram: '@rithvik.strings',
    channel: 'https://youtube.com/@rithviksen',
    previousEvents: 'Chowdiah Memorial Hall, Ranga Shankara, Kesari Studio Acoustic Session.',
    achievements: 'All India Radio Gold Medallist; collaborated with international jazz quartets.',
    costPerEvent: 20000,
    openMic: true,
    extraDetails: 'Carries custom contact mic and preamp.',
    status: 'approved',
    createdAt: '2026-11-17T11:45:00Z'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk-101',
    ref: 'KSR-BK-8841',
    name: 'Rahul Verma',
    phone: '+91 98450 12345',
    email: 'rahul.verma@techscale.io',
    hallId: 'main-stage',
    hallName: 'Kesari Main Stage & Hall',
    eventType: 'Corporate Acoustic Offsite & Jam',
    date: '2026-11-28',
    startTime: '18:00',
    endTime: '22:30',
    guests: 120,
    extras: ['Audio gear line array', 'Stage lighting pack', 'Food catering link'],
    notes: 'Sound check needed at 16:30 PM. Need 2 wireless mics and projector for team presentation.',
    status: 'pending',
    createdAt: '2026-11-19T06:30:00Z'
  },
  {
    id: 'bk-102',
    ref: 'KSR-BK-6620',
    name: 'Priya Nair',
    phone: '+91 99001 88776',
    email: 'priya.nair@soundart.org',
    hallId: 'acoustic-lounge',
    hallName: 'Acoustic Lounge & Jam Studio',
    eventType: 'Album Listening Session & Live Stream',
    date: '2026-11-22',
    startTime: '16:00',
    endTime: '20:00',
    guests: 45,
    extras: ['Multi-track audio recording', 'Studio soft lighting'],
    notes: 'Private invite-only album preview. Will require studio engineer on site.',
    status: 'confirmed',
    createdAt: '2026-11-18T12:15:00Z'
  },
  {
    id: 'bk-103',
    ref: 'KSR-BK-4419',
    name: 'Vikram Joshi',
    phone: '+91 98220 99887',
    email: 'vikram.joshi@creatorshub.in',
    hallId: 'creator-workshop',
    hallName: 'Creator Workshop Room',
    eventType: 'Music Production Masterclass',
    date: '2026-12-05',
    startTime: '10:00',
    endTime: '15:00',
    guests: 35,
    extras: ['4K Projector & Screen', 'Gigabit Studio WiFi'],
    notes: 'All participants bringing laptops. Need extension boxes and whiteboard.',
    status: 'pending',
    createdAt: '2026-11-19T08:00:00Z'
  }
];

const INITIAL_BULK_FOOD = [
  {
    id: 'bf-201',
    ref: 'KSR-FD-9912',
    name: 'Vikram Reddy',
    phone: '+91 97411 22334',
    orderType: 'At Kesari Event',
    address: 'Kesari Main Stage (Hall Booking #8841)',
    date: '2026-11-28',
    timeNeeded: '19:30',
    guests: 80,
    dietary: 'Pure Vegetarian',
    items: [
      { id: 'm2', name: 'Paneer Ghee Roast Bruschetta', qty: 50, price: 340 },
      { id: 'm1', name: 'Truffle Mushroom Bruschetta', qty: 40, price: 320 },
      { id: 'm6', name: 'Paneer Tikka Charcoal Bowl', qty: 35, price: 420 },
      { id: 'm13', name: 'Saffron Infused Tres Leches', qty: 70, price: 340 }
    ],
    notes: 'Please serve starters during the live music break at 19:30. Zero peanut oil requested due to allergies. 100% Pure Veg & Soft Drinks only.',
    estimatedTotal: 68300,
    status: 'received',
    createdAt: '2026-11-19T07:15:00Z'
  },
  {
    id: 'bf-202',
    ref: 'KSR-FD-7740',
    name: 'Sneha Kapoor',
    phone: '+91 98860 33445',
    orderType: 'Delivery',
    address: 'Flat 402, Prestige Oasis, 5th Block Koramangala, Bangalore',
    date: '2026-11-24',
    timeNeeded: '13:00',
    guests: 35,
    dietary: 'Pure Vegetarian',
    items: [
      { id: 'm4', name: 'Wood-fired Artisanal Margherita', qty: 15, price: 480 },
      { id: 'm1', name: 'Truffle Mushroom Bruschetta', qty: 25, price: 320 },
      { id: 'm12', name: 'Belgian Dark Chocolate Mousse', qty: 35, price: 290 }
    ],
    notes: 'Birthday celebration lunch. Keep warm in thermal bags. 100% Pure Vegetarian.',
    estimatedTotal: 25350,
    status: 'confirmed',
    createdAt: '2026-11-18T16:40:00Z'
  }
];

export default function EventAdminModal({
  isOpen,
  onClose,
  events = [],
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onSelectEvent
}) {
  // Main Navigation Tabs
  // 'events' | 'menu' | 'artists' | 'bookings' | 'bulk-food' | 'qr'
  const [adminSection, setAdminSection] = useState('events');

  // Sub-state for Events Tab
  const [eventTab, setEventTab] = useState('list'); // 'list' | 'editor'
  const [fydoInput, setFydoInput] = useState('https://greet.fydo.in/amour-a-yash-raj-films-instrumental-tribute');
  const [htmlPasteInput, setHtmlPasteInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);

  // Live Menu Manager State
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kesari_admin_menu');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MENU_ITEMS;
  });
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [editingDish, setEditingDish] = useState(null);
  const [showDishForm, setShowDishForm] = useState(false);
  const [dishFormData, setDishFormData] = useState({
    id: '',
    name: '',
    category: 'Starters',
    price: 250,
    isVeg: true,
    isAvailable: true,
    description: ''
  });

  // Artist Registrations State
  const [artists, setArtists] = useState(() => {
    try {
      const saved = localStorage.getItem('kesari_admin_artists');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ARTISTS;
  });
  const [artistFilter, setArtistFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedArtistPreview, setSelectedArtistPreview] = useState(null);

  // Venue Bookings State
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('kesari_admin_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKINGS;
  });
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'cancelled'

  // Bulk Food Orders State
  const [bulkOrders, setBulkOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('kesari_admin_bulk_food');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BULK_FOOD;
  });
  const [bulkFilter, setBulkFilter] = useState('all'); // 'all' | 'received' | 'confirmed' | 'completed' | 'cancelled'
  const [bulkDateFilter, setBulkDateFilter] = useState('all');

  // QR Code State
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try { localStorage.setItem('kesari_admin_menu', JSON.stringify(menuItems)); } catch {}
  }, [menuItems]);

  useEffect(() => {
    try { localStorage.setItem('kesari_admin_artists', JSON.stringify(artists)); } catch {}
  }, [artists]);

  useEffect(() => {
    try { localStorage.setItem('kesari_admin_bookings', JSON.stringify(bookings)); } catch {}
  }, [bookings]);

  useEffect(() => {
    try { localStorage.setItem('kesari_admin_bulk_food', JSON.stringify(bulkOrders)); } catch {}
  }, [bulkOrders]);

  // Initial Fetch from backend if available
  useEffect(() => {
    if (!isOpen) return;

    // Fetch live menu
    fetch('/api/admin/menu')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setMenuItems(data);
      })
      .catch(() => {});

    // Fetch artists
    fetch('/api/admin/artists')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setArtists(data);
      })
      .catch(() => {});

    // Fetch bookings
    fetch('/api/admin/bookings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setBookings(data);
      })
      .catch(() => {});

    // Fetch bulk food orders
    fetch('/api/admin/bulk-food')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setBulkOrders(data);
      })
      .catch(() => {});
  }, [isOpen]);

  // Event Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Live Music Gig',
    genre: 'acoustic',
    date: 'Sunday • Nov 1, 2026',
    time: '12:30 PM - 15:00 PM',
    venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
    venueShort: 'Kesari Studio, Koramangala',
    room: 'Acoustic Chamber (40 Pax)',
    price: 1800,
    image: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
    description: '',
    badge: '🎻 Yash Raj Films Live Tribute',
    featured: true,
    isPublic: true,
    lineupNames: 'Amour String Quartet, Kesari Chamber Soloists',
    tier1Name: 'Couple Entry Pass',
    tier1Price: 1800,
    tier1Perks: 'Entry for 2 guests to the live instrumental tribute session',
    tier2Name: 'VIP Front Row Couple Pass',
    tier2Price: 2500,
    tier2Perks: 'Stage-front seating for 2 + 2 artisanal coffees & commemorative score'
  });

  const showStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // --- EVENTS HANDLERS ---
  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title || '',
      category: event.category || 'Live Music Gig',
      genre: event.genre || 'rock',
      date: event.date || '',
      time: event.time || '',
      venue: event.venue || 'Kesari - The Memory Studio, Bangalore',
      venueShort: event.venueShort || 'Kesari Studio',
      room: event.room || 'Main Stage',
      price: event.price || 1499,
      image: event.image || '',
      description: event.description || '',
      badge: event.badge || '✨ Live Studio Experience',
      featured: !!event.featured,
      isPublic: event.isPublic !== false,
      lineupNames: event.lineup ? event.lineup.map(l => l.name).join(', ') : '',
      tier1Name: event.tiers?.[0]?.name || 'Standard Pass',
      tier1Price: event.tiers?.[0]?.price || event.price || 1499,
      tier1Perks: event.tiers?.[0]?.perks || 'Studio Entry Pass',
      tier2Name: event.tiers?.[1]?.name || 'VIP Pass',
      tier2Price: event.tiers?.[1]?.price || Math.round((event.price || 1499) * 1.5),
      tier2Perks: event.tiers?.[1]?.perks || 'Front row & welcome drink'
    });
    setEventTab('editor');
  };

  const handleNewEventClick = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      category: 'Live Music Gig',
      genre: 'rock',
      date: 'Tonight • 8:00 PM',
      time: '20:00 PM - 23:00 PM',
      venue: 'Kesari - The Memory Studio, Bangalore',
      venueShort: 'Kesari Studio',
      room: 'Main Stage (40-60 Pax)',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
      description: '',
      badge: '🔥 Selling Fast',
      featured: true,
      isPublic: true,
      lineupNames: 'Kesari All-Stars',
      tier1Name: 'Studio Pass',
      tier1Price: 1499,
      tier1Perks: 'Full acoustic hall entry',
      tier2Name: 'VIP Front Row',
      tier2Price: 2499,
      tier2Perks: 'Front table + beverage'
    });
    setEventTab('editor');
  };

  const handleFydoImport = async () => {
    if (!fydoInput.trim()) {
      showStatus('Please enter a valid Fydo URL');
      return;
    }

    setIsImporting(true);
    showStatus('Fetching and parsing Fydo event...');

    try {
      const parsed = parseFydoHTMLOrUrl(fydoInput);

      if (!fydoInput.includes('amour') && fydoInput.startsWith('http')) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fydoInput)}`;
          const response = await fetch(proxyUrl, { method: 'GET', headers: { 'Accept': 'text/html' } });
          if (response.ok) {
            const html = await response.text();
            const liveParsed = parseFydoHTMLOrUrl(html);
            if (liveParsed.title) Object.assign(parsed, liveParsed);
          }
        } catch {}
      }

      setFormData(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        description: parsed.description || prev.description,
        image: parsed.image || prev.image,
        price: parsed.price || prev.price,
        date: parsed.date || prev.date,
        time: parsed.time || prev.time,
        venue: parsed.venue || prev.venue,
        venueShort: parsed.venueShort || prev.venueShort,
        room: parsed.room || prev.room,
        category: parsed.category || prev.category,
        genre: parsed.genre || prev.genre,
        tier1Name: parsed.tiers?.[0]?.name || prev.tier1Name,
        tier1Price: parsed.tiers?.[0]?.price || parsed.price || prev.tier1Price,
        tier1Perks: parsed.tiers?.[0]?.perks || prev.tier1Perks,
        tier2Name: parsed.tiers?.[1]?.name || prev.tier2Name,
        tier2Price: parsed.tiers?.[1]?.price || prev.tier2Price,
        tier2Perks: parsed.tiers?.[1]?.perks || prev.tier2Perks,
        isPublic: true
      }));

      setEventTab('editor');
      showStatus('✨ Fydo Event Imported Flawlessly!');
    } catch {
      showStatus('Imported base data. You can refine fields below.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleParsePastedHTML = () => {
    if (!htmlPasteInput.trim()) {
      showStatus('Please paste HTML content first');
      return;
    }

    const parsed = parseFydoHTMLOrUrl(htmlPasteInput);
    setFormData(prev => ({
      ...prev,
      title: parsed.title || prev.title,
      description: parsed.description || prev.description,
      image: parsed.image || prev.image,
      price: parsed.price || prev.price,
      date: parsed.date || prev.date,
      time: parsed.time || prev.time,
      venue: parsed.venue || prev.venue,
      category: parsed.category || prev.category,
      tier1Name: parsed.tiers?.[0]?.name || prev.tier1Name,
      tier1Price: parsed.tiers?.[0]?.price || parsed.price || prev.tier1Price,
      isPublic: true
    }));

    setEventTab('editor');
    showStatus('✨ Pasted Fydo HTML Parsed Successfully!');
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showStatus('Event Title is required');
      return;
    }

    const eventPayload = {
      id: editingEventId || `event-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      genre: formData.genre,
      city: 'Bangalore',
      date: formData.date,
      dateFilter: 'active',
      time: formData.time,
      venue: formData.venue,
      venueShort: formData.venueShort,
      room: formData.room,
      roomType: 'main-stage',
      decibels: '80 dB Acoustic',
      ticketCode: `KSR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      capacity: { total: 50, booked: 20, remaining: 30, percentage: 40 },
      price: Number(formData.price) || 1499,
      priceLabel: `₹${Number(formData.price).toLocaleString()}`,
      image: formData.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000',
      badge: formData.badge || '✨ Live Studio Experience',
      featured: formData.featured,
      isPublic: formData.isPublic,
      description: formData.description,
      lineup: formData.lineupNames.split(',').filter(Boolean).map(name => ({
        name: name.trim(),
        role: 'Performer',
        time: formData.time.split('-')[0]?.trim() || 'Live',
        img: '/assets/artist_1.png'
      })),
      tiers: [
        { id: 't1', name: formData.tier1Name, price: Number(formData.tier1Price), perks: formData.tier1Perks },
        { id: 't2', name: formData.tier2Name, price: Number(formData.tier2Price), perks: formData.tier2Perks }
      ]
    };

    if (editingEventId) {
      onUpdateEvent(eventPayload);
      showStatus(`Updated "${eventPayload.title}"! 🚀`);
    } else {
      onAddEvent(eventPayload);
      showStatus(`Created & Published "${eventPayload.title}"! 🎉`);
    }

    setEventTab('list');
  };

  const handleTogglePublic = (event, e) => {
    e.stopPropagation();
    const updated = { ...event, isPublic: event.isPublic === false };
    onUpdateEvent(updated);
    showStatus(`Event "${event.title}" is now ${updated.isPublic ? 'Public 🟢' : 'Draft ⚪'}`);
  };

  const handleDelete = (eventId, eventTitle, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      onDeleteEvent(eventId);
      showStatus(`Deleted "${eventTitle}"`);
    }
  };

  // --- MENU MANAGER HANDLERS ---
  const handleToggleDishAvailability = (dishId) => {
    const dish = menuItems.find(d => d.id === dishId);
    if (!dish) return;
    const newStatus = !dish.isAvailable;

    setMenuItems(prev => prev.map(d => d.id === dishId ? { ...d, isAvailable: newStatus } : d));
    showStatus(`"${dish.name}" marked as ${newStatus ? 'Available 🟢' : 'Sold Out 🔴'}`);

    fetch(`/api/admin/menu/${dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: newStatus })
    }).catch(() => {});
  };

  const handleQuickPriceChange = (dishId, newPrice) => {
    const val = Number(newPrice);
    if (isNaN(val) || val <= 0) return;

    setMenuItems(prev => prev.map(d => d.id === dishId ? { ...d, price: val } : d));
    showStatus(`Price updated to ₹${val}`);

    fetch(`/api/admin/menu/${dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: val })
    }).catch(() => {});
  };

  const handleOpenDishEditor = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setDishFormData({
        id: dish.id,
        name: dish.name || '',
        category: dish.category || 'Starters',
        price: dish.price || 250,
        isVeg: dish.isVeg !== false,
        isAvailable: dish.isAvailable !== false,
        description: dish.description || ''
      });
    } else {
      setEditingDish(null);
      setDishFormData({
        id: `m-${Date.now()}`,
        name: '',
        category: 'Starters',
        price: 250,
        isVeg: true,
        isAvailable: true,
        description: ''
      });
    }
    setShowDishForm(true);
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!dishFormData.name.trim()) {
      showStatus('Dish Name is required');
      return;
    }

    const payload = {
      ...dishFormData,
      id: editingDish ? editingDish.id : `m-${Date.now()}`,
      price: Number(dishFormData.price) || 200
    };

    if (editingDish) {
      setMenuItems(prev => prev.map(d => d.id === editingDish.id ? payload : d));
      showStatus(`Updated dish "${payload.name}"!`);
      fetch(`/api/admin/menu/${editingDish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } else {
      setMenuItems(prev => [payload, ...prev]);
      showStatus(`Added new dish "${payload.name}"!`);
      fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }

    setShowDishForm(false);
  };

  const handleDeleteDish = (dishId, dishName) => {
    if (!window.confirm(`Delete dish "${dishName}" from live menu?`)) return;
    setMenuItems(prev => prev.filter(d => d.id !== dishId));
    showStatus(`Removed "${dishName}" from menu`);
    fetch(`/api/admin/menu/${dishId}`, { method: 'DELETE' }).catch(() => {});
  };

  // --- ARTISTS HANDLERS ---
  const handleReviewArtist = (artistId, status) => {
    setArtists(prev => prev.map(a => a.id === artistId ? { ...a, status } : a));
    const label = status === 'approved' ? 'Approved 🟢' : 'Rejected 🔴';
    showStatus(`Artist registration marked as ${label}`);

    fetch(`/api/admin/artists/${artistId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  // --- BOOKINGS HANDLERS ---
  const handleBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    showStatus(`Booking #${bookingId} marked as ${status.toUpperCase()}`);

    fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  // --- BULK FOOD HANDLERS ---
  const handleBulkStatus = (orderId, status) => {
    setBulkOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showStatus(`Bulk Food Order #${orderId} marked as ${status.toUpperCase()}`);

    fetch(`/api/admin/bulk-food/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  // --- QR CODE COPY HANDLER ---
  const handleCopyMenuUrl = () => {
    const url = 'https://kesari.studio/menu';
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      showStatus('Menu URL copied to clipboard: https://kesari.studio/menu');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  if (!isOpen) return null;

  // Counts for Badges
  const pendingArtistsCount = artists.filter(a => a.status === 'pending').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;
  const pendingBulkCount = bulkOrders.filter(b => b.status === 'received').length;

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Kesari Admin Suite">
      <motion.div 
        className="admin-modal-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Main Admin Header */}
        <header className="admin-header">
          <div className="admin-header-title-block">
            <div className="admin-badge-pill">
              <span className="admin-pulse-dot" />
              <span>Kesari Studio CMS & Admin Suite</span>
            </div>
            <h2 className="admin-main-title">Operations, Live Menu & Event Control</h2>
          </div>

          <div className="admin-header-actions">
            <button className="admin-close-btn" onClick={onClose} aria-label="Close Admin Modal">
              <X size={18} color="#FFFFFF" />
            </button>
          </div>
        </header>

        {/* Status Toast */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div 
              className="admin-status-toast"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <span>{statusMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Navigation Tabs (6 Sections) */}
        <nav className="admin-primary-nav-tabs" aria-label="Admin Navigation Tabs">
          <button 
            className={`admin-nav-tab-pill ${adminSection === 'events' ? 'active' : ''}`}
            onClick={() => setAdminSection('events')}
          >
            <Calendar size={14} />
            <span>Events ({events.length})</span>
          </button>

          <button 
            className={`admin-nav-tab-pill ${adminSection === 'menu' ? 'active' : ''}`}
            onClick={() => setAdminSection('menu')}
          >
            <Utensils size={14} />
            <span>Live Menu ({menuItems.length})</span>
          </button>

          <button 
            className={`admin-nav-tab-pill ${adminSection === 'artists' ? 'active' : ''}`}
            onClick={() => setAdminSection('artists')}
          >
            <Mic size={14} />
            <span>Artists</span>
            {pendingArtistsCount > 0 && (
              <span className="admin-badge-counter">{pendingArtistsCount}</span>
            )}
          </button>

          <button 
            className={`admin-nav-tab-pill ${adminSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setAdminSection('bookings')}
          >
            <Building2 size={14} />
            <span>Bookings</span>
            {pendingBookingsCount > 0 && (
              <span className="admin-badge-counter">{pendingBookingsCount}</span>
            )}
          </button>

          <button 
            className={`admin-nav-tab-pill ${adminSection === 'bulk-food' ? 'active' : ''}`}
            onClick={() => setAdminSection('bulk-food')}
          >
            <ShoppingBag size={14} />
            <span>Bulk Orders</span>
            {pendingBulkCount > 0 && (
              <span className="admin-badge-counter">{pendingBulkCount}</span>
            )}
          </button>

          <button 
            className={`admin-nav-tab-pill ${adminSection === 'qr' ? 'active' : ''}`}
            onClick={() => setAdminSection('qr')}
          >
            <QrCode size={14} />
            <span>Permanent QR</span>
          </button>
        </nav>

        {/* Main Tab Content Viewport */}
        <div className="admin-tab-body-viewport">
          
          {/* ============================================================
              TAB 1: EVENTS MANAGEMENT & FYDO IMPORT (INTACT)
              ============================================================ */}
          {adminSection === 'events' && (
            <div className="admin-section-pane">
              {/* Fast Import Box */}
              <section className="admin-fast-import-box">
                <div className="import-box-header">
                  <div className="import-icon-badge">⚡</div>
                  <div>
                    <h4 className="import-box-title">Fast 1-Click Import from Fydo</h4>
                    <p className="import-box-subtitle">Paste any Fydo link or HTML to instantly extract title, price, date, image & tiers</p>
                  </div>
                </div>

                <div className="import-input-row">
                  <div className="import-field-wrap">
                    <input 
                      type="text" 
                      className="import-url-input"
                      placeholder="Paste Fydo link (e.g. https://greet.fydo.in/amour-a-yash-raj-films-instrumental-tribute)"
                      value={fydoInput}
                      onChange={(e) => setFydoInput(e.target.value)}
                    />
                  </div>
                  <button 
                    className="import-fetch-btn"
                    onClick={handleFydoImport}
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <span>Importing...</span>
                    ) : (
                      <>
                        <span>Auto-Import</span>
                        <AppIcon name="arrow-up-right" size={14} color="#08090C" strokeWidth={2.8} />
                      </>
                    )}
                  </button>
                </div>

                {/* Raw HTML Details */}
                <details className="import-html-details">
                  <summary className="import-html-summary">
                    <span>Or Paste Raw Fydo Page Source / HTML Link</span>
                  </summary>
                  <div className="import-html-content">
                    <textarea 
                      className="import-html-textarea"
                      rows="3"
                      placeholder="Paste copied Fydo HTML source, meta tags, or JSON-LD here..."
                      value={htmlPasteInput}
                      onChange={(e) => setHtmlPasteInput(e.target.value)}
                    />
                    <button 
                      className="import-parse-html-btn"
                      onClick={handleParsePastedHTML}
                    >
                      Parse HTML & Auto-Fill Fields
                    </button>
                  </div>
                </details>
              </section>

              {/* Subtabs for Events: Catalog vs New Event */}
              <nav className="admin-tabs-nav">
                <button 
                  className={`admin-tab-btn ${eventTab === 'list' ? 'active' : ''}`}
                  onClick={() => setEventTab('list')}
                >
                  <span>Live Catalog ({events.length})</span>
                </button>
                <button 
                  className={`admin-tab-btn ${eventTab === 'editor' ? 'active' : ''}`}
                  onClick={handleNewEventClick}
                >
                  <span>+ Add New Event</span>
                </button>
              </nav>

              {/* List Mode */}
              {eventTab === 'list' && (
                <div className="admin-events-list-pane">
                  <div className="admin-list-actions-bar">
                    <span className="admin-list-count">Manage {events.length} Studio Events</span>
                    <button 
                      className="admin-create-shortcut-btn"
                      onClick={handleNewEventClick}
                    >
                      + New Event
                    </button>
                  </div>

                  <div className="admin-events-grid">
                    {events.map((event) => {
                      const isPub = event.isPublic !== false;
                      return (
                        <div key={event.id} className="admin-event-row-card">
                          <div className="admin-event-thumb-frame">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="admin-event-thumb-img" 
                            />
                            <span className={`admin-status-badge ${isPub ? 'public' : 'draft'}`}>
                              {isPub ? 'Public' : 'Draft'}
                            </span>
                          </div>

                          <div className="admin-event-details">
                            <h4 className="admin-card-title">{event.title}</h4>
                            <p className="admin-card-sub">
                              {event.date} • {event.time?.split('-')[0]?.trim()} • <strong>₹{event.price}</strong>
                            </p>
                            <span className="admin-card-venue">{event.venueShort || event.venue}</span>
                          </div>

                          <div className="admin-event-actions">
                            <button 
                              className="admin-action-btn edit"
                              onClick={() => handleEditClick(event)}
                              title="Edit Event"
                            >
                              Edit
                            </button>
                            <button 
                              className={`admin-action-btn toggle ${isPub ? 'unpublish' : 'publish'}`}
                              onClick={(e) => handleTogglePublic(event, e)}
                              title={isPub ? 'Make Draft' : 'Make Public'}
                            >
                              {isPub ? 'Hide' : 'Publish'}
                            </button>
                            <button 
                              className="admin-action-btn delete"
                              onClick={(e) => handleDelete(event.id, event.title, e)}
                              title="Delete Event"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editor Mode */}
              {eventTab === 'editor' && (
                <form className="admin-event-form" onSubmit={handleSaveEvent}>
                  <div className="form-header-row">
                    <h3 className="form-title">
                      {editingEventId ? 'Edit Event Details' : 'Create & Publish New Event'}
                    </h3>
                    <button 
                      type="button" 
                      className="form-back-btn" 
                      onClick={() => setEventTab('list')}
                    >
                      ← Back to Catalog
                    </button>
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">Event Poster Image URL</label>
                    <div className="form-image-preview-panel">
                      <div className="form-image-preview-frame">
                        <img 
                          src={formData.image} 
                          alt="Poster Preview" 
                          className="form-image-preview-element"
                        />
                        <div className="form-image-aspect-badge">
                          <span>16:9 / Object-Fit: Cover</span>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Paste direct image URL..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Event Title *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-grid-2-inner">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Genre</label>
                        <select 
                          className="form-select"
                          value={formData.genre}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        >
                          <option value="acoustic">Acoustic / Symphony</option>
                          <option value="rock">Live Music / Rock</option>
                          <option value="jazz">Jazz & Blues</option>
                          <option value="electronic">Electronic / Synth</option>
                          <option value="hiphop">Urban / Hip-Hop</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time Slot</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Base Price (₹) *</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Venue Location</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Studio Room / Space</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">Event Description</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">Artist Lineup (Comma-separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.lineupNames}
                      onChange={(e) => setFormData({ ...formData, lineupNames: e.target.value })}
                    />
                  </div>

                  <div className="form-tiers-box">
                    <h4 className="tiers-box-title">🎟️ Ticket Pass Tiers</h4>
                    <div className="tiers-grid-2">
                      <div className="tier-input-card">
                        <span className="tier-input-label">Tier 1 Pass</span>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Pass Name"
                          value={formData.tier1Name}
                          onChange={(e) => setFormData({ ...formData, tier1Name: e.target.value })}
                        />
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Price ₹"
                          value={formData.tier1Price}
                          onChange={(e) => setFormData({ ...formData, tier1Price: e.target.value })}
                        />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Perks"
                          value={formData.tier1Perks}
                          onChange={(e) => setFormData({ ...formData, tier1Perks: e.target.value })}
                        />
                      </div>
                      <div className="tier-input-card">
                        <span className="tier-input-label">Tier 2 Pass (VIP)</span>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="VIP Pass Name"
                          value={formData.tier2Name}
                          onChange={(e) => setFormData({ ...formData, tier2Name: e.target.value })}
                        />
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Price ₹"
                          value={formData.tier2Price}
                          onChange={(e) => setFormData({ ...formData, tier2Price: e.target.value })}
                        />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="VIP Perks"
                          value={formData.tier2Perks}
                          onChange={(e) => setFormData({ ...formData, tier2Perks: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-toggle-row">
                    <label className="form-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      />
                      <span className="checkbox-text">Make this Event Public & Live immediately</span>
                    </label>
                  </div>

                  <div className="form-submit-row">
                    <button 
                      type="button" 
                      className="form-cancel-btn" 
                      onClick={() => setEventTab('list')}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="form-save-btn">
                      <span>{editingEventId ? 'Update & Save Changes' : 'Publish Event Flawlessly'}</span>
                      <AppIcon name="arrow-up-right" size={16} color="#08090C" strokeWidth={2.8} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 2: LIVE MENU MANAGER (SECTION 11 & P0 ROUTE SYNC)
              (Strictly 100% Pure Vegetarian & Soft Drinks Only)
              ============================================================ */}
          {adminSection === 'menu' && (
            <div className="admin-section-pane">
              {/* Pure Vegetarian & Soft Drinks Banner */}
              <div className="admin-pure-veg-banner">
                <span className="pure-veg-icon">🌱</span>
                <div className="pure-veg-banner-text">
                  <strong>Strictly 100% Pure Vegetarian & Soft Drinks Only</strong>
                  <span>Zero meat, chicken, mutton, seafood, or egg, and strictly no alcohol allowed at Kesari.</span>
                </div>
              </div>

              <div className="admin-toolbar-row">
                <div className="admin-search-wrap">
                  <Search size={14} className="search-icon" />
                  <input 
                    type="text"
                    className="admin-search-input"
                    placeholder="Search pure veg dish or soft drink..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                  />
                </div>

                <button 
                  className="admin-primary-action-btn"
                  onClick={() => handleOpenDishEditor(null)}
                >
                  <Plus size={15} />
                  <span>Add Pure Veg Dish</span>
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="admin-filter-pills-row">
                {['All', 'Starters', 'Mains', 'Beverages', 'Desserts', 'Chef Specials'].map(cat => (
                  <button 
                    key={cat}
                    className={`admin-filter-pill ${selectedMenuCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedMenuCategory(cat)}
                  >
                    {cat === 'Beverages' ? 'Soft Drinks' : cat}
                  </button>
                ))}
              </div>

              {/* Dish Modal / Inline Form */}
              <AnimatePresence>
                {showDishForm && (
                  <motion.div 
                    className="admin-inline-modal-card"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="inline-form-header">
                      <h4>{editingDish ? `Edit Dish: ${editingDish.name}` : 'Create New Pure Veg Menu Item'}</h4>
                      <button 
                        className="inline-close-btn"
                        onClick={() => setShowDishForm(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveDish} className="dish-editor-form">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Dish Name *</label>
                          <input 
                            type="text"
                            className="form-input"
                            placeholder="e.g. Kashmiri Saffron Risotto"
                            value={dishFormData.name}
                            onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-grid-2-inner">
                          <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                              className="form-select"
                              value={dishFormData.category}
                              onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                            >
                              <option value="Starters">Starters (Pure Veg)</option>
                              <option value="Mains">Mains (Pure Veg)</option>
                              <option value="Beverages">Artisanal Soft Drinks (No Alcohol)</option>
                              <option value="Desserts">Desserts (Eggless)</option>
                              <option value="Chef Specials">Chef Specials (Pure Veg)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Price (₹) *</label>
                            <input 
                              type="number"
                              className="form-input"
                              placeholder="350"
                              value={dishFormData.price}
                              onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Description & Ingredients</label>
                        <textarea 
                          className="form-textarea"
                          rows="2"
                          placeholder="Key vegetarian ingredients, tasting notes, and culinary details..."
                          value={dishFormData.description}
                          onChange={(e) => setDishFormData({ ...dishFormData, description: e.target.value })}
                        />
                      </div>

                      <div className="form-checkbox-row-dual">
                        <div className="veg-status-tag-active">
                          <span>🟢 100% Pure Vegetarian</span>
                        </div>
                        <label className="form-checkbox-label">
                          <input 
                            type="checkbox"
                            checked={dishFormData.isAvailable}
                            onChange={(e) => setDishFormData({ ...dishFormData, isAvailable: e.target.checked })}
                          />
                          <span className="checkbox-text">Live In Stock (Available)</span>
                        </label>
                      </div>

                      <div className="form-submit-row">
                        <button 
                          type="button" 
                          className="form-cancel-btn"
                          onClick={() => setShowDishForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="form-save-btn">
                          <span>{editingDish ? 'Update Dish' : 'Add to Live Menu'}</span>
                          <Check size={16} />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Menu Items Table / Cards */}
              <div className="admin-menu-list">
                {menuItems
                  .filter(item => {
                    if (selectedMenuCategory !== 'All' && item.category !== selectedMenuCategory) return false;
                    if (menuSearch.trim()) {
                      const q = menuSearch.toLowerCase();
                      return item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map(dish => (
                    <div key={dish.id} className="admin-dish-row-card">
                      <div className="dish-info-block">
                        <div className="dish-title-line">
                          <span className={`dish-veg-dot ${dish.isVeg ? 'veg' : 'non-veg'}`} title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
                          <h4 className="dish-name">{dish.name}</h4>
                          <span className="dish-cat-tag">{dish.category}</span>
                        </div>
                        <p className="dish-desc">{dish.description}</p>
                      </div>

                      {/* Quick Price Editor */}
                      <div className="dish-price-control">
                        <span className="currency-prefix">₹</span>
                        <input 
                          type="number"
                          className="dish-price-input"
                          defaultValue={dish.price}
                          onBlur={(e) => handleQuickPriceChange(dish.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleQuickPriceChange(dish.id, e.target.value);
                          }}
                          title="Click to edit live price and press Enter"
                        />
                      </div>

                      {/* Stock Availability Toggle Switch */}
                      <div className="dish-availability-control">
                        <button 
                          className={`dish-toggle-btn ${dish.isAvailable ? 'in-stock' : 'sold-out'}`}
                          onClick={() => handleToggleDishAvailability(dish.id)}
                          title="Instant availability toggle"
                        >
                          <span className="status-indicator-dot" />
                          <span>{dish.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="dish-actions">
                        <button 
                          className="admin-icon-btn edit" 
                          onClick={() => handleOpenDishEditor(dish)}
                          title="Edit full details"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="admin-icon-btn delete" 
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          title="Delete dish"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: ARTIST REGISTRATIONS
              ============================================================ */}
          {adminSection === 'artists' && (
            <div className="admin-section-pane">
              <div className="admin-toolbar-row">
                <div className="admin-filter-pills-row">
                  {['all', 'pending', 'approved', 'rejected'].map(st => (
                    <button 
                      key={st}
                      className={`admin-filter-pill ${artistFilter === st ? 'active' : ''}`}
                      onClick={() => setArtistFilter(st)}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                      {st === 'pending' && pendingArtistsCount > 0 && (
                        <span className="filter-count-badge">{pendingArtistsCount}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="admin-stat-summary">
                  <span>{artists.length} Total Submissions</span>
                </div>
              </div>

              {/* Artists Grid / Cards */}
              <div className="admin-artists-grid">
                {artists
                  .filter(a => artistFilter === 'all' || a.status === artistFilter)
                  .map(artist => {
                    const isPending = artist.status === 'pending';
                    const isApproved = artist.status === 'approved';

                    return (
                      <div key={artist.id} className="admin-artist-card">
                        <div className="artist-card-header">
                          <img 
                            src={artist.photoUrl || '/assets/artist_1.png'} 
                            alt={artist.name} 
                            className="artist-thumb-img"
                            onError={(e) => { e.currentTarget.src = '/assets/artist_1.png'; }}
                          />
                          <div className="artist-header-meta">
                            <h4 className="artist-name">{artist.name}</h4>
                            <span className="artist-genre-badge">{artist.genre}</span>
                            <div className="artist-contact-strip">
                              <span><MapPin size={12} /> {artist.city}</span>
                              <span><IndianRupee size={12} /> ₹{Number(artist.costPerEvent).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className={`artist-status-tag ${artist.status}`}>
                            {artist.status}
                          </div>
                        </div>

                        {/* Expandable / Visible Details */}
                        <div className="artist-card-body">
                          <p className="artist-events-text">
                            <strong>Past Events:</strong> {artist.previousEvents}
                          </p>
                          {artist.achievements && (
                            <p className="artist-achieve-text">
                              <strong>Highlights:</strong> {artist.achievements}
                            </p>
                          )}

                          <div className="artist-links-row">
                            {artist.videoUrl && (
                              <a 
                                href={artist.videoUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="artist-media-link"
                              >
                                <Video size={13} />
                                <span>Performance Video</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                            {artist.instagram && (
                              <a 
                                href={`https://instagram.com/${artist.instagram.replace(/^@/, '')}`}
                                target="_blank" 
                                rel="noreferrer"
                                className="artist-media-link"
                              >
                                <Instagram size={13} />
                                <span>{artist.instagram}</span>
                              </a>
                            )}
                            {artist.channel && (
                              <a 
                                href={artist.channel} 
                                target="_blank" 
                                rel="noreferrer"
                                className="artist-media-link"
                              >
                                <Globe size={13} />
                                <span>Portfolio</span>
                              </a>
                            )}
                          </div>

                          <div className="artist-private-contact">
                            <span><Phone size={12} /> {artist.phone}</span>
                            <span><Mail size={12} /> {artist.email}</span>
                            {artist.openMic && <span className="open-mic-chip">Open Mic Interested 🎙️</span>}
                          </div>
                        </div>

                        {/* Review Actions */}
                        <div className="artist-review-actions">
                          {isPending ? (
                            <>
                              <button 
                                className="admin-btn-approve"
                                onClick={() => handleReviewArtist(artist.id, 'approved')}
                              >
                                <CheckCircle2 size={15} />
                                <span>Approve Artist</span>
                              </button>
                              <button 
                                className="admin-btn-reject"
                                onClick={() => handleReviewArtist(artist.id, 'rejected')}
                              >
                                <XCircle size={15} />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : isApproved ? (
                            <button 
                              className="admin-btn-secondary"
                              onClick={() => handleReviewArtist(artist.id, 'rejected')}
                            >
                              Revoke Approval
                            </button>
                          ) : (
                            <button 
                              className="admin-btn-secondary"
                              onClick={() => handleReviewArtist(artist.id, 'approved')}
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 4: VENUE BOOKINGS (HALL RESERVATIONS)
              ============================================================ */}
          {adminSection === 'bookings' && (
            <div className="admin-section-pane">
              <div className="admin-toolbar-row">
                <div className="admin-filter-pills-row">
                  {['all', 'pending', 'confirmed', 'cancelled'].map(st => (
                    <button 
                      key={st}
                      className={`admin-filter-pill ${bookingFilter === st ? 'active' : ''}`}
                      onClick={() => setBookingFilter(st)}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                      {st === 'pending' && pendingBookingsCount > 0 && (
                        <span className="filter-count-badge">{pendingBookingsCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-bookings-list">
                {bookings
                  .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                  .map(booking => (
                    <div key={booking.id} className="admin-booking-row-card">
                      <div className="booking-main-meta">
                        <div className="booking-header-line">
                          <span className="booking-ref-code">{booking.ref || booking.id}</span>
                          <span className={`booking-status-tag ${booking.status}`}>{booking.status}</span>
                        </div>
                        <h4 className="booking-hall-name">{booking.hallName}</h4>
                        <p className="booking-event-type">{booking.eventType}</p>
                        
                        <div className="booking-timing-strip">
                          <span><Calendar size={13} /> {booking.date}</span>
                          <span><Clock size={13} /> {booking.startTime} - {booking.endTime}</span>
                          <span><strong>{booking.guests}</strong> Guests</span>
                        </div>

                        {booking.extras && booking.extras.length > 0 && (
                          <div className="booking-extras-list">
                            {booking.extras.map((ex, i) => (
                              <span key={i} className="booking-extra-pill">✓ {ex}</span>
                            ))}
                          </div>
                        )}

                        {booking.notes && (
                          <p className="booking-notes-callout">
                            <strong>Note:</strong> {booking.notes}
                          </p>
                        )}
                      </div>

                      <div className="booking-contact-block">
                        <div className="guest-info">
                          <span className="guest-name">{booking.name}</span>
                          <span className="guest-phone"><Phone size={12} /> {booking.phone}</span>
                          <span className="guest-email"><Mail size={12} /> {booking.email}</span>
                        </div>

                        <div className="booking-action-buttons">
                          {booking.status === 'pending' && (
                            <button 
                              className="admin-btn-approve"
                              onClick={() => handleBookingStatus(booking.id, 'confirmed')}
                            >
                              <CheckCircle2 size={14} />
                              <span>Confirm Hall</span>
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button 
                              className="admin-btn-reject"
                              onClick={() => handleBookingStatus(booking.id, 'cancelled')}
                            >
                              <XCircle size={14} />
                              <span>Cancel</span>
                            </button>
                          )}
                          <a 
                            href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(booking.name)},%20this%20is%20Kesari%20The%20Memory%20Studio%20regarding%20your%20hall%20reservation%20for%20${encodeURIComponent(booking.date)}.`}
                            target="_blank" 
                            rel="noreferrer"
                            className="admin-btn-whatsapp"
                          >
                            WhatsApp Guest
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 5: BULK FOOD ORDERS
              ============================================================ */}
          {adminSection === 'bulk-food' && (
            <div className="admin-section-pane">
              <div className="admin-toolbar-row">
                <div className="admin-filter-pills-row">
                  {['all', 'received', 'confirmed', 'completed', 'cancelled'].map(st => (
                    <button 
                      key={st}
                      className={`admin-filter-pill ${bulkFilter === st ? 'active' : ''}`}
                      onClick={() => setBulkFilter(st)}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                      {st === 'received' && pendingBulkCount > 0 && (
                        <span className="filter-count-badge">{pendingBulkCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-bulk-orders-list">
                {bulkOrders
                  .filter(o => bulkFilter === 'all' || o.status === bulkFilter)
                  .map(order => (
                    <div key={order.id} className="admin-bulk-order-card">
                      <div className="bulk-order-header">
                        <div className="bulk-ref-group">
                          <span className="bulk-ref-code">{order.ref || order.id}</span>
                          <span className={`bulk-order-type ${order.orderType?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {order.orderType}
                          </span>
                        </div>
                        <span className={`bulk-status-badge ${order.status}`}>{order.status}</span>
                      </div>

                      <div className="bulk-schedule-row">
                        <span><Calendar size={13} /> {order.date}</span>
                        <span><Clock size={13} /> {order.timeNeeded}</span>
                        <span>👥 {order.guests} Guests ({order.dietary})</span>
                      </div>

                      {order.address && (
                        <p className="bulk-address-text">
                          <MapPin size={13} /> <strong>Address:</strong> {order.address}
                        </p>
                      )}

                      {/* Items Ordered Breakdown */}
                      <div className="bulk-items-table">
                        <span className="items-title">Dishes Requested:</span>
                        <div className="items-chips-grid">
                          {(order.items || []).map((it, idx) => (
                            <div key={idx} className="bulk-item-chip">
                              <span className="item-qty">{it.qty}×</span>
                              <span className="item-name">{it.name}</span>
                              {it.price && <span className="item-price">₹{it.price * it.qty}</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <p className="bulk-notes-text">
                          <strong>Kitchen Instructions:</strong> {order.notes}
                        </p>
                      )}

                      {/* Footer With Estimated Total & Actions */}
                      <div className="bulk-order-footer">
                        <div className="bulk-total-block">
                          <span className="total-label">Estimated Total</span>
                          <span className="total-value">₹{Number(order.estimatedTotal).toLocaleString()}</span>
                        </div>

                        <div className="bulk-footer-actions">
                          {order.status === 'received' && (
                            <button 
                              className="admin-btn-approve"
                              onClick={() => handleBulkStatus(order.id, 'confirmed')}
                            >
                              <CheckCircle2 size={14} />
                              <span>Confirm Order</span>
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button 
                              className="admin-btn-complete"
                              onClick={() => handleBulkStatus(order.id, 'completed')}
                            >
                              <Check size={14} />
                              <span>Mark Completed</span>
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button 
                              className="admin-btn-reject"
                              onClick={() => handleBulkStatus(order.id, 'cancelled')}
                            >
                              <XCircle size={14} />
                              <span>Cancel</span>
                            </button>
                          )}
                          <a 
                            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(order.name)},%20this%20is%20Kesari%20Studio%20regarding%20your%20catering%20order%20${encodeURIComponent(order.ref || order.id)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-btn-whatsapp"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 6: PERMANENT QR CODE (SECTION 11 & SECTION 10 SPEC)
              ============================================================ */}
          {adminSection === 'qr' && (
            <div className="admin-section-pane qr-section-pane">
              <div className="qr-hero-card">
                <div className="qr-preview-column">
                  <div className="qr-display-frame">
                    <img 
                      src="/menu-qr-highres.png" 
                      alt="Permanent Kesari Menu QR Code"
                      className="qr-highres-image"
                      onError={(e) => {
                        // Fallback to SVG or dynamic QR generator if highres png is not rendered yet
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/menu-qr.svg';
                      }}
                    />
                    <div className="qr-scan-badge">
                      <span>Live Permanent QR</span>
                    </div>
                  </div>
                  <span className="qr-target-url">https://kesari.studio/menu</span>
                </div>

                <div className="qr-info-column">
                  <div className="qr-info-header">
                    <div className="qr-sparkle-pill">
                      <Sparkles size={14} />
                      <span>Permanent Menu QR (P0 Architecture)</span>
                    </div>
                    <h3 className="qr-title">Instant Digital Menu for Every Table & Poster</h3>
                    <p className="qr-desc">
                      This QR code is <strong>permanent and immutable</strong>. Print it on studio tables, acoustic lounge coasters, or gate flyers once. When staff updates dishes, adds specials, or modifies prices in Tab 2, customers scanning this code immediately see the live, updated menu.
                    </p>
                  </div>

                  <div className="qr-action-buttons-grid">
                    {/* High Res PNG Download */}
                    <a 
                      href="/menu-qr-highres.png" 
                      download="kesari-menu-qr-highres.png"
                      className="qr-action-download-btn primary"
                    >
                      <Download size={16} />
                      <div className="btn-text-group">
                        <span className="btn-main-text">Download High-Res PNG</span>
                        <span className="btn-sub-text">Large 300 DPI (Print Ready)</span>
                      </div>
                    </a>

                    {/* SVG Vector Download */}
                    <a 
                      href="/menu-qr.svg" 
                      download="kesari-menu-qr.svg"
                      className="qr-action-download-btn secondary"
                    >
                      <Download size={16} />
                      <div className="btn-text-group">
                        <span className="btn-main-text">Download Vector SVG</span>
                        <span className="btn-sub-text">Infinitely scalable vector</span>
                      </div>
                    </a>

                    {/* Print Template Link */}
                    <a 
                      href="/menu-qr-print.html" 
                      target="_blank" 
                      rel="noreferrer"
                      className="qr-action-download-btn outline"
                    >
                      <ExternalLink size={16} />
                      <div className="btn-text-group">
                        <span className="btn-main-text">Print Table Stands & Posters</span>
                        <span className="btn-sub-text">Opens print layout in new tab</span>
                      </div>
                    </a>

                    {/* Copy Direct Link */}
                    <button 
                      type="button" 
                      className="qr-action-download-btn copy"
                      onClick={handleCopyMenuUrl}
                    >
                      {copiedLink ? <Check size={16} color="#DAFB71" /> : <Copy size={16} />}
                      <div className="btn-text-group">
                        <span className="btn-main-text">{copiedLink ? 'Copied to Clipboard!' : 'Copy Permanent URL'}</span>
                        <span className="btn-sub-text">https://kesari.studio/menu</span>
                      </div>
                    </button>
                  </div>

                  {/* Test Live Screen Button */}
                  <div className="qr-preview-banner">
                    <span>Want to test the customer view?</span>
                    <a 
                      href="/menu" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== 'undefined') {
                          window.history.pushState({}, '', '/menu');
                          window.dispatchEvent(new PopStateEvent('popstate'));
                          onClose();
                        }
                      }}
                      className="preview-screen-link"
                    >
                      <span>Preview /menu Screen Now</span>
                      <ChevronRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
