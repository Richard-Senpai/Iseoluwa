import { describe, expect, it } from 'vitest';
import { SITE_CONTENT } from '@/content/site';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { buildFounderPersonJsonLd } from '@/lib/seo';
import { buildStaticTaperedRibbonSvgPath } from '@/components/motion/FlowingLine';

describe('About content & founder profile', () => {
  it('defines founder details in SITE_CONTENT.founder', () => {
    expect(SITE_CONTENT.founder.fullName).toBe('Ojedayo Richard Iseoluwa');
    expect(SITE_CONTENT.founder.displayName).toBe('Iséoluwa');
    expect(SITE_CONTENT.founder.title).toBe('Founder');
    expect(SITE_CONTENT.founder.roles).toEqual([
      'Software Engineer',
      'Full-Stack Developer',
      'Product Designer',
      'Brand Manager',
    ]);
    expect(SITE_CONTENT.founder.portfolioUrl).toBe('http://senpaididit.vercel.app/');
    expect(SITE_CONTENT.founder.email).toBe('hello@iseoluwa.com');
  });

  it('defines all four founder chapters and five studio values', () => {
    expect(ABOUT_CONTENT.founderSection.chapters).toHaveLength(4);
    expect(ABOUT_CONTENT.founderSection.chapters.map((c) => c.marker)).toEqual([
      '01',
      '02',
      '03',
      '04',
    ]);
    expect(ABOUT_CONTENT.values.items).toHaveLength(5);
    expect(ABOUT_CONTENT.whatDrivesUs.pillars.map((p) => p.railLabel)).toEqual([
      'VISION',
      'MISSION',
      'GOAL',
    ]);
    expect(ABOUT_CONTENT.widerNetwork.team).toHaveLength(0);
  });

  it('builds valid Person JSON-LD for the founder', () => {
    const jsonLd = buildFounderPersonJsonLd();
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe('Ojedayo Richard Iseoluwa');
    expect(jsonLd.alternateName).toBe('Iséoluwa');
    expect(Array.isArray(jsonLd.sameAs)).toBe(true);
    expect(jsonLd.sameAs as string[]).toContain(SITE_CONTENT.founder.portfolioUrl);
  });

  it('builds a closed variable-width tapered SVG ribbon path for reduced-motion fallback', () => {
    const path = buildStaticTaperedRibbonSvgPath({
      width: 1200,
      height: 140,
      baseThickness: 20,
      amplitude: 22,
      frequency: 0.004,
      taper: true,
      pathPreset: 'wave',
      variant: 'default',
    });
    expect(path.startsWith('M ')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.length).toBeGreaterThan(100);
  });
});
