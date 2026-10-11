// Reproduit le bug de la page des résultats : seed des réponses, navigation, rapport d'erreurs.
import { chromium } from 'playwright';
import { questions } from '../src/lib/questions.js';

const BASE = `http://localhost:${process.env.PORT || 3020}`;
const OUT = process.argv[2] || '.';
const PROFILE = process.argv[3] || 'mixed'; // mixed | left | right | thin

function buildAnswers(profile) {
  const out = {};
  questions.forEach((q, i) => {
    if (profile === 'thin' && i % 3 !== 0) return; // très peu de réponses
    const opts = q.options;
    let idx;
    if (profile === 'left') idx = 0;
    else if (profile === 'right') idx = opts.length - 2;
    else idx = (i * 7 + 3) % opts.length; // varié
    out[q.id] = opts[Math.min(idx, opts.length - 1)].value;
  });
  return out;
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  const answers = buildAnswers(PROFILE);
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.evaluate((a) => {
    localStorage.setItem('civilis.answers', JSON.stringify(a));
    localStorage.setItem('civilis.intro.entered', '1');
  }, answers);
  await page.goto(BASE + '/results', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const report = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const main = q('.res-container');
    return {
      hasContainer: !!main,
      h1: q('.res-title') ? q('.res-title').innerText.slice(0, 90) : null,
      people: [...document.querySelectorAll('.people-cards .people-card h3')].map((h) => h.textContent),
      galleryCount: document.querySelectorAll('.gallery-card').length,
      galleryPhotos: document.querySelectorAll('.gallery-card .portrait img').length,
      partyCards: document.querySelectorAll('.party-card').length,
      radar: !!q('.radar'),
      dimBars: document.querySelectorAll('.dim-bar-row').length,
      compareRows: document.querySelectorAll('.compare-row').length,
      gapRows: document.querySelectorAll('.gap-row').length,
      coverageRows: document.querySelectorAll('.coverage-row').length,
      arbitrage: document.querySelectorAll('.arbitrage-list li').length,
      whyCards: document.querySelectorAll('.why-card').length,
      loreCards: document.querySelectorAll('.lore-card').length,
      actions: document.querySelectorAll('.next-actions a, .next-actions button').length,
      chartsWithData: document.querySelectorAll('.chart-data').length,
      bodyTextLen: document.body.innerText.length,
      hasNaN: document.body.innerText.includes('NaN'),
      hasUndefined: document.body.innerText.includes('undefined'),
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(0, 80)),
    };
  });

  console.log(`[${PROFILE}]`, JSON.stringify(report, null, 2));
  await page.screenshot({ path: `${OUT}/results-${PROFILE}.png`, fullPage: false });
  await page.screenshot({ path: `${OUT}/results-${PROFILE}-full.png`, fullPage: true }).catch(() => {});
  console.log('--- ERRORS ---');
  console.log(errors.length ? errors.join('\n') : '(none)');
  await b.close();
})();
