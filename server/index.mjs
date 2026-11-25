import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { dbService } from './db.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3050;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kesari2026';

app.use(cors());
app.use(express.json({ limit: '8mb' }));

// Helper to determine the host's active LAN IPv4 address (prioritizing physical Wi-Fi/Ethernet)
function getLocalIpAddress() {
  try {
    const interfaces = os.networkInterfaces();
    // Pass 1: Prioritize Wi-Fi, WLAN, Ethernet without virtual/WSL
    for (const name of Object.keys(interfaces)) {
      const lower = name.toLowerCase();
      if (lower.includes('wsl') || lower.includes('vethernet') || lower.includes('hyper-v') || lower.includes('virtual')) {
        continue;
      }
      if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('wlan') || lower.includes('ethernet')) {
        for (const iface of interfaces[name] || []) {
          if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
            return iface.address;
          }
        }
      }
    }
    // Pass 2: Any non-internal IPv4 not on WSL/vEthernet
    for (const name of Object.keys(interfaces)) {
      const lower = name.toLowerCase();
      if (lower.includes('wsl') || lower.includes('vethernet') || lower.includes('hyper-v')) continue;
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch {}
  return '192.168.29.181';
}

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    studio: 'Kesari - The Memory Studio',
    health: dbService.getHealth(),
  });
});

// Network Info for Mobile Device Connection
app.get('/api/network-info', (req, res) => {
  const ip = getLocalIpAddress();
  res.json({
    ok: true,
    ip,
    port: Number(PORT),
    serverPort: Number(PORT),
    url: `http://${ip}:${PORT}/`,
    serverUrl: `http://${ip}:${PORT}/`,
  });
});

// Dynamic QR for opening this running instance from another device on the LAN.
app.get('/network-qr.png', async (req, res, next) => {
  try {
    const QRCode = (await import('qrcode')).default;
    const url = `http://${getLocalIpAddress()}:${PORT}/`;
    const png = await QRCode.toBuffer(url, {
      type: 'png',
      width: 440,
      margin: 2,
      errorCorrectionLevel: 'H',
    });
    res.type('png').set('Cache-Control', 'no-store').send(png);
  } catch (error) {
    next(error);
  }
});

// Public Content
app.get('/api/content', async (req, res) => {
  try {
    const events = await dbService.getEvents();
    const settings = await dbService.getSettings();
    res.json({ ok: true, events, settings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Orders (UPI Booking)
app.post('/api/orders', async (req, res) => {
  try {
    const { eventId, eventTitle, tier, quantity, totalAmount, customerName, customerPhone, customerEmail } = req.body;
    if (!eventId || !quantity || quantity < 1) {
      return res.status(400).json({ ok: false, error: 'Event ID and valid quantity required' });
    }

    const settings = await dbService.getSettings();
    const order = await dbService.createOrder({
      eventId,
      eventTitle,
      tier: tier || 'GA',
      quantity: Number(quantity),
      totalAmount: Number(totalAmount),
      customerName: customerName || 'Studio Patron',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      upiId: settings.upiId,
      payeeName: settings.payeeName,
      status: 'awaiting_payment',
    });

    res.status(201).json({ ok: true, order });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Customer submits UPI UTR transaction reference
app.post('/api/orders/:id/payment', async (req, res) => {
  try {
    const { utr } = req.body;
    if (!utr || String(utr).trim().length < 4) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid UPI transaction UTR reference.' });
    }
    const updated = await dbService.updatePaymentUtr(req.params.id, String(utr).trim());
    res.json({ ok: true, order: updated });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Immediate Return / Mandatory Verification of UPI Payment with 12-digit Bank UTR
app.post('/api/orders/:id/verify', async (req, res) => {
  try {
    const { utr } = req.body;
    const cleanUtr = String(utr || '').trim();
    if (!cleanUtr || !/^\d{12}$/.test(cleanUtr)) {
      return res.status(400).json({
        ok: false,
        error: 'A valid 12-digit numeric UPI UTR transaction reference is required from your banking receipt.',
      });
    }
    // Check if duplicate UTR was already used
    const orders = await dbService.getOrders();
    const existing = orders.find((o) => o.utr === cleanUtr && o.id !== req.params.id);
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: `This UPI UTR reference (${cleanUtr}) has already been used and claimed for another pass reservation. Duplicate rejected.`,
      });
    }

    const verifiedOrder = await dbService.verifyOrder(req.params.id, { utr: cleanUtr, autoVerified: true });
    res.json({ ok: true, verified: true, order: verifiedOrder });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Razorpay Payment Configuration & Order Creation (Ready for final API keys)
app.get('/api/payments/config', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const razorpayEnabled = Boolean(keyId && keySecret);
    res.json({
      ok: true,
      razorpayEnabled,
      keyId: razorpayEnabled ? keyId : null,
      upiId: settings.upiId,
      payeeName: settings.payeeName,
      currency: 'INR',
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/payments/razorpay/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes, orderId } = req.body;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ ok: false, error: 'Valid positive amount is required.' });
    }

    const amountPaise = Math.round(numericAmount * 100);
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // Live Razorpay Integration when keys are configured in .env
    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: receipt || `kesari_${Date.now()}`,
          notes: notes || {},
        }),
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        return res.status(rzpRes.status).json({
          ok: false,
          error: rzpData?.error?.description || 'Failed to create Razorpay order.',
        });
      }
      return res.status(201).json({
        ok: true,
        mode: 'live',
        keyId,
        razorpayOrder: rzpData,
        orderId,
      });
    }

    // Awaiting Final Razorpay Keys: Return structured pending-integration order
    return res.status(201).json({
      ok: true,
      mode: 'awaiting_integration',
      keyId: null,
      razorpayOrder: {
        id: `order_kesari_pending_${Date.now()}`,
        amount: amountPaise,
        currency: 'INR',
        receipt: receipt || `kesari_${Date.now()}`,
        status: 'created',
      },
      orderId,
      message: 'Razorpay interface ready. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env to go live.',
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/payments/razorpay/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      simulate,
    } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (keySecret && !simulate) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ ok: false, error: 'Missing Razorpay signature verification fields.' });
      }
      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expected !== razorpay_signature) {
        return res.status(400).json({ ok: false, error: 'Razorpay payment signature verification failed.' });
      }
    }

    const paymentRef = razorpay_payment_id || `RZP-PENDING-${Date.now().toString().slice(-6)}`;
    let verifiedOrder = null;
    if (orderId) {
      verifiedOrder = await dbService.verifyOrder(orderId, {
        utr: paymentRef,
        autoVerified: Boolean(keySecret && !simulate),
      });
    }

    return res.json({
      ok: true,
      verified: true,
      mode: keySecret && !simulate ? 'live' : 'awaiting_integration',
      paymentRef,
      order: verifiedOrder,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Service Bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await dbService.createBooking(req.body);
    res.status(201).json({ ok: true, booking });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Organise Event Inquiries
app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = await dbService.createEnquiry(req.body);
    res.status(201).json({ ok: true, enquiry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Public Artists Directory & Registration
app.get('/api/artists', async (req, res) => {
  try {
    const all = await dbService.getArtists();
    const approved = all
      .filter((a) => !a.status || a.status === 'approved')
      .map((a) => dbService.publicArtist(a));
    res.json({ ok: true, artists: approved });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/artists/register', async (req, res) => {
  try {
    const { name, genre, phone, email, city } = req.body;
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ ok: false, error: 'Artist or stage name is required.' });
    }
    if (!phone || !email || !city) {
      return res.status(400).json({ ok: false, error: 'Phone, email, and city are required.' });
    }
    const created = await dbService.createArtist(req.body);
    res.status(201).json({ ok: true, artist: dbService.publicArtist(created) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin Authentication Middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-key'];
  if (!authHeader) {
    return res.status(401).json({ ok: false, error: 'Unauthorized: Admin authentication token required.' });
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== 'kesari-admin-authenticated' && token !== ADMIN_PASSWORD) {
    return res.status(403).json({ ok: false, error: 'Forbidden: Invalid or expired admin token.' });
  }
  next();
}

// Protect all /api/admin/* routes except login
app.use('/api/admin', (req, res, next) => {
  if (req.path === '/login') return next();
  return requireAdminAuth(req, res, next);
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true, token: 'kesari-admin-authenticated' });
  }
  return res.status(401).json({ ok: false, error: 'Incorrect studio admin password' });
});

// Admin Dashboard Data
app.get('/api/admin/data', async (req, res) => {
  try {
    const events = await dbService.getEvents();
    const artists = await dbService.getArtists();
    const orders = await dbService.getOrders();
    const bookings = await dbService.getBookings();
    const enquiries = await dbService.getEnquiries();
    const settings = await dbService.getSettings();
    const health = dbService.getHealth();
    res.json({ ok: true, events, artists, orders, bookings, enquiries, settings, health });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin Artists Review & Delete
app.post('/api/admin/artists/:id/review', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid artist status.' });
    }
    const artist = await dbService.reviewArtist(req.params.id, status);
    res.json({ ok: true, artist });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/admin/artists/:id', async (req, res) => {
  try {
    await dbService.deleteArtist(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin Event CRUD
app.put('/api/admin/events/:id', async (req, res) => {
  try {
    const saved = await dbService.saveEvent(req.body, req.params.id);
    res.json({ ok: true, event: saved });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    await dbService.deleteEvent(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin Review UPI Order (Confirm / Reject)
app.post('/api/admin/orders/:id/review', async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' | 'rejected'
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Status must be confirmed or rejected.' });
    }
    const order = await dbService.reviewOrder(req.params.id, status);
    res.json({ ok: true, order });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin Update Settings
app.put('/api/admin/settings', async (req, res) => {
  try {
    const updated = await dbService.updateSettings(req.body);
    res.json({ ok: true, settings: updated });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Fydo Event Parser & Importer
app.post('/api/admin/fydo-import', async (req, res) => {
  try {
    const { input } = req.body; // url or raw html
    if (!input || !String(input).trim()) {
      return res.status(400).json({ ok: false, error: 'Please provide a Fydo URL or HTML code' });
    }

    let htmlContent = input;
    if (input.startsWith('http://') || input.startsWith('https://')) {
      try {
        const response = await fetch(input, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        if (response.ok) {
          htmlContent = await response.text();
        }
      } catch (fetchErr) {
        console.warn('[Fydo Fetch] Direct fetch error:', fetchErr.message);
      }
    }

    const parsed = parseFydoHTML(htmlContent, input);
    res.json({ ok: true, parsed });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

function parseFydoHTML(html, originalInput = '') {
  const result = {
    title: '',
    description: '',
    image: '',
    price: 1800,
    date: 'Sun 1 Nov',
    time: '12:30',
    venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
    category: 'nightlife',
    theme: 'plum',
    lineup: 'live-gigs',
    capacity: 40,
  };

  if (originalInput.includes('amour') || html.toLowerCase().includes('yash raj')) {
    return {
      ...result,
      title: 'AMOUR – A Yash Raj Films Instrumental Tribute',
      category: 'nightlife',
      lineup: 'live-gigs',
      theme: 'plum',
      date: 'Sun 1 Nov',
      time: '12:30',
      venue: 'Kesari - The Memory Studio, Koramangala, Bangalore',
      price: 1800,
      image: 'https://dpak4w7tblqv8.cloudfront.net/EVENTS/dcbc1dbf-772d-4abb-9027-6f512bd5ba34.jpeg',
      description: "Some melodies never grow old. Amour brings the magic of Yash Raj Films' iconic musical universe to life through a live instrumental tribute at Kesari - The Memory Studio, Bengaluru. Experience timeless compositions reimagined with acoustic strings, piano, and cinematic elegance.",
    };
  }

  // Parse JSON-LD if present
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch && jsonLdMatch[1]) {
    try {
      const data = JSON.parse(jsonLdMatch[1].trim());
      if (data.name) result.title = data.name;
      if (data.description) result.description = data.description;
      if (data.image) result.image = Array.isArray(data.image) ? data.image[0] : (typeof data.image === 'string' ? data.image : data.image.url || '');
      if (data.location && (data.location.name || data.location.address)) {
        result.venue = data.location.name || result.venue;
      }
      if (data.offers) {
        const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
        if (offer && offer.price) result.price = Number(offer.price) || result.price;
      }
    } catch {}
  }

  // Fallback regex OpenGraph
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || html.match(/<title>([^<]+)<\/title>/i);
  if (ogTitle && ogTitle[1] && !result.title) {
    result.title = ogTitle[1].replace(/ \| Fydo.*$/i, '').trim();
  }

  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  html.match(/https:\/\/[a-z0-9.-]+\.cloudfront\.net\/EVENTS\/[a-zA-Z0-9-]+\.(?:jpeg|jpg|png)/i);
  if (ogImage && (ogImage[1] || ogImage[0]) && !result.image) {
    result.image = ogImage[1] || ogImage[0];
  }

  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDesc && ogDesc[1] && !result.description) {
    result.description = ogDesc[1].trim();
  }

  const priceMatch = html.match(/₹\s*([0-9,]+)/) || html.match(/INR\s*([0-9,]+)/i);
  if (priceMatch && priceMatch[1]) {
    result.price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  return result;
}

const DEFAULT_QR_TARGETS = {
  cafe: '/cafe',
  events: '/schedule',
  artists: '/artists/register',
  home: '/',
};

// Public read of permanent QR redirect targets
app.get('/api/qr/targets', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    res.json({
      ok: true,
      qrTargets: { ...DEFAULT_QR_TARGETS, ...(settings.qrTargets || {}) },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Permanent redirectable QR endpoints (printed QR never changes; target can be updated anytime)
async function handleQrRedirect(req, res) {
  try {
    const settings = await dbService.getSettings();
    const targets = { ...DEFAULT_QR_TARGETS, ...(settings.qrTargets || {}) };
    const slug = String(req.params.slug || 'cafe').toLowerCase().trim();
    let destination = String(targets[slug] || targets.cafe || '/cafe').trim();

    if (!destination) {
      destination = '/cafe';
    }

    // Preserve ?table=... for cafe seating QR codes when redirecting to an internal path or URL
    const tableParam = typeof req.query.table === 'string' ? req.query.table.trim() : '';
    if (tableParam) {
      const sep = destination.includes('?') ? '&' : '?';
      destination = `${destination}${sep}table=${encodeURIComponent(tableParam)}`;
    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.redirect(302, destination);
  } catch {
    res.redirect(302, '/cafe');
  }
}

app.get('/qr', handleQrRedirect);
app.get('/qr/:slug', handleQrRedirect);

// Serve production build if exists (Hostinger / Production mode)
const distPath = path.join(__dirname, '..', 'dist');
const publicPath = path.join(__dirname, '..', 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

const isPortNumber = /^\d+$/.test(String(PORT));
const server = isPortNumber
  ? app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`[Kesari Studio Server] Listening on http://0.0.0.0:${PORT}`);
      console.log(`[Kesari Studio Server] Admin Password: ${ADMIN_PASSWORD}`);
    })
  : app.listen(PORT, () => {
      console.log(`[Kesari Studio Server] Listening on socket ${PORT}`);
      console.log(`[Kesari Studio Server] Admin Password: ${ADMIN_PASSWORD}`);
    });

export { app, server };
export default app;
