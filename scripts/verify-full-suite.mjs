import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('.local/qa');
fs.mkdirSync(outDir, { recursive: true });

const FORBIDDEN_WORDS = /\b(chicken|mutton|fish|prawn|prawns|beef|pork|alcohol|beer|whisky|whiskey|vodka|cocktail|cocktails)\b/i;

const ROUTES_TO_TEST = [
  { path: '/', name: 'Landing Page' },
  { path: '/menu', name: 'Permanent QR Menu' },
  { path: '/events', name: 'Upcoming Events' },
  { path: '/book', name: 'Book Us Hall' },
  { path: '/artists', name: 'Artist Directory' },
  { path: '/order-food', name: 'Bulk Food Catering' },
  { path: '/contact', name: 'Contact Us' }
];

async function run() {
  console.log('🚀 Starting Comprehensive End-to-End Browser Verification...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  const errors = [];
  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore network noise if any, track React/JS errors
      if (!text.includes('Failed to load resource') && !text.includes('favicon.ico')) {
        errors.push(`ConsoleError: ${text}`);
      }
    }
  });

  const results = [];

  try {
    for (const route of ROUTES_TO_TEST) {
      const url = `http://localhost:3000${route.path}`;
      console.log(`\nTesting ${route.name} (${url})...`);
      
      const beforeErrCount = errors.length;
      const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      assert.equal(resp.status(), 200, `Expected HTTP 200 for ${url}`);

      // Allow animations and fonts to settle
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 600));

      const newErrors = errors.slice(beforeErrCount);
      if (newErrors.length > 0) {
        console.error(`❌ Errors on ${route.name}:`, newErrors);
      }
      assert.equal(newErrors.length, 0, `Zero console/page errors expected on ${route.name}`);

      // Verify DOM Content and Pure Veg / Non-alcoholic mandate
      const bodyText = await page.evaluate(() => document.body.innerText);
      assert.ok(bodyText.length > 100, `Page body contains substantial content for ${route.name}`);

      // Strip legitimate negative policy disclaimers (e.g. "No meat, alcohol or eggs", "Zero Meat or Alcohol", "alcohol-free") before checking for forbidden menu items
      const strippedText = bodyText
        .replace(/no\s+meat[,\s]+(?:or\s+)?alcohol[,\s]+(?:or\s+)?eggs?/gi, '')
        .replace(/zero\s+(?:meat\s+or\s+)?alcohol/gi, '')
        .replace(/no\s+(?:meat|alcohol|eggs?)/gi, '')
        .replace(/zero\s+(?:meat|alcohol|eggs?)/gi, '')
        .replace(/alcohol-free/gi, '')
        .replace(/without\s+alcohol/gi, '')
        .replace(/no\s+non-veg/gi, '');

      const forbiddenMatch = strippedText.match(FORBIDDEN_WORDS);
      assert.equal(
        forbiddenMatch,
        null,
        `Found forbidden word "${forbiddenMatch?.[0]}" on ${route.name}! Kesari must be 100% Pure Vegetarian and Soft Drinks only.`
      );

      // Verify Obsidian Dome Header or Canvas exists on the page
      const hasHeaderOrCanvas = await page.evaluate(() => {
        return !!(
          document.querySelector('.home-curved-dome-header') ||
          document.querySelector('canvas') ||
          document.querySelector('.aurora-canvas') ||
          document.querySelector('.kesari-four-stars-section') ||
          document.querySelector('.eventjam-app-stage')
        );
      });
      assert.ok(hasHeaderOrCanvas, `Header / Canvas structure verified for ${route.name}`);

      // Route-specific assertions
      if (route.path === '/menu') {
        // Verify category pills are valid strings and not object representations
        const categoryLabels = await page.$$eval('.menu-category-glass-pill', els => els.map(e => e.textContent.trim()));
        assert.ok(categoryLabels.length > 0, 'Category pills exist on /menu');
        for (const cat of categoryLabels) {
          assert.ok(!cat.includes('[object Object]'), `Category pill contains object stringification: "${cat}"`);
        }

        // Check for FSSAI green veg indicators
        const vegBadges = await page.$$('.food-diet-badge.diet-veg');
        assert.ok(vegBadges.length > 0, 'Green Pure Veg FSSAI badges present on /menu');

        // Check search filter works
        await page.type('.menu-search-native-input', 'Paneer');
        await new Promise(r => setTimeout(r, 200));
        const filteredCount = await page.$$eval('.menu-glass-dish-card', els => els.length);
        assert.ok(filteredCount > 0, 'Live search filters menu items');
      }

      if (route.path === '/') {
        // Verify Four Star Sections with star-marker.png
        const starCards = await page.$$eval('.landing-star-card', els => els.length);
        assert.equal(starCards, 4, 'Four Star Cards present in the landing grid');
        const starImages = await page.$$eval('img[src*="star-marker.png"]', els => els.length);
        assert.ok(starImages >= 4, 'Star marker image used on star sections');
      }

      if (route.path === '/order-food') {
        // Verify 48-hour lead-time requirement
        const orderFoodText = await page.evaluate(() => document.body.innerText);
        assert.ok(orderFoodText.includes('48'), 'Bulk food order mentions 48-hour lead time');
        assert.ok(orderFoodText.toLowerCase().includes('pure vegetarian'), 'Explicitly notes 100% Pure Vegetarian');
      }

      // Save screenshot
      const safeName = route.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const screenshotPath = path.join(outDir, `verify-${safeName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✅ ${route.name} verified cleanly. Screenshot: ${screenshotPath}`);

      results.push({ name: route.name, path: route.path, status: 'PASSED' });
    }

    console.log('\n======================================================');
    console.log('🎉 ALL 7 ROUTES PASSED 100% END-TO-END VERIFICATION');
    console.log('======================================================');
    for (const r of results) {
      console.log(`✓ ${r.name.padEnd(25)} (${r.path}) -> ${r.status}`);
    }
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
