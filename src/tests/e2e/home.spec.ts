import { expect, test } from '@playwright/test';

test.describe('Iséoluwa Home Page Smoke Suite', () => {
  test('loads the home page with the primary h1 and wordmark', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Iseoluwa | Brand, Web and Marketing Studio');
    const h1 = page.locator('main h1');
    await expect(h1).toContainText('One team for your brand, website, and growth.');
  });

  test('toggles light and dark theme via header theme toggle button', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggleBtn = page.locator('#theme-toggle-button');

    const initialIsDark = await html.evaluate((el) => el.classList.contains('dark'));
    await toggleBtn.click();
    await expect
      .poll(async () => html.evaluate((el) => el.classList.contains('dark')))
      .toBe(!initialIsDark);
  });

  test('opens and closes the full-screen menu overlay via click and Escape', async ({ page }) => {
    await page.goto('/');
    const menuToggle = page.locator('#header-menu-toggle');
    const overlay = page.locator('#global-menu-overlay');

    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(overlay).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('package matcher returns a recommended package and links to /contact?package=...', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#matcher-need-whole').click();
    await page.locator('#matcher-stage-starting').click();

    const resultTitle = page.locator('#matcher-result-title');
    await expect(resultTitle).toHaveText('Launch Starter');

    const ctaLink = page.locator('#package-matcher a[href="/contact?package=launch-starter"]');
    await expect(ctaLink).toContainText('Talk about Launch Starter');
  });
});
