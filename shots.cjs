/* ============================================================================
   CIVILIS — vérification visuelle et fonctionnelle (Chromium / Playwright)
   ----------------------------------------------------------------------------
   node shots.cjs <dossier-de-sortie>
   Vérifie : intro à entrée obligatoire, bouton du hero, sablier, illustration
   de question, page de résultats (desktop + mobile), page des courants.
   ========================================================================== */
const { chromium } = require('playwright');

const OUT = process.argv[2] || '.';
const BASE = `http://localhost:${process.env.PORT || 3020}/`;
const ok = (c) => (c ? 'OK  ' : 'ECHEC');
const results = [];
const check = (label, cond, detail = '') => {
  results.push({ label, pass: !!cond });
  console.log(`${ok(cond)} ${label}${detail ? ' — ' + detail : ''}`);
};

const seedAnswers = `
  (function () {
    var out = {};
    var qs = ${JSON.stringify(require('./seed-answers.json'))};
    Object.keys(qs).forEach(function (k) { out[k] = qs[k]; });
    localStorage.setItem('civilis.answers', JSON.stringify(out));
    localStorage.setItem('civilis.intro.entered', '1');
  })();
`;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  // contexte « déjà entré » : l'intro n'est testée qu'en section 1
  const enterIntro = (ctx) => ctx.addInitScript(() => {
    try { localStorage.setItem('civilis.intro.entered', '1'); } catch (e) { /* ignore */ }
  });

  /* ---------- 1. INTRO : entrée obligatoire ---------------------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push('intro: ' + e.message));
    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(() => { localStorage.clear(); });
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(2600);

    const introPresent = await page.locator('.intro-screen').isVisible();
    check('intro : affichée à la première visite', introPresent);

    // aucun déclenchement automatique : on attend bien au-delà de l'ancienne durée
    await page.waitForTimeout(5000);
    const stillThere = await page.locator('.intro-screen').isVisible().catch(() => false);
    check('intro : reste affichée après 7,6 s (aucune entrée automatique)', stillThere);

    const btn = page.locator('#intro-enter');
    check('intro : bouton d\'entrée visible', await btn.isVisible());
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    check('intro : bouton focalisé au clavier', focused === 'intro-enter', `activeElement=${focused}`);

    const collageVisible = await page.evaluate(() => {
      const papers = [...document.querySelectorAll('.intro-screen .cut-paper')];
      return papers.length > 40 && papers.every((p) => Number(getComputedStyle(p).opacity) > 0.9);
    });
    check('intro : collage complet et lisible', collageVisible);

    await page.screenshot({ path: `${OUT}/intro.png` });

    await btn.click();
    await page.waitForTimeout(900);
    const gone = await page.locator('.intro-screen').count();
    check('intro : le clic referme l\'overlay', gone === 0);
    const stored = await page.evaluate(() => localStorage.getItem('civilis.intro.entered'));
    check('intro : mémorisation uniquement après clic', stored === '1');
    await ctx.close();
  }

  /* ---------- 2. ACCUEIL : bouton Commencer le test -------------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await enterIntro(ctx);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push('home: ' + e.message));
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const hero = await page.evaluate(() => {
      const btn = document.querySelector('.hero-actions .btn-main');
      const note = document.querySelector('.hero-note');
      const lead = document.querySelector('.hero-lead');
      const fig = document.querySelector('.hero-figure');
      if (!btn) return null;
      const b = btn.getBoundingClientRect();
      const overlapFig = fig ? !(b.right < fig.getBoundingClientRect().left || b.left > fig.getBoundingClientRect().right) : false;
      return {
        w: Math.round(b.width), h: Math.round(b.height),
        gapAbove: Math.round(b.top - note.getBoundingClientRect().bottom),
        gapLead: Math.round(b.top - lead.getBoundingClientRect().bottom),
        overlapFig,
        bottomGap: Math.round(window.innerHeight - b.bottom),
        heroActionsMargin: getComputedStyle(document.querySelector('.hero-actions')).marginTop,
      };
    });
    check('accueil : bouton isolé du texte et du décor', hero && hero.gapAbove >= 24 && hero.overlapFig === false,
      hero ? `marge haute ${hero.gapAbove}px, chevauche la photo: ${hero.overlapFig}` : 'bouton introuvable');
    check('accueil : taille de bouton élégante', hero && hero.h >= 44 && hero.h <= 70 && hero.w > 180,
      hero ? `${hero.w}×${hero.h}px` : '');
    await page.screenshot({ path: `${OUT}/home.png` });
    await ctx.close();
  }

  /* ---------- 3. QUESTIONNAIRE : sablier + illustration ----------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await enterIntro(ctx);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push('test: ' + e.message));
    await page.goto(BASE + 'test', { waitUntil: 'load' });
    await page.evaluate(() => localStorage.removeItem('civilis.answers'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(900);
    // profil → consentement → première question
    const skip = page.getByRole('button', { name: 'Passer cette étape' });
    if (await skip.count()) { await skip.click(); await page.waitForTimeout(400); }
    const start = page.getByRole('button', { name: /J'ai compris/ });
    if (await start.count()) { await start.click(); await page.waitForTimeout(700); }
    const inQuestions = await page.locator('.quiz-count').count();
    check('questionnaire : parcours profil → consentement → questions', inQuestions > 0);
    if (!inQuestions) await page.screenshot({ path: `${OUT}/quiz-debug.png` });

    const hourglass = await page.locator('.quiz-progress-hg .quiz-hourglass-rotor').count();
    check('questionnaire : sablier présent (sur le repère de progression)', hourglass > 0);
    const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('.quiz-progress-hg .quiz-hourglass-rotor')).transform);
    await page.waitForTimeout(400);
    const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('.quiz-progress-hg .quiz-hourglass-rotor')).transform);
    check('questionnaire : le sablier tourne', t1 !== t2, `${t1} → ${t2}`);
    check('questionnaire : progression numérique conservée', (await page.locator('.quiz-count').innerText()).includes('Question'));
    await page.screenshot({ path: `${OUT}/quiz.png` });

    // on avance jusqu'à une question illustrée (école) — les écrans de
    // transition de chapitre sont franchis par leur bouton « Continuer »
    let illu = false;
    for (let i = 0; i < 80; i++) {
      if (await page.locator('.chapter-transition').count()) {
        await page.locator('.chapter-transition-btn').click();
        await page.waitForTimeout(300);
        continue;
      }
      const has = await page.locator('.quiz-illustration img').count();
      if (has) { illu = true; break; }
      const choice = page.locator('.quiz-choice').first();
      await choice.click();
      const next = page.locator('.btn-ink:not([disabled])');
      if (await next.count()) await next.click();
      await page.waitForTimeout(160);
    }
    check('questionnaire : illustration affichée sur une question illustrée', illu);
    if (illu) {
      const loaded = await page.evaluate(() => {
        const img = document.querySelector('.quiz-illustration img');
        return img ? { w: img.naturalWidth, alt: img.alt.length > 10, cap: !!img.closest('figure').querySelector('figcaption').textContent } : null;
      });
      /* naturalWidth > 0 = image réellement chargée et décodée (la propriété
         `complete` peut rester fausse avec loading="lazy" + cache) */
      check('questionnaire : image chargée + alternative + crédit', loaded && loaded.w > 0 && loaded.alt && loaded.cap,
        loaded ? `${loaded.w}px` : '');
      await page.screenshot({ path: `${OUT}/quiz-illustration.png` });
    }
    await ctx.close();
  }

  /* ---------- 4. RÉSULTATS : desktop + mobile -------------------------- */
  for (const [tag, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`results-${tag}: ` + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`results-${tag} console: ` + m.text()); });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(seedAnswers);
    await page.goto(BASE + 'results', { waitUntil: 'load' });
    await page.waitForTimeout(2200);

    const info = await page.evaluate(() => ({
      title: document.querySelector('.res-title')?.textContent || null,
      people: document.querySelectorAll('.people-cards .people-card').length,
      stats: document.querySelectorAll('.res-stats dt').length,
      radar: !!document.querySelector('.radar'),
      bars: document.querySelectorAll('.dim-bar-row').length,
      compare: document.querySelectorAll('.compare-row').length,
      gaps: document.querySelectorAll('.gap-row').length,
      coverage: document.querySelectorAll('.coverage-row').length,
      why: document.querySelectorAll('.why-card').length,
      lore: document.querySelectorAll('.lore-card').length,
      gallery: document.querySelectorAll('.gallery-card').length,
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      nan: document.body.innerText.includes('NaN'),
    }));
    check(`résultats ${tag} : page complète`, info.title && info.people === 3 && info.radar && info.bars === 10 && info.coverage === 10 && info.why > 0 && info.lore > 0,
      JSON.stringify(info));
    check(`résultats ${tag} : pas de débordement, pas de NaN, images OK`, !info.overflow && !info.nan && info.broken === 0,
      `overflow=${info.overflow} nan=${info.nan} broken=${info.broken}`);
    await page.screenshot({ path: `${OUT}/results-${tag}.png` });
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#analyse').offsetTop - 60));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/results-${tag}-charts.png` });
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#personnalites').offsetTop - 60));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/results-${tag}-gallery.png` });
    await ctx.close();
  }

  /* ---------- 5. PAGE DES COURANTS ------------------------------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await enterIntro(ctx);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push('currents: ' + e.message));
    await page.goto(BASE + 'currents', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => ({
      cards: document.querySelectorAll('.current-card-page').length,
      openDetails: document.querySelectorAll('.current-more[open]').length,
      visibleTraits: [...document.querySelectorAll('.current-card-traits li')].filter((el) => el.offsetParent).length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    check('courants : 14 cartes, détails repliés par défaut', info.cards === 14 && info.openDetails === 0, JSON.stringify(info));
    check('courants : pas de débordement horizontal', !info.overflow);
    await page.screenshot({ path: `${OUT}/currents.png` });
    await page.locator('.current-more summary').first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/currents-open.png` });
    await ctx.close();
  }

  console.log('\n--- ERREURS JS ---');
  console.log(errors.length ? errors.join('\n') : '(aucune)');
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} vérifications passées.`);
  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();
