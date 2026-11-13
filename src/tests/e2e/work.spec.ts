import { expect, test } from '@playwright/test';

test.describe('Iséoluwa Work Section E2E Flow', () => {
  test('pressing arrow keys on /work changes the active panel and updates ?category= URL', async ({
    page,
  }) => {
    await page.goto('/work');
    await expect(page).toHaveTitle('Our Work | Iseoluwa');

    const brandingPanel = page.getByTestId('work-panel-branding');
    const websitesPanel = page.getByTestId('work-panel-websites');

    await expect(brandingPanel).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('work-swiper-counter')).toHaveText('01 / 03');
    await expect(page.getByTestId('flowing-line-canvas').first()).toBeVisible();

    await brandingPanel.focus();
    await page.keyboard.press('ArrowRight');
    await expect(websitesPanel).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('work-swiper-counter')).toHaveText('02 / 03');
    await expect(page).toHaveURL(/\/work\?category=websites/);
  });

  test('entering a category lands on /work/[category]', async ({ page }) => {
    await page.goto('/work');
    await page.locator('#enter-category-branding').click();
    await expect(page).toHaveURL(/\/work\/branding$/);
    await expect(page.locator('main h1')).toHaveText('Branding');
  });

  test('Index overlay on /work/[category] opens, jumps to a project, and closes', async ({
    page,
  }) => {
    await page.goto('/work/branding');
    const openBtn = page.locator('#work-index-open-button');
    const overlay = page.locator('#work-project-index-overlay');

    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    await openBtn.click();
    await expect(overlay).toHaveAttribute('aria-hidden', 'false');

    await page.getByTestId('work-index-item-branding-project-03').click();
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  test('clicking a project opens its case study and Back returns to the category and selector', async ({
    page,
  }) => {
    await page.goto('/work/branding');
    await page.locator('#project-card-branding-project-01 a').click();

    await expect(page).toHaveURL(/\/work\/branding\/branding-project-01$/);
    await expect(page.locator('main h1')).toHaveText('[Branding project 01]');

    // Back from case study returns to /work/branding
    await page.getByTestId('back-to-category').click();
    await expect(page).toHaveURL(/\/work\/branding$/);

    // Back from category returns to /work?category=branding
    await page.getByTestId('back-to-all-work').click();
    await expect(page).toHaveURL(/\/work\?category=branding$/);
  });
});
