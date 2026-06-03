import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5199';
const VP = { width: 375, height: 812 };
const OUT = 'D:/JavaNo1/verify-screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize(VP);

const jsErrors = [];
page.on('pageerror', e => jsErrors.push(e.message));

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
}

async function check(label, fn) {
  try {
    const result = await fn();
    console.log(`ok  ${label}${result !== undefined ? ': ' + result : ''}`);
  } catch (e) {
    console.log(`ERR ${label}: ${e.message}`);
  }
}

async function noHScroll() {
  const sw = await page.evaluate(() => document.body.scrollWidth);
  const cw = await page.evaluate(() => document.body.clientWidth);
  if (sw > cw + 2) throw new Error('scrollWidth ' + sw + ' > clientWidth ' + cw);
  return 'ok';
}

// ==========================================================
console.log('\n=== / Homepage ===');
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await shot('01-home');
await check('title', () => page.title());
await check('stat 60 visible', async () => {
  const all = await page.locator('text=60').all();
  return all.length + ' elements';
});
await check('FeaturedSection heading', async () => {
  await page.locator('text=Complete content').waitFor({ timeout: 3000 });
  return 'found';
});
await check('Complete badges count', async () => {
  const b = await page.locator('text=Complete').all();
  return b.length + ' found';
});
await check('View content links count', async () => {
  const l = await page.locator('text=View content').all();
  return l.length + ' found';
});
await check('no horizontal scroll', noHScroll);

// ==========================================================
console.log('\n=== /topics ===');
jsErrors.length = 0;
await page.goto(BASE + '/topics', { waitUntil: 'networkidle' });
await shot('02-topics');
await check('Complete badges', async () => {
  const b = await page.locator('text=Complete').all();
  return b.length + ' found';
});
await check('View content links', async () => {
  const l = await page.locator('text=View content').all();
  return l.length + ' found';
});
await check('Coming soon badges', async () => {
  const l = await page.locator('text=Coming soon').all();
  return l.length + ' found';
});
await check('subtitle 3 complete', async () => {
  await page.locator('text=3 complete').waitFor({ timeout: 3000 });
  return 'found';
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

// ==========================================================
console.log('\n=== /topics/caching-redis ===');
jsErrors.length = 0;
await page.goto(BASE + '/topics/caching-redis', { waitUntil: 'networkidle' });
await shot('03-redis');
await check('title', async () => {
  const t = await page.title();
  if (!t.includes('Redis')) throw new Error(t);
  return t;
});
await check('TOC accordion exists', async () => {
  const btn = page.locator('button[aria-expanded]').first();
  await btn.waitFor({ timeout: 3000 });
  return (await btn.textContent()).trim().substring(0, 50);
});
await check('TOC open/close', async () => {
  const btn = page.locator('button[aria-expanded]').first();
  await btn.click();
  await page.waitForTimeout(300);
  const exp = await btn.getAttribute('aria-expanded');
  if (exp !== 'true') throw new Error('did not open, aria-expanded=' + exp);
  await shot('03b-redis-toc-open');
  await btn.click();
  await page.waitForTimeout(300);
  return 'ok';
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

// ==========================================================
console.log('\n=== /topics/networking ===');
jsErrors.length = 0;
await page.goto(BASE + '/topics/networking', { waitUntil: 'networkidle' });
await shot('04-networking');
await check('title', async () => {
  const t = await page.title();
  if (!t.includes('Network')) throw new Error(t);
  return t;
});
await check('TOC 19 sections', async () => {
  const btn = page.locator('button[aria-expanded]').first();
  const text = await btn.textContent();
  if (!text.includes('19')) throw new Error('Got: ' + text);
  return text.trim();
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

// ==========================================================
console.log('\n=== /topics/design-patterns ===');
jsErrors.length = 0;
await page.goto(BASE + '/topics/design-patterns', { waitUntil: 'networkidle' });
await shot('05-design-patterns');
await check('title', async () => {
  const t = await page.title();
  if (!t.includes('Design Patterns')) throw new Error(t);
  return t;
});
await check('TOC 14 sections', async () => {
  const btn = page.locator('button[aria-expanded]').first();
  const text = await btn.textContent();
  if (!text.includes('14')) throw new Error('Got: ' + text);
  return text.trim();
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

// ==========================================================
console.log('\n=== /search?q=redis ===');
jsErrors.length = 0;
await page.goto(BASE + '/search?q=redis', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await shot('06-search-redis');
await check('result count', async () => {
  const el = await page.locator('text=/\\d+ result/').first().textContent({ timeout: 3000 });
  return el.trim();
});
await check('section results glyph', async () => {
  const g = await page.locator('text=§').all();
  if (g.length === 0) throw new Error('none found');
  return g.length + ' section rows';
});
await check('parentTitle labels', async () => {
  const els = await page.locator('text=/in (?:Caching|Redis|Networking|Design)/').all();
  return els.length + ' found';
});
await check('anchor links in results', async () => {
  const links = await page.locator('a[href*="#"]').all();
  return links.length + ' anchor links';
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

// Probe: design-patterns section in search
console.log('\n=== /search?q=solid (probe) ===');
await page.goto(BASE + '/search?q=solid', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await shot('07-search-solid');
await check('SOLID in results', async () => {
  const el = page.locator('text=SOLID').first();
  const text = await el.textContent({ timeout: 3000 });
  return text.trim().substring(0, 60);
});

// Probe: networking section in search
console.log('\n=== /search?q=tcp (probe) ===');
await page.goto(BASE + '/search?q=tcp', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await shot('07b-search-tcp');
await check('TCP results include sections', async () => {
  const count = await page.locator('text=/\\d+ result/').first().textContent({ timeout: 3000 });
  return count.trim();
});

// ==========================================================
console.log('\n=== /roadmap ===');
jsErrors.length = 0;
await page.goto(BASE + '/roadmap', { waitUntil: 'networkidle' });
await shot('08-roadmap');
await check('title', async () => {
  const t = await page.title();
  if (!t.includes('Roadmap')) throw new Error(t);
  return t;
});
await check('no horizontal scroll', noHScroll);
await check('no JS errors', () => { if (jsErrors.length) throw new Error(jsErrors[0]); return 'clean'; });

await browser.close();
console.log('\nDone. Screenshots saved to: ' + OUT);
