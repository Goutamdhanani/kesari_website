import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../server/store.mjs';
import {createApp} from '../server/app.mjs';

test('one API connects admin management, landing selection, guest booking and payment review', async () => {
  const store = createStore(':memory:');
  const app = createApp(store, 'integration-only-password');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';

  async function call(url, method = 'GET', body, token) {
    const r = await fetch(origin + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        ...(token ? {Authorization: 'Bearer ' + token} : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return {status: r.status, data: await r.json(), headers: r.headers};
  }

  try {
    assert.equal((await call('/api/admin')).status, 401);
    assert.equal((await call('/api/admin/login', 'POST', {password: 'wrong'})).status, 401);

    const login = await call('/api/admin/login', 'POST', {password: 'integration-only-password'});
    assert.equal(login.status, 200);
    cookie = login.headers.get('set-cookie').split(';')[0];
    assert.match(login.headers.get('set-cookie'), /HttpOnly/);

    const base = {title: 'Test near event', date: '2099-01-01T20:00:00+05:30', price: 299, capacity: 10, published: true, bookingOpen: true, bookingMode: 'upi', terms: 'Test terms', showOnLanding: true};
    assert.equal((await call('/api/admin/events/near', 'PUT', base)).status, 200);
    assert.equal((await call('/api/admin/events/late', 'PUT', {...base, title: 'Test featured event', date: '2099-02-01', featured: true})).status, 200);

    let content = (await call('/api/content')).data;
    assert.deepEqual(content.landingEvents.map(e => e.id), ['late', 'near']);

    await call('/api/admin/events/late', 'PUT', {...base, title: 'Hidden from landing', date: '2099-02-01', showOnLanding: false});
    content = (await call('/api/content')).data;
    assert.deepEqual(content.landingEvents.map(e => e.id), ['near']);
    assert.equal(content.events.length, 2);

    await call('/api/admin/settings', 'PUT', {upiId: 'test@bank', payeeName: 'Test Merchant', email: 'test@example.com', phone: '9876543210'});
    const created = await call('/api/orders', 'POST', {eventId: 'near', name: 'Test Guest', email: 'test@example.com', phone: '9876543210', quantity: 2, amount: 1, acceptedTerms: true, requestKey: 'integration-test-key-123456'});
    assert.equal(created.status, 201);
    assert.equal(created.data.amount, 598);
    const o = created.data;

    assert.equal((await call('/api/orders/' + o.id)).status, 404);
    assert.equal((await call('/api/orders/' + o.id + '/payment', 'POST', {utr: 'TEST123456789'}, o.token)).data.status, 'pending_review');
    assert.equal((await call('/api/admin/orders/' + o.id + '/review', 'POST', {status: 'confirmed'})).data.status, 'confirmed');

    const confirmed = (await call('/api/orders/' + o.id, 'GET', null, o.token)).data;
    assert.ok(confirmed.ticketCode);
    assert.equal(confirmed.token, undefined);

    const foreign = await fetch(origin + '/api/admin/settings', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', Cookie: cookie, Origin: 'https://untrusted.example'},
      body: '{}'
    });
    assert.equal(foreign.status, 403);
  } finally {
    await new Promise(r => server.close(r));
    store.db.close();
  }
});

test('Menu API: public fetching and admin CRUD operations', async () => {
  const store = createStore(':memory:');
  const app = createApp(store, 'test-admin-pass');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';

  async function call(url, method = 'GET', body) {
    const r = await fetch(origin + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return {status: r.status, data: await r.json()};
  }

  try {
    // 1. Public Menu Fetch
    const menuRes = await call('/api/menu');
    assert.equal(menuRes.status, 200);
    assert.ok(Array.isArray(menuRes.data.categories));
    assert.ok(Array.isArray(menuRes.data.items));
    assert.ok(menuRes.data.categories.length >= 5);
    assert.ok(menuRes.data.items.length >= 15);

    const first = menuRes.data.items[0];
    assert.ok(first.id);
    assert.ok(first.name);
    assert.ok(first.category);
    assert.ok(typeof first.price === 'number');
    assert.equal(typeof first.isVeg, 'boolean');
    assert.equal(typeof first.isAvailable, 'boolean');

    // 2. Admin CRUD requires authentication
    assert.equal((await call('/api/admin/menu', 'POST', {name: 'Test Tea', price: 90})).status, 401);

    // Login
    const login = await call('/api/admin/login', 'POST', {password: 'test-admin-pass'});
    assert.equal(login.status, 200);

    // Read cookie
    const authHeaders = await fetch(origin + '/api/admin/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password: 'test-admin-pass'})
    });
    cookie = authHeaders.headers.get('set-cookie').split(';')[0];

    // Admin create menu item
    const newItem = {
      name: 'Kashmiri Kahwa Tea',
      description: 'Slow-brewed green tea with saffron, whole cinnamon and roasted almonds',
      category: 'Beverages',
      price: 130,
      isVeg: true,
      isAvailable: true
    };
    const createRes = await call('/api/admin/menu', 'POST', newItem);
    assert.equal(createRes.status, 201);
    assert.equal(createRes.data.name, 'Kashmiri Kahwa Tea');
    const createdId = createRes.data.id;

    // Admin update menu item
    const updateRes = await call('/api/admin/menu/' + createdId, 'PUT', {price: 150, isAvailable: false});
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.data.price, 150);
    assert.equal(updateRes.data.isAvailable, false);

    // Verify in public menu
    const updatedMenu = await call('/api/menu');
    const found = updatedMenu.data.items.find(i => i.id === createdId);
    assert.ok(found);
    assert.equal(found.price, 150);
    assert.equal(found.isAvailable, false);

    // Admin delete menu item
    const deleteRes = await call('/api/admin/menu/' + createdId, 'DELETE');
    assert.equal(deleteRes.status, 200);
    assert.equal(deleteRes.data.ok, true);

    // Verify gone
    const finalMenu = await call('/api/menu');
    assert.equal(finalMenu.data.items.find(i => i.id === createdId), undefined);
  } finally {
    await new Promise(r => server.close(r));
    store.db.close();
  }
});

test('Artist API: public registration with Indian phone validation, privacy sanitization, and admin review', async () => {
  const store = createStore(':memory:');
  const app = createApp(store, 'test-admin-pass');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';

  async function call(url, method = 'GET', body) {
    const r = await fetch(origin + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return {status: r.status, data: await r.json()};
  }

  try {
    // 1. GET /api/artists returns pre-seeded approved artists without phone or email
    const artistsRes = await call('/api/artists');
    assert.equal(artistsRes.status, 200);
    assert.ok(artistsRes.data.length >= 3);
    for (const artist of artistsRes.data) {
      assert.equal(artist.status, 'approved');
      assert.equal(artist.phone, undefined, 'Public artist must NOT expose phone');
      assert.equal(artist.email, undefined, 'Public artist must NOT expose email');
      assert.ok(artist.name);
      assert.ok(artist.genre);
    }

    // 2. Registration validation - Invalid phone fails
    const invalidPhoneRes = await call('/api/artists/register', 'POST', {
      name: 'Sneha Rao',
      email: 'sneha@example.com',
      phone: '1234567890', // does not start with 6-9
      city: 'Bangalore'
    });
    assert.equal(invalidPhoneRes.status, 400);

    // 3. Valid registration with Indian phone format
    const validArtist = {
      name: 'Sneha Rao',
      genre: 'Vocalists',
      email: 'sneha@example.com',
      phone: '+91 98451 23456',
      city: 'Bangalore',
      photoUrl: 'https://images.unsplash.com/photo-example',
      videoUrl: 'https://youtube.com/watch?v=sneha',
      instagram: '@snehavocals',
      channel: 'https://youtube.com/@sneha',
      previousEvents: 'Koramangala Live Series 2025',
      achievements: 'Best Indie Vocalist 2025',
      costPerEvent: 12000,
      openMic: true,
      extraDetails: 'Acoustic indie & jazz vocalist'
    };
    const registerRes = await call('/api/artists/register', 'POST', validArtist);
    assert.equal(registerRes.status, 201);
    assert.equal(registerRes.data.name, 'Sneha Rao');
    assert.equal(registerRes.data.status, 'pending');
    assert.equal(registerRes.data.phone, undefined);
    assert.equal(registerRes.data.email, undefined);
    const newArtistId = registerRes.data.id;

    // Public GET /api/artists still does NOT include the pending artist
    const publicAfterReg = await call('/api/artists');
    assert.equal(publicAfterReg.data.some(a => a.id === newArtistId), false);

    // Login as admin
    const loginRes = await fetch(origin + '/api/admin/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password: 'test-admin-pass'})
    });
    cookie = loginRes.headers.get('set-cookie').split(';')[0];

    // Admin sees all artists including pending, with full contact details
    const adminArtistsRes = await call('/api/admin/artists');
    assert.equal(adminArtistsRes.status, 200);
    const adminFound = adminArtistsRes.data.find(a => a.id === newArtistId);
    assert.ok(adminFound);
    assert.equal(adminFound.status, 'pending');
    assert.equal(adminFound.phone, '+91 98451 23456');
    assert.equal(adminFound.email, 'sneha@example.com');

    // Admin approves artist
    const reviewRes = await call('/api/admin/artists/' + newArtistId + '/review', 'POST', {status: 'approved'});
    assert.equal(reviewRes.status, 200);
    assert.equal(reviewRes.data.status, 'approved');

    // Now public GET /api/artists includes the newly approved artist
    const publicAfterApproval = await call('/api/artists');
    const publicFound = publicAfterApproval.data.find(a => a.id === newArtistId);
    assert.ok(publicFound);
    assert.equal(publicFound.status, 'approved');
    assert.equal(publicFound.phone, undefined);
  } finally {
    await new Promise(r => server.close(r));
    store.db.close();
  }
});

test('Hall Bookings & Bulk Food Orders: public submission and admin lifecycle', async () => {
  const store = createStore(':memory:');
  const app = createApp(store, 'test-admin-pass');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';

  async function call(url, method = 'GET', body) {
    const r = await fetch(origin + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return {status: r.status, data: await r.json()};
  }

  try {
    // 1. Hall Booking - validation
    const badBooking = await call('/api/bookings', 'POST', {name: 'Kabir'});
    assert.equal(badBooking.status, 400);

    // Valid Hall Booking
    const bookingPayload = {
      name: 'Kabir Sen',
      phone: '+919876543210',
      email: 'kabir@example.com',
      hallId: 'main-stage',
      hallName: 'Kesari Main Stage & Hall',
      eventType: 'Music Album Launch',
      date: '2026-12-10',
      startTime: '17:00',
      endTime: '22:00',
      guests: 90,
      extras: ['Line array sound system', 'Stage lighting'],
      notes: 'Need sound check at 4 PM'
    };
    const bookingRes = await call('/api/bookings', 'POST', bookingPayload);
    assert.equal(bookingRes.status, 201);
    assert.equal(bookingRes.data.name, 'Kabir Sen');
    assert.equal(bookingRes.data.status, 'pending');
    assert.match(bookingRes.data.bookingCode, /^KSR-BKG-[A-F0-9]{8}$/);
    const bookingId = bookingRes.data.id;

    // 2. Bulk Food Order - validation
    const badFood = await call('/api/bulk-food', 'POST', {
      name: 'Meera',
      phone: '+919876543210',
      orderType: 'Delivery'
      // missing address and date
    });
    assert.equal(badFood.status, 400);

    // Valid Bulk Food Order
    const foodPayload = {
      name: 'Meera Patel',
      phone: '9876543210',
      orderType: 'Delivery',
      address: 'Indiranagar 100ft Road, Bangalore',
      date: '2026-12-12',
      timeNeeded: '12:30',
      guests: 30,
      items: [
        {id: 'item-paneer-bruschetta', name: 'Paneer Tikka Bruschetta', quantity: 30, price: 220},
        {id: 'item-saffron-filter-coffee', name: 'Kesari Saffron Filter Coffee', quantity: 30, price: 120}
      ],
      dietary: 'Veg',
      notes: 'Please pack in eco-friendly warm containers',
      estimatedTotal: 10200
    };
    const foodRes = await call('/api/bulk-food', 'POST', foodPayload);
    assert.equal(foodRes.status, 201);
    assert.equal(foodRes.data.name, 'Meera Patel');
    assert.equal(foodRes.data.status, 'received');
    assert.match(foodRes.data.orderCode, /^KSR-FOOD-[A-F0-9]{8}$/);
    assert.equal(foodRes.data.estimatedTotal, 10200);
    const foodId = foodRes.data.id;

    // 3. Admin Authentication & Management
    const loginRes = await fetch(origin + '/api/admin/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password: 'test-admin-pass'})
    });
    cookie = loginRes.headers.get('set-cookie').split(';')[0];

    // Admin overview check
    const adminOverview = await call('/api/admin');
    assert.equal(adminOverview.status, 200);
    assert.ok(Array.isArray(adminOverview.data.bookings));
    assert.ok(Array.isArray(adminOverview.data.bulkFood));
    assert.ok(adminOverview.data.menu);
    assert.ok(Array.isArray(adminOverview.data.artists));

    // Admin updates booking status
    const updateBooking = await call('/api/admin/bookings/' + bookingId + '/status', 'POST', {status: 'confirmed'});
    assert.equal(updateBooking.status, 200);
    assert.equal(updateBooking.data.status, 'confirmed');

    // Admin updates bulk food status
    const updateFood = await call('/api/admin/bulk-food/' + foodId + '/status', 'POST', {status: 'confirmed'});
    assert.equal(updateFood.status, 200);
    assert.equal(updateFood.data.status, 'confirmed');
  } finally {
    await new Promise(r => server.close(r));
    store.db.close();
  }
});
