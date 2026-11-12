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

describe('Work data model & helpers', () => {
  it('defines three ordered categories: branding, websites, marketing', () => {
    expect(WORK_CATEGORIES.map((c) => c.slug)).toEqual(['branding', 'websites', 'marketing']);
  });

  it('defines four placeholder projects per category (12 total)', () => {
    expect(ALL_PROJECTS).toHaveLength(12);
    expect(getProjectsByCategory('branding')).toHaveLength(4);
    expect(getProjectsByCategory('websites')).toHaveLength(4);
    expect(getProjectsByCategory('marketing')).toHaveLength(4);
  });

  it('derives the 3 Home page featured projects from ALL_PROJECTS', () => {
    expect(PROJECTS_CONTENT).toHaveLength(3);
    expect(PROJECTS_CONTENT.every((p) => p.featuredOnHome)).toBe(true);
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

  it('returns undefined for unknown categories or project slugs', () => {
    expect(getCategoryBySlug('unknown')).toBeUndefined();
    expect(getProjectBySlug('branding', 'non-existent')).toBeUndefined();
  });
});
