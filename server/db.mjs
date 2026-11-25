import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DATA_FILE = path.join(__dirname, 'data', 'kesari_local.json');

export const DEFAULT_SETTINGS = {
  name: 'Kesari - The Memory Studio',
  tagline: 'MUSIC | EVENTS | MEETUPS | MEMORIES',
  upiId: 'kesari.memory@okhdfcbank',
  payeeName: 'Kesari Memory Studio',
  email: 'Kesari.memory@gmail.com',
  phone: '+917760539955',
  address: 'Kesari - The Memory Studio, 80 Feet Rd, 4th Block, Koramangala, Bangalore, Karnataka 560034',
  whatsappUrl: 'https://wa.me/917760539955',
};

export const DEFAULT_EVENTS = [
  {
    id: 'amour',
    title: 'AMOUR – A Yash Raj Films Instrumental Tribute',
    artistOrHost: 'Amour String Ensemble',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'week',
    theme: 'plum',
    venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Sun 1 Nov',
    timeLabel: '12:30',
    basePrice: 1800,
    capacity: 40,
    sold: 28,
    isLive: true,
    imageUrl: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
    description: "Some melodies never grow old. Amour brings the magic of Yash Raj Films' iconic musical universe to life through a live instrumental tribute at Kesari - The Memory Studio, Bengaluru.",
    tiers: [
      { id: 'couple', name: 'Couple Entry Pass', price: 1800, perks: 'Entry for 2 guests to live instrumental tribute' },
      { id: 'vip-couple', name: 'VIP Front Row Couple Pass', price: 2500, perks: 'Stage-front seating for 2 + 2 artisanal coffees & commemorative score' }
    ]
  },
  {
    id: 'laadla',
    title: 'Maa Da Laadla by Parminder',
    artistOrHost: 'Amour String Quartet Live',
    category: 'music',
    lineup: 'live-gigs',
    dateBucket: 'tonight',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Sun 1 Nov',
    timeLabel: '18:00',
    basePrice: 349,
    capacity: 40,
    sold: 22,
    isLive: true,
    imageUrl: '/assets/events/book_us_01_live_music.jpg',
    description: 'A soulful and vibrant live rendition of classic and contemporary melodies featuring Amour String Quartet Live at Kesari - The Memory Studio.',
    tiers: [
      { id: 'standard', name: 'Acoustic Hall Pass', price: 349, perks: 'Entry to live acoustic hall session' }
    ]
  },
  {
    id: 'soundwaves',
    title: 'Sunset Acoustic & Open Mic',
    artistOrHost: 'Sarah Vaughan Trio',
    category: 'music',
    lineup: 'open-mic',
    dateBucket: 'tonight',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '17:00',
    basePrice: 950,
    capacity: 25,
    sold: 18,
    isLive: true,
    imageUrl: '/assets/events/book_us_02_spoken_word.jpg',
    description: 'Intimate acoustic guitar, candlelit wooden stage, and craft beverages under warm studio lights at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Open Mic Audience Pass', price: 950, perks: 'Studio lounge seating & welcome drink' },
      { id: 'vip', name: 'Performer + Table Pass', price: 1950, perks: 'Guaranteed 10-min mic performance slot + audio recording of set' }
    ]
  },
  {
    id: 'rock',
    title: 'Rock Legends Reunion',
    artistOrHost: 'The Velvet Echoes',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'tonight',
    theme: 'plum',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '19:00',
    basePrice: 1499,
    capacity: 60,
    sold: 52,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_03_concerts.jpg',
    description: 'An electrifying night celebrating iconic guitar riffs, drum jams, and legendary rock anthems performed live at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'General Studio Pass', price: 1499, perks: 'Entry to live studio hall & acoustic lounge' },
      { id: 'vip', name: 'VIP Front Row Pass', price: 2999, perks: 'Front row seating, meet the band & welcome beverage' },
      { id: 'all', name: 'All-Access Backstage Pass', price: 5499, perks: 'Artist green room access, soundcheck invite, free studio jam hour' }
    ]
  },
  {
    id: 'jazz',
    title: 'Jazz & Blues Evening',
    artistOrHost: 'Miles Quartet',
    category: 'music',
    lineup: 'jam-sessions',
    dateBucket: 'week',
    theme: 'indigo',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Fri 30 Oct',
    timeLabel: '18:30',
    basePrice: 1250,
    capacity: 20,
    sold: 16,
    isLive: true,
    imageUrl: '/assets/events/ev_jazz.jpg',
    description: 'Immerse yourself in smooth saxophone melodies, soulful electric blues, and world-class live improvisation at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Studio Entry Pass', price: 1250, perks: 'Open seating in acoustic lounge' },
      { id: 'vip', name: 'Reserved Table Seating', price: 2450, perks: 'Reserved cafe table, complimentary artisanal coffee' },
      { id: 'all', name: 'VIP Studio Patron', price: 4250, perks: 'Front table, artist meet & greet, exclusive live vinyl recording' }
    ]
  },
  {
    id: 'hiphop',
    title: 'Hip Hop & Cypher Showcase',
    artistOrHost: 'Apex Rhymes & DJ Cipher',
    category: 'culture',
    lineup: 'open-mic',
    dateBucket: 'week',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Sat 14 Nov',
    timeLabel: '20:00',
    basePrice: 1350,
    capacity: 60,
    sold: 41,
    isLive: true,
    imageUrl: '/assets/concert_crowd.jpg',
    description: 'Freestyle cyphers, chart-topping lyricists, and high-energy 808 beats live on mic at Kesari - The Memory Studio.',
    tiers: [
      { id: 'ga', name: 'Cypher Entry', price: 1350, perks: 'Standing room & cypher floor' },
      { id: 'vip', name: 'VIP Mosh & Front Row', price: 2750, perks: 'Floor access right next to speakers & wireless mic cypher slot' },
      { id: 'all', name: 'Artist Backstage Circle', price: 4800, perks: 'Green room pass, open mic battle priority' }
    ]
  },
  {
    id: 'electronic',
    title: 'Modular Synth & Ambient Night',
    artistOrHost: 'Klangwelt Collective',
    category: 'nightlife',
    lineup: 'live-gigs',
    dateBucket: 'week',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'NYE 31 Dec',
    timeLabel: '21:00',
    basePrice: 1850,
    capacity: 50,
    sold: 44,
    isLive: true,
    imageUrl: '/assets/fluid_art.jpg',
    description: 'An intimate 360-degree audio immersion with live analog modular synths, ambient light projections, and deep bass at Kesari Studio, Bangalore.',
    tiers: [
      { id: 'ga', name: 'Studio Entry Pass', price: 1850, perks: 'Full audio visual access' },
      { id: 'vip', name: 'VIP Acoustic Lounge Seat', price: 3600, perks: 'Front row studio seating, priority beverage service' },
      { id: 'all', name: 'All-Night Studio VIP', price: 6200, perks: 'All-night access, sound engineer session invite' }
    ]
  },
  {
    id: 'standup-comedy',
    title: 'Stand-Up Comedy & Storytelling Night',
    artistOrHost: 'Bangalore Comedy Collective Live',
    category: 'culture',
    lineup: 'open-mic',
    dateBucket: 'tonight',
    theme: 'ember',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Tonight',
    timeLabel: '20:30',
    basePrice: 499,
    capacity: 50,
    sold: 38,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_05_comedy.jpg',
    description: 'Non-stop laughter, sharp observational humor, and hilarious storytelling live on the Kesari stage in Koramangala.',
    tiers: [
      { id: 'standard', name: 'Comedy Pass', price: 499, perks: 'Entry + front seating' }
    ]
  },
  {
    id: 'dance-workshop',
    title: 'Contemporary Dance Practice & Masterclass',
    artistOrHost: 'Rhythm Movement Crew',
    category: 'culture',
    lineup: 'workshops',
    dateBucket: 'week',
    theme: 'cerulean',
    venue: 'Kesari - The Memory Studio, Bangalore',
    city: 'Bangalore',
    dateLabel: 'Sun 8 Nov',
    timeLabel: '11:00',
    basePrice: 799,
    capacity: 30,
    sold: 19,
    isLive: true,
    imageUrl: '/assets/book-us/book_us_06_dance.jpg',
    description: 'Choreography, body isolations, and synchronized dance movement on our professional sprung wood floor at Kesari.',
    tiers: [
      { id: 'workshop', name: 'Workshop Pass', price: 799, perks: '2-hour masterclass + video footage' }
    ]
  }
];

class DatabaseService {
  constructor() {
    this.mongoClient = null;
    this.mongoDb = null;
    this.isUsingMongo = false;
    this.localData = null;
    this.init();
  }

  loadLocalFile() {
    try {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DB] Failed reading local cache, re-initializing defaults.', err.message);
    }
    return {
      events: DEFAULT_EVENTS,
      artists: [],
      orders: [],
      bookings: [],
      enquiries: [],
      settings: DEFAULT_SETTINGS,
    };
  }

  saveLocalFile() {
    try {
      fs.mkdirSync(path.dirname(LOCAL_DATA_FILE), { recursive: true });
      fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(this.localData, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Error writing local store file:', err.message);
    }
  }

  async init() {
    this.localData = this.loadLocalFile();
    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      try {
        console.log('[DB] Connecting to MongoDB Atlas...');
        this.mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await this.mongoClient.connect();
        const dbName = process.env.MONGODB_DB_NAME || 'kesari_studio';
        this.mongoDb = this.mongoClient.db(dbName);
        this.isUsingMongo = true;
        console.log(`[DB] Connected successfully to MongoDB Atlas (${dbName})!`);

        // Seed initial collections if empty
        const eventsCount = await this.mongoDb.collection('events').countDocuments();
        if (eventsCount === 0) {
          console.log('[DB] Seeding MongoDB Atlas events with Kesari Studio catalog...');
          await this.mongoDb.collection('events').insertMany(DEFAULT_EVENTS);
          await this.mongoDb.collection('settings').insertOne({ ...DEFAULT_SETTINGS, _id: 'main' });
        }
      } catch (err) {
        console.warn('[DB] MongoDB Atlas connection warning:', err.message);
        console.warn('[DB] Running on resilient local persistence engine until Atlas URI connects.');
        this.isUsingMongo = false;
      }
    } else {
      console.log('[DB] No MONGODB_URI found in environment. Using local JSON store.');
      console.log('[DB] (To connect MongoDB Atlas, set MONGODB_URI="mongodb+srv://..." in .env)');
    }
  }

  getHealth() {
    return {
      status: 'ok',
      engine: this.isUsingMongo ? 'MongoDB Atlas' : 'Local Persistent Engine',
      uriConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim()),
      connected: this.isUsingMongo,
      database: this.isUsingMongo ? (process.env.MONGODB_DB_NAME || 'kesari_studio') : 'kesari_local.json',
    };
  }

  // --- EVENTS ---
  async getEvents() {
    if (this.isUsingMongo) {
      const items = await this.mongoDb.collection('events').find({}).toArray();
      return items.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
    }
    return this.localData.events || [];
  }

  async saveEvent(eventData, eventId) {
    const id = eventId || eventData.id || `evt-${Date.now()}`;
    const payload = { ...eventData, id, updatedAt: new Date().toISOString() };

    if (this.isUsingMongo) {
      await this.mongoDb.collection('events').updateOne(
        { id },
        { $set: payload },
        { upsert: true }
      );
      return payload;
    }

    const idx = (this.localData.events || []).findIndex(e => e.id === id);
    if (idx >= 0) {
      this.localData.events[idx] = { ...this.localData.events[idx], ...payload };
    } else {
      this.localData.events.unshift(payload);
    }
    this.saveLocalFile();
    return payload;
  }

  async deleteEvent(eventId) {
    if (this.isUsingMongo) {
      await this.mongoDb.collection('events').deleteOne({ id: eventId });
      return { ok: true };
    }
    this.localData.events = (this.localData.events || []).filter(e => e.id !== eventId);
    this.saveLocalFile();
    return { ok: true };
  }

  // --- ORDERS / UPI BOOKINGS ---
  async getOrders() {
    if (this.isUsingMongo) {
      const orders = await this.mongoDb.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
      return orders.map(({ _id, ...rest }) => rest);
    }
    return this.localData.orders || [];
  }

  async createOrder(orderData) {
    const orderId = orderData.id || `ORD-${Date.now()}`;
    const reference = orderData.reference || `KSR-${orderId.slice(-6).toUpperCase()}`;
    const record = {
      ...orderData,
      id: orderId,
      reference,
      status: orderData.status || 'awaiting_payment',
      createdAt: new Date().toISOString(),
    };

    if (this.isUsingMongo) {
      await this.mongoDb.collection('orders').insertOne(record);
    } else {
      this.localData.orders.unshift(record);
      this.saveLocalFile();
    }
    return record;
  }

  async updatePaymentUtr(orderId, utr) {
    const patch = {
      utr,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };

    if (this.isUsingMongo) {
      const res = await this.mongoDb.collection('orders').findOneAndUpdate(
        { id: orderId },
        { $set: patch },
        { returnDocument: 'after' }
      );
      return res;
    }

    const order = this.localData.orders.find(o => o.id === orderId);
    if (order) {
      Object.assign(order, patch);
      this.saveLocalFile();
    }
    return order;
  }

  async reviewOrder(orderId, status) {
    const patch = {
      status, // 'confirmed' | 'rejected'
      reviewedAt: new Date().toISOString(),
    };
    if (status === 'confirmed') {
      patch.passCode = `KSR-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    if (this.isUsingMongo) {
      const res = await this.mongoDb.collection('orders').findOneAndUpdate(
        { id: orderId },
        { $set: patch },
        { returnDocument: 'after' }
      );
      return res;
    }

    const order = this.localData.orders.find(o => o.id === orderId);
    if (order) {
      Object.assign(order, patch);
      this.saveLocalFile();
    }
    return order;
  }

  async verifyOrder(orderId, { utr, autoVerified = false } = {}) {
    const patch = {
      status: 'confirmed',
      verifiedAt: new Date().toISOString(),
      autoVerified: Boolean(autoVerified),
      passCode: `KSR-PASS-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    if (utr) {
      patch.utr = String(utr).trim();
    }

    if (this.isUsingMongo) {
      const res = await this.mongoDb.collection('orders').findOneAndUpdate(
        { id: orderId },
        { $set: patch },
        { returnDocument: 'after' }
      );
      return res;
    }

    const order = this.localData.orders.find(o => o.id === orderId);
    if (order) {
      Object.assign(order, patch);
      this.saveLocalFile();
      return order;
    }
    // If order was created purely on client side, register it as confirmed
    const newRecord = {
      id: orderId,
      ...patch,
      createdAt: new Date().toISOString(),
    };
    this.localData.orders.unshift(newRecord);
    this.saveLocalFile();
    return newRecord;
  }

  // --- SERVICE BOOKINGS & ENQUIRIES ---
  async getBookings() {
    if (this.isUsingMongo) {
      const list = await this.mongoDb.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
      return list.map(({ _id, ...rest }) => rest);
    }
    return this.localData.bookings || [];
  }

  async createBooking(bookingData) {
    const booking = {
      ...bookingData,
      id: bookingData.id || `SB-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (this.isUsingMongo) {
      await this.mongoDb.collection('bookings').insertOne(booking);
    } else {
      this.localData.bookings.unshift(booking);
      this.saveLocalFile();
    }
    return booking;
  }

  async getEnquiries() {
    if (this.isUsingMongo) {
      const list = await this.mongoDb.collection('enquiries').find({}).sort({ createdAt: -1 }).toArray();
      return list.map(({ _id, ...rest }) => rest);
    }
    return this.localData.enquiries || [];
  }

  async createEnquiry(enquiryData) {
    const item = {
      ...enquiryData,
      id: enquiryData.id || `ENQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (this.isUsingMongo) {
      await this.mongoDb.collection('enquiries').insertOne(item);
    } else {
      this.localData.enquiries.unshift(item);
      this.saveLocalFile();
    }
    return item;
  }

  // --- SETTINGS ---
  async getSettings() {
    if (this.isUsingMongo) {
      const settings = await this.mongoDb.collection('settings').findOne({ _id: 'main' });
      if (settings) {
        const { _id, ...rest } = settings;
        return rest;
      }
    }
    return this.localData.settings || DEFAULT_SETTINGS;
  }

  async updateSettings(patch) {
    const updated = {
      ...(await this.getSettings()),
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (this.isUsingMongo) {
      await this.mongoDb.collection('settings').updateOne(
        { _id: 'main' },
        { $set: updated },
        { upsert: true }
      );
      return updated;
    }

    this.localData.settings = updated;
    this.saveLocalFile();
    return updated;
  }

  // --- ARTISTS ---
  publicArtist(artist) {
    if (!artist) return null;
    const { phone, email, ...safe } = artist;
    return safe;
  }

  async getArtists() {
    if (this.isUsingMongo) {
      const list = await this.mongoDb.collection('artists').find({}).sort({ createdAt: -1 }).toArray();
      return list.map(({ _id, ...rest }) => rest);
    }
    return this.localData.artists || [];
  }

  async createArtist(data) {
    const artist = {
      id: `ART-${Date.now().toString(36).toUpperCase()}`,
      name: String(data.name || '').trim(),
      genre: String(data.genre || 'Singer / Vocalist').trim(),
      phone: String(data.phone || '').trim(),
      email: String(data.email || '').trim(),
      city: String(data.city || 'Bangalore').trim(),
      photoUrl: String(data.photoUrl || ''),
      videoUrl: String(data.videoUrl || '').trim(),
      instagram: String(data.instagram || '').trim(),
      channel: String(data.channel || '').trim(),
      previousEvents: String(data.previousEvents || '').trim(),
      achievements: String(data.achievements || '').trim(),
      costPerEvent: Number(data.costPerEvent) || 0,
      openMic: Boolean(data.openMic),
      extraDetails: String(data.extraDetails || '').trim(),
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    if (this.isUsingMongo) {
      await this.mongoDb.collection('artists').insertOne(artist);
    } else {
      if (!Array.isArray(this.localData.artists)) {
        this.localData.artists = [];
      }
      this.localData.artists.unshift(artist);
      this.saveLocalFile();
    }
    return artist;
  }

  async reviewArtist(artistId, status) {
    if (this.isUsingMongo) {
      return await this.mongoDb.collection('artists').findOneAndUpdate(
        { id: artistId },
        { $set: { status, reviewedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
    }
    const artist = (this.localData.artists || []).find((a) => a.id === artistId);
    if (artist) {
      artist.status = status;
      artist.reviewedAt = new Date().toISOString();
      this.saveLocalFile();
    }
    return artist;
  }

  async deleteArtist(artistId) {
    if (this.isUsingMongo) {
      await this.mongoDb.collection('artists').deleteOne({ id: artistId });
      return { ok: true };
    }
    this.localData.artists = (this.localData.artists || []).filter((a) => a.id !== artistId);
    this.saveLocalFile();
    return { ok: true };
  }
}

export const dbService = new DatabaseService();
