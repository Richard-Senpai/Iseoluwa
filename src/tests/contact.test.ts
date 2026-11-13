import { describe, expect, it } from 'vitest';
import {
  contactRequestSchema,
  contactStep1Schema,
  contactStep2Schema,
  evaluateBudgetFit,
  getPackageDefaults,
} from '@/lib/schemas/contact';

describe('Contact form schemas & package prefill logic', () => {
  it('validates Step 1 fields and rejects invalid emails', () => {
    const valid = contactStep1Schema.safeParse({
      fullName: 'Adaeze Okafor',
      email: 'adaeze@example.com',
      company: 'Zuri Studio',
      role: 'Founder',
      country: 'Nigeria',
      phone: '+234 800 000 0000',
      preferredContact: 'email',
    });
    expect(valid.success).toBe(true);

    const invalid = contactStep1Schema.safeParse({
      fullName: 'A',
      email: 'not-an-email',
      company: '',
      role: '',
      country: '',
      phone: '',
      preferredContact: 'email',
    });
    expect(invalid.success).toBe(false);
  });

  it('requires at least 40 characters for projectDescription when packageInterest is custom or not-sure, and 20 otherwise', () => {
    const baseStep2 = {
      servicesNeeded: ['branding'] as const,
      mainGoal: 'launch-new' as const,
      existingMaterialsLinks: '',
      brandingNeeds: [],
      brandingStartingPoint: '' as const,
      websiteKind: '' as const,
      websiteFeatures: [],
      existingSiteUrl: '',
      marketingChannels: [],
      marketingAim: '' as const,
      existingMarketingLinks: '',
    };

    const shortCustom = contactStep2Schema.safeParse({
      ...baseStep2,
      packageInterest: 'custom',
      projectDescription: 'Too short for custom package.',
    });
    expect(shortCustom.success).toBe(false);

    const validCustom = contactStep2Schema.safeParse({
      ...baseStep2,
      packageInterest: 'custom',
      projectDescription:
        'We are launching a new fintech product across Lagos and London and need brand identity plus a fast marketing site.',
    });
    expect(validCustom.success).toBe(true);

    const validStandard = contactStep2Schema.safeParse({
      ...baseStep2,
      packageInterest: 'launch-starter',
      projectDescription: 'Need a clean starter site and brand.',
    });
    expect(validStandard.success).toBe(true);
  });

  it('prefills services and budget range from package slug via getPackageDefaults()', () => {
    const starter = getPackageDefaults('launch-starter');
    expect(starter.packageInterest).toBe('launch-starter');
    expect(starter.servicesNeeded).toEqual(['branding', 'website', 'marketing']);
    expect(starter.budgetRange).toBe('range-3');

    const custom = getPackageDefaults('custom');
    expect(custom.packageInterest).toBe('custom');
    expect(custom.servicesNeeded).toEqual([]);
    expect(custom.budgetRange).toBe('');
  });

  it('returns a gentle non-blocking budget-fit indicator when selected budget is below package minimum', () => {
    const belowFit = evaluateBudgetFit({
      packageInterest: 'launch-plus',
      budgetRange: 'range-2',
      budgetAdvise: false,
      servicesNeeded: ['branding', 'website', 'marketing'],
    });
    expect(belowFit.level).toBe('near');
    expect(belowFit.showGentleNote).toBe(true);

    const matchingFit = evaluateBudgetFit({
      packageInterest: 'launch-starter',
      budgetRange: 'range-3',
      budgetAdvise: false,
      servicesNeeded: ['branding', 'website', 'marketing'],
    });
    expect(matchingFit.level).toBe('above');
    expect(matchingFit.showGentleNote).toBe(false);
  });

  it('validates a complete 4-step contactRequestSchema payload', () => {
    const result = contactRequestSchema.safeParse({
      fullName: 'Tunde Bakare',
      email: 'tunde@company.co',
      company: 'Kora Logistics',
      role: 'CEO',
      country: 'United Kingdom',
      phone: '+44 7700 900077',
      preferredContact: 'whatsapp',
      packageInterest: 'launch-starter',
      servicesNeeded: ['branding', 'website', 'marketing'],
      projectDescription:
        'We are launching a logistics platform and need brand + web + launch kit.',
      mainGoal: 'launch-new',
      existingMaterialsLinks: '',
      brandingNeeds: [],
      brandingStartingPoint: '',
      websiteKind: '',
      websiteFeatures: [],
      existingSiteUrl: '',
      marketingChannels: [],
      marketingAim: '',
      existingMarketingLinks: '',
      currency: 'USD',
      budgetRange: 'range-3',
      budgetAdvise: false,
      startTimeline: 'within-month',
      deadlineDate: '2026-11-30',
      decisionMaker: 'just-me',
      heardAboutUs: 'search',
      consentAccepted: true,
      honeypot: '',
      startedAtMs: Date.now() - 5000,
      meta: {
        packageSlug: 'launch-starter',
        source: 'home-matcher',
      },
    });
    expect(result.success).toBe(true);
  });
});
