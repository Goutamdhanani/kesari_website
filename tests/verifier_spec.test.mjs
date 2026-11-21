import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createStore } from '../server/store.mjs';
import { createApp } from '../server/app.mjs';

test('Spec Verification: Full Priority 0 to Priority 3 System Validation', async () => {
  const store = createStore(':memory:');
  const app = createApp(store, 'verifier-admin-password');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';

  async function api(url, method = 'GET', body, token) {
    const res = await fetch(origin + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    let data;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { status: res.status, data, headers: res.headers };
  }

  try {
    // ----------------------------------------------------
    // PRIORITY 0: Permanent QR Menu System & Instant Updates
    // ----------------------------------------------------
    const menuRes = await api('/api/menu');
    assert.equal(menuRes.status, 200);
    assert.ok(Array.isArray(menuRes.data.categories), 'Menu has categories array');
    assert.ok(Array.isArray(menuRes.data.items), 'Menu has items array');
    assert.ok(menuRes.data.items.length >= 10, 'Menu has pre-seeded items');

    // Verify item schema
    const sampleItem = menuRes.data.items[0];
    assert.ok(sampleItem.id, 'Item has id');
    assert.ok(sampleItem.name, 'Item has name');
    assert.ok(typeof sampleItem.price === 'number', 'Price is a number');
    assert.ok(typeof sampleItem.isVeg === 'boolean', 'isVeg is a boolean');
    assert.ok(typeof sampleItem.isAvailable === 'boolean', 'isAvailable is a boolean');
    assert.ok(sampleItem.category, 'Item has category');

    // Login as Admin
    const loginRes = await api('/api/admin/login', 'POST', { password: 'verifier-admin-password' });
    assert.equal(loginRes.status, 200);
    cookie = loginRes.headers.get('set-cookie').split(';')[0];

    // Admin Menu CRUD: Instant reflection
    const newDish = {
      name: 'Verifier Special Smoked Paneer',
      description: 'Charcoal smoked cottage cheese with microgreens',
      category: 'Starters',
      price: 350,
      isVeg: true,
      isAvailable: true,
      sortOrder: 99
    };
    const addDishRes = await api('/api/admin/menu', 'POST', newDish);
    assert.equal(addDishRes.status, 201);
    const addedId = addDishRes.data.id;
    assert.ok(addedId, 'Added dish has ID');

    // Instant check on public /api/menu
    let publicMenu = await api('/api/menu');
    const foundAdded = publicMenu.data.items.find(i => i.id === addedId);
    assert.ok(foundAdded, 'Added dish instantly appears in public /api/menu');
    assert.equal(foundAdded.price, 350);

    // Instant Price Update via PUT
    const updateRes = await api(`/api/admin/menu/${addedId}`, 'PUT', { price: 395, isAvailable: false });
    assert.equal(updateRes.status, 200);

    publicMenu = await api('/api/menu');
    const updatedDish = publicMenu.data.items.find(i => i.id === addedId);
    assert.equal(updatedDish.price, 395, 'Price change reflected instantly');
    assert.equal(updatedDish.isAvailable, false, 'Availability toggle reflected instantly');

    // Admin Delete
    const delRes = await api(`/api/admin/menu/${addedId}`, 'DELETE');
    assert.equal(delRes.status, 200);
    publicMenu = await api('/api/menu');
    assert.equal(publicMenu.data.items.some(i => i.id === addedId), false, 'Deleted dish removed from public menu');

    // Verify QR Assets on disk
    assert.ok(fs.existsSync(path.resolve('public/menu-qr-highres.png')), 'menu-qr-highres.png exists');
    assert.ok(fs.statSync(path.resolve('public/menu-qr-highres.png')).size > 1000, 'menu-qr-highres.png is valid size');
    assert.ok(fs.existsSync(path.resolve('public/menu-qr.svg')), 'menu-qr.svg exists');
    const svgContent = fs.readFileSync(path.resolve('public/menu-qr.svg'), 'utf8');
    assert.match(svgContent, /<svg/i, 'menu-qr.svg contains valid SVG markup');
    assert.ok(fs.existsSync(path.resolve('public/menu-qr-print.html')), 'menu-qr-print.html exists');

    // ----------------------------------------------------
    // PRIORITY 1: Artist Directory & Registration Validation
    // ----------------------------------------------------
    // Public directory returns ONLY approved artists
    const artistsRes = await api('/api/artists');
    assert.equal(artistsRes.status, 200);
    assert.ok(Array.isArray(artistsRes.data), 'Artists response is an array');
    assert.ok(artistsRes.data.length >= 1, 'Contains pre-seeded approved artists');
    for (const a of artistsRes.data) {
      assert.equal(a.status, 'approved', 'Every public artist is approved');
      assert.equal(a.phone, undefined, 'Private phone number is never exposed in public directory');
      assert.equal(a.email, undefined, 'Private email is never exposed in public directory');
    }

    // Artist Registration Validation
    // 1. Invalid Indian phone number should be rejected (400)
    const invalidPhoneRes = await api('/api/artists/register', 'POST', {
      name: 'Invalid Phone Artist',
      phone: '12345',
      genre: 'Rock',
      city: 'Bangalore'
    });
    assert.equal(invalidPhoneRes.status, 400, 'Invalid phone number rejected with 400');

    // 2. Honeypot anti-spam should be rejected
    const honeypotRes = await api('/api/artists/register', 'POST', {
      name: 'Spam Bot Artist',
      phone: '+91 98765 43210',
      genre: 'Metal',
      city: 'Bangalore',
      website_url_hp: 'http://spam-link.ru'
    });
    assert.equal(honeypotRes.status, 400, 'Honeypot filled submission rejected');

    // 3. Valid submission succeeds and is pending
    const validArtist = {
      name: 'Koramangala Strings',
      phone: '+91 99887 76655',
      email: 'strings@kesari.live',
      genre: 'Acoustic / Indie',
      city: 'Bangalore',
      costPerEvent: 15000,
      openMic: true,
      instagram: '@koramangala_strings'
    };
    const registerRes = await api('/api/artists/register', 'POST', validArtist);
    assert.equal(registerRes.status, 201, 'Valid artist registration returns 201');
    assert.equal(registerRes.data.status, 'pending', 'Registration status is pending');
    const newArtistId = registerRes.data.id;

    // Verify it does NOT appear in public GET /api/artists
    const publicArtistsAfter = await api('/api/artists');
    assert.equal(publicArtistsAfter.data.some(a => a.id === newArtistId), false, 'Pending artist is not visible publicly');

    // Admin reviews and approves artist
    const approveRes = await api(`/api/admin/artists/${newArtistId}/review`, 'POST', { status: 'approved' });
    assert.equal(approveRes.status, 200);

    const publicArtistsApproved = await api('/api/artists');
    assert.ok(publicArtistsApproved.data.some(a => a.id === newArtistId), 'Approved artist is now visible publicly');

    // ----------------------------------------------------
    // PRIORITY 2: Hall Bookings Lifecycle & Validation
    // ----------------------------------------------------
    // Invalid phone rejection
    const invalidBookingPhone = await api('/api/bookings', 'POST', {
      name: 'Test Booker',
      phone: '5551234',
      hallId: 'main-stage',
      date: '2026-12-01',
      startTime: '14:00',
      endTime: '18:00',
      guests: 50
    });
    assert.equal(invalidBookingPhone.status, 400, 'Invalid booking phone rejected');

    // Valid booking request
    const validBooking = {
      name: 'Dev Concert Collective',
      phone: '9845012345',
      email: 'dev@collective.live',
      hallId: 'acoustic-lounge',
      hallName: 'Acoustic Lounge & Jam Studio',
      eventType: 'Concert',
      date: '2026-12-15',
      startTime: '18:00',
      endTime: '22:00',
      guests: 40,
      extras: ['sound-engineer', 'recording']
    };
    const bookingRes = await api('/api/bookings', 'POST', validBooking);
    assert.equal(bookingRes.status, 201, 'Booking accepted with 201');
    assert.ok(bookingRes.data.id || bookingRes.data.bookingCode, 'Booking has reference identifier');

    // Admin Booking Status Management
    const bookingId = bookingRes.data.id;
    const confirmBookingRes = await api(`/api/admin/bookings/${bookingId}/status`, 'POST', { status: 'confirmed' });
    assert.equal(confirmBookingRes.status, 200);
    assert.equal(confirmBookingRes.data.status, 'confirmed');

    // ----------------------------------------------------
    // PRIORITY 2: Bulk Food Orders Lifecycle & Validation
    // ----------------------------------------------------
    // Invalid phone rejection
    const invalidFoodRes = await api('/api/bulk-food', 'POST', {
      name: 'Food Orderer',
      phone: 'abc123',
      orderType: 'Delivery',
      date: '2026-12-20',
      timeNeeded: '19:00',
      guests: 30,
      items: [{ id: 'starter-1', quantity: 10 }]
    });
    assert.equal(invalidFoodRes.status, 400, 'Invalid food order phone rejected');

    // Valid bulk food order
    const validBulkOrder = {
      name: 'Bangalore Jazz Club',
      phone: '+91 97400 11223',
      orderType: 'At Kesari Event',
      date: '2026-12-25',
      timeNeeded: '20:00',
      guests: 45,
      items: [
        { id: 'starter-1', name: 'Truffle Parmesan Hand-Cut Fries', quantity: 15, price: 260 },
        { id: 'main-1', name: 'Wild Mushroom & Truffle Risotto', quantity: 20, price: 440 }
      ],
      dietary: 'Mixed',
      notes: 'Please arrange separate serving cutlery for Jain guests',
      estimatedTotal: 12700
    };
    const bulkOrderRes = await api('/api/bulk-food', 'POST', validBulkOrder);
    assert.equal(bulkOrderRes.status, 201, 'Bulk food order accepted with 201');
    assert.ok(bulkOrderRes.data.id || bulkOrderRes.data.orderCode, 'Order has reference code');

    // Admin Bulk Food Order Status Management
    const foodOrderId = bulkOrderRes.data.id;
    const confirmFoodRes = await api(`/api/admin/bulk-food/${foodOrderId}/status`, 'POST', { status: 'confirmed' });
    assert.equal(confirmFoodRes.status, 200);
    assert.equal(confirmFoodRes.data.status, 'confirmed');

    // Admin Overview includes all domains
    const adminOverview = await api('/api/admin');
    assert.equal(adminOverview.status, 200);
    assert.ok(adminOverview.data.menu && Array.isArray(adminOverview.data.menu.items), 'Admin overview includes menu items');
    assert.ok(Array.isArray(adminOverview.data.artists), 'Admin overview includes artists');
    assert.ok(Array.isArray(adminOverview.data.bookings), 'Admin overview includes bookings');
    assert.ok(Array.isArray(adminOverview.data.bulkFood), 'Admin overview includes bulkFood');

    // ----------------------------------------------------
    // PRIORITY 3: Static Asset & Component Integrity
    // ----------------------------------------------------
    assert.ok(fs.existsSync(path.resolve('public/assets/star-marker.png')), 'Star marker image exists');

    const expectedComponents = [
      'src/components/menu/MenuScreen.jsx',
      'src/components/menu/MenuScreen.css',
      'src/components/navigation/MainNavbar.jsx',
      'src/components/navigation/MainNavbar.css',
      'src/components/landing/LandingPage.jsx',
      'src/components/landing/LandingPage.css',
      'src/components/booking/BookUsScreen.jsx',
      'src/components/booking/BookUsScreen.css',
      'src/components/booking/HostEventScreen.jsx',
      'src/components/booking/HostEventScreen.css',
      'src/components/audio/AudioRentalScreen.jsx',
      'src/components/audio/AudioRentalScreen.css',
      'src/components/artists/ArtistRegisterScreen.jsx',
      'src/components/artists/ArtistRegisterScreen.css',
      'src/components/artists/ArtistDirectoryScreen.jsx',
      'src/components/artists/ArtistDirectoryScreen.css',
      'src/components/food/BulkFoodOrderScreen.jsx',
      'src/components/food/BulkFoodOrderScreen.css',
      'src/components/gallery/VenueGalleryScreen.jsx',
      'src/components/gallery/EventGalleryScreen.jsx',
      'src/components/gallery/gallery.css',
      'src/components/contact/ContactUsScreen.jsx',
      'src/components/contact/ContactUsScreen.css',
      'src/components/admin/EventAdminModal.jsx',
      'src/components/admin/EventAdminModal.css',
      'src/components/mobile/MobileFrame.jsx'
    ];

    for (const file of expectedComponents) {
      assert.ok(fs.existsSync(path.resolve(file)), `Component file exists: ${file}`);
    }

  } finally {
    await new Promise(r => server.close(r));
    store.db.close();
  }
});
