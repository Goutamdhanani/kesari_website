import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_EVENTS,
  INITIAL_PASSES,
  SERVICE_CATALOG,
  calculateTicketQuote,
  computeStudioMetrics,
  createServiceBooking,
  createStudioEvent,
  filterEvents,
  getUpiAppLinks,
  isValidUpiUtr,
  purchaseTickets,
  toggleEventLiveStatus,
  togglePassCheckIn,
  toggleSavedId,
} from './studioLogic';

test('calculateTicketQuote computes tier multiplier and 6% fee accurately', () => {
  const ga = calculateTicketQuote(1000, 'GA', 2);
  assert.equal(ga.unitPrice, 1000);
  assert.equal(ga.subtotal, 2000);
  assert.equal(ga.studioFee, 120);
  assert.equal(ga.total, 2120);

  const vip = calculateTicketQuote(1000, 'VIP', 1);
  assert.equal(vip.unitPrice, 1650);
  assert.equal(vip.studioFee, 99);
  assert.equal(vip.total, 1749);
});

test('purchaseTickets decrements remaining seats and mints a new pass', () => {
  const result = purchaseTickets(INITIAL_EVENTS, INITIAL_PASSES, {
    eventId: 'evt-neon-monolith',
    tier: 'VIP',
    quantity: 3,
    timestamp: '2026-11-17T00:00:00Z',
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    const updatedEvent = result.events.find((e) => e.id === 'evt-neon-monolith');
    assert.equal(updatedEvent?.sold, 185);
    assert.equal(result.passes.length, INITIAL_PASSES.length + 1);
    assert.equal(result.mintedPass.quantity, 3);
    assert.equal(result.mintedPass.checkedIn, false);
    assert.match(result.mintedPass.passCode, /^DST-\d{4}$/);
  }
});

test('purchaseTickets rejects paused events and over-capacity requests', () => {
  const pausedEvents = toggleEventLiveStatus(INITIAL_EVENTS, 'evt-neon-monolith');
  const pausedAttempt = purchaseTickets(pausedEvents, INITIAL_PASSES, {
    eventId: 'evt-neon-monolith',
    tier: 'GA',
    quantity: 1,
  });
  assert.equal(pausedAttempt.ok, false);

  const overCapAttempt = purchaseTickets(INITIAL_EVENTS, INITIAL_PASSES, {
    eventId: 'evt-ember-supper',
    tier: 'GA',
    quantity: 12,
  });
  assert.equal(overCapAttempt.ok, false);
});

test('togglePassCheckIn updates pass state and metrics ratio', () => {
  const before = computeStudioMetrics(INITIAL_EVENTS, INITIAL_PASSES);
  assert.equal(before.checkedInPasses, 1);
  assert.equal(before.totalPasses, 2);

  const toggled = togglePassCheckIn(INITIAL_PASSES, 'pass-seed-2');
  const after = computeStudioMetrics(INITIAL_EVENTS, toggled);
  assert.equal(after.checkedInPasses, 2);
});

test('createStudioEvent validates required fields and prepends new event', () => {
  const invalid = createStudioEvent(INITIAL_EVENTS, {
    title: 'Hi',
    artistOrHost: '',
    category: 'music',
    theme: 'plum',
    venue: '',
    city: 'Mumbai',
    dateLabel: '',
    timeLabel: '',
    basePrice: 50,
    capacity: 5,
    description: '',
  });
  assert.equal(invalid.ok, false);

  const valid = createStudioEvent(INITIAL_EVENTS, {
    title: 'Obsidian Echoes',
    artistOrHost: 'Rohan Rao',
    category: 'music',
    lineup: 'live-gigs',
    theme: 'indigo',
    venue: 'Dome Atelier',
    city: 'Mumbai',
    dateLabel: 'Fri 5 Dec',
    timeLabel: '21:00',
    basePrice: 1800,
    capacity: 150,
    description: 'Spatial synth concert.',
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.events.length, INITIAL_EVENTS.length + 1);
    assert.equal(valid.events[0].title, 'Obsidian Echoes');
    assert.equal(valid.events[0].isLive, true);
  }
});

test('filterEvents filters by category, lineup, dateBucket, and search query', () => {
  const nightlife = filterEvents(INITIAL_EVENTS, 'nightlife', '');
  assert.equal(nightlife.length >= 2, true);

  const tonight = filterEvents(INITIAL_EVENTS, 'all', '', 'all', 'tonight');
  assert.equal(tonight.length >= 2, true);

  const amour = filterEvents(INITIAL_EVENTS, 'all', 'Yash Raj');
  assert.equal(amour.length, 1);
  assert.equal(amour[0].id, 'amour');
});

test('createServiceBooking validates duration and computes booking total', () => {
  const bad = createServiceBooking([], {
    option: SERVICE_CATALOG.space[0],
    duration: 0,
    scheduleNote: '',
  });
  assert.equal(bad.ok, false);

  const good = createServiceBooking([], {
    option: SERVICE_CATALOG.space[0],
    duration: 3,
    scheduleNote: 'Rehearsal Night',
  });
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.equal(good.created.totalPaid, 3 * SERVICE_CATALOG.space[0].rate);
    assert.match(good.created.bookingCode, /^SVC-\d{4}$/);
  }
});

test('toggleSavedId adds and removes event IDs', () => {
  const added = toggleSavedId([], 'evt-neon-monolith');
  assert.deepEqual(added, ['evt-neon-monolith']);
  const removed = toggleSavedId(added, 'evt-neon-monolith');
  assert.deepEqual(removed, []);
});

test('getUpiAppLinks generates correct deep links for phone apps', () => {
  const links = getUpiAppLinks({
    amount: 1908,
    note: 'Amour Pass',
    ref: 'KSR123',
  });

  assert.equal(links.intent.startsWith('upi://pay?'), true);
  assert.equal(links.gpay.startsWith('tez://upi/pay?'), true);
  assert.equal(links.phonepe.startsWith('phonepe://pay?'), true);
  assert.equal(links.paytm.startsWith('paytmmp://pay?'), true);
  assert.equal(links.cred.startsWith('cred://pay?'), true);
  assert.equal(links.intent.includes('am=1908.00'), true);
  assert.equal(links.intent.includes('pa=kesari.memory%40okhdfcbank') || links.intent.includes('pa=kesari.memory@okhdfcbank'), true);
});

test('isValidUpiUtr validates 12-digit transaction references', () => {
  assert.equal(isValidUpiUtr('432109876543'), true);
  assert.equal(isValidUpiUtr('  432109876543  '), true);
  assert.equal(isValidUpiUtr('HDFC123456789'), true);
  assert.equal(isValidUpiUtr(''), false);
  assert.equal(isValidUpiUtr('123'), false);
});
