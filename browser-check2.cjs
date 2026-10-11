// Full browser verification of CIVILIS: homepage + routes + images + interactions
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console.error: ' + msg.text()); });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));
  page.on('requestfailed', (req) => { if (!req.url().includes('fonts')) errors.push('reqfailed: ' + req.url()); });

  const results = [];
  const check = (name, cond) => { results.push([name, cond]); };

  try {
    // 1. Homepage
    await page.goto('http://localhost:3020/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.waitForTimeout(600); // intro auto-dismisses after ~2.6s
    check('homepage html has header', (await page.content()).includes('<header'));
    check('homepage html has main', (await page.content()).includes('<main'));
    check('homepage html has footer', (await page.content()).includes('<footer'));
    check('homepage hero title text', await page.locator('.hero-title').textContent() === 'Connais tes idées.Comprends le monde.');
    check('homepage body has "Connais tes idées"', await page.textContent('body').then(t => t.includes('Connais tes idées')));
    check('homepage intro dismissed', await page.locator('.intro-screen').isVisible().then(v => !v));
    check('homepage has >=4 images', (await page.locator('img').count()) >= 4);
    check('homepage buttons present', (await page.locator('a.btn-main, a.btn-ink').count()) >= 2);

    // 2. Navigator pages
    for (const p of ['/method', '/currents', '/about', '/partis']) {
      const html = await page.evaluate(() => document.querySelector('main').innerHTML);
      // reload each
      await page.goto('http://localhost:3020' + p, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800); // intro only shows on homepage
      check('page ' + p + ' loads', (await page.content()).includes('<main'));
      check('page ' + p + ' has title-ish', (await page.title()).length > 0);
    }

    // 3. Test page (questionnaire)
    await page.goto('http://localhost:3020/test', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);
    await page.click('.intro-screen', { force: true });
    check('test page loads', (await page.content()).includes('<main'));
    check('test has h2', (await page.locator('h2').count()) >= 1);
    check('test has progress bar', await page.locator('.quiz-progress-bar').count() >= 1);
    check('test has context cards', await page.locator('.quiz-context-card').count() >= 1);
    // click a choice
    const choiceCount = await page.locator('.quiz-choice').count();
    check('test has quiz choices', choiceCount >= 3);
    if (choiceCount > 0) {
      await page.locator('.quiz-choice').first().check({ force: true });
      check('choice clickable', true);
    }

    // 4. Results
    await page.goto('http://localhost:3020/results', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);
    await page.click('.intro-screen', { force: true });
    check('results page loads', (await page.content()).includes('<main'));
    check('results has radar', await page.locator('.result-radar-wrap').count() >= 1);
    check('results has explanation', await page.locator('.neon-bar').count() >= 1);

    // 5. Console errors overall
    console.log('========================================');
    console.log('BROWSER CHECK SUMMARY');
    console.log('========================================');
    let allOk = true;
    for (const [name, ok] of results) {
      console.log((ok ? 'PASS' : 'FAIL') + '  ' + name);
      if (!ok) allOk = false;
    }
    console.log('========================================');
    console.log('errors: ' + (errors.length));
    errors.forEach(e => console.log('  ' + e));
    console.log('========================================');
    console.log(allOk ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED');
  } catch (e) {
    console.log('BROWSER CHECK FAILED:', e.message);
    console.log(e.stack);
  } finally {
    await browser.close();
  }
})();
