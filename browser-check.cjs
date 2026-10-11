// Browser end-to-end check of CIVILIS homepage using Playwright (Chromium headless)
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

  try {
    await page.goto('http://localhost:3014/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const title = await page.title();
    const bodyText = await page.textContent('body');
    const headerCount = await page.locator('header').count();
    const mainCount = await page.locator('main').count();
    const introDone = await page.locator('.intro-screen').isVisible().then(v => !v);
    const h1Count = await page.locator('h1').count();

    console.log('TITLE:', title);
    console.log('header count:', headerCount);
    console.log('main count:', mainCount);
    console.log('h1 count:', h1Count);
    console.log('intro screen visible:', !introDone);
    console.log('body text length:', bodyText.length);
    console.log('--- first 600 chars of body ---');
    console.log(bodyText.slice(0, 600));

    const html = await page.content();
    console.log('--- page html length:', html.length);
    console.log('--- has <header:', (html.match(/<header/g)||[]).length, 'has <main:', (html.match(/<main/g)||[]).length, 'has <footer:', (html.match(/<footer/g)||[]).length);

    console.log('--- IMAGES (src, alt, count) ---');
    const imgs = await page.locator('img').count();
    console.log('total img tags:', imgs);
    for (let i = 0; i < imgs; i++) {
      const src = await page.locator(`img`).nth(i).getAttribute('src');
      const alt = await page.locator(`img`).nth(i).getAttribute('alt');
      console.log(`img[${i}] src=${src} | alt=${alt}`);
    }

    console.log('--- ERROR LOG ---');
    if (errors.length === 0) console.log('(none)');
    errors.forEach(e => console.log(e));
  } catch (e) {
    console.log('ERROR during browser check:', e.message);
    console.log(e.stack);
  } finally {
    await browser.close();
  }
})();
