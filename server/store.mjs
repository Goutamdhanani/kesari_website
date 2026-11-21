import {DatabaseSync} from 'node:sqlite';
import {randomUUID,randomBytes} from 'node:crypto';
import {selectLandingEvents} from '../src/lib/events.js';

export function validateIndianPhone(val) {
  if (typeof val !== 'string') return false;
  const digits = val.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91') && ['6','7','8','9'].includes(digits[2])) return true;
  if (digits.length === 11 && digits.startsWith('0') && ['6','7','8','9'].includes(digits[1])) return true;
  if (digits.length === 10 && ['6','7','8','9'].includes(digits[0])) return true;
  return false;
}

const DEFAULT_CATEGORIES = [
  { id: 'starters', name: 'Starters', sortOrder: 1 },
  { id: 'mains', name: 'Mains', sortOrder: 2 },
  { id: 'beverages', name: 'Beverages', sortOrder: 3 },
  { id: 'desserts', name: 'Desserts', sortOrder: 4 },
  { id: 'chef-specials', name: 'Chef Specials', sortOrder: 5 }
];

// Strictly 100% PURE VEGETARIAN and SOFT DRINKS ONLY
const DEFAULT_MENU_ITEMS = [
  // --- STARTERS (Pure Veg) ---
  {
    id: 'starter-1',
    name: 'Truffle Herb Hand-Cut Fries',
    image: '/assets/food/fries.jpg',
    description: 'White truffle oil, rosemary sea salt, roasted garlic dip.',
    category: 'Starters',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 1,
    tags: []
  },
  {
    id: 'starter-2',
    name: 'Paneer Ghee Roast Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Kundapur spiced paneer on sourdough with curry leaf ghee.',
    category: 'Starters',
    price: 310,
    isVeg: true,
    isAvailable: true,
    sortOrder: 2,
    tags: []
  },
  {
    id: 'starter-3',
    name: 'Crispy Corn & Edamame Croquettes',
    image: '/assets/food/croquettes.jpg',
    description: 'Sweet corn, young edamame, and gouda cheese panko croquettes.',
    category: 'Starters',
    price: 280,
    isVeg: true,
    isAvailable: true,
    sortOrder: 3,
    tags: []
  },
  {
    id: 'starter-4',
    name: 'Wild Mushroom & Truffle Bruschetta',
    image: '/assets/food/bruschetta.jpg',
    description: 'Sautéed shiitake mushrooms and white truffle glaze on sourdough.',
    category: 'Starters',
    price: 290,
    isVeg: true,
    isAvailable: true,
    sortOrder: 4,
    tags: []
  },
  {
    id: 'starter-5',
    name: 'Crispy Lotus Stem Chips',
    image: '/assets/food/croquettes.jpg',
    description: 'Thinly sliced lotus root, roasted peri-peri, kaffir lime zest.',
    category: 'Starters',
    price: 240,
    isVeg: true,
    isAvailable: true,
    sortOrder: 5,
    tags: []
  },

  // --- MAINS (Pure Veg) ---
  {
    id: 'main-1',
    name: 'Wild Mushroom & Truffle Risotto',
    image: '/assets/food/risotto.jpg',
    description: 'Carnaroli rice, wild porcini, cultured butter, white truffle.',
    category: 'Mains',
    price: 440,
    isVeg: true,
    isAvailable: true,
    sortOrder: 6,
    tags: []
  },
  {
    id: 'main-2',
    name: 'Kesari Dal Makhani Pot',
    image: '/assets/food/dal_makhani.jpg',
    description: 'Overnight slow-cooked black lentils, churned butter, jeera rice.',
    category: 'Mains',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 7,
    tags: []
  },
  {
    id: 'main-3',
    name: 'Paneer Lababdar with Malabar Parotta',
    image: '/assets/food/paneer.jpg',
    description: 'Charred paneer in spiced tomato-cashead gravy with flaky parottas.',
    category: 'Mains',
    price: 340,
    isVeg: true,
    isAvailable: true,
    sortOrder: 8,
    tags: []
  },
  {
    id: 'main-4',
    name: 'Biryani Pot - Dum Subz',
    image: '/assets/food/biryani.jpg',
    description: 'Aged basmati rice, seasonal vegetables, saffron, crispy onions.',
    category: 'Mains',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 9,
    tags: []
  },
  {
    id: 'main-5',
    name: 'Sourdough Burrata Margherita Pizza',
    image: '/assets/food/pizza.jpg',
    description: 'Cold-fermented crust, San Marzano sugo, burrata globe, sweet basil.',
    category: 'Mains',
    price: 480,
    isVeg: true,
    isAvailable: true,
    sortOrder: 10,
    tags: []
  },
  {
    id: 'main-6',
    name: 'Smoked Tofu & Basil Pad Thai',
    image: '/assets/food/noodles.jpg',
    description: 'Rice noodles, wok-charred tofu, roasted peanuts, bean sprouts.',
    category: 'Mains',
    price: 390,
    isVeg: true,
    isAvailable: true,
    sortOrder: 11,
    tags: []
  },

  // --- BEVERAGES (100% Pure Veg Artisanal Soft Drinks) ---
  {
    id: 'bev-1',
    name: 'Kashmiri Saffron Filter Kaapi',
    image: '/assets/food/cold_brew.jpg',
    description: 'South Indian chicory coffee with saffron foam and cardamom dust.',
    category: 'Beverages',
    price: 140,
    isVeg: true,
    isAvailable: true,
    sortOrder: 12,
    tags: []
  },
  {
    id: 'bev-2',
    name: 'Chikmagalur Single Origin Cold Brew',
    image: '/assets/food/cold_brew.jpg',
    description: '18-hour cold-steeped Arabica coffee with elderflower tonic.',
    category: 'Beverages',
    price: 210,
    isVeg: true,
    isAvailable: true,
    sortOrder: 13,
    tags: []
  },
  {
    id: 'bev-3',
    name: 'Spiced Jamun Cooler',
    image: '/assets/food/mocktail.jpg',
    description: 'Wild jamun extract, black salt, garden mint, and chilled soda.',
    category: 'Beverages',
    price: 160,
    isVeg: true,
    isAvailable: true,
    sortOrder: 14,
    tags: []
  },
  {
    id: 'bev-4',
    name: 'Hibiscus Berry Raw Kombucha',
    image: '/assets/food/mocktail.jpg',
    description: 'Probiotic sparkling fermented tea with hibiscus petals and blueberries.',
    category: 'Beverages',
    price: 195,
    isVeg: true,
    isAvailable: true,
    sortOrder: 15,
    tags: []
  },
  {
    id: 'bev-5',
    name: 'Ceremonial Matcha Pistachio Frappe',
    image: '/assets/food/matcha.jpg',
    description: 'Uji ceremonial matcha blended with pistachio cream and almond milk.',
    category: 'Beverages',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 16,
    tags: []
  },
  {
    id: 'bev-6',
    name: 'Passionfruit & Chili Iced Tea',
    image: '/assets/food/mocktail.jpg',
    description: 'Darjeeling black tea, passionfruit purée, and a hint of bird\'s eye chili.',
    category: 'Beverages',
    price: 190,
    isVeg: true,
    isAvailable: true,
    sortOrder: 17,
    tags: []
  },
  {
    id: 'bev-7',
    name: 'Kesari Masala Cutting Chai',
    image: '/assets/food/cold_brew.jpg',
    description: 'Assam tea simmered with fresh ginger, cardamom, and lemongrass.',
    category: 'Beverages',
    price: 80,
    isVeg: true,
    isAvailable: true,
    sortOrder: 18,
    tags: []
  },

  // --- DESSERTS (Pure Veg) ---
  {
    id: 'des-1',
    name: 'Kesari Shrikhand Cheesecake',
    image: '/assets/food/cheesecake.jpg',
    description: 'Baked saffron & cardamom hung curd on spiced biscuit crust.',
    category: 'Desserts',
    price: 260,
    isVeg: true,
    isAvailable: true,
    sortOrder: 19,
    tags: []
  },
  {
    id: 'des-2',
    name: 'Warm 70% Dark Chocolate Fondant',
    image: '/assets/food/tiramisu.jpg',
    description: 'Belgian dark chocolate cake with molten core, vanilla bean gelato.',
    category: 'Desserts',
    price: 320,
    isVeg: true,
    isAvailable: true,
    sortOrder: 20,
    tags: []
  },
  {
    id: 'des-3',
    name: 'Saffron & Roasted Pistachio Tres Leches',
    image: '/assets/food/cheesecake.jpg',
    description: 'Sponge cake steeped in saffron milk, whipped vanilla cream, gold dust.',
    category: 'Desserts',
    price: 295,
    isVeg: true,
    isAvailable: true,
    sortOrder: 21,
    tags: []
  },
  {
    id: 'des-4',
    name: 'Hot Gulab Jamun Sundae',
    image: '/assets/food/tiramisu.jpg',
    description: 'Warm saffron gulab jamuns, malai kulfi, toasted pistachio slivers.',
    category: 'Desserts',
    price: 190,
    isVeg: true,
    isAvailable: true,
    sortOrder: 22,
    tags: []
  },

  // --- CHEF SPECIALS (Pure Veg) ---
  {
    id: 'spec-1',
    name: 'Charcoal Truffle Paneer Tikka Steak',
    image: '/assets/food/paneer.jpg',
    description: 'Woodfire charred paneer steak, black garlic, white truffle ghee.',
    category: 'Chef Specials',
    price: 495,
    isVeg: true,
    isAvailable: true,
    sortOrder: 23,
    tags: []
  },
  {
    id: 'spec-2',
    name: 'Truffle Mushroom Kulcha Platter',
    image: '/assets/food/pizza.jpg',
    description: 'Amritsari kulcha with porcini & shiitake, slow-cooked Pindi chole.',
    category: 'Chef Specials',
    price: 360,
    isVeg: true,
    isAvailable: true,
    sortOrder: 24,
    tags: []
  },
  {
    id: 'spec-3',
    name: 'Memory Studio Artisanal Cheese Grazing Platter',
    image: '/assets/food/bruschetta.jpg',
    description: 'Artisanal smoked cheeses, black olive tapenade, walnut sourdough, grapes.',
    category: 'Chef Specials',
    price: 580,
    isVeg: true,
    isAvailable: true,
    sortOrder: 25,
    tags: []
  },
  {
    id: 'spec-4',
    name: 'Kesari Royal Pure Veg Feast (Limited)',
    image: '/assets/food/biryani.jpg',
    description: 'Saffron pulao, paneer lababdar, dal makhani, artisanal breads, shrikhand.',
    category: 'Chef Specials',
    price: 550,
    isVeg: true,
    isAvailable: false,
    sortOrder: 26,
    tags: []
  }
];

const DEFAULT_ARTISTS = [
  {
    id: 'art-aarav-sharma',
    name: 'Aarav Sharma',
    genre: 'Vocalists',
    email: 'aarav.sharma@example.com',
    phone: '+919876543210',
    city: 'Bangalore',
    photoUrl: '/assets/events/real_kesari/kesari_ev_01.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sample-aarav',
    instagram: '@aaravmusic',
    channel: 'https://youtube.com/@aaravmusic',
    previousEvents: 'NH7 Weekender 2025, Bangalore Open Air, 40+ Acoustic Nights',
    achievements: 'Winner of Bangalore Indie Voice 2024; debut EP charted #1 on Indie India',
    costPerEvent: 15000,
    openMic: true,
    extraDetails: 'Bilingual singer-songwriter (Hindi & English acoustic pop/indie) performing with loop pedal and acoustic guitar.',
    status: 'approved',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'art-bgc-collective',
    name: 'The Bangalore Groove Collective',
    genre: 'Bands',
    email: 'contact@bgcband.in',
    phone: '+919845012345',
    city: 'Bangalore',
    photoUrl: '/assets/events/real_kesari/kesari_ev_51.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sample-bgc',
    instagram: '@bgc_live',
    channel: 'https://youtube.com/@bgclive',
    previousEvents: 'Fandom Gigs, Hard Rock Cafe Bengaluru Tour, Kesari Monsoon Fest 2025',
    achievements: 'Rolling Stone India Band to Watch 2025; Featured on Red Bull Tour Bus',
    costPerEvent: 35000,
    openMic: false,
    extraDetails: '5-piece funk, neo-soul & fusion band with brass section, live synths, and powerhouse rhythms.',
    status: 'approved',
    createdAt: '2026-01-15T12:00:00.000Z'
  },
  {
    id: 'art-rhea-nambiar',
    name: 'Rhea Nambiar',
    genre: 'Stand-up',
    email: 'rhea.comedy@example.com',
    phone: '+919811223344',
    city: 'Bangalore',
    photoUrl: '/assets/events/real_kesari/kesari_ev_06.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sample-rhea',
    instagram: '@rheacomedy',
    channel: 'https://youtube.com/@rheanambiar',
    previousEvents: 'Habitat Mumbai, Canvas Laugh Club, That Comedy Club Koramangala',
    achievements: 'Amazon Prime MiniTV Special Comic, 2M+ views on YouTube special clip',
    costPerEvent: 20000,
    openMic: true,
    extraDetails: 'Sharp, relatable bilingual observational standup comedy about corporate life, dating in Bangalore, and indie studio culture.',
    status: 'approved',
    createdAt: '2026-02-01T15:30:00.000Z'
  }
];

export function createStore(file) {
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS records(kind TEXT NOT NULL,id TEXT NOT NULL,value TEXT NOT NULL,PRIMARY KEY(kind,id))');
  const all = kind => db.prepare('SELECT value FROM records WHERE kind=?').all(kind).map(r => JSON.parse(r.value));
  const get = (kind,id) => { const row = db.prepare('SELECT value FROM records WHERE kind=? AND id=?').get(kind,id); return row ? JSON.parse(row.value) : null; };
  const put = (kind,id,value) => { db.prepare('INSERT OR REPLACE INTO records VALUES(?,?,?)').run(kind,id,JSON.stringify(value)); return value; };
  const del = (kind,id) => { db.prepare('DELETE FROM records WHERE kind=? AND id=?').run(kind,id); };
  const fail = (message,status=400) => { throw Object.assign(new Error(message),{status}); };
  const text = (value,max=300) => typeof value === 'string' ? value.trim().slice(0,max) : '';
  const imageURL = value => !value || /^https?:\/\//i.test(value) || /^\/assets\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..');

  const FORBIDDEN_WORDS = /\b(chicken|mutton|fish|prawn|lamb|yakitori|tenderloin|wings?|beef|pork|meat|eggs?|alcohol|beer|wine|whiskey|vodka|rum|cocktails?)\b/i;

  if (!get('settings','main')) put('settings','main',{upiId:'kesari.memory@okhdfcbank',payeeName:'',email:'Kesari.memory@gmail.com',phone:'+917760539955'});

  // Pre-seed menu categories
  if (all('menu_category').length === 0) {
    for (const cat of DEFAULT_CATEGORIES) put('menu_category', cat.id, cat);
  }

  // --- DATABASE MIGRATION: Purge any non-veg or alcoholic items ---
  const existingMenuItems = all('menu_item');
  const hasInvalidItems = existingMenuItems.some(item => !item.isVeg || FORBIDDEN_WORDS.test(item.name + ' ' + (item.description || '')));
  if (hasInvalidItems || existingMenuItems.length === 0) {
    db.prepare("DELETE FROM records WHERE kind='menu_item'").run();
    for (const item of DEFAULT_MENU_ITEMS) {
      put('menu_item', item.id, item);
    }
  }

  // Pre-seed approved artists
  if (all('artist').length === 0) {
    for (const art of DEFAULT_ARTISTS) put('artist', art.id, art);
  }

  function sold(id) { return all('order').filter(o => o.eventId === id && o.status === 'confirmed').reduce((n,o) => n+o.quantity,0); }

  function publicContent() {
    const events = all('event').filter(e => e.published).map(e => ({...e,remaining:Math.max(0,e.capacity-sold(e.id))}));
    return {events,landingEvents:selectLandingEvents(events),settings:get('settings','main')};
  }

  function event(data,id) {
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) fail('Invalid event ID.');
    const previous = get('event',id) || {};
    const title=text(data.title,120),date=text(data.date,60),description=text(data.description,3000),terms=text(data.terms,2000);
    const price=data.price === '' || data.price == null ? null : Number(data.price),capacity=Number(data.capacity);
    const featureOrder=Number(data.featureOrder || 0),imageUrl=text(data.imageUrl,1000),landingImage=text(data.landingImage,1000);
    if (!title || !Number.isFinite(Date.parse(date)) || !Number.isInteger(capacity) || capacity<1 || capacity>2000 || price !== null && (!Number.isFinite(price) || price<1 || price>100000)) fail('Enter a title, valid date, capacity and ticket price.');
    if (!Number.isInteger(featureOrder) || featureOrder<0 || featureOrder>999) fail('Featured position must be between 0 and 999.');
    if (!imageURL(imageUrl) || !imageURL(landingImage)) fail('Use an HTTP(S) image URL or a local /assets/ image.');
    const bookingMode=data.bookingMode === 'upi' ? 'upi' : 'external',externalUrl=text(data.externalUrl,1000);
    if (externalUrl && !/^https:\/\//.test(externalUrl)) fail('External booking links must use HTTPS.');
    if (data.bookingOpen && (!data.published || Date.parse(date)<=Date.now() || !terms || bookingMode==='upi' && price===null || bookingMode==='external' && !externalUrl)) fail('Open bookings require a published future event, booking terms, and a price or external booking link.');
    if (capacity<sold(id)) fail('Capacity cannot be lower than confirmed tickets.');
    return put('event',id,{...previous,id,title,date,description,terms,price,capacity,category:['Music','Workshops','Community'].includes(data.category)?data.category:'Music',image:/^[a-z0-9_-]{1,40}$/.test(data.image)?data.image:'music',imageUrl,landingImage,published:!!data.published,bookingOpen:!!data.bookingOpen,bookingMode,externalUrl,featured:!!data.featured,featureOrder,showOnLanding:data.showOnLanding!==false,updatedAt:new Date().toISOString()});
  }

  function order(data) {
    const e=get('event',data.eventId),settings=get('settings','main');
    if (!e || !e.published || !e.bookingOpen || e.bookingMode!=='upi' || Date.parse(e.date)<=Date.now() || !Number.isFinite(e.price) || e.price<=0) fail('Bookings are not open for this event.');
    if (!settings.payeeName || !/^[\w.-]+@[\w.-]+$/.test(settings.upiId)) fail('UPI payment setup is incomplete.');
    if (data.acceptedTerms!==true) fail('Please accept the booking terms.');
    const quantity=Number(data.quantity),name=text(data.name,80),email=text(data.email,150),phone=text(data.phone,18);
    if (!Number.isInteger(quantity) || quantity<1 || quantity>6 || !name || !/^\S+@\S+\.\S+$/.test(email) || !/^[+0-9 ()-]{10,18}$/.test(phone)) fail('Check your contact details and ticket quantity.');
    if (sold(e.id)+quantity>e.capacity) fail('Not enough tickets remain.');
    const key=text(data.requestKey,80);
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(key)) fail('Invalid booking request. Reload the booking form.');
    const prior=all('order').find(o=>o.requestKey===key); if(prior) return prior;
    const id=randomUUID(),token=randomBytes(24).toString('hex');
    return put('order',id,{id,token,requestKey:key,eventId:e.id,eventTitle:e.title,eventDate:e.date,eventImage:e.image,imageUrl:e.imageUrl||'',name,email,phone,quantity,amount:Math.round(e.price*quantity*100)/100,status:'awaiting_payment',createdAt:new Date().toISOString(),upiId:settings.upiId,payeeName:settings.payeeName,reference:'KES-'+id.slice(0,8).toUpperCase(),terms:e.terms});
  }

  function payment(id,utr) {
    const o=get('order',id);if(!o)fail('Booking not found.',404);
    if(!/^[A-Za-z0-9-]{8,40}$/.test(utr))fail('Enter the transaction reference from your UPI app.');
    if(['confirmed','rejected'].includes(o.status))fail('This booking has already been reviewed.',409);
    if(all('order').some(x=>x.id!==id&&x.utr?.toLowerCase()===utr.toLowerCase()))fail('This payment reference was already submitted.',409);
    return put('order',id,{...o,utr,status:'pending_review',submittedAt:new Date().toISOString()});
  }

  function review(id,status) {
    const o=get('order',id);if(!o)fail('Booking not found.',404);
    if(!['confirmed','rejected'].includes(status))fail('Invalid review status.');
    if(o.status==='confirmed'&&status==='confirmed')return o;
    if(o.status!=='pending_review')fail('Only submitted payments can be reviewed.');
    if(status==='confirmed'){const e=get('event',o.eventId);if(!e||sold(e.id)+o.quantity>e.capacity)fail('Capacity reached. Arrange a refund instead of confirming.');o.ticketCode=randomBytes(20).toString('hex');}
    return put('order',id,{...o,status,reviewedAt:new Date().toISOString()});
  }

  // --- Menu Collections & CRUD Helpers (Strictly Pure Veg & Soft Drinks) ---
  function allMenuCategories() {
    return all('menu_category').sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  function allMenuItems() {
    return all('menu_item').sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  function getMenu() {
    return {
      categories: allMenuCategories().map(c => typeof c === 'string' ? c : c.name),
      items: allMenuItems()
    };
  }

  function createMenuItem(data) {
    const name = text(data.name, 120);
    if (!name) fail('Item name is required.');
    if (data.isVeg === false) fail('Kesari is strictly 100% Pure Vegetarian.');
    const desc = text(data.description, 500);
    if (FORBIDDEN_WORDS.test(name + ' ' + desc)) {
      fail('Kesari is strictly 100% Pure Vegetarian and Soft Drinks only.');
    }
    const price = Number(data.price);
    if (!Number.isFinite(price) || price < 0) fail('Price must be a valid non-negative number.');
    const id = (data.id && typeof data.id === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(data.id)) ? data.id : 'item-' + randomUUID();
    const existingItems = allMenuItems();
    const sortOrder = Number.isInteger(Number(data.sortOrder)) ? Number(data.sortOrder) : existingItems.length + 1;
    const item = {
      id,
      name,
      description: desc,
      category: text(data.category, 60) || 'Chef Specials',
      price,
      isVeg: true,
      isAvailable: data.isAvailable !== false,
      sortOrder,
      tags: Array.isArray(data.tags) ? data.tags : ['Pure Veg'],
      updatedAt: new Date().toISOString()
    };
    return put('menu_item', id, item);
  }

  function updateMenuItem(id, data) {
    const current = get('menu_item', id);
    if (!current) fail('Menu item not found.', 404);
    const name = data.name !== undefined ? text(data.name, 120) : current.name;
    if (!name) fail('Item name is required.');
    if (data.isVeg === false) fail('Kesari is strictly 100% Pure Vegetarian.');
    const desc = data.description !== undefined ? text(data.description, 500) : current.description;
    if (FORBIDDEN_WORDS.test(name + ' ' + desc)) {
      fail('Kesari is strictly 100% Pure Vegetarian and Soft Drinks only.');
    }
    let price = current.price;
    if (data.price !== undefined) {
      price = Number(data.price);
      if (!Number.isFinite(price) || price < 0) fail('Price must be a valid non-negative number.');
    }
    const sortOrder = data.sortOrder !== undefined ? Number(data.sortOrder) : current.sortOrder;
    const updated = {
      ...current,
      name,
      description: desc,
      category: data.category !== undefined ? text(data.category, 60) : current.category,
      price,
      isVeg: true,
      isAvailable: data.isAvailable !== undefined ? !!data.isAvailable : current.isAvailable,
      sortOrder: Number.isInteger(sortOrder) ? sortOrder : current.sortOrder,
      tags: Array.isArray(data.tags) ? data.tags : (current.tags || ['Pure Veg']),
      updatedAt: new Date().toISOString()
    };
    return put('menu_item', id, updated);
  }

  function deleteMenuItem(id) {
    const current = get('menu_item', id);
    if (!current) fail('Menu item not found.', 404);
    del('menu_item', id);
    return { ok: true, id };
  }

  // --- Artist Registrations ---
  function publicArtist(a) {
    if (!a) return null;
    const { phone, email, ...rest } = a;
    return rest;
  }

  function createArtist(data) {
    const name = text(data.name, 100);
    const email = text(data.email, 150);
    const phone = text(data.phone, 30);
    const city = text(data.city, 80);
    if (!name) fail('Full name / Stage name is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) fail('Valid email address is required.');
    if (!validateIndianPhone(phone)) fail('Valid 10-digit Indian phone number is required.');
    if (!city) fail('City is required.');

    const cost = data.costPerEvent !== undefined && data.costPerEvent !== '' ? Number(data.costPerEvent) : 0;
    if (!Number.isFinite(cost) || cost < 0) fail('Cost per event must be a valid number.');

    const id = 'art_' + randomBytes(8).toString('hex');
    const record = {
      id,
      name,
      genre: text(data.genre, 60) || 'Vocalists',
      email,
      phone,
      city,
      photoUrl: text(data.photoUrl, 500000),
      videoUrl: text(data.videoUrl, 1000),
      instagram: text(data.instagram, 100),
      channel: text(data.channel, 1000),
      previousEvents: text(data.previousEvents, 3000),
      achievements: text(data.achievements, 2000),
      costPerEvent: cost,
      openMic: data.openMic === true || data.openMic === 'true' || data.openMic === 'yes',
      extraDetails: text(data.extraDetails, 3000),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return put('artist', id, record);
  }

  function reviewArtist(id, status) {
    const art = get('artist', id);
    if (!art) fail('Artist not found.', 404);
    if (!['approved', 'rejected', 'pending'].includes(status)) fail('Invalid status.');
    const updated = {
      ...art,
      status,
      reviewedAt: new Date().toISOString()
    };
    return put('artist', id, updated);
  }

  // --- Hall Bookings ---
  function createBooking(data) {
    const name = text(data.name, 100);
    const phone = text(data.phone, 30);
    const email = text(data.email, 150);
    const hallId = text(data.hallId, 80);
    const hallName = text(data.hallName, 120);
    const date = text(data.date, 60);

    if (!name) fail('Name is required.');
    if (!validateIndianPhone(phone)) fail('Valid 10-digit Indian phone number is required.');
    if (email && !/^\S+@\S+\.\S+$/.test(email)) fail('Invalid email address.');
    if (!hallId && !hallName) fail('Hall selection is required.');
    if (!date) fail('Event date is required.');

    const guests = Number(data.guests || 1);
    const id = randomUUID();
    const bookingCode = 'KSR-BKG-' + randomBytes(4).toString('hex').toUpperCase();

    const record = {
      id,
      bookingCode,
      name,
      phone,
      email: email || '',
      hallId: hallId || 'main-stage',
      hallName: hallName || 'Kesari Main Stage & Hall',
      eventType: text(data.eventType, 80) || 'Private Event',
      date,
      startTime: text(data.startTime, 30),
      endTime: text(data.endTime, 30),
      guests: Number.isInteger(guests) && guests > 0 ? guests : 1,
      extras: Array.isArray(data.extras) ? data.extras : (data.extras ? [data.extras] : []),
      notes: text(data.notes, 2000),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return put('booking', id, record);
  }

  function updateBookingStatus(id, status) {
    const booking = get('booking', id);
    if (!booking) fail('Booking not found.', 404);
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) fail('Invalid booking status.');
    const updated = {
      ...booking,
      status,
      updatedAt: new Date().toISOString()
    };
    return put('booking', id, updated);
  }

  // --- Bulk Food Orders ---
  function createBulkFoodOrder(data) {
    const name = text(data.name, 100);
    const phone = text(data.phone, 30);
    const orderType = text(data.orderType, 40) || 'Delivery';
    const address = text(data.address, 300);
    const date = text(data.date, 60);
    const timeNeeded = text(data.timeNeeded, 40);

    if (!name) fail('Name is required.');
    if (!validateIndianPhone(phone)) fail('Valid 10-digit Indian phone number is required.');
    if (!date) fail('Event date is required.');
    if (orderType.toLowerCase() === 'delivery' && !address) fail('Delivery address is required for delivery orders.');

    const guests = Number(data.guests || 1);
    const estimatedTotal = Number(data.estimatedTotal || 0);
    const id = randomUUID();
    const orderCode = 'KSR-FOOD-' + randomBytes(4).toString('hex').toUpperCase();

    const record = {
      id,
      orderCode,
      name,
      phone,
      orderType,
      address,
      date,
      timeNeeded,
      guests: Number.isInteger(guests) && guests > 0 ? guests : 1,
      items: Array.isArray(data.items) ? data.items : [],
      dietary: text(data.dietary, 50) || 'Pure Veg',
      notes: text(data.notes, 2000),
      estimatedTotal: Number.isFinite(estimatedTotal) && estimatedTotal >= 0 ? estimatedTotal : 0,
      status: 'received',
      createdAt: new Date().toISOString()
    };
    return put('bulk_food', id, record);
  }

  function updateBulkFoodStatus(id, status) {
    const order = get('bulk_food', id);
    if (!order) fail('Bulk food order not found.', 404);
    if (!['received', 'confirmed', 'completed', 'cancelled'].includes(status)) fail('Invalid bulk food status.');
    const updated = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };
    return put('bulk_food', id, updated);
  }

  return {
    db,
    all,
    get,
    put,
    del,
    fail,
    text,
    validateIndianPhone,
    event,
    order,
    payment,
    review,
    publicContent,
    // Menu (Strictly Pure Veg & Soft Drinks)
    allMenuCategories,
    allMenuItems,
    getMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    // Artists
    publicArtist,
    createArtist,
    reviewArtist,
    // Bookings
    createBooking,
    updateBookingStatus,
    // Bulk Food
    createBulkFoodOrder,
    updateBulkFoodStatus
  };
}
