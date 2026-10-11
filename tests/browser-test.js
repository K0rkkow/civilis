const { test, expect } = require('@playwright/test');

test.describe('CIVILIS Political Analysis Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('homepage loads correctly', async ({ page }) => {
    // Check that the homepage loads
    await expect(page).toHaveTitle(/CIVILIS/);

    // Check for key elements on homepage
    await expect(page.locator('text=Connais tes idées')).toBeVisible();
    await expect(page.locator('text=Commencer le test')).toBeVisible();
  });

  test('intro-screen appears and can be dismissed', async ({ page }) => {
    // Check that intro-screen appears on first visit
    const introScreen = page.locator('.intro-screen');
    await expect(introScreen).toBeVisible();

    // Check intro-screen content
    await expect(page.locator('.intro-title')).toHaveText(/CIVILIS/);
    await expect(page.locator('.intro-sub')).toHaveText(/Explorer les idées qui façonnent notre monde/);

    // Click to dismiss intro-screen
    await introScreen.click();

    // Check that intro-screen is gone
    await expect(introScreen).toBeHidden();

    // Check that homepage content is now visible
    await expect(page.locator('text=Connais tes idées')).toBeVisible();
  });

  test('test flow works correctly', async ({ page }) => {
    // Dismiss intro-screen if present
    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // Start the test
    await page.click('text=Commencer le test');

    // Should be on profile step
    await expect(page.locator('text=Ton profil')).toBeVisible();
    await expect(page.locator('text=Tranche d\'âge')).toBeVisible();

    // Skip profile step
    await page.click('text=Passer cette étape');

    // Should be on consent step
    await expect(page.locator('text=Il n\'existe pas de réponse parfaite.')).toBeVisible();

    // Continue to questions
    await page.click('text=J\'ai compris — commencer');

    // Should be on first question
    await expect(page.locator('.quiz-screen')).toBeVisible();
    await expect(page.locator('.quiz-theme-badge')).toBeVisible();
    await expect(page.locator('.quiz-question')).toBeVisible();

    // Answer a few questions
    for (let i = 0; i < 3; i++) {
      // Click first option
      await page.locator('.quiz-choice').first().click();

      // Click next button (unless it's the last question)
      const nextButton = page.locator('button.btn-ink:not([disabled])');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // Should be able to navigate back
    await expect(page.locator('button.btn-ghost:not([disabled])')).toBeVisible();
  });

  test('results page displays correctly', async ({ page }) => {
    // Dismiss intro-screen if present
    const introScreen = page.locator('.intro-screen');
    if (await introScreen.isVisible()) {
      await introScreen.click();
    }

    // Start the test
    await page.click('text=Commencer le test');

    // Skip profile and consent
    await page.click('text=Passer cette étape');
    await page.click('text=J\'ai compris — commencer');

    // Answer all questions with first option to complete quickly
    while (true) {
      // Check if we're on the recap page
      if (await page.locator('text=Récapitulatif').isVisible()) {
        break;
      }

      // Answer current question
      await page.locator('.quiz-choice').first().click();

      // Move to next question if available
      const nextButton = page.locator('button.btn-ink:not([disabled])');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      } else {
        // If no next button, we might be on recap already
        break;
      }
    }

    // Should be on recap page
    await expect(page.locator('text=Récapitulatif')).toBeVisible();

    // Submit results
    await page.click('text=Calculer mes résultats →');

    // Should be on results page
    await expect(page.locator('text=Ton portrait CIVILIS')).toBeVisible();
    await expect(page.locator('.radar')).toBeVisible();
    await expect(page.locator('text=Les courants les plus proches')).toBeVisible();
  });
});