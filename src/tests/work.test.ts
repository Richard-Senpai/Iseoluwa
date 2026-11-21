import { describe, expect, it } from 'vitest';
import {
  ALL_PROJECTS,
  PROJECTS_CONTENT,
  REAL_WEBSITE_PROJECTS,
  WORK_CATEGORIES,
  getCategoryBySlug,
  getNextCategory,
  getNextProjectInCategory,
  getProjectBySlug,
  getProjectsByCategory,
  getVisibleProjects,
} from '@/content/projects';
import { parsePackagePrice } from '@/components/ui/PackagePrice';
import { getActiveSocials, SITE_CONTENT } from '@/content/site';
import { countLitWords, mapNameSceneProgress } from '@/features/about/sections/NameScene';

describe('Work data model: concept projects, real websites & sample layouts', () => {
  it('defines three ordered categories: branding, websites, marketing', () => {
    expect(WORK_CATEGORIES.map((c) => c.slug)).toEqual(['branding', 'websites', 'marketing']);
  });

  it('defines 4 branding concepts, 6 websites (4 real + 2 sample), and 4 marketing concepts', () => {
    expect(ALL_PROJECTS).toHaveLength(14);

    const branding = getProjectsByCategory('branding');
    const websites = getProjectsByCategory('websites');
    const marketing = getProjectsByCategory('marketing');

    expect(branding).toHaveLength(4);
    expect(branding.every((p) => p.kind === 'concept' && p.isConcept)).toBe(true);

    expect(websites).toHaveLength(6);
    expect(websites.slice(0, 4).map((p) => p.slug)).toEqual([
      'icestein-grillz',
      'crtx-nutrition',
      'divathea',
      'richard-portfolio',
    ]);
    expect(websites.slice(0, 4).every((p) => p.kind === 'real' && Boolean(p.liveUrl))).toBe(true);

    expect(websites.slice(4).map((p) => p.slug)).toEqual([
      'sample-wine-vineyard',
      'sample-fashion-store',
    ]);
    expect(
      websites
        .slice(4)
        .every(
          (p) =>
            p.kind === 'sample' &&
            !p.liveUrl &&
            !p.client &&
            p.summary === 'A sample layout shown while real projects are being added.',
        ),
    ).toBe(true);

    expect(marketing).toHaveLength(4);
    expect(marketing.every((p) => p.kind === 'concept' && p.isConcept)).toBe(true);

    expect(REAL_WEBSITE_PROJECTS).toHaveLength(4);
    expect(getVisibleProjects(websites)[0]?.kind).toBe('real');
  });

  it('marks ayo-roasters, icestein-grillz, and fresh-basket as featured on Home page', () => {
    expect(PROJECTS_CONTENT.map((p) => p.slug)).toEqual([
      'ayo-roasters',
      'icestein-grillz',
      'fresh-basket',
    ]);
    expect(PROJECTS_CONTENT.every((p) => p.featured && p.featuredOnHome)).toBe(true);
  });

  it('resolves next category in a loop', () => {
    expect(getNextCategory('branding').slug).toBe('websites');
    expect(getNextCategory('websites').slug).toBe('marketing');
    expect(getNextCategory('marketing').slug).toBe('branding');
  });

  it('resolves next project in the same category and loops after the last', () => {
    const brandingProjects = getProjectsByCategory('branding');
    const first = brandingProjects[0]!;
    const second = brandingProjects[1]!;
    const last = brandingProjects[brandingProjects.length - 1]!;

    expect(getNextProjectInCategory('branding', first.slug).slug).toBe(second.slug);
    expect(getNextProjectInCategory('branding', last.slug).slug).toBe(first.slug);
  });

  it('normalizes web-design and digital-marketing category aliases and returns undefined for unknown slugs', () => {
    expect(getCategoryBySlug('web-design')?.slug).toBe('websites');
    expect(getCategoryBySlug('digital-marketing')?.slug).toBe('marketing');
    expect(getCategoryBySlug('unknown')).toBeUndefined();
    expect(getProjectBySlug('branding', 'non-existent')).toBeUndefined();
  });
});

describe('NameScene progress mapping & word lighting math', () => {
  it('maps 0..0.08 to 0, 0.08..0.92 linearly to 0..1, and 0.92..1.0 to 1', () => {
    expect(mapNameSceneProgress(0)).toBe(0);
    expect(mapNameSceneProgress(0.05)).toBe(0);
    expect(mapNameSceneProgress(0.08)).toBe(0);
    expect(mapNameSceneProgress(0.5)).toBeCloseTo(0.5, 4);
    expect(mapNameSceneProgress(0.92)).toBe(1);
    expect(mapNameSceneProgress(0.96)).toBe(1);
    expect(mapNameSceneProgress(1)).toBe(1);
  });

  it('lights 0 words at start, proportional words mid-scroll, and 100% of words at or after 0.92 raw progress', () => {
    const wordCount = 19;
    expect(countLitWords(mapNameSceneProgress(0.04), wordCount)).toBe(0);
    expect(countLitWords(mapNameSceneProgress(0.5), wordCount)).toBe(10);
    expect(countLitWords(mapNameSceneProgress(0.92), wordCount)).toBe(wordCount);
    expect(countLitWords(mapNameSceneProgress(1.0), wordCount)).toBe(wordCount);
  });
});

describe('PackagePrice parser & real contact details', () => {
  it('parses standard From prices, monthly retainers, and custom package budget copy', () => {
    expect(parsePackagePrice('From $1,500')).toEqual({
      prefix: 'FROM',
      amount: '$1,500',
      suffix: null,
      isCustom: false,
    });
    expect(parsePackagePrice('From ₦400k / month')).toEqual({
      prefix: 'FROM',
      amount: '₦400k',
      suffix: '/ MONTH',
      isCustom: false,
    });
    expect(parsePackagePrice('You set the budget', true)).toEqual({
      prefix: null,
      amount: 'You set the budget',
      suffix: null,
      isCustom: true,
    });
  });

  it('wires real WhatsApp and Instagram details and filters out unconfigured socials', () => {
    expect(SITE_CONTENT.contact.whatsapp.e164).toBe('+2348133696869');
    expect(SITE_CONTENT.contact.whatsapp.href).toContain('https://wa.me/2348133696869');
    expect(SITE_CONTENT.contact.instagram.handle).toBe('@iseoluwahub');
    expect(SITE_CONTENT.contact.instagram.href).toBe('https://www.instagram.com/iseoluwahub/');

    const active = getActiveSocials(SITE_CONTENT.socials);
    expect(active.map((s) => s.id)).toEqual(['instagram', 'whatsapp']);
  });
});
