// Smoke test : toutes les routes + intro + absence d'erreurs JS
const { chromium } = require('playwright');
const BASE = `http://localhost:${process.env.PORT || 3020}/`;
const ROUTES = ['/', '/method', '/currents', '/about', '/test', '/results', '/partis'];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(800);

  for (const r of ROUTES) {
    await page.goto(BASE.replace(/\/$/, '') + r, { waitUntil: 'load' });
    await page.waitForTimeout(900);
    const info = await page.evaluate(() => ({
      h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim().slice(0, 60) : '(pas de h1)',
      header: !!document.querySelector('header'),
      footer: !!document.querySelector('footer'),
      intro: !!document.querySelector('.intro-screen'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    console.log(r.padEnd(11), JSON.stringify(info));
  }

  // intro : le texte reste-t-il lisible pour la copie / les tests ?
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const text = await page.evaluate(() => ({
    title: document.querySelector('.intro-title').textContent,
    sub: document.querySelector('.intro-sub').textContent,
    kicker: document.querySelector('.intro-kicker').textContent,
    labels: [...document.querySelectorAll('.cut-group')].slice(0, 4).map((g) => g.getAttribute('aria-label')),
  }));
  console.log('intro text:', JSON.stringify(text));

  console.log('--- ERRORS ---');
  console.log(errors.length ? errors.join('\n') : '(none)');
  await b.close();
})();
