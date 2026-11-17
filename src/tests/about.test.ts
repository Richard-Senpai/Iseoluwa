import { describe, expect, it } from 'vitest';
import { SITE_CONTENT } from '@/content/site';
import { TEAM } from '@/content/team';
import { ABOUT_CONTENT } from '@/features/about/about.content';
import { HOME_CONTENT } from '@/features/home/home.content';
import { buildFounderPersonJsonLd, buildOrganizationJsonLd } from '@/lib/seo';
import { buildStaticTaperedRibbonSvgPath } from '@/components/motion/FlowingLine';

describe('About content, team data & structured data', () => {
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

  it('defines all four team members in order with exact bios, focus tags, and 4:5 portraits', () => {
    expect(TEAM).toHaveLength(4);
    expect(TEAM.map((m) => m.id)).toEqual(['iseoluwa', 'daniel', 'maleek', 'jessica']);
    expect(TEAM.map((m) => m.name)).toEqual([
      'Ojedayo Richard Iseoluwa',
      'Daniel Oshinaike',
      'Abdulmaleek Asimiyu',
      'Jessica Omotayo',
    ]);
    expect(TEAM.map((m) => m.displayName)).toEqual(['iséoluwa', 'Daniel', 'Maleek', 'Jessica']);
    expect(TEAM.map((m) => m.sectionLabel)).toEqual([
      'FOUNDER',
      'CO-FOUNDER',
      'DEVELOPER',
      'MARKETING',
    ]);
    for (const member of TEAM) {
      expect(member.portrait.aspect).toBe('4:5');
      expect(member.portrait.alt).toBe(
        `Portrait of ${member.name}, ${member.role} at Iséoluwa`,
      );
      expect(member.portrait.src).toMatch(/^\/media\/team\/.+-portrait\.webp$/);
      expect(member.portrait.blurDataURL).toMatch(/^data:image\/webp;base64,/);
    }
  });

  it('updates copy in About and Home for the multi-founder & team reality', () => {
    expect(ABOUT_CONTENT.seo.description).toBe(
      'Meet the studio that treats every project as work done with care. Learn our vision, mission, values, and the founders and team behind Iseoluwa.',
    );
    expect(ABOUT_CONTENT.whyUs.items[2]?.headline).toBe('Built by designers and engineers.');
    expect(HOME_CONTENT.whyIseoluwa.reasons[2]?.title).toBe('Built by designers and engineers.');
    expect(ABOUT_CONTENT.widerNetwork.body).toContain(
      'Every project is led by our founders and checked against the same standard.',
    );
  });

  it('builds Organization JSON-LD with two founders and two employees', () => {
    const orgJsonLd = buildOrganizationJsonLd();
    expect(orgJsonLd['@type']).toBe('Organization');
    const founders = orgJsonLd.founder as Array<Record<string, unknown>>;
    const employees = orgJsonLd.employee as Array<Record<string, unknown>>;
    expect(founders).toHaveLength(2);
    expect(founders.map((f) => f.name)).toEqual([
      'Ojedayo Richard Iseoluwa',
      'Daniel Oshinaike',
    ]);
    expect(employees).toHaveLength(2);
    expect(employees.map((e) => e.name)).toEqual(['Abdulmaleek Asimiyu', 'Jessica Omotayo']);

    const personJsonLd = buildFounderPersonJsonLd();
    expect(personJsonLd['@type']).toBe('Person');
    expect(personJsonLd.name).toBe('Ojedayo Richard Iseoluwa');
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
