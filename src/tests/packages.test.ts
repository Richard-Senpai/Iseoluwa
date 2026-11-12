import { describe, expect, it } from 'vitest';
import { resolvePackageMatch } from '@/content/packages';
import { HOME_CONTENT } from '@/features/home/home.content';
import { SITE_CONTENT } from '@/content/site';

describe('Package matcher ("Find your fit") logic', () => {
  it('returns null when either question is unanswered', () => {
    expect(resolvePackageMatch(null, null)).toBeNull();
    expect(resolvePackageMatch('whole', null)).toBeNull();
    expect(resolvePackageMatch(null, 'starting')).toBeNull();
  });

  it('maps whole package + just starting to Launch Starter', () => {
    const result = resolvePackageMatch('whole', 'starting');
    expect(result?.slug).toBe('launch-starter');
    expect(result?.packageName).toBe('Launch Starter');
  });

  it('maps whole package + established or scale to Launch Plus', () => {
    expect(resolvePackageMatch('whole', 'refresh')?.slug).toBe('launch-plus');
    expect(resolvePackageMatch('whole', 'scale')?.slug).toBe('launch-plus');
  });

  it('maps individual service needs to Brand-Only, Build-Only, and Growth Retainer', () => {
    expect(resolvePackageMatch('brand', 'starting')?.slug).toBe('brand-only');
    expect(resolvePackageMatch('website', 'refresh')?.slug).toBe('build-only');
    expect(resolvePackageMatch('marketing', 'scale')?.slug).toBe('growth-retainer');
  });
});

describe('Content integrity', () => {
  it('has empty testimonials array by default so Testimonials section stays hidden', () => {
    expect(HOME_CONTENT.testimonials.items).toHaveLength(0);
  });

  it('uses plain name Iseoluwa in default SEO title for searchability', () => {
    expect(SITE_CONTENT.seo.defaultTitle).toBe('Iseoluwa | Brand, Web and Marketing Studio');
  });
});
