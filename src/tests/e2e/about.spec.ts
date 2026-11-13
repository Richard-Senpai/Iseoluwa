import { expect, test } from '@playwright/test';

test.describe('About Page (/about) & Thick FlowingLine Ribbon', () => {
  test('loads the About page with all sections, Reach me links, email copy, and thick canvas ribbon', async ({
    page,
  }) => {
    await page.goto('/about');

    // 1. Single h1 with hero headline
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Work done with care, from start to finish.');

    // 2. Verify key sections render in SSR HTML
    await expect(page.locator('#the-name')).toContainText('01 / THE NAME');
    await expect(page.locator('#the-founder')).toContainText('Meet Iséoluwa');
    await expect(page.locator('#what-drives-us')).toContainText('03 / WHAT DRIVES US');
    await expect(page.locator('#our-values')).toContainText('How we work.');
    await expect(page.locator('#why-us')).toContainText('05 / WHY US');
    await expect(page.locator('#the-network')).toContainText('A small core, a trusted network.');
    await expect(page.locator('#where-we-work')).toContainText('07 / REACH');
    await expect(page.locator('#the-standard')).toContainText('We dot every i and cross every t.');

    // 3. Verify all 4 founder chapters are present in the HTML
    for (const marker of ['01', '02', '03', '04']) {
      await expect(page.getByTestId(`founder-chapter-${marker}`)).toBeAttached();
    }

    // 4. Verify Reach me buttons exist with the correct hrefs
    const portfolioLink = page.getByTestId('founder-portfolio-link');
    await expect(portfolioLink).toBeVisible();
    await expect(portfolioLink).toHaveAttribute('href', 'http://senpaididit.vercel.app/');
    await expect(portfolioLink).toHaveAttribute('target', '_blank');

    const emailLink = page.getByTestId('founder-email-link');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:hello@iseoluwa.com');

    const whatsappLink = page.getByTestId('founder-whatsapp-link');
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute(
      'href',
      "https://wa.me/2348133696869?text=Hello%20Is%C3%A9oluwa%2C%20I'd%20like%20to%20discuss%20a%20project.",
    );

    // 5. Verify founder email copy-to-clipboard button updates to "Copied"
    const copyBtn = page.getByTestId('founder-copy-email');
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');

    // 6. Verify the FlowingLine renders as a <canvas> with a non-trivial ribbon thickness (>= 8px)
    const canvases = page.getByTestId('flowing-line-canvas');
    const canvasCount = await canvases.count();
    expect(canvasCount).toBeGreaterThanOrEqual(3);

    const firstCanvas = canvases.first();
    await expect(firstCanvas).toBeVisible();
    const weightAttr = await firstCanvas.getAttribute('data-ribbon-weight-px');
    const weightPx = Number(weightAttr ?? '0');
    expect(weightPx).toBeGreaterThanOrEqual(8);

    const box = await firstCanvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(200);
    expect(box?.height ?? 0).toBeGreaterThan(40);
  });
});
