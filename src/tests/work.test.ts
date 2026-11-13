import { describe, expect, it } from 'vitest';
import {
  ALL_PROJECTS,
  PROJECTS_CONTENT,
  WORK_CATEGORIES,
  getCategoryBySlug,
  getNextCategory,
  getNextProjectInCategory,
  getProjectBySlug,
  getProjectsByCategory,
} from '@/content/projects';
import { parsePackagePrice } from '@/components/ui/PackagePrice';
import { getActiveSocials, SITE_CONTENT } from '@/content/site';

describe('Work data model & 12 concept projects', () => {
  it('defines three ordered categories: branding, websites, marketing', () => {
    expect(WORK_CATEGORIES.map((c) => c.slug)).toEqual(['branding', 'websites', 'marketing']);
  });

  it('defines four concept projects per category (12 total) with isConcept: true and year 2026', () => {
    expect(ALL_PROJECTS).toHaveLength(12);
    expect(getProjectsByCategory('branding')).toHaveLength(4);
    expect(getProjectsByCategory('websites')).toHaveLength(4);
    expect(getProjectsByCategory('marketing')).toHaveLength(4);

    for (const project of ALL_PROJECTS) {
      expect(project.isConcept).toBe(true);
      expect(project.year).toBe('2026');
      expect(project.client).toContain('(concept)');
      expect(project.media.gallery).toHaveLength(2);
    }
  });

  it('marks ayo-roasters, haven-stays, and fresh-basket as featured on Home page', () => {
    expect(PROJECTS_CONTENT.map((p) => p.slug)).toEqual([
      'ayo-roasters',
      'haven-stays',
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
