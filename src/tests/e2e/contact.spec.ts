import { expect, test } from '@playwright/test';

test.describe('Contact Page & 4-Step Project Request Flow', () => {
  test('renders /contact with header, sticky info column, and 4-step form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle('Contact Iseoluwa | Start a Project');
    await expect(page.locator('main h1')).toContainText('Let\u2019s build something excellent.');
    await expect(page.getByText('Prefer to talk?')).toBeVisible();
    await expect(page.getByTestId('contact-step-indicator')).toHaveText('STEP 01 / 04');
  });

  test('prefills package summary card, services, and budget when opened with ?package=launch-starter and switches USD/NGN', async ({
    page,
  }) => {
    await page.goto('/contact?package=launch-starter');

    // Fill Step 1 (use United Kingdom so initial currency stays USD, then switch to NGN in Step 3)
    await page.locator('[data-field="fullName"] input').fill('Adaeze Okafor');
    await page.locator('[data-field="email"] input').fill('adaeze@example.com');
    await page.locator('[data-field="company"] input').fill('Zuri Labs');
    await page.locator('select[name="country"]').selectOption('United Kingdom');
    await page.getByTestId('contact-next-button').click();

    // Step 2: verify Package Summary Card is shown for Launch Starter
    const summaryCard = page.getByTestId('selected-package-summary-card');
    await expect(summaryCard).toBeVisible();
    await expect(summaryCard).toContainText('Launch Starter');

    await page
      .locator('textarea[name="projectDescription"]')
      .fill('We are launching a new consumer brand and need identity, website, and launch assets.');
    await page.getByTestId('contact-next-button').click();

    // Step 3: verify prefilled budget range ($1,500 – $3,500) and switch to NGN (₦750k – ₦1.8M)
    const readout = page.getByTestId('budget-display-readout');
    await expect(readout).toContainText('$1,500 – $3,500');

    await page.getByTestId('budget-currency-ngn').click();
    await expect(readout).toContainText('₦750k – ₦1.8M');
  });

  test('submits the 4-step form and redirects to /contact/thank-you', async ({ page }) => {
    await page.goto('/contact?package=launch-starter');

    // Wait briefly so minimum time-to-submit check (>2.5s) passes naturally
    await page.waitForTimeout(2600);

    // Step 1
    await page.locator('[data-field="fullName"] input').fill('Tunde Bakare');
    await page.locator('[data-field="email"] input').fill('tunde@example.com');
    await page.locator('[data-field="company"] input').fill('Kora Logistics');
    await page.locator('select[name="country"]').selectOption('Nigeria');
    await page.getByTestId('contact-next-button').click();

    // Step 2
    await page
      .locator('textarea[name="projectDescription"]')
      .fill('We need a full brand identity and website for our logistics launch this quarter.');
    await page.getByTestId('contact-next-button').click();

    // Step 3 (budget range-3 is already prefilled from launch-starter)
    await page.getByTestId('contact-next-button').click();

    // Step 4: Review & consent
    await expect(page.getByTestId('contact-step-4')).toBeVisible();
    await page.getByTestId('contact-consent-checkbox').check();
    await page.getByTestId('contact-submit-button').click();

    await expect(page).toHaveURL(/\/contact\/thank-you/);
    await expect(page.locator('main h1')).toContainText('Thank you. We have your request.');
  });

  test('redirects directly opened /contact/thank-you back to /contact when not submitted', async ({
    page,
  }) => {
    await page.goto('/contact/thank-you');
    await expect(page).toHaveURL(/\/contact$/);
  });
});
