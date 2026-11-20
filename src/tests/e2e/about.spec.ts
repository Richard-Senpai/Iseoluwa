import { expect, test } from '@playwright/test';

test.describe('About Page (/about) — Dynamic 4-Tile Founder & Team Section on Desktop & Mobile', () => {
  test('renders all four team tiles in the Founder section and switches heading, portrait, and highlighted tile dynamically on desktop and mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto('/about');
    const html = (await response?.text()) ?? '';

    // 1. All four members render in the server-rendered HTML
    expect(html).toContain('Ojedayo Richard Iseoluwa');
    expect(html).toContain('Daniel Oshinaike');
    expect(html).toContain('Abdulmaleek Asimiyu');
    expect(html).toContain('Jessica Omotayo');

    // 2. Single h1 with hero headline & updated sections
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#the-name')).toContainText('01 / THE NAME');
    await expect(page.locator('#the-founder h2')).toContainText('Meet Iséoluwa');
    await expect(page.locator('#what-drives-us')).toContainText('03 / WHAT DRIVES US');
    await expect(page.locator('#why-us')).toContainText('Built by designers and engineers.');
    await expect(page.locator('#the-network')).toContainText(
      'Every project is led by our founders and checked against the same standard.',
    );

    // 3. Portrait images have exact alt text for all four members inside the single portrait frame
    const expectedAlts = [
      'Portrait of Ojedayo Richard Iseoluwa, Founder at Iséoluwa',
      'Portrait of Daniel Oshinaike, Co-Founder at Iséoluwa',
      'Portrait of Abdulmaleek Asimiyu, Developer at Iséoluwa',
      'Portrait of Jessica Omotayo, Marketer and Social Media Manager at Iséoluwa',
    ];
    for (const altText of expectedAlts) {
      const imgs = page.locator(`#the-founder img[alt="${altText}"]`);
      await expect(imgs).toHaveCount(1);
    }

    // 4. Clicking or scrolling to tile 02 (The designer) dynamically updates "Meet Iséoluwa" -> "Meet Daniel" and switches the active portrait & tile
    await expect(page.getByTestId('team-portrait-layer-iseoluwa')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-portrait-layer-daniel')).toHaveClass(/opacity-0/);

    await page.getByTestId('team-member-card-daniel').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Daniel');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / CO-FOUNDER');
    await expect(page.getByTestId('team-counter')).toContainText('02 / 04');
    await expect(page.getByTestId('team-portrait-layer-daniel')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-portrait-layer-iseoluwa')).toHaveClass(/opacity-0/);

    // 5. Clicking rail pill 03 (The developer) updates to "Meet Maleek"
    await page.getByTestId('team-rail-item-maleek').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Maleek');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / DEVELOPER');
    await expect(page.getByTestId('team-counter')).toContainText('03 / 04');
    await expect(page.getByTestId('team-portrait-layer-maleek')).toHaveClass(/opacity-100/);

    // 6. Verify mobile viewport (390x844) shows large portrait + only the single active role card (not stacked) and switches dynamically
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/about');
    await expect(page.getByTestId('team-pinned-stage')).toBeVisible();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Iséoluwa');
    await expect(page.getByTestId('team-member-card-iseoluwa')).toBeVisible();
    await expect(page.getByTestId('team-member-card-jessica')).toBeHidden();

    await page.getByTestId('team-rail-item-jessica').click();
    await expect(page.locator('#the-founder h2')).toContainText('Meet Jessica');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / MARKETING');
    await expect(page.getByTestId('team-portrait-layer-jessica')).toHaveClass(/opacity-100/);
    await expect(page.getByTestId('team-member-card-jessica')).toBeVisible();
    await expect(page.getByTestId('team-member-card-iseoluwa')).toBeHidden();

    // 7. Reach me buttons and email copy still work
    const copyBtn = page.getByTestId('founder-copy-email');
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');

    // 8. JSON-LD contains Organization with both founders
    const jsonLdFounders = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      );
      for (const script of scripts) {
        try {
          const parsed = JSON.parse(script.textContent ?? '{}') as Record<string, unknown>;
          if (parsed['@type'] === 'Organization' && Array.isArray(parsed.founder)) {
            return (parsed.founder as Array<{ name?: string }>).map((f) => f.name);
          }
        } catch {
          // ignore
        }
      }
      return [];
    });
    expect(jsonLdFounders).toEqual(['Ojedayo Richard Iseoluwa', 'Daniel Oshinaike']);
  });

  test('giant display names never overflow at 360, 768, 1440, and 1920 px viewports', async ({
    page,
  }) => {
    for (const width of [360, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/about');

      const overflowIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const section = document.getElementById('the-founder');
        if (section && section.scrollWidth > section.clientWidth + 1) {
          issues.push(
            `#the-founder horizontal overflow by ${section.scrollWidth - section.clientWidth}px`,
          );
        }

        const giantNames = Array.from(
          document.querySelectorAll<HTMLElement>('[data-testid^="team-giant-name-"]'),
        );
        for (const el of giantNames) {
          const parent = el.parentElement;
          if (!parent || parent.clientWidth === 0) continue;
          if (el.scrollWidth > parent.clientWidth + 2) {
            issues.push(
              `${el.dataset.testid} scrollWidth (${el.scrollWidth}) exceeds container (${parent.clientWidth})`,
            );
          }
        }
        return issues;
      });

      expect(overflowIssues, `Overflow check at ${width}px`).toEqual([]);
    }
  });

  test('reduced motion keeps all four member tiles visible and unpinned', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about');

    for (const id of ['iseoluwa', 'daniel', 'maleek', 'jessica']) {
      await expect(page.getByTestId(`team-member-card-${id}`)).toBeVisible();
    }
  });
});
