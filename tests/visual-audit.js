const { test, expect } = require('@playwright/test');

test.describe('CIVIS Visual Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for initial load
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage correctly', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/CIVILIS — Connais tes idées. Comprends le monde./);

    // Check for key visual elements
    await expect(page.locator('text=Connais tes idées')).toBeVisible();
    await expect(page.locator('text=Commencer le test')).toBeVisible();
    await expect(page.locator('.hero')).toBeVisible();

    // Check color scheme - should have ivory background
    const body = await page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(246, 240, 228)'); // --ivory: #F6F0E4
  });

  test('intro-screen should appear and have newspaper effect', async ({ page }) => {
    // Intro screen should be visible on first visit
    const introScreen = page.locator('.intro-screen');
    await expect(introScreen).toBeVisible();

    // Check intro content
    await expect(page.locator('.intro-title')).toContainText('CIVILIS');
    await expect(page.locator('.intro-sub')).toContainText('Explorer les idées qui façonnent notre monde');

    // Check that letter spans are present (newspaper effect)
    const letterSpans = page.locator('.intro-title span, .intro-kicker span, .intro-sub span');
    await expect(letterSpans.first()).toBeVisible();

    // Click to dismiss
    await introScreen.click();
    await expect(introScreen).toBeHidden();
  });

  test('should navigate through questionnaire correctly', async ({ page }) => {
    // Dismiss intro if present
    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // Start test
    await page.click('text=Commencer le test');

    // Should be on profile step
    await expect(page.locator('text=Ton profil')).toBeVisible();

    // Skip profile
    await page.click('text=Passer cette étape');

    // Should be on consent step
    await expect(page.locator('text=Il n\\'existe pas de réponse parfaite.')).toBeVisible();

    // Continue to questions
    await page.click('text=J\\'ai compris — commencer');

    // Should be on first question
    await expect(page.locator('.quiz-screen')).toBeVisible();
    await expect(page.locator('.quiz-theme-badge')).toBeVisible();
    await expect(page.locator('.quiz-question')).toBeVisible();
    await expect(page.locator('.quiz-options')).toBeVisible();

    // Answer first question
    await page.locator('.quiz-choice').first().click();

    // Should be able to navigate
    const nextButton = page.locator('button.btn-ink:not([disabled])');
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }

    // Check progress bar is visible
    await expect(page.locator('.quiz-progress-bar')).toBeVisible();
    await expect(page.locator('.quiz-progress-percent')).toBeVisible();
  });

  test('should complete test and show results', async ({ page }) => {
    // Dismiss intro if present
    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // Start test
    await page.click('text=Commencer le test');

    // Skip profile and consent
    await page.click('text=Passer cette étape');
    await page.click('text=J\\'ai compris — commencer');

    // Answer a few questions to complete quickly
    let questionCount = 0;
    const maxQuestions = 5; // Just test first few questions

    while (questionCount < maxQuestions) {
      // Check if we're on recap or results already
      if (await page.locator('text=Récapitulatif, text=Calculer mes résultats →, text=Ton portrait CIVILIS').isVisible()) {
        break;
      }

      // Answer current question with first option
      await page.locator('.quiz-choice').first().click();

      // Try to go to next question
      const nextButton = page.locator('button.btn-ink:not([disabled])');
      if (await nextButton.isVisible() && await page.locator('text=Récapitulatif').count() === 0) {
        await nextButton.click();
        questionCount++;
      } else {
        // Might be on recap already
        break;
      }
    }

    // If we're on recap, submit
    if (await page.locator('text=Récapitulatif').isVisible()) {
      await page.click('text=Calculer mes résultats →');
    }

    // Should be on results page
    await expect(page.locator('text=Ton portrait CIVILIS')).toBeVisible();
    await expect(page.locator('.radar')).toBeVisible();
    await expect(page.locator('text=Les courants les plus proches')).toBeVisible();
    await expect(page.locator('text=En miroir : les courants de pensée')).toBeVisible();
  });

  test('should have proper responsive layout', async ({ page }) => {
    // Test desktop width
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173');

    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    await expect(page.locator('.hero-text')).toBeVisible();
    // On desktop, text should be left-aligned (default)

    // Test mobile width
    await page.setViewportSize({ width: 390, height: 660 });
    await page.goto('http://localhost:5173');

    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // On mobile, hero text should be centered
    const heroText = page.locator('.hero-text');
    await expect(heroText).toHaveCSS('text-align', 'center');

    // Button should be centered with margin
    const btnMain = page.locator('.hero-text .btn-main');
    await expect(btnMain).toBeVisible();
    // Check that it has horizontal centering (this is harder to test precisely)
  });

  test('should not have JavaScript errors', async ({ page }) => {
    // Listen for page errors
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Go through basic flow
    await page.goto('http://localhost:5173');

    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    await page.click('text=Commencer le test');
    await page.click('text=Passer cette étape');
    await page.click('text=J\\'ai compris — commencer');

    // Answer a couple questions
    for (let i = 0; i < 2; i++) {
      await page.locator('.quiz-choice').first().click();
      const nextButton = page.locator('button.btn-ink:not([disabled])');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // Check for any JavaScript errors
    if (errors.length > 0) {
      throw new Error(`JavaScript errors detected: ${errors.join('; ')}`);
    }

    expect(errors.length).toBe(0);
  });

  test('images should load correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Check for any broken images
    const images = page.locator('img');
    const count = await images.count();

    let brokenImages = [];
    for (let i = 0; i < Math.min(count, 5); i++) { // Check first 5 images
      const img = images.nth(i);
      const isBroken = await img.evaluate((el) => !el.complete || el.naturalWidth === 0);
      if (isBroken) {
        const src = await img.getAttribute('src');
        brokenImages.push(src);
      }
    }

    if (brokenImages.length > 0) {
      throw new Error(`Broken images found: ${brokenImages.join(', ')}`);
    }

    expect(brokenImages.length).toBe(0);
  });
});