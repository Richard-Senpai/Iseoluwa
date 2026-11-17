import { expect, test } from '@playwright/test';

test.describe('About Page (/about) — Pinned TeamStory, Portraits, Rail, Overflow & JSON-LD', () => {
  test('renders all four team members in server HTML, rail items set aria-current and scroll, portraits have alt text, and JSON-LD contains both founders', async ({
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
    await expect(page.locator('#what-drives-us')).toContainText('03 / WHAT DRIVES US');
    await expect(page.locator('#why-us')).toContainText('Built by designers and engineers.');
    await expect(page.locator('#the-network')).toContainText(
      'Every project is led by our founders and checked against the same standard.',
    );

    // 3. Portrait images have exact alt text for all four members
    const expectedAlts = [
      'Portrait of Ojedayo Richard Iseoluwa, Founder at Iséoluwa',
      'Portrait of Daniel Oshinaike, Co-Founder at Iséoluwa',
      'Portrait of Abdulmaleek Asimiyu, Developer at Iséoluwa',
      'Portrait of Jessica Omotayo, Marketer and Social Media Manager at Iséoluwa',
    ];
    for (const altText of expectedAlts) {
      const imgs = page.locator(`img[alt="${altText}"]`);
      expect(await imgs.count()).toBeGreaterThanOrEqual(1);
    }

    // 4. Desktop rail has four items and clicking one sets aria-current and scrolls
    const rail = page.getByTestId('team-rail');
    await expect(rail).toBeVisible();
    const railButtons = rail.locator('button');
    await expect(railButtons).toHaveCount(4);

    await expect(page.getByTestId('team-rail-item-iseoluwa')).toHaveAttribute(
      'aria-current',
      'step',
    );
    await expect(page.getByTestId('team-counter')).toContainText('01 / 04');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / FOUNDER');

    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.getByTestId('team-rail-item-maleek').click();
    await page.waitForTimeout(350);

    await expect(page.getByTestId('team-rail-item-maleek')).toHaveAttribute(
      'aria-current',
      'step',
    );
    await expect(page.getByTestId('team-counter')).toContainText('03 / 04');
    await expect(page.getByTestId('team-section-label')).toContainText('02 / DEVELOPER');
    const afterClickScrollY = await page.evaluate(() => window.scrollY);
    expect(afterClickScrollY).toBeGreaterThan(initialScrollY);

    // 5. Reach me buttons and email copy still work
    const copyBtn = page.getByTestId('founder-copy-email');
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');

    // 6. JSON-LD contains Organization with both founders (Ojedayo Richard Iseoluwa & Daniel Oshinaike) and employees
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
          issues.push(`#the-founder horizontal overflow by ${section.scrollWidth - section.clientWidth}px`);
        }

        const giantNames = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-testid^="team-giant-name-"], [data-testid^="team-stacked-giant-name-"]',
          ),
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

  test('reduced motion shows the unpinned stacked team layout with all four members', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about');

    const stackedLayout = page.getByTestId('team-stacked-layout');
    await expect(stackedLayout).toBeVisible();
    await expect(page.getByTestId('team-pinned-stage')).toBeHidden();

    for (const id of ['iseoluwa', 'daniel', 'maleek', 'jessica']) {
      await expect(page.getByTestId(`team-member-card-${id}`)).toBeVisible();
    }
  });
});
